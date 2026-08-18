import type { SearchEntry } from "./types";

export function filterSearch(index: SearchEntry[], query: string): SearchEntry[] {
  const q = query.trim().toLowerCase();
  if (!q) return index;
  return index.filter(
    (x) =>
      x.title.toLowerCase().includes(q) ||
      x.category.toLowerCase().includes(q) ||
      x.date.includes(q),
  );
}
