/**
 * PineScript to JavaScript Transpiler - Main Entry Point
 */

import { Lexer } from './lexer.js';
import { Parser } from './parser.js';
import { CodeGenerator } from './generator.js';

class Transpiler {
  constructor(options = {}) {
    this.options = {
      includeComments: options.includeComments ?? true,
      prettyPrint: options.prettyPrint ?? true,
      wrapInModule: options.wrapInModule ?? true
    };
  }

  transpile(source) {
    try {
      const tokens = this.tokenize(source);
      const ast = this.parse(tokens);
      const code = this.generate(ast);
      return {
        success: true,
        code,
        ast,
        tokens
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        stage: error.stage || 'unknown'
      };
    }
  }

  tokenize(source) {
    const lexer = new Lexer(source);
    return lexer.tokenize();
  }

  parse(tokens) {
    const parser = new Parser(tokens);
    return parser.parse();
  }

  generate(ast) {
    const generator = new CodeGenerator();
    return generator.generate(ast);
  }

  transpileFile(filePath) {
    const fs = require('fs');
    const source = fs.readFileSync(filePath, 'utf-8');
    return this.transpile(source);
  }

  transpileString(source) {
    return this.transpile(source);
  }
}

function transpile(source, options = {}) {
  const transpiler = new Transpiler(options);
  return transpiler.transpileString(source);
}

export { Transpiler, transpile };

if (typeof process !== 'undefined' && process.argv && process.argv[1] && process.argv[1].endsWith('transpiler.js')) {
  const args = process.argv.slice(2);
  if (args.length > 0) {
    const fs = require('fs');
    const source = fs.readFileSync(args[0], 'utf-8');
    const transpiler = new Transpiler();
    const result = transpiler.transpile(source);
    if (result.success) {
      console.log(result.code);
    } else {
      console.error('Error:', result.error);
      process.exit(1);
    }
  } else {
    console.log('Usage: node transpiler.js <file.pine>');
    process.exit(1);
  }
}
