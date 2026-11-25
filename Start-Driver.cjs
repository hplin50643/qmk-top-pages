const http = require('node:http');
const path = require('node:path');
const fs = require('node:fs');
const { stat } = require('node:fs/promises');
const { pipeline } = require('node:stream/promises');
const { spawn } = require('node:child_process');

const origin = 'http://127.0.0.1:8765';
const types = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8', '.json': 'application/json; charset=utf-8',
  '.wasm': 'application/wasm', '.svg': 'image/svg+xml', '.ico': 'image/x-icon',
  '.png': 'image/png', '.gif': 'image/gif', '.mp3': 'audio/mpeg', '.ttf': 'font/ttf',
  '.exe': 'application/octet-stream', '.dmg': 'application/octet-stream',
};

const server = http.createServer(async (req, res) => {
  try {
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      res.writeHead(405, { Allow: 'GET, HEAD' }).end();
      return;
    }
    const url = new URL(req.url, origin);
    const route = decodeURIComponent(url.pathname);
    if (route.includes('\\') || route.includes(':') || route.includes('\0') ||
        route.split('/').some(part => part.startsWith('.'))) {
      res.writeHead(404).end();
      return;
    }
    let file = path.join(__dirname, route);
    let info = await stat(file);
    if (info.isDirectory()) {
      if (!route.endsWith('/')) {
        res.writeHead(301, { Location: origin + url.pathname + '/' + url.search }).end();
        return;
      }
      file = path.join(file, 'index.html');
      info = await stat(file);
    }
    const type = types[path.extname(file)];
    if (!info.isFile() || !type) {
      res.writeHead(404).end();
      return;
    }
    res.writeHead(200, { 'Content-Type': type, 'Content-Length': info.size });
    if (req.method === 'HEAD') res.end();
    else await pipeline(fs.createReadStream(file), res);
  } catch (error) {
    if (res.destroyed) return;
    const missing = error.code === 'ENOENT' || error.code === 'ENOTDIR';
    if (!res.headersSent) res.writeHead(missing ? 404 : error instanceof URIError ? 400 : 500);
    res.end();
  }
});

function openBrowser() {
  const browser = spawn('explorer.exe', [origin + '/'], { detached: true, stdio: 'ignore' });
  browser.on('error', error => console.error(error.message));
  browser.unref();
}

const launchBrowser = process.platform === 'win32' && process.argv.includes('--open');
server.on('error', async error => {
  if (error.code === 'EADDRINUSE' && launchBrowser) {
    try {
      const response = await fetch(origin, { signal: AbortSignal.timeout(2000), redirect: 'error' });
      const entry = fs.readFileSync(path.join(__dirname, 'index.html'));
      if (response.ok && Number(response.headers.get('content-length')) === entry.length &&
          Buffer.from(await response.arrayBuffer()).equals(entry)) {
        openBrowser();
        return;
      }
    } catch { /* Report the port conflict below. */ }
  }
  console.error(error.code === 'EADDRINUSE' ? `Port 8765 is already in use. Check ${origin}/` : error.message);
  process.exitCode = 1;
});
server.listen(8765, '127.0.0.1', () => {
  console.log(`Open ${origin}/ in Chrome or Edge. Press Ctrl+C to stop.`);
  if (launchBrowser) openBrowser();
});
