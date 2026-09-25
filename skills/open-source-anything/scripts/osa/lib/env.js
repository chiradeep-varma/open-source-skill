'use strict';
// Prepares a project's .env so nobody has to invent secrets by hand:
// copy .env.example on first run, fill in the secrets the manifest lists,
// and never touch a value someone already set.

const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');

const PLACEHOLDER = /^(|change[-_ ]?me.*|changeme.*|replace[-_ ]?me.*|your[-_ ].*|xxx+|todo|secret|password)$/i;

function parse(text) {
  const values = {};
  for (const line of text.split(/\r?\n/)) {
    const m = line.match(/^\s*(?:export\s+)?([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
    if (!m) continue;
    let v = m[2].trim();
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) v = v.slice(1, -1);
    else v = v.replace(/\s+#.*$/, '');
    values[m[1]] = v;
  }
  return values;
}

// Replace or append KEY=value lines, keeping comments and ordering intact.
function update(text, changes) {
  const lines = text.split(/\r?\n/);
  const done = new Set();
  const out = lines.map((line) => {
    const m = line.match(/^(\s*(?:export\s+)?)([A-Za-z_][A-Za-z0-9_]*)(\s*=).*$/);
    if (m && m[2] in changes) {
      done.add(m[2]);
      return `${m[1]}${m[2]}${m[3]}${changes[m[2]]}`;
    }
    return line;
  });
  for (const [k, v] of Object.entries(changes)) if (!done.has(k)) out.push(`${k}=${v}`);
  let result = out.join('\n');
  if (!result.endsWith('\n')) result += '\n';
  return result;
}

// Passwords are shown to people, so they are readable; other secrets are long hex.
function generate(key) {
  if (/PASS(WORD)?|PIN/i.test(key)) {
    const alphabet = 'abcdefghjkmnpqrstuvwxyz23456789';
    const bytes = crypto.randomBytes(16);
    let s = '';
    for (let i = 0; i < 16; i++) s += alphabet[bytes[i] % alphabet.length];
    return `${s.slice(0, 4)}-${s.slice(4, 8)}-${s.slice(8, 12)}-${s.slice(12, 16)}`;
  }
  return crypto.randomBytes(32).toString('hex');
}

function ensureEnv(dir, spec) {
  const file = path.join(dir, spec.file);
  const example = path.join(dir, spec.example);
  let text = '';
  if (fs.existsSync(file)) text = fs.readFileSync(file, 'utf8');
  else if (fs.existsSync(example)) text = fs.readFileSync(example, 'utf8');
  else if (!spec.generate.length) return { created: false, reveal: {} };

  const created = !fs.existsSync(file);
  const current = parse(text);
  const changes = {};
  for (const key of spec.generate) {
    if (current[key] == null || PLACEHOLDER.test(String(current[key]).trim())) changes[key] = generate(key);
  }
  if (created || Object.keys(changes).length) {
    fs.writeFileSync(file, update(text, changes), { mode: 0o600 });
  }
  const finalValues = { ...current, ...changes };
  const reveal = {};
  for (const key of spec.reveal) if (finalValues[key] != null) reveal[key] = finalValues[key];
  return { created, generated: Object.keys(changes), reveal };
}

// Values from "set" may contain {port}, filled in at start time.
function resolveSet(set, port) {
  const out = {};
  for (const [k, v] of Object.entries(set)) out[k] = String(v).replaceAll('{port}', String(port));
  return out;
}

module.exports = { parse, update, generate, ensureEnv, resolveSet, PLACEHOLDER };
