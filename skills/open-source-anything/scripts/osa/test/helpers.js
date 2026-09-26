'use strict';
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

function tempHome() {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'osa-test-'));
}

// A tiny web app: counts installs, reads PORT and SECRET from its environment,
// and can be told to crash on start.
function makeProject(home, name, { manifest = {}, crash = false } = {}) {
  const dir = path.join(home, name);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'server.js'), `
    const fs = require('fs');
    const env = Object.fromEntries(fs.readFileSync('.env', 'utf8').split('\\n').filter(Boolean).map(l => l.split('=')));
    ${crash ? "console.error('boom: missing config'); process.exit(1);" : ''}
    require('http').createServer((req, res) => res.end('ok ' + (env.SESSION_SECRET || '').length + ' ' + process.env.BASE_URL))
      .listen(Number(process.env.PORT), () => console.log('listening on', process.env.PORT));
  `);
  fs.writeFileSync(path.join(dir, 'install.js'), "const fs=require('fs');fs.appendFileSync('installs.txt','x');");
  fs.writeFileSync(path.join(dir, '.env.example'), '# settings\nSESSION_SECRET=change-me\nADMIN_PASSWORD=\nKEEP=me\n');
  fs.writeFileSync(path.join(dir, 'osa.json'), JSON.stringify({
    name,
    summary: 'A test app',
    install: 'node install.js',
    start: 'node server.js',
    port: 45000 + Math.floor(Math.random() * 1000),
    env: { generate: ['SESSION_SECRET', 'ADMIN_PASSWORD'], reveal: ['ADMIN_PASSWORD'], set: { BASE_URL: 'http://localhost:{port}' } },
    ...manifest,
  }, null, 2));
  return dir;
}

module.exports = { tempHome, makeProject };
