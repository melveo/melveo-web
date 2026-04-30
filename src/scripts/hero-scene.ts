/**
 * Hero scene — CodePen-inspired WebGL metaballs background.
 *
 * Source reference: TC5550 / "Metaballs - WebGL".
 * The implementation keeps the same idea: moving circles are sent to a
 * fragment shader as vec3 uniforms and the shader renders the combined
 * metaball field. It is adapted for Melveo's darker brand palette and
 * for the site's lazy-mounted hero canvas.
 */

interface MountOptions {
  canvas: HTMLCanvasElement;
}

interface SceneHandle {
  dispose: () => void;
}

interface Metaball {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  seed: number;
}

const METABALL_COUNT = 28;
const MOBILE_METABALL_COUNT = 20;

const VERTEX_SHADER = `
attribute vec2 position;

void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

function fragmentShaderSource(count: number): string {
  return `
precision highp float;

uniform vec2 uResolution;
uniform float uTime;
uniform vec3 uMetaballs[${count}];

const vec3 BRAND_CYAN = vec3(0.0, 0.941176, 1.0);
const vec3 BRAND_ICE = vec3(0.45, 0.86, 0.90);
const vec3 BRAND_TEAL = vec3(0.05, 0.56, 0.62);
const vec3 BRAND_DEEP = vec3(0.0, 0.13, 0.16);

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

void main() {
  vec2 p = gl_FragCoord.xy;
  vec2 uv = p / uResolution;
  vec2 centered = uv - 0.5;
  centered.x *= uResolution.x / max(uResolution.y, 1.0);

  float field = 0.0;
  float weightedDepth = 0.0;

  for (int i = 0; i < ${count}; i++) {
    vec3 metaball = uMetaballs[i];
    vec2 delta = metaball.xy - p;
    float distSq = max(dot(delta, delta), 32.0);
    float strength = (metaball.z * metaball.z) / distSq;
    field += strength;
    weightedDepth += strength * metaball.z;
  }

  float mass = smoothstep(0.92, 1.08, field);
  float body = smoothstep(0.98, 1.22, field);
  float edge = smoothstep(0.88, 1.0, field) * (1.0 - smoothstep(1.12, 1.36, field));
  float glow = smoothstep(0.2, 1.12, field) * (1.0 - body);

  float depth = clamp(weightedDepth / max(field, 0.001) / max(uResolution.y, 1.0), 0.0, 0.32);
  float grain = hash(floor(p * 0.55) + vec2(uTime * 18.0, -uTime * 9.0));

  vec3 background = mix(BRAND_DEEP * 0.2, BRAND_DEEP * 0.62, 1.0 - uv.y);
  background += BRAND_TEAL * 0.045 * smoothstep(0.82, 0.0, length(centered + vec2(0.18, -0.08)));
  background += BRAND_CYAN * 0.025 * smoothstep(1.05, 0.0, length(centered - vec2(0.34, 0.18)));

  vec3 cool = mix(BRAND_TEAL, BRAND_CYAN, clamp(uv.x * 0.72 + uv.y * 0.28, 0.0, 1.0));
  vec3 surface = mix(BRAND_DEEP * 0.52 + BRAND_TEAL * 0.2, cool, 0.48 + depth);
  surface += BRAND_ICE * edge * 0.36;
  surface += BRAND_CYAN * pow(max(field - 1.0, 0.0), 0.7) * 0.1;

  vec3 color = background;
  color += BRAND_CYAN * glow * 0.08;
  color = mix(color, surface, mass * 0.92);
  color += edge * BRAND_CYAN * 0.16;

  float centerQuiet = smoothstep(0.08, 0.74, length(centered * vec2(0.86, 1.42)));
  color = mix(background * 0.72 + color * 0.08, color, centerQuiet);

  float vignette = smoothstep(0.88, 0.24, length(centered));
  color *= 0.55 + vignette * 0.55;
  color += (grain - 0.5) * 0.012;
  color = pow(max(color, vec3(0.0)), vec3(0.92));

  gl_FragColor = vec4(color, 1.0);
}
`;
}

export function prefersReducedMotion(): boolean {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

function createSeededRandom(seed = 88421): () => number {
  let state = seed >>> 0;

  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

function randomRange(random: () => number, min: number, max: number): number {
  return min + random() * (max - min);
}

function createShader(
  gl: WebGLRenderingContext,
  type: number,
  source: string,
): WebGLShader | null {
  const shader = gl.createShader(type);
  if (!shader) return null;

  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error('Hero shader compile error:', gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }

  return shader;
}

function createProgram(
  gl: WebGLRenderingContext,
  vertexShader: WebGLShader,
  fragmentShader: WebGLShader,
): WebGLProgram | null {
  const program = gl.createProgram();
  if (!program) return null;

  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error('Hero shader link error:', gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
    return null;
  }

  return program;
}

export function mountHeroScene({ canvas }: MountOptions): SceneHandle | null {
  const contextOptions: WebGLContextAttributes = {
    alpha: false,
    antialias: false,
    depth: false,
    stencil: false,
    preserveDrawingBuffer: false,
    powerPreference: 'high-performance',
  };

  const context = (canvas.getContext('webgl', contextOptions) ??
    canvas.getContext('experimental-webgl', contextOptions)) as WebGLRenderingContext | null;

  if (!context) return null;
  const gl: WebGLRenderingContext = context;
  const isMobile = window.innerWidth < 768;
  const metaballCount = isMobile ? MOBILE_METABALL_COUNT : METABALL_COUNT;

  const vertexShader = createShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER);
  const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource(metaballCount));

  if (!vertexShader || !fragmentShader) {
    if (vertexShader) gl.deleteShader(vertexShader);
    if (fragmentShader) gl.deleteShader(fragmentShader);
    return null;
  }

  const program = createProgram(gl, vertexShader, fragmentShader);
  if (!program) {
    gl.deleteShader(vertexShader);
    gl.deleteShader(fragmentShader);
    return null;
  }

  const positionLocation = gl.getAttribLocation(program, 'position');
  const uResolution = gl.getUniformLocation(program, 'uResolution');
  const uTime = gl.getUniformLocation(program, 'uTime');
  const uMetaballs = gl.getUniformLocation(program, 'uMetaballs');

  if (positionLocation < 0 || !uResolution || !uTime || !uMetaballs) {
    gl.deleteProgram(program);
    gl.deleteShader(vertexShader);
    gl.deleteShader(fragmentShader);
    return null;
  }

  const positions = new Float32Array([
    -1, -1,
    1, -1,
    -1, 1,
    1, 1,
  ]);

  const positionBuffer = gl.createBuffer();
  if (!positionBuffer) {
    gl.deleteProgram(program);
    gl.deleteShader(vertexShader);
    gl.deleteShader(fragmentShader);
    return null;
  }

  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

  const random = createSeededRandom();
  const metaballs: Metaball[] = [];
  const metaballData = new Float32Array(metaballCount * 3);
  const pixelRatio = Math.min(window.devicePixelRatio || 1, isMobile ? 0.9 : 1.15);

  let width = 1;
  let height = 1;
  let running = true;
  let canvasInView = true;
  let rafId = 0;
  let mouseX = 0.5;
  let mouseY = 0.5;
  let targetMouseX = 0.5;
  let targetMouseY = 0.5;

  function resetMetaballs() {
    metaballs.length = 0;
    const minSide = Math.min(width, height);
    const baseRadius = minSide * (isMobile ? 0.08 : 0.052);

    for (let i = 0; i < metaballCount; i += 1) {
      const radius = randomRange(random, baseRadius * 0.55, baseRadius * 1.45);
      metaballs.push({
        x: randomRange(random, radius, width - radius),
        y: randomRange(random, radius, height - radius),
        vx: randomRange(random, -0.22, 0.22) * (isMobile ? 0.8 : 1),
        vy: randomRange(random, -0.18, 0.18) * (isMobile ? 0.8 : 1),
        radius,
        seed: randomRange(random, 0, Math.PI * 2),
      });
    }
  }

  function resizeCanvas() {
    const rect = canvas.getBoundingClientRect();
    const nextWidth = Math.max(1, Math.floor(rect.width * pixelRatio));
    const nextHeight = Math.max(1, Math.floor(rect.height * pixelRatio));
    const changed = canvas.width !== nextWidth || canvas.height !== nextHeight;

    if (changed) {
      canvas.width = nextWidth;
      canvas.height = nextHeight;
      width = nextWidth;
      height = nextHeight;
      resetMetaballs();
    }

    gl.viewport(0, 0, nextWidth, nextHeight);
  }

  function onPointerMove(event: PointerEvent) {
    const rect = canvas.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) return;

    targetMouseX = (event.clientX - rect.left) / rect.width;
    targetMouseY = (event.clientY - rect.top) / rect.height;
  }

  function stopFrame() {
    if (!rafId) return;
    cancelAnimationFrame(rafId);
    rafId = 0;
  }

  function scheduleFrame() {
    if (rafId || !running || !canvasInView) return;
    rafId = requestAnimationFrame(render);
  }

  function updateMetaballs(time: number) {
    mouseX += (targetMouseX - mouseX) * 0.035;
    mouseY += (targetMouseY - mouseY) * 0.035;

    const driftX = (mouseX - 0.5) * width * 0.0012;
    const driftY = (mouseY - 0.5) * height * 0.0012;

    for (let i = 0; i < metaballCount; i += 1) {
      const metaball = metaballs[i];
      if (!metaball) continue;

      metaball.x += metaball.vx + Math.sin(time * 0.24 + metaball.seed) * 0.055 + driftX;
      metaball.y += metaball.vy + Math.cos(time * 0.2 + metaball.seed) * 0.05 - driftY;

      if (metaball.x < metaball.radius) {
        metaball.x = metaball.radius;
        metaball.vx = Math.abs(metaball.vx);
      } else if (metaball.x > width - metaball.radius) {
        metaball.x = width - metaball.radius;
        metaball.vx = -Math.abs(metaball.vx);
      }

      if (metaball.y < metaball.radius) {
        metaball.y = metaball.radius;
        metaball.vy = Math.abs(metaball.vy);
      } else if (metaball.y > height - metaball.radius) {
        metaball.y = height - metaball.radius;
        metaball.vy = -Math.abs(metaball.vy);
      }

      const dataIndex = i * 3;
      metaballData[dataIndex] = metaball.x;
      metaballData[dataIndex + 1] = metaball.y;
      metaballData[dataIndex + 2] = metaball.radius;
    }
  }

  const startTime = performance.now();

  function render(now: number) {
    rafId = 0;
    if (!running || !canvasInView) return;

    const time = (now - startTime) * 0.001;
    updateMetaballs(time);

    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.useProgram(program);
    gl.uniform2f(uResolution, width, height);
    gl.uniform1f(uTime, time);
    gl.uniform3fv(uMetaballs, metaballData);

    gl.enableVertexAttribArray(positionLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

    scheduleFrame();
  }

  resizeCanvas();
  window.addEventListener('pointermove', onPointerMove, { passive: true });
  window.addEventListener('resize', resizeCanvas, { passive: true });

  const resizeObserver = new ResizeObserver(resizeCanvas);
  resizeObserver.observe(canvas);

  const viewportObserver =
    'IntersectionObserver' in window
      ? new IntersectionObserver((entries) => {
          const entry = entries[0];
          canvasInView = Boolean(entry?.isIntersecting);

          if (canvasInView) {
            scheduleFrame();
          } else {
            stopFrame();
          }
        })
      : null;

  viewportObserver?.observe(canvas);

  function onVisibilityChange() {
    if (document.hidden) {
      running = false;
      stopFrame();
    } else if (!running) {
      running = true;
      scheduleFrame();
    }
  }

  document.addEventListener('visibilitychange', onVisibilityChange);
  scheduleFrame();

  function dispose() {
    running = false;
    stopFrame();
    window.removeEventListener('pointermove', onPointerMove);
    window.removeEventListener('resize', resizeCanvas);
    document.removeEventListener('visibilitychange', onVisibilityChange);
    resizeObserver.disconnect();
    viewportObserver?.disconnect();
    gl.deleteBuffer(positionBuffer);
    gl.deleteProgram(program);
    gl.deleteShader(vertexShader);
    gl.deleteShader(fragmentShader);
  }

  return { dispose };
}
