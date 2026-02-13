import { Lexer } from './src/lexer.js';
import { Parser } from './src/parser.js';
import fs from 'fs';

const src = fs.readFileSync('example.txt', 'utf-8');
const lexer = new Lexer(src);
const tokens = lexer.tokenize();

const lineFrom = 285;
const lineTo = 305;
console.log('TOKENS', lineFrom, '-', lineTo);
for (const t of tokens) {
  if (t.line >= lineFrom && t.line <= lineTo) {
    console.log(`${t.line}:${t.column}\t${t.type}\t${JSON.stringify(t.value)}`);
  }
}

const lines = src.split(/\r?\n/);
const exprLine = (lines[297] || '').trim();
console.log('\nSINGLE LINE 298:', JSON.stringify(exprLine));
const exprTokens = new Lexer(exprLine).tokenize();
for (const t of exprTokens) {
  console.log(`${t.line}:${t.column}\t${t.type}\t${JSON.stringify(t.value)}`);
}

console.log('\nPARSING...');
try {
  const parser = new Parser(tokens);
  const ast = parser.parse();
  console.log('Parsed program with', ast.body.length, 'top-level statements');
} catch (e) {
  console.error('Parse error:', e.message);
  console.error(e.stack);
}
