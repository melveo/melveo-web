import { type CSSProperties, useEffect, useRef, useState } from "react";
import { useTranslations, type Lang } from "../i18n/ui";

type HexColor = "cyan" | "white";

const ACCENT = "#00F0FF";
const HEX_WHITE = "#F5FEFF";

const VBW = 1320;
const VBH = 780;
const CENTER = { x: 660, y: 390 };
const TEXT_RX = 108;
const TEXT_RY = 28;
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
    readiness: "Readiness",
    pain: "Bolest",
    fatigue: "Únava",
    hrv: "HRV",
    load: "Zátěž",
    match: "Kontext zápasu",
  },
  en: {
    sleep: "Sleep",
    mood: "Mood",
    stress: "Stress",
    readiness: "Readiness",
    pain: "Pain",
    fatigue: "Fatigue",
    hrv: "HRV",
    load: "Training load",
    match: "Match context",
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
  { id: "mood",      label: "Mood",          x: 70,  y: 369, r: 28, color: "white", bowDir: -1, bowAmt: 4  },
  { id: "hrv",       label: "HRV",           x: 73,  y: 317, r: 22, color: "white", bowDir: -1, bowAmt: 4  },
  { id: "match",     label: "Match context", x: 70,  y: 219, r: 36, color: "cyan",  bowDir: -1, bowAmt: 3  },
  { id: "sleep",     label: "Sleep",         x: 148, y: 251, r: 24, color: "cyan",  bowDir: -1, bowAmt: 3  },
  { id: "fatigue",   label: "Fatigue",       x: 200, y: 104, r: 30, color: "cyan",  bowDir:  0, bowAmt: 0  },
  { id: "pain",      label: "Pain",          x: 257, y: 232, r: 26, color: "cyan",  bowDir:  1, bowAmt: 3  },
  { id: "readiness", label: "Readiness",     x: 340, y: 202, r: 32, color: "white", bowDir:  1, bowAmt: 3  },
  { id: "stress",    label: "Stress",        x: 355, y: 288, r: 24, color: "cyan",  bowDir:  1, bowAmt: 4  },
  { id: "load",      label: "Training load", x: 339, y: 364, r: 30, color: "white", bowDir:  1, bowAmt: 4  },
];

const MOBILE_ACCENT_DOTS: Array<{ x: number; y: number; r: number }> = [
  { x: 130, y: 175, r: 7 },
  { x: 200, y: 240, r: 8 },
  { x: 270, y: 200, r: 7 },
  { x: 200, y: 380, r: 6 },
  { x: 200, y: 560, r: 6 },
];

function colorFor(c: HexColor) {
  return c === "cyan" ? ACCENT : HEX_WHITE;
}

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
  const sx = inp.x + inp.r;
  const sy = inp.y;
  const angle = Math.atan2(sy - CENTER.y, sx - CENTER.x);
  const ex = CENTER.x + TEXT_RX * Math.cos(angle);
  const ey = CENTER.y + TEXT_RY * Math.sin(angle);
  const dx = ex - sx;

  const cp1x = sx + dx * 0.45;
  const cp1y = sy + inp.bowDir * inp.bowAmt;
  const cp2x = sx + dx * 0.78;
  const cp2y = ey - inp.bowDir * inp.bowAmt * 0.5;

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
  const sx = inp.x;
  const sy = inp.y + SQRT3_HALF * inp.r;
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
  // Flat-top hex top edge sits at cy - sqrt(3)/2 * R, not at cy - R.
  const ey = MOBILE_HEX_OUT_CENTER.y - SQRT3_HALF * MOBILE_HEX_OUT_R;
  const dy = ey - sy;
  return `M ${sx} ${sy} C ${sx + 8} ${sy + dy * 0.4}, ${ex - 8} ${sy + dy * 0.7}, ${ex} ${ey}`;
}

function buildMobileHoneycomb() {
  const cells: Array<{ cx: number; cy: number; r: number }> = [];
  const r = 14;
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

// Charge / release tuning — shared by desktop and mobile
const CHARGE_THRESHOLD = 6;
const SCALE_PER_CHARGE = 0.05;
const BLOOM_OP_PER_CHARGE = 0.1;
const BLOOM_SCALE_PER_CHARGE = 0.08;
const BASE_BLOOM_OPACITY = 0.32;
const RELEASE_DURATION = 1.6;
const BASE_FILTER = "drop-shadow(0 0 22px rgba(0, 240, 255, 0.55))";
const FLASH_FILTER = "drop-shadow(0 0 52px rgba(225, 250, 255, 0.95))";

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
  const shimmerProxy = { x: -1.4 };

  const coreText = svg.querySelector<SVGTextElement>("[data-core-text]");
  const coreBloom = svg.querySelector<SVGEllipseElement>("[data-core-bloom]");
  const coreShimmer = svg.querySelector<SVGLinearGradientElement>(
    "[data-core-shimmer]",
  );
  const outputHexFlash = svg.querySelector<SVGPolygonElement>(
    "[data-output-flash]",
  );
  const outputHexHalo = svg.querySelector<SVGPolygonElement>(
    "[data-output-halo]",
  );
  const outputPath = svg.querySelector<SVGPathElement>("[data-output-path]");
  const outputPulse = svg.querySelector<SVGCircleElement>(
    "[data-output-pulse]",
  );

  const runShimmer = () => {
    if (!coreShimmer) return;
    shimmerProxy.x = -1.4;
    coreShimmer.setAttribute(
      "gradientTransform",
      `translate(${shimmerProxy.x}, 0)`,
    );
    gsap.killTweensOf(shimmerProxy);
    gsap.to(shimmerProxy, {
      x: 1.4,
      duration: 0.75,
      ease: "power2.inOut",
      onUpdate: () => {
        coreShimmer.setAttribute(
          "gradientTransform",
          `translate(${shimmerProxy.x}, 0)`,
        );
      },
    });
  };

  const flashMelveo = () => {
    if (!coreText) return;
    gsap.killTweensOf(coreText, "filter");
    gsap
      .timeline()
      .to(coreText, {
        filter: FLASH_FILTER,
        duration: 0.1,
        ease: "power2.out",
      })
      .to(coreText, {
        filter: BASE_FILTER,
        duration: 0.55,
        ease: "power2.inOut",
      });
  };

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
        transformOrigin: "50% 50%",
        ease: target >= energy ? "back.out(1.4)" : "power2.inOut",
      });
    }
    if (coreBloom) {
      gsap.killTweensOf(coreBloom, "scale,opacity");
      gsap.to(coreBloom, {
        opacity: targetBloomOp,
        scale: targetBloomScale,
        duration,
        transformOrigin: "50% 50%",
        ease: "power2.out",
      });
    }
  };

  const chargeMelveo = () => {
    runShimmer();
    flashMelveo();
    energy += 1;
    animateToEnergy(energy, 0.4);
    if (energy >= CHARGE_THRESHOLD && !pendingRelease) {
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
    if (!outputPath || !outputPulse) return;
    // Ball size scales with accumulated energy at release time.
    // At threshold (6): scale 1.0 (baseline). At 2× threshold: 1.5.
    const ballScale =
      1 + Math.min(energyAtRelease / CHARGE_THRESHOLD - 1, 1) * 0.5;

    const tl = gsap.timeline();
    tl.fromTo(
      outputPulse,
      {
        autoAlpha: 0,
        scale: ballScale * 0.9,
        transformOrigin: "50% 50%",
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
        scale: ballScale * 1.1,
        duration: RELEASE_DURATION,
        ease: "power2.out",
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
    tl.to(
      outputPulse,
      { autoAlpha: 0, scale: 1, duration: 0.32 },
      RELEASE_DURATION - 0.05,
    );

    // Drain melveo energy back to 0 over release duration.
    // If new particles arrive during this drain, chargeMelveo will
    // kill these tweens and grow melveo again — fully reactive.
    animateToEnergy(0, RELEASE_DURATION);

    const arrivalAt = RELEASE_DURATION - 0.15;
    if (outputHexFlash) {
      tl.fromTo(
        outputHexFlash,
        { opacity: 0 },
        {
          opacity: 0.95,
          duration: 0.08,
          ease: "power2.out",
          onComplete: () => {
            gsap.to(outputHexFlash, {
              opacity: 0,
              duration: 0.6,
              ease: "power2.inOut",
            });
          },
        },
        arrivalAt,
      );
    }
    if (outputHexHalo) {
      tl.fromTo(
        outputHexHalo,
        {
          opacity: 0.85,
          scale: 1,
          transformOrigin: `${MOBILE_HEX_OUT_CENTER.x}px ${MOBILE_HEX_OUT_CENTER.y}px`,
        },
        {
          opacity: 1,
          scale: 1.22,
          duration: 0.15,
          ease: "power2.out",
          onComplete: () => {
            gsap.to(outputHexHalo, {
              opacity: 0.85,
              scale: 1,
              duration: 0.8,
              ease: "power2.inOut",
              transformOrigin: `${MOBILE_HEX_OUT_CENTER.x}px ${MOBILE_HEX_OUT_CENTER.y}px`,
            });
          },
        },
        arrivalAt,
      );
    }
  };

  const schedulePulse = (inp: InputDef, delay: number) => {
    if (isCancelled()) return;
    gsap.delayedCall(delay, () => {
      if (isCancelled()) return;
      const path = svg.querySelector<SVGPathElement>(
        `[data-input-path="${inp.id}"]`,
      );
      const pulse = svg.querySelector<SVGCircleElement>(
        `[data-input-pulse="${inp.id}"]`,
      );
      const flash = svg.querySelector<SVGPolygonElement>(
        `[data-input-flash="${inp.id}"]`,
      );
      if (!path || !pulse) {
        schedulePulse(inp, 1.5);
        return;
      }
      const tl = gsap.timeline();
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
          duration: 1.3,
          ease: "power1.inOut",
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
        { opacity: 0.95, strokeWidth: 1.8, duration: 0.3 },
        0,
      );
      tl.to(path, { opacity: 0.18, strokeWidth: 1, duration: 0.7 }, 0.7);
      tl.to(pulse, { autoAlpha: 0, duration: 0.18 }, 1.25);
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
        undefined,
        1.28,
      );
      tl.call(() => {
        schedulePulse(inp, 2.2 + Math.random() * 3.5);
      });
    });
  };

  MOBILE_INPUTS.forEach((inp) => {
    schedulePulse(inp, 0.3 + Math.random() * 4);
  });
}

export default function MelveoDataFlowHero({ lang = "en" }: Props) {
  const t = useTranslations(lang);
  const coachLabel = lang === "cs" ? "Trenér" : "Coach";
  const flowAria =
    lang === "cs"
      ? "Hráčské signály tečou do melveo. Melveo vytváří výstup pro trenéra."
      : "Player signals flow into melveo. Melveo outputs a coach decision.";
  const rootRef = useRef<HTMLElement | null>(null);
  const inputPathRefs = useRef<Record<string, SVGPathElement | null>>({});
  const inputPulseRefs = useRef<Record<string, SVGCircleElement | null>>({});
  const inputHexRefs = useRef<Record<string, SVGPolygonElement | null>>({});
  const outputPathRef = useRef<SVGPathElement | null>(null);
  const outputPulseRef = useRef<SVGCircleElement | null>(null);
  const outputHexGroupRef = useRef<SVGGElement | null>(null);
  const outputHexFlashRef = useRef<SVGPolygonElement | null>(null);
  const outputHexHaloRef = useRef<SVGPolygonElement | null>(null);
  const inputFlashRefs = useRef<Record<string, SVGPolygonElement | null>>({});
  const coreTextRef = useRef<SVGTextElement | null>(null);
  const coreBloomRef = useRef<SVGEllipseElement | null>(null);
  const coreShimmerRef = useRef<SVGLinearGradientElement | null>(null);

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
    let gsapInstance: GsapInstance | null = null;
    let io: IntersectionObserver | null = null;
    let onVisibilityChange: (() => void) | null = null;
    const isMobile = window.matchMedia("(max-width: 900px)").matches;

    /*
      Pause GSAP globally while the section is out of the viewport
      OR while the tab is hidden. The 8 input-hex pulse loops use
      MotionPathPlugin which is expensive (curve sampling per tick)
      and they kept firing even when the section was scrolled past,
      taxing the browser's main thread for nothing (user 2026-05-15:
      "ty 2 sekce se docela lagují"). gsap.ticker.sleep / wake stops
      *all* tweens in this context without losing schedules.
    */
    let isVisible = false;
    let tabHidden = document.hidden;
    function syncPlayState() {
      const g = gsapInstance;
      if (!g) return;
      const shouldPlay = isVisible && !tabHidden;
      if (shouldPlay) {
        g.ticker.wake?.();
      } else {
        g.ticker.sleep?.();
      }
    }

    void (async () => {
      const [{ gsap }, { MotionPathPlugin }] = await Promise.all([
        import("gsap"),
        import("gsap/MotionPathPlugin"),
      ]);
      if (cancelled || !rootRef.current) return;
      gsap.registerPlugin(MotionPathPlugin);
      gsapInstance = gsap;

      // Pause when scrolled out of viewport. rootMargin gives a
      // small "warm-up" zone so the animation is already running
      // by the time the section reaches the edge of the screen.
      io = new IntersectionObserver(
        ([entry]) => {
          isVisible = !!entry?.isIntersecting;
          syncPlayState();
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
          setupMobileAnimation(gsap, () => cancelled, rootRef.current);
          return;
        }
        let energy = 0;
        let pendingRelease = false;

        const shimmerProxy = { x: -1.4 };
        const runShimmer = () => {
          const shimmer = coreShimmerRef.current;
          if (!shimmer) return;
          shimmerProxy.x = -1.4;
          shimmer.setAttribute(
            "gradientTransform",
            `translate(${shimmerProxy.x}, 0)`,
          );
          gsap.killTweensOf(shimmerProxy);
          gsap.to(shimmerProxy, {
            x: 1.4,
            duration: 0.75,
            ease: "power2.inOut",
            onUpdate: () => {
              shimmer.setAttribute(
                "gradientTransform",
                `translate(${shimmerProxy.x}, 0)`,
              );
            },
          });
        };

        const flashMelveo = () => {
          const text = coreTextRef.current;
          if (!text) return;
          gsap.killTweensOf(text, "filter");
          gsap
            .timeline()
            .to(text, {
              filter: FLASH_FILTER,
              duration: 0.1,
              ease: "power2.out",
            })
            .to(text, {
              filter: BASE_FILTER,
              duration: 0.55,
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
            transformOrigin: "50% 50%",
            ease: target >= energy ? "back.out(1.4)" : "power2.inOut",
          });
          if (bloom) {
            gsap.killTweensOf(bloom, "scale,opacity");
            gsap.to(bloom, {
              opacity: targetBloomOp,
              scale: targetBloomScale,
              duration,
              transformOrigin: "50% 50%",
              ease: "power2.out",
            });
          }
        };

        const chargeMelveo = () => {
          runShimmer();
          flashMelveo();
          energy += 1;
          animateToEnergy(energy, 0.4);
          if (energy >= CHARGE_THRESHOLD && !pendingRelease) {
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
          const path = outputPathRef.current;
          const pulse = outputPulseRef.current;
          if (!path || !pulse) return;
          const ballScale =
            1 + Math.min(energyAtRelease / CHARGE_THRESHOLD - 1, 1) * 0.5;

          const tl = gsap.timeline();
          tl.fromTo(
            pulse,
            {
              autoAlpha: 0,
              scale: ballScale * 0.9,
              transformOrigin: "50% 50%",
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
              scale: ballScale * 1.1,
              duration: RELEASE_DURATION,
              ease: "power2.out",
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
          tl.to(
            pulse,
            { autoAlpha: 0, scale: 1, duration: 0.32 },
            RELEASE_DURATION - 0.05,
          );

          animateToEnergy(0, RELEASE_DURATION);

          const arrivalAt = RELEASE_DURATION - 0.15;
          const coachFlash = outputHexFlashRef.current;
          if (coachFlash) {
            tl.fromTo(
              coachFlash,
              { opacity: 0 },
              {
                opacity: 0.95,
                duration: 0.08,
                ease: "power2.out",
                onComplete: () => {
                  gsap.to(coachFlash, {
                    opacity: 0,
                    duration: 0.6,
                    ease: "power2.inOut",
                  });
                },
              },
              arrivalAt,
            );
          }
          const coachHalo = outputHexHaloRef.current;
          if (coachHalo) {
            tl.fromTo(
              coachHalo,
              {
                opacity: 0.85,
                scale: 1,
                transformOrigin: `${HEX_OUT_CENTER.x}px ${HEX_OUT_CENTER.y}px`,
              },
              {
                opacity: 1,
                scale: 1.22,
                duration: 0.15,
                ease: "power2.out",
                onComplete: () => {
                  gsap.to(coachHalo, {
                    opacity: 0.85,
                    scale: 1,
                    duration: 0.8,
                    ease: "power2.inOut",
                    transformOrigin: `${HEX_OUT_CENTER.x}px ${HEX_OUT_CENTER.y}px`,
                  });
                },
              },
              arrivalAt,
            );
          }
        };

        const schedulePulse = (inp: InputDef, delay: number) => {
          if (cancelled) return;
          gsap.delayedCall(delay, () => {
            if (cancelled) return;
            const path = inputPathRefs.current[inp.id];
            const pulse = inputPulseRefs.current[inp.id];
            if (!path || !pulse) {
              schedulePulse(inp, 1.5);
              return;
            }

            const tl = gsap.timeline();
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
                duration: 1.3,
                ease: "power1.inOut",
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
              { opacity: 0.95, strokeWidth: 1.8, duration: 0.3 },
              0,
            );
            tl.to(
              path,
              { opacity: 0.18, strokeWidth: 1, duration: 0.7 },
              0.7,
            );
            tl.to(pulse, { autoAlpha: 0, duration: 0.18 }, 1.25);
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
              undefined,
              1.28,
            );
            tl.call(() => {
              schedulePulse(inp, 2.2 + Math.random() * 3.5);
            });
          });
        };

        INPUTS.forEach((inp) => {
          schedulePulse(inp, 0.3 + Math.random() * 4);
        });
      }, rootRef);
    })();

    return () => {
      cancelled = true;
      ctx?.revert();
      io?.disconnect();
      if (onVisibilityChange) {
        document.removeEventListener("visibilitychange", onVisibilityChange);
      }
      // Make sure ticker wakes if another GSAP user mounts later
      gsapInstance?.ticker?.wake?.();
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
                <linearGradient
                  id="melveo-shimmer"
                  ref={coreShimmerRef}
                  x1="0"
                  y1="0"
                  x2="1"
                  y2="0"
                  gradientTransform="translate(-1.4, 0)"
                >
                  <stop offset="0" stopColor={ACCENT} />
                  <stop offset="0.42" stopColor={ACCENT} />
                  <stop offset="0.5" stopColor="#FFFFFF" />
                  <stop offset="0.58" stopColor={ACCENT} />
                  <stop offset="1" stopColor={ACCENT} />
                </linearGradient>
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
                  strokeWidth="1"
                  fill="none"
                  opacity="0.18"
                />
              ))}

              <path
                ref={outputPathRef}
                d={outputPathD()}
                stroke="url(#melveo-line-out)"
                strokeWidth="1.8"
                fill="none"
                opacity="0.85"
              />

              <g ref={outputHexGroupRef}>
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
                  y={HEX_OUT_CENTER.y + 14}
                  textAnchor="middle"
                  fill="#001014"
                  style={{
                    fontSize: "44px",
                    fontWeight: 800,
                    letterSpacing: "-0.01em",
                  }}
                >
                  {coachLabel}
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
                opacity="0.32"
              />
              <text
                ref={coreTextRef}
                x={CENTER.x}
                y={CENTER.y + 22}
                textAnchor="middle"
                fill="url(#melveo-shimmer)"
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
                const color = colorFor(inp.color);
                const label = getInputLabel(lang, inp.id, inp.label);
                const fontSize = inp.r < 35 ? 11 : inp.r < 50 ? 12.5 : 14;
                return (
                  <g key={inp.id} transform={`translate(${inp.x}, ${inp.y})`}>
                    <polygon
                      points={hexPolygonFlat(0, 0, inp.r + 8)}
                      fill={color}
                      opacity="0.14"
                    />
                    <polygon
                      ref={(el) => {
                        inputHexRefs.current[inp.id] = el;
                      }}
                      points={hexPolygonFlat(0, 0, inp.r)}
                      fill={color}
                      stroke={
                        inp.color === "cyan"
                          ? "rgba(205, 247, 251, 0.65)"
                          : "rgba(255, 255, 255, 0.85)"
                      }
                      strokeWidth="1"
                      strokeLinejoin="round"
                      style={{ filter: `drop-shadow(0 0 10px ${color}55)` }}
                    />
                    <polygon
                      ref={(el) => {
                        inputFlashRefs.current[inp.id] = el;
                      }}
                      points={hexPolygonFlat(0, 0, inp.r - 1.5)}
                      fill="#FFFFFF"
                      opacity="0"
                    />
                    <text
                      x={0}
                      y={fontSize / 3}
                      textAnchor="middle"
                      fill="#001014"
                      style={{
                        fontSize: `${fontSize}px`,
                        fontWeight: 700,
                        letterSpacing: "-0.005em",
                      }}
                    >
                      {label}
                    </text>
                  </g>
                );
              })}

              {!reduced &&
                INPUTS.map((inp) => (
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
              {!reduced && (
                <circle
                  ref={outputPulseRef}
                  r="18"
                  fill="url(#melveo-pulse)"
                  opacity="0"
                  filter="url(#melveo-glow)"
                />
              )}
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
  const coachLabel = lang === "cs" ? "Trenér" : "Coach";
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
          <linearGradient
            id="m-shimmer"
            data-core-shimmer
            x1="0"
            y1="0"
            x2="1"
            y2="0"
            gradientTransform="translate(-1.4, 0)"
          >
            <stop offset="0" stopColor={ACCENT} />
            <stop offset="0.42" stopColor={ACCENT} />
            <stop offset="0.5" stopColor="#FFFFFF" />
            <stop offset="0.58" stopColor={ACCENT} />
            <stop offset="1" stopColor={ACCENT} />
          </linearGradient>
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
            strokeWidth="1"
            fill="none"
            opacity="0.18"
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

        <g>
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
            y={MOBILE_HEX_OUT_CENTER.y + 11}
            textAnchor="middle"
            fill="#001014"
            style={{
              fontSize: "32px",
              fontWeight: 800,
              letterSpacing: "-0.01em",
            }}
          >
            {coachLabel}
          </text>
        </g>

        <ellipse
          data-core-bloom
          cx={MOBILE_CENTER.x}
          cy={MOBILE_CENTER.y}
          rx={160}
          ry={56}
          fill="url(#m-bloom)"
          filter="url(#m-bloom-blur)"
          opacity="0.32"
        />
        <text
          data-core-text
          x={MOBILE_CENTER.x}
          y={MOBILE_CENTER.y + 16}
          textAnchor="middle"
          fill="url(#m-shimmer)"
          style={{
            fontSize: "52px",
            fontWeight: 900,
            letterSpacing: "-0.02em",
            filter: "drop-shadow(0 0 22px rgba(0,240,255,0.55))",
          }}
        >
          melveo
        </text>

        {MOBILE_INPUTS.map((inp) => {
          const color = colorFor(inp.color);
          const label = getInputLabel(lang, inp.id, inp.label);
          const fontSize = inp.r < 30 ? 10 : inp.r < 40 ? 11 : 12.5;
          return (
            <g
              key={`m-hex-${inp.id}`}
              transform={`translate(${inp.x}, ${inp.y})`}
            >
              <polygon
                points={hexPolygonFlat(0, 0, inp.r + 6)}
                fill={color}
                opacity="0.14"
              />
              <polygon
                points={hexPolygonFlat(0, 0, inp.r)}
                fill={color}
                stroke={
                  inp.color === "cyan"
                    ? "rgba(205, 247, 251, 0.65)"
                    : "rgba(255, 255, 255, 0.85)"
                }
                strokeWidth="1"
                strokeLinejoin="round"
                style={{ filter: `drop-shadow(0 0 8px ${color}55)` }}
              />
              <polygon
                data-input-flash={inp.id}
                points={hexPolygonFlat(0, 0, inp.r - 1.5)}
                fill="#FFFFFF"
                opacity="0"
              />
              {(() => {
                const words = label.split(" ");
                const isTwoLine = words.length === 2 && label.length > 7;
                if (isTwoLine) {
                  return (
                    <text
                      x={0}
                      y={0}
                      textAnchor="middle"
                      fill="#001014"
                      style={{
                        fontSize: `${fontSize}px`,
                        fontWeight: 700,
                        letterSpacing: "-0.005em",
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
                    x={0}
                    y={fontSize / 3}
                    textAnchor="middle"
                    fill="#001014"
                    style={{
                      fontSize: `${fontSize}px`,
                      fontWeight: 700,
                      letterSpacing: "-0.005em",
                    }}
                  >
                    {label}
                  </text>
                );
              })()}
            </g>
          );
        })}

        {!reduced &&
          MOBILE_INPUTS.map((inp) => (
            <circle
              key={`m-pulse-${inp.id}`}
              data-input-pulse={inp.id}
              r="5"
              fill="url(#m-pulse)"
              opacity="0"
              filter="url(#m-glow)"
            />
          ))}
        {!reduced && (
          <circle
            data-output-pulse
            r="14"
            fill="url(#m-pulse)"
            opacity="0"
            filter="url(#m-glow)"
          />
        )}
      </svg>

      <style>{`
        .data-flow-mobile {
          position: relative;
          width: 100%;
          max-width: 28rem;
          margin: 0 auto;
          aspect-ratio: ${MOBILE_VBW} / ${MOBILE_VBH};
        }
        .data-flow-mobile__svg {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
        }
      `}</style>
    </div>
  );
}
