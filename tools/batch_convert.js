import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const examplesDir = 'examples';
const convertedDir = 'converted';

// Ensure converted directory exists
if (!fs.existsSync(convertedDir)) {
  fs.mkdirSync(convertedDir, { recursive: true });
}

// Get all .pine files
const pineFiles = fs.readdirSync(examplesDir).filter(f => f.endsWith('.pine'));

console.log(`Found ${pineFiles.length} PineScript files to convert...\n`);

const results = {
  passed: [],
  failed: [],
  missing: []
};

for (const file of pineFiles) {
  const inputPath = path.join(examplesDir, file);
  const outputPath = path.join(convertedDir, file.replace('.pine', '.js'));
  const errorPath = path.join(convertedDir, file.replace('.pine', '.err.txt'));
  
  process.stdout.write(`Converting ${file}... `);
  
  try {
    const output = execSync(`node src/cli.js "${inputPath}" "${outputPath}"`, { encoding: 'utf8', stdio: 'pipe' });
    
    // Check if conversion passed or failed based on output
    if (output.includes('Review: PASS')) {
      console.log('PASS');
      results.passed.push(file);
      // Remove error file if exists from previous run
      if (fs.existsSync(errorPath)) fs.unlinkSync(errorPath);
    } else if (output.includes('Review: FAIL')) {
      console.log('FAIL');
      results.failed.push(file);
      fs.writeFileSync(errorPath, output);
    } else {
      console.log('UNKNOWN');
      results.failed.push(file);
    }
  } catch (error) {
    console.log('ERROR');
    results.failed.push(file);
    fs.writeFileSync(errorPath, error.stderr || error.message);
  }
}

console.log(`\n=== Conversion Summary ===`);
console.log(`Passed: ${results.passed.length}/${pineFiles.length}`);
console.log(`Failed: ${results.failed.length}/${pineFiles.length}`);

if (results.failed.length > 0) {
  console.log(`\nFailed files:`);
  results.failed.forEach(f => console.log(`  - ${f}`));
}

// Write status JSON
const status = {
  timestamp: new Date().toISOString(),
  total: pineFiles.length,
  passed: results.passed.length,
  failed: results.failed.length,
  files: pineFiles.map(f => ({
    name: f,
    status: results.passed.includes(f) ? 'converted' : results.failed.includes(f) ? 'failed' : 'missing',
    jsExists: fs.existsSync(path.join(convertedDir, f.replace('.pine', '.js'))),
    errorExists: fs.existsSync(path.join(convertedDir, f.replace('.pine', '.err.txt')))
  }))
};

fs.writeFileSync(path.join(convertedDir, 'status.json'), JSON.stringify(status, null, 2));
console.log(`\nStatus written to ${path.join(convertedDir, 'status.json')}`);
