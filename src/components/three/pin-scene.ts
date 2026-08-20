import {
  ConeGeometry,
  CylinderGeometry,
  DirectionalLight,
  Group,
  HemisphereLight,
  Mesh,
  MeshStandardMaterial,
  PerspectiveCamera,
  Scene,
  SphereGeometry,
  WebGLRenderer,
} from "three";

// The P!N pushpin: waxy red head, brass collar, steel needle.
// Idles with a slow sway; leans gently toward the cursor.
export function mount(host: HTMLElement): () => void {
  const renderer = new WebGLRenderer({ alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.domElement.style.position = "absolute";
  renderer.domElement.style.inset = "0";
  renderer.domElement.style.width = "100%";
  renderer.domElement.style.height = "100%";
  host.appendChild(renderer.domElement);

  const scene = new Scene();
  const camera = new PerspectiveCamera(32, 1, 0.1, 20);
  camera.position.set(0, 0.4, 6.2);

  scene.add(new HemisphereLight(0xfff1dd, 0x2a1c10, 1.15));
  const key = new DirectionalLight(0xffd9a8, 1.6);
  key.position.set(2.4, 3.2, 4);
  scene.add(key);
  const rim = new DirectionalLight(0xe8442e, 0.5);
  rim.position.set(-3, 0.8, -2.5);
  scene.add(rim);

  const pin = new Group();

  const wax = new MeshStandardMaterial({ color: 0xe8442e, roughness: 0.42, metalness: 0.05 });
  const brass = new MeshStandardMaterial({ color: 0xc9a227, roughness: 0.3, metalness: 0.9 });
  const steel = new MeshStandardMaterial({ color: 0xb9b7b2, roughness: 0.25, metalness: 0.95 });

  const head = new Mesh(new SphereGeometry(1, 48, 32), wax);
  head.position.y = 1.15;
  head.scale.set(1, 0.92, 1);
  pin.add(head);

  const collar = new Mesh(new CylinderGeometry(0.34, 0.46, 0.55, 32), brass);
  collar.position.y = 0.15;
  pin.add(collar);

  const needle = new Mesh(new CylinderGeometry(0.05, 0.05, 1.5, 16), steel);
  needle.position.y = -0.85;
  pin.add(needle);

  const tip = new Mesh(new ConeGeometry(0.05, 0.22, 16), steel);
  tip.rotation.x = Math.PI;
  tip.position.y = -1.7;
  pin.add(tip);

  pin.rotation.z = -0.14;
  scene.add(pin);

  let targetX = 0;
  let targetY = 0;
  const onPointer = (e: PointerEvent) => {
    const r = host.getBoundingClientRect();
    targetX = ((e.clientX - r.left) / r.width - 0.5) * 2;
    targetY = ((e.clientY - r.top) / r.height - 0.5) * 2;
  };
  window.addEventListener("pointermove", onPointer, { passive: true });

  const resize = () => {
    const w = Math.max(1, host.clientWidth);
    const h = Math.max(1, host.clientHeight);
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  };
  resize();
  const ro = new ResizeObserver(resize);
  ro.observe(host);

  let visible = true;
  const io = new IntersectionObserver((entries) => {
    visible = entries.some((e) => e.isIntersecting);
  });
  io.observe(host);

  let px = 0;
  let py = 0;
  const start = performance.now();
  const tick = () => {
    if (!visible) return;
    const t = (performance.now() - start) / 1000;
    px += (targetX - px) * 0.04;
    py += (targetY - py) * 0.04;
    pin.rotation.z = -0.14 + Math.sin(t * 0.6) * 0.07 + px * 0.12;
    pin.rotation.x = Math.sin(t * 0.4) * 0.04 + py * 0.08;
    pin.position.y = Math.sin(t * 0.8) * 0.06;
    renderer.render(scene, camera);
  };
  renderer.setAnimationLoop(tick);
  const onVisibility = () => {
    renderer.setAnimationLoop(document.hidden ? null : tick);
  };
  document.addEventListener("visibilitychange", onVisibility);

  return () => {
    document.removeEventListener("visibilitychange", onVisibility);
    window.removeEventListener("pointermove", onPointer);
    renderer.setAnimationLoop(null);
    io.disconnect();
    ro.disconnect();
    [head, collar, needle, tip].forEach((m) => m.geometry.dispose());
    [wax, brass, steel].forEach((m) => m.dispose());
    renderer.dispose();
    renderer.domElement.remove();
  };
}
