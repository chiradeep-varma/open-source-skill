const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const base = 'http://localhost:3300';
  const outDir = '/tmp/ossa-run.wQOaxC/project/docs/design/screenshots';
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await ctx.newPage();
  await page.goto(`${base}/login`);
  await page.fill('input[name=username]', 'admin');
  await page.fill('input[name=password]', 'devpassword123');
  await Promise.all([page.waitForNavigation(), page.click('button[type=submit]')]);
  await page.goto(`${base}/links/hello`, { waitUntil: 'networkidle' });
  await page.screenshot({ path: `${outDir}/stats-with-data-desktop.png`, fullPage: true });
  console.log('done');
  await browser.close();
})();
