import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright';

const BASE_URL = process.env.AUDIT_URL ?? 'http://127.0.0.1:4321';
const OUT_DIR =
  process.env.AUDIT_OUT_DIR ??
  path.join('output', 'playwright', `animation-performance-${new Date().toISOString().replace(/[:.]/g, '-')}`);

const VIEWPORTS = [
  [320, 568], [360, 640], [375, 667], [390, 844], [393, 852],
  [402, 874], [412, 915], [414, 896], [428, 926], [430, 932],
  [480, 853], [568, 320], [640, 360], [667, 375], [740, 360],
  [768, 1024], [800, 1280], [820, 1180], [834, 1194], [844, 390],
  [896, 414], [900, 2000], [912, 1368], [932, 430], [1024, 768],
  [1024, 1366], [1080, 1920], [1112, 834], [1180, 820], [1194, 834],
  [1280, 720], [1280, 800], [1280, 1024], [1366, 768], [1368, 912],
  [1440, 900], [1536, 864], [1600, 900], [1680, 1050], [1728, 1117],
  [1920, 1080], [1920, 1200], [2000, 900], [2048, 1152], [2160, 1440],
  [2560, 1080], [2560, 1440], [3000, 2000], [3440, 1440], [3840, 2160],
].map(([width, height], index) => ({ name: `vp-${String(index + 1).padStart(2, '0')}-${width}x${height}`, width, height }));

const ROUTES = ['/cs/', '/en/'];
const CASES = process.env.AUDIT_FULL_LOCALES === '1'
  ? ROUTES.flatMap((route) => VIEWPORTS.map((viewport) => ({ route, viewport })))
  : VIEWPORTS.map((viewport, index) => ({ route: ROUTES[index % ROUTES.length], viewport }));

function percentile(values, p) {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const idx = Math.min(sorted.length - 1, Math.max(0, Math.ceil((p / 100) * sorted.length) - 1));
  return sorted[idx];
}

function summarizeFrameIntervals(intervals) {
  const useful = intervals.filter((value) => Number.isFinite(value) && value > 0);
  return {
    frames: useful.length,
    average: useful.reduce((sum, value) => sum + value, 0) / Math.max(1, useful.length),
    p75: percentile(useful, 75),
    p95: percentile(useful, 95),
    max: useful.length ? Math.max(...useful) : 0,
    over50: useful.filter((value) => value > 50).length,
    over100: useful.filter((value) => value > 100).length,
  };
}

async function probeScroll(page, mode) {
  return page.evaluate(async ({ mode }) => {
    const root = document.scrollingElement || document.documentElement;
    const maxScroll = Math.max(0, root.scrollHeight - window.innerHeight);
    const starts = {
      full: 0,
      honeycomb: Math.max(0, (document.querySelector('[data-grid-section]')?.getBoundingClientRect().top ?? 0) + window.scrollY - window.innerHeight * 0.08),
      dataFeedback: Math.max(0, (document.querySelector('#data-feedback')?.getBoundingClientRect().top ?? 0) + window.scrollY - window.innerHeight * 0.15),
      orb: Math.max(0, (document.querySelector('[data-orb-wrapper]')?.getBoundingClientRect().top ?? 0) + window.scrollY - window.innerHeight * 0.15),
    };
    const startY = Math.min(maxScroll, starts[mode] ?? 0);
    const distance = mode === 'full'
      ? maxScroll
      : Math.min(maxScroll - startY, window.innerHeight * 2.7);
    const duration = mode === 'full' ? 900 : 650;

    root.scrollTo(0, startY);
    await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));

    const intervals = [];
    const layoutShifts = [];
    let observer;
    if ('PerformanceObserver' in window) {
      try {
        observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (!entry.hadRecentInput) layoutShifts.push(entry.value);
          }
        });
        observer.observe({ type: 'layout-shift', buffered: true });
      } catch {
        observer = undefined;
      }
    }

    return await new Promise((resolve) => {
      const started = performance.now();
      let last = started;

      const frame = (now) => {
        intervals.push(now - last);
        last = now;
        const t = Math.min(1, (now - started) / duration);
        const eased = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
        root.scrollTo(0, startY + distance * eased);
        if (t < 1) {
          requestAnimationFrame(frame);
          return;
        }
        window.setTimeout(() => {
          observer?.disconnect?.();
          resolve({
            mode,
            startY,
            endY: window.scrollY,
            scrollHeight: root.scrollHeight,
            intervals,
            cls: layoutShifts.reduce((sum, value) => sum + value, 0),
          });
        }, 80);
      };

      requestAnimationFrame(frame);
    });
  }, { mode });
}

async function inspectPage(page) {
  return page.evaluate(() => {
    const doc = document.documentElement;
    const body = document.body;
    const horizontalOverflow = Math.max(0, doc.scrollWidth - window.innerWidth, body.scrollWidth - window.innerWidth);
    const brokenImages = [...document.images]
      .filter((img) => img.complete && img.naturalWidth === 0)
      .map((img) => img.currentSrc || img.src || img.alt || 'unknown');
    const criticalSelectors = [
      '[data-grid-section]',
      '#data-feedback',
      '[data-orb-wrapper]',
      '#contact',
    ];
    const missingCritical = criticalSelectors.filter((selector) => !document.querySelector(selector));
    return { horizontalOverflow, brokenImages, missingCritical };
  });
}

async function run() {
  await mkdir(OUT_DIR, { recursive: true });
  const browser = await chromium.launch({ headless: true });
  const results = [];

  for (let index = 0; index < CASES.length; index += 1) {
    const { route, viewport } = CASES[index];
      const page = await browser.newPage({
        viewport: { width: viewport.width, height: viewport.height },
        deviceScaleFactor: viewport.width <= 480 ? 3 : viewport.width <= 1024 ? 2 : 1,
        isMobile: viewport.width <= 480,
        hasTouch: viewport.width <= 480,
      });

      const consoleMessages = [];
      const pageErrors = [];
      const failedRequests = [];
      page.on('console', (msg) => {
        if (['error', 'warning'].includes(msg.type())) {
          consoleMessages.push({ type: msg.type(), text: msg.text() });
        }
      });
      page.on('pageerror', (error) => pageErrors.push(error.message));
      page.on('requestfailed', (request) => {
        const url = request.url();
        if (!url.startsWith('data:')) {
          failedRequests.push({ url, failure: request.failure()?.errorText ?? 'request failed' });
        }
      });

      const url = new URL(route, BASE_URL).toString();
      const started = Date.now();
      try {
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
        await page.waitForLoadState('load', { timeout: 12000 }).catch(() => undefined);
        await page.evaluate(() => document.fonts?.ready).catch(() => undefined);
        await page.waitForTimeout(350);
        const pageState = await inspectPage(page);
        const probes = [];
        for (const mode of ['full', 'honeycomb', 'dataFeedback', 'orb']) {
          const probe = await probeScroll(page, mode);
          probes.push({
            ...probe,
            frameSummary: summarizeFrameIntervals(probe.intervals),
            intervals: undefined,
          });
        }
        results.push({
          route,
          viewport,
          ok: true,
          durationMs: Date.now() - started,
          pageState,
          probes,
          consoleMessages,
          pageErrors,
          failedRequests,
        });
        console.log(`[${index + 1}/${CASES.length}] ${route} ${viewport.width}x${viewport.height} ok`);
      } catch (error) {
        results.push({
          route,
          viewport,
          ok: false,
          durationMs: Date.now() - started,
          error: error instanceof Error ? error.message : String(error),
          consoleMessages,
          pageErrors,
          failedRequests,
        });
        console.log(`[${index + 1}/${CASES.length}] ${route} ${viewport.width}x${viewport.height} failed`);
      } finally {
        await page.close();
      }
  }

  await browser.close();

  const summary = {
    baseUrl: BASE_URL,
    generatedAt: new Date().toISOString(),
    routes: ROUTES,
    caseMode: process.env.AUDIT_FULL_LOCALES === '1' ? 'full-locales' : '50-route-alternating',
    viewportCount: VIEWPORTS.length,
    totalChecks: results.length,
    failures: results.filter((result) => !result.ok).length,
    consoleIssueCount: results.reduce((sum, result) => sum + (result.consoleMessages?.length ?? 0) + (result.pageErrors?.length ?? 0), 0),
    requestFailureCount: results.reduce((sum, result) => sum + (result.failedRequests?.length ?? 0), 0),
    overflowCount: results.filter((result) => (result.pageState?.horizontalOverflow ?? 0) > 2).length,
    brokenImageCount: results.reduce((sum, result) => sum + (result.pageState?.brokenImages?.length ?? 0), 0),
    worstFrames: [...results]
      .flatMap((result) =>
        (result.probes ?? []).map((probe) => ({
          route: result.route,
          viewport: result.viewport.name,
          mode: probe.mode,
          p95: probe.frameSummary.p95,
          max: probe.frameSummary.max,
          over50: probe.frameSummary.over50,
          over100: probe.frameSummary.over100,
          cls: probe.cls,
        })),
      )
      .sort((a, b) => b.p95 - a.p95)
      .slice(0, 20),
  };

  await writeFile(path.join(OUT_DIR, 'results.json'), JSON.stringify({ summary, results }, null, 2));
  console.log(JSON.stringify(summary, null, 2));

  if (
    summary.failures > 0 ||
    summary.consoleIssueCount > 0 ||
    summary.requestFailureCount > 0 ||
    summary.overflowCount > 0 ||
    summary.brokenImageCount > 0
  ) {
    process.exitCode = 1;
  }
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
