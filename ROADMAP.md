# PineScript Converter Roadmap

Current version: 1.2.0

## Phase 1 -- Critical Fixes (v1.3.0) [In Progress]

### Done
- Fixed crossover/crossunder mapping bug (were both mapping to the same function)
- Added 40+ missing built-in functions (supertrend, DMI/ADX, input stubs, drawing functions, etc.)
- Upgraded post-conversion reviewer with confidence scoring, completeness checks, series safety analysis
- Humanized all code comments across the codebase
- Expanded function mapping table from ~180 to ~240 entries
- Fixed test suite assertions

### Remaining
- Fix TokenType.INPUT parser reference
- Improve parser error messages with construct context
- Add method keyword support in lexer
- Create real indicator test fixtures (replacing hardcoded missing files)
- Add array.first(), array.last(), and other commonly-used array functions

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
