"use client";

import Link from "next/link";
import styles from "./FeatureCard.module.css";
import Reveal from "@/components/ui/Reveal";
import { useUi } from "@/components/ui/UiProvider";
import type { ArticleCard } from "@/lib/content/types";

export default function FeatureCard({ article }: { article: ArticleCard }) {
  const { toast } = useUi();
  return (
    <Reveal className={styles.outer}>
      <Link href={`/${article.slug}`} className={styles.feature}>
        <div className={styles.featArt}>
          {/* v6 composition with depth: gradient towers, sunset glow, lit windows, film grain */}
          <svg viewBox="0 0 600 420" preserveAspectRatio="xMidYMid slice">
            <defs>
              <linearGradient id="fc-sky" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#241C12" />
                <stop offset="100%" stopColor="#16130F" />
              </linearGradient>
              <linearGradient id="fc-t1" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#E8442E" /><stop offset="100%" stopColor="#9E2C17" />
              </linearGradient>
              <linearGradient id="fc-t2" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#D96C4A" /><stop offset="100%" stopColor="#8F3C22" />
              </linearGradient>
              <linearGradient id="fc-t3" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#B23A26" /><stop offset="100%" stopColor="#6E2113" />
              </linearGradient>
              <radialGradient id="fc-sun" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#FFD9A8" /><stop offset="70%" stopColor="#E8A87C" /><stop offset="100%" stopColor="#E8A87C" stopOpacity="0" />
              </radialGradient>
              <filter id="fc-grain">
                <feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" result="n" />
                <feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .4 0" />
                <feComposite operator="in" in2="SourceGraphic" />
              </filter>
            </defs>
            <rect width="600" height="420" fill="url(#fc-sky)" />
            <circle cx="470" cy="90" r="90" fill="url(#fc-sun)" opacity=".9" />
            <circle cx="300" cy="120" r="150" fill="none" stroke="#E8A87C" strokeWidth="34" strokeDasharray="240 700" opacity=".85" />
            <rect x="60" y="100" width="70" height="320" rx="3" fill="url(#fc-t3)" />
            <rect x="150" y="20" width="90" height="400" rx="3" fill="url(#fc-t1)" />
            <rect x="262" y="160" width="70" height="260" rx="3" fill="#1D1812" stroke="#2A241C" />
            <rect x="352" y="70" width="80" height="350" rx="3" fill="url(#fc-t2)" />
            <rect x="452" y="190" width="70" height="230" rx="3" fill="url(#fc-t3)" />
            <g fill="#FFD9A8" opacity=".75">
              <rect x="168" y="60" width="12" height="16" rx="1" /><rect x="196" y="60" width="12" height="16" rx="1" />
              <rect x="168" y="100" width="12" height="16" rx="1" /><rect x="196" y="140" width="12" height="16" rx="1" />
              <rect x="370" y="110" width="10" height="14" rx="1" /><rect x="396" y="150" width="10" height="14" rx="1" />
              <rect x="370" y="190" width="10" height="14" rx="1" />
              <rect x="76" y="140" width="10" height="13" rx="1" /><rect x="100" y="180" width="10" height="13" rx="1" />
            </g>
            <rect width="600" height="420" fill="#000" filter="url(#fc-grain)" opacity=".22" />
          </svg>
          {article.videoChip && (
            <button
              className={styles.featVidchip}
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); toast("Видео тоглуулна (демо)"); }}
            >
              <span className={styles.tri} /> {article.videoChip.label} · {article.videoChip.duration}
            </button>
          )}
        </div>
        <div className={styles.featBody}>
          <span className={styles.cat}>Онцлох · {article.category.name}</span>
          <h2>{article.title}</h2>
          {article.dek && <p>{article.dek}</p>}
          <div className={styles.featCta}><span>Уншиж эхлэх</span><span className={styles.arr}>⟶</span></div>
        </div>
      </Link>
    </Reveal>
  );
}
