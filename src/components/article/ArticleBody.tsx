"use client";

import styles from "@/app/[slug]/article.module.css";
import { useUi } from "@/components/ui/UiProvider";
import type { Article, BodyBlock } from "@/lib/content/types";

function Block({ block, toast }: { block: BodyBlock; toast: (m: string) => void }) {
  switch (block.type) {
    case "whatHappened":
      return (
        <div className={styles.block}>
          <div className={styles.blockLabel}>{block.label}</div>
          {block.paragraphs.map((p) => <p key={p}>{p}</p>)}
          {block.bullets && <ul>{block.bullets.map((b) => <li key={b}>{b}</li>)}</ul>}
        </div>
      );
    case "whyItMatters":
      return (
        <div className={`${styles.block} ${styles.view}`}>
          <div className={styles.blockLabel}>{block.label}</div>
          {block.paragraphs.map((p) => <p key={p}>{p}</p>)}
        </div>
      );
    case "quote":
      return (
        <div className={styles.pull}>
          {block.text}
          <span>{block.attribution}</span>
        </div>
      );
    case "video":
      return (
        <div className={styles.block}>
          <div className={styles.blockLabel}>{block.label}</div>
          <button className={styles.inlineVideo} onClick={() => toast("Видео тоглуулна (демо)")}>
            <div className={styles.play} />
            <span className={styles.duration}>{block.duration}</span>
            <div className={styles.ivBody}>{block.title}</div>
          </button>
          <p className={styles.caption}>{block.caption}</p>
        </div>
      );
    case "whatsNext":
      return (
        <div className={styles.block}>
          <div className={styles.blockLabel}>{block.label}</div>
          {block.paragraphs.map((p) => <p key={p}>{p}</p>)}
          <button className={`${styles.btn} ${styles.accent}`} onClick={() => toast("Энэ сэдвийг пинлэлээ 📌 — шинэчлэл бүрд мэдэгдэнэ")}>
            📌 Энэ сэдвийг дагах
          </button>
        </div>
      );
  }
}

export default function ArticleBody({ article }: { article: Article }) {
  const { toast } = useUi();
  return (
    <>
      {article.body.map((b, i) => <Block key={i} block={b} toast={toast} />)}
      <div className={styles.tags}>
        {article.tags.map((t) => (
          <a key={t} href="#" onClick={(e) => { e.preventDefault(); toast("Таг хуудас (демо)"); }}>#{t}</a>
        ))}
      </div>
    </>
  );
}
