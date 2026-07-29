const { chromium } = require('playwright-core');
const fs = require('fs');
const path = require('path');

const EDGE_CANDIDATES = [
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
];

function findBrowser() {
  const found = EDGE_CANDIDATES.find(p => fs.existsSync(p));
  if (!found) throw new Error('No browser found. Set BROWSER_PATH.');
  return found;
}

async function run() {
  const browser = await chromium.launch({ executablePath: findBrowser() });
  const context = await browser.newContext({
    viewport: { width: 1080, height: 1080 },
    deviceScaleFactor: 1,
  });
  const page = await context.newPage();

  const adsDir = __dirname;
  const htmlFiles = fs.readdirSync(adsDir).filter(f => f.endsWith('.html')).sort();

  for (const file of htmlFiles) {
    const htmlPath = path.join(adsDir, file);
    const pngPath = htmlPath.replace(/\.html$/, '.png');
    const url = 'file:///' + htmlPath.replace(/\\/g, '/');
    await page.goto(url, { waitUntil: 'networkidle' });
    await page.screenshot({ path: pngPath, clip: { x: 0, y: 0, width: 1080, height: 1080 } });
    console.log('ok ' + file + ' -> ' + path.basename(pngPath));
  }

  await browser.close();
  console.log('Done — ' + htmlFiles.length + ' PNGs saved.');
}

run().catch(err => { console.error(err); process.exit(1); });
