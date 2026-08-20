"use client";

import styles from "./VideoBand.module.css";
import Reveal from "@/components/ui/Reveal";
import SectionBar from "./SectionBar";
import { useUi } from "@/components/ui/UiProvider";
import type { VideoItem } from "@/lib/content/types";

/* Same five v6 compositions, now with vertical depth gradients on the towers,
   a warm light source, lit windows on tall towers, and film grain. */

const SHADE: Record<string, string> = {
  "#E8442E": "#9E2C17",
  "#D96C4A": "#8F3C22",
  "#8A2D1D": "#5A1B10",
  "#3D5A72": "#253C4E",
  "#6D4A72": "#462C4A",
  "#2E5E4E": "#1D3E33",
  "#E8A87C": "#C77E52",
};

interface PaletteArt {
  h: number;
  bg: [string, string];
  glow: { cx: number; cy: number; r: number };
  arc?: { cx: number; cy: number; r: number; stroke: string; w: number; dash: string };
  rects: { x: number; y: number; w: number; h: number; c: string }[];
  circle?: { cx: number; cy: number; r: number; c: string };
}

const ARTS: PaletteArt[] = [
  {
    h: 500, bg: ["#2C2214", "#1C160D"], glow: { cx: 460, cy: 110, r: 150 },
    arc: { cx: 440, cy: 130, r: 180, stroke: "#D96C4A", w: 40, dash: "300 900" },
    rects: [
      { x: 80, y: 180, w: 90, h: 320, c: "#E8442E" },
      { x: 200, y: 260, w: 80, h: 240, c: "#8A2D1D" },
      { x: 310, y: 220, w: 90, h: 280, c: "#E8A87C" },
    ],
    circle: { cx: 140, cy: 110, r: 40, c: "#E8A87C" },
  },
  {
    h: 375, bg: ["#243040", "#171E28"], glow: { cx: 430, cy: 110, r: 130 },
    arc: { cx: 420, cy: 120, r: 120, stroke: "#7F97B8", w: 30, dash: "190 600" },
    rects: [
      { x: 60, y: 120, w: 70, h: 255, c: "#3D5A72" },
      { x: 170, y: 60, w: 80, h: 315, c: "#E8442E" },
    ],
  },
  {
    h: 375, bg: ["#2E2331", "#1C141E"], glow: { cx: 440, cy: 250, r: 130 },
    arc: { cx: 440, cy: 260, r: 110, stroke: "#B88A9E", w: 28, dash: "170 600" },
    rects: [
      { x: 90, y: 90, w: 85, h: 285, c: "#6D4A72" },
      { x: 210, y: 160, w: 75, h: 215, c: "#E8442E" },
    ],
  },
  {
    h: 375, bg: ["#221B12", "#120F0B"], glow: { cx: 430, cy: 150, r: 140 },
    rects: [
      { x: 70, y: 70, w: 80, h: 305, c: "#E8442E" },
      { x: 180, y: 140, w: 70, h: 235, c: "#D96C4A" },
    ],
    circle: { cx: 430, cy: 150, r: 100, c: "#E8A87C" },
  },
  {
    h: 375, bg: ["#1B2A21", "#0F1A14"], glow: { cx: 450, cy: 110, r: 120 },
    arc: { cx: 450, cy: 120, r: 90, stroke: "#7FAE8E", w: 26, dash: "150 500" },
    rects: [
      { x: 100, y: 100, w: 75, h: 275, c: "#2E5E4E" },
      { x: 210, y: 60, w: 85, h: 315, c: "#E8442E" },
    ],
  },
];

function windowsFor(r: PaletteArt["rects"][number]) {
  if (r.h < 220) return [];
  return [
    { x: r.x + 14, y: r.y + 34 },
    { x: r.x + r.w - 26, y: r.y + 78 },
    { x: r.x + 14, y: r.y + 122 },
  ];
}

function Palette({ n }: { n: number }) {
  const a = ARTS[n] ?? ARTS[4];
  const id = `vb${n}`;
  return (
    <svg viewBox={`0 0 600 ${a.h}`} preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id={`${id}-bg`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={a.bg[0]} />
          <stop offset="100%" stopColor={a.bg[1]} />
        </linearGradient>
        {a.rects.map((r, i) => (
          <linearGradient key={i} id={`${id}-r${i}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={r.c} />
            <stop offset="100%" stopColor={SHADE[r.c] ?? r.c} />
          </linearGradient>
        ))}
        <radialGradient id={`${id}-glow`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFD9A8" stopOpacity=".8" />
          <stop offset="70%" stopColor="#E8A87C" stopOpacity=".35" />
          <stop offset="100%" stopColor="#E8A87C" stopOpacity="0" />
        </radialGradient>
        <filter id={`${id}-grain`}>
          <feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" result="n" />
          <feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .4 0" />
          <feComposite operator="in" in2="SourceGraphic" />
        </filter>
      </defs>
      <rect width="600" height={a.h} fill={`url(#${id}-bg)`} />
      <circle cx={a.glow.cx} cy={a.glow.cy} r={a.glow.r} fill={`url(#${id}-glow)`} />
      {a.arc && (
        <circle
          cx={a.arc.cx} cy={a.arc.cy} r={a.arc.r} fill="none"
          stroke={a.arc.stroke} strokeWidth={a.arc.w} strokeDasharray={a.arc.dash} opacity=".85"
        />
      )}
      {a.rects.map((r, i) => (
        <rect key={i} x={r.x} y={r.y} width={r.w} height={r.h} rx="3" fill={`url(#${id}-r${i})`} />
      ))}
      {a.rects.flatMap((r, i) =>
        windowsFor(r).map((w, j) => (
          <rect key={`${i}-${j}`} x={w.x} y={w.y} width="11" height="14" rx="1" fill="#FFD9A8" opacity=".7" />
        )),
      )}
      {a.circle && <circle cx={a.circle.cx} cy={a.circle.cy} r={a.circle.r} fill={a.circle.c} />}
      <rect width="600" height={a.h} fill="#000" filter={`url(#${id}-grain)`} opacity=".22" />
    </svg>
  );
}

export default function VideoBand({ videos }: { videos: VideoItem[] }) {
  const { toast } = useUi();
  return (
    <section className={styles.vband} id="video">
      <div className="wrap">
        <SectionBar title="Үзэх ёстой" meta="PIN Видео" onDark />
        <div className={styles.vgrid}>
          {videos.map((v) => (
            <Reveal
              key={v.id}
              as="article"
              delay={v.delay}
              className={`${styles.vcard} ${v.size === "big" ? styles.big : ""}`}
            >
              <button className={styles.art} onClick={() => toast("Видео тоглуулна (демо)")}>
                <Palette n={v.palette} />
                <div className={`${styles.vplay} ${v.size === "small" ? styles.sm : ""}`} />
                <span className={styles.vdur}>{v.duration}</span>
              </button>
              <div className={styles.vinfo}>
                <div className={styles.vcat}>{v.category}</div>
                <h4>{v.title}</h4>
                <div className={styles.vm}>{v.meta}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
