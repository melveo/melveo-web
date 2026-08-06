// preact/compat, not "react": the preact({ compat: true }) integration rewrites
// "react" to exactly this at build time, but TypeScript resolved the bare
// specifier to the untyped node_modules/react shim and every hook came back
// `any`. Importing the real target keeps the bundle identical and gives the
// typechecker something to work with. (Mapping it via tsconfig `paths` instead
// breaks the build — Astro feeds those to the bundler too.)
import { type CSSProperties, useEffect, useRef, useState } from "preact/compat";
import { useTranslations, type Lang } from "../i18n/ui";

type HexColor = "cyan" | "white";

const ACCENT = "#00F0FF";

const VBW = 1320;
const VBH = 780;
const CENTER = { x: 660, y: 390 };
const TEXT_RX = 108;
const TEXT_RY = 28;
const SIGNAL_TEXT_PATH_OFFSET = 10;
const SQRT3_HALF = Math.sqrt(3) / 2;

type InputDef = {
  id: string;
  label: string;
  x: number;
  y: number;
  r: number;
  color: HexColor;
  bowDir: 1 | -1 | 0;
  bowAmt: number;
};

type Props = {
  lang?: Lang;
};

const INPUT_LABELS: Record<Lang, Record<string, string>> = {
  cs: {
    sleep: "Spánek",
    mood: "Nálada",
    stress: "Stres",
    readiness: "Stav",
    pain: "Bolest",
    fatigue: "Únava",
    hrv: "HRV",
    load: "Zátěž",
    match: "Kontext",
  },
  en: {
    sleep: "Sleep",
    mood: "Mood",
    stress: "Stress",
    readiness: "Readiness",
    pain: "Pain",
    fatigue: "Fatigue",
    hrv: "HRV",
    load: "Load",
    match: "Context",
  },
};

function getInputLabel(lang: Lang, id: string, fallback: string) {
  return INPUT_LABELS[lang]?.[id] ?? fallback;
}

const INPUTS: InputDef[] = [
  { id: "sleep",     label: "Sleep",         x: 250, y: 80,  r: 36, color: "cyan",  bowDir: -1, bowAmt: 18 },
  { id: "mood",      label: "Mood",          x: 460, y: 145, r: 36, color: "white", bowDir: -1, bowAmt: 12 },
  { id: "stress",    label: "Stress",        x: 600, y: 130, r: 32, color: "cyan",  bowDir: -1, bowAmt: 22 },
  { id: "readiness", label: "Readiness",     x: 100, y: 215, r: 50, color: "white", bowDir: -1, bowAmt: 36 },
  { id: "pain",      label: "Pain",          x: 320, y: 310, r: 32, color: "cyan",  bowDir: -1, bowAmt: 8  },
  { id: "fatigue",   label: "Fatigue",       x: 170, y: 405, r: 42, color: "cyan",  bowDir:  1, bowAmt: 14 },
  { id: "hrv",       label: "HRV",           x: 60,  y: 555, r: 32, color: "white", bowDir:  1, bowAmt: 24 },
  { id: "load",      label: "Training load", x: 245, y: 610, r: 48, color: "white", bowDir:  1, bowAmt: 28 },
  { id: "match",     label: "Match context", x: 110, y: 695, r: 54, color: "cyan",  bowDir:  1, bowAmt: 38 },
];

const ACCENT_DOTS: Array<{ x: number; y: number; r: number }> = [
  { x: 60,  y: 130, r: 9 },
  { x: 280, y: 70,  r: 7 },
  { x: 470, y: 110, r: 10 },
  { x: 60,  y: 370, r: 9 },
  { x: 490, y: 320, r: 11 },
  { x: 55,  y: 540, r: 9 },
  { x: 470, y: 620, r: 10 },
  { x: 280, y: 720, r: 8 },
];

const HEX_OUT_R = 168;
const HEX_OUT_CENTER = { x: 1090, y: 390 };
const OUTPUT_ANCHOR = { x: HEX_OUT_CENTER.x - HEX_OUT_R, y: HEX_OUT_CENTER.y };

// ─── Mobile layout (vertical, compact) ───────────────────────────────────
// Compact viewBox so the whole section (inputs + melveo + Coach) fits in
// a single phone-sized viewport. Inputs are placed in an angular fan
// around melveo so each path has its own clear corridor — no hex crossings.
const MOBILE_VBW = 400;
const MOBILE_VBH = 680;
const MOBILE_CENTER = { x: 200, y: 444 };
const MOBILE_TEXT_RX = 76;
const MOBILE_TEXT_RY = 22;
const MOBILE_HEX_OUT_R = 92;
const MOBILE_HEX_OUT_CENTER = { x: 200, y: 590 };

// Organic scatter: each input occupies a unique angular slot around
// melveo (~15° gaps) so paths never cross hexes — but distances and
// sizes are intentionally shuffled (close-in mixed with far, sizes
// in no predictable order) so the layout reads as scattered rather
// than a symmetric arc.
const MOBILE_INPUTS: InputDef[] = [
  { id: "mood",      label: "Mood",          x: 108, y: 350, r: 25, color: "white", bowDir:  1, bowAmt: 18 },
  { id: "hrv",       label: "HRV",           x: 45,  y: 322, r: 22, color: "white", bowDir: -1, bowAmt: 160 },
  { id: "match",     label: "Match context", x: 104, y: 205, r: 34, color: "cyan",  bowDir: -1, bowAmt: 18 },
  { id: "sleep",     label: "Sleep",         x: 148, y: 252, r: 23, color: "cyan",  bowDir: -1, bowAmt: 3  },
  { id: "fatigue",   label: "Fatigue",       x: 200, y: 104, r: 30, color: "cyan",  bowDir:  1, bowAmt: 3  },
  { id: "pain",      label: "Pain",          x: 257, y: 232, r: 26, color: "cyan",  bowDir:  1, bowAmt: 3  },
  { id: "readiness", label: "Readiness",     x: 340, y: 202, r: 32, color: "white", bowDir:  1, bowAmt: 3  },
  { id: "stress",    label: "Stress",        x: 355, y: 288, r: 24, color: "cyan",  bowDir: -1, bowAmt: 38 },
  { id: "load",      label: "Training load", x: 336, y: 365, r: 28, color: "white", bowDir:  1, bowAmt: 4  },
];

const MOBILE_ACCENT_DOTS: Array<{ x: number; y: number; r: number }> = [
  { x: 130, y: 175, r: 7 },
  { x: 200, y: 240, r: 8 },
  { x: 270, y: 200, r: 7 },
  { x: 200, y: 380, r: 6 },
  { x: 200, y: 560, r: 6 },
];

function hexPolygon(cx: number, cy: number, r: number) {
  const s = SQRT3_HALF * r;
  return [
    [cx, cy - r],
    [cx + s, cy - r / 2],
    [cx + s, cy + r / 2],
    [cx, cy + r],
    [cx - s, cy + r / 2],
    [cx - s, cy - r / 2],
  ]
    .map(([x, y]) => `${x.toFixed(2)},${y.toFixed(2)}`)
    .join(" ");
}

function hexPolygonFlat(cx: number, cy: number, r: number) {
  const s = SQRT3_HALF * r;
  return [
    [cx + r, cy],
    [cx + r / 2, cy + s],
    [cx - r / 2, cy + s],
    [cx - r, cy],
    [cx - r / 2, cy - s],
    [cx + r / 2, cy - s],
  ]
    .map(([x, y]) => `${x.toFixed(2)},${y.toFixed(2)}`)
    .join(" ");
}

function inputPathD(inp: InputDef) {
  const vx = CENTER.x - inp.x;
  const vy = CENTER.y - inp.y;
  const len = Math.hypot(vx, vy) || 1;
  const ux = vx / len;
  const uy = vy / len;
  const sx = inp.x + ux * SIGNAL_TEXT_PATH_OFFSET;
  const sy = inp.y + uy * SIGNAL_TEXT_PATH_OFFSET;
  const angle = Math.atan2(sy - CENTER.y, sx - CENTER.x);
  const ex = CENTER.x + TEXT_RX * Math.cos(angle);
  const ey = CENTER.y + TEXT_RY * Math.sin(angle);
  const dx = ex - sx;
  const dy = ey - sy;
  const px = -dy / (Math.hypot(dx, dy) || 1);
  const py = dx / (Math.hypot(dx, dy) || 1);

  const cp1x = sx + dx * 0.38 + px * inp.bowDir * inp.bowAmt;
  const cp1y = sy + dy * 0.38 + py * inp.bowDir * inp.bowAmt;
  const cp2x = sx + dx * 0.72 + px * inp.bowDir * inp.bowAmt * 0.45;
  const cp2y = sy + dy * 0.72 + py * inp.bowDir * inp.bowAmt * 0.45;

  return `M ${sx.toFixed(1)} ${sy.toFixed(1)} C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${ex.toFixed(1)} ${ey.toFixed(1)}`;
}

function outputPathD() {
  const sx = CENTER.x + TEXT_RX;
  const sy = CENTER.y;
  const ex = OUTPUT_ANCHOR.x;
  const ey = OUTPUT_ANCHOR.y;
  const dx = ex - sx;
  return `M ${sx} ${sy} C ${sx + dx * 0.4} ${sy - 10}, ${sx + dx * 0.7} ${ey + 6}, ${ex} ${ey}`;
}

// Mobile path — straight angular ray from input hex edge to melveo's text
// edge. Each input is placed at a unique angular slot from melveo, so
// straight lines guarantee zero hex/path collisions.
function inputPathDMobile(inp: InputDef) {
  const vx = MOBILE_CENTER.x - inp.x;
  const vy = MOBILE_CENTER.y - inp.y;
  const len = Math.hypot(vx, vy) || 1;
  const ux = vx / len;
  const uy = vy / len;
  const sx = inp.x + ux * SIGNAL_TEXT_PATH_OFFSET;
  const sy = inp.y + uy * SIGNAL_TEXT_PATH_OFFSET;
  const angle = Math.atan2(sy - MOBILE_CENTER.y, sx - MOBILE_CENTER.x);
  const ex = MOBILE_CENTER.x + MOBILE_TEXT_RX * Math.cos(angle);
  const ey = MOBILE_CENTER.y + MOBILE_TEXT_RY * Math.sin(angle);
  // Tiny mid-point control with horizontal bow lets organic ease remain
  // without ever leaving the angular corridor.
  const midX = sx + (ex - sx) * 0.5 + inp.bowDir * inp.bowAmt;
  const midY = sy + (ey - sy) * 0.5;
  return `M ${sx.toFixed(1)} ${sy.toFixed(1)} Q ${midX.toFixed(1)} ${midY.toFixed(1)}, ${ex.toFixed(1)} ${ey.toFixed(1)}`;
}

function outputPathDMobile() {
  const sx = MOBILE_CENTER.x;
  const sy = MOBILE_CENTER.y + MOBILE_TEXT_RY;
  const ex = MOBILE_HEX_OUT_CENTER.x;
  const ey = MOBILE_HEX_OUT_CENTER.y - SQRT3_HALF * MOBILE_HEX_OUT_R;
  const dy = ey - sy;
  return `M ${sx} ${sy} C ${sx + 8} ${sy + dy * 0.4}, ${ex - 8} ${sy + dy * 0.7}, ${ex} ${ey}`;
}

function buildMobileHoneycomb() {
  const cells: Array<{ cx: number; cy: number; r: number }> = [];
  const r = 22;
  const stepX = SQRT3_HALF * r * 2;
  const stepY = r * 1.5;
  for (let row = -2; row * stepY < MOBILE_VBH + 30; row++) {
    for (let col = -1; col * stepX < MOBILE_VBW + 30; col++) {
      const offset = row % 2 === 0 ? 0 : stepX / 2;
      cells.push({ cx: col * stepX + offset, cy: row * stepY, r });
    }
  }
  return cells;
}

function buildHoneycomb() {
  const cells: Array<{ cx: number; cy: number; r: number }> = [];
  const r = 18;
  const stepX = SQRT3_HALF * r * 2;
  const stepY = r * 1.5;
  for (let row = -2; row * stepY < VBH + 30; row++) {
    for (let col = -1; col * stepX < 560; col++) {
      const offset = row % 2 === 0 ? 0 : stepX / 2;
      const cx = col * stepX + offset;
      const cy = row * stepY;
      cells.push({ cx, cy, r });
    }
  }
  return cells;
}

const HONEYCOMB_CELLS = buildHoneycomb();
const MOBILE_HONEYCOMB_CELLS = buildMobileHoneycomb();

type GsapInstance = typeof import("gsap")["gsap"];
type GsapTimeline = ReturnType<GsapInstance["timeline"]>;
type GsapTween = ReturnType<GsapInstance["delayedCall"]>;
type GsapWork = GsapTimeline | GsapTween;

// Charge / release tuning — shared by desktop and mobile
const CHARGE_THRESHOLD = 6;
const SCALE_PER_CHARGE = 0.038;
const BLOOM_OP_PER_CHARGE = 0;
const BLOOM_SCALE_PER_CHARGE = 0;
const BASE_BLOOM_OPACITY = 0;
const RELEASE_DURATION = 1.6;
const BASE_FILTER = "drop-shadow(0 0 22px rgba(0, 240, 255, 0.55))";
const FLASH_FILTER = "drop-shadow(0 0 36px rgba(190, 250, 255, 0.78))";

function setupMobileAnimation(
  gsap: GsapInstance,
  isCancelled: () => boolean,
  root: HTMLElement | null,
) {
  if (!root) return;
  const svg = root.querySelector<SVGSVGElement>(".data-flow-mobile__svg");
  if (!svg) return;

  let energy = 0;
  let pendingRelease = false;
  let running = false;
  let raf = 0;
  let visible = true;
  const mobileChargeThreshold = 5;
  const maxMobileActiveInputs = 3;

  const coreText = svg.querySelector<SVGTextElement>("[data-core-text]");
  const coreBloom = svg.querySelector<SVGEllipseElement>("[data-core-bloom]");
  const outputHexFlash = svg.querySelector<SVGPolygonElement>(
    "[data-output-flash]",
  );
  const outputHexGroup = svg.querySelector<SVGGElement>("[data-output-group]");
  const outputHexHalo = svg.querySelector<SVGPolygonElement>(
    "[data-output-halo]",
  );
  const outputPath = svg.querySelector<SVGPathElement>("[data-output-path]");
  const outputPulse = svg.querySelector<SVGCircleElement>("[data-output-pulse]");

  const samplePath = (path: SVGPathElement, steps = 96) => {
    const length = path.getTotalLength();
    return Array.from({ length: steps + 1 }, (_, index) => {
      const point = path.getPointAtLength((length * index) / steps);
      return { x: point.x, y: point.y };
    });
  };

  const sampledInputs = MOBILE_INPUTS.map((inp) => {
    const path = svg.querySelector<SVGPathElement>(
      `[data-input-path="${inp.id}"]`,
    );
    const pulse = svg.querySelector<SVGCircleElement>(
      `[data-input-pulse="${inp.id}"]`,
    );
    const flash = svg.querySelector<SVGTextElement>(
      `[data-input-flash="${inp.id}"]`,
    );
    if (!path || !pulse) return null;
    return {
      inp,
      path,
      pulse,
      flash,
      points: samplePath(path),
      active: false,
      startAt: 0,
      duration: 960 + Math.random() * 260,
    };
  }).filter((item): item is NonNullable<typeof item> => Boolean(item));
  const outputPoints = outputPath ? samplePath(outputPath, 84) : [];

  const shuffleSignals = <T,>(items: T[]) => {
    const shuffled = [...items];
    for (let index = shuffled.length - 1; index > 0; index -= 1) {
      const swapIndex = Math.floor(Math.random() * (index + 1));
      [shuffled[index], shuffled[swapIndex]] = [
        shuffled[swapIndex],
        shuffled[index],
      ];
    }
    return shuffled;
  };
  let signalQueue = shuffleSignals(sampledInputs);
  let nextMobilePulseAt = performance.now() + 120 + Math.random() * 360;

  if (coreText) {
    gsap.set(coreText, {
      scale: 1,
      svgOrigin: `${MOBILE_CENTER.x} ${MOBILE_CENTER.y}`,
    });
  }
  if (coreBloom) {
    gsap.set(coreBloom, {
      scale: 1,
      svgOrigin: `${MOBILE_CENTER.x} ${MOBILE_CENTER.y}`,
      opacity: BASE_BLOOM_OPACITY,
    });
  }

  const animateToEnergy = (target: number, duration: number) => {
    const targetScale = 1 + target * SCALE_PER_CHARGE;
    const targetBloomOp = Math.min(
      0.95,
      BASE_BLOOM_OPACITY + target * BLOOM_OP_PER_CHARGE,
    );
    const targetBloomScale = 1 + target * BLOOM_SCALE_PER_CHARGE;

    if (coreText) {
      gsap.killTweensOf(coreText, "scale");
      gsap.to(coreText, {
        scale: targetScale,
        duration,
        svgOrigin: `${MOBILE_CENTER.x} ${MOBILE_CENTER.y}`,
        ease: target > 0 ? "power3.out" : "power2.inOut",
      });
    }
    if (coreBloom) {
      gsap.killTweensOf(coreBloom, "scale,opacity");
      gsap.to(coreBloom, {
        opacity: targetBloomOp,
        scale: targetBloomScale,
        duration,
        svgOrigin: `${MOBILE_CENTER.x} ${MOBILE_CENTER.y}`,
        ease: "power2.out",
      });
    }
  };

  const chargeMelveo = () => {
    energy += 1;
    animateToEnergy(energy, 0.58);
    if (energy >= mobileChargeThreshold && !pendingRelease) {
      pendingRelease = true;
      gsap.delayedCall(0.3, () => {
        const energyAtRelease = energy;
        energy = 0;
        pendingRelease = false;
        releaseToOutput(energyAtRelease);
      });
    }
  };

  const releaseToOutput = (energyAtRelease: number) => {
    // Drain melveo energy back to 0 over release duration.
    // If new particles arrive during this drain, chargeMelveo will
    // kill these tweens and grow melveo again — fully reactive.
    animateToEnergy(0, RELEASE_DURATION);
    const outputScale =
      1 + Math.min(energyAtRelease / mobileChargeThreshold - 1, 1) * 0.5;
    gsap.delayedCall(0.22, () => {
      animateOutputPulse(() => pulseCoach(outputScale));
    });
  };

  const animateOutputPulse = (onImpact?: () => void) => {
    if (!outputPath || !outputPulse || outputPoints.length === 0) return;

    const state = { progress: 0 };
    gsap.killTweensOf(state);
    gsap.fromTo(
      state,
      { progress: 0 },
      {
        progress: 1,
        duration: 0.88,
        ease: "sine.inOut",
        onStart: () => {
          outputPulse.setAttribute("opacity", "0");
          outputPath.setAttribute("opacity", "0.58");
        },
        onUpdate: () => {
          const raw = state.progress;
          const index = Math.min(
            outputPoints.length - 1,
            Math.round(raw * (outputPoints.length - 1)),
          );
          const point = outputPoints[index];
          const alphaIn = Math.min(1, raw / 0.2);
          const alphaOut = raw > 0.92 ? Math.max(0, (1 - raw) / 0.08) : 1;
          const alpha = alphaIn * alphaOut;
          outputPulse.setAttribute("cx", point.x.toFixed(1));
          outputPulse.setAttribute("cy", point.y.toFixed(1));
          outputPulse.setAttribute("opacity", (0.94 * alpha).toFixed(3));
          outputPulse.setAttribute("r", (5.2 + 2.4 * alpha).toFixed(2));
          outputPath.setAttribute(
            "opacity",
            (0.5 + Math.sin(raw * Math.PI) * 0.42).toFixed(3),
          );
        },
        onComplete: () => {
          outputPulse.setAttribute("opacity", "0");
          outputPath.setAttribute("opacity", "0.85");
          onImpact?.();
        },
      },
    );
  };

  const pulseCoach = (outputScale = 1) => {
    if (outputHexFlash) {
      gsap.fromTo(
        outputHexFlash,
        { opacity: 0 },
        { opacity: 1, duration: 0.16, yoyo: true, repeat: 1, ease: "power2.out" },
      );
    }
    if (outputHexGroup) {
      gsap.fromTo(
        outputHexGroup,
        {
          scale: 1,
          svgOrigin: `${MOBILE_HEX_OUT_CENTER.x} ${MOBILE_HEX_OUT_CENTER.y}`,
        },
        {
          scale: 1.045 + 0.02 * outputScale,
          duration: 0.26,
          ease: "power3.out",
          onComplete: () => {
            gsap.to(outputHexGroup, {
              scale: 1,
              duration: 0.72,
              ease: "power3.out",
              svgOrigin: `${MOBILE_HEX_OUT_CENTER.x} ${MOBILE_HEX_OUT_CENTER.y}`,
            });
          },
        },
      );
    }
    if (outputHexHalo) {
      gsap.fromTo(
        outputHexHalo,
        {
          opacity: 0.9,
          scale: 1,
          svgOrigin: `${MOBILE_HEX_OUT_CENTER.x} ${MOBILE_HEX_OUT_CENTER.y}`,
        },
        {
          opacity: 1,
          scale: 1.025 + 0.02 * outputScale,
          duration: 0.24,
          ease: "power3.out",
          onComplete: () => {
            gsap.to(outputHexHalo, {
              opacity: 0.9,
              scale: 1,
              duration: 0.76,
              ease: "power3.out",
              svgOrigin: `${MOBILE_HEX_OUT_CENTER.x} ${MOBILE_HEX_OUT_CENTER.y}`,
            });
          },
        },
      );
    }
  };

  const tick = (now: number) => {
    if (isCancelled() || !visible || document.hidden) {
      running = false;
      return;
    }

    let activeInputs = 0;
    for (const signal of sampledInputs) {
      if (signal.active) activeInputs += 1;
    }

    if (
      activeInputs < maxMobileActiveInputs &&
      now >= nextMobilePulseAt &&
      sampledInputs.length > 0
    ) {
      if (signalQueue.length === 0) {
        signalQueue = shuffleSignals(sampledInputs);
      }
      const nextSignal = signalQueue.find((signal) => !signal.active);
      if (nextSignal) {
        signalQueue = signalQueue.filter((signal) => signal !== nextSignal);
        nextSignal.active = true;
        nextSignal.startAt = now;
        nextSignal.duration = 900 + Math.random() * 360;
        nextSignal.path.setAttribute("opacity", "0.7");
        nextMobilePulseAt = now + 120 + Math.random() * 420;
      }
    }

    for (const signal of sampledInputs) {
      if (!signal.active) continue;
      const raw = Math.min(1, (now - signal.startAt) / signal.duration);
      const eased = 0.5 - Math.cos(raw * Math.PI) / 2;
      const index = Math.min(
        signal.points.length - 1,
        Math.round(eased * (signal.points.length - 1)),
      );
      const point = signal.points[index];
      const alphaIn = Math.min(1, raw / 0.18);
      const alphaOut = raw > 0.82 ? Math.max(0, (1 - raw) / 0.18) : 1;
      const alpha = alphaIn * alphaOut;
      signal.pulse.setAttribute("cx", point.x.toFixed(1));
      signal.pulse.setAttribute("cy", point.y.toFixed(1));
      signal.pulse.setAttribute("opacity", (0.92 * alpha).toFixed(3));
      signal.pulse.setAttribute("r", (4.2 + 2.2 * alpha).toFixed(2));
      signal.path.setAttribute(
        "opacity",
        (0.2 + Math.sin(raw * Math.PI) * 0.48).toFixed(3),
      );
      if (signal.flash) {
        signal.flash.setAttribute(
          "opacity",
          raw < 0.22 ? (0.7 * (1 - raw / 0.22)).toFixed(3) : "0",
        );
      }

      if (raw >= 1) {
        signal.active = false;
        signal.pulse.setAttribute("opacity", "0");
        signal.path.setAttribute("opacity", "0.28");
        signal.flash?.setAttribute("opacity", "0");
        nextMobilePulseAt = now + 120 + Math.random() * 460;
        chargeMelveo();
      }
    }

    raf = requestAnimationFrame(tick);
  };

  const startLoop = () => {
    if (running || isCancelled()) return;
    running = true;
    raf = requestAnimationFrame(tick);
  };

  const localIo = new IntersectionObserver(
    ([entry]) => {
      visible = !!entry?.isIntersecting;
      if (visible) startLoop();
    },
    { rootMargin: "180px 0px" },
  );
  localIo.observe(svg);
  const onVisibility = () => {
    if (!document.hidden) startLoop();
  };
  document.addEventListener("visibilitychange", onVisibility);
  startLoop();

  return () => {
    localIo.disconnect();
    document.removeEventListener("visibilitychange", onVisibility);
    cancelAnimationFrame(raf);
  };
}

export default function MelveoDataFlowHero({ lang = "en" }: Props) {
  const t = useTranslations(lang);
  const flowAria =
    lang === "cs"
      ? "Hráčské signály tečou do melveo. Melveo vytváří výstup pro trenéra."
      : "Player signals flow into melveo. Melveo outputs a coach decision.";
  const rootRef = useRef<HTMLElement | null>(null);
  const inputPathRefs = useRef<Record<string, SVGPathElement | null>>({});
  const inputPulseRefs = useRef<Record<string, SVGCircleElement | null>>({});
  const outputPathRef = useRef<SVGPathElement | null>(null);
  const outputPulseRef = useRef<SVGCircleElement | null>(null);
  const outputHexFlashRef = useRef<SVGPolygonElement | null>(null);
  const outputHexHaloRef = useRef<SVGPolygonElement | null>(null);
  const outputHexGroupRef = useRef<SVGGElement | null>(null);
  const inputFlashRefs = useRef<Record<string, SVGTextElement | null>>({});
  const coreTextRef = useRef<SVGTextElement | null>(null);
  const coreBloomRef = useRef<SVGEllipseElement | null>(null);

  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const motionQ = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(motionQ.matches);
    sync();
    motionQ.addEventListener("change", sync);
    return () => motionQ.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined" || reduced) return;
    let cancelled = false;
    let ctx: { revert: () => void } | null = null;
    let io: IntersectionObserver | null = null;
    let onVisibilityChange: (() => void) | null = null;
    let mobileCleanup: (() => void) | null = null;
    const activeGsapWork: GsapWork[] = [];
    const isMobile = window.matchMedia("(max-width: 900px)").matches;

    /*
      Pause only this section's GSAP work while it is out of view.
      Sleeping the global ticker also affects unrelated page animation,
      which can make later sections feel choppy after this island mounts.
    */
    let isVisible = false;
    let tabHidden = document.hidden;
    // One-shot entrance choreography — assigned inside the gsap.context
    // (desktop branch) and fired on the FIRST intersection so the
    // section arrives as a moment instead of already-running wallpaper.
    let playEntrance: () => void = () => {};
    const trackGsapWork = <T extends GsapWork>(work: T) => {
      activeGsapWork.push(work);
      const remove = () => {
        const index = activeGsapWork.indexOf(work);
        if (index >= 0) activeGsapWork.splice(index, 1);
      };
      const originalOnComplete = work.eventCallback("onComplete");
      work.eventCallback("onComplete", function (this: unknown, ...args: unknown[]) {
        originalOnComplete?.apply(this, args);
        remove();
      });
      if (!isVisible || tabHidden) work.pause();
      return work;
    };
    function syncPlayState() {
      const shouldPlay = isVisible && !tabHidden;
      for (const work of activeGsapWork) {
        if (shouldPlay) work.resume();
        else work.pause();
      }
    }

    void (async () => {
      const { gsap } = await import("gsap");
      if (cancelled || !rootRef.current) return;
      if (!isMobile) {
        const { MotionPathPlugin } = await import("gsap/MotionPathPlugin");
        if (cancelled || !rootRef.current) return;
        gsap.registerPlugin(MotionPathPlugin);
      }

      // Pause when scrolled out of viewport. rootMargin gives a
      // small "warm-up" zone so the animation is already running
      // by the time the section reaches the edge of the screen.
      io = new IntersectionObserver(
        ([entry]) => {
          isVisible = !!entry?.isIntersecting;
          syncPlayState();
          if (isVisible) playEntrance();
        },
        { rootMargin: "200px 0px" },
      );
      io.observe(rootRef.current);

      // Also pause on tab hide.
      onVisibilityChange = () => {
        tabHidden = document.hidden;
        syncPlayState();
      };
      document.addEventListener("visibilitychange", onVisibilityChange);

      ctx = gsap.context(() => {
        if (isMobile) {
          mobileCleanup = setupMobileAnimation(
            gsap,
            () => cancelled,
            rootRef.current,
          ) ?? null;
          return;
        }
        /*
          One-shot entrance (2026-06-10): the first time the section
          scrolls into view, the signal labels rise in staggered, the
          melveo core breathes up and the coach hex pops — after that
          the ambient pulse loop carries on as before. Runs inside the
          gsap.context so revert() cleans it; gated by the same
          `reduced` guard as the whole effect.
        */
        let entranceDone = false;
        playEntrance = () => {
          if (entranceDone || cancelled || !rootRef.current) return;
          entranceDone = true;
          const svgRoot = rootRef.current.querySelector<SVGSVGElement>(
            ".data-flow-svg",
          );
          if (!svgRoot) return;
          const nodes = svgRoot.querySelectorAll("[data-input-node]");
          const tl = trackGsapWork(gsap.timeline());
          if (nodes.length > 0) {
            tl.from(nodes, {
              opacity: 0,
              y: 14,
              duration: 0.55,
              ease: "power2.out",
              stagger: 0.05,
            });
          }
          if (coreTextRef.current) {
            tl.from(
              coreTextRef.current,
              {
                opacity: 0,
                scale: 0.9,
                svgOrigin: `${CENTER.x} ${CENTER.y}`,
                duration: 0.5,
                ease: "power2.out",
              },
              0.15,
            );
          }
          if (outputHexGroupRef.current) {
            tl.from(
              outputHexGroupRef.current,
              {
                opacity: 0,
                scale: 0.88,
                transformOrigin: "50% 50%",
                duration: 0.55,
                ease: "back.out(1.6)",
              },
              0.4,
            );
          }
        };

        let energy = 0;
        let pendingRelease = false;
        if (coreTextRef.current) {
          gsap.set(coreTextRef.current, {
            scale: 1,
            svgOrigin: `${CENTER.x} ${CENTER.y}`,
          });
        }
        if (coreBloomRef.current) {
          gsap.set(coreBloomRef.current, {
            scale: 1,
            svgOrigin: `${CENTER.x} ${CENTER.y}`,
          });
        }

        const flashMelveo = () => {
          const text = coreTextRef.current;
          if (!text) return;
          gsap.killTweensOf(text, "filter");
          gsap
            .timeline()
            .to(text, {
              filter: FLASH_FILTER,
              duration: 0.22,
              ease: "power2.out",
            })
            .to(text, {
              filter: BASE_FILTER,
              duration: 0.78,
              ease: "power2.inOut",
            });
        };

        const animateToEnergy = (target: number, duration: number) => {
          const text = coreTextRef.current;
          const bloom = coreBloomRef.current;
          if (!text) return;
          const targetScale = 1 + target * SCALE_PER_CHARGE;
          const targetBloomOp = Math.min(
            0.95,
            BASE_BLOOM_OPACITY + target * BLOOM_OP_PER_CHARGE,
          );
          const targetBloomScale = 1 + target * BLOOM_SCALE_PER_CHARGE;

          gsap.killTweensOf(text, "scale");
          gsap.to(text, {
            scale: targetScale,
            duration,
            svgOrigin: `${CENTER.x} ${CENTER.y}`,
            ease: target > 0 ? "power3.out" : "power2.inOut",
          });
          if (bloom) {
            gsap.killTweensOf(bloom, "scale,opacity");
            gsap.to(bloom, {
              opacity: targetBloomOp,
              scale: targetBloomScale,
              duration,
              svgOrigin: `${CENTER.x} ${CENTER.y}`,
              ease: "power2.out",
            });
          }
        };

        const chargeMelveo = () => {
          flashMelveo();
          energy += 1;
          animateToEnergy(energy, 0.68);
          if (energy >= CHARGE_THRESHOLD && !pendingRelease) {
            pendingRelease = true;
            trackGsapWork(gsap.delayedCall(0.3, () => {
              const energyAtRelease = energy;
              energy = 0;
              pendingRelease = false;
              releaseToOutput(energyAtRelease);
            }));
          }
        };

        const releaseToOutput = (energyAtRelease: number) => {
          const outputScale =
            1 + Math.min(energyAtRelease / CHARGE_THRESHOLD - 1, 1) * 0.5;

          animateToEnergy(0, RELEASE_DURATION);

          const tl = trackGsapWork(gsap.timeline({ delay: 0.34 }));
          const outputTravelDuration = 0.92;
          const outputImpactAt = 0.9;
          const outputPath = outputPathRef.current;
          const outputPulse = outputPulseRef.current;
          if (outputPath && outputPulse) {
            tl.fromTo(
              outputPulse,
              {
                autoAlpha: 0,
                motionPath: {
                  path: outputPath,
                  align: outputPath,
                  alignOrigin: [0.5, 0.5],
                  start: 0,
                  end: 0,
                },
              },
              {
                autoAlpha: 1,
                duration: outputTravelDuration,
                ease: "sine.inOut",
                motionPath: {
                  path: outputPath,
                  align: outputPath,
                  alignOrigin: [0.5, 0.5],
                  start: 0,
                  end: 1,
                },
              },
              0,
            );
            tl.to(outputPulse, { autoAlpha: 0, duration: 0.2 }, outputImpactAt);
            tl.fromTo(
              outputPath,
              { opacity: 0.35, strokeWidth: 1.5 },
              {
                opacity: 0.96,
                strokeWidth: 2.5,
                duration: 0.28,
                ease: "sine.out",
              },
              0,
            );
            tl.to(
              outputPath,
              {
                opacity: 0.72,
                strokeWidth: 1.8,
                duration: 0.55,
                ease: "sine.inOut",
              },
              0.36,
            );
          }
          const coachFlash = outputHexFlashRef.current;
          if (coachFlash) {
            tl.fromTo(
              coachFlash,
              { opacity: 0 },
              {
                opacity: 1,
                  duration: 0.18,
                  ease: "power2.out",
                onComplete: () => {
                  gsap.to(coachFlash, {
                    opacity: 0,
                    duration: 0.72,
                    ease: "power3.out",
                  });
                },
              },
              outputImpactAt,
            );
          }
          const coachGroup = outputHexGroupRef.current;
          if (coachGroup) {
            tl.fromTo(
              coachGroup,
              {
                scale: 1,
                svgOrigin: `${HEX_OUT_CENTER.x} ${HEX_OUT_CENTER.y}`,
              },
              {
                scale: 1.04 + 0.018 * outputScale,
                duration: 0.26,
                ease: "power3.out",
                onComplete: () => {
                  gsap.to(coachGroup, {
                    scale: 1,
                    duration: 0.9,
                    ease: "elastic.out(1, 0.72)",
                    svgOrigin: `${HEX_OUT_CENTER.x} ${HEX_OUT_CENTER.y}`,
                  });
                },
              },
              outputImpactAt,
            );
          }
          const coachHalo = outputHexHaloRef.current;
          if (coachHalo) {
            tl.fromTo(
              coachHalo,
              {
                opacity: 0.9,
                scale: 1,
                svgOrigin: `${HEX_OUT_CENTER.x} ${HEX_OUT_CENTER.y}`,
              },
              {
                opacity: 1,
                scale: 1.025 + 0.02 * outputScale,
                duration: 0.24,
                ease: "power3.out",
                onComplete: () => {
                  gsap.to(coachHalo, {
                    opacity: 0.9,
                    scale: 1,
                    duration: 0.95,
                    ease: "elastic.out(1, 0.75)",
                    svgOrigin: `${HEX_OUT_CENTER.x} ${HEX_OUT_CENTER.y}`,
                  });
                },
              },
              outputImpactAt,
            );
          }
        };

        const schedulePulse = (inp: InputDef, delay: number) => {
          if (cancelled) return;
          trackGsapWork(gsap.delayedCall(delay, () => {
            if (cancelled) return;
            const path = inputPathRefs.current[inp.id];
            const pulse = inputPulseRefs.current[inp.id];
            if (!path || !pulse) {
              schedulePulse(inp, 1.5);
              return;
            }

            const tl = trackGsapWork(gsap.timeline());
            tl.fromTo(
              pulse,
              {
                autoAlpha: 0,
                motionPath: {
                  path,
                  align: path,
                  alignOrigin: [0.5, 0.5],
                  start: 0,
                  end: 0,
                },
              },
              {
                autoAlpha: 1,
                duration: 1.58,
                ease: "sine.inOut",
                motionPath: {
                  path,
                  align: path,
                  alignOrigin: [0.5, 0.5],
                  start: 0,
                  end: 1,
                },
              },
              0,
            );
            tl.fromTo(
              path,
              { opacity: 0.18, strokeWidth: 1 },
              {
                opacity: 0.82,
                strokeWidth: 1.6,
                duration: 0.46,
                ease: "sine.out",
              },
              0,
            );
            tl.to(
              path,
              {
                opacity: 0.18,
                strokeWidth: 1,
                duration: 0.9,
                ease: "sine.inOut",
              },
              0.68,
            );
            tl.to(pulse, { autoAlpha: 0, duration: 0.24 }, 1.46);
            const flash = inputFlashRefs.current[inp.id];
            if (flash) {
              tl.fromTo(
                flash,
                { opacity: 0 },
                {
                  opacity: 0.95,
                  duration: 0.08,
                  ease: "power2.out",
                  onComplete: () => {
                    gsap.to(flash, {
                      opacity: 0,
                      duration: 0.5,
                      ease: "power2.inOut",
                    });
                  },
                },
                0,
              );
            }
            tl.call(
              () => {
                chargeMelveo();
              },
              [],
              1.54,
            );
            tl.call(
              () => {
                schedulePulse(inp, 1.45 + Math.random() * 2.65);
              },
              [],
            );
          }));
        };

        INPUTS.forEach((inp) => {
          schedulePulse(inp, 0.2 + Math.random() * 2.4);
        });
        syncPlayState();
        // If the section was already in view before this context wired
        // up (slow gsap import), fire the entrance now — the IO
        // callback that normally does it has already happened.
        if (isVisible) playEntrance();
      }, rootRef);
    })();

    return () => {
      cancelled = true;
      mobileCleanup?.();
      [...activeGsapWork].forEach((work) => work.kill());
      activeGsapWork.length = 0;
      ctx?.revert();
      io?.disconnect();
      if (onVisibilityChange) {
        document.removeEventListener("visibilitychange", onVisibilityChange);
      }
    };
  }, [reduced]);

  return (
    <section
      id="data-feedback"
      ref={rootRef}
      className="data-flow-stage"
      style={{ "--accent": ACCENT } as CSSProperties}
      aria-labelledby="melveo-flow-heading"
    >
      <div className="data-flow-inner">
        <header className="data-flow-header">
          <h2 id="melveo-flow-heading" className="data-flow-headline">
            {t("privacy.headlineLine1")} <span>{t("privacy.headlineLine2")}</span>
          </h2>
          <p className="data-flow-subline">{t("privacy.body")}</p>
        </header>

        <div className="data-flow-visual">
          <div className="data-flow-visual__mobile">
            <MobileFlow reduced={reduced} lang={lang} />
          </div>

          <div className="data-flow-visual__desktop">
            <svg
              className="data-flow-svg"
              viewBox={`0 0 ${VBW} ${VBH}`}
              preserveAspectRatio="xMidYMid meet"
              role="img"
              aria-label={flowAria}
            >
              <defs>
                <linearGradient id="melveo-line" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="rgba(0,240,255,0.04)" />
                  <stop offset="55%" stopColor="rgba(0,240,255,0.5)" />
                  <stop offset="100%" stopColor="rgba(0,240,255,0.18)" />
                </linearGradient>
                <linearGradient id="melveo-line-out" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="rgba(0,240,255,0.5)" />
                  <stop offset="100%" stopColor="rgba(0,240,255,0.9)" />
                </linearGradient>
                <radialGradient id="melveo-pulse" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="rgba(255,255,255,1)" />
                  <stop offset="35%" stopColor="rgba(0,240,255,0.85)" />
                  <stop offset="100%" stopColor="rgba(0,240,255,0)" />
                </radialGradient>
                <radialGradient id="melveo-bloom" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="rgba(0,240,255,0.55)" />
                  <stop offset="55%" stopColor="rgba(0,240,255,0.15)" />
                  <stop offset="100%" stopColor="rgba(0,240,255,0)" />
                </radialGradient>
                <filter id="melveo-glow">
                  <feGaussianBlur stdDeviation="3" />
                </filter>
                <filter id="melveo-bloom-blur">
                  <feGaussianBlur stdDeviation="20" />
                </filter>
                <radialGradient id="left-fade" cx="20%" cy="50%" r="62%">
                  <stop offset="0%" stopColor="rgba(255,255,255,1)" />
                  <stop offset="70%" stopColor="rgba(255,255,255,0.35)" />
                  <stop offset="100%" stopColor="rgba(255,255,255,0)" />
                </radialGradient>
                <linearGradient id="hex-cell-fill" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="rgba(10,28,32,0.92)" />
                  <stop offset="100%" stopColor="rgba(2,8,12,0.96)" />
                </linearGradient>
                <radialGradient id="hex-cell-glow" cx="50%" cy="50%" r="55%">
                  <stop offset="0%" stopColor="rgba(0,240,255,0.35)" />
                  <stop offset="60%" stopColor="rgba(0,240,255,0.08)" />
                  <stop offset="100%" stopColor="rgba(0,240,255,0)" />
                </radialGradient>
                <radialGradient id="signal-orb-cyan" cx="42%" cy="34%" r="62%">
                  <stop offset="0%" stopColor="rgba(120,255,255,0.42)" />
                  <stop offset="38%" stopColor="rgba(0,240,255,0.18)" />
                  <stop offset="100%" stopColor="rgba(2,10,13,0.94)" />
                </radialGradient>
                <radialGradient id="signal-orb-white" cx="42%" cy="34%" r="62%">
                  <stop offset="0%" stopColor="rgba(255,255,255,0.58)" />
                  <stop offset="42%" stopColor="rgba(205,247,251,0.16)" />
                  <stop offset="100%" stopColor="rgba(2,10,13,0.94)" />
                </radialGradient>
                <radialGradient id="coach-orb" cx="42%" cy="36%" r="62%">
                  <stop offset="0%" stopColor="rgba(190,255,255,0.42)" />
                  <stop offset="36%" stopColor="rgba(0,240,255,0.28)" />
                  <stop offset="100%" stopColor="rgba(0,22,26,0.96)" />
                </radialGradient>
                <mask id="honey-mask">
                  <rect width={VBW} height={VBH} fill="url(#left-fade)" />
                </mask>
              </defs>

              <g mask="url(#honey-mask)" opacity="0.22">
                {HONEYCOMB_CELLS.map((c, i) => (
                  <polygon
                    key={i}
                    points={hexPolygon(c.cx, c.cy, c.r)}
                    fill="none"
                    stroke="rgba(0,240,255,0.05)"
                    strokeWidth="0.8"
                  />
                ))}
              </g>

              {ACCENT_DOTS.map((d, i) => (
                <g key={`dot-${i}`}>
                  <polygon
                    points={hexPolygon(d.x, d.y, d.r)}
                    fill="none"
                    stroke="rgba(0,240,255,0.18)"
                    strokeWidth="0.9"
                  />
                  <circle cx={d.x} cy={d.y} r="1.2" fill="rgba(0,240,255,0.45)" />
                </g>
              ))}

              {INPUTS.map((inp) => (
                <path
                  key={`p-${inp.id}`}
                  ref={(el) => {
                    inputPathRefs.current[inp.id] = el;
                  }}
                  d={inputPathD(inp)}
                  stroke="url(#melveo-line)"
                  strokeWidth="1.2"
                  fill="none"
                  opacity="0.28"
                />
              ))}

              <path
                ref={outputPathRef}
                data-output-path
                d={outputPathD()}
                stroke="url(#melveo-line-out)"
                strokeWidth="1.8"
                fill="none"
                opacity="0.85"
              />

              <g ref={outputHexGroupRef} data-output-group>
                <polygon
                  ref={outputHexHaloRef}
                  points={hexPolygonFlat(
                    HEX_OUT_CENTER.x,
                    HEX_OUT_CENTER.y,
                    HEX_OUT_R + 36,
                  )}
                  fill="url(#hex-cell-glow)"
                  opacity="0.85"
                />
                <polygon
                  points={hexPolygonFlat(
                    HEX_OUT_CENTER.x,
                    HEX_OUT_CENTER.y,
                    HEX_OUT_R,
                  )}
                  fill={ACCENT}
                  stroke="rgba(205, 247, 251, 0.9)"
                  strokeWidth="1.8"
                  strokeLinejoin="round"
                />
                <polygon
                  ref={outputHexFlashRef}
                  points={hexPolygonFlat(
                    HEX_OUT_CENTER.x,
                    HEX_OUT_CENTER.y,
                    HEX_OUT_R - 2,
                  )}
                  fill="#FFFFFF"
                  opacity="0"
                />
                <text
                  x={HEX_OUT_CENTER.x}
                  y={HEX_OUT_CENTER.y - 3}
                  textAnchor="middle"
                  fill="#001014"
                  style={{
                    fontSize: "38px",
                    fontWeight: 850,
                    letterSpacing: "-0.02em",
                  }}
                >
                  {lang === "cs" ? "Trenér" : "Coach"}
                </text>
                <text
                  x={HEX_OUT_CENTER.x}
                  y={HEX_OUT_CENTER.y + 33}
                  textAnchor="middle"
                  fill="rgba(0,16,20,0.64)"
                  style={{
                    fontSize: "15px",
                    fontWeight: 800,
                    letterSpacing: "-0.01em",
                  }}
                >
                  {lang === "cs" ? "ví, co řešit." : "knows what to do."}
                </text>
              </g>

              <ellipse
                ref={coreBloomRef}
                cx={CENTER.x}
                cy={CENTER.y}
                rx={210}
                ry={80}
                fill="url(#melveo-bloom)"
                filter="url(#melveo-bloom-blur)"
                opacity="0"
              />
              <text
                ref={coreTextRef}
                data-core-text="true"
                x={CENTER.x}
                y={CENTER.y + 22}
                textAnchor="middle"
                fill={ACCENT}
                style={{
                  fontFamily: "var(--font-wordmark)",
                  fontSize: "70px",
                  fontWeight: 700,
                  letterSpacing: "-0.02em",
                  textTransform: "lowercase",
                  filter: "drop-shadow(0 0 30px rgba(0,240,255,0.55))",
                }}
              >
                melveo
              </text>

              {INPUTS.map((inp) => {
                const label = getInputLabel(lang, inp.id, inp.label);
                const fontSize = inp.r < 35 ? 17 : inp.r < 50 ? 18 : 20;
                return (
                  <g
                    key={inp.id}
                    data-input-node={inp.id}
                    transform={`translate(${inp.x}, ${inp.y})`}
                  >
                    <text
                      data-input-label={inp.id}
                      x={0}
                      y={0}
                      textAnchor="middle"
                      fill={inp.color === "cyan" ? "rgba(245,254,255,0.82)" : "rgba(245,254,255,0.94)"}
                      style={{
                        fontSize: `${fontSize}px`,
                        fontWeight: 650,
                        letterSpacing: "0",
                        filter: "drop-shadow(0 0 12px rgba(0,0,0,0.8))",
                      }}
                    >
                      {label}
                    </text>
                    <text
                      ref={(el) => {
                        inputFlashRefs.current[inp.id] = el;
                      }}
                      x={0}
                      y={0}
                      textAnchor="middle"
                      fill={ACCENT}
                      opacity="0"
                      style={{
                        fontSize: `${fontSize}px`,
                        fontWeight: 750,
                        letterSpacing: "0",
                        filter: "drop-shadow(0 0 16px rgba(0,240,255,0.7))",
                      }}
                    >
                      {label}
                    </text>
                  </g>
                );
              })}

              {!reduced &&
                <>
                  {INPUTS.map((inp) => (
                    <circle
                      key={`${inp.id}-pulse`}
                      ref={(el) => {
                        inputPulseRefs.current[inp.id] = el;
                      }}
                      r="6"
                      fill="url(#melveo-pulse)"
                      opacity="0"
                      filter="url(#melveo-glow)"
                    />
                  ))}
                  <circle
                    ref={outputPulseRef}
                    data-output-pulse
                    r="8"
                    fill="url(#melveo-pulse)"
                    opacity="0"
                    filter="url(#melveo-glow)"
                  />
                </>}
            </svg>

          </div>
        </div>
      </div>

      <style>{`
        .data-flow-stage {
          position: relative;
          width: 100%;
          isolation: isolate;
          overflow: hidden;
          /* border-top removed 2026-05-17: no horizontal dividers between sections */
          background: var(--color-bg-canvas);
          padding: clamp(3rem, 7vw, 5.5rem) clamp(1rem, 4vw, 3rem);
          color: #fff;
        }
        /*
          Background radial cyan halo removed 2026-05-17 per user
          direction: section must be pure black, only the data-flow
          visualisation itself remains. Was a blurred cyan ellipse
          behind the centre of the section.
        */
        .data-flow-inner {
          position: relative;
          z-index: 1;
          margin: 0 auto;
          max-width: 84rem;
        }
        .data-flow-header {
          text-align: center;
          margin-bottom: clamp(1.25rem, 2.5vw, 2rem);
        }
        .data-flow-eyebrow {
          margin: 0 0 0.75rem;
          font-size: 0.75rem;
          font-weight: 600;
          letter-spacing: 0.4em;
          text-transform: uppercase;
          color: var(--color-accent-primary);
        }
        .data-flow-headline {
          margin: 0;
          font-weight: 700;
          line-height: 1.04;
          letter-spacing: -0.03em;
          font-size: clamp(2rem, 4.8vw, 4rem);
          color: var(--color-text-primary);
          text-wrap: balance;
        }
        .data-flow-headline span {
          color: var(--color-accent-primary);
        }
        .data-flow-subline {
          margin: 1.25rem auto 0;
          max-width: 42rem;
          font-size: clamp(1rem, 1.4vw, 1.15rem);
          line-height: 1.6;
          color: var(--color-text-secondary);
        }

        .data-flow-visual {
          position: relative;
          width: 100%;
        }
        .data-flow-visual__mobile {
          display: none;
        }
        .data-flow-visual__desktop {
          position: relative;
          width: 100%;
          aspect-ratio: ${VBW} / ${VBH};
        }
        .data-flow-svg {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
        }

        .data-flow-hex-coach {
          margin: 0;
          font-size: clamp(1.8rem, 2.8vw, 2.6rem);
          font-weight: 800;
          letter-spacing: -0.01em;
          line-height: 1;
          color: var(--color-accent-primary-cta-fg, #001014);
        }

        @media (max-width: 900px) {
          .data-flow-visual__desktop {
            display: none;
          }
          .data-flow-visual__mobile {
            display: block;
          }
        }
      `}</style>
    </section>
  );
}

function MobileFlow({ reduced, lang }: { reduced: boolean; lang: Lang }) {
  const flowAria =
    lang === "cs"
      ? "Hráčské signály tečou do melveo. Melveo vytváří výstup pro trenéra."
      : "Player signals flow into melveo. Melveo outputs a coach decision.";
  return (
    <div className="data-flow-mobile">
      <svg
        className="data-flow-mobile__svg"
        viewBox={`0 0 ${MOBILE_VBW} ${MOBILE_VBH}`}
        preserveAspectRatio="xMidYMid meet"
        role="img"
        aria-label={flowAria}
      >
        <defs>
          <linearGradient id="m-line" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(0,240,255,0.04)" />
            <stop offset="55%" stopColor="rgba(0,240,255,0.5)" />
            <stop offset="100%" stopColor="rgba(0,240,255,0.18)" />
          </linearGradient>
          <linearGradient id="m-line-out" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(0,240,255,0.5)" />
            <stop offset="100%" stopColor="rgba(0,240,255,0.9)" />
          </linearGradient>
          <radialGradient id="m-pulse" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(255,255,255,1)" />
            <stop offset="35%" stopColor="rgba(0,240,255,0.85)" />
            <stop offset="100%" stopColor="rgba(0,240,255,0)" />
          </radialGradient>
          <radialGradient id="m-bloom" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(0,240,255,0.55)" />
            <stop offset="55%" stopColor="rgba(0,240,255,0.15)" />
            <stop offset="100%" stopColor="rgba(0,240,255,0)" />
          </radialGradient>
          <filter id="m-glow">
            <feGaussianBlur stdDeviation="3" />
          </filter>
          <filter id="m-bloom-blur">
            <feGaussianBlur stdDeviation="16" />
          </filter>
          <radialGradient id="m-top-fade" cx="50%" cy="30%" r="55%">
            <stop offset="0%" stopColor="rgba(255,255,255,1)" />
            <stop offset="70%" stopColor="rgba(255,255,255,0.35)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </radialGradient>
          <mask id="m-honey-mask">
            <rect width={MOBILE_VBW} height={MOBILE_VBH} fill="url(#m-top-fade)" />
          </mask>
          <radialGradient id="m-hex-cell-glow" cx="50%" cy="50%" r="55%">
            <stop offset="0%" stopColor="rgba(0,240,255,0.35)" />
            <stop offset="60%" stopColor="rgba(0,240,255,0.08)" />
            <stop offset="100%" stopColor="rgba(0,240,255,0)" />
          </radialGradient>
          <radialGradient id="m-signal-orb-cyan" cx="42%" cy="34%" r="62%">
            <stop offset="0%" stopColor="rgba(120,255,255,0.42)" />
            <stop offset="38%" stopColor="rgba(0,240,255,0.18)" />
            <stop offset="100%" stopColor="rgba(2,10,13,0.94)" />
          </radialGradient>
          <radialGradient id="m-signal-orb-white" cx="42%" cy="34%" r="62%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.58)" />
            <stop offset="42%" stopColor="rgba(205,247,251,0.16)" />
            <stop offset="100%" stopColor="rgba(2,10,13,0.94)" />
          </radialGradient>
          <radialGradient id="m-coach-orb" cx="42%" cy="36%" r="62%">
            <stop offset="0%" stopColor="rgba(190,255,255,0.42)" />
            <stop offset="36%" stopColor="rgba(0,240,255,0.28)" />
            <stop offset="100%" stopColor="rgba(0,22,26,0.96)" />
          </radialGradient>
        </defs>

        <g mask="url(#m-honey-mask)" opacity="0.2">
          {MOBILE_HONEYCOMB_CELLS.map((c, i) => (
            <polygon
              key={i}
              points={hexPolygon(c.cx, c.cy, c.r)}
              fill="none"
              stroke="rgba(0,240,255,0.05)"
              strokeWidth="0.7"
            />
          ))}
        </g>

        {MOBILE_ACCENT_DOTS.map((d, i) => (
          <g key={`m-dot-${i}`}>
            <polygon
              points={hexPolygon(d.x, d.y, d.r)}
              fill="none"
              stroke="rgba(0,240,255,0.18)"
              strokeWidth="0.8"
            />
            <circle cx={d.x} cy={d.y} r="1" fill="rgba(0,240,255,0.45)" />
          </g>
        ))}

        {MOBILE_INPUTS.map((inp) => (
          <path
            key={`m-p-${inp.id}`}
            data-input-path={inp.id}
            d={inputPathDMobile(inp)}
            stroke="url(#m-line)"
            strokeWidth="1.25"
            fill="none"
            opacity="0.42"
          />
        ))}

        <path
          data-output-path
          d={outputPathDMobile()}
          stroke="url(#m-line-out)"
          strokeWidth="1.6"
          fill="none"
          opacity="0.85"
        />

        <g data-output-group>
          <polygon
            data-output-halo
            points={hexPolygonFlat(
              MOBILE_HEX_OUT_CENTER.x,
              MOBILE_HEX_OUT_CENTER.y,
              MOBILE_HEX_OUT_R + 28,
            )}
            fill="url(#m-hex-cell-glow)"
            opacity="0.85"
          />
          <polygon
            points={hexPolygonFlat(
              MOBILE_HEX_OUT_CENTER.x,
              MOBILE_HEX_OUT_CENTER.y,
              MOBILE_HEX_OUT_R,
            )}
            fill={ACCENT}
            stroke="rgba(205, 247, 251, 0.9)"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          <polygon
            data-output-flash
            points={hexPolygonFlat(
              MOBILE_HEX_OUT_CENTER.x,
              MOBILE_HEX_OUT_CENTER.y,
              MOBILE_HEX_OUT_R - 2,
            )}
            fill="#FFFFFF"
            opacity="0"
          />
          <text
            x={MOBILE_HEX_OUT_CENTER.x}
            y={MOBILE_HEX_OUT_CENTER.y + 2}
            textAnchor="middle"
            fill="#001014"
            style={{
              fontSize: "30px",
              fontWeight: 850,
              letterSpacing: "-0.02em",
            }}
          >
            {lang === "cs" ? "Trenér" : "Coach"}
          </text>
          <text
            x={MOBILE_HEX_OUT_CENTER.x}
            y={MOBILE_HEX_OUT_CENTER.y + 29}
            textAnchor="middle"
            fill="rgba(0,16,20,0.64)"
            style={{
              fontSize: "11px",
              fontWeight: 800,
              letterSpacing: "-0.01em",
            }}
          >
            {lang === "cs" ? "ví, co řešit." : "knows what to do."}
          </text>
        </g>

        <ellipse
          data-core-bloom
          cx={MOBILE_CENTER.x}
          cy={MOBILE_CENTER.y}
          rx={160}
          ry={56}
          fill="url(#m-bloom)"
          opacity="0"
        />
        <text
          data-core-text
          x={MOBILE_CENTER.x}
          y={MOBILE_CENTER.y + 16}
          textAnchor="middle"
          fill={ACCENT}
          style={{
            // Match the brand wordmark — Comfortaa Variable. The
            // desktop core <text> already sets this; the mobile
            // path was missing it and inherited the system sans
            // (user noticed: "ten font, který je vlevo nahoře v
            // hero" — i.e. should match the .melveo-wordmark in
            // the hero header). Audit 2026-05-18.
            fontFamily: "var(--font-wordmark)",
            fontSize: "52px",
            fontWeight: 700,
            letterSpacing: "-0.02em",
            textTransform: "lowercase",
          }}
        >
          melveo
        </text>

        {MOBILE_INPUTS.map((inp) => {
          const label = getInputLabel(lang, inp.id, inp.label);
          const fontSize = inp.r < 30 ? 13 : inp.r < 40 ? 14 : 15;
          return (
            <g
              key={`m-text-${inp.id}`}
              transform={`translate(${inp.x}, ${inp.y})`}
            >
              {(() => {
                const words = label.split(" ");
                const isTwoLine = words.length === 2 && label.length > 7;
                if (isTwoLine) {
                  return (
                    <text
                      data-input-label={inp.id}
                      x={0}
                      y={0}
                      textAnchor="middle"
                      fill="rgba(245,254,255,0.94)"
                      style={{
                        fontSize: `${fontSize}px`,
                        fontWeight: 650,
                        letterSpacing: "0",
                        paintOrder: "stroke",
                        stroke: "rgba(0,0,0,0.45)",
                        strokeWidth: "0.7px",
                      }}
                    >
                      <tspan x="0" dy="-0.25em">
                        {words[0]}
                      </tspan>
                      <tspan x="0" dy="1.05em">
                        {words[1]}
                      </tspan>
                    </text>
                  );
                }
                return (
                  <text
                    data-input-label={inp.id}
                    x={0}
                    y={fontSize / 3}
                    textAnchor="middle"
                    fill="rgba(245,254,255,0.94)"
                    style={{
                      fontSize: `${fontSize}px`,
                      fontWeight: 650,
                      letterSpacing: "0",
                      paintOrder: "stroke",
                      stroke: "rgba(0,0,0,0.45)",
                      strokeWidth: "0.7px",
                    }}
                  >
                    {label}
                  </text>
                );
              })()}
              <text
                data-input-flash={inp.id}
                x={0}
                y={fontSize / 3}
                textAnchor="middle"
                fill={ACCENT}
                opacity="0"
                style={{
                  fontSize: `${fontSize}px`,
                  fontWeight: 760,
                  letterSpacing: "0",
                  paintOrder: "stroke",
                  stroke: "rgba(0,0,0,0.35)",
                  strokeWidth: "0.55px",
                }}
              >
                {label}
              </text>
            </g>
          );
        })}

        {!reduced &&
          <>
            {MOBILE_INPUTS.map((inp) => (
              <circle
                key={`m-pulse-${inp.id}`}
                data-input-pulse={inp.id}
                r="5"
                fill="url(#m-pulse)"
                opacity="0"
              />
            ))}
            <circle
              data-output-pulse
              r="6"
              fill="url(#m-pulse)"
              opacity="0"
              filter="url(#m-glow)"
            />
          </>}
      </svg>

      <style>{`
        .data-flow-mobile {
          position: relative;
          width: 100%;
          max-width: min(31rem, calc(100vw - 1rem));
          margin: 0 auto;
          aspect-ratio: ${MOBILE_VBW} / ${MOBILE_VBH};
          contain: layout paint style;
        }
        .data-flow-mobile__svg {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          transform: translateZ(0);
        }
      `}</style>
    </div>
  );
}
