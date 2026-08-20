"use client";

import { useState } from "react";
import styles from "./PinStage.module.css";
import ThreeMount from "@/components/three/ThreeMount";

// Static SVG pin is the always-on fallback; the WebGL pin fades in over it
// on capable browsers (see three-gate).
export default function PinStage() {
  const [live, setLive] = useState(false);
  return (
    <div className={styles.stage} aria-hidden="true">
      <div className={styles.halo} />
      <svg
        className={`${styles.fallback} ${live ? styles.hidden : ""}`}
        width="120"
        height="184"
        viewBox="0 0 150 230"
      >
        <defs>
          <radialGradient id="pinstage-head" cx="36%" cy="30%" r="80%">
            <stop offset="0%" stopColor="#F0703F" />
            <stop offset="55%" stopColor="#E8442E" />
            <stop offset="100%" stopColor="#8E2B12" />
          </radialGradient>
          <linearGradient id="pinstage-stem" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#8C6B2F" />
            <stop offset="45%" stopColor="#E8C877" />
            <stop offset="60%" stopColor="#C9A227" />
            <stop offset="100%" stopColor="#7A5B22" />
          </linearGradient>
        </defs>
        <circle cx="75" cy="62" r="56" fill="url(#pinstage-head)" />
        <ellipse cx="56" cy="42" rx="16" ry="10" fill="#FFDCC2" opacity=".55" transform="rotate(-24 56 42)" />
        <rect x="66" y="112" width="18" height="62" rx="9" fill="url(#pinstage-stem)" />
        <path d="M75 174 L75 222" stroke="#6E6C68" strokeWidth="5" strokeLinecap="round" />
        <path d="M75 174 L75 222" stroke="#BFBDB8" strokeWidth="2" strokeLinecap="round" />
      </svg>
      <ThreeMount scene="pin" className={styles.canvas} onLive={() => setLive(true)} />
    </div>
  );
}
