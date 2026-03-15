/**
 * Generates PNG reference images for each experience stage banner.
 * Output: public/images/experience/stage-{n}-{slug}.png  (1600×380 @2x)
 *
 * Run with:  node scripts/generate-stage-banners.mjs
 * Requires:  npm install --save-dev sharp
 */

import sharp from 'sharp';
import { mkdir } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(__dirname, '../public/images/experience');

// ─── Stage definitions ──────────────────────────────────────────────────────

const STAGES = [
  { id: 'stage-1', slug: 'los-cimientos',            color: '#5CB845' },
  { id: 'stage-2', slug: 'el-crecimiento',           color: '#F5C200' },
  { id: 'stage-3', slug: 'la-vision-sistemica',      color: '#00BDD4' },
  { id: 'stage-4', slug: 'el-impacto-organizacional',color: '#D42060' },
  { id: 'stage-5', slug: 'el-capitulo-actual',       color: '#8B5CF6' },
];

// ─── SVG art per stage (mirrors Experience.astro, color = actual hex) ────────

const ART = {

  'stage-1': (c) => `
    <defs>
      <pattern id="dots" width="32" height="32" patternUnits="userSpaceOnUse">
        <circle cx="1" cy="1" r="1" fill="${c}" fill-opacity="0.12"/>
      </pattern>
    </defs>
    <rect width="800" height="190" fill="url(#dots)"/>
    <path d="M 95 45 L 62 45 Q 50 45 50 57 L 50 88 Q 50 100 38 100 Q 50 100 50 112 L 50 143 Q 50 155 62 155 L 95 155"
          stroke="${c}" stroke-opacity="0.45" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
    <path d="M 705 45 L 738 45 Q 750 45 750 57 L 750 88 Q 750 100 762 100 Q 750 100 750 112 L 750 143 Q 750 155 738 155 L 705 155"
          stroke="${c}" stroke-opacity="0.45" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
    <rect x="135" y="64"  width="190" height="9" rx="4.5" fill="${c}" fill-opacity="0.20"/>
    <rect x="135" y="81"  width="110" height="9" rx="4.5" fill="${c}" fill-opacity="0.11"/>
    <rect x="155" y="98"  width="230" height="9" rx="4.5" fill="${c}" fill-opacity="0.15"/>
    <rect x="155" y="115" width="150" height="9" rx="4.5" fill="${c}" fill-opacity="0.11"/>
    <rect x="135" y="132" width="90"  height="9" rx="4.5" fill="${c}" fill-opacity="0.20"/>
    <rect x="470" y="64"  width="170" height="9" rx="4.5" fill="${c}" fill-opacity="0.13"/>
    <rect x="470" y="81"  width="230" height="9" rx="4.5" fill="${c}" fill-opacity="0.20"/>
    <rect x="490" y="98"  width="130" height="9" rx="4.5" fill="${c}" fill-opacity="0.11"/>
    <rect x="490" y="115" width="190" height="9" rx="4.5" fill="${c}" fill-opacity="0.15"/>
    <rect x="470" y="132" width="100" height="9" rx="4.5" fill="${c}" fill-opacity="0.11"/>
    <rect x="365" y="90"  width="13"  height="18" rx="1.5" fill="${c}" fill-opacity="0.65"/>
    <circle cx="400" cy="99" r="55" fill="${c}" fill-opacity="0.04"/>
    <circle cx="400" cy="99" r="24" fill="${c}" fill-opacity="0.05"/>`,

  'stage-2': (c) => `
    <line x1="70"  y1="155" x2="200" y2="115" stroke="${c}" stroke-opacity="0.22" stroke-width="1.5"/>
    <line x1="200" y1="115" x2="320" y2="133" stroke="${c}" stroke-opacity="0.22" stroke-width="1.5"/>
    <line x1="320" y1="133" x2="450" y2="72"  stroke="${c}" stroke-opacity="0.28" stroke-width="1.5"/>
    <line x1="450" y1="72"  x2="570" y2="95"  stroke="${c}" stroke-opacity="0.22" stroke-width="1.5"/>
    <line x1="570" y1="95"  x2="690" y2="42"  stroke="${c}" stroke-opacity="0.32" stroke-width="1.5"/>
    <line x1="690" y1="42"  x2="770" y2="55"  stroke="${c}" stroke-opacity="0.20" stroke-width="1.5"/>
    <line x1="200" y1="115" x2="450" y2="72"  stroke="${c}" stroke-opacity="0.07" stroke-width="1" stroke-dasharray="4 7"/>
    <line x1="320" y1="133" x2="570" y2="95"  stroke="${c}" stroke-opacity="0.07" stroke-width="1" stroke-dasharray="4 7"/>
    <line x1="70"  y1="155" x2="320" y2="133" stroke="${c}" stroke-opacity="0.07" stroke-width="1" stroke-dasharray="4 7"/>
    <line x1="155" y1="45"  x2="285" y2="25"  stroke="${c}" stroke-opacity="0.13" stroke-width="1.5"/>
    <line x1="285" y1="25"  x2="410" y2="50"  stroke="${c}" stroke-opacity="0.13" stroke-width="1.5"/>
    <line x1="410" y1="50"  x2="535" y2="30"  stroke="${c}" stroke-opacity="0.13" stroke-width="1.5"/>
    <circle cx="70"  cy="155" r="6"  fill="${c}" fill-opacity="0.28"/>
    <circle cx="70"  cy="155" r="3"  fill="${c}" fill-opacity="0.55"/>
    <circle cx="200" cy="115" r="8"  fill="${c}" fill-opacity="0.22"/>
    <circle cx="200" cy="115" r="4"  fill="${c}" fill-opacity="0.55"/>
    <circle cx="320" cy="133" r="6"  fill="${c}" fill-opacity="0.22"/>
    <circle cx="320" cy="133" r="3"  fill="${c}" fill-opacity="0.45"/>
    <circle cx="450" cy="72"  r="13" fill="${c}" fill-opacity="0.14"/>
    <circle cx="450" cy="72"  r="5"  fill="${c}" fill-opacity="0.60"/>
    <circle cx="450" cy="72"  r="20" stroke="${c}" stroke-opacity="0.14" fill="none" stroke-width="1"/>
    <circle cx="570" cy="95"  r="8"  fill="${c}" fill-opacity="0.22"/>
    <circle cx="570" cy="95"  r="4"  fill="${c}" fill-opacity="0.50"/>
    <circle cx="690" cy="42"  r="11" fill="${c}" fill-opacity="0.20"/>
    <circle cx="690" cy="42"  r="5"  fill="${c}" fill-opacity="0.60"/>
    <circle cx="690" cy="42"  r="18" stroke="${c}" stroke-opacity="0.16" fill="none" stroke-width="1"/>
    <circle cx="770" cy="55"  r="5"  fill="${c}" fill-opacity="0.32"/>
    <circle cx="155" cy="45"  r="4"  fill="${c}" fill-opacity="0.22"/>
    <circle cx="285" cy="25"  r="5"  fill="${c}" fill-opacity="0.28"/>
    <circle cx="410" cy="50"  r="4"  fill="${c}" fill-opacity="0.22"/>
    <circle cx="535" cy="30"  r="4"  fill="${c}" fill-opacity="0.22"/>
    <path d="M 735 168 L 735 88" stroke="${c}" stroke-opacity="0.32" stroke-width="2" stroke-linecap="round"/>
    <path d="M 724 110 L 735 88 L 746 110" stroke="${c}" stroke-opacity="0.42" stroke-width="2"
          stroke-linecap="round" stroke-linejoin="round" fill="none"/>`,

  'stage-3': (c) => `
    <polygon points="400,55 435,75 435,115 400,135 365,115 365,75"
             stroke="${c}" stroke-opacity="0.40" stroke-width="1.5" fill="${c}" fill-opacity="0.06"/>
    <polygon points="400,70 420,82 420,106 400,118 380,106 380,82"
             stroke="${c}" stroke-opacity="0.55" stroke-width="1"   fill="${c}" fill-opacity="0.09"/>
    <circle cx="400" cy="95" r="5"  fill="${c}" fill-opacity="0.75"/>
    <circle cx="400" cy="95" r="12" stroke="${c}" stroke-opacity="0.28" fill="none" stroke-width="1"/>
    <polygon points="330,15 365,35 365,65 330,85 295,65 295,35"   stroke="${c}" stroke-opacity="0.22" stroke-width="1" fill="${c}" fill-opacity="0.03"/>
    <polygon points="270,55 305,75 305,105 270,125 235,105 235,75" stroke="${c}" stroke-opacity="0.19" stroke-width="1" fill="${c}" fill-opacity="0.03"/>
    <polygon points="200,15 235,35 235,65 200,85 165,65 165,35"   stroke="${c}" stroke-opacity="0.15" stroke-width="1" fill="${c}" fill-opacity="0.02"/>
    <polygon points="130,55 165,75 165,105 130,125 95,105 95,75"  stroke="${c}" stroke-opacity="0.12" stroke-width="1" fill="none"/>
    <polygon points="470,15 505,35 505,65 470,85 435,65 435,35"   stroke="${c}" stroke-opacity="0.22" stroke-width="1" fill="${c}" fill-opacity="0.03"/>
    <polygon points="530,55 565,75 565,105 530,125 495,105 495,75" stroke="${c}" stroke-opacity="0.19" stroke-width="1" fill="${c}" fill-opacity="0.03"/>
    <polygon points="600,15 635,35 635,65 600,85 565,65 565,35"   stroke="${c}" stroke-opacity="0.15" stroke-width="1" fill="${c}" fill-opacity="0.02"/>
    <polygon points="660,55 695,75 695,105 660,125 625,105 625,75" stroke="${c}" stroke-opacity="0.12" stroke-width="1" fill="none"/>
    <polygon points="330,135 365,155 365,185 330,205 295,185 295,155" stroke="${c}" stroke-opacity="0.14" stroke-width="1" fill="none"/>
    <polygon points="470,135 505,155 505,185 470,205 435,185 435,155" stroke="${c}" stroke-opacity="0.14" stroke-width="1" fill="none"/>
    <line x1="365" y1="95"  x2="305" y2="90"  stroke="${c}" stroke-opacity="0.22" stroke-width="1" stroke-dasharray="3 5"/>
    <line x1="435" y1="95"  x2="495" y2="90"  stroke="${c}" stroke-opacity="0.22" stroke-width="1" stroke-dasharray="3 5"/>
    <line x1="400" y1="55"  x2="400" y2="15"  stroke="${c}" stroke-opacity="0.16" stroke-width="1" stroke-dasharray="3 5"/>
    <line x1="400" y1="135" x2="400" y2="175" stroke="${c}" stroke-opacity="0.16" stroke-width="1" stroke-dasharray="3 5"/>
    <line x1="365" y1="75"  x2="342" y2="52"  stroke="${c}" stroke-opacity="0.16" stroke-width="1" stroke-dasharray="3 5"/>
    <line x1="435" y1="75"  x2="458" y2="52"  stroke="${c}" stroke-opacity="0.16" stroke-width="1" stroke-dasharray="3 5"/>
    <circle cx="130" cy="90" r="3" fill="${c}" fill-opacity="0.32"/>
    <circle cx="670" cy="90" r="3" fill="${c}" fill-opacity="0.32"/>`,

  'stage-4': (c) => `
    <rect x="285" y="35"  width="230" height="30" rx="7" stroke="${c}" stroke-opacity="0.42" stroke-width="1.5" fill="${c}" fill-opacity="0.07"/>
    <rect x="245" y="78"  width="310" height="30" rx="7" stroke="${c}" stroke-opacity="0.32" stroke-width="1.5" fill="${c}" fill-opacity="0.05"/>
    <rect x="205" y="121" width="390" height="30" rx="7" stroke="${c}" stroke-opacity="0.25" stroke-width="1.5" fill="${c}" fill-opacity="0.04"/>
    <rect x="160" y="162" width="480" height="24" rx="6" stroke="${c}" stroke-opacity="0.18" stroke-width="1.5" fill="${c}" fill-opacity="0.03"/>
    <circle cx="345" cy="50" r="5" fill="${c}" fill-opacity="0.52"/>
    <circle cx="400" cy="50" r="5" fill="${c}" fill-opacity="0.52"/>
    <circle cx="455" cy="50" r="5" fill="${c}" fill-opacity="0.52"/>
    <circle cx="305" cy="93" r="4" fill="${c}" fill-opacity="0.42"/>
    <circle cx="365" cy="93" r="4" fill="${c}" fill-opacity="0.42"/>
    <circle cx="435" cy="93" r="4" fill="${c}" fill-opacity="0.42"/>
    <circle cx="495" cy="93" r="4" fill="${c}" fill-opacity="0.42"/>
    <line x1="345" y1="65"  x2="325" y2="78"  stroke="${c}" stroke-opacity="0.22" stroke-width="1"/>
    <line x1="400" y1="65"  x2="400" y2="78"  stroke="${c}" stroke-opacity="0.28" stroke-width="1"/>
    <line x1="455" y1="65"  x2="465" y2="78"  stroke="${c}" stroke-opacity="0.22" stroke-width="1"/>
    <line x1="365" y1="108" x2="345" y2="121" stroke="${c}" stroke-opacity="0.16" stroke-width="1"/>
    <line x1="435" y1="108" x2="435" y2="121" stroke="${c}" stroke-opacity="0.16" stroke-width="1"/>
    <path d="M 358 25 L 400 10 L 442 25" stroke="${c}" stroke-opacity="0.42" stroke-width="1.5"
          stroke-linecap="round" stroke-linejoin="round" fill="none"/>
    <circle cx="400" cy="5" r="4" fill="${c}" fill-opacity="0.65"/>
    <circle cx="400" cy="5" r="9" stroke="${c}" stroke-opacity="0.28" fill="none" stroke-width="1"/>
    <circle cx="88"  cy="95" r="20" stroke="${c}" stroke-opacity="0.10" fill="none" stroke-width="1"/>
    <circle cx="88"  cy="95" r="9"  stroke="${c}" stroke-opacity="0.22" fill="none" stroke-width="1"/>
    <circle cx="88"  cy="95" r="3"  fill="${c}" fill-opacity="0.32"/>
    <line x1="108" y1="95" x2="160" y2="95" stroke="${c}" stroke-opacity="0.10" stroke-width="1" stroke-dasharray="3 5"/>
    <circle cx="712" cy="95" r="20" stroke="${c}" stroke-opacity="0.10" fill="none" stroke-width="1"/>
    <circle cx="712" cy="95" r="9"  stroke="${c}" stroke-opacity="0.22" fill="none" stroke-width="1"/>
    <circle cx="712" cy="95" r="3"  fill="${c}" fill-opacity="0.32"/>
    <line x1="640" y1="95" x2="692" y2="95" stroke="${c}" stroke-opacity="0.10" stroke-width="1" stroke-dasharray="3 5"/>`,

  'stage-5': (c) => `
    <path d="M 0 95 C 50 55,100 55,150 95 C 200 135,250 135,300 95 C 350 55,400 55,450 95 C 500 135,550 135,600 95 C 650 55,700 55,750 95 C 775 115,792 112,800 105"
          stroke="${c}" stroke-opacity="0.20" stroke-width="2" fill="none"/>
    <path d="M 0 75 C 50 35,100 35,150 75 C 200 115,250 115,300 75 C 350 35,400 35,450 75 C 500 115,550 115,600 75 C 650 35,700 35,750 75 C 775 95,792 92,800 85"
          stroke="${c}" stroke-opacity="0.10" stroke-width="1.5" fill="none"/>
    <circle cx="75"  cy="55"  r="5" fill="${c}" fill-opacity="0.40"/>
    <circle cx="75"  cy="95"  r="5" fill="${c}" fill-opacity="0.40"/>
    <circle cx="75"  cy="135" r="5" fill="${c}" fill-opacity="0.40"/>
    <circle cx="245" cy="45"  r="6" fill="${c}" fill-opacity="0.35"/>
    <circle cx="245" cy="80"  r="6" fill="${c}" fill-opacity="0.35"/>
    <circle cx="245" cy="115" r="6" fill="${c}" fill-opacity="0.35"/>
    <circle cx="245" cy="150" r="6" fill="${c}" fill-opacity="0.35"/>
    <circle cx="400" cy="65"  r="8"  fill="${c}" fill-opacity="0.30"/>
    <circle cx="400" cy="95"  r="11" fill="${c}" fill-opacity="0.48"/>
    <circle cx="400" cy="95"  r="20" stroke="${c}" stroke-opacity="0.22" fill="none" stroke-width="1"/>
    <circle cx="400" cy="95"  r="32" stroke="${c}" stroke-opacity="0.09" fill="none" stroke-width="1"/>
    <circle cx="400" cy="125" r="8"  fill="${c}" fill-opacity="0.30"/>
    <circle cx="555" cy="50"  r="6" fill="${c}" fill-opacity="0.30"/>
    <circle cx="555" cy="85"  r="6" fill="${c}" fill-opacity="0.30"/>
    <circle cx="555" cy="120" r="6" fill="${c}" fill-opacity="0.30"/>
    <circle cx="555" cy="150" r="6" fill="${c}" fill-opacity="0.30"/>
    <circle cx="718" cy="75"  r="5" fill="${c}" fill-opacity="0.35"/>
    <circle cx="718" cy="115" r="5" fill="${c}" fill-opacity="0.35"/>
    <line x1="80"  y1="55"  x2="239" y2="47"  stroke="${c}" stroke-opacity="0.09" stroke-width="1"/>
    <line x1="80"  y1="55"  x2="239" y2="82"  stroke="${c}" stroke-opacity="0.09" stroke-width="1"/>
    <line x1="80"  y1="95"  x2="239" y2="82"  stroke="${c}" stroke-opacity="0.10" stroke-width="1"/>
    <line x1="80"  y1="95"  x2="239" y2="117" stroke="${c}" stroke-opacity="0.09" stroke-width="1"/>
    <line x1="80"  y1="135" x2="239" y2="117" stroke="${c}" stroke-opacity="0.09" stroke-width="1"/>
    <line x1="80"  y1="135" x2="239" y2="152" stroke="${c}" stroke-opacity="0.09" stroke-width="1"/>
    <line x1="251" y1="80"  x2="392" y2="95"  stroke="${c}" stroke-opacity="0.13" stroke-width="1.5"/>
    <line x1="251" y1="115" x2="392" y2="95"  stroke="${c}" stroke-opacity="0.16" stroke-width="1.5"/>
    <line x1="251" y1="80"  x2="392" y2="65"  stroke="${c}" stroke-opacity="0.10" stroke-width="1"/>
    <line x1="251" y1="115" x2="392" y2="125" stroke="${c}" stroke-opacity="0.10" stroke-width="1"/>
    <line x1="408" y1="95"  x2="549" y2="85"  stroke="${c}" stroke-opacity="0.16" stroke-width="1.5"/>
    <line x1="408" y1="95"  x2="549" y2="120" stroke="${c}" stroke-opacity="0.13" stroke-width="1"/>
    <line x1="408" y1="65"  x2="549" y2="50"  stroke="${c}" stroke-opacity="0.10" stroke-width="1"/>
    <line x1="408" y1="125" x2="549" y2="150" stroke="${c}" stroke-opacity="0.10" stroke-width="1"/>
    <line x1="561" y1="85"  x2="713" y2="77"  stroke="${c}" stroke-opacity="0.10" stroke-width="1"/>
    <line x1="561" y1="85"  x2="713" y2="113" stroke="${c}" stroke-opacity="0.09" stroke-width="1"/>
    <line x1="561" y1="120" x2="713" y2="77"  stroke="${c}" stroke-opacity="0.09" stroke-width="1"/>
    <line x1="561" y1="120" x2="713" y2="113" stroke="${c}" stroke-opacity="0.10" stroke-width="1"/>`,
};

// ─── SVG builder ────────────────────────────────────────────────────────────

function buildSvg(stageId, color) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 190" width="1600" height="380">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%"   stop-color="${color}" stop-opacity="0.11"/>
      <stop offset="100%" stop-color="${color}" stop-opacity="0.04"/>
    </linearGradient>
    <linearGradient id="fade" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%"   stop-color="#08080f" stop-opacity="0"/>
      <stop offset="100%" stop-color="#08080f" stop-opacity="0.72"/>
    </linearGradient>
  </defs>
  <rect width="800" height="190" fill="#0d0d1a"/>
  <rect width="800" height="190" fill="url(#bg)"/>
  ${ART[stageId](color)}
  <rect width="800" height="190" fill="url(#fade)"/>
</svg>`;
}

// ─── Main ────────────────────────────────────────────────────────────────────

async function generate() {
  await mkdir(OUT_DIR, { recursive: true });

  for (const stage of STAGES) {
    const svg = buildSvg(stage.id, stage.color);
    const outPath = join(OUT_DIR, `stage-${stage.id.at(-1)}-${stage.slug}.png`);

    await sharp(Buffer.from(svg))
      .png({ compressionLevel: 9 })
      .toFile(outPath);

    console.log(`  ✓  stage-${stage.id.at(-1)}-${stage.slug}.png`);
  }

  console.log(`\nBanners generados en public/images/experience/`);
}

generate().catch((err) => {
  console.error('Error:', err.message);
  process.exit(1);
});
