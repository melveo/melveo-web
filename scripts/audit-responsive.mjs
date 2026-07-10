/**
 * Responsive + runtime audit against the LIVE site (or any base URL).
 * Usage: bun run scripts/audit-responsive.mjs [baseUrl]
 *
 * For each viewport: loads /cs/, waits for network idle, then checks
 *   - horizontal overflow (scrollWidth vs clientWidth)
 *   - console errors / pageerrors collected during load + scroll
 *   - hero CTA row present and pills equal height
 *   - full-page scroll pass (triggers lazy sections + scroll anims)
 *   - transferred bytes (approximate, via response sizes)
 * Screenshots for a subset of viewports go to /tmp/melveo-audit/.
 */
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';

const BASE = process.argv[2] ?? 'https://melveo.app';
const OUT = '/tmp/melveo-audit';
mkdirSync(OUT, { recursive: true });

const VIEWPORTS = [
  { w: 320, h: 568, name: 'iphone-se-old', shot: true },
  { w: 360, h: 800, name: 'android-common', shot: false },
  { w: 390, h: 844, name: 'iphone-14', shot: true },
  { w: 430, h: 932, name: 'iphone-pro-max', shot: false },
  { w: 768, h: 1024, name: 'ipad-portrait', shot: true },
  { w: 1024, h: 768, name: 'ipad-landscape', shot: false },
  { w: 1280, h: 800, name: 'laptop', shot: false },
  { w: 1440, h: 900, name: 'desktop', shot: true },
  { w: 1920, h: 1080, name: 'fullhd', shot: true },
  { w: 2560, h: 1440, name: 'qhd', shot: false },
  { w: 844, h: 390, name: 'phone-landscape', shot: true },
];

const browser = await chromium.launch({ args: ['--no-sandbox'] });
const results = [];

for (const vp of VIEWPORTS) {
  const ctx = await browser.newContext({
    viewport: { width: vp.w, height: vp.h },
    deviceScaleFactor: 2,
    userAgent:
      vp.w < 500
        ? 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1'
        : undefined,
    hasTouch: vp.w < 1100,
  });
  const page = await ctx.newPage();
  const errors = [];
  let bytes = 0;
  page.on('pageerror', (e) => errors.push(`pageerror: ${e.message.slice(0, 120)}`));
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push(`console: ${m.text().slice(0, 120)}`);
  });
  page.on('response', async (r) => {
    try {
      const h = await r.allHeaders();
      bytes += parseInt(h['content-length'] ?? '0', 10) || 0;
    } catch {}
  });

  try {
    await page.goto(`${BASE}/cs/`, { waitUntil: 'networkidle', timeout: 45000 });
  } catch {
    // networkidle can time out on long-polling; continue with what loaded
  }
  await page.waitForTimeout(1200);

  // Slow scroll through the page to trigger scroll-linked sections
  await page.evaluate(async () => {
    const H = document.body.scrollHeight;
    for (let y = 0; y <= H; y += Math.round(innerHeight * 0.75)) {
      scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 120));
    }
    scrollTo(0, 0);
    await new Promise((r) => setTimeout(r, 300));
  });

  const check = await page.evaluate(() => {
    const doc = document.documentElement;
    const pills = [...document.querySelectorAll('.hero-cta-row .hero-pill')];
    const heights = pills.map((p) => Math.round(p.getBoundingClientRect().height));
    // find any element wider than viewport (overflow culprit)
    let culprit = null;
    if (doc.scrollWidth > doc.clientWidth + 1) {
      for (const el of document.querySelectorAll('body *')) {
        const r = el.getBoundingClientRect();
        if (r.width > doc.clientWidth + 2 && el.children.length === 0) {
          culprit = `${el.tagName}.${String(el.className).slice(0, 60)} w=${Math.round(r.width)}`;
          break;
        }
      }
    }
    return {
      hOverflow: doc.scrollWidth > doc.clientWidth + 1,
      scrollW: doc.scrollWidth,
      clientW: doc.clientWidth,
      culprit,
      pillCount: pills.length,
      pillHeights: heights,
      pillsEqual: new Set(heights).size <= 1,
      sections: document.querySelectorAll('section').length,
      brokenImgs: [...document.images].filter((i) => i.complete && i.naturalWidth === 0).length,
    };
  });

  if (vp.shot) {
    await page.screenshot({ path: `${OUT}/${vp.name}-${vp.w}x${vp.h}.png` });
  }

  results.push({
    vp: `${vp.w}x${vp.h} (${vp.name})`,
    ...check,
    kbTransferred: Math.round(bytes / 1024),
    errors: errors.slice(0, 4),
  });
  await ctx.close();
  process.stdout.write(`✓ ${vp.name}\n`);
}

await browser.close();
console.log('\n===== RESULTS =====');
console.log(JSON.stringify(results, null, 2));
