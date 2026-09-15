import type { MetadataRoute } from 'next';
import { isFixtureMode, siteUrl } from '@/lib/content';
export default function robots(): MetadataRoute.Robots {
  return process.env.ALLOW_INDEXING === 'true' && !isFixtureMode()
    ? {
        rules: {
          userAgent: '*',
          allow: '/',
          disallow: ['/search', '/login', '/register', '/forgot-password', '/saved'],
        },
        sitemap: siteUrl('/sitemap.xml'),
      }
    : { rules: { userAgent: '*', disallow: '/' } };
}
