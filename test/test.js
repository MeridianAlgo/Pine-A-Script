/**
 * Test suite for PineScript to JavaScript Transpiler
 */

import { transpile } from '../src/transpiler.js';

const tests = [
  {
    name: 'Simple variable declaration',
    input: `fastLength = 10`,
    check: (result) => result.success && result.code.includes('const fastLength = 10')
  },
  {
    name: 'Input declaration',
    input: `length = input.int(14, "Period")`,
    check: (result) => result.success && result.code.includes('const length')
  },
  {
    name: 'SMA function call',
    input: `sma(close, 20)`,
    check: (result) => result.success && result.code.includes('pinescript.sma')
  },
  {
    name: 'If statement',
    input: `if close > open
    x = 1
else
    x = 2`,
    check: (result) => result.success && result.code.includes('if') && result.code.includes('else')
  },
  {
    name: 'Plot function',
    input: `plot(close, title="Close")`,
    check: (result) => result.success && result.code.includes('pinescript.plot')
  },
  {
    name: 'Binary expression',
    input: `a + b * c`,
    check: (result) => result.success && result.code.includes('+') && result.code.includes('*')
  },
  {
    name: 'Study declaration',
    input: `study("My Indicator", overlay=true)`,
    check: (result) => result.success && result.code.includes('Study')
  },
  {
    name: 'Array literal',
    input: `[1, 2, 3]`,
    check: (result) => result.success && result.code.includes('[1, 2, 3]')
  },
  {
    name: 'Function call with multiple args',
    input: `ta.rsi(close, 14)`,
    check: (result) => result.success && result.code.includes('pinescript.rsi')
  },
  {
    name: 'Complete SMA crossover script',
    input: `study("SMA Crossover", overlay=true)
fast = sma(close, 10)
slow = sma(close, 20)
plot(fast, color=color.blue)
plot(slow, color=color.red)`,
    check: (result) => result.success && result.code.includes('pinescript.sma')
  }
];

let passed = 0;
let failed = 0;

console.log('Running PineScript Transpiler Tests\n');
console.log('='.repeat(50));

for (const test of tests) {
  try {
    const result = transpile(test.input);
    if (test.check(result)) {
      console.log(`✓ ${test.name}`);
      passed++;
    } else {
      console.log(`✗ ${test.name}`);
      console.log(`  Result: ${result.success ? 'success' : 'failed'}`);
      if (result.code) console.log(`  Code: ${result.code.substring(0, 100)}`);
      failed++;
    }
  } catch (error) {
    console.log(`✗ ${test.name}`);
    console.log(`  Error: ${error.message}`);
    failed++;
  }
}

console.log('='.repeat(50));
console.log(`\nResults: ${passed} passed, ${failed} failed`);

if (failed > 0) {
  process.exit(1);
}
