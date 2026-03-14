// Indicator test suite -- inline PineScript test cases that transpile and pass review.
// Each test defines PineScript source, transpiles it, verifies success, and runs the reviewer.

import { transpile } from '../src/transpiler.js';
import { reviewGeneratedCode } from '../src/reviewer.js';

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

// -- Test case definitions --

const testCases = [
  {
    name: 'SMA crossover indicator',
    pine: `
//@version=5
indicator("SMA Crossover", overlay=true)
fastLen = input.int(10, "Fast Length")
slowLen = input.int(20, "Slow Length")
fastSMA = ta.sma(close, fastLen)
slowSMA = ta.sma(close, slowLen)
bullish = ta.crossover(fastSMA, slowSMA)
bearish = ta.crossunder(fastSMA, slowSMA)
plot(fastSMA, "Fast SMA", color=color.blue)
plot(slowSMA, "Slow SMA", color=color.red)
plotshape(bullish, style=shape.triangleup, location=location.belowbar, color=color.green)
plotshape(bearish, style=shape.triangledown, location=location.abovebar, color=color.red)
`
  },
  {
    name: 'RSI with overbought/oversold levels',
    pine: `
//@version=5
indicator("RSI Levels", overlay=false)
length = input.int(14, "RSI Length")
overbought = input.float(70.0, "Overbought")
oversold = input.float(30.0, "Oversold")
rsiVal = ta.rsi(close, length)
plot(rsiVal, "RSI", color=color.purple)
hline(overbought, "Overbought", color=color.red)
hline(oversold, "Oversold", color=color.green)
alertcondition(rsiVal > overbought, "Overbought Alert", "RSI is overbought")
alertcondition(rsiVal < oversold, "Oversold Alert", "RSI is oversold")
`
  },
  {
    name: 'Bollinger Bands',
    pine: `
//@version=5
indicator("Bollinger Bands", overlay=true)
length = input.int(20, "Length")
mult = input.float(2.0, "Multiplier")
basis = ta.sma(close, length)
dev = mult * ta.stdev(close, length)
upper = basis + dev
lower = basis - dev
plot(basis, "Basis", color=color.blue)
plot(upper, "Upper", color=color.red)
plot(lower, "Lower", color=color.green)
`
  },
  {
    name: 'MACD histogram',
    pine: `
//@version=5
indicator("MACD", overlay=false)
fastLen = input.int(12, "Fast Length")
slowLen = input.int(26, "Slow Length")
sigLen = input.int(9, "Signal Length")
[macdLine, signalLine, histLine] = ta.macd(close, fastLen, slowLen, sigLen)
plot(macdLine, "MACD", color=color.blue)
plot(signalLine, "Signal", color=color.orange)
plot(histLine, "Histogram", color=color.gray, style=plot.style_histogram)
`
  },
  {
    name: 'Multi-timeframe RSI',
    pine: `
//@version=5
indicator("MTF RSI", overlay=false)
rsiLen = input.int(14, "RSI Length")
rsiCurrent = ta.rsi(close, rsiLen)
rsiHTF = request.security(syminfo.tickerid, "60", ta.rsi(close, rsiLen))
plot(rsiCurrent, "Current TF RSI", color=color.blue)
plot(rsiHTF, "Higher TF RSI", color=color.red)
hline(50, "Midline")
`
  },
  {
    name: 'Simple strategy with entry and exit',
    pine: `
//@version=5
strategy("Simple MA Strategy", overlay=true)
maLen = input.int(20, "MA Length")
maVal = ta.sma(close, maLen)
longCondition = ta.crossover(close, maVal)
shortCondition = ta.crossunder(close, maVal)
if longCondition
    strategy.entry("Long", strategy.long)
if shortCondition
    strategy.close("Long")
plot(maVal, "MA", color=color.blue)
`
  },
  {
    name: 'Custom type declaration',
    pine: `
//@version=5
indicator("Custom Type Test")
type PriceLevel
    float price = 0.0
    string label_text = ""
    bool is_broken = false

level = PriceLevel.new(price=close, label_text="Support", is_broken=false)
plot(level.price, "Level Price")
`
  },
  {
    name: 'Array operations',
    pine: `
//@version=5
indicator("Array Ops")
var prices = array.new_float(0)
array.push(prices, close)
if array.size(prices) > 20
    array.shift(prices)
avgPrice = array.avg(prices)
maxPrice = array.max(prices)
minPrice = array.min(prices)
plot(avgPrice, "Avg")
plot(maxPrice, "Max")
plot(minPrice, "Min")
`
  },
  {
    name: 'String formatting',
    pine: `
//@version=5
indicator("String Format Test", overlay=true)
rsiVal = ta.rsi(close, 14)
rsiStr = str.tostring(rsiVal)
labelText = str.format("RSI: {0}", rsiStr)
if barstate.islast
    label.new(bar_index, high, labelText)
`
  }
];

// -- Test runner --

let passed = 0;
let failed = 0;

console.log('Running Inline Indicator Transpile + Review Tests\n');
console.log('='.repeat(60));

for (const tc of testCases) {
  try {
    // Step 1: Transpile the PineScript source
    const result = transpile(tc.pine.trim());
    assert(result.success, `Transpilation failed: ${result.error}`);
    assert(typeof result.code === 'string' && result.code.length > 0, 'Transpilation produced empty output');

    // Step 2: Run the reviewer on the generated code
    const report = await reviewGeneratedCode(result.code, { ai: false });
    assert(report.ok, `Reviewer flagged errors: ${report.errors.join('; ')}`);

    const warningNote = report.warnings.length > 0
      ? ` (${report.warnings.length} warning(s))`
      : '';
    console.log(`PASS: ${tc.name}${warningNote}`);
    passed++;
  } catch (e) {
    console.log(`FAIL: ${tc.name}`);
    console.log(`  ${e.message}`);
    failed++;
  }
}

console.log('='.repeat(60));
console.log(`Results: ${passed} passed, ${failed} failed out of ${testCases.length} tests`);

if (failed > 0) process.exit(1);
