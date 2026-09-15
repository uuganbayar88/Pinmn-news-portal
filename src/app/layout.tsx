import type { Metadata, Viewport } from 'next';
import { Header, Footer } from '@/components/shell';
import { isFixtureMode, siteUrl } from '@/lib/content';
import './globals.css';
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: { default: 'pin.mn — Олон мэдээнээс, чухлыг нь.', template: '%s — pin.mn' },
  description: 'Монголын болон дэлхийн чухал мэдээг товч, ойлгомжтой, эх сурвалжтайгаар.',
  openGraph: { siteName: 'pin.mn', locale: 'mn_MN', type: 'website' },
  robots: {
    index: process.env.ALLOW_INDEXING === 'true' && !isFixtureMode(),
    follow: process.env.ALLOW_INDEXING === 'true' && !isFixtureMode(),
  },
};
export const viewport: Viewport = { width: 'device-width', initialScale: 1, themeColor: '#005F63' };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="mn">
      <body>
        <Header sample={isFixtureMode()} />
        <main id="main" className="container main-content">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
