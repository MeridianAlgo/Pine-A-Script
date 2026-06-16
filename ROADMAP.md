# PineScript Converter Roadmap

Current version: 1.2.0

## Phase 1 -- Critical Fixes (v1.3.0) [In Progress]

### Done
- **Bar-by-bar execution engine** -- the big one. Converted scripts now export `run(data)` and execute once per bar, so indicators produce correct full time series instead of a single final-bar scalar. This was the core reason output was wrong before.
- **Call-site history** -- `x[n]` compiles to `pinescript.hist(id, x, n)`; lookback built-ins (`crossover`, `change`, `rising`, `barssince`, ...) wrap their series args with `pinescript.series(id, ...)`. History-dependent logic now actually works.
- **Numeric correctness test suite** (`test/engine_tests.js`) -- runs generated code over known data and asserts full output series against hand-computed values (sma, ema, change, highest, `[1]`, var accumulation, bar_index, crossover).
- **Graceful degradation** -- unimplemented namespaces resolve to safe no-ops instead of throwing, so scripts run end-to-end; safe tuple unpacking for `[a, b] = na`.
- Added missing built-ins: `time()`, `sign`, `alertcondition`, `barcolor`, `bgcolor`, `fill`, `hline`.
- Fixed `batch_convert.js` pass/fail detection (was matching the wrong review string and reporting UNKNOWN for everything).
- Fixed crossover/crossunder mapping bug (were both mapping to the same function)
- Upgraded post-conversion reviewer with confidence scoring, completeness checks, series safety analysis
- Expanded function mapping table from ~180 to ~240+ entries

### Remaining (highest priority first)
- **Function-scope hoisting**: declare user variables at function scope, not block scope, so a variable first assigned inside an `if`/`for` and read outside it doesn't become a JS reference error. (Biggest remaining correctness gap for real scripts.)
- **`if`/`switch` as a function's last expression**: return the branch value instead of `undefined`.
- Improve parser error messages with construct context (e.g. the `Unexpected token: )` failure on `Quantum_Structure_jjart.pine`).
- Add real indicator test fixtures and broaden numeric coverage (rsi, atr, macd, bb).

## Phase 2 -- Parser Hardening (v1.4.0)
- Support switch with `case > value =>` Pine syntax
- Better multiline expression continuation handling
- Improve operator precedence for edge cases
- Handle Pine v6 `export` keyword for library scripts
- Support `import` resolution for common public libraries
- Better error recovery (continue parsing after errors to report multiple issues)

## Phase 3 -- Strategy Engine (v2.0.0)
- Basic trade simulation engine (track entries, exits, position state)
- Position sizing and PnL calculation
- Commission and slippage modeling
- Equity curve generation and export
- Strategy performance metrics (win rate, profit factor, max drawdown, Sharpe ratio)
- Backtest report output (JSON and human-readable)

## Phase 4 -- Testing and Reliability (ongoing)
- Comprehensive edge case test suite (operator precedence, nesting, multiline)
- Regression tests for every fixed bug
- Fuzz testing with randomized PineScript inputs
- Parallel batch conversion for large codebases
- Performance benchmarks
- CI/CD pipeline setup

## Phase 5 -- Ecosystem (v2.1.0+)
- TypeScript type definitions for generated output
- Web-based converter UI (pine-paster tool)
- CSV/JSON export of plot() and plotshape() output
- VSCode extension for inline conversion
- npm package publication
- Documentation site

## Contributing

See CONTRIBUTING.md for how to help with any of these items. The most impactful contributions right now are in Phase 2 (parser hardening) and Phase 4 (test coverage).
