"use client";

import styles from "@/app/[slug]/article.module.css";
import { useUi } from "@/components/ui/UiProvider";

export default function ListenButton({ title, duration }: { title: string; duration: string }) {
  const { playAudio } = useUi();
  return (
    <button className={styles.listenBtn} onClick={() => playAudio(title, duration)}>
      🎧 Сонсох · {duration}
    </button>
  );
}
