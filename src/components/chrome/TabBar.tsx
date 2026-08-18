"use client";

import styles from "./TabBar.module.css";
import { useUi } from "@/components/ui/UiProvider";

export default function TabBar() {
  const { toast, openSearch } = useUi();
  return (
    <nav className={styles.tabbar}>
      <a className={styles.active} href="/"><span className={styles.ico}>📌</span>Өнөөдөр</a>
      <a href="#" onClick={(e) => { e.preventDefault(); toast("Тайлбар хуудас (демо)"); }}><span className={styles.ico}>📰</span>Тайлбар</a>
      <a href="#video"><span className={styles.ico}>▶️</span>Видео</a>
      <a href="#" onClick={(e) => { e.preventDefault(); toast("Үйл явдал хуудас (демо)"); }}><span className={styles.ico}>📅</span>Үйл явдал</a>
      <a href="#" onClick={(e) => { e.preventDefault(); openSearch(); }}><span className={styles.ico}>⌕</span>Хайх</a>
    </nav>
  );
}
