"use client";

import styles from "./PinCard.module.css";
import Reveal from "@/components/ui/Reveal";
import { useUi } from "@/components/ui/UiProvider";
import Link from "next/link";
import type { DigestPinCard } from "@/lib/content/types";

export default function PinCard({ pin, num }: { pin: DigestPinCard; num: string }) {
  const { toast, playAudio } = useUi();
  const a = pin.article;
  const sponsored = Boolean(a.sponsored);
  const cls = [styles.pin, pin.lead ? styles.lead : "", sponsored ? styles.sponsored : ""].filter(Boolean).join(" ");

  return (
    <Reveal as="article" className={cls}>
      <div className={styles.num}>{sponsored ? "S" : num}</div>
      <div>
        <div className={styles.cat}>
          {sponsored ? (
            <><span className={styles.pbadge}>Powered by</span>{a.sponsored!.partner} · Хамтарсан контент</>
          ) : pin.lead ? (
            <>Нэг гол зүйл · {a.category.name}</>
          ) : (
            a.category.name
          )}
        </div>
        <h4><Link href={`/${a.slug}`}>{a.title}</Link></h4>
        <p className={styles.why}>
          <b>{sponsored ? "Товчхон" : "Яагаад чухал вэ?"}</b>
          {a.whyItMatters}
          {sponsored && <i> {a.sponsored!.disclosure}</i>}
        </p>
        {pin.lead && (
          <>
            <ul className={styles.bullets}>
              {a.keyPoints.map((k) => {
                if (!k.includes(":")) return <li key={k}>{k}</li>;
                const [head, ...rest] = k.split(":");
                return <li key={k}><b>{head}:</b>{rest.join(":")}</li>;
              })}
            </ul>
            <Link className={styles.godeeper} href={`/${a.slug}`}>Гүнзгийрэх ⟶</Link>
          </>
        )}
        <div className={styles.pmeta}>
          <span className={styles.auth}>
            <i className={styles.av} style={sponsored ? { background: "var(--gold)" } : undefined}>{a.author.initials}</i>
            {a.author.name}
          </span>
          {a.listenDuration && (
            <button className={styles.listen} onClick={() => playAudio(a.title, a.listenDuration!)}>
              <span className={styles.lp} />Сонсох{pin.lead ? ` · ${a.listenDuration}` : ""}
            </button>
          )}
          <span>{a.readMinutes} мин унших</span>
          <button className={styles.save} onClick={() => toast("Пинлэгдлээ 📌")}>+ ПИНЛЭХ</button>
        </div>
      </div>
    </Reveal>
  );
}
