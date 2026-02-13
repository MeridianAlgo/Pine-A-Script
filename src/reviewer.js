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
    'indicator'
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

export async function reviewGeneratedCode(code, opts = {}) {
  const options = {
    executeImport: opts.executeImport ?? true,
    ai: opts.ai ?? false
  };

  const report = { ok: true, errors: [], warnings: [], notes: [] };

  // 1) Syntax check
  // Prefer vm.SourceTextModule when available (Node >= 12-ish with --experimental-vm-modules
  // or newer). Fallback to Function parsing for older Node where SourceTextModule is absent.
  try {
    if (typeof vm.SourceTextModule === 'function') {
      new vm.SourceTextModule(code);
    } else {
      // Function() parses as script, so strip common ESM export forms first.
      // This is a best-effort check intended to catch obvious syntax errors.
      const codeForParse = code
        // export default <expr>
        .replace(/^\s*export\s+default\s+/gm, '')
        // export function foo() {}
        .replace(/^\s*export\s+(async\s+)?function\s+/gm, '$1function ')
        // export const x = ...
        .replace(/^\s*export\s+(const|let|var)\s+/gm, '$1 ')
        // export { a, b as c };
        .replace(/^\s*export\s*\{[^}]*\}\s*;?\s*$/gm, '');
      // eslint-disable-next-line no-new-func
      new Function(codeForParse);
      report.notes.push('Used fallback syntax check (vm.SourceTextModule unavailable; exports stripped).');
    }
  } catch (e) {
    report.ok = false;
    report.errors.push(`Syntax/parse error: ${e?.message || String(e)}`);
    return report;
  }

  const used = extractPinescriptMembers(code);
  const builtinKeys = new Set(Array.from(runtimeBuiltins.keys()));
  const allowed = allowedMembers();
  const missing = used.filter((m) => !builtinKeys.has(m) && !allowed.has(m));
  if (missing.length) {
    report.warnings.push(
      `Possibly missing runtime builtins/mappings: ${missing.slice(0, 30).join(', ')}${missing.length > 30 ? ' ...' : ''}`
    );
  }

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
          // Clear current line (best-effort) so progress text doesn't mix with logs.
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

  return report;
}

export function formatReviewReport(r) {
  const out = [`Review: ${r.ok ? 'PASS' : 'FAIL'}`];
  if (r.errors.length) out.push('Errors:', ...r.errors.map((x) => `- ${x}`));
  if (r.warnings.length) out.push('Warnings:', ...r.warnings.map((x) => `- ${x}`));
  if (r.notes.length) out.push('Notes:', ...r.notes.map((x) => `- ${x}`));
  return out.join('\n');
}
