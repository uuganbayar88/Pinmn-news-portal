import Link from 'next/link';
import { Icon } from './icon';
export function Newsletter({ compact = false }: { compact?: boolean }) {
  return (
    <aside className={'newsletter ' + (compact ? 'newsletter-compact' : '')}>
      <span className="newsletter-icon">
        <Icon name="sun" size={28} />
      </span>
      <div>
        <span className="eyebrow">ӨГЛӨӨНИЙ ТОЙМ</span>
        <h2>Өглөөг мэдээлэлтэй эхлүүл.</h2>
        <p>
          Өдрийн чухал 7–10 мэдээ.
          <br />
          Товч, ойлгомжтой, таны имэйлд.
        </p>
      </div>
      <Link href="/newsletter" className="button">
        Тоймтой танилцах <Icon name="arrow" />
      </Link>
    </aside>
  );
}
