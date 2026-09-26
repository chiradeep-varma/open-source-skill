// Re-creates the launcher screenshots in this folder with realistic demo projects.
// Needs Playwright with Chromium: node docs/launcher/capture.js
// It runs everything under a throwaway home folder and stops every app it starts.
'use strict';
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { execSync } = require('node:child_process');

const HOME = fs.mkdtempSync(path.join(os.tmpdir(), 'osa-shots-'));
process.env.HOME = HOME; // so the page shows ~/Documents/open-source-anything
fs.mkdirSync(path.join(HOME, 'Documents'));
const PROJECTS = path.join(HOME, 'Documents', 'open-source-anything');

const osa = path.join(__dirname, '..', '..', 'skills', 'open-source-anything', 'scripts', 'osa');
const { setup } = require(path.join(osa, 'lib', 'setup'));
const { createDashboard } = require(path.join(osa, 'lib', 'dashboard'));
const runner = require(path.join(osa, 'lib', 'runner'));
const { discover } = require(path.join(osa, 'lib', 'manifest'));

let playwright;
try {
  playwright = require('playwright');
} catch {
  playwright = require(path.join(execSync('npm root -g').toString().trim(), 'playwright'));
}

// A tiny stand-in app: the launcher only needs something that answers on PORT.
function project(name, summary, { reveal = [], extraEnv = '', crash = false, slowInstall = 0, manifest = {} } = {}) {
  const dir = path.join(PROJECTS, name);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'server.js'), crash
    ? "console.error('Error: DATABASE_URL points to a folder that does not exist: ./data/app.db'); process.exit(1);\n"
    : "require('http').createServer((q, s) => s.end('ok')).listen(process.env.PORT, () => console.log('Listening on port ' + process.env.PORT));\n");
  fs.writeFileSync(path.join(dir, '.env.example'), `SESSION_SECRET=change-me\n${extraEnv}`);
  fs.writeFileSync(path.join(dir, 'osa.json'), JSON.stringify({
    name, summary,
    install: slowInstall ? `node -e "setTimeout(() => {}, ${slowInstall})"` : 'node -e "console.log(\'added 94 packages\')"',
    start: 'node server.js',
    port: 3000,
    env: { generate: ['SESSION_SECRET', ...reveal.filter((k) => /PASS/.test(k))], reveal },
    ...manifest,
  }, null, 2));
  return dir;
}

async function main() {
  const out = __dirname;
  setup(PROJECTS);

  const { server } = createDashboard({ home: PROJECTS });
  await new Promise((r) => server.listen(0, '127.0.0.1', r));
  const url = `http://localhost:${server.address().port}/`;
  const browser = await playwright.chromium.launch();

  const shoot = async (file, { width = 1280, dark = false, full = true, before } = {}) => {
    const page = await browser.newPage({ viewport: { width, height: 900 }, colorScheme: dark ? 'dark' : 'light', deviceScaleFactor: 1 });
    await page.goto(url);
    await page.waitForSelector('#list > *');
    if (before) await before(page);
    await page.waitForTimeout(300);
    await page.screenshot({ path: path.join(out, file), fullPage: full });
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    if (overflow > 0) throw new Error(`${file}: page is ${overflow}px wider than the screen`);
    await page.close();
  };

  await shoot('empty.png', { full: false });

  project('sunny-thicket', 'Short links with click analytics', { reveal: ['ADMIN_USER', 'ADMIN_PASSWORD'], extraEnv: 'ADMIN_USER=admin\nADMIN_PASSWORD=\n' });
  project('west-larch', 'A link-in-bio page you host yourself');
  project('amber-otter', 'Booking pages for your team', { slowInstall: 60000 });
  project('quiet-heron', 'Form builder with branching logic', { crash: true });
  fs.mkdirSync(path.join(PROJECTS, 'misty-delta'));
  fs.writeFileSync(path.join(PROJECTS, 'misty-delta', 'osa.json'), JSON.stringify({ name: 'misty-delta', summary: 'Team wiki' }));

  const byName = Object.fromEntries(discover(PROJECTS).map((p) => [p.id, p]));
  await runner.start(byName['sunny-thicket'].dir, byName['sunny-thicket'].manifest);

  const token = (await (await fetch(url)).text()).match(/const TOKEN = '([0-9a-f]+)'/)[1];
  const post = (p) => fetch(url + p.slice(1), { method: 'POST', headers: { 'x-osa-token': token } });
  await post('/api/projects/quiet-heron/start');
  await post('/api/projects/amber-otter/start'); // stays "Installing…" for a minute
  await new Promise((r) => setTimeout(r, 1500));

  await shoot('projects.png');
  await shoot('projects-dark.png', { dark: true });
  await shoot('projects-phone.png', { width: 390 });
  await shoot('projects-log-open.png', {
    before: async (page) => {
      await page.locator('li.project', { hasText: 'quiet-heron' }).locator('.problem summary').click();
    },
  });
  await shoot('starting.png', { full: false });

  await browser.close();
  for (const p of discover(PROJECTS)) if (p.manifest) await runner.stop(p.dir);
  server.close();
  fs.rmSync(HOME, { recursive: true, force: true });
  console.log(`Saved screenshots to ${out}`);
  process.exit(0); // the slow install is still sleeping; don't wait for it
}

main().catch((err) => { console.error(err); process.exit(1); });
