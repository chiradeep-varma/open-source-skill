const { chromium } = require(require('child_process').execSync('npm root -g').toString().trim() + '/playwright');
(async () => {
  const base = 'http://localhost:3001';
  const out = process.argv[2];
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await ctx.newPage();
  const user = 'a-very-long-username-for-test'; // 29 chars, within 3-30
  await page.goto(base + '/signup');
  await page.fill('#username', user);
  await page.fill('#password', 'correct-horse-9');
  await page.fill('#confirm', 'correct-horse-9');
  await Promise.all([page.waitForNavigation(), page.click('form button[type=submit], form input[type=submit]')]);
  await page.fill('#displayName', 'Bartholomew Featherstonehaugh-Worthington III');
  await page.fill('#bio', 'Longwordtesting: supercalifragilisticexpialidociousandthensomemorecharacterswithoutspaces to see wrapping.');
  await Promise.all([page.waitForNavigation(), page.click('form[action="/dashboard/profile"] button')]);
  const longTitle = 'Registration for the autumn wheel-throwing intensive, including materials list and parking notes ok';
  await page.fill('#new-title', longTitle.slice(0, 100));
  await page.fill('#new-url', 'https://example.com/some/really/long/path/that/keeps/going/and/going?utm_source=bio&utm_medium=social');
  await Promise.all([page.waitForNavigation(), page.click('form[action="/dashboard/links"] button')]);
  const check = async (name) => {
    const r = await page.evaluate(() => {
      const vw = window.innerWidth;
      const bad = [];
      for (const el of document.querySelectorAll('body *')) {
        const b = el.getBoundingClientRect();
        if (b.width && b.right > vw + 1) bad.push(`${el.tagName.toLowerCase()}.${el.className} right=${Math.round(b.right)}`);
      }
      return { scrollWidth: document.documentElement.scrollWidth, vw, bad: bad.slice(0, 8) };
    });
    console.log(name, JSON.stringify(r));
    await page.screenshot({ path: `${out}/${name}.png`, fullPage: true });
  };
  await check('phone-dashboard-long');
  await page.goto(base + '/' + user);
  await check('phone-public-long');
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
