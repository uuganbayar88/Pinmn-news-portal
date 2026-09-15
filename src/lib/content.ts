import 'server-only';
import { cache } from 'react';
import { z } from 'zod';
import {
  articleListSchema,
  articleSchema,
  digestSchema,
  filterArticles,
  type ArticleQuery,
} from './schema';
export function isFixtureMode() {
  const mode = process.env.CONTENT_SOURCE ?? 'fixtures';
  if (mode !== 'fixtures' && mode !== 'api')
    throw new Error('CONTENT_SOURCE must be fixtures or api');
  return mode === 'fixtures';
}
async function api<T>(path: string, schema: z.ZodType<T>): Promise<T | null> {
  const base = process.env.CONTENT_API_URL;
  if (!base) throw new Error('CONTENT_API_URL is required in api mode');
  const url = new URL(path, base);
  if (!['http:', 'https:'].includes(url.protocol)) throw new Error('Invalid API protocol');
  const response = await fetch(url, {
    next: { revalidate: 60, tags: ['content'] },
    signal: AbortSignal.timeout(8000),
  });
  if (response.status === 404) return null;
  if (!response.ok) throw new Error('Content API failed (' + response.status + ')');
  return schema.parse(await response.json());
}
export const getArticles = cache(async (query: ArticleQuery = {}) => {
  if (isFixtureMode()) return filterArticles((await import('./fixtures')).fixtureArticles, query);
  const params = new URLSearchParams();
  if (query.q) params.set('q', query.q);
  if (query.category) params.set('category', query.category);
  params.set('sort', query.sort ?? 'latest');
  const result = await api('/api/v1/articles?' + params, articleListSchema);
  if (!result) throw new Error('Articles API endpoint not found');
  return result.articles;
});
export const getArticle = cache(async (slug: string) => {
  if (isFixtureMode())
    return (await import('./fixtures')).fixtureArticles.find((a) => a.slug === slug) ?? null;
  return api('/api/v1/articles/' + encodeURIComponent(slug), articleSchema);
});
export const getDigest = cache(async () => {
  if (isFixtureMode()) return (await import('./fixtures')).fixtureDigest;
  const digest = await api('/api/v1/digests/latest', digestSchema);
  if (!digest) throw new Error('Daily digest is unavailable');
  return digest;
});
export function siteUrl(path = '/') {
  return new URL(
    path,
    process.env.NEXT_PUBLIC_SITE_URL ??
      (process.env.VERCEL_ENV === 'production'
        ? 'https://pinmn.vercel.app'
        : process.env.VERCEL_URL
          ? 'https://' + process.env.VERCEL_URL
          : 'http://localhost:3000'),
  ).toString();
}
