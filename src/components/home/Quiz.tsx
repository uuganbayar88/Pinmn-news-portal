"use client";

import { useState } from "react";
import styles from "./Quiz.module.css";
import Reveal from "@/components/ui/Reveal";
import { useUi } from "@/components/ui/UiProvider";

const OPTIONS = [
  { label: "Бууруулсан", ok: false },
  { label: "Хэвээр хадгалсан", ok: true },
  { label: "Нэмэгдүүлсэн", ok: false },
];

export default function Quiz() {
  const { toast } = useUi();
  const [picked, setPicked] = useState<number | null>(null);

  const pick = (i: number) => {
    if (picked !== null) return;
    setPicked(i);
    toast(OPTIONS[i].ok ? "Зөв! 🎯 1/5 — дараагийн асуулт (демо)" : "Харамсалтай! Зөв хариултыг тодруулав");
  };

  const stateOf = (i: number): string | undefined => {
    if (picked === null) return undefined;
    if (OPTIONS[i].ok) return "ok";
    if (i === picked) return "no";
    return OPTIONS[picked].ok ? "no" : undefined;
  };

  return (
    <Reveal as="section" className={styles.quiz}>
      <div>
        <span className={styles.k}>Пин сорил · №32</span>
        <h3>Энэ 7 хоногийг санаж үлдэв үү?</h3>
        <p>Долоо хоногийн пинүүдээс автоматаар үүсдэг 5 асуулт. Баасан бүр шинэчлэгдэнэ — оноогоо картаар хуваалцаж, найзаа сориорой.</p>
        <div className={styles.qmeta}>
          <span>5 асуулт</span><span>·</span><span>2 минут</span><span>·</span>
          <button className={styles.qshare} onClick={() => toast("Оноонд зориулсан карт үүслээ (демо) 🎯")}>Оноогоо хуваалцах →</button>
        </div>
      </div>
      <div className={styles.qcard}>
        <div className={styles.qnum}>Асуулт 1/5</div>
        <h4>Төв банк энэ долоо хоногт бодлогын хүүгээ яасан бэ?</h4>
        {OPTIONS.map((o, i) => (
          <button
            key={o.label}
            className={styles.qopt}
            data-state={stateOf(i)}
            disabled={picked !== null}
            onClick={() => pick(i)}
          >
            {o.label}
          </button>
        ))}
        <div className={styles.qhint}>Санахгүй байна уу? — Пин №01-ийг дахин хараарай</div>
      </div>
    </Reveal>
  );
}
