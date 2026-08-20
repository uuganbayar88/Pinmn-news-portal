"use client";

import styles from "./VideoBand.module.css";
import Reveal from "@/components/ui/Reveal";
import SectionBar from "./SectionBar";
import { useUi } from "@/components/ui/UiProvider";
import type { VideoItem } from "@/lib/content/types";

function Palette({ n }: { n: number }) {
  switch (n) {
    case 0:
      return (
        <svg viewBox="0 0 600 500" preserveAspectRatio="xMidYMid slice">
          <rect width="600" height="500" fill="#221B12" />
          <circle cx="440" cy="130" r="180" fill="none" stroke="#D96C4A" strokeWidth="40" strokeDasharray="300 900" />
          <rect x="80" y="180" width="90" height="320" fill="#E8442E" />
          <rect x="200" y="260" width="80" height="240" fill="#8A2D1D" />
          <rect x="310" y="220" width="90" height="280" fill="#E8A87C" />
          <circle cx="140" cy="110" r="40" fill="#E8A87C" />
        </svg>
      );
    case 1:
      return (
        <svg viewBox="0 0 600 375" preserveAspectRatio="xMidYMid slice">
          <rect width="600" height="375" fill="#1C2430" />
          <rect x="60" y="120" width="70" height="255" fill="#3D5A72" />
          <rect x="170" y="60" width="80" height="315" fill="#E8442E" />
          <circle cx="420" cy="120" r="120" fill="none" stroke="#7F97B8" strokeWidth="30" strokeDasharray="190 600" />
        </svg>
      );
    case 2:
      return (
        <svg viewBox="0 0 600 375" preserveAspectRatio="xMidYMid slice">
          <rect width="600" height="375" fill="#241B26" />
          <rect x="90" y="90" width="85" height="285" fill="#6D4A72" />
          <rect x="210" y="160" width="75" height="215" fill="#E8442E" />
          <circle cx="440" cy="260" r="110" fill="none" stroke="#B88A9E" strokeWidth="28" strokeDasharray="170 600" />
        </svg>
      );
    case 3:
      return (
        <svg viewBox="0 0 600 375" preserveAspectRatio="xMidYMid slice">
          <rect width="600" height="375" fill="#16130F" />
          <rect x="70" y="70" width="80" height="305" fill="#E8442E" />
          <rect x="180" y="140" width="70" height="235" fill="#D96C4A" />
          <circle cx="430" cy="150" r="100" fill="#E8A87C" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 600 375" preserveAspectRatio="xMidYMid slice">
          <rect width="600" height="375" fill="#14201A" />
          <rect x="100" y="100" width="75" height="275" fill="#2E5E4E" />
          <rect x="210" y="60" width="85" height="315" fill="#E8442E" />
          <circle cx="450" cy="120" r="90" fill="none" stroke="#7FAE8E" strokeWidth="26" strokeDasharray="150 500" />
        </svg>
      );
  }
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
