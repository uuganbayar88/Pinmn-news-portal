import { notFound } from 'next/navigation';
import { categories } from '@/lib/schema';
import { getArticles } from '@/lib/content';
import { ArticleCard } from '@/components/article-card';
import { Newsletter } from '@/components/newsletter';
type Props = { params: Promise<{ slug: string }> };
export const revalidate = 60;
export function generateStaticParams() {
  return categories.map((c) => ({ slug: c.slug }));
}
export async function generateMetadata({ params }: Props) {
  const slug = (await params).slug;
  return {
    title: categories.find((c) => c.slug === slug)?.label ?? 'Ангилал',
    alternates: { canonical: '/category/' + slug },
  };
}
export default async function CategoryPage({ params }: Props) {
  const slug = (await params).slug;
  const current = categories.find((c) => c.slug === slug);
  if (!current) notFound();
  const articles = await getArticles({ category: slug });
  return (
    <>
      <header className="page-heading">
        <span className="eyebrow">МЭДЭЭНИЙ АНГИЛАЛ</span>
        <h1>
          {current.label}
          <span>.</span>
        </h1>
        <p>Чухал үйл явдал. Ойлгомжтой тайлбар. Баталгаатай эх сурвалж.</p>
      </header>
      <div className="results-count">{articles.length} мэдээ · Сүүлд нийтэлснээр</div>
      <section className="category-grid">
        {articles.map((a) => (
          <ArticleCard article={a} key={a.id} />
        ))}
      </section>
      {!articles.length && (
        <div className="empty-state">
          <h2>Энэ ангилалд мэдээ хараахан нэмэгдээгүй байна.</h2>
        </div>
      )}
      <Newsletter />
    </>
  );
}
