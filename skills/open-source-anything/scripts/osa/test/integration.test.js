'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { execFileSync } = require('node:child_process');
const fs = require('node:fs');
const http = require('node:http');
const os = require('node:os');
const path = require('node:path');

const runner = require('../lib/runner');
const { loadManifest } = require('../lib/manifest');
const { createDashboard } = require('../lib/dashboard');
const { setup } = require('../lib/setup');
const { tempHome, makeProject } = require('./helpers');

const get = (url, headers = {}) => new Promise((resolve, reject) => {
  http.get(url, { headers }, (res) => {
    let body = '';
    res.on('data', (c) => { body += c; });
    res.on('end', () => resolve({ status: res.statusCode, body }));
  }).on('error', reject);
});

const request = (port, method, p, headers = {}) => new Promise((resolve, reject) => {
  const req = http.request({ host: '127.0.0.1', port, method, path: p, headers: { host: `localhost:${port}`, ...headers } }, (res) => {
    let body = '';
    res.on('data', (c) => { body += c; });
    res.on('end', () => resolve({ status: res.statusCode, body }));
  });
  req.on('error', reject);
  req.end();
});

test('start installs once, generates secrets, serves, and stop ends the process', async () => {
  const home = tempHome();
  const dir = makeProject(home, 'amber-otter');
  const m = loadManifest(dir);
  const phases = [];

  const r = await runner.start(dir, m, { onPhase: (p) => phases.push(p) });
  assert.deepEqual(phases, ['installing', 'starting']);
  assert.equal(r.state, 'running');
  assert.ok(r.reveal.ADMIN_PASSWORD);
  const res = await get(r.url);
  assert.equal(res.body, `ok 64 http://localhost:${r.port}`);
  assert.equal(runner.status(dir).state, 'running');

  assert.equal(await runner.stop(dir), true);
  assert.equal(runner.status(dir).state, 'stopped');
  await assert.rejects(get(r.url));

  // Second start: no reinstall, same secret.
  const secret = fs.readFileSync(path.join(dir, '.env'), 'utf8');
  const phases2 = [];
  const r2 = await runner.start(dir, m, { onPhase: (p) => phases2.push(p) });
  assert.deepEqual(phases2, ['starting']);
  assert.equal(fs.readFileSync(path.join(dir, 'installs.txt'), 'utf8'), 'x');
  assert.equal(fs.readFileSync(path.join(dir, '.env'), 'utf8'), secret);
  await runner.stop(r2 && dir);
});

test('a crashing app gives a friendly error with the log tail', async () => {
  const home = tempHome();
  const dir = makeProject(home, 'crashy', { crash: true });
  await assert.rejects(runner.start(dir, loadManifest(dir)), (err) => /stopped right after starting/.test(err.message) && /boom: missing config/.test(err.detail));
  assert.equal(runner.status(dir).state, 'stopped');
});

test('a failing install explains what failed', async () => {
  const home = tempHome();
  const dir = makeProject(home, 'badinstall', { manifest: { install: 'node -e "console.error(\'npm ERR! missing thing\'); process.exit(3)"' } });
  await assert.rejects(runner.start(dir, loadManifest(dir)), (err) => /exit code 3/.test(err.message) && /missing thing/.test(err.detail));
});

test('missing requirements are reported in plain words', () => {
  const problems = runner.checkRequirements({ node: '>=999', 'surely-not-installed-tool': '1' });
  assert.equal(problems.length, 2);
  assert.match(problems[0], /needs node >=999, but version/);
  assert.match(problems[1], /isn't installed/);
});

test('dashboard lists projects and refuses actions without the token or from other hosts', async () => {
  const home = tempHome();
  makeProject(home, 'amber-otter');
  const { server, token } = createDashboard({ home });
  await new Promise((r) => server.listen(0, '127.0.0.1', r));
  const { port } = server.address();
  try {
    const list = JSON.parse((await request(port, 'GET', '/api/projects')).body);
    assert.equal(list.projects[0].name, 'amber-otter');
    assert.equal(list.projects[0].state, 'stopped');

    assert.equal((await request(port, 'POST', '/api/projects/amber-otter/start')).status, 403);
    assert.equal((await request(port, 'GET', '/api/projects', { host: 'evil.example:80' })).status, 403);

    const page = (await request(port, 'GET', '/')).body;
    assert.ok(page.includes(token) && !page.includes('__OSA_TOKEN__'));

    assert.equal((await request(port, 'POST', '/api/projects/amber-otter/start', { 'x-osa-token': token })).status, 202);
    let state;
    for (let i = 0; i < 60; i++) {
      state = JSON.parse((await request(port, 'GET', '/api/projects')).body).projects[0];
      if (state.state === 'running' || state.state === 'error') break;
      await new Promise((r) => setTimeout(r, 250));
    }
    assert.equal(state.state, 'running');
    assert.ok(state.reveal.ADMIN_PASSWORD);
    assert.equal((await request(port, 'POST', '/api/stop-all', { 'x-osa-token': token })).status, 200);
    assert.equal(JSON.parse((await request(port, 'GET', '/api/projects')).body).projects[0].state, 'stopped');
  } finally {
    server.close();
  }
});

test('the launcher copy in a projects folder manages that folder, wherever it runs from', () => {
  const home = path.join(tempHome(), 'my projects');
  setup(home);
  makeProject(home, 'amber-otter');
  const run = (...args) => execFileSync(process.execPath, [path.join(home, '.launcher', 'osa.js'), ...args], {
    cwd: os.tmpdir(),
    env: { ...process.env, OSA_HOME: path.join(os.tmpdir(), 'somewhere-else') },
    encoding: 'utf8',
  });
  // Node reports the launcher's real path (macOS's /tmp is a symlink; Windows expands short names).
  assert.equal(fs.realpathSync(run('where').trim()), fs.realpathSync(home));
  assert.match(run('list'), /^amber-otter\s+stopped/);
});

test('a run record from before the last boot is ignored, and stop never touches that PID', async () => {
  const home = tempHome();
  const dir = makeProject(home, 'amber-otter');
  fs.mkdirSync(path.join(dir, '.osa'), { recursive: true });
  // This test process is alive; after a reboot its PID could belong to anything.
  fs.writeFileSync(path.join(dir, '.osa', 'run.json'), JSON.stringify({ pid: process.pid, port: 1, url: 'http://localhost:1/', startedAt: '2001-01-01T00:00:00.000Z' }));
  assert.equal(runner.status(dir).state, 'stopped');
  fs.writeFileSync(path.join(dir, '.osa', 'run.json'), JSON.stringify({ pid: process.pid, port: 1, url: 'http://localhost:1/', startedAt: '2001-01-01T00:00:00.000Z' }));
  assert.equal(await runner.stop(dir), false);
  assert.equal(fs.existsSync(path.join(dir, '.osa', 'run.json')), false);
});

test('an app listening only on IPv6 localhost counts as up', async (t) => {
  const server = http.createServer((req, res) => res.end('ok'));
  try {
    await new Promise((resolve, reject) => { server.once('error', reject); server.listen(0, '::1', resolve); });
  } catch {
    t.skip('IPv6 is not available here');
    return;
  }
  try {
    assert.equal(await runner.httpUp(server.address().port, '/'), true);
  } finally {
    server.close();
  }
});
