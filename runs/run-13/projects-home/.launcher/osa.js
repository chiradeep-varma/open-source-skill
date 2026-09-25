#!/usr/bin/env node
'use strict';
// osa: start, stop and open the projects built with the open-source-anything skill.
// No dependencies beyond Node.js itself. Run `osa help` for usage.

const path = require('node:path');

const { projectsHome } = require('./lib/home');
const { discover, loadManifest, addToRegistry } = require('./lib/manifest');
const runner = require('./lib/runner');
const { serve, openExternal, DEFAULT_PORT } = require('./lib/dashboard');
const { setup } = require('./lib/setup');

const HELP = `osa: start, stop and open your projects

Usage
  osa                      open the launcher page in your browser (same as "osa dashboard")
  osa list                 list projects and whether they're running
  osa start <name>         install if needed, start, and print the address
  osa stop <name>          stop a project        (osa stop --all stops everything)
  osa open <name>          open a running project in the browser
  osa logs <name>          show the latest log output
  osa check <folder>       check a project's osa.json and requirements
  osa add <folder>         show a project from another folder in the launcher
  osa setup                create the projects folder and its double-click "Start projects" file
  osa where                print the projects folder

Options
  --home <folder>          use a different projects folder (or set OSA_HOME)
  --port <number>          port for the launcher page (default ${DEFAULT_PORT})
  --no-open                don't open the browser
`;

function parseArgs(argv) {
  const args = { _: [], open: true };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--home') args.home = argv[++i];
    else if (a === '--port') args.port = Number(argv[++i]);
    else if (a === '--lines') args.lines = Number(argv[++i]);
    else if (a === '--no-open') args.open = false;
    else if (a === '--open') args.openAfter = true;
    else if (a === '--all') args.all = true;
    else if (a === '-h' || a === '--help') args._.unshift('help');
    else args._.push(a);
  }
  return args;
}

function findProject(home, name) {
  const projects = discover(home);
  const p = projects.find((x) => x.id === name || x.manifest?.name === name || path.basename(x.dir) === name);
  if (!p) {
    const names = projects.map((x) => x.id).join(', ') || 'none yet';
    throw new runner.FriendlyError(`No project called "${name}" in ${home}. Projects: ${names}.`);
  }
  if (p.error) throw new runner.FriendlyError(p.error);
  return p;
}

function printReveal(reveal) {
  for (const [k, v] of Object.entries(reveal || {})) console.log(`  ${k}: ${v}`);
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const home = path.resolve(args.home || projectsHome());
  const [cmd = 'dashboard', target] = args._;

  switch (cmd) {
    case 'help':
      console.log(HELP);
      return;
    case 'where':
      console.log(home);
      return;
    case 'dashboard':
      await serve({ home, port: args.port || DEFAULT_PORT, open: args.open });
      return;
    case 'setup': {
      const r = setup(home);
      console.log(`Projects folder: ${r.home}`);
      console.log(`Double-click to open the launcher: ${r.starter}`);
      return;
    }
    case 'list': {
      const projects = discover(home);
      if (!projects.length) return console.log(`No projects in ${home} yet.`);
      for (const p of projects) {
        if (p.error) { console.log(`${p.id}  (problem: ${p.error})`); continue; }
        const s = runner.status(p.dir);
        console.log(`${p.id}  ${s.state === 'running' ? `running at ${s.url}` : p.manifest.kind === 'web' ? 'stopped' : p.manifest.kind}  ${p.manifest.summary}`);
      }
      return;
    }
    case 'start': {
      if (!target) throw new runner.FriendlyError('Which project? Try: osa start <name>');
      const p = findProject(home, target);
      const taken = new Set(discover(home).map((x) => runner.status(x.dir).port).filter(Boolean));
      const r = await runner.start(p.dir, p.manifest, {
        takenPorts: taken,
        onPhase: (phase) => console.log(phase === 'installing' ? 'Installing what it needs (first start can take a few minutes)…' : `${phase[0].toUpperCase()}${phase.slice(1)}…`),
      });
      console.log(`${p.id} is ${r.alreadyRunning ? 'already ' : ''}running at ${r.url}`);
      printReveal(r.reveal);
      if (args.openAfter) openExternal(r.url);
      return;
    }
    case 'stop': {
      if (args.all) {
        for (const p of discover(home)) if (p.manifest && (await runner.stop(p.dir))) console.log(`Stopped ${p.id}`);
        return;
      }
      if (!target) throw new runner.FriendlyError('Which project? Try: osa stop <name>, or osa stop --all');
      const p = findProject(home, target);
      console.log((await runner.stop(p.dir)) ? `Stopped ${p.id}` : `${p.id} wasn't running`);
      return;
    }
    case 'open': {
      const p = findProject(home, target || '');
      const s = runner.status(p.dir);
      if (s.state !== 'running') throw new runner.FriendlyError(`${p.id} isn't running. Start it with: osa start ${p.id}`);
      openExternal(s.url);
      console.log(s.url);
      return;
    }
    case 'logs': {
      const p = findProject(home, target || '');
      const l = runner.logs(p.dir, args.lines || 80);
      for (const [label, text] of [['install', l.install], ['setup', l.setup], ['app', l.app]]) if (text) console.log(`--- ${label} ---\n${text}\n`);
      return;
    }
    case 'check': {
      const dir = path.resolve(target || '.');
      const m = loadManifest(dir);
      const problems = runner.checkRequirements(m.requires);
      console.log(`osa.json is valid: ${m.name} (${m.kind})`);
      if (problems.length) { console.log(problems.join('\n')); process.exitCode = 1; } else console.log('Requirements are met on this machine.');
      return;
    }
    case 'add': {
      const dir = path.resolve(target || '.');
      loadManifest(dir);
      addToRegistry(home, dir);
      console.log(`Added ${dir}. It will show up in the launcher.`);
      return;
    }
    default:
      console.log(HELP);
      process.exitCode = 1;
  }
}

main().catch((err) => {
  console.error(err.message);
  if (err.detail) console.error(`\n${err.detail}`);
  process.exitCode = 1;
});
