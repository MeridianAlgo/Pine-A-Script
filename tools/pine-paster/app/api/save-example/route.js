import fs from 'node:fs/promises';
import path from 'node:path';

function sanitizeFilename(input) {
  const base = String(input || '').trim();
  const cleaned = base
    .replace(/\.pine$/i, '')
    .replace(/[^a-zA-Z0-9._-]+/g, '_')
    .replace(/^_+|_+$/g, '');
  return cleaned || 'example';
}

export async function POST(req) {
  try {
    const body = await req.json();
    const filename = sanitizeFilename(body?.filename);
    const code = String(body?.code || '');

    if (!code.trim()) {
      return Response.json({ error: 'Missing code' }, { status: 400 });
    }

    // This Next.js app lives in tools/pine-paster; repo root is two levels up.
    const repoRoot = path.resolve(process.cwd(), '..', '..');
    const examplesDir = path.join(repoRoot, 'examples');
    await fs.mkdir(examplesDir, { recursive: true });

    const savedAs = `${filename}.pine`;
    const targetPath = path.join(examplesDir, savedAs);

    // Safety: ensure we only ever write under examples/.
    if (path.relative(examplesDir, targetPath).startsWith('..')) {
      return Response.json({ error: 'Invalid filename' }, { status: 400 });
    }

    await fs.writeFile(targetPath, code, 'utf8');
    return Response.json({ ok: true, savedAs });
  } catch (e) {
    return Response.json({ error: e?.message || String(e) }, { status: 500 });
  }
}
