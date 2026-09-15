'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { categories } from '@/lib/taxonomy';
import { Icon } from './icon';
export function Navigation() {
  const path = usePathname();
  return (
    <nav className="category-nav" aria-label="Үндсэн цэс">
      <Link href="/" aria-current={path === '/' ? 'page' : undefined}>
        Онцлох
      </Link>
      {categories.map((c) => (
        <Link
          key={c.slug}
          href={'/category/' + c.slug}
          aria-current={path === '/category/' + c.slug ? 'page' : undefined}
        >
          {c.label}
        </Link>
      ))}
      <Link
        className="digest-nav"
        href="/daily"
        aria-current={path === '/daily' ? 'page' : undefined}
      >
        <span className="coral-dot" /> Өнөөдрийн пин
      </Link>
    </nav>
  );
}
export function MobileNavigation() {
  const path = usePathname();
  const links = [
    { href: '/', label: 'Нүүр', icon: 'home' },
    { href: '/search', label: 'Хайх', icon: 'search' },
    { href: '/saved', label: 'Хадгалсан', icon: 'bookmark' },
    { href: '/login', label: 'Миний', icon: 'user' },
  ] as const;
  return (
    <nav className="mobile-nav" aria-label="Гар утасны цэс">
      {links.map((l) => (
        <Link key={l.href} href={l.href} aria-current={path === l.href ? 'page' : undefined}>
          <Icon name={l.icon} />
          <span>{l.label}</span>
        </Link>
      ))}
    </nav>
  );
}
