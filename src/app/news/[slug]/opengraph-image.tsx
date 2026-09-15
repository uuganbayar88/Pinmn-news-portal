import { ImageResponse } from 'next/og';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { getArticle } from '@/lib/content';
import { categoryLabel } from '@/lib/schema';
export const alt = 'pin.mn — Чухал мэдээ';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const revalidate = 60;
export default async function OGImage({ params }: { params: Promise<{ slug: string }> }) {
  const article = await getArticle((await params).slug);
  const font = await readFile(join(process.cwd(), 'src/assets/DejaVuSans-Bold.ttf'));
  return new ImageResponse(
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        background: '#F7F8F5',
        color: '#172526',
        width: '100%',
        height: '100%',
        padding: '52px 64px',
        fontFamily: 'DejaVu',
        borderTop: '12px solid #005F63',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 46, color: '#005F63', letterSpacing: '-3px' }}>pin.mn</span>
        <span style={{ fontSize: 21, color: '#005F63' }}>
          {article ? categoryLabel(article.category) : 'Мэдээ'}
        </span>
      </div>
      <div
        style={{
          display: 'flex',
          fontSize: (article?.title.length ?? 0) > 80 ? 49 : 58,
          lineHeight: 1.2,
          letterSpacing: '-2px',
        }}
      >
        {article?.title ?? 'Олон мэдээнээс, чухлыг нь.'}
      </div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 20,
          borderTop: '1px solid #c8d8d2',
          paddingTop: 24,
        }}
      >
        <div style={{ background: '#FF6B57', borderRadius: '50%', width: 13, height: 13 }} />
        <span style={{ fontSize: 20, color: '#005F63' }}>Уншаад ойлго. Ойлгоод хуваалц.</span>
      </div>
    </div>,
    { ...size, fonts: [{ name: 'DejaVu', data: font, weight: 700, style: 'normal' }] },
  );
}
