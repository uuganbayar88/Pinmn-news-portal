export const categories = [
  { slug: 'society', label: 'Нийгэм' },
  { slug: 'economy', label: 'Эдийн засаг' },
  { slug: 'technology', label: 'Технологи' },
  { slug: 'culture', label: 'Соёл' },
  { slug: 'world', label: 'Дэлхий' },
] as const;
export function categoryLabel(slug: string) {
  return categories.find((c) => c.slug === slug)?.label ?? slug;
}
export function dateLabel(date: string) {
  return date.slice(0, 10).replaceAll('-', '.');
}
