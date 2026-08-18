"use client";

import styles from "./AudioPlayerBar.module.css";

export interface AudioState {
  title: string;
  dur: number;
  cur: number;
  playing: boolean;
  open: boolean;
}

function fmt(s: number): string {
  const v = Math.max(0, Math.round(s));
  return `${Math.floor(v / 60)}:${String(v % 60).padStart(2, "0")}`;
}

export default function AudioPlayerBar({
  state,
  onToggle,
  onClose,
}: {
  state: AudioState | null;
  onToggle: () => void;
  onClose: () => void;
}) {
  const open = state?.open ?? false;
  const paused = !state?.playing;
  return (
    <div className={`${styles.player} ${open ? styles.open : ""} ${paused ? styles.paused : ""}`}>
      <div className={styles.prog} style={{ width: state ? `${(state.cur / state.dur) * 100}%` : 0 }} />
      <div className={styles.pinner}>
        <button className={styles.pbtn} onClick={onToggle} aria-label={paused ? "Тоглуулах" : "Түр зогсоох"}>
          {paused ? <span className={styles.tri} /> : <span className={styles.pause}><i /><i /></span>}
        </button>
        <div className={styles.ptitle}>
          <div className={styles.pk}>PIN Аудио</div>
          <h6>{state?.title ?? "—"}</h6>
        </div>
        <div className={styles.pwave}><i /><i /><i /><i /><i /></div>
        <span className={styles.ptime}>{state ? `${fmt(state.cur)} / ${fmt(state.dur)}` : "0:00 / 0:00"}</span>
        <button className={styles.pclose} onClick={onClose} aria-label="Хаах">✕</button>
      </div>
    </div>
  );
}
