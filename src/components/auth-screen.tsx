import Link from 'next/link';
import { Logo } from './shell';
import { Icon } from './icon';
export function AuthScreen({ mode }: { mode: 'login' | 'register' | 'forgot' }) {
  const title =
    mode === 'login'
      ? 'Эргээд тавтай морил.'
      : mode === 'register'
        ? 'Чухал мэдээтэй ойр бай.'
        : 'Нууц үгээ сэргээх';
  return (
    <div className="auth-layout">
      <section className="auth-intro">
        <Logo />
        <h2>
          Таны цаг үнэтэй.
          <br />
          Чухлыг нь
          <br />
          <em>бид сонгоё.</em>
        </h2>
        <p>
          Эх сурвалжтай мэдээ.
          <br />
          Ойлгомжтой тайлбар.
          <br />
          Өдөр бүрийн шинэ өнцөг.
        </p>
        <span className="auth-orbit" aria-hidden="true">
          ◎
        </span>
      </section>
      <section className="auth-panel">
        <span className="eyebrow">
          {mode === 'login' ? 'НЭВТРЭХ' : mode === 'register' ? 'БҮРТГҮҮЛЭХ' : 'НУУЦ ҮГ СЭРГЭЭХ'}
        </span>
        <h1>{title}</h1>
        <p className="muted">Мэдээ уншихад бүртгэл шаардлагагүй.</p>
        <div className="info-note">
          <strong>Тун удахгүй</strong>
          <p>
            Бүртгэл, нэвтрэх үйлчилгээ хараахан нээгдээгүй байна. Одоогоор мэдээг чөлөөтэй уншиж,
            энэ хөтөч дээр хадгалах боломжтой.
          </p>
        </div>
        <fieldset disabled aria-label="Нэвтрэх үйлчилгээ хараахан нээгдээгүй">
          <legend className="sr-only">Бүртгэлийн маягтын загвар</legend>
          {mode !== 'forgot' && (
            <>
              <button className="social-auth" type="button">
                <strong>G</strong> Google-ээр үргэлжлүүлэх
              </button>
              <button className="social-auth" type="button">
                <strong className="facebook-letter">f</strong> Facebook-ээр үргэлжлүүлэх
              </button>
              <div className="form-divider">
                <span>эсвэл имэйлээр</span>
              </div>
            </>
          )}
          {mode === 'register' && (
            <label>
              Таны нэр
              <input autoComplete="name" placeholder="Нэр" />
            </label>
          )}
          <label>
            Имэйл хаяг
            <input type="email" autoComplete="email" placeholder="name@example.com" />
          </label>
          {mode !== 'forgot' && (
            <label>
              Нууц үг
              <input
                type="password"
                autoComplete={mode === 'register' ? 'new-password' : 'current-password'}
                placeholder="••••••••••••"
              />
            </label>
          )}
          <button className="button full-width" type="button">
            {mode === 'login'
              ? 'Нэвтрэх'
              : mode === 'register'
                ? 'Бүртгүүлэх'
                : 'Сэргээх холбоос авах'}
          </button>
        </fieldset>
        <div className="auth-links">
          {mode === 'login' ? (
            <>
              <Link href="/forgot-password">Нууц үгээ мартсан уу?</Link>
              <Link href="/register">Бүртгүүлэх →</Link>
            </>
          ) : (
            <Link href="/login">← Нэвтрэх хуудас</Link>
          )}
        </div>
        <Link className="guest-link" href="/">
          Зочноор мэдээ унших <Icon name="arrow" size={18} />
        </Link>
      </section>
    </div>
  );
}
