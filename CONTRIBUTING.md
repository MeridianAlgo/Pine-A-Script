# Contributing

## Development setup

```bash
npm install
```

## Running tests

```bash
npm run test:indicators
```

## Adding new Pine fixtures

1. Put the `.pine` file in `examples/`.
2. Add it to the fixtures list in `test/indicator_tests.js`.
3. Run `npm run test:indicators`.
4. If it fails, fix the lexer/parser/generator/runtime until it passes.

## Code style

- Keep changes minimal and targeted.
- Prefer adding runtime stubs only when a real fixture requires them.
