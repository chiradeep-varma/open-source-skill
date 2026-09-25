'use strict';
// Runs one app for the launcher and copies its output into the app's log file.
// Used on Windows (see launch() in runner.js). The launcher starts this keeper
// detached, so it outlives the launcher; the keeper starts the app through pipes,
// which gives the app a hidden console instead of a new window. When the app
// exits, the keeper exits with the same code.
//
// Usage: node keeper.js <log file> <command>

const { spawn } = require('node:child_process');
const fs = require('node:fs');

const [logPath, command] = process.argv.slice(2);
const log = fs.createWriteStream(logPath, { flags: 'a' });
const app = spawn(command, { shell: true, stdio: ['ignore', 'pipe', 'pipe'], windowsHide: true });
app.stdout.pipe(log, { end: false });
app.stderr.pipe(log, { end: false });

let done = false;
function finish(code, message) {
  if (done) return;
  done = true;
  log.end(message || '', () => process.exit(code));
}
app.on('error', (err) => finish(1, `${err.message}\n`));
app.on('close', (code) => finish(code ?? 1)); // after the output streams have closed
