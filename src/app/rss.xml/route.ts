import { getArticles, siteUrl } from '@/lib/content';
export const revalidate = 60;
function xml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}
export async function GET() {
  const articles = await getArticles();
  const items = articles
    .map(
      (a) =>
        '<item><title>' +
        xml(a.title) +
        '</title><link>' +
        xml(siteUrl('/news/' + a.slug)) +
        '</link><guid isPermaLink="true">' +
        xml(siteUrl('/news/' + a.slug)) +
        '</guid><description>' +
        xml(a.excerpt) +
        '</description><pubDate>' +
        new Date(a.publishedAt).toUTCString() +
        '</pubDate></item>',
    )
    .join('');
  return new Response(
    '<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>pin.mn</title><link>' +
      xml(siteUrl()) +
      '</link><description>Олон мэдээнээс, чухлыг нь.</description><language>mn</language>' +
      items +
      '</channel></rss>',
    {
      headers: {
        'Content-Type': 'application/rss+xml; charset=utf-8',
        'Cache-Control': 'public, max-age=60',
      },
    },
  );
}
