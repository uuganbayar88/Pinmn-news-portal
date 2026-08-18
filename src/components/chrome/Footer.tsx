import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`wrap ${styles.froot}`}>
        <span className={styles.logo}>P<span className={styles.bang}>!</span>N<span className={styles.bang}>.</span></span>
        <span className={styles.tag}>Өдрийн чухлыг хадлаа.</span>
        <div className={styles.soc}>
          <a href="#">Instagram</a><a href="#">Facebook</a><a href="#">Холбоо</a>
        </div>
      </div>
    </footer>
  );
}
