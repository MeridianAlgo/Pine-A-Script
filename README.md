# PineScript Converter (Pine-to-JS)

This repository contains a PineScript (v5/v6-ish) to JavaScript transpiler, plus a small runtime shim so converted indicators can execute in Node.js.

## Features

- Transpile PineScript to runnable JavaScript (ESM).
- Supports a large subset of Pine v5/v6 syntax used by common public scripts.
- Runtime shims for common namespaces:
  - `ta`, `math`, `array`, `str`, `color`, `table`, `request`, `timeframe`, `barmerge`
- Series semantics:
  - History indexing transpiles to `pinescript.offset(x, n)`.
  - Generated runtime wraps OHLCV/time arrays as a `SeriesArray` so arithmetic uses the current bar value.
- Stateful execution:
  - `var` / `varip` are persisted across bars via a `state` object.
- Multi-timeframe baseline:
  - `request.security()` resamples/aligned series using `time[]` when available.

## Project layout

- `src/`:
  - `lexer.js` - Tokenization for PineScript syntax (keywords, operators, indentation)
  - `parser.js` - AST generation supporting Pine v5/v6 constructs
  - `generator.js` - JavaScript code emission with runtime shims
  - `builtins.js` - JavaScript implementations of Pine built-in functions
  - `transpiler.js` - Main entry point (lexer → parser → generator)
  - `cli.js` - Command-line interface for transpilation
- `examples/` - Sample Pine scripts for testing and reference
- `converts/` - Generated JavaScript output files
- `test/indicator_tests.js` - Bar-by-bar runtime smoke tests

## Quick start

### Install

```bash
npm install
```

### Convert a Pine script

```bash
node src/cli.js examples/example.pine converts/example.js
```

### Run the indicator runtime tests

```bash
npm run test:indicators
```

## Supported PineScript Features

### Language Constructs

| Feature | Status | Notes |
|---------|--------|-------|
| Variable declarations (`var`, `varip`) | ✅ Supported | Persisted across bars via `state` object |
| Typed declarations (`float x`, `int y`) | ✅ Supported | Generates `let` for mutability |
| Generic types (`array<float>`, `matrix<float>`) | ✅ Supported | Basic parsing for `<type>` annotations |
| Type blocks (`type MyType`) | ✅ Supported | Generates lightweight JS object factories |
| Function declarations | ✅ Supported | Supports typed parameters and default values |
| Arrow functions (`=>`) | ✅ Supported | Implicit return for expression bodies |
| If/else statements | ✅ Supported | Full boolean expression conditions |
| For loops (`for i = 0 to n`) | ✅ Supported | Transpiled to JS for-loops |
| For-in loops (`for x in array`) | ✅ Supported | Transpiled to JS for-of loops |
| While loops | ✅ Supported | Parses full expressions as conditions |
| Switch statements | ✅ Supported | Generates chained ternary expressions |
| Ternary operators (`a ? b : c`) | ✅ Supported | Full expression support |
| Destructuring (`[a, b] = tuple`) | ✅ Supported | Also supports `:=` reassignment |
| Multi-declarations (`var float a=na, var float b=na`) | ✅ Supported | Comma-separated on one line |
| Semicolons in blocks | ✅ Supported | Statement separators inside `{...}` |
| Import statements | ✅ Supported | Parsed but not emitted (stubbed) |

### Built-in Functions & Namespaces

#### Technical Analysis (`ta`)

| Function | Status | Notes |
|----------|--------|-------|
| `ta.sma`, `ta.ema`, `ta.wma`, `ta.rma`, `ta.hma`, `ta.vwma` | ✅ Supported | Standard moving averages |
| `ta.atr`, `ta.tr` | ✅ Supported | ATR with `ta.tr(true)` signature support |
| `ta.rsi`, `ta.stoch` | ✅ Supported | RSI and Stochastic implementations |
| `ta.cci`, `ta.crossover`, `ta.crossunder` | ✅ Supported | CCI with dual signature support |
| `ta.pivothigh`, `ta.pivotlow` | ✅ Supported | Returns `null` (no future reference) |
| `ta.highest`, `ta.lowest`, `ta.barssince` | ✅ Supported | Hardened for scalar inputs |
| `ta.change`, `ta.roc`, `ta.percentrank` | ✅ Supported | Rate of change and percent rank |
| `ta.change`, `ta.valuewhen`, `ta.iff` | ✅ Supported | Core series manipulation |
| `ta.lowest`, `ta.highest`, `ta.median` | ✅ Supported | Array-based implementations |

#### Math (`math`)

| Function | Status | Notes |
|----------|--------|-------|
| `math.abs`, `math.max`, `math.min`, `math.round` | ✅ Supported | Standard math helpers |
| `math.sqrt`, `math.pow`, `math.log`, `math.exp` | ✅ Supported | Exposes `Math.*` |
| `math.avg`, `math.sum` | ✅ Supported | Custom implementations |
| `math.pi`, `math.e` | ✅ Supported | Constants |

#### Array Operations (`array`)

| Function | Status | Notes |
|----------|--------|-------|
| `array.new_float`, `array.new_int`, `array.new_bool`, `array.new_string` | ✅ Supported | Creates typed arrays |
| `array.new_label`, `array.new_line`, `array.new_box`, `array.new_polyline` | ✅ Supported | Pine v6 object arrays |
| `array.size`, `array.get`, `array.set` | ✅ Supported | Core array operations |
| `array.push`, `array.pop`, `array.unshift`, `array.shift` | ✅ Supported | Mutating operations |
| `array.clear`, `array.remove`, `array.insert` | ✅ Supported | Modification operations |
| `array.from` | ✅ Supported | Variadic array creation |
| `array.sort`, `array.reverse`, `array.min`, `array.max` | ✅ Supported | Utility functions |

#### String Operations (`str`)

| Function | Status | Notes |
|----------|--------|-------|
| `str.tostring`, `str.tonumber` | ✅ Supported | Type conversion |
| `str.concat`, `str.substring`, `str.len` | ✅ Supported | String manipulation |
| `str.contains`, `str.startswith`, `str.endswith` | ✅ Supported | Pattern matching |
| `str.replace`, `str.replaceall`, `str.lower`, `str.upper` | ✅ Supported | Transformations |
| `str.split`, `str.match` | ✅ Supported | Advanced parsing |

#### Color (`color`)

| Function | Status | Notes |
|----------|--------|-------|
| `color.rgb`, `color.new`, `color.from_gradient` | ✅ Supported | Color construction |
| `color.hex`, `color.t`, `color.r`, `color.g`, `color.b` | ✅ Supported | Color decomposition |
| Predefined colors (`color.red`, `color.green`, etc.) | ✅ Supported | Named color constants |

#### Table (`table`)

| Function | Status | Notes |
|----------|--------|-------|
| `table.new`, `table.cell`, `table.merge_cells` | ✅ Supported | Table construction |
| `table.cell_set_text`, `table.cell_set_bgcolor` | ✅ Supported | Cell manipulation |

#### Drawing (`line`, `label`, `box`, `polyline`)

| Function | Status | Notes |
|----------|--------|-------|
| `line.new`, `line.delete`, `line.setxy` | ✅ Supported | Line primitives |
| `label.new`, `label.delete`, `label.settext` | ✅ Supported | Label primitives |
| `box.new`, `box.delete` | ✅ Supported | Box primitives |
| `polyline.new`, `polyline.delete` | ✅ Supported | Polyline primitives |

#### Multi-Timeframe (`request`, `timeframe`, `barmerge`)

| Function | Status | Notes |
|----------|--------|-------|
| `request.security(symbol, tf, series, opts)` | ✅ Baseline | Resamples using `time[]` alignment |
| `request.financial(...)` | ✅ Stub | Returns `null` |
| `input.timeframe(defval)` | ✅ Supported | Returns input value |
| `barmerge.gaps_off`, `barmerge.gaps_on` | ✅ Supported | Constants |
| `barmerge.lookahead_off`, `barmerge.lookahead_on` | ✅ Supported | Constants |

#### Other

| Function | Status | Notes |
|----------|--------|-------|
| `na(x)`, `nz(x, def)` | ✅ Supported | Null handling |
| `input.int/float/bool/string/time/source/color` | ✅ Supported | Input declarations |
| `plot`, `plotshape`, `plotbar`, `plotcandle` | ✅ Supported | Charting output |
| `bgcolor`, `hline`, `fill` | ✅ Supported | Visual output |
| `alertcondition` | ✅ Supported | Alert registration |
| `barstate.islast`, `barstate.islastconfirmedhistory` | ✅ Supported | Bar state checks |

### Series Semantics

The transpiler implements PineScript's series semantics:

- **History indexing**: `x[1]`, `x[n]` transpiled to `pinescript.offset(x, n)`
- **Current bar value**: Arithmetic (`high / low`, `close + open`) uses the last array element via `SeriesArray.valueOf()`
- **Implicit casting**: OHLCV arrays wrapped in `SeriesArray` at runtime for seamless arithmetic

### State Persistence

Variables declared with `var` or `varip` are persisted across bar executions:

```javascript
// Generated code pattern:
if (state.myVar === undefined) state.myVar = initialValue;
// ... reads become state.myVar
// ... writes become state.myVar = newValue;
```

### Multi-Timeframe Baseline

`request.security()` implements basic resampling:

1. Parses timeframe strings (`"60"`, `"1H"`, `"D"`, `"W"`, `"M"`)
2. Buckets `time[]` into periods based on timeframe milliseconds
3. Aligns series to base timeframe with optional lookahead/gaps

**Limitations**:
- No session calendar handling
- No partial bar alignment
- No `barmerge` repainting rules beyond basic options

## Known Gaps / Future Work

The following PineScript features are not yet implemented or are partially supported. Contributions are welcome.

### Core Language Features

- **Strategy functions**: `strategy.entry`, `strategy.close`, `strategy.long`, `strategy.short`, `strategy.order` are not implemented.
- **Matrix operations**: `matrix.new`, `matrix.mult`, `matrix.inv`, `matrix.transpose` are stubbed with basic placeholder implementations.
- **Chart point objects**: `chart.point.from_index`, `chart.point.new` are stubbed.
- **Map data type**: Pine v6 `map` type declarations and operations (`map.new`, `map.get`, `map.set`) are not implemented.
- **User-defined types with methods**: `type Foo` with `method` blocks have limited support.
- **Library imports**: `@version` semantics beyond v5/v6 detection are not enforced.

### Multi-Timeframe / Security

- **Session calendars**: `timeframe.session` and session-based resampling are not handled.
- **Partial bar alignment**: `request.security()` does not align to incomplete current bars.
- **Full barmerge repainting**: `barmerge.lookahead_on` and `barmerge.gaps_on` behavior is not fully TV-accurate.
- **Security on non-standard timeframes**: Very small intervals (< 1m) or irregular intervals may not resample correctly.

### Drawing / Visualization

- **Polyline animations**: `polyline.set_*` methods are not implemented.
- **Line fill**: `linefill.new` and related functions are not implemented.
- **Tooltip formatting**: `format.*` options for `plot` are not fully mapped.

### Testing / Verification

- **Backtest engine**: No built-in backtest output or equity curve generation.
- **Plot export**: No CSV/JSON export of plotted values.

## Example PineScript for Testing

Copy the following PineScript code into a file (e.g., `test_script.pine`) and run:

```pine
//@version=5
indicator("Test Script", overlay=true)

// Inputs
fastLen = input.int(10, "Fast Length")
slowLen = input.int(20, "Slow Length")
src = input.source(close, "Source")

// Calculations
fastMA = ta.sma(src, fastLen)
slowMA = ta.sma(src, slowLen)

// State persistence example
var float lastCross = na
if ta.crossover(fastMA, slowMA)
    lastCross := bar_index
else if ta.crossunder(fastMA, slowMA)
    lastCross := bar_index

// Multi-timeframe example
higherTF = input.timeframe("60", "Higher TF")
[st, dir] = request.security(syminfo.tickerid, higherTF, ta.supertrend(3, 10))

// Plots
plot(fastMA, "Fast MA", color=color.blue)
plot(slowMA, "Slow MA", color=color.orange)
plotshape(ta.crossover(fastMA, slowMA), "Crossover", style=shape.triangleup, location=location.belowbar, color=color.lime)
plotshape(ta.crossunder(fastMA, slowMA), "Crossunder", style=shape.triangledown, location=location.abovebar, color=color.red)

// Table output
var table testTable = table.new(position.top_right, 2, 2, bgcolor=color.new(color.black, 80))
if barstate.islastconfirmedhistory
    table.cell(testTable, 0, 0, "Fast MA", text_color=color.white)
    table.cell(testTable, 0, 1, "Slow MA", text_color=color.white)
    table.cell(testTable, 1, 0, str.tostring(fastMA, "#.##"), text_color=color.aqua)
    table.cell(testTable, 1, 1, str.tostring(slowMA, "#.##"), text_color=color.fuchsia)

// Alerts
alertcondition(ta.crossover(fastMA, slowMA), "MA Crossover", "Fast crossed above slow")
alertcondition(ta.crossunder(fastMA, slowMA), "MA Crossunder", "Fast crossed below slow")
```

### Convert and run:

```bash
node src/cli.js test_script.pine converts/test_script.js
node converts/test_script.js   # Requires synthetic OHLCV data setup
```

## Contributing

See `CONTRIBUTING.md`.

## License

See `LICENSE`.

---

**Made with love by MeridianAlgo**

Documentation and test suite created with AI assistance.
