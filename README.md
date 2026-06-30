# PineScript to JavaScript Compiler

A production-grade transpiler that converts TradingView PineScript (v5/v6) into clean, runnable JavaScript. Built for developers who need to take their Pine indicators, strategies, and analysis tools and run them outside of TradingView -- in Node.js, in a browser, or anywhere JavaScript runs.

This is not a toy converter. It handles real-world PineScript with 240+ function mappings, full series semantics, state persistence across bars, multi-timeframe support, and a post-conversion reviewer that catches problems before they hit you at runtime.

## Try It Online

Paste your PineScript and convert it right in your browser — nothing is uploaded, the transpiler runs client-side:

**https://meridianalgo.github.io/Pine-A-Script/**

(Published automatically from `web/index.html` by the GitHub Pages workflow. Enable it once under repo Settings → Pages → Source: GitHub Actions.)

## What It Does

- Converts PineScript v5/v6 into standard JavaScript (ESM modules)
- Ships with a complete runtime that implements 100+ PineScript built-in functions
- Handles series semantics properly -- history indexing, current-bar arithmetic, the whole thing
- Persists `var` / `varip` state across bar executions, just like TradingView does
- Supports multi-timeframe data via `request.security()` with timeframe resampling
- Runs a multi-stage post-conversion reviewer that catches syntax errors, missing functions, and conversion artifacts

## Project Layout

```
src/
  lexer.js        Breaks PineScript source into tokens
  parser.js       Builds an abstract syntax tree from those tokens
  generator.js    Turns the AST into JavaScript with all runtime scaffolding
  builtins.js     JavaScript implementations of every PineScript built-in function
  transpiler.js   Main entry point that ties lexer, parser, and generator together
  cli.js          Command-line interface for converting files
  reviewer.js     Post-conversion quality checks and validation

web/              Browser-based converter demo (deployed to GitHub Pages)
test/             Test suite including bar-by-bar runtime smoke tests
tools/            Batch conversion utilities and status tracking
examples/         Sample PineScript files for testing
converted/        Output directory for batch conversions
```

## Getting Started

### Install dependencies

```bash
npm install
```

### Convert a single script

```bash
node src/cli.js path/to/script.pine path/to/output.js
```

The CLI will transpile your script and automatically run the reviewer to check for problems. You will see a review result with a confidence score telling you how clean the conversion was.

### Batch convert everything

Drop your `.pine` files into the `examples/` directory, then:

```bash
npm run convert:all
```

This converts every file, writes the JavaScript output to `converted/`, logs errors for any failures, and generates a status report at `converted/status.json`.

### Check conversion status

```bash
npm run convert:status
```

Shows a summary table of all conversions and their current status.

## Post-Conversion Reviewer

The reviewer runs automatically after every conversion and performs several checks to make sure the output is actually usable.

### What it checks

- **Syntax validation**: Parses the generated JavaScript to catch syntax errors before you try to run it
- **Import smoke test**: Attempts to dynamically import the generated module to catch obvious runtime failures
- **Built-in verification**: Scans for `pinescript.*` function calls and verifies they all exist in the runtime
- **Completeness analysis**: Looks for raw PineScript syntax that may have leaked through unconverted
- **Series safety**: Flags patterns where series arrays might be accessed unsafely
- **Confidence scoring**: Gives you a 0-100 score based on how clean the conversion looks

### Controlling the reviewer

Disable the reviewer entirely if you just want raw output:

```bash
node src/cli.js script.pine output.js --no-review
```

Disable only the runtime import test (useful if the script has external dependencies):

```bash
node src/cli.js script.pine output.js --no-review-import
```

Environment variables for fine-grained control:

| Variable | Effect |
|----------|--------|
| `PINE_REVIEW=0` | Disables the reviewer completely |
| `PINE_REVIEW_IMPORT=0` | Skips the import smoke test |

## Supported PineScript Features

### Language Constructs

| Feature | Notes |
|---------|-------|
| `var` / `varip` declarations | State persists across bars via a runtime state object |
| Typed declarations (`float x`, `int y`) | Generates `let` with proper scoping |
| Generic types (`array<float>`, `matrix<float>`) | Parses type annotations correctly |
| Type blocks (`type MyType`) | Generates lightweight JavaScript object factories |
| Function declarations | Supports typed parameters, default values, and implicit returns |
| Arrow functions (`=>`) | Works just like you would expect |
| `if` / `else` statements | Full boolean expression support |
| `for i = 0 to n by step` | Transpiles to standard JavaScript for-loops |
| `for x in array` | Transpiles to JavaScript for-of loops |
| `while` loops | Full expression conditions |
| `switch` statements | Generates chained ternaries or if/else chains depending on form |
| Ternary operators | Full expression support |
| Destructuring (`[a, b] = tuple`) | Supports both `=` and `:=` forms |
| Multi-declarations | Comma-separated declarations on one line |
| Semicolons as separators | Handles `{ a; b; c }` style blocks |
| Import statements | Parsed and recognized, but not emitted (library imports are stubbed) |

### Built-in Functions and Namespaces

#### Technical Analysis (ta)

| Function | Notes |
|----------|-------|
| `ta.sma`, `ta.ema`, `ta.wma`, `ta.rma`, `ta.hma`, `ta.vwma`, `ta.alma`, `ta.swma` | All standard moving averages |
| `ta.atr`, `ta.tr` | Average True Range with `ta.tr(true)` signature |
| `ta.rsi`, `ta.stoch`, `ta.cci`, `ta.mfi` | Momentum oscillators |
| `ta.macd` | Returns object with macd, signal, and histogram |
| `ta.bb`, `ta.kc` | Bollinger Bands and Keltner Channels |
| `ta.supertrend` | Returns [value, direction] tuple |
| `ta.dmi`, `ta.adx` | Directional Movement Index |
| `ta.crossover`, `ta.crossunder` | Properly separated (not the same function) |
| `ta.pivothigh`, `ta.pivotlow` | Pivot detection |
| `ta.highest`, `ta.lowest`, `ta.highestbars`, `ta.lowestbars` | Windowed extremes |
| `ta.change`, `ta.roc`, `ta.percentrank` | Rate of change and ranking |
| `ta.valuewhen`, `ta.barssince` | Conditional series lookback |
| `ta.rising`, `ta.falling` | Trend detection |
| `ta.median` | Median value over a window |
| `ta.linreg`, `ta.correlation`, `ta.variance`, `ta.stdev` | Statistical functions |
| `ta.cum` | Cumulative sum |
| `ta.obv`, `ta.ad`, `ta.adosc`, `ta.cmf`, `ta.vwap` | Volume-based indicators |

#### Math

| Function | Notes |
|----------|-------|
| `math.abs`, `math.max`, `math.min`, `math.round` | Standard operations |
| `math.sqrt`, `math.pow`, `math.log`, `math.log10`, `math.exp` | Exponential and logarithmic |
| `math.sin`, `math.cos`, `math.tan`, `math.asin`, `math.acos`, `math.atan` | Trigonometry |
| `math.floor`, `math.ceil`, `math.sign` | Rounding and sign |
| `math.avg`, `math.sum` | Aggregation |
| `math.random` | Random number generation |
| `math.todegrees`, `math.toradians` | Angle conversion |
| `math.pi`, `math.e` | Constants |

#### Arrays

| Function | Notes |
|----------|-------|
| `array.new_float`, `array.new_int`, `array.new_bool`, `array.new_string` | Typed array creation |
| `array.new_label`, `array.new_line`, `array.new_box`, `array.new_polyline` | Drawing object arrays |
| `array.from` | Create from variadic arguments |
| `array.size`, `array.get`, `array.set` | Core access |
| `array.push`, `array.pop`, `array.unshift`, `array.shift` | Stack/queue operations |
| `array.insert`, `array.remove`, `array.clear`, `array.fill` | Modification |
| `array.sort`, `array.reverse`, `array.slice` | Transformation |
| `array.contains`, `array.indexof`, `array.lastindexof` | Search |
| `array.sum`, `array.avg`, `array.min`, `array.max` | Aggregation |
| `array.stdev`, `array.variance`, `array.covariance` | Statistics |

#### Strings

| Function | Notes |
|----------|-------|
| `str.tostring`, `str.tonumber` | Type conversion |
| `str.concat`, `str.substring`, `str.len` | Basic operations |
| `str.contains`, `str.startswith`, `str.endswith` | Pattern matching |
| `str.replace`, `str.replaceall`, `str.lower`, `str.upper` | Transformations |
| `str.split`, `str.match`, `str.format` | Parsing and formatting |
| `str.pos`, `str.rpos`, `str.remove`, `str.reverse` | Position and manipulation |

#### Colors

| Function | Notes |
|----------|-------|
| `color.rgb`, `color.new`, `color.from_gradient` | Color construction |
| `color.hex`, `color.r`, `color.g`, `color.b`, `color.t` | Color decomposition |
| Named colors (`color.red`, `color.green`, etc.) | Standard color constants |

#### Input

| Function | Notes |
|----------|-------|
| `input.int`, `input.float`, `input.bool`, `input.string` | Typed input parameters |
| `input.source`, `input.color`, `input.time`, `input.timeframe` | Special input types |

#### Tables

| Function | Notes |
|----------|-------|
| `table.new`, `table.cell`, `table.merge_cells` | Table construction |
| `table.cell_set_text`, `table.cell_set_bgcolor` | Cell manipulation |
| `table.delete`, `table.clear` | Cleanup |

#### Drawing

| Function | Notes |
|----------|-------|
| `line.new`, `line.delete`, `line.set_xy1`, `line.set_xy2` | Line primitives |
| `line.getx`, `line.gety` | Line queries |
| `label.new`, `label.delete`, `label.set_text`, `label.get_text` | Label primitives |
| `box.new`, `box.delete` | Box primitives |
| `polyline.new`, `polyline.delete` | Polyline primitives |

#### Multi-Timeframe

| Function | Notes |
|----------|-------|
| `request.security(symbol, tf, series, opts)` | Resamples using time array alignment |
| `request.financial(...)` | Returns null (stub) |
| `barmerge.gaps_off/on`, `barmerge.lookahead_off/on` | Merge behavior constants |

#### Plotting and Output

| Function | Notes |
|----------|-------|
| `plot`, `plotshape`, `plotbar`, `plotcandle` | Chart output |
| `bgcolor`, `hline`, `fill` | Visual elements |
| `alertcondition`, `alert` | Alert registration |

#### Strategy (stubs)

| Function | Notes |
|----------|-------|
| `strategy.entry`, `strategy.close`, `strategy.exit`, `strategy.order` | Logged but not backtested |
| `strategy.long`, `strategy.short` | Direction constants |

### How the Execution Engine Works

This is the heart of correct PineScript behavior. PineScript does **not** run a script once over a whole dataset -- it runs the entire script **once per bar**, building up time series as it goes. On bar `i`, `close` is that bar's close, `close[1]` is the previous bar, `ta.sma(close, 20)` is the moving average *at bar i*, and a variable like `fast = ta.sma(close, 20)` is itself a series whose history (`fast[1]`) is available on later bars.

The generated code reproduces this exactly:

- Every converted file exports a **`run(data)`** function. It loops over the bars, growing the OHLCV series one bar at a time, and calls the script body (`main()`) for each bar.
- **Series, not scalars.** Because the body runs per bar, window built-ins (`ta.sma`, `ta.highest`, ...) compute the correct value *at each bar*, and plotting a value collects a full output series -- one value per bar -- instead of a single final number.
- **History indexing**: `x[n]` is compiled to `pinescript.hist(id, x, n)`. The runtime records the current-bar value of `x` at a unique call-site `id` and reads back `n` bars, so lookback works even when `x` is computed on the current bar.
- **Crossover / change / lookback**: functions like `ta.crossover`, `ta.change`, `ta.rising`, `ta.barssince` have their series arguments wrapped in `pinescript.series(id, expr)`, which accumulates per-bar history. This is what makes them actually fire on the right bar rather than always returning `false`.
- **Current-bar arithmetic**: `close + open` uses each bar's value. OHLCV are `SeriesArray` objects whose `valueOf()` returns the current bar, so plain arithmetic works.
- **Null safety**: `na(x)` checks for null/undefined/NaN; `nz(x, default)` replaces bad values, just like Pine.

#### Running converted output

```javascript
import { run } from './converted/my_indicator.js';

// data is an object of equal-length OHLCV arrays
const result = run({
  open, high, low, close, volume, time,
});

// result.plots and result.plotshapes are named series, one value per bar
console.log(result.plots['Fast MA'].data);   // [na, na, 2, 3, 4, ...]
```

### How State Persistence Works

Variables declared with `var` or `varip` keep their values across bars. Because `run()` calls `main()` once per bar without resetting state between bars, accumulation works naturally:

```javascript
// What the transpiler generates for: var float total = 0.0
if (state.total === undefined) state.total = 0.0;
// Reads become: state.total
// Writes become: state.total = newValue;
```

The `state` object lives in `globalThis.__pineState` and is reset once at the start of each `run()` call, so repeated runs are independent.

### How Multi-Timeframe Works

`request.security()` implements timeframe resampling:

1. Parses timeframe strings like `"60"`, `"1H"`, `"D"`, `"W"`, `"M"` into milliseconds
2. Buckets the `time[]` array into periods based on the target timeframe
3. Aligns the data series to the base timeframe with optional lookahead and gap handling

**Current limitations** (contributions welcome):
- No session calendar handling
- No partial/incomplete bar alignment
- No full barmerge repainting rules beyond the basic constants

## Known Gaps

These PineScript features are not yet fully implemented. The transpiler will handle scripts that use them, but the runtime behavior may not match TradingView exactly.

### Not yet implemented
- **Function-scope hoisting**: PineScript variables are function-scoped, but the generator currently declares them with `let` at first use. A variable first assigned inside an `if`/`for` block and read outside it can become a JS block-scope error. This is the top priority for the next release.
- **`if`/`switch` as a function's return value**: when the last statement of a user function is an `if`/`else` (or `switch`), its value isn't returned yet -- such helpers currently return `undefined`.
- **Strategy backtesting**: Entry/exit functions log actions but do not simulate trades or generate equity curves
- **Unimplemented stdlib degrades gracefully**: unmapped namespaces (e.g. `matrix.*`, `chart.*`, exotic `request.*`) resolve to safe no-ops that return `null` rather than crashing, so scripts run end-to-end. The reviewer reports which builtins are missing.
- **Pine v6 maps**: `map.new`, `map.get`, `map.set` have basic Map-backed implementations but are not battle-tested
- **User-defined type methods**: `type Foo` with `method` blocks has limited support
- **Library imports**: `import` statements are parsed but the imported functions are not resolved
- **Session calendars**: `timeframe.session` and session-based resampling
- **Drawings**: `line`/`box`/`label`/`polyline`/`linefill` objects are created but not rendered or fully updated
- **Plot/CSV export**: `run()` returns plot series in memory; there is no file export helper yet

### Verified working

The bar-by-bar engine is covered by a numeric test suite (`npm run test:engine`) that runs generated code over known data and asserts the full output series against hand-computed values: `ta.sma`, `ta.ema`, `ta.change`, `ta.highest`, `x[1]` lookback, `var` accumulation, `bar_index`, and `ta.crossover` firing on the exact bar.

## CLI Reference

```
Usage: node src/cli.js [options] <input-file> [output-file]

Options:
  -h, --help          Show help
  -v, --verbose       Detailed output with file stats and timing
  -s, --source        Include source code in output
  --no-comments       Strip comments from generated code
  --ast               Output the AST instead of JavaScript
  --tokens            Output the token stream instead of JavaScript
  --no-review         Skip post-conversion review
  --no-review-import  Skip the runtime import test only
```

### Example workflow

```bash
# Convert a script with full review
node src/cli.js my_indicator.pine my_indicator.js

# See what the parser produces
node src/cli.js my_indicator.pine --ast

# Convert without any review (fastest)
node src/cli.js my_indicator.pine my_indicator.js --no-review
```

## Running Tests

```bash
npm test                  # Run the main test suite
npm run test:indicators   # Run bar-by-bar indicator smoke tests
```

## Example PineScript

Here is a script that exercises most of the transpiler's capabilities. Save it as `test_script.pine` and convert it:

```pine
//@version=5
indicator("Test Script", overlay=true)

// Inputs
fastLen = input.int(10, "Fast Length")
slowLen = input.int(20, "Slow Length")
src = input.source(close, "Source")

// Moving average calculations
fastMA = ta.sma(src, fastLen)
slowMA = ta.sma(src, slowLen)

// Track the last crossover bar using persistent state
var float lastCross = na
if ta.crossover(fastMA, slowMA)
    lastCross := bar_index
else if ta.crossunder(fastMA, slowMA)
    lastCross := bar_index

// Pull in higher timeframe data
higherTF = input.timeframe("60", "Higher TF")
[st, dir] = request.security(syminfo.tickerid, higherTF, ta.supertrend(3, 10))

// Plot the moving averages
plot(fastMA, "Fast MA", color=color.blue)
plot(slowMA, "Slow MA", color=color.orange)
plotshape(ta.crossover(fastMA, slowMA), "Crossover", style=shape.triangleup, location=location.belowbar, color=color.lime)
plotshape(ta.crossunder(fastMA, slowMA), "Crossunder", style=shape.triangledown, location=location.abovebar, color=color.red)

// Display current values in a table
var table infoTable = table.new(position.top_right, 2, 2, bgcolor=color.new(color.black, 80))
if barstate.islastconfirmedhistory
    table.cell(infoTable, 0, 0, "Fast MA", text_color=color.white)
    table.cell(infoTable, 0, 1, "Slow MA", text_color=color.white)
    table.cell(infoTable, 1, 0, str.tostring(fastMA, "#.##"), text_color=color.aqua)
    table.cell(infoTable, 1, 1, str.tostring(slowMA, "#.##"), text_color=color.fuchsia)

// Set up alerts
alertcondition(ta.crossover(fastMA, slowMA), "MA Crossover", "Fast crossed above slow")
alertcondition(ta.crossunder(fastMA, slowMA), "MA Crossunder", "Fast crossed below slow")
```

Convert it:

```bash
node src/cli.js test_script.pine test_script.js
```

Then run it bar-by-bar over your OHLCV data:

```javascript
import { run } from './test_script.js';

const result = run({ open, high, low, close, volume, time });
// result.plots['Fast MA'].data  -> full per-bar series
// result.plotshapes['Crossover'].data -> per-bar booleans
// result.alerts -> alertcondition() hits with their bar index
```

## Contributing

See `CONTRIBUTING.md` for guidelines.

## License

MIT. See `LICENSE`.

---

Built by MeridianAlgo. Documentation and test suite created with AI assistance.
