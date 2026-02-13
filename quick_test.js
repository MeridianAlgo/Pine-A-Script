import { transpile } from './src/transpiler.js';

const tests = [
  { name: 'Simple variable', input: 'fastLength = 10' },
  { name: 'SMA function', input: 'sma(close, 20)' },
  { name: 'Binary expression', input: 'a + b * c' },
  { name: 'Array literal', input: '[1, 2, 3]' },
];

for (const test of tests) {
  const result = transpile(test.input);
  console.log(`Test: ${test.name}`);
  console.log(`Success: ${result.success}`);
  if (!result.success) {
    console.log(`Error: ${result.error}`);
  } else {
    console.log(`Code: ${result.code.substring(0, 150)}...`);
  }
  console.log('---');
}
