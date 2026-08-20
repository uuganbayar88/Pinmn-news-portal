"use client";

import styles from "./TodayBar.module.css";
import Reveal from "@/components/ui/Reveal";
import { useUi } from "@/components/ui/UiProvider";

// Takes only the scalar fields it renders (not the whole DailyDigest) so the
// full pins array — each carrying a full Article body — never gets
// serialized into this client component's payload.
export default function TodayBar({
  storyCount,
  totalMinutes,
  updatedAtLabel,
}: {
  storyCount: number;
  totalMinutes: number;
  updatedAtLabel: string;
}) {
  const { playAudio } = useUi();
  return (
    <Reveal className={styles.todaybar}>
      <div className={styles.tbl}>
        <h1 className={styles.tbk}><span className={styles.bdot} />Өнөөдрийн пин</h1>
        <span className={styles.tbt}>— мэдэхэд хангалттай.</span>
      </div>
      <div className={styles.tbr}>
        <button className={styles.listen} onClick={() => playAudio("Өнөөдрийн пин — бүтэн дугаар", "7:00")}>
          <span className={styles.lp} />Дугаарыг сонсох · 7:00
        </button>
        <span className={styles.tbm}>
          <b>{storyCount}</b> мэдээ · <b>{totalMinutes}</b> минут · {updatedAtLabel}
        </span>
      </div>
    </Reveal>
  );
}
