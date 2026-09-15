import Link from 'next/link';
import { getArticles, getDigest, isFixtureMode } from '@/lib/content';
import { categoryLabel, dateLabel } from '@/lib/schema';
import { Newsletter } from '@/components/newsletter';
import { ArticleMeta } from '@/components/article-card';
import { Icon } from '@/components/icon';
export const metadata = { title: 'Өнөөдрийн пин', alternates: { canonical: '/daily' } };
export const revalidate = 60;
export default async function DailyPage() {
  const [digest, articles] = await Promise.all([getDigest(), getArticles()]);
  const ordered = digest.articleIds.map((id) => articles.find((a) => a.id === id));
  if (ordered.some((a) => !a)) throw new Error('Digest references missing articles');
  return (
    <>
      <header className="daily-heading">
        <span className="eyebrow">
          <Icon name="sun" size={18} /> ӨДӨР ТУТМЫН ТОЙМ
        </span>
        <h1>
          Өнөөдрийн пин<span>.</span>
        </h1>
        <p>Олон мэдээнээс, өнөөдөр мэдэх ёстой {ordered.length} зүйл.</p>
        <div className="daily-date">
          {dateLabel(digest.date)} {isFixtureMode() && '· Жишээ дугаар'}
          <span>{ordered.length} мэдээ</span>
        </div>
      </header>
      <div className="article-layout">
        <section className="digest-list">
          {ordered.map(
            (a, i) =>
              a && (
                <article className="digest-item" key={a.id}>
                  <span className="digest-number">{String(i + 1).padStart(2, '0')}</span>
                  <div>
                    <span className="eyebrow">{categoryLabel(a.category)}</span>
                    <h2>
                      <Link href={'/news/' + a.slug}>{a.title}</Link>
                    </h2>
                    <p>{a.excerpt}</p>
                    <ArticleMeta article={a} />
                    <Link className="text-link" href={'/news/' + a.slug}>
                      Дэлгэрүүлж унших <Icon name="arrow" size={17} />
                    </Link>
                  </div>
                </article>
              ),
          )}
          <div className="digest-end">
            <Icon name="check" size={28} />
            <h2>Өдрийн чухлыг мэдэж авлаа.</h2>
            <p>Маргааш дахин уулзацгаая.</p>
          </div>
        </section>
        <aside className="article-sidebar">
          <div className="sticky-sidebar">
            <Newsletter compact />
          </div>
        </aside>
      </div>
    </>
  );
}
