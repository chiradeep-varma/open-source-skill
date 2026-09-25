'use strict';
// Reads and validates osa.json, the small file every project carries so the
// launcher knows how to install, start and open it.

const fs = require('node:fs');
const path = require('node:path');

const MANIFEST = 'osa.json';
const REGISTRY = '.osa-registry.json';
const KINDS = new Set(['web', 'cli', 'desktop', 'other']);

class ManifestError extends Error {}

// A command can be a string, or per-platform: { "default": "...", "win32": "..." }.
function pickCommand(value, platform = process.platform) {
  if (value == null) return null;
  if (typeof value === 'string') return value;
  if (typeof value === 'object') return value[platform] ?? value.default ?? null;
  return null;
}

function asList(value) {
  if (value == null) return [];
  return Array.isArray(value) ? value : [value];
}

function normalize(raw, dir) {
  const problems = [];
  if (!raw || typeof raw !== 'object') throw new ManifestError(`${MANIFEST} must contain a JSON object`);
  const name = typeof raw.name === 'string' ? raw.name.trim() : '';
  if (!name) problems.push('"name" is missing');
  else if (!/^[a-z0-9][a-z0-9._-]*$/i.test(name)) problems.push('"name" should be letters, numbers, dots, dashes or underscores');
  const kind = raw.kind ?? 'web';
  if (!KINDS.has(kind)) problems.push(`"kind" must be one of: ${[...KINDS].join(', ')}`);
  if (kind === 'web' && !pickCommand(raw.start)) problems.push('"start" is missing (the command that runs the app)');
  if (raw.port != null && !(Number.isInteger(raw.port) && raw.port > 0 && raw.port < 65536)) problems.push('"port" must be a whole number between 1 and 65535');
  const env = raw.env ?? {};
  if (typeof env !== 'object' || Array.isArray(env)) problems.push('"env" must be an object');
  if (problems.length) throw new ManifestError(`${path.join(dir, MANIFEST)}: ${problems.join('; ')}`);

  return {
    dir,
    name,
    summary: typeof raw.summary === 'string' ? raw.summary : '',
    kind,
    requires: raw.requires && typeof raw.requires === 'object' ? raw.requires : {},
    install: raw.install ?? null,
    setup: raw.setup ?? null,
    start: raw.start ?? null,
    port: raw.port ?? 3000,
    portEnv: typeof raw.portEnv === 'string' ? raw.portEnv : 'PORT',
    open: typeof raw.open === 'string' ? raw.open : '/',
    usage: typeof raw.usage === 'string' ? raw.usage : '',
    env: {
      example: env.example ?? '.env.example',
      file: env.file ?? '.env',
      generate: asList(env.generate),
      set: env.set && typeof env.set === 'object' ? env.set : {},
      reveal: asList(env.reveal),
    },
  };
}

function loadManifest(dir) {
  const file = path.join(dir, MANIFEST);
  let raw;
  try {
    raw = JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (err) {
    if (err.code === 'ENOENT') throw new ManifestError(`No ${MANIFEST} in ${dir}`);
    throw new ManifestError(`${file} is not valid JSON: ${err.message}`);
  }
  return normalize(raw, dir);
}

function readRegistry(home) {
  try {
    const list = JSON.parse(fs.readFileSync(path.join(home, REGISTRY), 'utf8'));
    return Array.isArray(list) ? list.filter((p) => typeof p === 'string') : [];
  } catch {
    return [];
  }
}

function addToRegistry(home, dir) {
  const list = readRegistry(home);
  const abs = path.resolve(dir);
  if (!list.includes(abs)) list.push(abs);
  fs.mkdirSync(home, { recursive: true });
  fs.writeFileSync(path.join(home, REGISTRY), JSON.stringify(list, null, 2) + '\n');
}

// Every folder directly inside `home` that has an osa.json, plus registered extras.
// Broken manifests are returned with an error rather than hidden, so people can fix them.
function discover(home) {
  const dirs = [];
  if (fs.existsSync(home)) {
    for (const entry of fs.readdirSync(home, { withFileTypes: true })) {
      if (entry.isDirectory() && !entry.name.startsWith('.')) {
        const dir = path.join(home, entry.name);
        if (fs.existsSync(path.join(dir, MANIFEST))) dirs.push(dir);
      }
    }
  }
  for (const dir of readRegistry(home)) if (!dirs.includes(dir) && fs.existsSync(path.join(dir, MANIFEST))) dirs.push(dir);

  const seen = new Map();
  const projects = [];
  for (const dir of dirs.sort()) {
    try {
      const m = loadManifest(dir);
      let id = m.name;
      if (seen.has(id)) id = `${m.name}-${path.basename(dir)}`;
      seen.set(id, true);
      projects.push({ id, dir, manifest: m, error: null });
    } catch (err) {
      projects.push({ id: path.basename(dir), dir, manifest: null, error: err.message });
    }
  }
  return projects;
}

module.exports = { MANIFEST, REGISTRY, ManifestError, pickCommand, normalize, loadManifest, discover, addToRegistry, readRegistry };
