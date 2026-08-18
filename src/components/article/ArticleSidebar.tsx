"use client";

import styles from "@/app/[slug]/article.module.css";
import { useUi } from "@/components/ui/UiProvider";

export default function ArticleSidebar() {
  const { toast } = useUi();
  return (
    <aside>
      <div className={styles.box}>
        <h3>Холбоотой пинүүд</h3>
        <div className={styles.rel}>
          <span className={styles.n}>1</span>
          <div>
            <h5>Төв банк бодлогын хүүг хэвээр хадгалав</h5>
            <span>Эдийн засаг · 2 мин</span>
          </div>
        </div>
        <div className={styles.rel}>
          <span className={styles.n}>2</span>
          <div>
            <h5>Цахим үйлчилгээний хуулийн товч тайлбар</h5>
            <span>Технологи · 3 мин</span>
          </div>
        </div>
        <div className={styles.rel}>
          <span className={styles.n}>3</span>
          <div>
            <h5>ЖДБ-ийн зээлийн шинэ хөтөлбөр</h5>
            <span>Бизнес · 2 мин</span>
          </div>
        </div>
      </div>

      <div className={`${styles.box} ${styles.dark}`}>
        <h3>Өглөө бүр — имэйлээр 📬</h3>
        <p>«Өнөөдрийн пин»-ийг 07:30-д шууд инбокс руугаа аваарай.</p>
        <div className={styles.nlForm}>
          <input type="email" placeholder="И-мэйл хаяг" />
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
