'use strict';
// Prepares the projects folder for people who never open a terminal:
// a copy of the launcher inside the folder, a double-clickable "Start projects"
// file for their operating system, and a plain-language README.txt.

const fs = require('node:fs');
const path = require('node:path');

const LAUNCHER_DIR = '.launcher';
const ROOT = path.join(__dirname, '..');

function copyLauncher(home) {
  const dest = path.join(home, LAUNCHER_DIR);
  fs.rmSync(dest, { recursive: true, force: true });
  fs.mkdirSync(path.join(dest, 'lib'), { recursive: true });
  for (const f of ['osa.js', 'dashboard.html']) fs.copyFileSync(path.join(ROOT, f), path.join(dest, f));
  for (const f of fs.readdirSync(path.join(ROOT, 'lib'))) {
    if (f.endsWith('.js')) fs.copyFileSync(path.join(ROOT, 'lib', f), path.join(dest, 'lib', f));
  }
  return dest;
}

const NEED_NODE = 'Node.js is needed to run the launcher. Download the LTS version from https://nodejs.org, install it, then open this file again.';

function writeStarter(home, platform = process.platform) {
  if (platform === 'win32') {
    const file = path.join(home, 'Start projects.cmd');
    fs.writeFileSync(file, [
      '@echo off',
      'cd /d "%~dp0"',
      'where node >nul 2>nul',
      `if errorlevel 1 (echo ${NEED_NODE} & pause & exit /b 1)`,
      'node ".launcher\\osa.js" dashboard --home .',
      'pause',
      '',
    ].join('\r\n'));
    return file;
  }
  const file = path.join(home, platform === 'darwin' ? 'Start projects.command' : 'start-projects.sh');
  fs.writeFileSync(file, [
    '#!/bin/bash',
    'cd "$(dirname "$0")"',
    'if ! command -v node >/dev/null 2>&1; then',
    `  echo "${NEED_NODE}"`,
    '  read -n 1 -s -r -p "Press any key to close."',
    '  exit 1',
    'fi',
    'node ".launcher/osa.js" dashboard --home .',
    '',
  ].join('\n'));
  fs.chmodSync(file, 0o755);
  return file;
}

function writeReadme(home, starterName, platform = process.platform) {
  const text = `Your projects
=============

This folder holds the projects Claude built for you with the open-source-anything skill.
Each project is a folder, and the launcher starts and stops them for you.

To see your projects, double-click "${starterName}".${platform === 'linux' ? `
If that opens it in a text editor instead, right-click it and choose "Run as a Program",
or open a terminal in this folder and type: ./${starterName}` : ''}
A page opens in your browser, listing every project with Start, Stop and Open buttons.
The first start of a project installs what it needs, which can take a few minutes.
After that, starting takes seconds.

If a project needs a password to sign in, the launcher shows it next to the project.

To add a project that was built somewhere else (for example in a cloud session),
move its folder into this folder. It appears in the launcher within a few seconds.

The launcher needs Node.js (https://nodejs.org, the LTS version). Some projects also
need Python or another tool; the launcher tells you if one is missing.

Please leave the hidden ".launcher" folder in place. It is the launcher itself.
`;
  fs.writeFileSync(path.join(home, 'README.txt'), text);
}

function setup(home, { platform = process.platform } = {}) {
  fs.mkdirSync(home, { recursive: true });
  const launcher = copyLauncher(home);
  const starter = writeStarter(home, platform);
  writeReadme(home, path.basename(starter), platform);
  return { home, launcher, starter };
}

module.exports = { setup, LAUNCHER_DIR };
