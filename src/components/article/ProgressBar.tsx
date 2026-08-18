"use client";

import { useEffect, useState } from "react";
import styles from "@/app/[slug]/article.module.css";

export default function ProgressBar() {
  const [pct, setPct] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      setPct((h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return <div className={styles.progress} style={{ width: `${pct}%` }} />;
}
