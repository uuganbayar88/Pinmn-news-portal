"use client";

import Link from "next/link";
import styles from "./Header.module.css";
import { useUi } from "@/components/ui/UiProvider";

export default function Header({ dateLabel }: { dateLabel: string }) {
  const { toast, openSearch } = useUi();
  return (
    <header className={styles.header}>
      <div className={`wrap ${styles.head}`}>
        <Link className={styles.logo} href="/">
          P<span className={styles.bang}>!</span>N<span className={styles.dot}>.</span>
        </Link>
        <nav className={styles.main}>
          <Link className={styles.active} href="/">Өнөөдөр</Link>
          <a href="#" onClick={(e) => { e.preventDefault(); toast("Тайлбар хуудас (демо)"); }}>Тайлбар</a>
          <a href="#video">Видео</a>
          <a href="#" onClick={(e) => { e.preventDefault(); toast("Үйл явдал хуудас (демо)"); }}>Үйл явдал</a>
          <a href="#manif">Бидний тухай</a>
        </nav>
        <div className={styles.headRight}>
          <span className={styles.datechip}>{dateLabel}</span>
          <button className={styles.burger} onClick={openSearch} title="Хайлт / Архив">⌕</button>
          <button className={styles.burger} onClick={() => toast("Цэс (демо)")}>≡</button>
        </div>
      </div>
    </header>
  );
}
