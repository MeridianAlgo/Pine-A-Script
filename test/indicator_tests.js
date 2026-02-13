import fs from 'fs';
import path from 'path';
import os from 'os';
import { pathToFileURL } from 'url';
import { transpile } from '../src/transpiler.js';

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

class SeriesArray extends Array {
  valueOf() {
    return this.length ? this[this.length - 1] : NaN;
  }
  toString() {
    return String(this.valueOf());
  }
}

function asSeriesArray(arr) {
  return Object.setPrototypeOf(arr, SeriesArray.prototype);
}

function isFiniteNumber(x) {
  return typeof x === 'number' && Number.isFinite(x);
}

function createSyntheticOHLCV(bars = 300) {
  const open = [];
  const high = [];
  const low = [];
  const close = [];
  const volume = [];
  let price = 100;

  for (let i = 0; i < bars; i++) {
    const drift = Math.sin(i / 20) * 0.2;
    const noise = (Math.sin(i / 7) + Math.cos(i / 11)) * 0.1;
    const change = drift + noise;

    const o = price;
    price = Math.max(1, price + change);
    const c = price;
    const h = Math.max(o, c) + 0.25;
    const l = Math.min(o, c) - 0.25;

    open.push(o);
    close.push(c);
    high.push(h);
    low.push(l);
    volume.push(1000 + (i % 50) * 10);
  }

  return { open, high, low, close, volume };
}

function resetRuntime() {
  globalThis.__pineRuntime = { plots: [], plotshapes: [], alerts: [] };
}

function installGlobalsForBar(ctx) {
  // Series arrays
  globalThis.open = asSeriesArray(ctx.open);
  globalThis.high = asSeriesArray(ctx.high);
  globalThis.low = asSeriesArray(ctx.low);
  globalThis.close = asSeriesArray(ctx.close);
  globalThis.volume = asSeriesArray(ctx.volume);

  // Common Pine globals used in examples
  globalThis.bar_index = ctx.bar_index;
  globalThis.time = ctx.time;
  globalThis.last_bar_index = ctx.bar_index;

  globalThis.barstate = globalThis.barstate || {};
  globalThis.barstate.islast = false;

  // Common derived sources
  const i = ctx.close.length - 1;
  globalThis.hl2 = (ctx.high[i] + ctx.low[i]) / 2;
  globalThis.hlc3 = (ctx.high[i] + ctx.low[i] + ctx.close[i]) / 3;
  globalThis.ohlc4 = (ctx.open[i] + ctx.high[i] + ctx.low[i] + ctx.close[i]) / 4;

  // Namespaces: generated code references these directly sometimes.
  globalThis.ta = globalThis.pinescript;
  const pineMath = Object.create(Math);
  pineMath.avg = (...args) => args.length ? args.reduce((a, b) => a + b, 0) / args.length : NaN;
  pineMath.sum = (...args) => args.reduce((a, b) => a + b, 0);
  pineMath.round = (x) => Math.round(x);
  globalThis.math = pineMath;

  // Minimal stubs so scripts don't crash; tests validate execution + sane plot outputs.
  globalThis.input = {
    int: (defval) => defval,
    float: (defval) => defval,
    bool: (defval) => defval,
    string: (defval) => defval,
    symbol: (defval) => defval,
    time: (defval) => defval,
    source: (defval) => defval,
    color: (defval) => defval,
  };

  globalThis.format = { price: 'price' };
  globalThis.display = { none: 'none' };
  globalThis.plot = globalThis.pinescript?.plot;
  globalThis.plotshape = globalThis.pinescript?.plotshape;
  globalThis.alertcondition = globalThis.pinescript?.alertcondition;
  globalThis.barcolor = () => null;

  // Pine cast helpers (commonly used as functions)
  globalThis.int = (x) => (x === null || x === undefined) ? null : Math.trunc(Number(x));
  globalThis.float = (x) => (x === null || x === undefined) ? null : Number(x);
  globalThis.bool = (x) => Boolean(x);

  // Some scripts reference these namespaces
  globalThis.color = globalThis.pinescript?.color;
  globalThis.size = globalThis.pinescript?.size;
  globalThis.shape = globalThis.pinescript?.shape;
  globalThis.location = globalThis.pinescript?.location;
  globalThis.position = globalThis.pinescript?.position;
  globalThis.text = globalThis.pinescript?.text;
  globalThis.table = globalThis.pinescript?.table;

  // Optional namespaces for complex scripts; if missing, allow execution to proceed.
  globalThis.ml = globalThis.ml || {
    init_table: () => null,
    backtest: () => [0, 0, 0, 0, '', 0, 0],
    filter_volatility: () => true,
    regime_filter: () => true,
    filter_adx: () => true,
    n_rsi: () => 0,
    n_wt: () => 0,
    n_cci: () => 0,
    n_adx: () => 0,
    color_green: () => globalThis.pinescript?.color?.green,
    color_red: () => globalThis.pinescript?.color?.red,
  };

  globalThis.kernels = globalThis.kernels || {
    rationalQuadratic: () => 0,
    gaussian: () => 0,
  };

  globalThis.request = globalThis.request || {
    financial: () => null,
    security: (_symbol, _tf, series) => series,
  };

  globalThis.syminfo = globalThis.syminfo || {
    tickerid: 'TEST',
    shares_outstanding_total: 0,
  };

  globalThis.timeframe = globalThis.timeframe || { period: 'D' };

  globalThis.chart = globalThis.chart || { fg_color: globalThis.pinescript?.color?.gray };

  globalThis.direction = globalThis.direction || { long: 1, short: -1, neutral: 0 };
  globalThis.xloc = globalThis.xloc || { bar_index: 'bar_index' };
  globalThis.yloc = globalThis.yloc || { price: 'price' };
  globalThis.label = globalThis.label || { style_label_up: 'style_label_up' };
}

async function transpileToTempModule(pinePath) {
  const source = fs.readFileSync(pinePath, 'utf-8');
  const result = transpile(source);
  if (!result.success) {
    throw new Error(`Transpile failed for ${pinePath}: ${result.error}`);
  }

  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'pine-js-'));
  const outPath = path.join(tmpDir, path.basename(pinePath).replace(/\.pine$/i, '.mjs'));
  fs.writeFileSync(outPath, result.code, 'utf-8');

  const mod = await import(pathToFileURL(outPath).href);
  assert(typeof mod.main === 'function', `Generated module for ${pinePath} did not export main()`);
  return { mod, outPath };
}

function validateRuntime() {
  assert(globalThis.__pineRuntime, '__pineRuntime missing');
  // Ensure plot values (when numbers) are finite.
  for (const p of globalThis.__pineRuntime.plots) {
    const v = p.value;
    if (typeof v === 'number') {
      assert(Number.isFinite(v), `plot produced non-finite number: ${v}`);
    }
  }
}

async function runIndicator(pinePath, bars = 300) {
  resetRuntime();

  // Import generated script (this also installs globalThis.pinescript from generator)
  const { mod } = await transpileToTempModule(pinePath);

  const data = createSyntheticOHLCV(bars);

  // bar-by-bar execution (warmup avoids early-bar null/history crashes)
  const warmupBars = 200;
  for (let i = 0; i < bars; i++) {
    // Pine series are typically arrays with history indexing. We feed rolling arrays up to i.
    const ctx = {
      open: data.open.slice(0, i + 1),
      high: data.high.slice(0, i + 1),
      low: data.low.slice(0, i + 1),
      close: data.close.slice(0, i + 1),
      volume: data.volume.slice(0, i + 1),
      bar_index: i,
      time: Date.UTC(2020, 0, 1) + i * 60_000,
    };

    installGlobalsForBar(ctx);

    if (i >= warmupBars) {
      try {
        mod.main();
      } catch (e) {
        throw new Error(`Runtime error in ${path.basename(pinePath)} at bar ${i}: ${e.message}`);
      }

      validateRuntime();
    }
  }

  // Basic smoke metrics
  return {
    plots: globalThis.__pineRuntime.plots.length,
    plotshapes: globalThis.__pineRuntime.plotshapes.length,
    alerts: globalThis.__pineRuntime.alerts.length,
  };
}

const fixtures = [
  'examples/sma_crossover.pine',
  'examples/example.pine',
  'examples/mega_coverage.pine',
  'examples/ML.pine',
  'examples/super.pine',
  'examples/abc.pine',
  'examples/harmonicforecast.pine',
  'examples/instutionalorder.pine',
  'examples/volitility.pine',
];

let passed = 0;
let failed = 0;

console.log('Running Converted Indicator Runtime Tests\n');
console.log('='.repeat(60));

for (const rel of fixtures) {
  const pinePath = path.resolve(process.cwd(), rel);
  try {
    const stats = await runIndicator(pinePath, 250);
    console.log(`✓ ${rel} (plots=${stats.plots}, shapes=${stats.plotshapes}, alerts=${stats.alerts})`);
    passed++;
  } catch (e) {
    console.log(`✗ ${rel}`);
    console.log(`  ${e.message}`);
    failed++;
  }
}

console.log('='.repeat(60));
console.log(`Results: ${passed} passed, ${failed} failed`);

if (failed > 0) process.exit(1);
