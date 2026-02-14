'use client';

import { useMemo, useState } from 'react';

function sanitizeFilename(input) {
  const base = (input || '').trim();
  const cleaned = base
    .replace(/\.pine$/i, '')
    .replace(/[^a-zA-Z0-9._-]+/g, '_')
    .replace(/^_+|_+$/g, '');
  return cleaned || 'example';
}

export default function Page() {
  const [filename, setFilename] = useState('example');
  const [code, setCode] = useState("//@version=5\nindicator('Example', overlay=true)\nplot(close)\n");
  const [status, setStatus] = useState(null);
  const [saving, setSaving] = useState(false);

  const effectiveFilename = useMemo(() => sanitizeFilename(filename), [filename]);

  async function onSave() {
    setSaving(true);
    setStatus(null);
    try {
      const res = await fetch('/api/save-example', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ filename: effectiveFilename, code })
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || `HTTP ${res.status}`);
      setStatus({ type: 'ok', message: `Saved examples/${data.savedAs}` });
    } catch (e) {
      setStatus({ type: 'err', message: e?.message || String(e) });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <header style={{ padding: 16, borderBottom: '1px solid #e5e7eb', display: 'flex', gap: 12, alignItems: 'center' }}>
        <div style={{ fontWeight: 700 }}>Pine Paster</div>
        <div style={{ flex: 1 }} />
        <label style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <span style={{ color: '#374151', fontSize: 13 }}>Filename</span>
          <input
            value={filename}
            onChange={(e) => setFilename(e.target.value)}
            placeholder="harmonicforecast"
            style={{ padding: '8px 10px', border: '1px solid #d1d5db', borderRadius: 8, minWidth: 240 }}
          />
        </label>
        <button
          onClick={onSave}
          disabled={saving}
          style={{
            padding: '8px 12px',
            borderRadius: 8,
            border: '1px solid #111827',
            background: saving ? '#9ca3af' : '#111827',
            color: 'white',
            cursor: saving ? 'not-allowed' : 'pointer'
          }}
        >
          {saving ? 'Saving…' : 'Save to examples/'}
        </button>
      </header>

      {status ? (
        <div
          style={{
            padding: 12,
            borderBottom: '1px solid #e5e7eb',
            background: status.type === 'ok' ? '#ecfdf5' : '#fef2f2',
            color: status.type === 'ok' ? '#065f46' : '#991b1b'
          }}
        >
          {status.message}
        </div>
      ) : null}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0, flex: 1, minHeight: 0 }}>
        <section style={{ display: 'flex', flexDirection: 'column', minHeight: 0, borderRight: '1px solid #e5e7eb' }}>
          <div style={{ padding: 10, fontSize: 13, color: '#374151', borderBottom: '1px solid #e5e7eb' }}>
            Paste PineScript
          </div>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            spellCheck={false}
            style={{
              flex: 1,
              resize: 'none',
              border: 'none',
              outline: 'none',
              padding: 12,
              fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
              fontSize: 13,
              lineHeight: 1.4
            }}
          />
        </section>

        <section style={{ display: 'flex', flexDirection: 'column', minHeight: 0 }}>
          <div style={{ padding: 10, fontSize: 13, color: '#374151', borderBottom: '1px solid #e5e7eb' }}>
            Preview (read-only)
          </div>
          <pre
            style={{
              flex: 1,
              margin: 0,
              overflow: 'auto',
              padding: 12,
              background: '#0b1020',
              color: '#e5e7eb',
              fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
              fontSize: 13,
              lineHeight: 1.4
            }}
          >
            {code}
          </pre>
          <div style={{ padding: 10, borderTop: '1px solid #e5e7eb', fontSize: 12, color: '#6b7280' }}>
            Saving as: <code>examples/{effectiveFilename}.pine</code>
          </div>
        </section>
      </div>
    </div>
  );
}
