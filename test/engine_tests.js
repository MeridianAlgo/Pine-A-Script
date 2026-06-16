// Numeric correctness tests for the bar-by-bar execution engine.
//
// Unlike the other suites (which only check that transpilation *succeeds* and the
// output *contains* expected strings), these tests actually RUN the generated
// code over known OHLCV data and assert the full per-bar output series equals
// hand-computed expected values. This is the test that proves PineScript
// semantics are implemented correctly, not just that code was produced.

import { transpile } from '../src/transpiler.js';

let passed = 0;
let failed = 0;

// Transpile Pine source, import the generated module, and run it bar-by-bar.
async function runPine(pine, data) {
  const result = transpile(pine.trim());
  if (!result.success) throw new Error(`Transpile failed: ${result.error}`);
  const url = 'data:text/javascript,' + encodeURIComponent(result.code);
  const mod = await import(url);
  if (typeof mod.run !== 'function') throw new Error('generated module has no run() export');
  return mod.run(data);
}

// Compare two series of numbers/null with a small tolerance for floats.
function seriesEqual(actual, expected, tol = 1e-9) {
  if (!Array.isArray(actual) || actual.length !== expected.length) return false;
  for (let i = 0; i < expected.length; i++) {
    const a = actual[i];
    const e = expected[i];
    if (e === null || e === undefined) {
      if (a !== null && a !== undefined && !(typeof a === 'number' && Number.isNaN(a))) return false;
    } else if (typeof e === 'boolean') {
      if (Boolean(a) !== e) return false;
    } else {
      if (a === null || a === undefined || Math.abs(a - e) > tol) return false;
    }
  }
  return true;
}

const fmt = (s) => s.map((x) => (x == null ? 'na' : typeof x === 'number' ? Math.round(x * 1000) / 1000 : x)).join(' ');

async function test(name, fn) {
  try {
    await fn();
    console.log(`PASS: ${name}`);
    passed++;
  } catch (e) {
    console.log(`FAIL: ${name}`);
    console.log(`  ${e.message}`);
    failed++;
  }
}

function assertSeries(actual, expected, label) {
  if (!seriesEqual(actual, expected)) {
    throw new Error(`${label}\n    expected: ${fmt(expected)}\n    actual:   ${fmt(actual)}`);
  }
}

// Shared dataset: a simple ramp so expected values are easy to verify by hand.
const ramp = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const rampData = { close: ramp, open: ramp, high: ramp, low: ramp, volume: ramp.map(() => 1) };

console.log('Running Bar-by-Bar Engine Numeric Tests\n');
console.log('='.repeat(60));

await test('ta.sma produces a full per-bar series', async () => {
  const rt = await runPine(
    `//@version=5
indicator("t")
plot(ta.sma(close, 3), "s")`,
    rampData,
  );
  // SMA(3) of 1..10: first two bars are na, then mean of the trailing 3.
  assertSeries(rt.plots['s'].data, [null, null, 2, 3, 4, 5, 6, 7, 8, 9], 'SMA(3) mismatch');
});

await test('x[1] historical lookback returns the previous bar', async () => {
  const rt = await runPine(
    `//@version=5
indicator("t")
plot(close[1], "p")`,
    rampData,
  );
  assertSeries(rt.plots['p'].data, [null, 1, 2, 3, 4, 5, 6, 7, 8, 9], 'close[1] mismatch');
});

await test('ta.change returns bar-over-bar difference', async () => {
  const rt = await runPine(
    `//@version=5
indicator("t")
plot(ta.change(close), "c")`,
    rampData,
  );
  assertSeries(rt.plots['c'].data, [null, 1, 1, 1, 1, 1, 1, 1, 1, 1], 'change mismatch');
});

await test('ta.highest tracks the rolling window max', async () => {
  const rt = await runPine(
    `//@version=5
indicator("t")
plot(ta.highest(high, 3), "h")`,
    rampData,
  );
  assertSeries(rt.plots['h'].data, [null, null, 3, 4, 5, 6, 7, 8, 9, 10], 'highest mismatch');
});

await test('var state accumulates across bars', async () => {
  const rt = await runPine(
    `//@version=5
indicator("t")
var float total = 0.0
total := total + close
plot(total, "t")`,
    rampData,
  );
  // Running cumulative sum of 1..10.
  assertSeries(rt.plots['t'].data, [1, 3, 6, 10, 15, 21, 28, 36, 45, 55], 'var accumulation mismatch');
});

await test('ta.crossover fires on the exact bar of the cross', async () => {
  // fast SMA(2) crosses above slow SMA(4) once the series turns up.
  const wave = [5, 4, 3, 2, 3, 4, 5, 6, 7, 8];
  const rt = await runPine(
    `//@version=5
indicator("t")
fast = ta.sma(close, 2)
slow = ta.sma(close, 4)
plotshape(ta.crossover(fast, slow), "x")`,
    { close: wave, open: wave, high: wave, low: wave, volume: wave.map(() => 1) },
  );
  const fired = rt.plotshapes['x'].data.map((v, i) => (v ? i : null)).filter((v) => v != null);
  // Compute the expected cross bar directly from SMA definitions.
  const sma = (a, len, i) => (i + 1 < len ? null : a.slice(i - len + 1, i + 1).reduce((x, y) => x + y, 0) / len);
  const expected = [];
  for (let i = 1; i < wave.length; i++) {
    const f0 = sma(wave, 2, i - 1), s0 = sma(wave, 4, i - 1);
    const f1 = sma(wave, 2, i), s1 = sma(wave, 4, i);
    if (f0 != null && s0 != null && f0 < s0 && f1 >= s1) expected.push(i);
  }
  if (JSON.stringify(fired) !== JSON.stringify(expected)) {
    throw new Error(`crossover bars mismatch: expected ${JSON.stringify(expected)}, got ${JSON.stringify(fired)}`);
  }
  if (expected.length === 0) throw new Error('test data never crosses -- test is meaningless');
});

await test('bar_index counts bars from zero', async () => {
  const rt = await runPine(
    `//@version=5
indicator("t")
plot(bar_index, "bi")`,
    rampData,
  );
  assertSeries(rt.plots['bi'].data, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], 'bar_index mismatch');
});

await test('ta.ema matches a reference exponential moving average', async () => {
  const rt = await runPine(
    `//@version=5
indicator("t")
plot(ta.ema(close, 3), "e")`,
    rampData,
  );
  // Reference EMA seeded with the first value, alpha = 2/(len+1), over all bars.
  const alpha = 2 / (3 + 1);
  const expected = [];
  let prev = ramp[0];
  for (let i = 0; i < ramp.length; i++) {
    prev = i === 0 ? ramp[0] : alpha * ramp[i] + (1 - alpha) * prev;
    expected.push(prev);
  }
  assertSeries(rt.plots['e'].data, expected, 'ema mismatch');
});

console.log('='.repeat(60));
console.log(`Results: ${passed} passed, ${failed} failed out of ${passed + failed} tests`);
if (failed > 0) process.exit(1);
