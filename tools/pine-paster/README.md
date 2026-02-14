# Pine Paster (dev tool)

Local Next.js UI to paste PineScript and save it into the repo `examples/` folder.

## Run

```bash
cd tools/pine-paster
npm install
npm run dev
```

Open http://localhost:3000

## Notes

- Saves files to: `examples/<filename>.pine` (relative to repo root)
- Filenames are sanitized to prevent path traversal
