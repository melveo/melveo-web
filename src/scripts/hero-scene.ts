/**
 * Hero scene — TC5550 CodePen metaballs port.
 *
 * This intentionally mirrors the supplied CodePen logic:
 * - internal canvas resolution is viewport * 0.75
 * - 30 metaballs
 * - radius/velocity formulas match the pen
 * - fragment shader color and threshold logic match the pen
 * - mouse coordinates are not used for motion
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
    gl_FragColor = vec4(
      mix(
        vec3(x / WIDTH, y / HEIGHT, 1.0),
        vec3(0.0, 0.0, 0.0),
        max(0.0, 1.0 - (sum - 0.99) * 100.0)
      ),
      1.0
    );
    return;
  }

  gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
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

  const width = Math.max(1, window.innerWidth * 0.75);
  const height = Math.max(1, window.innerHeight * 0.75);
  canvas.width = width;
  canvas.height = height;
  gl.viewport(0, 0, canvas.width, canvas.height);

  const metaballs: Metaball[] = [];

  for (let i = 0; i < NUM_METABALLS; i += 1) {
    const radius = Math.random() * 60 + 10;
    metaballs.push({
      x: Math.random() * (width - 2 * radius) + radius,
      y: Math.random() * (height - 2 * radius) + radius,
      vx: (Math.random() - 0.5) * 3,
      vy: (Math.random() - 0.5) * 3,
      r: radius * 0.75,
    });
  }

  const vertexShader = createShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER);
  const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource(width, height));

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

  const positionHandle = gl.getAttribLocation(program, 'position');
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

  const metaballsHandle = gl.getUniformLocation(program, 'metaballs');
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

    for (let i = 0; i < NUM_METABALLS; i += 1) {
      const metaball = metaballs[i];
      if (!metaball) continue;

      metaball.x += metaball.vx;
      metaball.y += metaball.vy;

      if (metaball.x < metaball.r || metaball.x > width - metaball.r) {
        metaball.vx *= -1;
      }
      if (metaball.y < metaball.r || metaball.y > height - metaball.r) {
        metaball.vy *= -1;
      }
    }

    const dataToSendToGPU = new Float32Array(3 * NUM_METABALLS);
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
    document.removeEventListener('visibilitychange', onVisibilityChange);
    viewportObserver?.disconnect();
    gl.deleteBuffer(vertexDataBuffer);
    gl.deleteProgram(program);
    gl.deleteShader(vertexShader);
    gl.deleteShader(fragmentShader);
  }

  return { dispose };
}
