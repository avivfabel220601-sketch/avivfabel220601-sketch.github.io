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
  const page = await browser.newPage();
  const htmlFilePath = path.join(__dirname, '_topdf.html');
  await page.goto('file:///' + htmlFilePath.replace(/\\/g, '/'), { waitUntil: 'networkidle' });
  await page.pdf({
    path: path.join(__dirname, '06-cta.pdf'),
    width: '1080px',
    height: '1920px',
    printBackground: true,
    margin: { top: '0px', bottom: '0px', left: '0px', right: '0px' },
  });
  await browser.close();
})();
