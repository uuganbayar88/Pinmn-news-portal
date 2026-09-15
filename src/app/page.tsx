import Link from 'next/link';
import { getArticles, getDigest } from '@/lib/content';
import { categoryLabel, dateLabel } from '@/lib/schema';
import { ArticleCard, ArticleMeta, ArticleVisual } from '@/components/article-card';
import { Newsletter } from '@/components/newsletter';
import { Icon } from '@/components/icon';
export const revalidate = 60;
export const metadata = { alternates: { canonical: '/' } };
export default async function Home() {
  const [articles, digest] = await Promise.all([getArticles(), getDigest()]);
  const featured = articles.find((a) => a.id === digest.articleIds[0]) ?? articles[0];
  if (!featured)
    return (
      <div className="empty-state">
        <h1>Мэдээ удахгүй нэмэгдэнэ.</h1>
      </div>
    );
  const editorialRank = (id: string) => {
    const index = digest.articleIds.indexOf(id);
    return index < 0 ? Number.MAX_SAFE_INTEGER : index;
  };
  const rest = articles
    .filter((a) => a.id !== featured.id)
    .sort((a, b) => editorialRank(a.id) - editorialRank(b.id));
  const culture = rest.find((a) => a.category === 'culture');
  const cards = rest.filter((a) => a.id !== culture?.id).slice(0, 2);
  const briefs = rest.filter((a) => !cards.includes(a) && a.id !== culture?.id);
  return (
    <>
      <div className="edition-line">
        <span>
          <span className="coral-dot" /> РЕДАКЦЫН СОНГОЛТ
        </span>
        <Link href="/daily">
          {dateLabel(digest.date)} · Өдрийн тойм <Icon name="arrow" size={16} />
        </Link>
      </div>
      <section className="hero">
        <div className="hero-copy">
          <span className="eyebrow">{categoryLabel(featured.category)}</span>
          <h1>
            <Link href={'/news/' + featured.slug}>{featured.title}</Link>
          </h1>
          <p>{featured.excerpt}</p>
          <ArticleMeta article={featured} />
          <Link className="text-link" href={'/news/' + featured.slug}>
            Голыг нь ойлгох <Icon name="arrow" />
          </Link>
        </div>
        <Link
          className="hero-image-link"
          href={'/news/' + featured.slug}
          aria-label={featured.title}
        >
          <ArticleVisual article={featured} priority />
        </Link>
      </section>
      <section className="key-points-strip" aria-label="Гол санаа">
        <span className="eyebrow strip-label">PIN ТАЙЛБАРЛАВ</span>
        <div>
          {featured.keyPoints.map((point, i) => (
            <div className="key-point" key={point}>
              <span className="point-number">0{i + 1}</span>
              <div>
                <h2>{['Юу болов?', 'Яагаад чухал вэ?', 'Цаашид яах вэ?', 'Нэмж мэдэхэд'][i]}</h2>
                <p>{point}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
      <div className="section-heading">
        <h2>
          Анхааралдаа авах мэдээ<span>.</span>
        </h2>
        <Link className="text-link" href="/search">
          Бүх мэдээ <Icon name="arrow" />
        </Link>
      </div>
      <section className="news-layout">
        <div className="card-grid">
          {cards.map((a) => (
            <ArticleCard key={a.id} article={a} />
          ))}
        </div>
        <aside className="briefs">
          <span className="eyebrow">ТОВЧХОН / QUICK READ</span>
          {briefs.map((a, i) => (
            <article key={a.id}>
              <span className="brief-number">0{i + 1}</span>
              <div>
                <span className="eyebrow">{categoryLabel(a.category)}</span>
                <h3>
                  <Link href={'/news/' + a.slug}>{a.title}</Link>
                </h3>
                <ArticleMeta article={a} />
              </div>
            </article>
          ))}
          <Link className="text-link" href="/daily">
            7 мэдээ, нэг тойм <Icon name="arrow" />
          </Link>
        </aside>
      </section>
      {culture && (
        <section className="culture-feature">
          <Link href={'/news/' + culture.slug} tabIndex={-1} aria-hidden="true">
            <ArticleVisual article={culture} />
          </Link>
          <div>
            <span className="eyebrow">СОЁЛ / ӨӨР ӨНЦӨГ</span>
            <h2>
              <Link href={'/news/' + culture.slug}>{culture.title}</Link>
            </h2>
            <p>{culture.excerpt}</p>
            <ArticleMeta article={culture} />
            <Link className="text-link" href={'/news/' + culture.slug}>
              Цааш унших <Icon name="arrow" />
            </Link>
          </div>
        </section>
      )}
      <Newsletter />
      <div className="section-heading">
        <h2>
          Уншаад хуваалц<span>.</span>
        </h2>
        <span className="muted">Мэдэхэд илүүдэхгүй</span>
      </div>
      <section className="quick-list">
        {rest.slice(0, 3).map((a) => (
          <ArticleCard key={a.id} article={a} compact />
        ))}
      </section>
      <div className="closing-banner">
        <h2>Чухлыг нь хамтдаа.</h2>
        <p>Уншаад ойлго. Ойлгоод хуваалц.</p>
        <Link href="/daily">
          Өнөөдрийн пин <Icon name="arrow" />
        </Link>
      </div>
    </>
  );
}
