import Link from 'next/link';
import Image from 'next/image';
import { type Article, categoryLabel, dateLabel } from '@/lib/schema';
import { Icon } from './icon';
export function ArticleVisual({
  article,
  priority = false,
}: {
  article: Article;
  priority?: boolean;
}) {
  if (article.image)
    return (
      <div className="article-visual photo">
        <Image
          src={article.image.src}
          alt={article.image.alt}
          fill
          sizes="(max-width: 700px) 100vw, (max-width: 1100px) 65vw, 760px"
          priority={priority}
          unoptimized={!article.image.src.startsWith('/')}
        />
        <span className="image-credit">Зураг: {article.image.credit}</span>
      </div>
    );
  return (
    <div
      className={'article-visual editorial-art art-' + (article.visual ?? 'library')}
      aria-label="Редакцын тайлбар дүрслэл"
      role="img"
    >
      <span className="art-top">PIN / {categoryLabel(article.category)}</span>
      <span className="art-symbol" aria-hidden="true">
        {article.visual === 'culture'
          ? '∞'
          : article.visual === 'world'
            ? '◎'
            : article.visual === 'science'
              ? '✳'
              : article.visual === 'partnership'
                ? '↔'
                : 'Aa'}
      </span>
      <span className="art-caption">
        {article.visual === 'culture'
          ? 'Хил давсан\nхолбоосууд.'
          : article.visual === 'science'
            ? 'Турш.\nНээ. Суралц.'
            : article.visual === 'world'
              ? 'Дэлхий\nойртож байна.'
              : article.visual === 'partnership'
                ? 'Хамтдаа\nурагш.'
                : 'Илүү их мэдлэг.\nИлүү сайн ирээдүй.'}
      </span>
      <span className="image-credit">Тайлбар дүрслэл</span>
    </div>
  );
}
export function ArticleMeta({ article }: { article: Article }) {
  return (
    <div className="article-meta">
      <span>{article.source.name}</span>
      <span aria-hidden="true">·</span>
      <time dateTime={article.publishedAt}>{dateLabel(article.publishedAt)}</time>
      <span className="read-time">· {article.readingMinutes} мин</span>
    </div>
  );
}
export function ArticleCard({ article, compact = false }: { article: Article; compact?: boolean }) {
  return (
    <article className={compact ? 'article-card compact-card' : 'article-card'}>
      <Link href={'/news/' + article.slug} tabIndex={-1} aria-hidden="true">
        <ArticleVisual article={article} />
      </Link>
      <div className="card-copy">
        <span className="eyebrow">{categoryLabel(article.category)}</span>
        <h3>
          <Link href={'/news/' + article.slug}>{article.title}</Link>
        </h3>
        {!compact && <p>{article.excerpt}</p>}
        <ArticleMeta article={article} />
      </div>
      {compact && (
        <Link
          className="row-arrow"
          href={'/news/' + article.slug}
          aria-label={article.title + ' — унших'}
        >
          <Icon name="arrow" />
        </Link>
      )}
    </article>
  );
}
