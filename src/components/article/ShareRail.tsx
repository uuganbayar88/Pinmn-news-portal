"use client";

import styles from "@/app/[slug]/article.module.css";
import { useUi } from "@/components/ui/UiProvider";

export default function ShareRail() {
  const { toast } = useUi();
  return (
    <div className={styles.shareRail}>
      <button className={styles.shareBtn} onClick={() => toast("Facebook-т хуваалцах цонх (демо)")}>
        <svg viewBox="0 0 24 24"><path d="M13.5 9H16l.5-3h-3V4.5c0-.9.3-1.5 1.6-1.5H16.6V.2C16.3.2 15.3 0 14.1 0 11.6 0 10 1.5 10 4.2V6H7.5v3H10v9h3.5V9z" /></svg>
      </button>
      <button className={styles.shareBtn} onClick={() => toast("X-д хуваалцах цонх (демо)")}>
        <svg viewBox="0 0 24 24"><path d="M18.9 1.2h3.7l-8.1 9.3L24 23.2h-7.5l-5.9-7.7-6.7 7.7H.2l8.7-9.9L0 1.2h7.7l5.3 7 5.9-7z" /></svg>
      </button>
      <button className={styles.shareBtn} onClick={() => toast("Линк хуулагдлаа ✓")}>
        <svg viewBox="0 0 24 24"><path d="M10.6 13.4a1 1 0 0 0 1.4 1.4l4-4a3 3 0 0 0-4.2-4.2l-2 2a1 1 0 1 0 1.4 1.4l2-2a1 1 0 0 1 1.4 1.4l-4 4zm2.8-2.8a1 1 0 0 0-1.4-1.4l-4 4a3 3 0 1 0 4.2 4.2l2-2a1 1 0 1 0-1.4-1.4l-2 2a1 1 0 0 1-1.4-1.4l4-4z" /></svg>
      </button>
      <button className={styles.shareBtn} onClick={() => toast("Пинлэгдлээ 📌")} style={{ color: "var(--accent)" }}>
        📌
      </button>
      <div className={styles.shareCount}>1.2К<br />хуваалцсан</div>
    </div>
  );
}
