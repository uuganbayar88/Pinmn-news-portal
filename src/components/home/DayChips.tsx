"use client";

import styles from "./DayChips.module.css";
import Reveal from "@/components/ui/Reveal";
import { useUi } from "@/components/ui/UiProvider";

export default function DayChips({ chips }: { chips: { label: string; date: string; active: boolean; toast?: string }[] }) {
  const { toast } = useUi();
  return (
    <Reveal className={styles.daysbar}>
      {chips.map((c) => (
        <button
          key={c.date}
          className={`${styles.daychip} ${c.active ? styles.active : ""}`}
          onClick={c.active || !c.toast ? undefined : () => toast(c.toast!)}
        >
          {c.label}
        </button>
      ))}
      <button className={`${styles.daychip} ${styles.arch}`} onClick={() => toast("Архив хуудас (демо)")}>
        Бүх архив →
      </button>
    </Reveal>
  );
}
