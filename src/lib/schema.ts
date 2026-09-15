import { z } from 'zod';
export { categories, categoryLabel, dateLabel } from './taxonomy';
export const safeUrl = z
  .string()
  .url()
  .refine((value) => {
    try {
      return ['https:', 'http:'].includes(new URL(value).protocol);
    } catch {
      return false;
    }
  }, 'HTTP(S) URL required');
export const articleSchema = z.object({
  id: z.string().min(1),
  slug: z.string().regex(/^[a-z0-9-]+$/),
  title: z.string().min(1),
  excerpt: z.string(),
  category: z.enum(['society', 'economy', 'technology', 'culture', 'world']),
  publishedAt: z.iso.datetime(),
  source: z.object({ name: z.string(), url: safeUrl }),
  keyPoints: z.array(z.string().max(110)).min(2).max(4),
  body: z.array(z.string()).min(1),
  image: z
    .object({
      src: z
        .string()
        .refine((s) => /^\/images\/[a-zA-Z0-9./_-]+$/.test(s) || safeUrl.safeParse(s).success),
      alt: z.string(),
      credit: z.string(),
    })
    .optional(),
  visual: z.enum(['library', 'culture', 'world', 'science', 'partnership']).optional(),
  readingMinutes: z.number().int().positive(),
  socialImage: safeUrl.optional(),
});
export const articleListSchema = z.object({
  articles: z.array(articleSchema),
  total: z.number().int().nonnegative(),
});
export const digestSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  articleIds: z.array(z.string()).min(7).max(10),
});
export type Article = z.infer<typeof articleSchema>;
export type Digest = z.infer<typeof digestSchema>;
export type ArticleQuery = { q?: string; category?: string; sort?: 'latest' | 'oldest' };
export function filterArticles(articles: Article[], query: ArticleQuery) {
  const normalized = (query.q ?? '').trim().normalize('NFC').toLocaleLowerCase('mn');
  return articles
    .filter(
      (a) =>
        (!query.category || a.category === query.category) &&
        (!normalized ||
          [a.title, a.excerpt, ...a.body, a.source.name]
            .join(' ')
            .normalize('NFC')
            .toLocaleLowerCase('mn')
            .includes(normalized)),
    )
    .sort((a, b) =>
      query.sort === 'oldest'
        ? a.publishedAt.localeCompare(b.publishedAt)
        : b.publishedAt.localeCompare(a.publishedAt),
    );
}
