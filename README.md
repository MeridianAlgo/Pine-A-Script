# PineScript Converter (Pine-to-JS)

This repository contains a PineScript (v5/v6-ish) to JavaScript transpiler, plus a small runtime shim so converted indicators can execute in Node.

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
  - `lexer.js`, `parser.js`, `generator.js`, `builtins.js`, `transpiler.js`, `cli.js`
- `examples/`: sample Pine scripts
- `converts/`: generated JS output files
- `test/indicator_tests.js`: bar-by-bar runtime smoke tests

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

## Notes / limitations

- The runtime is a pragmatic shim to make many scripts execute in Node. It is not a full TradingView runtime.
- `request.security()` is implemented as a baseline resampler/alignment; full TV-accurate behavior is future work.

## Contributing

See `CONTRIBUTING.md`.

## License

See `LICENSE`.
