import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const examplesDir = 'examples';
const convertedDir = 'converted';

// Create the output directory if it does not already exist
if (!fs.existsSync(convertedDir)) {
  fs.mkdirSync(convertedDir, { recursive: true });
}

// Collect all PineScript source files from the examples directory
const pineFiles = fs.readdirSync(examplesDir).filter(f => f.endsWith('.pine'));

if (pineFiles.length === 0) {
  console.log('No .pine files found in the examples directory.');
  process.exit(0);
}

console.log(`Found ${pineFiles.length} PineScript files to convert...\n`);

const results = {
  passed: [],
  failed: [],
};

// Track per-file details for the final status report
const fileDetails = [];

for (const file of pineFiles) {
  const inputPath = path.join(examplesDir, file);
  const outputPath = path.join(convertedDir, file.replace('.pine', '.js'));
  const errorPath = path.join(convertedDir, file.replace('.pine', '.err.txt'));

  process.stdout.write(`Converting ${file}... `);

  const startTime = Date.now();
  let status = 'unknown';
  let confidenceScore = null;
  let output = '';

  try {
    output = execSync(`node src/cli.js "${inputPath}" "${outputPath}"`, {
      encoding: 'utf8',
      stdio: 'pipe',
    });

    // Extract the reviewer confidence score from the CLI output if present
    const confidenceMatch = output.match(/[Cc]onfidence[:\s]+(\d+(?:\.\d+)?)/);
    if (confidenceMatch) {
      confidenceScore = parseFloat(confidenceMatch[1]);
    }

    if (output.includes('Review: PASS')) {
      const scoreLabel = confidenceScore !== null ? ` (confidence: ${confidenceScore}%)` : '';
      console.log(`PASS${scoreLabel}`);
      status = 'converted';
      results.passed.push(file);
      // Clean up any leftover error file from a previous run
      if (fs.existsSync(errorPath)) fs.unlinkSync(errorPath);
    } else if (output.includes('Review: FAIL')) {
      const scoreLabel = confidenceScore !== null ? ` (confidence: ${confidenceScore}%)` : '';
      console.log(`FAIL${scoreLabel}`);
      status = 'failed';
      results.failed.push(file);
      fs.writeFileSync(errorPath, output);
    } else {
      console.log('UNKNOWN');
      status = 'failed';
      results.failed.push(file);
      fs.writeFileSync(errorPath, output || 'No recognizable review status in output.');
    }
  } catch (error) {
    // Capture both stderr and the exception message so nothing is lost
    const errorContent = [error.stderr, error.stdout, error.message]
      .filter(Boolean)
      .join('\n');
    console.log('ERROR');
    status = 'failed';
    results.failed.push(file);
    fs.writeFileSync(errorPath, errorContent);
  }

  const elapsed = Date.now() - startTime;

  fileDetails.push({
    name: file,
    status,
    confidenceScore,
    elapsedMs: elapsed,
    jsExists: fs.existsSync(outputPath),
    errorExists: fs.existsSync(errorPath),
  });
}

// Print the summary
console.log(`\n=== Conversion Summary ===`);
console.log(`Passed: ${results.passed.length}/${pineFiles.length}`);
console.log(`Failed: ${results.failed.length}/${pineFiles.length}`);

// Show timing breakdown
const totalMs = fileDetails.reduce((sum, d) => sum + d.elapsedMs, 0);
console.log(`Total time: ${(totalMs / 1000).toFixed(2)}s`);

// Show average confidence score across all files that reported one
const scored = fileDetails.filter(d => d.confidenceScore !== null);
if (scored.length > 0) {
  const avgConfidence = scored.reduce((sum, d) => sum + d.confidenceScore, 0) / scored.length;
  console.log(`Average confidence score: ${avgConfidence.toFixed(1)}% (across ${scored.length} file${scored.length === 1 ? '' : 's'})`);
}

if (results.failed.length > 0) {
  console.log(`\nFailed files:`);
  results.failed.forEach(f => {
    const detail = fileDetails.find(d => d.name === f);
    const timeStr = detail ? ` [${(detail.elapsedMs / 1000).toFixed(2)}s]` : '';
    console.log(`  - ${f}${timeStr}`);
  });
}

// Write a machine-readable status report
const statusReport = {
  timestamp: new Date().toISOString(),
  total: pineFiles.length,
  passed: results.passed.length,
  failed: results.failed.length,
  totalTimeMs: totalMs,
  averageConfidenceScore: scored.length > 0
    ? parseFloat((scored.reduce((sum, d) => sum + d.confidenceScore, 0) / scored.length).toFixed(1))
    : null,
  files: fileDetails,
};

fs.writeFileSync(path.join(convertedDir, 'status.json'), JSON.stringify(statusReport, null, 2));
console.log(`\nStatus written to ${path.join(convertedDir, 'status.json')}`);
