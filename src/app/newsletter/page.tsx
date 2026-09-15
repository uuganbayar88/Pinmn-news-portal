import Link from 'next/link';
import { getArticles, getDigest } from '@/lib/content';
import { Icon } from '@/components/icon';
export const metadata = { title: 'Өглөөний тойм' };
export default async function NewsletterPage() {
  const [digest, articles] = await Promise.all([getDigest(), getArticles()]);
  return (
    <div className="newsletter-page">
      <div className="newsletter-pitch">
        <span className="newsletter-icon">
          <Icon name="sun" size={34} />
        </span>
        <span className="eyebrow">PIN / ӨГЛӨӨНИЙ ТОЙМ</span>
        <h1>
          Өглөөг
          <br />
          мэдээлэлтэй
          <br />
          <em>эхлүүл.</em>
        </h1>
        <p>
          Өдрийн чухал 7–10 мэдээ.
          <br />
          Товч, ойлгомжтой, таны имэйлд.
        </p>
        <div className="info-note">
          <strong>Имэйл тойм тун удахгүй</strong>
          <p>Захиалга хараахан нээгдээгүй байна. Тэр хүртэл өдрийн тоймыг сайтаас уншаарай.</p>
        </div>
        <Link className="button" href="/daily">
          Өдрийн тоймыг унших <Icon name="arrow" />
        </Link>
        <p className="small muted">Бүртгэл шаардахгүй. Чухал мэдээг бүү алдаарай.</p>
      </div>
      <div className="email-preview">
        <span className="eyebrow">ТОЙМЫН ЖИШЭЭ</span>
        <div className="email-masthead">
          <span className="logo">
            pin<span>.</span>mn
          </span>
          <span>{digest.date.replaceAll('-', '.')}</span>
        </div>
        <h2>Өглөөний мэнд!</h2>
        <p>Өнөөдрийн чухлыг хамтдаа.</p>
        {digest.articleIds.slice(0, 3).map((id, i) => {
          const a = articles.find((x) => x.id === id);
          return (
            a && (
              <article key={id}>
                <span className="eyebrow">0{i + 1}</span>
                <h3>{a.title}</h3>
                <p>{a.keyPoints[0]}</p>
              </article>
            )
          );
        })}
        <Link className="text-link" href="/daily">
          Тоймыг бүтнээр нь унших <Icon name="arrow" />
        </Link>
      </div>
    </div>
  );
}
