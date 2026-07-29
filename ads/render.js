const { chromium } = require('../carousels/node_modules/playwright-core');
const fs = require('fs');
const path = require('path');

const AVATAR_PATH = process.argv[2] || null;
const AUTHOR_NAME = 'אביב פבל | מומחה משכנתאות וכלכלה אישית';

const OUTPUT_DIR = path.join(__dirname, 'final');
if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });

const ADS = [
  {
    image: path.join(__dirname, 'generated', 'ad1-39-shekel.png'),
    output: path.join(OUTPUT_DIR, 'ad1-v2.jpg'),
    lines: ['עוד חודש עבר', 'עוד פעם לא נשאר כלום'],
    sub: 'ב-39 ש״ח תבין בדיוק לאן הלך הכסף שלך',
    cta: 'כתוב לנו — ונסדר לך תמונת מצב',
  },
  {
    image: path.join(__dirname, 'generated', 'ad2-guide.png'),
    output: path.join(OUTPUT_DIR, 'ad2-v2.jpg'),
    lines: ['כולם סביבך קנו דירה', 'מה הם יודעים שאתה לא?'],
    sub: 'המדריך החינמי שהבנק לא רוצה שתקרא',
    cta: 'כתוב מדריך בתגובות — מקבלים מיד',
  },
  {
    image: path.join(__dirname, 'generated', 'ad3-mortgage-v2.png'),
    output: path.join(OUTPUT_DIR, 'ad3-v2.jpg'),
    lines: ['מחזור משכנתא נכון', 'יכול לחסוך לכם אלפי שקלים בשנה'],
    sub: 'בדיקה חינמית + דוח יתרות — בלי התחייבות, בלי עלות',
    cta: '📞 השאירו פרטים — נחזור אליכם תוך שעה',
    splitLabels: { left: '❌ לפני', right: '✅ אחרי' },
  },
];

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function toBase64(filePath) {
  try {
    const ext = path.extname(filePath).slice(1).toLowerCase();
    const mime = ext === 'jpg' || ext === 'jpeg' ? 'jpeg' : 'png';
    return `data:image/${mime};base64,${fs.readFileSync(filePath).toString('base64')}`;
  } catch {
    return null;
  }
}

function findChromium() {
  const playwrightDir = path.join(process.env.LOCALAPPDATA || '', 'ms-playwright');
  if (!fs.existsSync(playwrightDir)) return null;
  const chromiumFolder = fs.readdirSync(playwrightDir)
    .filter(d => d.startsWith('chromium-'))
    .sort()
    .pop();
  if (!chromiumFolder) return null;
  const winDir = fs.readdirSync(path.join(playwrightDir, chromiumFolder))
    .find(d => d.startsWith('chrome-win'));
  if (!winDir) return null;
  return path.join(playwrightDir, chromiumFolder, winDir, 'chrome.exe');
}

function buildHtml(ad, imgB64, avatarB64) {
  const headlineHtml = ad.lines
    .map(l => `<div class="line">${escapeHtml(l)}</div>`)
    .join('');

  const splitLabelsBlock = ad.splitLabels ? `
    <div class="split-label split-label-left">${escapeHtml(ad.splitLabels.left)}</div>
    <div class="split-label split-label-right">${escapeHtml(ad.splitLabels.right)}</div>` : '';

  const authorBlock = avatarB64
    ? `<div class="author-pill">
         <img class="avatar" src="${avatarB64}" alt="">
         <span class="name">${escapeHtml(AUTHOR_NAME)}</span>
       </div>`
    : `<div class="author-pill no-avatar">
         <span class="name">${escapeHtml(AUTHOR_NAME)}</span>
       </div>`;

  return `<!DOCTYPE html>
<html dir="rtl" lang="he">
<head>
<meta charset="utf-8">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Heebo:wght@400;700;900&display=swap" rel="stylesheet">
<style>
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html, body { width: 1080px; height: 1080px; overflow: hidden; }
  body { position: relative; font-family: 'Heebo', Arial, sans-serif; }
  .bg { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
  .gradient {
    position: absolute; inset: 0;
    background: linear-gradient(
      to bottom,
      rgba(0,0,0,0) 30%,
      rgba(0,0,0,0.55) 58%,
      rgba(0,0,0,0.85) 100%
    );
  }
  .author-pill {
    position: absolute; top: 36px; left: 36px;
    display: flex; align-items: center; gap: 14px;
    background: rgba(0,0,0,0.55);
    backdrop-filter: blur(12px);
    border-radius: 999px;
    padding: 10px 22px 10px 10px;
    border: 1px solid rgba(255,255,255,0.12);
  }
  .author-pill.no-avatar { padding: 10px 22px; }
  .avatar {
    width: 54px; height: 54px; border-radius: 50%;
    object-fit: cover; border: 2px solid rgba(255,255,255,0.35); flex-shrink: 0;
  }
  .name { font-size: 20px; font-weight: 400; color: rgba(255,255,255,0.85); white-space: nowrap; }
  .text-block { position: absolute; bottom: 0; left: 0; right: 0; padding: 0 56px 52px; text-align: right; }
  .headline {
    font-size: 62px; font-weight: 900; color: #fff; line-height: 1.15;
    text-shadow: 0 2px 24px rgba(0,0,0,0.95), 0 0 50px rgba(0,0,0,0.7);
    margin-bottom: 18px;
  }
  .sub {
    font-size: 30px; font-weight: 400; color: #C8EEE8; line-height: 1.4;
    text-shadow: 0 1px 10px rgba(0,0,0,0.85); margin-bottom: 16px;
  }
  .cta {
    font-size: 28px; font-weight: 700;
    background: linear-gradient(90deg, #00C5B0, #00D97E);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    filter: drop-shadow(0 2px 6px rgba(0,0,0,0.7));
  }
  .author-pill { border-color: rgba(0,197,176,0.4); }
  .split-label {
    position: absolute; top: 110px;
    font-size: 26px; font-weight: 700;
    padding: 8px 20px; border-radius: 8px;
    backdrop-filter: blur(8px);
  }
  .split-label-left {
    left: 24px;
    background: rgba(180,0,0,0.65); color: #fff;
  }
  .split-label-right {
    right: 24px;
    background: rgba(0,180,120,0.75); color: #fff;
  }
</style>
</head>
<body>
  <img class="bg" src="${imgB64}" alt="">
  <div class="gradient"></div>
  ${splitLabelsBlock}
  ${authorBlock}
  <div class="text-block">
    <div class="headline">${headlineHtml}</div>
    <div class="sub">${escapeHtml(ad.sub)}</div>
    <div class="cta">${escapeHtml(ad.cta)}</div>
  </div>
</body>
</html>`;
}

(async () => {
  const chromiumPath = findChromium();
  if (!chromiumPath || !fs.existsSync(chromiumPath)) {
    console.error('✗ Chromium לא נמצא');
    process.exit(1);
  }

  const browser = await chromium.launch({ executablePath: chromiumPath, headless: true });
  try {
    const page = await browser.newPage();
    await page.setViewportSize({ width: 1080, height: 1080 });

    const avatarB64 = AVATAR_PATH ? toBase64(AVATAR_PATH) : null;
    if (AVATAR_PATH && !avatarB64) console.warn(`⚠ תמונת פרופיל לא נטענה: ${AVATAR_PATH}`);

    for (const ad of ADS) {
      const imgB64 = toBase64(ad.image);
      if (!imgB64) { console.error(`✗ חסר: ${path.basename(ad.image)}`); continue; }
      await page.setContent(buildHtml(ad, imgB64, avatarB64), { waitUntil: 'networkidle' });
      await page.screenshot({ path: ad.output, type: 'jpeg', quality: 93 });
      console.log(`✓ ${path.basename(ad.output)}`);
    }
  } finally {
    await browser.close();
  }
  console.log('\nDone → ads/final/');
})();
