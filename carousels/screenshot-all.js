const { chromium } = require('playwright-core');
const fs = require('fs');
const path = require('path');

const CAROUSELS_DIR = __dirname;

const EDGE_CANDIDATES = [
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
];

function findBrowser() {
  const fromEnv = process.env.BROWSER_PATH;
  if (fromEnv && fs.existsSync(fromEnv)) return fromEnv;
  const found = EDGE_CANDIDATES.find(p => fs.existsSync(p));
  if (!found) throw new Error('No browser found. Set BROWSER_PATH env var to your Chrome or Edge executable.');
  return found;
}

async function screenshotAll() {
  const executablePath = findBrowser();
  const browser = await chromium.launch({ executablePath });
  const context = await browser.newContext({
    viewport: { width: 1080, height: 1080 },
    deviceScaleFactor: 1,
  });
  const page = await context.newPage();

  const days = fs.readdirSync(CAROUSELS_DIR)
    .filter(d => d.startsWith('day-') && fs.statSync(path.join(CAROUSELS_DIR, d)).isDirectory())
    .sort();

  let total = 0;

  for (const day of days) {
    const dayDir = path.join(CAROUSELS_DIR, day);
    const htmlFiles = fs.readdirSync(dayDir).filter(f => f.endsWith('.html')).sort();

    for (const file of htmlFiles) {
      const htmlPath = path.join(dayDir, file);
      const pngPath = htmlPath.replace(/\.html$/, '.png');
      const url = 'file:///' + htmlPath.replace(/\\/g, '/');

      await page.goto(url, { waitUntil: 'networkidle' });
      await page.screenshot({ path: pngPath, clip: { x: 0, y: 0, width: 1080, height: 1080 } });

      console.log(`✓ ${day}/${file} → ${path.basename(pngPath)}`);
      total++;
    }
  }

  await browser.close();
  console.log(`\nDone — ${total} PNGs saved.`);
}

screenshotAll().catch(err => { console.error(err); process.exit(1); });
