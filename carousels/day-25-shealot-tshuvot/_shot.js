const { chromium } = require('playwright-core');
const fs = require('fs');
const path = require('path');

const EDGE_CANDIDATES = [
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
];

(async () => {
  const executablePath = EDGE_CANDIDATES.find(p => fs.existsSync(p));
  const browser = await chromium.launch({ executablePath });
  const context = await browser.newContext({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
  const page = await context.newPage();
  const htmlFilePath = path.join(__dirname, '06-cta.html');
  await page.goto('file:///' + htmlFilePath.replace(/\\/g, '/'), { waitUntil: 'networkidle' });
  await page.screenshot({ path: path.join(__dirname, '06-cta.png'), clip: { x: 0, y: 0, width: 1080, height: 1920 } });
  await browser.close();
})();
