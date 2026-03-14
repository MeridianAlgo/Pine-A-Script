import vm from 'node:vm';
import { spawn } from 'node:child_process';
import { builtins as runtimeBuiltins } from './builtins.js';

const uniq = (arr) => Array.from(new Set(arr));

function extractPinescriptMembers(code) {
  const re = /\bpinescript\.([A-Za-z_$][A-Za-z0-9_$]*)/g;
  const out = [];
  for (let m; (m = re.exec(code)) !== null;) out.push(m[1]);
  return uniq(out);
}

function allowedMembers() {
  return new Set([
    'asSeries',
    '_parseTimeframeMs',
    'requestSecurity',
    'color',
    'size',
    'shape',
    'location',
    'position',
    'text',
    'table',
    'line',
    'polyline',
    'linefill',
    'format',
    'strategy',
    'indicator',
    // Series helpers
    'offset',
    'na',
    'nz',
    'fixnan',
    'valuewhen',
    // Type / casting helpers
    'float',
    'int',
    'bool',
    'string',
    // Common accessors and namespaces
    'math',
    'ta',
    'input',
    'plot',
    'plotshape',
    'plotchar',
    'plotarrow',
    'plotcandle',
    'plotbar',
    'hline',
    'fill',
    'bgcolor',
    'barcolor',
    'label',
    'box',
    'array',
    'map',
    'matrix',
    'timeframe',
    'syminfo',
    'bar_index',
    'timenow',
    'last_bar_index',
    'xloc',
    'yloc',
    'alert',
    'alertcondition',
    'log',
    'runtime',
    'str',
    'ticker',
    'request',
    'display',
    'earnings',
    'dividends',
    'splits',
    'adjustment',
    'currency',
    'extend',
    'style',
    'scale',
    'session'
  ]);
}

function buildAiReviewSnippet(code) {
  const lines = code.split(/\r?\n/);
  if (lines.length <= 240) return code;

  // The generator emits a marker right before the user's script body.
  const marker = '// Main script logic';
  const idx = lines.findIndex((l) => l.includes(marker));
  if (idx >= 0) {
    return lines.slice(idx, idx + 420).join('\n');
  }

  // Fallback: last N lines.
  return lines.slice(-300).join('\n');
}

// ---------------------------------------------------------------------------
// New review stages
// ---------------------------------------------------------------------------

/**
 * Completeness check -- look for raw PineScript syntax that leaked through
 * and for function calls to undeclared, non-builtin identifiers.
 */
function checkCompleteness(code) {
  const warnings = [];

  // Raw PineScript assignment operator :=
  const reassignMatches = code.match(/[^=!<>:]\s*:=\s*/g);
  if (reassignMatches) {
    warnings.push(
      `Found ${reassignMatches.length} occurrence(s) of ":=" -- this is PineScript reassignment syntax that was not converted to JavaScript.`
    );
  }

  // PineScript-style variable declarations like "var float x = ..."
  const varFloatRe = /\bvar\s+(float|int|bool|string|color)\s+\w+/g;
  const varFloatMatches = code.match(varFloatRe);
  if (varFloatMatches) {
    warnings.push(
      `Found ${varFloatMatches.length} PineScript-style typed declaration(s) (e.g. "var float x"): ${varFloatMatches.slice(0, 3).join(', ')}${varFloatMatches.length > 3 ? ' ...' : ''}`
    );
  }

  // Pine "if" used as expression (ternary-like) -- e.g. "x = if cond"
  const ifExprRe = /(?:=|return)\s+if\s+/g;
  const ifExprMatches = code.match(ifExprRe);
  if (ifExprMatches) {
    warnings.push(
      `Found ${ifExprMatches.length} "if" expression(s) used in assignment context -- PineScript's "if" as expression was likely not fully converted.`
    );
  }

  // Pine "for ... to ..." loop syntax
  const forToRe = /\bfor\s+\w+\s*=\s*\d+\s+to\s+/g;
  const forToMatches = code.match(forToRe);
  if (forToMatches) {
    warnings.push(
      `Found ${forToMatches.length} PineScript "for ... to ..." loop(s) that were not converted to JavaScript "for" syntax.`
    );
  }

  return warnings;
}

/**
 * Check for undefined function references -- functions that are called but
 * never declared in the code and are not known builtins.
 */
function checkUndefinedFunctions(code) {
  const warnings = [];

  // Collect declared functions / const arrow functions
  const declaredRe = /(?:function\s+(\w+)|const\s+(\w+)\s*=\s*(?:\([^)]*\)|[^=])\s*=>)/g;
  const declared = new Set();
  for (let m; (m = declaredRe.exec(code)) !== null;) {
    declared.add(m[1] || m[2]);
  }

  // Collect all function-call-like identifiers
  const callRe = /\b([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\(/g;
  const called = new Set();
  for (let m; (m = callRe.exec(code)) !== null;) {
    called.add(m[1]);
  }

  // Well-known JS globals, keywords, and prototype methods that show up in generated code
  const jsGlobals = new Set([
    'if', 'for', 'while', 'switch', 'catch', 'return', 'typeof', 'new', 'throw', 'delete',
    'import', 'export', 'require', 'await', 'async', 'yield', 'void', 'super', 'this',
    'console', 'Math', 'Date', 'Array', 'Object', 'String', 'Number', 'Boolean',
    'JSON', 'Promise', 'Set', 'Map', 'RegExp', 'Error', 'TypeError', 'RangeError',
    'parseInt', 'parseFloat', 'isNaN', 'isFinite', 'encodeURIComponent', 'decodeURIComponent',
    'setTimeout', 'setInterval', 'clearTimeout', 'clearInterval', 'fetch',
    'Function', 'Proxy', 'Reflect', 'Symbol', 'BigInt', 'WeakMap', 'WeakSet',
    'NaN', 'Infinity', 'undefined', 'null', 'globalThis',
    // Common prototype/instance methods that appear as bare calls in generated code
    'function', 'isArray', 'slice', 'reduce', 'get', 'sort', 'filter', 'map',
    'indexOf', 'findIndex', 'find', 'includes', 'push', 'pop', 'shift', 'unshift',
    'splice', 'concat', 'join', 'split', 'replace', 'match', 'test', 'exec',
    'toString', 'valueOf', 'keys', 'values', 'entries', 'from', 'of', 'fill',
    'every', 'some', 'forEach', 'flat', 'flatMap', 'reverse', 'length',
    'getFullYear', 'getMonth', 'getDate', 'getHours', 'getMinutes', 'getSeconds',
    'getUTCFullYear', 'getUTCMonth', 'getUTCDate', 'getUTCDay', 'getUTCHours',
    'setUTCDate', 'UTC', 'ceil', 'now', 'abs', 'max', 'min', 'floor', 'round',
    'sqrt', 'pow', 'log', 'exp', 'random', 'sign',
    'setPrototypeOf', 'assign', 'create', 'defineProperty', 'freeze',
    'has', 'delete', 'clear', 'size', 'add', 'set',
    'write', 'end', 'on', 'emit', 'setEncoding',
    'main', 'state', 'pinescript', 'builtins', 'SeriesArray',
    'lastIndexOf', 'substring', 'startsWith', 'endsWith', 'toLowerCase', 'toUpperCase',
    'trim', 'trimStart', 'trimEnd', 'padStart', 'padEnd', 'repeat', 'charAt', 'charCodeAt',
    'codePointAt', 'normalize', 'localeCompare', 'search', 'matchAll',
    'downtrend', 'uptrend', 'direction', 'trend'
  ]);

  const builtinKeys = new Set(Array.from(runtimeBuiltins.keys()));
  const allowed = allowedMembers();

  const missing = [];
  for (const fn of called) {
    if (declared.has(fn)) continue;
    if (jsGlobals.has(fn)) continue;
    if (builtinKeys.has(fn)) continue;
    if (allowed.has(fn)) continue;
    // Skip method calls (preceded by a dot) -- we only grabbed bare identifiers
    // but let's keep things simple and include them as candidates.
    missing.push(fn);
  }

  if (missing.length) {
    const display = uniq(missing).slice(0, 15);
    warnings.push(
      `${display.length} function(s) called but never declared or found in builtins: ${display.join(', ')}${missing.length > 15 ? ' ...' : ''}`
    );
  }

  return warnings;
}

/**
 * Series safety check -- look for direct bracket indexing on identifiers
 * that look like series rather than plain arrays.
 */
function checkSeriesSafety(code) {
  const warnings = [];

  // Common series variable names that should use pinescript.offset()
  const seriesKeywords = /\b(close|open|high|low|volume|hl2|hlc3|ohlc4|time|src|source)\s*\[\s*\d+\s*\]/g;
  const matches = code.match(seriesKeywords);
  if (matches) {
    const deduped = uniq(matches.map((m) => m.trim()));
    warnings.push(
      `Found direct array indexing on what appears to be series data: ${deduped.slice(0, 5).join(', ')}${deduped.length > 5 ? ' ...' : ''}. Consider using pinescript.offset() for correct series lookback behavior.`
    );
  }

  // Generic pattern: identifier[number] where the identifier is NOT a known
  // JS array/string name (heuristic -- look for single-word lowercase idents)
  const genericBracket = /\b([a-z_]\w*)\[\s*(\w+)\s*\]/g;
  const suspicious = [];
  const safeArrayNames = new Set([
    'args', 'arr', 'array', 'buffer', 'bytes', 'chars', 'children', 'data',
    'elements', 'entries', 'fields', 'items', 'keys', 'lines', 'list', 'matches',
    'nodes', 'options', 'params', 'parts', 'pieces', 'results', 'rows', 'segments',
    'slices', 'splits', 'tokens', 'values', 'words', 'argv', 'colors'
  ]);
  for (let m; (m = genericBracket.exec(code)) !== null;) {
    const varName = m[1];
    if (!safeArrayNames.has(varName) && /^\d+$/.test(m[2]) && parseInt(m[2]) > 0) {
      suspicious.push(`${varName}[${m[2]}]`);
    }
  }
  if (suspicious.length > 3) {
    const deduped = uniq(suspicious).slice(0, 5);
    warnings.push(
      `Multiple bracket-indexed lookbacks detected (${suspicious.length} total, e.g. ${deduped.join(', ')}). Verify these use pinescript.offset() where appropriate.`
    );
  }

  return warnings;
}

/**
 * State persistence check -- verify that variables initialized via
 * "if (state.X === undefined)" have matching usage elsewhere.
 */
function checkStatePersistence(code) {
  const warnings = [];

  // Find all state.X initialization guards
  const initRe = /if\s*\(\s*state\.(\w+)\s*===?\s*undefined\s*\)/g;
  const initialized = new Set();
  for (let m; (m = initRe.exec(code)) !== null;) {
    initialized.add(m[1]);
  }

  if (initialized.size === 0) return warnings;

  // For each initialized state var, check it is actually read elsewhere
  for (const varName of initialized) {
    // Count all occurrences of state.varName
    const allRe = new RegExp(`\\bstate\\.${varName}\\b`, 'g');
    const allMatches = code.match(allRe);
    // If it only appears in the init guard and the assignment inside it (<=2), warn
    if (!allMatches || allMatches.length <= 2) {
      warnings.push(
        `State variable "state.${varName}" is initialized but rarely referenced (${allMatches ? allMatches.length : 0} occurrence(s)). It may be unused or the conversion missed references to it.`
      );
    }
  }

  return warnings;
}

/**
 * Compute a confidence score (0-100) based on review findings.
 */
function computeConfidence(report) {
  let score = 0;

  // Syntax check passed (+30)
  const hasSyntaxError = report.errors.some((e) => /syntax|parse error/i.test(e));
  if (!hasSyntaxError) score += 30;

  // Import test passed (+30)
  const hasImportError = report.errors.some((e) => /runtime import error/i.test(e));
  if (!hasImportError) score += 30;

  // No raw Pine syntax detected (+20)
  const hasRawPine = report.warnings.some((w) => /PineScript/i.test(w) && /syntax|declaration|converted/i.test(w));
  if (!hasRawPine) score += 20;

  // All referenced functions exist (+20)
  const hasMissingFns = report.warnings.some((w) => /called but never declared/i.test(w));
  if (!hasMissingFns) score += 20;

  // Deductions
  score -= report.warnings.length * 5;
  const missingBuiltinMatch = report.warnings
    .map((w) => w.match(/missing runtime builtins/i))
    .filter(Boolean);
  if (missingBuiltinMatch.length) {
    // Count how many builtins are missing
    const countMatch = report.warnings
      .find((w) => /missing runtime builtins/i.test(w));
    if (countMatch) {
      const items = countMatch.split(':').pop().split(',').length;
      score -= items * 10;
      // Undo the per-warning deduction for this one since we applied a heavier penalty
      score += 5;
    }
  }

  return Math.max(0, Math.min(100, score));
}

/**
 * Generate context-specific suggestions based on the review findings.
 */
function generateSuggestions(code, report) {
  const suggestions = [];

  // Suggest specific missing builtins
  const missingBuiltinWarn = report.warnings.find((w) => /missing runtime builtins/i.test(w));
  if (missingBuiltinWarn) {
    const after = missingBuiltinWarn.split(':').slice(1).join(':').trim();
    const names = after.split(',').map((s) => s.trim().replace(/\s*\.\.\./, ''));
    if (names.length) {
      suggestions.push(
        `The following builtin(s) need implementation in the runtime: ${names.join(', ')}. Add them to src/builtins.js or provide stubs.`
      );
    }
  }

  // Strategy functions note -- only flag if the script actually calls entry/exit/order/close
  if (/\bpinescript\.strategyEntry\b/.test(code) || /\bpinescript\.strategyClose\b/.test(code) || /\bpinescript\.strategyExit\b/.test(code) || /\bpinescript\.strategyOrder\b/.test(code)) {
    suggestions.push(
      'This script uses strategy functions (entry, exit, order, etc.). Note that full backtesting support is not yet available -- strategy calls will be stubbed but will not simulate trades.'
    );
  }

  // Series safety
  if (report.warnings.some((w) => /pinescript\.offset/i.test(w))) {
    suggestions.push(
      'Replace direct bracket indexing on series data (e.g. close[1]) with pinescript.offset(close, 1) to ensure correct historical lookback behavior.'
    );
  }

  // State persistence
  if (report.warnings.some((w) => /state variable.*rarely referenced/i.test(w))) {
    suggestions.push(
      'Some state variables appear under-used. Verify that PineScript "var" declarations were fully mapped to the state persistence pattern.'
    );
  }

  return suggestions;
}

// ---------------------------------------------------------------------------
// Main review function
// ---------------------------------------------------------------------------

export async function reviewGeneratedCode(code, opts = {}) {
  const options = {
    executeImport: opts.executeImport ?? true,
    ai: opts.ai ?? false
  };

  const report = { ok: true, errors: [], warnings: [], notes: [], suggestions: [], confidence: 0 };

  // 1) Syntax check
  try {
    if (typeof vm.SourceTextModule === 'function') {
      new vm.SourceTextModule(code);
    } else {
      const codeForParse = code
        .replace(/^\s*export\s+default\s+/gm, '')
        .replace(/^\s*export\s+(async\s+)?function\s+/gm, '$1function ')
        .replace(/^\s*export\s+(const|let|var)\s+/gm, '$1 ')
        .replace(/^\s*export\s*\{[^}]*\}\s*;?\s*$/gm, '');
      // eslint-disable-next-line no-new-func
      new Function(codeForParse);
      report.notes.push('Used fallback syntax check (vm.SourceTextModule unavailable; exports stripped).');
    }
  } catch (e) {
    report.ok = false;
    report.errors.push(`Syntax/parse error: ${e?.message || String(e)}`);
    report.confidence = 0;
    return report;
  }

  // 2) Built-in verification
  const used = extractPinescriptMembers(code);
  const builtinKeys = new Set(Array.from(runtimeBuiltins.keys()));
  const allowed = allowedMembers();
  const missing = used.filter((m) => !builtinKeys.has(m) && !allowed.has(m));
  if (missing.length) {
    report.warnings.push(
      `Possibly missing runtime builtins/mappings: ${missing.slice(0, 30).join(', ')}${missing.length > 30 ? ' ...' : ''}`
    );
  }

  // 3) Import smoke test
  if (options.executeImport) {
    try {
      const encoded = encodeURIComponent(code);
      const url = `data:text/javascript;charset=utf-8,${encoded}`;
      globalThis.open ??= [];
      globalThis.high ??= [];
      globalThis.low ??= [];
      globalThis.close ??= [];
      globalThis.volume ??= [];
      globalThis.time ??= [];
      await import(url);
    } catch (e) {
      report.ok = false;
      report.errors.push(`Runtime import error: ${e?.message || String(e)}`);
    }
  }

  // 4) Completeness check
  const completenessWarnings = checkCompleteness(code);
  report.warnings.push(...completenessWarnings);

  // 5) Undefined function references
  const undefinedFnWarnings = checkUndefinedFunctions(code);
  report.warnings.push(...undefinedFnWarnings);

  // 6) Series safety check
  const seriesWarnings = checkSeriesSafety(code);
  report.warnings.push(...seriesWarnings);

  // 7) State persistence check
  const stateWarnings = checkStatePersistence(code);
  report.warnings.push(...stateWarnings);

  // 8) AI review (optional)
  if (options.ai) {
    const python = process.env.PINE_REVIEWER_PYTHON || 'python';
    const script = process.env.PINE_REVIEWER_SCRIPT || 'ai_reviewer/review.py';
    try {
      const input = JSON.stringify({ code: buildAiReviewSnippet(code) });

      const payload = await new Promise((resolve, reject) => {
        const child = spawn(python, [script], {
          stdio: ['pipe', 'pipe', 'pipe'],
          env: {
            ...process.env,
            HF_HUB_DISABLE_SYMLINKS_WARNING: process.env.HF_HUB_DISABLE_SYMLINKS_WARNING ?? '1',
            TRANSFORMERS_VERBOSITY: process.env.TRANSFORMERS_VERBOSITY ?? 'error',
            TF_CPP_MIN_LOG_LEVEL: process.env.TF_CPP_MIN_LOG_LEVEL ?? '3',
            TOKENIZERS_PARALLELISM: process.env.TOKENIZERS_PARALLELISM ?? 'false',
            PYTHONWARNINGS: process.env.PYTHONWARNINGS ?? 'ignore',
            TRANSFORMERS_NO_TF: process.env.TRANSFORMERS_NO_TF ?? '1',
            TRANSFORMERS_NO_FLAX: process.env.TRANSFORMERS_NO_FLAX ?? '1'
          }
        });
        let stdout = '';
        let stderr = '';

        const start = Date.now();
        const spinnerFrames = ['|', '/', '-', '\\'];
        let spinnerIdx = 0;
        const spinner = setInterval(() => {
          const elapsedSec = Math.floor((Date.now() - start) / 1000);
          const frame = spinnerFrames[spinnerIdx++ % spinnerFrames.length];
          process.stderr.write(`\r[ai-review] ${frame} running... ${elapsedSec}s`);
        }, 250);

        const clearSpinnerLine = () => {
          process.stderr.write('\r\x1b[2K');
        };

        child.stdout.setEncoding('utf8');
        child.stderr.setEncoding('utf8');

        child.stdout.on('data', (d) => {
          stdout += d;
        });
        child.stderr.on('data', (d) => {
          stderr += d;
          clearSpinnerLine();
          process.stderr.write(d);
        });

        child.on('error', (err) => reject(err));
        child.on('close', (code) => {
          clearInterval(spinner);
          clearSpinnerLine();
          if (code !== 0) {
            const msg = `AI reviewer exited with code ${code}${stderr ? `\n${stderr}` : ''}`;
            reject(new Error(msg));
            return;
          }

          try {
            resolve(JSON.parse(stdout || '{}'));
          } catch (e) {
            reject(new Error(`AI reviewer returned invalid JSON: ${e?.message || String(e)}${stdout ? `\n${stdout}` : ''}`));
          }
        });

        child.stdin.write(input);
        child.stdin.end();
      });

      if (payload && typeof payload === 'object') {
        if (Array.isArray(payload.errors)) report.errors.push(...payload.errors.map(String));
        if (Array.isArray(payload.warnings)) report.warnings.push(...payload.warnings.map(String));
        if (Array.isArray(payload.notes)) report.notes.push(...payload.notes.map(String));
        if (payload.ok === false) report.ok = false;
      } else {
        report.warnings.push('AI review returned non-object JSON.');
      }
    } catch (e) {
      report.notes.push(
        `AI review unavailable: ${e?.message || String(e)} (install optional deps: pip install -r ai_reviewer/requirements.txt)`
      );
    }
  }

  // 9) Generate suggestions
  report.suggestions = generateSuggestions(code, report);

  // 10) Compute confidence score
  report.confidence = computeConfidence(report);

  return report;
}

export function formatReviewReport(r) {
  const status = r.ok ? 'PASS' : 'FAIL';
  const confidence = typeof r.confidence === 'number' ? r.confidence : '--';
  const out = [`Review Result: ${status} (confidence: ${confidence}/100)`, ''];

  if (r.errors.length) {
    out.push('Errors:');
    for (const e of r.errors) out.push(`  - ${e}`);
    out.push('');
  }

  if (r.warnings.length) {
    out.push('Warnings:');
    for (const w of r.warnings) out.push(`  - ${w}`);
    out.push('');
  }

  if (r.suggestions && r.suggestions.length) {
    out.push('Suggestions:');
    for (const s of r.suggestions) out.push(`  - ${s}`);
    out.push('');
  }

  if (r.notes.length) {
    out.push('Notes:');
    for (const n of r.notes) out.push(`  - ${n}`);
    out.push('');
  }

  return out.join('\n').trimEnd();
}
