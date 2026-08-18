import styles from "./Manifesto.module.css";
import Reveal from "@/components/ui/Reveal";

const VALS = [
  { n: "01", h: "Сонгоно", p: "Өдөрт заавал мэдэх цөөхөн сэдэв." },
  { n: "02", h: "Тайлбарлана", p: "Яагаад чухлыг нь товч, тодорхой." },
  { n: "03", h: "Хүндэтгэнэ", p: "Таны цаг, анхаарал, итгэлийг." },
];

export default function Manifesto() {
  return (
    <section className={styles.manif} id="manif">
      <div className="wrap">
        <Reveal className={styles.k}>PIN гэж юу вэ?</Reveal>
        <Reveal as="h2" delay={1} className={styles.h2}>
          Илүү их мэдээ биш.<br /><span className={styles.ital}>Илүү их ойлголт.</span>
        </Reveal>
        <Reveal delay={2} className={styles.vals}>
          {VALS.map((v) => (
            <div key={v.n} className={styles.val}>
              <div className={styles.n}>{v.n}</div>
              <h5>{v.h}</h5>
              <p>{v.p}</p>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
