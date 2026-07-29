const { chromium } = require('playwright-core');
const fs = require('fs');
const path = require('path');
const EDGE = 'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe';
const exe = fs.existsSync(EDGE) ? EDGE : 'C:\Program Files\Microsoft\Edge\Application\msedge.exe';
(async () => {
  const browser = await chromium.launch({ executablePath: exe });
  const context = await browser.newContext({ viewport: { width: 1080, height: 1080 }, deviceScaleFactor: 1 });
  const page = await context.newPage();
  const f = 'day-19-madad-tashumot/02-madad-clali.html';
  await page.goto('file:///' + path.resolve(f).replace(/\/g, '/'), { waitUntil: 'networkidle' });
  await page.screenshot({ path: f.replace('.html', '.png'), clip: { x: 0, y: 0, width: 1080, height: 1080 } });
  await browser.close();
})();
