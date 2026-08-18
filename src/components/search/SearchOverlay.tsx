"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./SearchOverlay.module.css";
import { getSearchIndex } from "@/lib/content/accessors";
import { filterSearch } from "@/lib/content/search";

const HOT = [
  { label: "татварын шинэчлэл", q: "татвар" },
  { label: "метро", q: "метро" },
  { label: "бодлогын хүү", q: "хүү" },
  { label: "автобус", q: "автобус" },
];
const DATES = [
  { label: "Өнөөдөр · 08.07", q: "08.07" },
  { label: "08.06", q: "08.06" },
  { label: "08.05", q: "08.05" },
  { label: "08.04", q: "08.04" },
];

export default function SearchOverlay({
  open,
  onClose,
  onOpen,
  toast,
}: {
  open: boolean;
  onClose: () => void;
  onOpen: () => void;
  toast: (msg: string) => void;
}) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const index = getSearchIndex();
  const results = filterSearch(index, query);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "/" && !open && document.activeElement?.tagName !== "INPUT") {
        e.preventDefault();
        onOpen();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose, onOpen]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 100);
  }, [open]);

  const set = (q: string) => {
    setQuery(q);
    inputRef.current?.focus();
  };

  return (
    <div className={`${styles.searchov} ${open ? styles.svopen : ""}`} role="dialog" aria-label="Хайлт">
      <div className={`wrap ${styles.sinner}`}>
        <div className={styles.srow}>
          <span className={styles.sico}>⌕</span>
          <input
            ref={inputRef}
            value={query}
            placeholder="Хайх — гарчиг, сэдэв, таг..."
            onChange={(e) => setQuery(e.target.value)}
          />
          <button className={styles.sclose} onClick={onClose} aria-label="Хаах">✕</button>
        </div>
        <div className={styles.sgroup}>
          <span className={styles.k}>Их хайгдсан</span>
          {HOT.map((c) => (
            <button key={c.q} className={styles.schip} onClick={() => set(c.q)}>{c.label}</button>
          ))}
        </div>
        <div className={styles.sgroup}>
          <span className={styles.k}>Архив · өдрөөр</span>
          {DATES.map((c) => (
            <button key={c.q} className={styles.schip} onClick={() => set(c.q)}>{c.label}</button>
          ))}
          <button className={styles.schip} onClick={() => toast("Архивын бүрэн хуудас (демо)")}>Бүх архив →</button>
        </div>
        <div className={styles.sres}>
          {results.length ? (
            results.map((r) => (
              <div key={`${r.title}${r.date}`} className={styles.srrow} onClick={() => toast("Мэдээ рүү (демо)")}>
                <span className={styles.src}>{r.category}</span>
                <span className={styles.srt}>{r.title}</span>
                <span className={styles.srd}>{r.date}</span>
              </div>
            ))
          ) : (
            <div className={styles.snone}>«{query.trim()}» — илэрц олдсонгүй. Өөр түлхүүр үг туршаад үзээрэй.</div>
          )}
        </div>
      </div>
    </div>
  );
}
