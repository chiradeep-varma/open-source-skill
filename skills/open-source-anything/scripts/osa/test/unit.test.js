'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const net = require('node:net');
const path = require('node:path');

const { pickCommand, loadManifest, discover, addToRegistry, ManifestError } = require('../lib/manifest');
const env = require('../lib/env');
const { findFreePort } = require('../lib/ports');
const { projectsHome } = require('../lib/home');
const { setup } = require('../lib/setup');
const { tempHome, makeProject } = require('./helpers');

test('pickCommand handles strings and per-platform objects', () => {
  assert.equal(pickCommand('npm start'), 'npm start');
  assert.equal(pickCommand({ default: 'a', win32: 'b' }, 'win32'), 'b');
  assert.equal(pickCommand({ default: 'a', win32: 'b' }, 'linux'), 'a');
  assert.equal(pickCommand(null), null);
});

test('loadManifest validates with readable errors', () => {
  const home = tempHome();
  const dir = path.join(home, 'x');
  fs.mkdirSync(dir);
  fs.writeFileSync(path.join(dir, 'osa.json'), JSON.stringify({ name: 'bad name!', kind: 'web' }));
  assert.throws(() => loadManifest(dir), (err) => err instanceof ManifestError && /name/.test(err.message) && /start/.test(err.message));
  fs.writeFileSync(path.join(dir, 'osa.json'), '{ not json');
  assert.throws(() => loadManifest(dir), /not valid JSON/);
});

test('loadManifest fills defaults', () => {
  const home = tempHome();
  const dir = makeProject(home, 'amber-otter');
  const m = loadManifest(dir);
  assert.equal(m.kind, 'web');
  assert.equal(m.portEnv, 'PORT');
  assert.equal(m.open, '/');
  assert.deepEqual(m.env.reveal, ['ADMIN_PASSWORD']);
});

test('discover finds projects, skips hidden folders, reports broken ones and includes registered extras', () => {
  const home = tempHome();
  makeProject(home, 'amber-otter');
  fs.mkdirSync(path.join(home, '.launcher'));
  fs.mkdirSync(path.join(home, 'broken'));
  fs.writeFileSync(path.join(home, 'broken', 'osa.json'), '{}');
  fs.mkdirSync(path.join(home, 'not-a-project'));
  const elsewhere = tempHome();
  const extra = makeProject(elsewhere, 'quiet-harbor');
  addToRegistry(home, extra);
  const found = discover(home);
  assert.deepEqual(found.map((p) => p.id).sort(), ['amber-otter', 'broken', 'quiet-harbor']);
  assert.ok(found.find((p) => p.id === 'broken').error);
});

test('ensureEnv copies the example, fills placeholders, keeps existing values', () => {
  const home = tempHome();
  const dir = makeProject(home, 'amber-otter');
  const spec = loadManifest(dir).env;
  const first = env.ensureEnv(dir, spec);
  assert.equal(first.created, true);
  const values = env.parse(fs.readFileSync(path.join(dir, '.env'), 'utf8'));
  assert.equal(values.SESSION_SECRET.length, 64);
  assert.match(values.ADMIN_PASSWORD, /^[a-z2-9]{4}(-[a-z2-9]{4}){3}$/);
  assert.equal(values.KEEP, 'me');
  assert.ok(fs.readFileSync(path.join(dir, '.env'), 'utf8').includes('# settings'));
  assert.deepEqual(first.reveal, { ADMIN_PASSWORD: values.ADMIN_PASSWORD });

  const second = env.ensureEnv(dir, spec);
  assert.deepEqual(second.generated, []);
  assert.equal(env.parse(fs.readFileSync(path.join(dir, '.env'), 'utf8')).SESSION_SECRET, values.SESSION_SECRET);
});

test('resolveSet fills {port}', () => {
  assert.deepEqual(env.resolveSet({ BASE_URL: 'http://localhost:{port}' }, 3001), { BASE_URL: 'http://localhost:3001' });
});

test('findFreePort skips ports in use', async () => {
  const blocker = net.createServer();
  await new Promise((r) => blocker.listen(0, r));
  const busy = blocker.address().port;
  const port = await findFreePort(busy);
  assert.notEqual(port, busy);
  blocker.close();
});

test('projectsHome honours OSA_HOME', () => {
  assert.equal(projectsHome({ OSA_HOME: '/tmp/somewhere' }), path.resolve('/tmp/somewhere'));
  assert.match(projectsHome({}), /open-source-anything$/);
});

test('setup creates the launcher copy, a starter file and a readme', () => {
  const home = path.join(tempHome(), 'projects');
  const mac = setup(home, { platform: 'darwin' });
  assert.ok(fs.existsSync(path.join(home, '.launcher', 'osa.js')));
  assert.ok(fs.existsSync(path.join(home, '.launcher', 'lib', 'runner.js')));
  assert.ok(mac.starter.endsWith('Start projects.command'));
  assert.ok(fs.readFileSync(path.join(home, 'README.txt'), 'utf8').includes('Start projects.command'));
  const win = setup(home, { platform: 'win32' });
  assert.ok(fs.readFileSync(win.starter, 'utf8').includes('.launcher\\osa.js'));
});

test('env values lose surrounding spaces; quoted values keep inner ones', () => {
  assert.deepEqual(env.parse('A=abc   \nB="x y"  \nC=d # note\n'), { A: 'abc', B: 'x y', C: 'd' });
});

test('findFreePort skips a port held on 127.0.0.1 only', async () => {
  const blocker = net.createServer();
  await new Promise((r) => blocker.listen(0, '127.0.0.1', r));
  const busy = blocker.address().port;
  assert.notEqual(await findFreePort(busy), busy);
  blocker.close();
});

test('starter files point the launcher at their own folder', () => {
  const home = path.join(tempHome(), 'projects');
  for (const platform of ['darwin', 'linux', 'win32']) {
    const { starter } = setup(home, { platform });
    assert.match(fs.readFileSync(starter, 'utf8'), /osa\.js" dashboard --home \./);
  }
  assert.match(fs.readFileSync(path.join(home, 'README.txt'), 'utf8'), /Start projects\.cmd/);
  setup(home, { platform: 'linux' });
  assert.match(fs.readFileSync(path.join(home, 'README.txt'), 'utf8'), /Run as a Program/);
});

test('friendlyPath shortens the home folder on macOS and Linux only', () => {
  const { friendlyPath } = require('../lib/dashboard');
  assert.equal(friendlyPath('/Users/sam/Documents/open-source-anything', 'darwin', '/Users/sam'), '~/Documents/open-source-anything');
  assert.equal(friendlyPath('/Users/samantha/x', 'darwin', '/Users/sam'), '/Users/samantha/x');
  assert.equal(friendlyPath('C:\\Users\\sam\\x', 'win32', 'C:\\Users\\sam'), 'C:\\Users\\sam\\x');
});

test('a missing browser or file-manager command reports false instead of crashing', async () => {
  const { launchDetached } = require('../lib/dashboard');
  assert.equal(await launchDetached('surely-not-an-installed-opener', ['http://localhost:1/']), false);
  assert.equal(await launchDetached(process.execPath, ['-e', '']), true);
});
