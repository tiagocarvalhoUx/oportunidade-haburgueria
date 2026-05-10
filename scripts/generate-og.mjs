import { fileURLToPath } from 'node:url';
import { join } from 'node:path';
import { writeFile } from 'node:fs/promises';
import sharp from 'sharp';

const ROOT = fileURLToPath(new URL('../', import.meta.url));
const SOURCE = join(ROOT, 'public/equipamentos/chapa-lanche/foto-6.jpg');
const OUT_OG = join(ROOT, 'public/og-image.jpg');
const OUT_FAVICON = join(ROOT, 'public/favicon.svg');

const W = 1200;
const H = 630;

// SVG overlay: gradient, headline, sub, CTA, brand mark
const svg = `
<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#0d0d0d" stop-opacity="0.55"/>
      <stop offset="55%" stop-color="#0d0d0d" stop-opacity="0.85"/>
      <stop offset="100%" stop-color="#0d0d0d" stop-opacity="0.97"/>
    </linearGradient>
    <linearGradient id="accent" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#ffd60a"/>
      <stop offset="100%" stop-color="#ff8c42"/>
    </linearGradient>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="6" stdDeviation="12" flood-color="#000" flood-opacity="0.55"/>
    </filter>
  </defs>

  <rect width="100%" height="100%" fill="url(#bg)"/>

  <!-- Top tag pill -->
  <g transform="translate(72,90)">
    <rect width="280" height="46" rx="23" fill="rgba(255,214,10,0.12)" stroke="#ffd60a" stroke-width="1.5"/>
    <text x="24" y="30" font-family="Poppins, Inter, sans-serif" font-size="18" font-weight="700" fill="#ffd60a" letter-spacing="1.5">
      LIQUIDAÇÃO TOTAL
    </text>
    <circle cx="252" cy="23" r="6" fill="#ff8c42"/>
  </g>

  <!-- Headline -->
  <text x="72" y="240" font-family="Poppins, Inter, sans-serif" font-size="74" font-weight="800" fill="#f8f9fa" filter="url(#shadow)">
    Equipamentos de
  </text>
  <text x="72" y="320" font-family="Poppins, Inter, sans-serif" font-size="74" font-weight="800" fill="url(#accent)" filter="url(#shadow)">
    Hamburgueria à Venda
  </text>

  <!-- Sub -->
  <text x="72" y="380" font-family="Inter, sans-serif" font-size="26" font-weight="500" fill="#e9ecef">
    Chapa, fritadeira, estufa, pia inox, balcão e mais.
  </text>
  <text x="72" y="416" font-family="Inter, sans-serif" font-size="26" font-weight="500" fill="#e9ecef">
    Preços de oportunidade. Negocie pelo WhatsApp.
  </text>

  <!-- CTA pill -->
  <g transform="translate(72,470)" filter="url(#shadow)">
    <rect width="320" height="68" rx="14" fill="#16a34a"/>
    <text x="160" y="44" font-family="Poppins, Inter, sans-serif" font-size="22" font-weight="700" fill="#ffffff" text-anchor="middle">
      💬  Chamar no WhatsApp
    </text>
  </g>

  <!-- Brand mark bottom-right -->
  <g transform="translate(${W - 72 - 360},${H - 72 - 64})">
    <rect width="360" height="64" rx="12" fill="rgba(13,13,13,0.6)" stroke="rgba(255,214,10,0.3)" stroke-width="1"/>
    <text x="22" y="32" font-family="Inter, sans-serif" font-size="13" font-weight="600" fill="#ffd60a" letter-spacing="1.5">LIQUIDAÇÃO HAMBURGUERIA</text>
    <text x="22" y="52" font-family="Inter, sans-serif" font-size="13" font-weight="500" fill="#f8f9fa" opacity="0.75">
      Equipamentos comerciais usados/seminovos
    </text>
  </g>

  <!-- Tag corner -->
  <g transform="translate(${W - 72},90)">
    <circle cx="-32" cy="0" r="32" fill="#ffd60a"/>
    <text x="-32" y="6" font-family="Poppins, Inter, sans-serif" font-size="22" font-weight="800" fill="#0d0d0d" text-anchor="middle">%</text>
  </g>
</svg>
`;

console.log('Generating og-image.jpg (1200×630)...');

const base = sharp(SOURCE).rotate().resize(W, H, { fit: 'cover' }).blur(2);
const composed = await base
  .composite([{ input: Buffer.from(svg), top: 0, left: 0 }])
  .jpeg({ quality: 86, mozjpeg: true })
  .toBuffer();

await writeFile(OUT_OG, composed);
console.log(`✓ ${OUT_OG} (${(composed.length / 1024).toFixed(0)} KB)`);

// Favicon SVG (price tag emoji style with cheese yellow)
const favicon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#ffd60a"/>
      <stop offset="100%" stop-color="#ff8c42"/>
    </linearGradient>
  </defs>
  <rect width="64" height="64" rx="14" fill="#0d0d0d"/>
  <path d="M14 14 L36 14 L52 30 L34 48 L14 28 Z" fill="url(#g)"/>
  <circle cx="22" cy="22" r="4" fill="#0d0d0d"/>
</svg>`;
await writeFile(OUT_FAVICON, favicon);
console.log(`✓ ${OUT_FAVICON}`);
