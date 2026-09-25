'use strict';
// Installs, starts, stops and inspects projects. State for each project lives in
// <project>/.osa/: run.json (pid, port), state.json (what was installed), logs/.

const { spawn, execFile, execFileSync } = require('node:child_process');
const crypto = require('node:crypto');
const fs = require('node:fs');
const http = require('node:http');
const os = require('node:os');
const path = require('node:path');

const { pickCommand } = require('./manifest');
const { ensureEnv, resolveSet } = require('./env');
const { findFreePort } = require('./ports');

const DEPENDENCY_FILES = [
  'package.json', 'package-lock.json', 'npm-shrinkwrap.json', 'pnpm-lock.yaml', 'yarn.lock', 'bun.lockb',
  'requirements.txt', 'pyproject.toml', 'poetry.lock', 'uv.lock', 'Pipfile.lock',
  'go.mod', 'go.sum', 'Cargo.toml', 'Cargo.lock', 'Gemfile.lock', 'composer.lock',
];

const HELP_LINKS = {
  node: 'https://nodejs.org (choose the LTS version)',
  python: 'https://www.python.org/downloads/',
  go: 'https://go.dev/dl/',
  rust: 'https://rustup.rs',
};

class FriendlyError extends Error {
  constructor(message, detail = '') {
    super(message);
    this.detail = detail;
  }
}

const stateDir = (dir) => path.join(dir, '.osa');
const logsDir = (dir) => path.join(stateDir(dir), 'logs');
const runFile = (dir) => path.join(stateDir(dir), 'run.json');
const stateFile = (dir) => path.join(stateDir(dir), 'state.json');

function readJson(file, fallback) {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch {
    return fallback;
  }
}

function writeJson(file, value) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(value, null, 2) + '\n');
}

// Apps are started as the leader of their own process group (POSIX), so the group
// is what counts: it lives as long as any part of the app does.
function isAlive(pid) {
  if (!pid) return false;
  try {
    process.kill(process.platform === 'win32' ? pid : -pid, 0);
    return true;
  } catch (err) {
    return err.code === 'EPERM';
  }
}

// A run.json written before the computer last started is stale, even if its PID has
// since been reused by something else. Never treat that process as ours.
function startedThisBoot(run) {
  const bootedAt = Date.now() - os.uptime() * 1000;
  const startedAt = Date.parse(run.startedAt);
  return Number.isFinite(startedAt) && startedAt > bootedAt - 120000;
}

function isOurs(run) {
  return Boolean(run) && startedThisBoot(run) && isAlive(run.pid);
}

// ---- prerequisites ------------------------------------------------------------

function minVersion(spec) {
  const m = String(spec).match(/(\d+)(?:\.(\d+))?/);
  return m ? [Number(m[1]), Number(m[2] || 0)] : [0, 0];
}

function versionOf(commands) {
  for (const [cmd, args] of commands) {
    try {
      const out = execFileSync(cmd, args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], timeout: 10000 });
      const m = out.match(/(\d+)\.(\d+)/);
      if (m) return [Number(m[1]), Number(m[2])];
    } catch {
      /* try the next candidate */
    }
  }
  return null;
}

function checkRequirements(requires) {
  const problems = [];
  for (const [tool, spec] of Object.entries(requires || {})) {
    let have;
    if (tool === 'node') have = process.versions.node.split('.').map(Number);
    else if (tool === 'python') have = versionOf(process.platform === 'win32' ? [['py', ['--version']], ['python', ['--version']]] : [['python3', ['--version']], ['python', ['--version']]]);
    else if (tool === 'go') have = versionOf([['go', ['version']]]);
    else if (tool === 'rust' || tool === 'cargo') have = versionOf([['cargo', ['--version']]]);
    else have = versionOf([[tool, ['--version']]]);
    const [needMajor, needMinor] = minVersion(spec);
    const link = HELP_LINKS[tool === 'cargo' ? 'rust' : tool];
    if (!have) problems.push(`This project needs ${tool} ${spec}, which isn't installed.${link ? ` Get it from ${link}, then try again.` : ''}`);
    else if (have[0] < needMajor || (have[0] === needMajor && have[1] < needMinor)) {
      problems.push(`This project needs ${tool} ${spec}, but version ${have.join('.')} is installed.${link ? ` Update it from ${link}.` : ''}`);
    }
  }
  return problems;
}

// ---- install --------------------------------------------------------------------

function dependencyHash(dir, manifest) {
  const h = crypto.createHash('sha256');
  h.update(JSON.stringify([pickCommand(manifest.install), pickCommand(manifest.setup)]));
  for (const f of DEPENDENCY_FILES) {
    const p = path.join(dir, f);
    if (fs.existsSync(p)) h.update(f).update(fs.readFileSync(p));
  }
  return h.digest('hex');
}

function needsInstall(dir, manifest) {
  if (!pickCommand(manifest.install)) return false;
  const state = readJson(stateFile(dir), {});
  if (state.installed !== dependencyHash(dir, manifest)) return true;
  // Dependencies deleted by hand (for example to free disk space) should be reinstalled.
  if (fs.existsSync(path.join(dir, 'package.json')) && !fs.existsSync(path.join(dir, 'node_modules'))) return true;
  return false;
}

function tail(file, lines = 40) {
  try {
    const text = fs.readFileSync(file, 'utf8');
    return text.split(/\r?\n/).slice(-lines).join('\n').trim();
  } catch {
    return '';
  }
}

function runToCompletion(command, { cwd, env, logName }) {
  fs.mkdirSync(logsDir(cwd), { recursive: true });
  const logPath = path.join(logsDir(cwd), logName);
  const fd = fs.openSync(logPath, 'w');
  return new Promise((resolve, reject) => {
    const child = spawn(command, { cwd, env, shell: true, stdio: ['ignore', fd, fd], windowsHide: true });
    child.on('error', (err) => {
      fs.closeSync(fd);
      reject(new FriendlyError(`Couldn't run "${command}": ${err.message}`));
    });
    child.on('exit', (code) => {
      fs.closeSync(fd);
      if (code === 0) resolve();
      else reject(new FriendlyError(`"${command}" failed (exit code ${code}).`, tail(logPath)));
    });
  });
}

async function install(dir, manifest, { force = false } = {}) {
  const cmd = pickCommand(manifest.install);
  if (!cmd || (!force && !needsInstall(dir, manifest))) return false;
  await runToCompletion(cmd, { cwd: dir, env: process.env, logName: 'install.log' });
  const state = readJson(stateFile(dir), {});
  writeJson(stateFile(dir), { ...state, installed: dependencyHash(dir, manifest), installedAt: new Date().toISOString() });
  return true;
}

// ---- status -----------------------------------------------------------------------

function status(dir) {
  const run = readJson(runFile(dir), null);
  if (isOurs(run)) return { state: 'running', ...run };
  if (run) fs.rmSync(runFile(dir), { force: true });
  return { state: 'stopped' };
}

function httpUpOn(host, port, pathname) {
  return new Promise((resolve) => {
    const req = http.get({ host, port, path: pathname, timeout: 2000, headers: { host: `localhost:${port}` } }, (res) => {
      res.resume();
      resolve(res.statusCode < 500);
    });
    req.on('timeout', () => req.destroy());
    req.on('error', () => resolve(false));
  });
}

// "localhost" can mean 127.0.0.1 or ::1, and an app may listen on only one of them.
async function httpUp(port, pathname = '/') {
  return (await httpUpOn('127.0.0.1', port, pathname)) || httpUpOn('::1', port, pathname);
}

// ---- start / stop ---------------------------------------------------------------------

async function start(dir, manifest, { onPhase = () => {}, takenPorts = new Set(), timeoutMs = 120000 } = {}) {
  const current = status(dir);
  if (current.state === 'running') return { ...current, alreadyRunning: true, reveal: ensureEnv(dir, manifest.env).reveal };
  if (manifest.kind !== 'web') throw new FriendlyError('This project has nothing to start: it is a command-line tool or library. Open its folder to use it.');

  const problems = checkRequirements(manifest.requires);
  if (problems.length) throw new FriendlyError(problems.join(' '));

  if (needsInstall(dir, manifest)) {
    onPhase('installing');
    await install(dir, manifest);
  }

  const { reveal } = ensureEnv(dir, manifest.env);
  const port = await findFreePort(manifest.port, takenPorts);
  const env = { ...process.env, ...resolveSet(manifest.env.set, port), [manifest.portEnv]: String(port) };

  const setup = pickCommand(manifest.setup);
  if (setup) {
    onPhase('preparing');
    await runToCompletion(setup, { cwd: dir, env, logName: 'setup.log' });
  }

  onPhase('starting');
  fs.mkdirSync(logsDir(dir), { recursive: true });
  const logPath = path.join(logsDir(dir), 'app.log');
  const fd = fs.openSync(logPath, 'w');
  const child = spawn(pickCommand(manifest.start), {
    cwd: dir,
    env,
    shell: true,
    // POSIX: its own process group, so stop() ends the whole tree and closing the
    // launcher's window doesn't. Windows: its own hidden console, for the same reason.
    detached: true,
    stdio: ['ignore', fd, fd],
    windowsHide: true,
  });
  fs.closeSync(fd);
  let exited = null;
  child.on('exit', (code) => { exited = code ?? 'signal'; });
  child.on('error', (err) => { exited = err.message; });
  child.unref();

  const openPath = manifest.open.startsWith('/') ? manifest.open : `/${manifest.open}`;
  const url = `http://localhost:${port}${openPath}`;
  const run = { pid: child.pid, port, url, startedAt: new Date().toISOString() };
  writeJson(runFile(dir), run);

  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    if (exited !== null) {
      fs.rmSync(runFile(dir), { force: true });
      throw new FriendlyError('The app stopped right after starting.', tail(logPath));
    }
    if (await httpUp(port, openPath)) {
      return { state: 'running', ...run, reveal };
    }
    await new Promise((r) => setTimeout(r, 500));
  }
  await stop(dir);
  throw new FriendlyError(`The app didn't respond on port ${port} within ${Math.round(timeoutMs / 1000)} seconds.`, tail(logPath));
}

function killTree(pid, signal) {
  if (process.platform === 'win32') {
    return new Promise((resolve) => execFile('taskkill', ['/PID', String(pid), '/T', '/F'], () => resolve()));
  }
  try {
    process.kill(-pid, signal); // the whole process group, and nothing else
  } catch { /* already gone */ }
  return Promise.resolve();
}

async function stop(dir) {
  const run = readJson(runFile(dir), null);
  if (!isOurs(run)) {
    fs.rmSync(runFile(dir), { force: true });
    return false;
  }
  await killTree(run.pid, 'SIGTERM');
  const deadline = Date.now() + 8000;
  while (Date.now() < deadline && isAlive(run.pid)) await new Promise((r) => setTimeout(r, 200));
  if (isAlive(run.pid)) await killTree(run.pid, 'SIGKILL');
  fs.rmSync(runFile(dir), { force: true });
  return true;
}

function logs(dir, lines = 200) {
  const app = tail(path.join(logsDir(dir), 'app.log'), lines);
  const installLog = tail(path.join(logsDir(dir), 'install.log'), lines);
  const setupLog = tail(path.join(logsDir(dir), 'setup.log'), lines);
  return { app, install: installLog, setup: setupLog };
}

module.exports = { FriendlyError, checkRequirements, needsInstall, install, status, start, stop, logs, httpUp, dependencyHash };
