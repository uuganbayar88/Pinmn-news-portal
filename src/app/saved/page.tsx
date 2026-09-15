import { getArticles } from '@/lib/content';
import { SavedList } from '@/components/reader-actions';
import { getAllArticles } from '@/lib/content/accessors';
export const metadata = { title: 'Хадгалсан мэдээ', robots: { index: false, follow: false } };
export default async function SavedPage() {
  return (
    <div className="narrow-page">
      <header className="page-heading">
        <span className="eyebrow">ТАНЫ УНШИХ ЖАГСААЛТ</span>
        <h1>
          Хадгалсан мэдээ<span>.</span>
        </h1>
        <p>Энэ хөтөч дээр хадгалагдана. Нэвтрэх шаардлагагүй.</p>
      </header>
      <SavedList
        articles={[
          ...(await getArticles()),
          ...getAllArticles().map((a) => ({
            id: 'legacy:' + a.slug,
            slug: a.slug,
            href: '/' + a.slug,
            title: a.title,
            publishedAt: a.publishedAt,
            source: { name: a.author.name + ' · Өмнөх загвар' },
          })),
        ]}
      />
    </div>
  );
}
