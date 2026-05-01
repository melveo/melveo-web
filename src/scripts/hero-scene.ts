/**
 * Hero scene — TC5550 CodePen metaballs port.
 *
 * This keeps the supplied CodePen metaball mechanics:
 * - internal canvas resolution is viewport * 0.75
 * - 30 metaballs
 * - radius/velocity formulas match the pen
 * - fragment shader threshold logic matches the pen
 * - mouse coordinates are not used for motion
 *
 * The color ramp is remapped to Melveo's cyan/teal palette and the
 * animation speed toggles on hero-background click.
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
  r: number;
}

const NUM_METABALLS = 30;

const VERTEX_SHADER = `
attribute vec2 position;

void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

function fragmentShaderSource(width: number, height: number): string {
  return `
precision highp float;

const float WIDTH = ${width >> 0}.0;
const float HEIGHT = ${height >> 0}.0;

uniform vec3 metaballs[${NUM_METABALLS}];

const vec3 BRAND_CYAN = vec3(0.0, 0.941176, 1.0);
const vec3 BRAND_ICE = vec3(0.45, 0.86, 0.90);
const vec3 BRAND_TEAL = vec3(0.05, 0.56, 0.62);
const vec3 BRAND_DEEP = vec3(0.0, 0.08, 0.1);

void main() {
  float x = gl_FragCoord.x;
  float y = gl_FragCoord.y;

  float sum = 0.0;
  for (int i = 0; i < ${NUM_METABALLS}; i++) {
    vec3 metaball = metaballs[i];
    float dx = metaball.x - x;
    float dy = metaball.y - y;
    float radius = metaball.z;

    sum += (radius * radius) / (dx * dx + dy * dy);
  }

  if (sum >= 0.99) {
    vec3 brandRamp = mix(BRAND_TEAL, BRAND_CYAN, x / WIDTH);
    brandRamp = mix(brandRamp, BRAND_ICE, (y / HEIGHT) * 0.28);
    gl_FragColor = vec4(
      mix(
        brandRamp,
        vec3(0.0, 0.0, 0.0),
        max(0.0, 1.0 - (sum - 0.99) * 100.0)
      ),
      1.0
    );
    return;
  }

  vec2 uv = vec2(x / WIDTH, y / HEIGHT);
  vec2 centered = uv - 0.5;
  centered.x *= WIDTH / HEIGHT;
  float ambient = smoothstep(0.18, 0.99, sum);
  float radial = smoothstep(0.82, 0.0, length(centered + vec2(0.22, -0.08)));
  vec3 glow = BRAND_DEEP * 0.35 + BRAND_TEAL * radial * 0.07 + BRAND_CYAN * ambient * 0.035;
  gl_FragColor = vec4(glow, 1.0);
}
`;
}

export function prefersReducedMotion(): boolean {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
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

  let width = Math.max(1, window.innerWidth * 0.75);
  let height = Math.max(1, window.innerHeight * 0.75);
  canvas.width = width;
  canvas.height = height;
  gl.viewport(0, 0, canvas.width, canvas.height);

  // Viewport-aware radius scale — desktop shows 30 balls in their full
  // 10-70 px radius range, but on phones that fills the canvas with
  // overlapping blobs (user feedback 2026-05-01: "ta hero sekce je
  // těmi partikly nasycená... asi bychom to měli dávkovat dle velikosti
  // zařízení nebo velikost těch koulí"). Below 768 CSS px we scale the
  // radius down linearly to ~50 % at 360 CSS px so the hero feels
  // breezy on phones rather than packed.
  function radiusScale(): number {
    const w = window.innerWidth;
    if (w >= 768) return 1;
    if (w <= 360) return 0.5;
    return 0.5 + (w - 360) * (0.5 / (768 - 360));
  }

  const metaballs: Metaball[] = [];

  const initialScale = radiusScale();
  for (let i = 0; i < NUM_METABALLS; i += 1) {
    const radius = (Math.random() * 60 + 10) * initialScale;
    metaballs.push({
      x: Math.random() * (width - 2 * radius) + radius,
      y: Math.random() * (height - 2 * radius) + radius,
      // Velocity also lowered slightly on mobile so the smaller balls
      // don't dart around faster relative to their size.
      vx: (Math.random() - 0.5) * 3 * Math.max(0.7, initialScale),
      vy: (Math.random() - 0.5) * 3 * Math.max(0.7, initialScale),
      r: radius * 0.76,
    });
  }

  const vertexShader = createShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER);
  let fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource(width, height));

  if (!vertexShader || !fragmentShader) {
    if (vertexShader) gl.deleteShader(vertexShader);
    if (fragmentShader) gl.deleteShader(fragmentShader);
    return null;
  }

  let program = createProgram(gl, vertexShader, fragmentShader);
  if (!program) {
    gl.deleteShader(vertexShader);
    gl.deleteShader(fragmentShader);
    return null;
  }

  gl.useProgram(program);

  const vertexData = new Float32Array([
    -1.0, 1.0,
    -1.0, -1.0,
    1.0, 1.0,
    1.0, -1.0,
  ]);
  const vertexDataBuffer = gl.createBuffer();
  if (!vertexDataBuffer) {
    gl.deleteProgram(program);
    gl.deleteShader(vertexShader);
    gl.deleteShader(fragmentShader);
    return null;
  }

  gl.bindBuffer(gl.ARRAY_BUFFER, vertexDataBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, vertexData, gl.STATIC_DRAW);

  let positionHandle = gl.getAttribLocation(program, 'position');
  if (positionHandle < 0) {
    gl.deleteBuffer(vertexDataBuffer);
    gl.deleteProgram(program);
    gl.deleteShader(vertexShader);
    gl.deleteShader(fragmentShader);
    return null;
  }

  gl.enableVertexAttribArray(positionHandle);
  gl.vertexAttribPointer(
    positionHandle,
    2,
    gl.FLOAT,
    false,
    2 * 4,
    0,
  );

  let metaballsHandle = gl.getUniformLocation(program, 'metaballs');
  if (!metaballsHandle) {
    gl.deleteBuffer(vertexDataBuffer);
    gl.deleteProgram(program);
    gl.deleteShader(vertexShader);
    gl.deleteShader(fragmentShader);
    return null;
  }

  let running = true;
  let rafId = 0;
  let canvasInView = true;
  let targetSpeed = 1;
  let speed = 1;
  const dataToSendToGPU = new Float32Array(3 * NUM_METABALLS);

  function rebuildProgramForSize() {
    const nextWidth = Math.max(1, window.innerWidth * 0.75);
    const nextHeight = Math.max(1, window.innerHeight * 0.75);

    if (Math.abs(nextWidth - width) < 1 && Math.abs(nextHeight - height) < 1) return;

    width = nextWidth;
    height = nextHeight;
    canvas.width = width;
    canvas.height = height;
    gl.viewport(0, 0, canvas.width, canvas.height);

    const nextFragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource(width, height));
    if (!nextFragmentShader) return;

    const nextProgram = createProgram(gl, vertexShader, nextFragmentShader);
    if (!nextProgram) {
      gl.deleteShader(nextFragmentShader);
      return;
    }

    const nextPositionHandle = gl.getAttribLocation(nextProgram, 'position');
    const nextMetaballsHandle = gl.getUniformLocation(nextProgram, 'metaballs');
    if (nextPositionHandle < 0 || !nextMetaballsHandle) {
      gl.deleteProgram(nextProgram);
      gl.deleteShader(nextFragmentShader);
      return;
    }

    gl.deleteProgram(program);
    gl.deleteShader(fragmentShader);
    fragmentShader = nextFragmentShader;
    program = nextProgram;
    positionHandle = nextPositionHandle;
    metaballsHandle = nextMetaballsHandle;
    gl.useProgram(program);

    gl.enableVertexAttribArray(nextPositionHandle);
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexDataBuffer);
    gl.vertexAttribPointer(nextPositionHandle, 2, gl.FLOAT, false, 2 * 4, 0);

    // Re-apply the viewport radius scale so portrait↔landscape /
    // browser-resize transitions don't keep oversized balls on a
    // shrunk viewport.
    const scale = radiusScale();
    for (const metaball of metaballs) {
      const targetR = (Math.random() * 60 + 10) * scale * 0.76;
      metaball.r = targetR;
    }
    for (const metaball of metaballs) {
      metaball.x = Math.min(Math.max(metaball.x, metaball.r), width - metaball.r);
      metaball.y = Math.min(Math.max(metaball.y, metaball.r), height - metaball.r);
    }
  }

  function onPointerDown(event: PointerEvent) {
    const target = event.target;
    if (target instanceof Element && target.closest('a, button, input, textarea, select, label')) {
      return;
    }

    const rect = canvas.getBoundingClientRect();
    const insideHero =
      event.clientX >= rect.left &&
      event.clientX <= rect.right &&
      event.clientY >= rect.top &&
      event.clientY <= rect.bottom;

    if (!insideHero) return;
    targetSpeed = targetSpeed > 1 ? 1 : 2.8;
  }

  function stopFrame() {
    if (!rafId) return;
    cancelAnimationFrame(rafId);
    rafId = 0;
  }

  function scheduleFrame() {
    if (rafId || !running || !canvasInView) return;
    rafId = requestAnimationFrame(loop);
  }

  function loop() {
    rafId = 0;
    if (!running || !canvasInView) return;

    speed += (targetSpeed - speed) * 0.08;

    for (let i = 0; i < NUM_METABALLS; i += 1) {
      const metaball = metaballs[i];
      if (!metaball) continue;

      metaball.x += metaball.vx * speed;
      metaball.y += metaball.vy * speed;

      if (metaball.x < metaball.r || metaball.x > width - metaball.r) {
        metaball.vx *= -1;
      }
      if (metaball.y < metaball.r || metaball.y > height - metaball.r) {
        metaball.vy *= -1;
      }
    }

    for (let i = 0; i < NUM_METABALLS; i += 1) {
      const baseIndex = 3 * i;
      const metaball = metaballs[i];
      if (!metaball) continue;

      dataToSendToGPU[baseIndex] = metaball.x;
      dataToSendToGPU[baseIndex + 1] = metaball.y;
      dataToSendToGPU[baseIndex + 2] = metaball.r;
    }

    gl.uniform3fv(metaballsHandle, dataToSendToGPU);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

    scheduleFrame();
  }

  window.addEventListener('resize', rebuildProgramForSize, { passive: true });
  window.addEventListener('pointerdown', onPointerDown, { passive: true });

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
    window.removeEventListener('resize', rebuildProgramForSize);
    window.removeEventListener('pointerdown', onPointerDown);
    document.removeEventListener('visibilitychange', onVisibilityChange);
    viewportObserver?.disconnect();
    gl.deleteBuffer(vertexDataBuffer);
    gl.deleteProgram(program);
    gl.deleteShader(vertexShader);
    gl.deleteShader(fragmentShader);
  }

  return { dispose };
}
