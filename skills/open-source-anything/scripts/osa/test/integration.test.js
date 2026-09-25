'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');

const runner = require('../lib/runner');
const { loadManifest } = require('../lib/manifest');
const { createDashboard } = require('../lib/dashboard');
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
