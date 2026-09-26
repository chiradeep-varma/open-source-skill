'use strict';
// A small local web page listing every project, with Start / Stop / Open.
// It binds to localhost only, and every action needs a per-session token plus a
// matching Host header, so other websites can't drive it.

const crypto = require('node:crypto');
const fs = require('node:fs');
const http = require('node:http');
const os = require('node:os');
const path = require('node:path');
const { spawn } = require('node:child_process');

const { discover } = require('./manifest');
const runner = require('./runner');
const env = require('./env');

const DEFAULT_PORT = 4747;

// "~/Documents/open-source-anything" reads better than a full path on macOS and Linux.
function friendlyPath(p, platform = process.platform, home = os.homedir()) {
  if (platform === 'win32' || !home || !p.startsWith(`${home}/`)) return p;
  return `~${p.slice(home.length)}`;
}

// Runs a command in the background and resolves to whether it could start. A missing
// command (say, Linux without xdg-open) reports false instead of crashing the launcher.
function launchDetached(cmd, args) {
  return new Promise((resolve) => {
    try {
      const child = spawn(cmd, args, { detached: true, stdio: 'ignore', windowsHide: true });
      child.once('spawn', () => { child.unref(); resolve(true); });
      child.once('error', () => resolve(false));
    } catch {
      resolve(false);
    }
  });
}

// Opens a URL in the default browser, or a folder in the file manager.
function openExternal(target) {
  const [cmd, args] =
    process.platform === 'darwin' ? ['open', [target]]
      : process.platform === 'win32' ? ['explorer.exe', [target]] // opens URLs in the default browser, folders in Explorer
        : ['xdg-open', [target]];
  return launchDetached(cmd, args);
}

function createDashboard({ home }) {
  const token = crypto.randomBytes(24).toString('hex');
  const busy = new Map(); // id -> { phase, error, detail }
  const page = fs.readFileSync(path.join(__dirname, '..', 'dashboard.html'), 'utf8');

  function snapshot() {
    const projects = discover(home).map((p) => {
      const base = { id: p.id, dir: p.dir, name: p.manifest?.name ?? p.id, summary: p.manifest?.summary ?? '', kind: p.manifest?.kind ?? 'other', usage: p.manifest?.usage ?? '' };
      // The row already names the project, so drop its folder from the message.
      if (p.error) return { ...base, state: 'broken', error: p.error.split(p.dir + path.sep).join('') };
      const b = busy.get(p.id);
      const s = runner.status(p.dir);
      const out = { ...base, state: s.state, url: s.url ?? null, port: s.port ?? null };
      if (b?.phase) out.state = b.phase;
      if (b?.error && s.state !== 'running') Object.assign(out, { state: 'error', error: b.error, detail: b.detail });
      if (out.state === 'running' && p.manifest.env.reveal.length) {
        try {
          const values = env.parse(fs.readFileSync(path.join(p.dir, p.manifest.env.file), 'utf8'));
          out.reveal = Object.fromEntries(p.manifest.env.reveal.filter((k) => values[k]).map((k) => [k, values[k]]));
        } catch { /* no .env yet */ }
      }
      return out;
    });
    return { home, homeLabel: friendlyPath(home), projects };
  }

  function takenPorts() {
    return new Set(discover(home).map((p) => runner.status(p.dir).port).filter(Boolean));
  }

  function find(id) {
    return discover(home).find((p) => p.id === id);
  }

  async function doStart(p) {
    busy.set(p.id, { phase: 'starting' });
    try {
      await runner.start(p.dir, p.manifest, {
        takenPorts: takenPorts(),
        onPhase: (phase) => busy.set(p.id, { phase }),
      });
      busy.delete(p.id);
    } catch (err) {
      busy.set(p.id, { error: err.message, detail: err.detail || '' });
    }
  }

  const server = http.createServer(async (req, res) => {
    const host = req.headers.host || '';
    const addr = server.address();
    const allowed = [`localhost:${addr.port}`, `127.0.0.1:${addr.port}`];
    if (!allowed.includes(host)) {
      res.writeHead(403).end('Forbidden');
      return;
    }
    const url = new URL(req.url, `http://${host}`);
    const send = (code, body, type = 'application/json') => {
      res.writeHead(code, { 'content-type': type, 'cache-control': 'no-store', 'x-content-type-options': 'nosniff' });
      res.end(type === 'application/json' ? JSON.stringify(body) : body);
    };

    if (req.method === 'GET' && url.pathname === '/') {
      return send(200, page.replace('__OSA_TOKEN__', token), 'text/html; charset=utf-8');
    }
    if (req.method === 'GET' && url.pathname === '/api/ping') return send(200, { osa: true });
    if (req.method === 'GET' && url.pathname === '/api/projects') return send(200, snapshot());

    const logMatch = url.pathname.match(/^\/api\/projects\/([^/]+)\/log$/);
    if (req.method === 'GET' && logMatch) {
      const p = find(decodeURIComponent(logMatch[1]));
      return p ? send(200, runner.logs(p.dir, 200)) : send(404, { error: 'Not found' });
    }

    if (req.method !== 'POST') return send(404, { error: 'Not found' });
    if (req.headers['x-osa-token'] !== token) return send(403, { error: 'Forbidden' });

    if (url.pathname === '/api/open-home') {
      fs.mkdirSync(home, { recursive: true });
      return send(200, { ok: await openExternal(home), path: home });
    }
    if (url.pathname === '/api/stop-all') {
      for (const p of discover(home)) if (p.manifest) await runner.stop(p.dir);
      busy.clear();
      return send(200, { ok: true });
    }

    const m = url.pathname.match(/^\/api\/projects\/([^/]+)\/(start|stop|open|folder)$/);
    if (!m) return send(404, { error: 'Not found' });
    const p = find(decodeURIComponent(m[1]));
    if (!p || !p.manifest) return send(404, { error: 'Project not found' });

    switch (m[2]) {
      case 'start':
        if (!busy.get(p.id)?.phase) doStart(p); // runs in the background; the page polls for progress
        return send(202, { ok: true });
      case 'stop':
        busy.set(p.id, { phase: 'stopping' });
        await runner.stop(p.dir);
        busy.delete(p.id);
        return send(200, { ok: true });
      case 'open': {
        const s = runner.status(p.dir);
        return send(200, { ok: s.state === 'running' && (await openExternal(s.url)), url: s.url ?? null });
      }
      case 'folder':
        return send(200, { ok: await openExternal(p.dir), path: p.dir });
    }
  });

  return { server, token };
}

function probe(port) {
  return new Promise((resolve) => {
    const req = http.get({ host: '127.0.0.1', port, path: '/api/ping', timeout: 1500, headers: { host: `localhost:${port}` } }, (res) => {
      let body = '';
      res.on('data', (c) => { body += c; });
      res.on('end', () => {
        try { resolve(JSON.parse(body).osa === true); } catch { resolve(false); }
      });
    });
    req.on('error', () => resolve(false));
    req.on('timeout', () => { req.destroy(); resolve(false); });
  });
}

async function serve({ home, port = DEFAULT_PORT, open = true, log = console.log }) {
  // If the launcher is already running, just bring it up in the browser.
  if (await probe(port)) {
    const url = `http://localhost:${port}/`;
    log(`The launcher is already running at ${url}`);
    if (open && !(await openExternal(url))) log('Open that address in your browser.');
    return null;
  }
  const { server } = createDashboard({ home });
  await new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(port, '127.0.0.1', resolve);
  }).catch(async (err) => {
    if (err.code !== 'EADDRINUSE') throw err;
    await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  });
  const url = `http://localhost:${server.address().port}/`;
  log(`Your projects: ${url}`);
  log(`Projects folder: ${home}`);
  log('Keep this window open while you use the launcher. Your projects keep running if you close it.');
  if (open && !(await openExternal(url))) log(`Couldn't open a browser here. Open ${url} in your browser.`);
  return server;
}

module.exports = { createDashboard, serve, openExternal, launchDetached, friendlyPath, DEFAULT_PORT };
