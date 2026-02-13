# Contributing to PineScript Converter

Thank you for your interest in contributing to the PineScript to JavaScript transpiler! This document provides comprehensive guidelines for contributing to this project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Environment](#development-environment)
- [Project Structure](#project-structure)
- [Workflow](#workflow)
- [Submitting Pull Requests](#submitting-pull-requests)
- [Coding Standards](#coding-standards)
- [Testing](#testing)
- [Documentation](#documentation)
- [Release Process](#release-process)

## Code of Conduct

This project adheres to the [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code. Please report unacceptable behavior to **contact@meridianalgo.org**.

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm 9 or higher
- Git

### Fork the Repository

1. Navigate to the [repository](https://github.com/MeridianAlgo/Pine-A-Script)
2. Click the "Fork" button in the top-right corner
3. Clone your fork locally:

```bash
git clone https://github.com/YOUR_USERNAME/Pine-A-Script.git
cd Pine-A-Script
```

4. Add the original repository as upstream:

```bash
git remote add upstream https://github.com/MeridianAlgo/Pine-A-Script.git
```

### Install Dependencies

```bash
npm install
```

## Development Environment

### Recommended Tools

- VS Code with extensions:
  - ESLint
  - Prettier
  - JavaScript (ES6) syntax support
- Node.js debugging tools

### Development Setup

1. Create a new branch for your feature or bugfix:

```bash
git checkout -b feature/your-feature-name
```

2. Make your changes
3. Run tests to ensure nothing is broken:

```bash
npm run test:indicators
```

4. Commit your changes with a descriptive commit message:

```bash
git add .
git commit -m "feat: add new PineScript feature support"
```

5. Push to your fork:

```bash
git push origin feature/your-feature-name
```

## Project Structure

```
Pine-A-Script/
├── src/
│   ├── lexer.js        # Tokenization for PineScript syntax
│   ├── parser.js       # AST generation supporting Pine v5/v6
│   ├── generator.js    # JavaScript code emission with runtime shims
│   ├── builtins.js      # JavaScript implementations of Pine built-ins
│   ├── transpiler.js    # Main entry point (lexer -> parser -> generator)
│   └── cli.js           # Command-line interface
├── examples/            # Sample Pine scripts for testing
├── converts/            # Generated JavaScript output files
├── test/
│   └── indicator_tests.js  # Bar-by-bar runtime smoke tests
├── CONTRIBUTING.md      # This file
├── CODE_OF_CONDUCT.md  # Community guidelines
├── README.md            # Project documentation
└── package.json         # Project configuration
```

## Workflow

### Issue Tracking

1. Check existing issues before creating a new one
2. Use issue templates when available
3. Clearly describe the problem or feature request
4. Provide reproduction steps for bugs

### Branch Naming Convention

- `feature/` - New features
- `bugfix/` - Bug fixes
- `docs/` - Documentation updates
- `refactor/` - Code refactoring
- `test/` - Adding or modifying tests

Example: `feature/support-matrix-operations`

### Commit Message Format

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

#### Types

- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation only changes
- `style`: Changes that do not affect the meaning of the code (white-space, formatting, etc)
- `refactor`: A code change that neither fixes a bug nor adds a feature
- `perf`: A code change that improves performance
- `test`: Adding missing tests or correcting existing tests
- `chore`: Changes to the build process or auxiliary tools

#### Examples

```
feat(lexer): add support for semicolon statement separators
fix(parser): handle multi-var declarations correctly
docs(readme): update supported functions table
test(indicators): add new fixture for timeseries script
```

## Submitting Pull Requests

### Before Submitting

1. Ensure your code passes all tests:

```bash
npm run test:indicators
```

2. Verify your changes do not break existing functionality
3. Update documentation as needed
4. Add tests for new features

### Pull Request Process

1. Navigate to the [Pull Requests](https://github.com/MeridianAlgo/Pine-A-Script/pulls) tab
2. Click "New Pull Request"
3. Select your branch and the `master` branch
4. Fill out the PR template completely
5. Link any related issues
6. Request review from maintainers

### PR Description Template

```markdown
## Description
Brief description of what this PR does.

## Type of Change
- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update
- [ ] Test update

## Testing
Describe how this was tested:
- [ ] Unit tests added/updated
- [ ] Integration tests added/updated
- [ ] Manual testing performed

## Checklist
- [ ] My code follows the project's style guidelines
- [ ] I have performed a self-review of my code
- [ ] I have commented my code, particularly in hard-to-understand areas
- [ ] I have made corresponding changes to the documentation
- [ ] My changes generate no new warnings
- [ ] I have added tests that prove my fix is effective or that my feature works
- [ ] New and existing tests pass locally with my changes
```

### Code Review Guidelines

- Be responsive to feedback
- Address all comments before merging
- Ask for clarification if a comment is unclear
- Keep discussions professional and constructive

## Coding Standards

### JavaScript Style Guide

- Use ESM modules (`import`/`export`)
- Prefer `const` over `let`
- Use template literals for string interpolation
- Use arrow functions for callbacks
- Prefer async/await over raw promises

### Example

```javascript
// Good
import { transpile } from './transpiler.js';

async function convertFile(inputPath, outputPath) {
  const source = await readFile(inputPath, 'utf-8');
  const result = transpile(source);
  return result;
}

// Avoid
const transpile = require('./transpiler.js');

function convertFile(inputPath, outputPath) {
  var source = fs.readFileSync(inputPath, 'utf-8');
  var result = transpile(source);
  return result;
}
```

### File Organization

- Keep files focused and modular
- Limit line length to 100 characters
- Use consistent indentation (2 spaces)

### Comments

- Use JSDoc for functions
- Explain complex logic
- Avoid obvious comments

### Runtime Stub Guidelines

- Only add runtime stubs when a real fixture requires them
- Keep stubs minimal and functional
- Document stub limitations

## Testing

### Running Tests

```bash
# Run all tests
npm run test:indicators

# Run specific test file
node test/indicator_tests.js
```

### Adding New Test Fixtures

1. Place the `.pine` file in `examples/`
2. Add it to the fixtures list in `test/indicator_tests.js`:

```javascript
const fixtures = [
  'examples/existing_fixture.pine',
  'examples/your_new_fixture.pine',
];
```

3. Run tests to verify it transpiles and runs correctly

### Test Coverage

- Aim for comprehensive coverage of new features
- Include edge cases
- Test both success and failure scenarios

## Documentation

### Updating Documentation

- Update `README.md` for user-facing changes
- Update `CONTRIBUTING.md` for process changes
- Add code comments for complex logic
- Update examples in documentation

### Documentation Style

- Use clear, concise language
- Include code examples where helpful
- Keep documentation up to date with code changes

## Release Process

### Versioning

This project follows [Semantic Versioning](https://semver.org/):

- `MAJOR.MINOR.PATCH`
- Increment MAJOR for breaking changes
- Increment MINOR for new features (backward compatible)
- Increment PATCH for bug fixes

### Release Steps

1. Update version in `package.json`
2. Update `CHANGELOG.md` with changes
3. Create a git tag:

```bash
git tag v1.0.1
git push origin v1.0.1
```

4. GitHub Actions will automatically create a release

### Changelog Format

```markdown
## [version] - YYYY-MM-DD

### Added
- Feature description

### Changed
- Change description

### Fixed
- Fix description

### Removed
- Removed feature description
```

## Getting Help

- Open an issue for bugs
- Start a discussion for feature ideas
- Ask questions in pull request comments
- Email: **contact@meridianalgo.org**

## Recognition

Contributors who submit quality pull requests will be recognized in the project's contributors list.

---

**Thank you for contributing to PineScript Converter!**

*Made with love by MeridianAlgo*

*Documentation and test suite created with AI assistance.*
