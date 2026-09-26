#!/usr/bin/env node
'use strict';
// Screenshots for the design review, with the phone overflow check built in.
//
// Load the data you want on screen first (empty, one item, many, long values),
// through the app's own UI or API. Then capture each page:
//
//   node capture.js --out docs/design/screenshots --name poll-long http://localhost:3000/p/abc
//   node capture.js --out docs/design/screenshots --name dashboard-many --cookie "sid=..." http://localhost:3000/dashboard
//
// Each call saves <name>-desktop.png (1280px) and <name>-phone.png (390px), plus
// <name>-dark.png if the page changes in dark mode. It prints one line per width
// with the overflow check (document scrollWidth against the window width), naming
// the widest offending elements, and exits with status 2 if any width overflows.
// Paste the lines into docs/design/review.md.
//
// It uses Playwright. If Playwright isn't installed, the script says how to add
// it to a scratch folder; it doesn't touch the project's own dependencies.

const fs = require('node:fs');
const path = require('node:path');
const { execSync } = require('node:child_process');

function loadPlaywright() {
  const candidates = ['playwright', 'playwright-core'];
  try {
    const globalRoot = execSync('npm root -g', { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
    candidates.push(path.join(globalRoot, 'playwright'), path.join(globalRoot, 'playwright-core'));
  } catch { /* npm not on PATH */ }
  for (const c of candidates) {
    try { return require(c); } catch { /* try the next one */ }
  }
  console.error(`Playwright isn't installed. Add it to a scratch folder, outside the project:
  mkdir -p /tmp/capture && cd /tmp/capture && npm init -y >/dev/null && npm install playwright && npx playwright install chromium
Then run this script with NODE_PATH=/tmp/capture/node_modules.`);
  process.exit(1);
}

function parseArgs(argv) {
  const args = { out: 'docs/design/screenshots', headers: {} };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--out') args.out = argv[++i];
    else if (a === '--name') args.name = argv[++i];
    else if (a === '--cookie') args.headers.cookie = argv[++i];
    else if (a === '--header') {
      const [k, ...v] = argv[++i].split(':');
      args.headers[k.trim().toLowerCase()] = v.join(':').trim();
    } else if (a === '--full') args.full = true;
    else args.url = a;
  }
  if (!args.url || !args.name) {
    console.error('Usage: node capture.js --name <screen-dataset> [--out <folder>] [--cookie "k=v"] [--header "K: v"] <url>');
    process.exit(1);
  }
  return args;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const { chromium } = loadPlaywright();
  fs.mkdirSync(args.out, { recursive: true });
  const browser = await chromium.launch();
  let overflowed = false;
  const lines = [];

  const shoot = async (label, { width, dark = false }) => {
    const context = await browser.newContext({ viewport: { width, height: 900 }, colorScheme: dark ? 'dark' : 'light', extraHTTPHeaders: args.headers });
    const page = await context.newPage();
    const res = await page.goto(args.url, { waitUntil: 'networkidle' });
    await page.waitForTimeout(200);
    const file = path.join(args.out, `${args.name}-${label}.png`);
    await page.screenshot({ path: file, fullPage: true });
    const check = await page.evaluate(() => {
      const vw = window.innerWidth;
      const wide = [...document.querySelectorAll('body *')]
        .map((el) => ({ el, right: el.getBoundingClientRect().right }))
        .filter((x) => x.right > vw + 1)
        .sort((a, b) => b.right - a.right)
        .slice(0, 3)
        .map(({ el, right }) => `${el.tagName.toLowerCase()}${el.id ? '#' + el.id : ''}${el.classList.length ? '.' + [...el.classList].join('.') : ''} (right edge ${Math.round(right)}px)`);
      return { sw: document.documentElement.scrollWidth, vw, wide, bg: getComputedStyle(document.body).backgroundColor };
    });
    await context.close();
    const over = check.sw > check.vw;
    if (over) overflowed = true;
    lines.push(`${args.name} ${label} (${width}px, HTTP ${res ? res.status() : '?'}): ${over ? `OVERFLOW, page is ${check.sw}px wide; widest: ${check.wide.join(', ')}` : `fits (${check.sw}px)`} -> ${file}`);
    return check.bg;
  };

  const lightBg = await shoot('desktop', { width: 1280 });
  await shoot('phone', { width: 390 });
  const darkFile = path.join(args.out, `${args.name}-dark.png`);
  const darkBg = await shoot('dark', { width: 1280, dark: true });
  if (darkBg === lightBg) {
    fs.rmSync(darkFile, { force: true });
    lines.pop();
    lines.push(`${args.name} dark: no dark mode (the page looks the same), so no capture`);
  }

  await browser.close();
  console.log(lines.join('\n'));
  if (overflowed) process.exitCode = 2;
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
