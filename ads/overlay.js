const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const PROFILE_IMG = process.argv[2];

const AUTHOR_NAME = 'אביב פבל | מומחה משכנתאות וכלכלה אישית';
const FONT = 'Arial, sans-serif';
const IMG_SIZE = 2048;
const OVERLAY_H = Math.round(IMG_SIZE * 0.32);
const OVERLAY_Y = IMG_SIZE - OVERLAY_H;
const AVATAR_R = 56;
const AVATAR_D = AVATAR_R * 2;

const OUTPUT_DIR = path.join(__dirname, 'final');
if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });

const ADS = [
  {
    input: path.join(__dirname, 'generated', 'ad1-39-shekel.png'),
    output: path.join(OUTPUT_DIR, 'ad1-afiyon.jpg'),
    lines: ['עוד חודש עבר', 'עוד פעם לא נשאר כלום'],
    sub: 'ב-39 ש״ח תבין בדיוק לאן הלך הכסף שלך',
    cta: 'כתוב לנו — ונסדר לך תמונת מצב',
  },
  {
    input: path.join(__dirname, 'generated', 'ad2-guide.png'),
    output: path.join(OUTPUT_DIR, 'ad2-madrich.jpg'),
    lines: ['כולם סביבך קנו דירה', 'מה הם יודעים שאתה לא?'],
    sub: 'המדריך החינמי שהבנק לא רוצה שתקרא',
    cta: 'כתוב מדריך בתגובות — מקבלים מיד',
  },
  {
    input: path.join(__dirname, 'generated', 'ad3-mortgage.png'),
    output: path.join(OUTPUT_DIR, 'ad3-machzor.jpg'),
    lines: ['כבר שנים שאתם משלמים לבנק יותר מדי'],
    sub: 'אנחנו עוזרים בהוצאת דוח יתרות — ללא עלות',
    cta: 'השאירו פרטים — הבדיקה חינמית לגמרי',
  },
];

async function buildCircleAvatar(profilePath) {
  if (!profilePath || !fs.existsSync(profilePath)) return null;
  const mask = Buffer.from(
    `<svg width="${AVATAR_D}" height="${AVATAR_D}">
      <circle cx="${AVATAR_R}" cy="${AVATAR_R}" r="${AVATAR_R}" fill="white"/>
    </svg>`
  );
  return sharp(profilePath)
    .resize(AVATAR_D, AVATAR_D, { fit: 'cover', position: 'centre' })
    .composite([{ input: mask, blend: 'dest-in' }])
    .png()
    .toBuffer();
}

function makeSvgOverlay(ad, hasAvatar) {
  const PAD = 60;
  const textX = IMG_SIZE - PAD; // right-anchored, text-anchor="end"

  const avatarX = PAD;
  const avatarY = OVERLAY_Y + 24;

  const nameY = OVERLAY_Y + 58;
  const nameX = hasAvatar ? PAD + AVATAR_D + 20 : PAD;

  const line1Y = OVERLAY_Y + 130;
  const line2Y = line1Y + 70;
  const subY   = (ad.lines.length > 1 ? line2Y : line1Y) + 68;
  const ctaY   = subY + 60;

  const headlineLines = ad.lines.map((text, i) => {
    const y = i === 0 ? line1Y : line2Y;
    return `<text x="${textX}" y="${y}"
      font-family="${FONT}" font-size="46" font-weight="bold" fill="#FFFFFF"
      text-anchor="end">${text}</text>`;
  }).join('\n');

  const avatarSvg = hasAvatar ? `
    <circle cx="${avatarX + AVATAR_R}" cy="${avatarY + AVATAR_R}" r="${AVATAR_R + 3}"
            fill="white" opacity="0.15"/>` : '';

  return `<svg width="${IMG_SIZE}" height="${IMG_SIZE}" xmlns="http://www.w3.org/2000/svg">
    <rect x="0" y="${OVERLAY_Y}" width="${IMG_SIZE}" height="${OVERLAY_H}" fill="rgba(0,0,0,0.80)"/>
    <line x1="0" y1="${OVERLAY_Y}" x2="${IMG_SIZE}" y2="${OVERLAY_Y}" stroke="rgba(255,255,255,0.12)" stroke-width="2"/>
    ${avatarSvg}
    <text x="${nameX}" y="${nameY}"
      font-family="${FONT}" font-size="24" fill="#8A9BAB"
      text-anchor="start">${AUTHOR_NAME}</text>
    ${headlineLines}
    <text x="${textX}" y="${subY}"
      font-family="${FONT}" font-size="30" fill="#C8D4DE"
      text-anchor="end">${ad.sub}</text>
    <text x="${textX}" y="${ctaY}"
      font-family="${FONT}" font-size="28" font-weight="bold" fill="#FFD700"
      text-anchor="end">${ad.cta}</text>
  </svg>`;
}

async function processAd(ad, avatarBuf) {
  if (!fs.existsSync(ad.input)) {
    console.error(`✗ Missing source: ${path.basename(ad.input)}`);
    return;
  }
  const hasAvatar = !!avatarBuf;
  const svgBuf = Buffer.from(makeSvgOverlay(ad, hasAvatar));
  const composites = [{ input: svgBuf, top: 0, left: 0 }];
  if (hasAvatar) {
    composites.push({
      input: avatarBuf,
      top: OVERLAY_Y + 24,
      left: 60,
    });
  }
  await sharp(ad.input)
    .resize(IMG_SIZE, IMG_SIZE)
    .composite(composites)
    .jpeg({ quality: 92 })
    .toFile(ad.output);
  console.log(`✓ ${path.basename(ad.output)}`);
}

(async () => {
  const avatarBuf = await buildCircleAvatar(PROFILE_IMG);
  if (!avatarBuf) console.log('ריצה ללא תמונת פרופיל');
  for (const ad of ADS) await processAd(ad, avatarBuf);
  console.log('\nDone → ads/final/');
})();
