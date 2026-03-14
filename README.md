# PineScript to JavaScript Compiler

A production-grade transpiler that converts TradingView PineScript (v5/v6) into clean, runnable JavaScript. Built for developers who need to take their Pine indicators, strategies, and analysis tools and run them outside of TradingView -- in Node.js, in a browser, or anywhere JavaScript runs.

This is not a toy converter. It handles real-world PineScript with 240+ function mappings, full series semantics, state persistence across bars, multi-timeframe support, and a post-conversion reviewer that catches problems before they hit you at runtime.

## What It Does

- Converts PineScript v5/v6 into standard JavaScript (ESM modules)
- Ships with a complete runtime that implements 100+ PineScript built-in functions
- Handles series semantics properly -- history indexing, current-bar arithmetic, the whole thing
- Persists `var` / `varip` state across bar executions, just like TradingView does
- Supports multi-timeframe data via `request.security()` with timeframe resampling
- Runs a multi-stage post-conversion reviewer that catches syntax errors, missing functions, and conversion artifacts
- Optional local AI review using a lightweight code model (no server or API key needed)

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

ai_reviewer/      Optional local AI review (Python, runs on your machine)
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
| `PINE_REVIEW_AI=1` | Enables the optional AI review |
| `PINE_REVIEWER_MODEL` | Sets the HuggingFace model for AI review |
| `PINE_REVIEWER_PYTHON` | Path to your Python interpreter |
| `PINE_REVIEWER_USE_CUDA=1` | Enables GPU acceleration for AI review |

### Optional AI review

The repo includes a fully local AI reviewer that runs a small code model on your machine. No server, no API key, no data leaves your laptop.

Default model: `Qwen/Qwen2.5-Coder-0.5B-Instruct` (fast, low RAM)
Larger model: `Qwen/Qwen2.5-Coder-1.5B-Instruct` (better results, slower)

Setup:

```bash
pip install -r ai_reviewer/requirements.txt
```

Run with AI review enabled:

```bash
PINE_REVIEW_AI=1 node src/cli.js script.pine output.js --review-ai
```

Note: Small models can produce repetitive or low-quality output. The reviewer sanitizes bad responses and will suggest switching models if needed.

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

### How Series Semantics Work

PineScript treats data as series -- arrays where the last element is the current bar. This transpiler preserves that behavior:

- **History indexing**: `x[1]` in Pine becomes `pinescript.offset(x, 1)` in JavaScript. This safely grabs the value from one bar ago.
- **Current bar arithmetic**: When you write `close + open` in Pine, both operands use the most recent bar value. The runtime wraps OHLCV arrays in a `SeriesArray` class whose `valueOf()` returns the last element, so arithmetic just works.
- **Null safety**: `na(x)` checks for null/undefined/NaN. `nz(x, default)` replaces bad values. These work exactly like their Pine counterparts.

### How State Persistence Works

Variables declared with `var` or `varip` keep their values across bar executions:

```javascript
// What the transpiler generates for: var float lastCross = na
if (state.lastCross === undefined) state.lastCross = null;
// Reads become: state.lastCross
// Writes become: state.lastCross = newValue;
```

The `state` object is stored in `globalThis.__pineState` so it survives across calls to `main()`.

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
- **Strategy backtesting**: Entry/exit functions log actions but do not simulate trades or generate equity curves
- **Pine v6 maps**: `map.new`, `map.get`, `map.set` have basic Map-backed implementations but are not battle-tested
- **User-defined type methods**: `type Foo` with `method` blocks has limited support
- **Library imports**: `import` statements are parsed but the imported functions are not resolved
- **Session calendars**: `timeframe.session` and session-based resampling
- **Polyline animations**: `polyline.set_*` methods
- **Line fills**: `linefill.new` and related functions
- **Tooltip formatting**: `format.*` options for `plot`
- **Plot/CSV export**: No built-in way to export plotted values

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
  --review-ai         Enable local AI review (needs Python deps)
```

### Example workflow

```bash
# Convert a script with full review
node src/cli.js my_indicator.pine my_indicator.js

# See what the parser produces
node src/cli.js my_indicator.pine --ast

# Convert without any review (fastest)
node src/cli.js my_indicator.pine my_indicator.js --no-review

# Convert with AI review for deeper analysis
PINE_REVIEW_AI=1 node src/cli.js my_indicator.pine my_indicator.js --review-ai
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

Convert and run:

```bash
node src/cli.js test_script.pine test_script.js
node test_script.js   # Needs OHLCV data loaded into globalThis
```

## Contributing

See `CONTRIBUTING.md` for guidelines.

## License

MIT. See `LICENSE`.

---

Built by MeridianAlgo. Documentation and test suite created with AI assistance.
