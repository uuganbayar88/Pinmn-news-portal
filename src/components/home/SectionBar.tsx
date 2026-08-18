import styles from "./SectionBar.module.css";
import Reveal from "@/components/ui/Reveal";

export default function SectionBar({ title, meta, onDark = false }: { title: string; meta: string; onDark?: boolean }) {
  return (
    <Reveal className={`${styles.secbar} ${onDark ? styles.onDark : ""}`}>
      <span className={styles.bdot} />
      <h3>{title}</h3>
      <span className={styles.meta}>{meta}</span>
    </Reveal>
  );
}
