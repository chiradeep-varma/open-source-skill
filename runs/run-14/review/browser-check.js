// Our own browser check of Run 14's app: every core screen at desktop and phone
// widths, with empty, many and long data, plus the phone overflow check.
const { chromium } = require(require('child_process').execSync('npm root -g').toString().trim() + '/playwright');
const base = process.argv[2] || 'http://localhost:3300';
const out = process.argv[3];
(async () => {
  const browser = await chromium.launch();
  const results = [];
  const capture = async (page, name) => {
    for (const [w, label] of [[1280, 'desktop'], [390, 'phone']]) {
      await page.setViewportSize({ width: w, height: 900 });
      await page.waitForTimeout(150);
      const o = await page.evaluate(() => ({ sw: document.documentElement.scrollWidth, vw: window.innerWidth,
        wide: [...document.querySelectorAll('body *')].filter((e) => { const b = e.getBoundingClientRect(); return b.width && b.right > window.innerWidth + 1; }).slice(0, 4).map((e) => e.tagName.toLowerCase() + '.' + e.className) }));
      results.push(`${name} ${label}: scrollWidth ${o.sw} / ${o.vw}${o.sw > o.vw ? ' OVERFLOW ' + o.wide.join(', ') : ''}`);
      await page.screenshot({ path: `${out}/${name}-${label}.png`, fullPage: true });
    }
  };
  const page = await browser.newPage();
  await page.goto(base + '/');
  await capture(page, 'home');

  // Create a poll through the UI with long values.
  const longTitle = 'Quarterly neighbourhood allotment committee meeting and seed-swap planning session, autumn edition 2026 (bring cake)'.slice(0, 140);
  await page.fill('#title', longTitle);
  await page.fill('#description', 'Agenda: https://example.org/very/long/path/to/the/agenda-document-for-the-autumn-meeting?version=final-final-v3&share=true');
  await page.fill('#location', 'Community hall, back room (the one with the broken radiator)');
  const days = ['2026-10-05T18:30', '2026-10-06T19:00', '2026-10-07T18:00', '2026-10-08T20:00', '2026-10-12T18:30'];
  for (let i = 0; i < days.length; i++) {
    if (i > 0) await page.click('#add-row');
    await page.locator('.starts-at-local').nth(i).fill(days[i]);
  }
  await Promise.all([page.waitForNavigation(), page.click('#create-form button[type=submit]')]);
  const adminUrl = page.url();
  await capture(page, 'admin-empty');
  const pollId = adminUrl.split('/a/')[1].split('/')[0];

  // Votes: many participants, one with a very long unbroken name.
  await page.goto(`${base}/p/${pollId}`);
  await capture(page, 'poll-empty');
  const optionIds = await page.$$eval('.vote-btn', (b) => [...new Set(b.map((x) => x.dataset.option))]);
  const names = ['Priya', 'Tomás', 'Ngozi Adeyemi-Okonkwo', 'Wei', 'Anna-Lena Schäfer', 'Bartholomew_Featherstonehaugh_Worthington_the_Third_of_Little_Snoring', 'Sam', 'Mia', 'Joaquín', 'Oluwaseun', 'Kim', 'Aleksandr Vladimirovich'];
  const vals = ['yes', 'if_need_be', 'no'];
  for (const [i, name] of names.entries()) {
    const responses = Object.fromEntries(optionIds.map((id, j) => [id, vals[(i + j) % 3]]));
    await page.request.post(`${base}/api/polls/${pollId}/vote`, { data: { name, responses } });
  }
  await page.goto(`${base}/p/${pollId}`);
  await capture(page, 'poll-many');
  await page.goto(adminUrl);
  await capture(page, 'admin-many');
  await page.goto(`${base}/p/does-not-exist`);
  await capture(page, 'not-found');
  console.log(results.join('\n'));
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
