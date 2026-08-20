"use client";

import styles from "./Sidebar.module.css";
import Reveal from "@/components/ui/Reveal";
import { useUi } from "@/components/ui/UiProvider";
import type { EventItem } from "@/lib/content/types";

export default function Sidebar({ events, mostPinned }: { events: EventItem[]; mostPinned: string[] }) {
  const { toast } = useUi();
  return (
    <aside className={styles.aside}>
      <Reveal className={styles.nlbox}>
        <span className={styles.k}>Өглөө бүр · 07:30</span>
        <h4>Инбокс руугаа пиндээрэй</h4>
        <p>Өдрийн хамгийн чухал мэдээ — имэйлээр, 7 минутад.</p>
        <div className={styles.nlform}>
          <input type="email" placeholder="И-мэйл хаяг" aria-label="И-мэйл хаяг" />
          <button onClick={() => toast("Баярлалаа! Маргааш 07:30-д уулзъя 📬")}>ПИНЛЭХ →</button>
        </div>
        <div className={styles.fine}>Спамгүй. Хэзээ ч цуцалж болно.</div>
      </Reveal>

      <Reveal className={styles.sidesec}>
        <div className={styles.shead}><h5>Энэ 7 хоногт</h5><span>→</span></div>
        {events.map((e) => (
          <div key={e.title} className={styles.evrow}>
            <div className={styles.d}>{e.day}<small>{e.monthLabel}</small></div>
            <div><h6>{e.title}</h6><span>{e.venue}</span></div>
          </div>
        ))}
      </Reveal>

      <Reveal className={styles.sidesec}>
        <div className={styles.shead}><h5>Их пинлэгдсэн</h5><span>🔥</span></div>
        {mostPinned.map((t, i) => (
          <button key={t} className={styles.toprow} onClick={() => toast("Мэдээ рүү (демо)")}>
            <em>{String(i + 1).padStart(2, "0")}</em>{t}
          </button>
        ))}
      </Reveal>

      <Reveal className={styles.adslot}>
        <span className={styles.adlbl}>Сурталчилгаа</span>
        <div className={styles.adcard}>
          <span className={styles.lbl}>Хас Банк</span>
          <h4>Дижитал зээл — 10 минутад шийдвэр</h4>
          <p>Апп-аар хүсэлтээ илгээгээд, хариугаа шууд аваарай.</p>
          <button className={styles.more} onClick={() => toast("Спонсорын хуудас (демо)")}>Дэлгэрэнгүй</button>
        </div>
      </Reveal>
    </aside>
  );
}
