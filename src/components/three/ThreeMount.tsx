"use client";

import { useEffect, useRef, useState } from "react";
import { readThreeGateEnv, shouldEnableThree } from "@/lib/three-gate";

type SceneName = "ambient" | "pin";

/**
 * Lazily mounts a WebGL scene into an absolutely-positioned host div.
 * three.js is dynamic-imported only when the host is near the viewport,
 * the browser is capable (see three-gate), and the main thread is idle —
 * the initial JS bundle never includes it. `onLive` fires once the scene
 * is actually rendering, so callers can fade out a static fallback.
 */
export default function ThreeMount({
  scene,
  className,
  onLive,
}: {
  scene: SceneName;
  className?: string;
  onLive?: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [live, setLive] = useState(false);

  useEffect(() => {
    const host = ref.current;
    if (!host) return;
    if (!shouldEnableThree(readThreeGateEnv())) return;

    let cancelled = false;
    let cleanup: (() => void) | undefined;

    const load = () => {
      const idle: (cb: () => void) => void =
        typeof window.requestIdleCallback === "function"
          ? (cb) => window.requestIdleCallback(cb, { timeout: 2000 })
          : (cb) => window.setTimeout(cb, 300);
      idle(() => {
        if (cancelled) return;
        const mod =
          scene === "ambient" ? import("./ambient-scene") : import("./pin-scene");
        mod
          .then(({ mount }) => {
            if (cancelled) return;
            cleanup = mount(host);
            setLive(true);
            onLive?.();
          })
          .catch(() => {
            /* WebGL init failed — the CSS/SVG fallback simply stays */
          });
      });
    };

    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          io.disconnect();
          load();
        }
      },
      { rootMargin: "200px" },
    );
    io.observe(host);

    return () => {
      cancelled = true;
      io.disconnect();
      cleanup?.();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scene]);

  return (
    <div
      ref={ref}
      className={className}
      data-live={live || undefined}
      aria-hidden="true"
    />
  );
}
