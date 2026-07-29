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
  if (!executablePath) throw new Error('No browser found. Set BROWSER_PATH env var to your Chrome or Edge executable.');
  const browser = await chromium.launch({ executablePath });
  const page = await browser.newPage();
  const htmlFilePath = path.join(__dirname, '..', 'podcast', 'episode-00-pilot.html');
  const pdfFilePath = path.join(__dirname, '..', 'podcast', 'episode-00-pilot.pdf');
  await page.goto('file:///' + htmlFilePath.replace(/\\/g, '/'), { waitUntil: 'networkidle' });
  await page.pdf({
    path: pdfFilePath,
    format: 'A4',
    printBackground: true,
    margin: { top: '0mm', bottom: '0mm', left: '0mm', right: '0mm' },
  });
  await browser.close();
  console.log('✓ PDF saved to', pdfFilePath);
})();
