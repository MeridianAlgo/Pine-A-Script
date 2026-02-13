import vm from 'node:vm';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { builtins as runtimeBuiltins } from './builtins.js';

const execFileAsync = promisify(execFile);

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
      const input = JSON.stringify({ code });
      const { stdout } = await execFileAsync(python, [script], { input, maxBuffer: 10 * 1024 * 1024 });
      const payload = JSON.parse(stdout || '{}');
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
