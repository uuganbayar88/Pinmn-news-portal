import Link from 'next/link';
import { getArticles } from '@/lib/content';
import { categories } from '@/lib/schema';
import { ArticleCard } from '@/components/article-card';
import { Icon } from '@/components/icon';
export const metadata = { title: 'Мэдээ хайх', robots: { index: false, follow: true } };
type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };
export default async function SearchPage({ searchParams }: Props) {
  const params = await searchParams;
  const q = typeof params.q === 'string' ? params.q.trim().slice(0, 120) : '';
  const category =
    typeof params.category === 'string' && categories.some((c) => c.slug === params.category)
      ? params.category
      : '';
  const sort = params.sort === 'oldest' ? 'oldest' : 'latest';
  const articles = await getArticles({ q, category, sort });
  return (
    <div className="search-page">
      <header className="page-heading">
        <span className="eyebrow">ХАЙЛТ</span>
        <h1>
          Юуг мэдмээр байна<span>?</span>
        </h1>
      </header>
      <form action="/search" className="search-form">
        <label htmlFor="query" className="sr-only">
          Хайх үг
        </label>
        <div className="search-input">
          <Icon name="search" size={24} />
          <input
            id="query"
            type="search"
            name="q"
            placeholder="Мэдээ, сэдэв, түлхүүр үг…"
            maxLength={120}
            defaultValue={q}
          />
          <button className="button" type="submit">
            Хайх
          </button>
        </div>
        <div className="search-filters">
          <label>
            Ангилал
            <select name="category" defaultValue={category}>
              <option value="">Бүх ангилал</option>
              {categories.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.label}
                </option>
              ))}
            </select>
          </label>
          <label>
            Эрэмбэ
            <select name="sort" defaultValue={sort}>
              <option value="latest">Шинэ нь эхэндээ</option>
              <option value="oldest">Хуучин нь эхэндээ</option>
            </select>
          </label>
          <button className="filter-button" type="submit">
            Шүүх
          </button>
          <Link href="/search">Цэвэрлэх</Link>
        </div>
      </form>
      <div className="results-count" role="status">
        {q ? '“' + q + '” — ' : ''}
        {articles.length} мэдээ олдлоо
      </div>
      <section className="search-results">
        {articles.map((a) => (
          <ArticleCard article={a} key={a.id} compact />
        ))}
      </section>
      {!articles.length && (
        <div className="empty-state">
          <Icon name="search" size={36} />
          <h2>Илэрц олдсонгүй.</h2>
          <p>Өөр түлхүүр үгээр хайх эсвэл ангиллын шүүлтүүрээ арилгаарай.</p>
          <Link className="button button-outline" href="/search">
            Бүх мэдээг үзэх
          </Link>
        </div>
      )}
    </div>
  );
}
