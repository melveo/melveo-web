/**
 * Build the social-preview (OG) image — brand colours + the exact
 * same Comfortaa Variable font the live `.melveo-wordmark` element
 * renders with.
 *
 * Pipeline:
 *   1. Generate an HTML page in-memory that references the same
 *      @fontsource-variable/comfortaa woff2 and @fontsource-variable
 *      /inter woff2 the production site uses.
 *   2. Open it in a headless Chromium viewport sized 1200 × 630.
 *   3. Screenshot → PNG → sharp → JPG + WebP at /public/og-default.*
 *
 * The headless-browser path is intentional: resvg-js doesn't apply
 * variable-font axis settings, so static SemiBold renders subtly
 * different letterforms than what the user sees on the actual site.
 * Routing through Chromium guarantees a byte-for-byte match to the
 * live header wordmark (same CSS, same woff2, same variable axis).
 *
 * Run:    bun run scripts/build-og.mjs
 */

import { readFile } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import sharp from 'sharp';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

const W = 1200;
const H = 630;

// Read the same variable woff2 files the production site bundles
// (via @fontsource-variable). Inline them as base64 into <style>
// @font-face so the headless page doesn't need a network round-
// trip — the render runs entirely offline.
async function readBase64(rel) {
  const buf = await readFile(resolve(ROOT, rel));
  return buf.toString('base64');
}

console.log('• Loading Comfortaa + Inter variable woff2 (production set) …');
const [comfortaaB64, interB64] = await Promise.all([
  readBase64('node_modules/@fontsource-variable/comfortaa/files/comfortaa-latin-wght-normal.woff2'),
  readBase64('node_modules/@fontsource-variable/inter/files/inter-latin-wght-normal.woff2'),
]);

const HTML = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Melveo OG render</title>
    <style>
      @font-face {
        font-family: 'Comfortaa Variable';
        font-style: normal;
        font-display: block; /* render-blocking so we never screenshot a fallback */
        font-weight: 300 700;
        src: url(data:font/woff2;base64,${comfortaaB64}) format('woff2-variations');
      }
      @font-face {
        font-family: 'Inter Variable';
        font-style: normal;
        font-display: block;
        font-weight: 100 900;
        src: url(data:font/woff2;base64,${interB64}) format('woff2-variations');
      }
      * { margin: 0; padding: 0; box-sizing: border-box; }
      html, body {
        width: ${W}px;
        height: ${H}px;
        overflow: hidden;
        background: #050608;
        color: #e8f7fb;
      }
      body {
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        font-family: 'Inter Variable', -apple-system, system-ui, sans-serif;
        background:
          radial-gradient(ellipse 60% 90% at 50% 50%, rgba(0,240,255,0.12) 0%, transparent 70%),
          radial-gradient(ellipse 100% 60% at 50% 100%, rgba(0,240,255,0.08) 0%, transparent 60%),
          #050608;
      }

      /* Decorative hex outlines — brand identity nod. */
      .hex {
        position: absolute;
        pointer-events: none;
        opacity: 0.22;
      }
      .hex--tl { top: -90px; left: -90px; transform: rotate(-12deg); }
      .hex--br { bottom: -90px; right: -90px; transform: rotate(8deg); }
      .hex--cm-l { top: 50%; left: 5%; transform: translateY(-50%) rotate(-6deg); opacity: 0.16; }
      .hex--cm-r { top: 50%; right: 5%; transform: translateY(-50%) rotate(6deg); opacity: 0.16; }
      .hex svg { display: block; }

      .wordmark {
        font-family: 'Comfortaa Variable', sans-serif;
        font-weight: 600;
        font-size: 200px;
        line-height: 1;
        letter-spacing: -0.04em;
        color: #00f0ff;
        text-shadow:
          0 0 32px rgba(0, 240, 255, 0.45),
          0 0 80px rgba(0, 240, 255, 0.18);
      }

      .tagline {
        margin-top: 30px;
        font-family: 'Inter Variable', sans-serif;
        font-weight: 500;
        font-size: 36px;
        letter-spacing: -0.01em;
        color: #e8f7fb;
      }

      .footnote {
        position: absolute;
        bottom: 38px;
        left: 0; right: 0;
        text-align: center;
        font-family: 'Inter Variable', sans-serif;
        font-weight: 500;
        font-size: 22px;
        letter-spacing: 0.12em;
        text-transform: uppercase;
        color: rgba(232, 247, 251, 0.62);
      }
      .dot {
        display: inline-block;
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: #00f0ff;
        box-shadow: 0 0 12px rgba(0, 240, 255, 0.55);
        margin: 0 12px;
        vertical-align: middle;
      }
    </style>
  </head>
  <body>
    <!-- Background hex motifs (regular pointy-top hexagons). -->
    <div class="hex hex--tl">
      <svg width="280" height="320" viewBox="0 0 100 115" fill="none" stroke="#00f0ff" stroke-width="1.4">
        <polygon points="50,1 99,29 99,86 50,114 1,86 1,29"/>
      </svg>
    </div>
    <div class="hex hex--br">
      <svg width="280" height="320" viewBox="0 0 100 115" fill="none" stroke="#00f0ff" stroke-width="1.4">
        <polygon points="50,1 99,29 99,86 50,114 1,86 1,29"/>
      </svg>
    </div>
    <div class="hex hex--cm-l">
      <svg width="90" height="104" viewBox="0 0 100 115" fill="rgba(0,240,255,0.06)" stroke="#00f0ff" stroke-width="1.8">
        <polygon points="50,1 99,29 99,86 50,114 1,86 1,29"/>
      </svg>
    </div>
    <div class="hex hex--cm-r">
      <svg width="90" height="104" viewBox="0 0 100 115" fill="rgba(0,240,255,0.06)" stroke="#00f0ff" stroke-width="1.8">
        <polygon points="50,1 99,29 99,86 50,114 1,86 1,29"/>
      </svg>
    </div>

    <div class="wordmark">melveo</div>
    <div class="tagline">Smarter trainings. Healthier players.</div>
    <div class="footnote">
      Performance &amp; Readiness <span class="dot"></span> Built for Clubs
    </div>
  </body>
</html>`;

console.log('• Launching headless Chromium …');
const browser = await chromium.launch({ args: ['--no-sandbox'] });
const ctx = await browser.newContext({
  viewport: { width: W, height: H },
  deviceScaleFactor: 2, // render @2x then we can downscale, gives crisp glyph edges
});
const page = await ctx.newPage();
await page.setContent(HTML, { waitUntil: 'load' });
// Belt + suspenders — give the @font-face data: URLs a tick to register.
await page.evaluate(async () => {
  await document.fonts.ready;
});

console.log('• Screenshotting 1200×630 …');
const png = await page.screenshot({ type: 'png', omitBackground: false });
await browser.close();

console.log('• Encoding JPG + WebP …');
await sharp(png)
  .resize(W, H) // downscale from @2x render → sharper anti-aliased glyphs
  .jpeg({ quality: 88, mozjpeg: true })
  .toFile(resolve(ROOT, 'public/og-default.jpg'));
await sharp(png)
  .resize(W, H)
  .webp({ quality: 88 })
  .toFile(resolve(ROOT, 'public/og-default.webp'));

console.log('✔ Wrote public/og-default.jpg + .webp');
