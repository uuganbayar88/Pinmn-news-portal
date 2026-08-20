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
          <svg viewBox="0 0 600 420" preserveAspectRatio="xMidYMid slice">
            <rect width="600" height="420" fill="#16130F" />
            <rect x="60" y="90" width="70" height="330" fill="#B23A26" />
            <rect x="150" y="0" width="90" height="420" fill="#E8442E" />
            <rect x="262" y="150" width="70" height="270" fill="#16130F" stroke="#2A241C" />
            <rect x="352" y="60" width="80" height="360" fill="#D96C4A" />
            <rect x="452" y="180" width="70" height="240" fill="#8A2D1D" />
            <circle cx="300" cy="120" r="150" fill="none" stroke="#E8A87C" strokeWidth="34" strokeDasharray="240 700" />
            <circle cx="470" cy="80" r="34" fill="#E8A87C" />
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
