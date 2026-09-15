import Link from 'next/link';
import { Icon } from './icon';
import { MobileNavigation, Navigation } from './navigation';
export function Logo() {
  return (
    <span className="logo">
      pin<span>.</span>mn
    </span>
  );
}
export function Header({ sample }: { sample: boolean }) {
  return (
    <>
      <a className="skip-link" href="#main">
        Үндсэн агуулга руу
      </a>
      <div className="utility">
        <div className="container utility-inner">
          <span>{sample ? '2026.09.14 · Жишээ дугаар' : 'Өдөр бүрийн чухал мэдээ'}</span>
          <span>
            Олон мэдээнээс, <strong>чухлыг нь.</strong>
          </span>
          <Link href="/newsletter">
            Өглөөний тойм <Icon name="arrow" size={14} />
          </Link>
        </div>
      </div>
      <header className="site-header container">
        <div className="masthead">
          <Link href="/" aria-label="pin.mn — Нүүр">
            <Logo />
          </Link>
          <p>
            Мэдээлэлтэй.
            <br />
            Нэг алхам урагш.
          </p>
          <div className="header-actions">
            <Link className="icon-button" href="/search" aria-label="Мэдээ хайх">
              <Icon name="search" size={23} />
            </Link>
            <Link className="icon-button desktop-only" href="/saved" aria-label="Хадгалсан мэдээ">
              <Icon name="bookmark" size={23} />
            </Link>
            <Link className="login-link" href="/login">
              <Icon name="user" size={18} />
              <span>Нэвтрэх</span>
            </Link>
          </div>
        </div>
        <Navigation />
      </header>
      <MobileNavigation />
    </>
  );
}
export function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-top">
        <div>
          <Link href="/" aria-label="Нүүр">
            <Logo />
          </Link>
          <p>Олон мэдээнээс, чухлыг нь.</p>
        </div>
        <div className="footer-links">
          <Link href="/about">Бидний тухай</Link>
          <Link href="/editorial">Редакцын зарчим</Link>
          <Link href="/privacy">Нууцлал</Link>
          <a href="/rss.xml">RSS</a>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>© 2026 pin.mn</span>
        <span>Уншаад ойлго. Ойлгоод хуваалц.</span>
      </div>
    </footer>
  );
}
