const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const base = 'http://localhost:3300';
  const outDir = '/tmp/ossa-run.wQOaxC/project/docs/design/screenshots';

  async function shoot(page, url, file, opts = {}) {
    await page.goto(url, { waitUntil: 'networkidle' });
    if (opts.wait) await page.waitForTimeout(opts.wait);
    await page.screenshot({ path: `${outDir}/${file}`, fullPage: true });
    console.log('shot', file);
  }

  // Desktop, fresh context (logged out)
  let ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  let page = await ctx.newPage();
  await shoot(page, `${base}/login`, 'login-desktop.png');

  // Log in
  await page.fill('input[name=username]', 'admin');
  await page.fill('input[name=password]', 'devpassword123');
  await Promise.all([page.waitForNavigation(), page.click('button[type=submit]')]);
  await shoot(page, `${base}/`, 'dashboard-desktop.png');
  await shoot(page, `${base}/links/csv-two`, 'stats-desktop.png');
  await ctx.close();

  // Dashboard empty state: use a context hitting a code with no clicks, already covered by csv-two potentially having 0 clicks (empty chart states)
  // Phone widths
  ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
  page = await ctx.newPage();
  await shoot(page, `${base}/login`, 'login-phone.png');
  await page.fill('input[name=username]', 'admin');
  await page.fill('input[name=password]', 'devpassword123');
  await Promise.all([page.waitForNavigation(), page.click('button[type=submit]')]);
  await shoot(page, `${base}/`, 'dashboard-phone.png');
  await shoot(page, `${base}/links/csv-two`, 'stats-phone.png');

  // Error / gone state
  await shoot(page, `${base}/nonexistent-code`, 'gone-phone.png');
  await ctx.close();

  // Dark mode
  ctx = await browser.newContext({ viewport: { width: 1280, height: 800 }, colorScheme: 'dark' });
  page = await ctx.newPage();
  await page.goto(`${base}/login`);
  await page.fill('input[name=username]', 'admin');
  await page.fill('input[name=password]', 'devpassword123');
  await Promise.all([page.waitForNavigation(), page.click('button[type=submit]')]);
  await shoot(page, `${base}/`, 'dashboard-dark.png');
  await shoot(page, `${base}/links/csv-two`, 'stats-dark.png');
  await ctx.close();

  await browser.close();
})();
