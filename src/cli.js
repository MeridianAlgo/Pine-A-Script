/**
 * CLI for PineScript to JavaScript Transpiler
 */

import { transpile } from './transpiler.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function printHelp() {
  console.log(`
PineScript to JavaScript Transpiler

Usage: node cli.js [options] <input-file> [output-file]

Options:
  -h, --help          Show this help message
  -v, --verbose        Show detailed output
  -s, --source         Show source code in output
  --no-comments        Remove comments from output
  --ast                Output AST instead of generated code
  --tokens             Output tokens instead of generated code

Examples:
  node cli.js script.pine output.js
  node cli.js script.pine --verbose
  node cli.js script.pine --ast
`);
}

function main() {
  const args = process.argv.slice(2);
  let inputFile = null;
  let outputFile = null;
  const options = {
    includeComments: true,
    prettyPrint: true,
    wrapInModule: true,
    verbose: false,
    outputMode: 'code'
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    if (arg === '-h' || arg === '--help') {
      printHelp();
      process.exit(0);
    }

    if (arg === '-v' || arg === '--verbose') {
      options.verbose = true;
      continue;
    }

    if (arg === '-s' || arg === '--source') {
      options.showSource = true;
      continue;
    }

    if (arg === '--no-comments') {
      options.includeComments = false;
      continue;
    }

    if (arg === '--ast') {
      options.outputMode = 'ast';
      continue;
    }

    if (arg === '--tokens') {
      options.outputMode = 'tokens';
      continue;
    }

    if (!arg.startsWith('-')) {
      if (!inputFile) {
        inputFile = arg;
      } else if (!outputFile) {
        outputFile = arg;
      }
    }
  }

  if (!inputFile) {
    console.error('Error: Input file is required');
    console.log('Use --help for usage information');
    process.exit(1);
  }

  if (!fs.existsSync(inputFile)) {
    console.error(`Error: Input file not found: ${inputFile}`);
    process.exit(1);
  }

  const source = fs.readFileSync(inputFile, 'utf-8');

  if (options.verbose) {
    console.log(`Input file: ${inputFile}`);
    console.log(`File size: ${source.length} bytes`);
    console.log(`Lines: ${source.split('\n').length}`);
  }

  const result = transpile(source, options);

  if (!result.success) {
    console.error(`Error: ${result.error}`);
    process.exit(1);
  }

  if (options.outputMode === 'ast') {
    console.log(JSON.stringify(result.ast, null, 2));
  } else if (options.outputMode === 'tokens') {
    console.log(JSON.stringify(result.tokens, null, 2));
  } else {
    const output = result.code;

    if (outputFile) {
      fs.writeFileSync(outputFile, output);
      if (options.verbose) {
        console.log(`Output written to: ${outputFile}`);
        console.log(`Output size: ${output.length} bytes`);
      }
    } else {
      console.log(output);
    }
  }
}

main();
