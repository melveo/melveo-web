/**
 * Build the social-preview (OG) image — brand colours + Comfortaa.
 *
 * Renders an inline SVG at 1200×630, then rasterizes via @resvg/resvg-js
 * with the Comfortaa Variable + Inter Variable woff2 files loaded
 * explicitly (decoded to TTF via wawoff2 first, because resvg's font
 * loader doesn't speak woff2 directly).
 *
 * Output: public/og-default.jpg (89 KB-ish) + public/og-default.webp.
 *
 * Run:    bun run scripts/build-og.mjs
 */

import { readFile, writeFile } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Resvg } from '@resvg/resvg-js';
import sharp from 'sharp';
import wawoff2 from 'wawoff2';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

const W = 1200;
const H = 630;

const buildSvg = () => `
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <radialGradient id="bgCenter" cx="50%" cy="50%" r="55%">
      <stop offset="0%" stop-color="rgba(0,240,255,0.12)"/>
      <stop offset="60%" stop-color="rgba(0,240,255,0.04)"/>
      <stop offset="100%" stop-color="rgba(0,240,255,0)"/>
    </radialGradient>
    <radialGradient id="bgBottom" cx="50%" cy="100%" r="55%">
      <stop offset="0%" stop-color="rgba(0,240,255,0.10)"/>
      <stop offset="100%" stop-color="rgba(0,240,255,0)"/>
    </radialGradient>
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="14"/>
      <feComponentTransfer>
        <feFuncA type="linear" slope="1.5"/>
      </feComponentTransfer>
    </filter>
  </defs>

  <!-- Canvas (near-black brand bg + soft cyan glows). -->
  <rect width="${W}" height="${H}" fill="#050608"/>
  <rect width="${W}" height="${H}" fill="url(#bgCenter)"/>
  <rect width="${W}" height="${H}" fill="url(#bgBottom)"/>

  <!-- Decorative hex rings — brand identity nod. -->
  <g opacity="0.22" stroke="#00f0ff" stroke-width="1.4" fill="none">
    <!-- Top-left rotated hex -->
    <g transform="translate(-30, -40) rotate(-12 140 161)">
      <polygon points="140,1 279,81 279,241 140,321 1,241 1,81"/>
    </g>
    <!-- Bottom-right rotated hex -->
    <g transform="translate(950, 380) rotate(8 140 161)">
      <polygon points="140,1 279,81 279,241 140,321 1,241 1,81"/>
    </g>
  </g>
  <!-- Smaller side hexes (subtle cyan fill). -->
  <g opacity="0.16" stroke="#00f0ff" stroke-width="1.8" fill="rgba(0,240,255,0.05)">
    <g transform="translate(60, 260)">
      <polygon points="45,1 89,26 89,77 45,103 1,77 1,26"/>
    </g>
    <g transform="translate(1050, 260)">
      <polygon points="45,1 89,26 89,77 45,103 1,77 1,26"/>
    </g>
  </g>

  <!-- Wordmark — Comfortaa @ weight 600, matching the live
       .melveo-wordmark header element on production. Glow layer
       on top of solid layer (double-rendered SVG <text>). -->
  <g>
    <text x="${W / 2}" y="${H / 2 + 30}"
          text-anchor="middle"
          font-family="Comfortaa"
          font-weight="600"
          font-size="200"
          letter-spacing="-6"
          fill="#00f0ff"
          opacity="0.55"
          filter="url(#glow)">melveo</text>
    <text x="${W / 2}" y="${H / 2 + 30}"
          text-anchor="middle"
          font-family="Comfortaa"
          font-weight="600"
          font-size="200"
          letter-spacing="-6"
          fill="#00f0ff">melveo</text>
  </g>

  <!-- Tagline — Inter, light ink. -->
  <text x="${W / 2}" y="${H / 2 + 100}"
        text-anchor="middle"
        font-family="Inter"
        font-weight="500"
        font-size="38"
        letter-spacing="-0.5"
        fill="#e8f7fb">Smarter trainings. Healthier players.</text>

  <!-- Footnote band -->
  <g opacity="0.62">
    <text x="${W / 2}" y="${H - 38}"
          text-anchor="middle"
          font-family="Inter"
          font-weight="500"
          font-size="22"
          letter-spacing="2.4"
          fill="#e8f7fb">PERFORMANCE &amp; READINESS · BUILT FOR CLUBS</text>
  </g>
</svg>
`.trim();

async function woff2ToTtf(path) {
  const woff2Buf = await readFile(path);
  const ttf = await wawoff2.decompress(woff2Buf);
  return Buffer.from(ttf);
}

// Trick: Google Fonts serves woff2 by default. We need a *static*
// font (single weight) decoded to TTF — resvg's font matcher works
// reliably with that, where variable fonts from @fontsource often
// fall back silently to the wrong style.
async function fetchStaticTtfViaGoogleFonts(family, weight) {
  // Pretend to be a real browser so Google Fonts gives us latest woff2
  // (vs. older bytecode-hinted fallbacks for IE-era clients).
  // Modern Chrome UA → Google Fonts serves woff2 (small + ours to
  // decompress). Safari/older UAs get plain woff, which wawoff2
  // can't decode.
  const css = await (
    await fetch(
      `https://fonts.googleapis.com/css2?family=${encodeURIComponent(family)}:wght@${weight}&display=swap`,
      {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        },
      },
    )
  ).text();
  // Find the *latin* block (skip cyrillic / greek / vietnamese — we
  // only need ASCII glyphs for the OG render). The src URL might or
  // might not end in `.woff2` — Google sometimes inlines query
  // params — so match anything up to the closing paren and verify
  // via the `format('woff2')` declaration that follows.
  const latinMatch = css.match(
    /\/\*\s*latin\s*\*\/[\s\S]*?src:\s*url\((https:[^)]+)\)\s*format\('woff2'\)/,
  );
  if (!latinMatch) throw new Error(`No latin woff2 found for ${family}@${weight}`);
  const woff2Url = latinMatch[1];
  const woff2 = Buffer.from(
    await (await fetch(woff2Url)).arrayBuffer(),
  );
  const ttf = await wawoff2.decompress(woff2);
  return Buffer.from(ttf);
}

console.log('• Fetching Comfortaa 600 + Inter 500 (Google Fonts CSS API) …');
// Weight 600 (SemiBold) matches the live .melveo-wordmark in the
// header — verified via getComputedStyle on production. Static
// instance avoids resvg's variable-font axis weirdness.
const [comfortaaTtf, interTtf] = await Promise.all([
  fetchStaticTtfViaGoogleFonts('Comfortaa', 600),
  fetchStaticTtfViaGoogleFonts('Inter', 500),
]);

console.log('• Rasterizing SVG @ 1200×630 …');
const SVG = buildSvg();
const resvg = new Resvg(SVG, {
  fitTo: { mode: 'width', value: W },
  background: '#050608',
  font: {
    fontBuffers: [comfortaaTtf, interTtf],
    loadSystemFonts: false,
    defaultFontFamily: 'Inter',
  },
});
const pngBuf = resvg.render().asPng();

console.log('• Encoding JPG + WebP …');
await sharp(pngBuf)
  .jpeg({ quality: 88, mozjpeg: true })
  .toFile(resolve(ROOT, 'public/og-default.jpg'));
await sharp(pngBuf)
  .webp({ quality: 88 })
  .toFile(resolve(ROOT, 'public/og-default.webp'));

console.log('✔ Wrote public/og-default.jpg + .webp');
