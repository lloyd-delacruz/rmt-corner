import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize, resolve } from 'node:path';

const ROOT = resolve('.');
const PORT = 3000;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css':  'text/css; charset=utf-8',
  '.js':   'text/javascript; charset=utf-8',
  '.mjs':  'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg':  'image/svg+xml',
  '.png':  'image/png',
  '.jpg':  'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.ico':  'image/x-icon',
  '.woff': 'font/woff',
  '.woff2':'font/woff2',
  '.txt':  'text/plain; charset=utf-8',
};

const server = createServer(async (req, res) => {
  try {
    const url = new URL(req.url, `http://${req.headers.host}`);
    let pathname = decodeURIComponent(url.pathname);
    if (pathname.endsWith('/')) pathname += 'index.html';

    const filePath = normalize(join(ROOT, pathname));
    if (!filePath.startsWith(ROOT)) {
      res.writeHead(403); return res.end('Forbidden');
    }

    const tryStat = async (p) => { try { return await stat(p); } catch { return null; } };
    let target = filePath;
    let st = await tryStat(target);
    // If the path resolves to a directory, prefer dir/index.html, otherwise fall through to .html sibling.
    if (st && st.isDirectory()) {
      const indexPath = join(target, 'index.html');
      const indexSt = await tryStat(indexPath);
      if (indexSt && indexSt.isFile()) { target = indexPath; st = indexSt; }
      else { st = null; }
    }
    // .html fallback for clean URLs (e.g. /about → /about.html, /blog → /blog.html).
    if (!st || !st.isFile()) {
      const htmlSt = await tryStat(target + '.html');
      if (htmlSt && htmlSt.isFile()) { target = target + '.html'; }
      else { res.writeHead(404); return res.end('Not found'); }
    }

    const data = await readFile(target);
    const type = MIME[extname(target).toLowerCase()] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': type, 'Cache-Control': 'no-store' });
    res.end(data);
  } catch (err) {
    res.writeHead(500); res.end('Server error');
  }
});

server.listen(PORT, () => {
  console.log(`RMT Corner → http://localhost:${PORT}`);
});
