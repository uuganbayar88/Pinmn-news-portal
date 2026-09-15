import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getArticle, getArticles, siteUrl } from '@/lib/content';
import { categoryLabel } from '@/lib/schema';
import { ArticleCard, ArticleMeta, ArticleVisual } from '@/components/article-card';
import { SaveButton, ShareActions } from '@/components/reader-actions';
import { Newsletter } from '@/components/newsletter';
export const revalidate = 60;
type Props = { params: Promise<{ slug: string }> };
export async function generateStaticParams() {
  return (await getArticles()).map((a) => ({ slug: a.slug }));
}
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const article = await getArticle((await params).slug);
  if (!article) notFound();
  const images = [
    {
      url: article.socialImage ?? siteUrl('/news/' + article.slug + '/opengraph-image'),
      width: 1200,
      height: 630,
      alt: article.title,
    },
  ];
  return {
    title: article.title,
    description: article.excerpt,
    alternates: { canonical: '/news/' + article.slug },
    openGraph: {
      type: 'article',
      title: article.title,
      description: article.excerpt,
      url: '/news/' + article.slug,
      publishedTime: article.publishedAt,
      section: categoryLabel(article.category),
      images,
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.excerpt,
      images,
    },
  };
}
export default async function ArticlePage({ params }: Props) {
  const a = await getArticle((await params).slug);
  if (!a) notFound();
  const related = (await getArticles())
    .filter((b) => b.id !== a.id)
    .sort((b, c) => Number(c.category === a.category) - Number(b.category === a.category))
    .slice(0, 2);
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: a.title,
    description: a.excerpt,
    datePublished: a.publishedAt,
    inLanguage: 'mn',
    mainEntityOfPage: siteUrl('/news/' + a.slug),
    image: a.image ? [siteUrl(a.image.src)] : [siteUrl('/news/' + a.slug + '/opengraph-image')],
    author: { '@type': 'Organization', name: 'pin.mn', url: siteUrl('/about') },
    publisher: { '@type': 'Organization', name: 'pin.mn', url: siteUrl() },
    citation: a.source.url,
  };
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replaceAll('<', '\\u003c') }}
      />
      <nav className="breadcrumb" aria-label="Хуудасны зам">
        <Link href="/">Нүүр</Link>
        <span>/</span>
        <Link href={'/category/' + a.category}>{categoryLabel(a.category)}</Link>
      </nav>
      <div className="article-layout">
        <article className="article-detail">
          <header>
            <span className="eyebrow">{categoryLabel(a.category)}</span>
            <h1>{a.title}</h1>
            <p className="article-deck">{a.excerpt}</p>
            <ArticleMeta article={a} />
          </header>
          <div className="article-actions">
            <ShareActions title={a.title} url={siteUrl('/news/' + a.slug)} />
            <SaveButton id={a.id} />
          </div>
          <ArticleVisual article={a} priority />
          <section className="article-summary" id="summary">
            <span className="eyebrow">НЭГ МИНУТАД</span>
            <h2>Голыг нь ойлгоё.</h2>
            <ol>
              {a.keyPoints.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ol>
          </section>
          <section className="article-body" id="detail">
            <h2>Дэлгэрүүлж унших</h2>
            {a.body.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </section>
          <div className="source-box" id="source">
            <span className="eyebrow">ЭХ СУРВАЛЖ</span>
            <p>Энэ мэдээг эх сурвалжид тулгуурлан товчлон хүргэв.</p>
            <a href={a.source.url} target="_blank" rel="noopener noreferrer">
              {a.source.name} →
            </a>
          </div>
          <div className="article-end">
            <span className="logo small-logo">
              pin<span>.</span>
            </span>
            <p>
              Ойлгомжтой болсон бол
              <br />
              <strong>бусадтай хуваалцаарай.</strong>
            </p>
          </div>
        </article>
        <aside className="article-sidebar">
          <div className="sticky-sidebar">
            <div className="contents">
              <span className="eyebrow">ЭНЭ МЭДЭЭНД</span>
              <a href="#summary">01 &nbsp; Гол санаа</a>
              <a href="#detail">02 &nbsp; Дэлгэрэнгүй</a>
              <a href="#source">03 &nbsp; Эх сурвалж</a>
            </div>
            <Newsletter compact />
          </div>
        </aside>
      </div>
      <div className="section-heading">
        <h2>
          Үргэлжлүүлээд унших<span>.</span>
        </h2>
      </div>
      <section className="related-grid">
        {related.map((a) => (
          <ArticleCard article={a} key={a.id} />
        ))}
      </section>
    </>
  );
}
