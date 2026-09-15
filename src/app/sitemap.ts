import type { MetadataRoute } from 'next';
import { getArticles, isFixtureMode, siteUrl } from '@/lib/content';
import { categories } from '@/lib/schema';
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  if (isFixtureMode() || process.env.ALLOW_INDEXING !== 'true') return [];
  return [
    { url: siteUrl(), changeFrequency: 'hourly', priority: 1 },
    { url: siteUrl('/daily'), changeFrequency: 'daily', priority: 0.9 },
    ...categories.map((c) => ({ url: siteUrl('/category/' + c.slug) })),
    ...(await getArticles()).map((a) => ({
      url: siteUrl('/news/' + a.slug),
      lastModified: a.publishedAt,
    })),
  ];
}
