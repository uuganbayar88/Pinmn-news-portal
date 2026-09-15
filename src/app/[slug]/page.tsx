import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import { getAllArticles, getArticle } from '@/lib/content/accessors';
import { buildArticleMetadata } from '@/lib/metadata';
import { siteUrl } from '@/lib/content';
import { SaveButton, ShareActions } from '@/components/reader-actions';

// Preserve pre-existing shared article URLs after the homepage migration.
export function generateStaticParams() {
  return getAllArticles().map((a) => ({ slug: a.slug }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const a = getArticle((await params).slug);
  if (!a) notFound();
  const original = buildArticleMetadata(a);
  return {
    ...original,
    title: a.title,
    alternates: { canonical: siteUrl('/' + a.slug) },
    openGraph: { ...original.openGraph, url: siteUrl('/' + a.slug) },
    robots: { index: false, follow: false },
  };
}
export default async function LegacyArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const a = getArticle((await params).slug);
  if (!a) notFound();
  return (
    <article className="article-detail narrow-page">
      <nav className="breadcrumb" aria-label="Хуудасны зам">
        <Link href="/">Нүүр</Link>
        <span>/</span>
        <span>{a.category.name}</span>
      </nav>
      <div className="info-note">Өмнөх загварын жишээ нийтлэл · {a.publishedAt.slice(0, 10)}</div>
      <span className="eyebrow">{a.category.name}</span>
      <h1>{a.title}</h1>
      <p className="article-deck">{a.lead}</p>
      <div className="article-meta">
        <span>{a.author.name}</span>
        <time dateTime={a.publishedAt}>{a.publishedAt.slice(0, 10)}</time>
        <span>· {a.readMinutes} мин</span>
      </div>
      {a.sponsored && (
        <div className="info-note">
          <strong>{a.sponsored.partner}</strong>
          <p>{a.sponsored.disclosure}</p>
        </div>
      )}
      <div className="article-actions">
        <ShareActions title={a.title} url={siteUrl('/' + a.slug)} />
        <SaveButton id={'legacy:' + a.slug} />
      </div>
      {a.image && (
        <div className="article-visual photo">
          <Image
            src={a.image.src}
            alt={a.image.alt}
            fill
            priority
            sizes="(max-width: 800px) 100vw, 800px"
          />
          <span className="image-credit">{a.image.credit}</span>
        </div>
      )}
      {a.heroCaption && <p className="small muted">{a.heroCaption}</p>}
      <section className="article-summary">
        <span className="eyebrow">ГОЛ САНАА</span>
        <ol>
          {a.keyPoints.map((p) => (
            <li key={p}>{p}</li>
          ))}
        </ol>
      </section>
      <div className="article-body">
        {a.body.map((b, i) => {
          if (b.type === 'quote')
            return (
              <blockquote key={i}>
                <p>{b.text}</p>
                <cite>{b.attribution}</cite>
              </blockquote>
            );
          if (b.type === 'video')
            return (
              <section key={i}>
                <h2>{b.label}</h2>
                <p>
                  {b.title} · {b.duration}
                </p>
                <p>{b.caption}</p>
                <p className="info-note">
                  Өмнөх загварын видео хэсэг. Тоглуулах бичлэг холбогдоогүй.
                </p>
              </section>
            );
          return (
            <section key={i}>
              <h2>{b.label}</h2>
              {b.paragraphs.map((p) => (
                <p key={p}>{p}</p>
              ))}
              {b.type === 'whatHappened' && b.bullets && (
                <ul>
                  {b.bullets.map((x) => (
                    <li key={x}>{x}</li>
                  ))}
                </ul>
              )}
            </section>
          );
        })}
      </div>
      <Link className="button" href="/">
        Шинэ тоймыг унших →
      </Link>
    </article>
  );
}
