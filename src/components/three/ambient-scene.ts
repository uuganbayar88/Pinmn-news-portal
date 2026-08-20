import {
  Mesh,
  OrthographicCamera,
  PlaneGeometry,
  Scene,
  ShaderMaterial,
  Vector2,
  WebGLRenderer,
} from "three";

// Soft morning-light field: two warm glows drifting very slowly on a
// transparent plane. Sits behind the hero content, above the CSS fallback.
const FRAGMENT = /* glsl */ `
  precision mediump float;
  uniform vec2 uRes;
  uniform float uTime;

  float glow(vec2 p, vec2 c, float r) {
    return smoothstep(r, 0.0, distance(p, c));
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / uRes;
    vec2 p = vec2(uv.x * uRes.x / uRes.y, uv.y);
    float aspect = uRes.x / uRes.y;

    vec2 c1 = vec2(aspect * (0.82 + 0.015 * sin(uTime * 0.11)), 0.88 + 0.02 * cos(uTime * 0.09));
    vec2 c2 = vec2(aspect * (0.06 + 0.02 * cos(uTime * 0.07)), 0.10 + 0.03 * sin(uTime * 0.13));

    float g1 = glow(p, c1, 0.72);
    float g2 = glow(p, c2, 0.55);

    vec3 warm = vec3(0.910, 0.659, 0.486); /* #E8A87C */
    vec3 clay = vec3(0.910, 0.267, 0.180); /* #E8442E */
    vec3 col = warm * g1 * 0.65 + clay * g2 * 0.22;
    float a = clamp(g1 * 0.34 + g2 * 0.10, 0.0, 0.42);
    gl_FragColor = vec4(col, a);
  }
`;

const VERTEX = /* glsl */ `
  void main() {
    gl_Position = vec4(position, 1.0);
  }
`;

export function mount(host: HTMLElement): () => void {
  const renderer = new WebGLRenderer({
    alpha: true,
    antialias: false,
    powerPreference: "low-power",
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  renderer.domElement.style.position = "absolute";
  renderer.domElement.style.inset = "0";
  renderer.domElement.style.width = "100%";
  renderer.domElement.style.height = "100%";
  host.appendChild(renderer.domElement);

  const scene = new Scene();
  const camera = new OrthographicCamera(-1, 1, 1, -1, 0, 1);
  const uniforms = {
    uTime: { value: 0 },
    uRes: { value: new Vector2(1, 1) },
  };
  const material = new ShaderMaterial({
    transparent: true,
    depthWrite: false,
    uniforms,
    vertexShader: VERTEX,
    fragmentShader: FRAGMENT,
  });
  const quad = new Mesh(new PlaneGeometry(2, 2), material);
  scene.add(quad);

  const resize = () => {
    const w = Math.max(1, host.clientWidth);
    const h = Math.max(1, host.clientHeight);
    renderer.setSize(w, h, false);
    uniforms.uRes.value.set(
      w * renderer.getPixelRatio(),
      h * renderer.getPixelRatio(),
    );
  };
  resize();
  const ro = new ResizeObserver(resize);
  ro.observe(host);

  let visible = true;
  const io = new IntersectionObserver((entries) => {
    visible = entries.some((e) => e.isIntersecting);
  });
  io.observe(host);

  const onVisibility = () => {
    renderer.setAnimationLoop(document.hidden ? null : tick);
  };
  const start = performance.now();
  const tick = () => {
    if (!visible) return;
    uniforms.uTime.value = (performance.now() - start) / 1000;
    renderer.render(scene, camera);
  };
  renderer.setAnimationLoop(tick);
  document.addEventListener("visibilitychange", onVisibility);

  return () => {
    document.removeEventListener("visibilitychange", onVisibility);
    renderer.setAnimationLoop(null);
    io.disconnect();
    ro.disconnect();
    quad.geometry.dispose();
    material.dispose();
    renderer.dispose();
    renderer.domElement.remove();
  };
}
