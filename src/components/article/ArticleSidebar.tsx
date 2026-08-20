"use client";

import styles from "@/app/[slug]/article.module.css";
import { useUi } from "@/components/ui/UiProvider";

export default function ArticleSidebar({ relatedPins }: { relatedPins: { title: string; meta: string }[] }) {
  const { toast } = useUi();
  return (
    <aside>
      <div className={styles.box}>
        <h3>Холбоотой пинүүд</h3>
        {relatedPins.map((p, i) => (
          <div key={p.title} className={styles.rel}>
            <span className={styles.n}>{i + 1}</span>
            <div>
              <h5>{p.title}</h5>
              <span>{p.meta}</span>
            </div>
          </div>
        ))}
      </div>

      <div className={`${styles.box} ${styles.dark}`}>
        <h3>Өглөө бүр — имэйлээр 📬</h3>
        <p>«Өнөөдрийн пин»-ийг 07:30-д шууд инбокс руугаа аваарай.</p>
        <div className={styles.nlForm}>
          <input type="email" placeholder="И-мэйл хаяг" aria-label="И-мэйл хаяг" />
          <button className={`${styles.btn} ${styles.accent}`} onClick={() => toast("Баярлалаа! Маргааш 07:30-д уулзъя 📬")}>
            Пинлэх
          </button>
        </div>
      </div>

      <div>
        <span className={styles.adLabel}>Сурталчилгаа</span>
        <div className={styles.adMpu}>
          <h4>Хас Банк — Дижитал зээл</h4>
          <p>Хүсэлтээ 10 минутад илгээгээрэй.</p>
          <button className={styles.btn} onClick={() => toast("Спонсорын хуудас (демо)")}>
            Дэлгэрэнгүй
          </button>
        </div>
      </div>
    </aside>
  );
}
