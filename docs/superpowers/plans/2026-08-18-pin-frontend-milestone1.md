# PIN Frontend Milestone 1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** A Next.js app rendering the PIN v6 design — homepage (today's digest) and article page — from typed Mongolian mock data shaped like the future Payload CMS schema.

**Architecture:** App Router server components pull data through a thin accessor layer over mock data (`src/lib/content/`); interactive mockup behaviors (toast, audio player, search overlay, quiz) are client components fed by a single UI provider. Styling is a faithful port of the mockup CSS into CSS Modules plus a global token sheet.

**Tech Stack:** Next.js 15+ (App Router, TypeScript strict), CSS Modules, `next/font/google`, Vitest + React Testing Library.

**Spec:** `docs/superpowers/specs/2026-08-18-pin-frontend-milestone1-design.md`

## Global Constraints

- Design tokens (exact values, defined once in `globals.css`): `--accent:#E8442E; --ink:#16130F; --paper:#F7F3EB; --soft:#6B6157; --line:#E5DED2; --gold:#C9A227`.
- Fonts: Inter Tight (display, weights 500/700/900), Spectral (serif, 600/700/800), Playfair Display (italic, 600/700), Golos Text (sans, 400/500/600/700) — all with `["latin","cyrillic"]` subsets via `next/font/google`, exposed as CSS variables `--disp`, `--serif`, `--ital`, `--sans`.
- CSS source of truth: `docs/mockups/pin-homepage-v6.html` (homepage) and `docs/mockups/pin-article.html` (article page). Port CSS **verbatim** — do not restyle, "improve", or convert units. When a mockup selector is a bare element (`header{}`, `aside{}`, `nav.main{}`), give it a local class in the module (`.header`, `.aside`, `.main`) because CSS Modules forbid pure element selectors. Descendant element selectors under a local class (`.main a`, `.pin h4`) stay as-is.
- All user-visible copy is Mongolian, copied **verbatim** from the mockups. Demo-stub actions show a toast whose text ends with `(демо)` exactly as the mockups do.
- Package manager: npm. TypeScript `strict: true` (create-next-app default — do not weaken).
- Never import from `src/lib/content/mock/` in components or pages — only via `src/lib/content/accessors.ts`.
- Every task ends with `npx tsc --noEmit` passing before its commit.

---

### Task 1: Scaffold Next.js app

**Files:**
- Create: entire Next.js scaffold at repo root (create-next-app in place)
- Modify: `.gitignore` (created by scaffold), `src/app/page.tsx` (placeholder)
- Delete: scaffold boilerplate (`src/app/favicon.ico` stays; default svg assets go)

**Interfaces:**
- Consumes: nothing (repo contains only `docs/` and `.claude/`)
- Produces: working `npm run dev` / `npm run build`; `@/*` alias → `src/*`

- [ ] **Step 1: Scaffold in place**

Run (repo root; create-next-app tolerates the existing `docs/`, `.git`, `.claude` — if it refuses because the directory is non-empty, scaffold into `/tmp/pin-scaffold` with the same flags and `rsync -a --ignore-existing /tmp/pin-scaffold/ .`):

```bash
npx --yes create-next-app@latest . --typescript --eslint --app --src-dir --no-tailwind --import-alias "@/*" --use-npm --turbopack
```

- [ ] **Step 2: Strip boilerplate**

Replace `src/app/page.tsx` with:

```tsx
export default function Home() {
  return <main>PIN</main>;
}
```

Delete `public/next.svg`, `public/vercel.svg`, `public/file.svg`, `public/globe.svg`, `public/window.svg` (those that exist). Empty out `src/app/page.module.css` if present (delete the file and its import).

- [ ] **Step 3: Verify build**

Run: `npm run build`
Expected: build succeeds, route `/` listed as static.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "chore: scaffold Next.js app (TS, App Router, src dir, no tailwind)"
```

---

### Task 2: Fonts, design tokens, global styles, root layout

**Files:**
- Modify: `src/app/layout.tsx`, `src/app/globals.css`

**Interfaces:**
- Consumes: scaffold from Task 1
- Produces: CSS variables `--accent --ink --paper --soft --line --gold --disp --serif --ital --sans`; global classes `.wrap`, `.rv`, `.rv.in`, `.d1`, `.d2`; `<html lang="mn">`; body base styles. Later tasks rely on these exact names.

- [ ] **Step 1: Replace `src/app/globals.css`**

```css
:root {
  --accent: #E8442E;
  --ink: #16130F;
  --paper: #F7F3EB;
  --soft: #6B6157;
  --line: #E5DED2;
  --gold: #C9A227;
  --disp: var(--font-disp), "Arial Black", sans-serif;
  --serif: var(--font-serif), Georgia, serif;
  --ital: var(--font-ital), Georgia, serif;
  --sans: var(--font-sans), -apple-system, "Segoe UI", sans-serif;
}
* { margin: 0; padding: 0; box-sizing: border-box; }
html { scroll-behavior: smooth; }
body {
  font-family: var(--sans);
  background: var(--paper);
  color: var(--ink);
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
  overflow-x: hidden;
}
a { color: inherit; text-decoration: none; }
button { font: inherit; color: inherit; }
.wrap { max-width: 1240px; margin: 0 auto; padding: 0 28px; }

.rv {
  opacity: 0;
  transform: translateY(22px);
  transition: opacity .7s cubic-bezier(.2,.7,.2,1), transform .7s cubic-bezier(.2,.7,.2,1);
}
.rv.in { opacity: 1; transform: none; }
.rv.d1 { transition-delay: .1s; }
.rv.d2 { transition-delay: .2s; }

@media (max-width: 700px) {
  body { padding-bottom: 70px; }
}
```

- [ ] **Step 2: Replace `src/app/layout.tsx`**

```tsx
import type { Metadata } from "next";
import { Inter_Tight, Spectral, Playfair_Display, Golos_Text } from "next/font/google";
import "./globals.css";

const disp = Inter_Tight({ subsets: ["latin", "cyrillic"], weight: ["500", "700", "900"], variable: "--font-disp" });
const serif = Spectral({ subsets: ["latin", "cyrillic"], weight: ["600", "700", "800"], variable: "--font-serif" });
const ital = Playfair_Display({ subsets: ["latin", "cyrillic"], style: ["italic"], weight: ["600", "700"], variable: "--font-ital" });
const sans = Golos_Text({ subsets: ["latin", "cyrillic"], weight: ["400", "500", "600", "700"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "PIN — Өнөөдөр мэдэхэд хангалттай",
  description: "Чухал мэдээг бид сонгож, утгыг нь тайлбарлана. Та ердөө 7 минут зарцуулна.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="mn">
      <body className={`${disp.variable} ${serif.variable} ${ital.variable} ${sans.variable}`}>
        {children}
      </body>
    </html>
  );
}
```

Note: if a font rejects the `cyrillic` subset at build time, keep `latin` and add the failing font's supported Cyrillic subset name from the build error; all four families do ship Cyrillic on Google Fonts.

- [ ] **Step 3: Verify**

Run: `npm run build && npx tsc --noEmit`
Expected: both pass.

- [ ] **Step 4: Commit**

```bash
git add src/app
git commit -m "feat: design tokens, fonts, base layout"
```

---

### Task 3: Vitest setup, content types, mock data, accessors (TDD)

**Files:**
- Create: `vitest.config.mts`, `vitest.setup.ts`, `src/lib/content/types.ts`, `src/lib/content/mock/articles.ts`, `src/lib/content/mock/site.ts`, `src/lib/content/accessors.ts`, `src/lib/content/search.ts`, `src/lib/content/accessors.test.ts`, `src/lib/content/search.test.ts`
- Modify: `package.json` (test scripts)

**Interfaces:**
- Consumes: nothing
- Produces (used by every later task):
  - Types: `Category`, `Author`, `Article`, `BodyBlock`, `DigestPin`, `DailyDigest`, `EventItem`, `VideoItem`, `SearchEntry`
  - Accessors: `getDigest(date?: string): DailyDigest`, `getDigestDayChips(): { label: string; date: string; active: boolean }[]`, `getArticle(slug: string): Article | undefined`, `getAllArticles(): Article[]`, `getFeatured(): Article`, `getEvents(): EventItem[]`, `getVideos(): VideoItem[]`, `getMostPinned(): string[]`, `getSearchIndex(): SearchEntry[]`
  - Search: `filterSearch(index: SearchEntry[], query: string): SearchEntry[]`

- [ ] **Step 1: Install test dependencies**

```bash
npm i -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/user-event @testing-library/jest-dom
```

- [ ] **Step 2: Create `vitest.config.mts`**

```ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: "./vitest.setup.ts",
    css: false,
  },
  resolve: {
    alias: { "@": path.resolve(__dirname, "src") },
  },
});
```

Create `vitest.setup.ts`:

```ts
import "@testing-library/jest-dom/vitest";

class IOStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}
if (!globalThis.IntersectionObserver) {
  globalThis.IntersectionObserver = IOStub as unknown as typeof IntersectionObserver;
}
```

Add to `package.json` scripts: `"test": "vitest run"`, `"test:watch": "vitest"`.

- [ ] **Step 3: Create `src/lib/content/types.ts`**

```ts
export interface Category {
  slug: string;
  name: string;
  color: string;
}

export interface Author {
  id: string;
  name: string;
  initials: string;
  role?: string;
}

export interface SponsoredMeta {
  partner: string;
  disclosure: string;
}

export type BodyBlock =
  | { type: "whatHappened"; label: string; paragraphs: string[]; bullets?: string[] }
  | { type: "whyItMatters"; label: string; paragraphs: string[] }
  | { type: "quote"; text: string; attribution: string }
  | { type: "video"; label: string; title: string; duration: string; caption: string }
  | { type: "whatsNext"; label: string; paragraphs: string[] };

export interface Article {
  slug: string;
  title: string;
  socialTitle?: string;      // ≤60 chars (architecture doc §4.5)
  socialDescription?: string; // ≤110 chars
  lead: string;
  whyItMatters: string;
  keyPoints: string[];        // 2–4 items, ≤110 chars each (doc §4.4)
  body: BodyBlock[];
  category: Category;
  author: Author;
  publishedAt: string;        // ISO 8601
  modifiedAt?: string;
  readMinutes: number;
  listenDuration?: string;    // "m:ss"
  sponsored?: SponsoredMeta;
  tags: string[];
}

export interface DigestPin {
  article: Article;
  lead?: boolean;
}

export interface DailyDigest {
  date: string;        // "2026-08-07"
  dateLabel: string;   // "08.07"
  weekdayLabel: string; // "ПҮРЭВ"
  pins: DigestPin[];
  storyCount: number;
  totalMinutes: number;
  updatedAtLabel: string; // "7:30-д шинэчлэв"
}

export interface EventItem {
  day: string;        // "04"
  monthLabel: string; // "8 САР"
  title: string;
  venue: string;
}

export interface VideoItem {
  id: string;
  title: string;
  category: string;
  duration: string;
  meta: string;
  size: "big" | "small";
  palette: 0 | 1 | 2 | 3 | 4;
  delay: 0 | 1 | 2;
}

export interface SearchEntry {
  category: string;
  title: string;
  date: string; // "08.07"
  slug?: string;
}
```

- [ ] **Step 4: Write failing accessor tests — `src/lib/content/accessors.test.ts`**

```ts
import { describe, expect, it } from "vitest";
import {
  getAllArticles, getArticle, getDigest, getDigestDayChips,
  getEvents, getFeatured, getMostPinned, getSearchIndex, getVideos,
} from "./accessors";

describe("accessors", () => {
  it("returns today's digest by default with the lead pin first", () => {
    const d = getDigest();
    expect(d.date).toBe("2026-08-07");
    expect(d.pins).toHaveLength(5);
    expect(d.pins[0].lead).toBe(true);
    expect(d.pins[0].article.slug).toBe("tov-bank-bodlogyn-huu");
    expect(d.storyCount).toBe(8);
    expect(d.totalMinutes).toBe(7);
  });

  it("exposes day chips with today active first", () => {
    const chips = getDigestDayChips();
    expect(chips[0]).toEqual({ label: "Өнөөдөр · 08.07", date: "2026-08-07", active: true });
    expect(chips).toHaveLength(4);
  });

  it("finds an article by slug and returns undefined for unknown slugs", () => {
    expect(getArticle("tatvaryn-shinechlel")?.title).toContain("Татварын шинэчлэл");
    expect(getArticle("no-such-slug")).toBeUndefined();
  });

  it("featured article has full body blocks and key points", () => {
    const f = getFeatured();
    expect(f.slug).toBe("tatvaryn-shinechlel");
    expect(f.body.length).toBeGreaterThanOrEqual(4);
    expect(f.keyPoints.length).toBeGreaterThanOrEqual(2);
    f.keyPoints.forEach((k) => expect(k.length).toBeLessThanOrEqual(110));
  });

  it("returns sidebar and band data", () => {
    expect(getEvents()).toHaveLength(3);
    expect(getVideos()).toHaveLength(5);
    expect(getVideos().filter((v) => v.size === "big")).toHaveLength(1);
    expect(getMostPinned()).toHaveLength(4);
    expect(getSearchIndex()).toHaveLength(8);
    expect(getAllArticles().length).toBeGreaterThanOrEqual(6);
  });
});
```

- [ ] **Step 5: Run tests to verify they fail**

Run: `npx vitest run src/lib/content/accessors.test.ts`
Expected: FAIL — cannot resolve `./accessors`.

- [ ] **Step 6: Create mock data — `src/lib/content/mock/articles.ts`**

All copy verbatim from `docs/mockups/pin-homepage-v6.html` and `docs/mockups/pin-article.html`:

```ts
import type { Article, Author, Category } from "../types";

export const categories: Record<string, Category> = {
  ulsTor: { slug: "uls-tor", name: "Улс төр", color: "#E8442E" },
  ediinZasag: { slug: "ediin-zasag", name: "Эдийн засаг", color: "#C9A227" },
  tehnologi: { slug: "tehnologi", name: "Технологи", color: "#3D5A72" },
  hot: { slug: "hot", name: "Хот", color: "#2E5E4E" },
  niigem: { slug: "niigem", name: "Нийгэм", color: "#6D4A72" },
};

export const authors: Record<string, Author> = {
  nomin: { id: "nomin", name: "Б.Номин", initials: "БН" },
  temuulen: { id: "temuulen", name: "Э.Тэмүүлэн", initials: "ЭТ" },
  anar: { id: "anar", name: "С.Анар", initials: "СА" },
  sarnai: { id: "sarnai", name: "Б. Сарнай", initials: "БС", role: "Улс төрийн редактор" },
  studio: { id: "studio", name: "PIN Студи", initials: "PS" },
};

export const articles: Article[] = [
  {
    slug: "tov-bank-bodlogyn-huu",
    title: "Төв банк бодлогын хүүг хэвээр хадгалав",
    lead: "Өрх, бизнесийн санхүүжилтийн өртөг ойрын хугацаанд буурахгүй гэсэн дохио.",
    whyItMatters: "Өрх, бизнесийн санхүүжилтийн өртөг ойрын хугацаанд буурахгүй гэсэн дохио.",
    keyPoints: [
      "Юу болов: Мөнгөний бодлогын хороо хүүг хэвээр үлдээх шийдвэрийг санал нэгтэй гаргав.",
      "Тоогоор: Инфляц зорилтот түвшинд ойртсон ч зээлийн өсөлт жилийн 24%-тай байна.",
      "Цаашид: Дараагийн хурал 10-р сард — тэр хүртэл ипотекийн хүүд өөрчлөлт гарахгүй.",
    ],
    body: [
      { type: "whatHappened", label: "Юу болов", paragraphs: ["Мөнгөний бодлогын хороо бодлогын хүүг хэвээр үлдээх шийдвэрийг санал нэгтэй гаргав."], bullets: ["Инфляц зорилтот түвшинд ойртсон ч зээлийн өсөлт жилийн 24%-тай байна.", "Дараагийн хурал 10-р сард — тэр хүртэл ипотекийн хүүд өөрчлөлт гарахгүй."] },
      { type: "whyItMatters", label: "Яагаад чухал вэ", paragraphs: ["Өрх, бизнесийн санхүүжилтийн өртөг ойрын хугацаанд буурахгүй гэсэн дохио."] },
    ],
    category: categories.ediinZasag,
    author: authors.nomin,
    publishedAt: "2026-08-07T07:30:00+08:00",
    readMinutes: 2,
    listenDuration: "2:10",
    tags: ["хүү", "төвбанк", "эдийнзасаг"],
  },
  {
    slug: "huuliin-tosluud-todorloo",
    title: "Намрын чуулганаар хэлэлцэх хуулийн төслүүд тодорлоо",
    lead: "Татварын шинэчлэл болон цахим үйлчилгээний багц хууль жагсаалтад орсон — бизнест шууд нөлөөтэй.",
    whyItMatters: "Татварын шинэчлэл болон цахим үйлчилгээний багц хууль жагсаалтад орсон — бизнест шууд нөлөөтэй.",
    keyPoints: [
      "Татварын багц шинэчлэл тэргүүн ээлжид орлоо.",
      "Цахим үйлчилгээний багц хууль мөн жагсаалтад бий.",
    ],
    body: [
      { type: "whatHappened", label: "Юу болов", paragraphs: ["Намрын ээлжит чуулганаар хэлэлцэх хуулийн төслүүдийн жагсаалт батлагдав."] },
      { type: "whyItMatters", label: "Яагаад чухал вэ", paragraphs: ["Татварын шинэчлэл болон цахим үйлчилгээний багц хууль жагсаалтад орсон — бизнест шууд нөлөөтэй."] },
    ],
    category: categories.ulsTor,
    author: authors.temuulen,
    publishedAt: "2026-08-07T07:30:00+08:00",
    readMinutes: 3,
    listenDuration: "3:05",
    tags: ["чуулган", "хууль"],
  },
  {
    slug: "startup-horongo-oruulalt",
    title: "Монгол стартап бүс нутгийн хөрөнгө оруулалт татлаа",
    lead: "Сүүлийн хоёр жилийн хамгийн том хэлцэл нь дотоодын экосистемд итгэх хөрөнгө оруулагчдын итгэлийг сэргээж байна.",
    whyItMatters: "Сүүлийн хоёр жилийн хамгийн том хэлцэл нь дотоодын экосистемд итгэх хөрөнгө оруулагчдын итгэлийг сэргээж байна.",
    keyPoints: [
      "Сүүлийн хоёр жилийн хамгийн том хэлцэл болов.",
      "Хөрөнгө оруулагчдын итгэл дотоодын экосистемд сэргэж байна.",
    ],
    body: [
      { type: "whatHappened", label: "Юу болов", paragraphs: ["Монгол стартап бүс нутгийн хөрөнгө оруулалт татлаа."] },
      { type: "whyItMatters", label: "Яагаад чухал вэ", paragraphs: ["Сүүлийн хоёр жилийн хамгийн том хэлцэл нь дотоодын экосистемд итгэх хөрөнгө оруулагчдын итгэлийг сэргээж байна."] },
    ],
    category: categories.tehnologi,
    author: authors.anar,
    publishedAt: "2026-08-07T07:30:00+08:00",
    readMinutes: 3,
    listenDuration: "2:45",
    tags: ["стартап", "хөрөнгөоруулалт"],
  },
  {
    slug: "5g-suljee-biznes",
    title: "5G сүлжээ таны бизнест юу өөрчлөх вэ?",
    lead: "Жижиг бизнесүүдийн хамгийн бодит 3 хэрэглээг жишээгээр тайлбарлав.",
    whyItMatters: "Жижиг бизнесүүдийн хамгийн бодит 3 хэрэглээг жишээгээр тайлбарлав.",
    keyPoints: [
      "Жижиг бизнесийн 3 бодит хэрэглээг жишээгээр тайлбарлав.",
      "Хамтарсан контент: Unitel × PIN Студи.",
    ],
    body: [
      { type: "whatHappened", label: "Товчхон", paragraphs: ["Жижиг бизнесүүдийн хамгийн бодит 3 хэрэглээг жишээгээр тайлбарлав."] },
    ],
    category: categories.tehnologi,
    author: authors.studio,
    publishedAt: "2026-08-07T07:30:00+08:00",
    readMinutes: 2,
    sponsored: {
      partner: "Unitel",
      disclosure: "Энэ контентыг Unitel-тэй хамтран PIN Студи бэлтгэв. Редакцийн мэдээнээс тусдаа.",
    },
    tags: ["5g", "бизнес"],
  },
  {
    slug: "shine-avtobusny-chiglel",
    title: "Шинэ автобусны чиглэлүүд өнөөдрөөс хэрэгжинэ",
    lead: "Захын хороололлын 120 мянга гаруй иргэний өдөр тутмын зорчилтод өөрчлөлт орно.",
    whyItMatters: "Захын хороололлын 120 мянга гаруй иргэний өдөр тутмын зорчилтод өөрчлөлт орно.",
    keyPoints: [
      "Захын хорооллын 120 мянга гаруй иргэний зорчилтод өөрчлөлт орно.",
      "Шинэ чиглэлүүд өнөөдрөөс хэрэгжиж эхэлнэ.",
    ],
    body: [
      { type: "whatHappened", label: "Юу болов", paragraphs: ["Шинэ автобусны чиглэлүүд өнөөдрөөс хэрэгжинэ."] },
      { type: "whyItMatters", label: "Яагаад чухал вэ", paragraphs: ["Захын хороололлын 120 мянга гаруй иргэний өдөр тутмын зорчилтод өөрчлөлт орно."] },
    ],
    category: categories.hot,
    author: authors.nomin,
    publishedAt: "2026-08-07T07:30:00+08:00",
    readMinutes: 1,
    tags: ["автобус", "хот"],
  },
  {
    slug: "tatvaryn-shinechlel",
    title: "Намрын чуулган: Татварын шинэчлэл юуг өөрчлөх вэ?",
    socialTitle: "Намрын чуулган: Татварын шинэчлэл юуг өөрчлөх вэ?",
    socialDescription: "Цалин, НӨАТ, жижиг бизнес — гурван гол өөрчлөлтийг энгийнээр тайлбарлав.",
    lead: "Бизнес эрхлэгчид болон энгийн иргэдэд хамгийн их нөлөөлөх 5 өөрчлөлтийг задлан тайлбарлав.",
    whyItMatters: "Энэ бол сүүлийн таван жилийн хамгийн өргөн хүрээтэй татварын өөрчлөлт.",
    keyPoints: [
      "Жижиг, дунд бизнесийн орлогын албан татварын шатлалд өөрчлөлт орно.",
      "Цахим үйлчилгээний орлогод шинэ зохицуулалт нэмэгдэнэ.",
      "Хувь хүний орлогын албан татварын хөнгөлөлтийн хязгаар шинэчлэгдэнэ.",
    ],
    body: [
      { type: "whatHappened", label: "Юу болов", paragraphs: ["Намрын ээлжит чуулганаар хэлэлцэх хуулийн төслүүдийн жагсаалт батлагдаж, татварын багц шинэчлэл тэргүүн ээлжид орлоо. Төслийн гол агуулга:"], bullets: ["Жижиг, дунд бизнесийн орлогын албан татварын шатлалд өөрчлөлт орно.", "Цахим үйлчилгээний орлогод шинэ зохицуулалт нэмэгдэнэ.", "Хувь хүний орлогын албан татварын хөнгөлөлтийн хязгаар шинэчлэгдэнэ."] },
      { type: "whyItMatters", label: "Яагаад чухал вэ", paragraphs: ["Энэ бол сүүлийн таван жилийн хамгийн өргөн хүрээтэй татварын өөрчлөлт. Жижиг бизнес эрхлэгчдийн хувьд татварын дарамт буурах боломжтой ч, цахим орлоготой иргэдэд шинэ тайлагналын үүрэг үүсэх магадлалтай."] },
      { type: "quote", text: "«Шинэчлэлийн зорилго нь татварын суурийг өргөжүүлэхэд бус, шударга байдлыг нэмэгдүүлэхэд чиглэж байгаа.»", attribution: "— Ажлын хэсгийн гишүүн, эдийн засагч" },
      { type: "video", label: "Видео тайлбар", title: "Татварын шинэчлэл — 3 минутад ойлгоё", duration: "3:05", caption: "PIN Видео · «Тайлбарлая» цуврал" },
      { type: "whatsNext", label: "Цаашид юу болох вэ", paragraphs: ["Чуулган есдүгээр сарын эхээр эхэлнэ. Төслүүд хоёр хэлэлцүүлэг дамжих тул эцсийн хувилбар аравдугаар сард тодорхой болно. PIN энэ сэдвийг «пин» хэлбэрээр тогтмол шинэчилж мэдээлнэ — доорх товчоор дагаарай."] },
    ],
    category: categories.ulsTor,
    author: authors.sarnai,
    publishedAt: "2026-08-01T09:40:00+08:00",
    modifiedAt: "2026-08-07T07:30:00+08:00",
    readMinutes: 5,
    listenDuration: "6:12",
    tags: ["татвар", "чуулган", "жижигбизнес", "эдийнзасаг"],
  },
];
```

- [ ] **Step 7: Create `src/lib/content/mock/site.ts`**

```ts
import type { DailyDigest, EventItem, SearchEntry, VideoItem } from "../types";
import { articles } from "./articles";

const bySlug = (slug: string) => {
  const a = articles.find((x) => x.slug === slug);
  if (!a) throw new Error(`mock article missing: ${slug}`);
  return a;
};

export const digests: DailyDigest[] = [
  {
    date: "2026-08-07",
    dateLabel: "08.07",
    weekdayLabel: "ПҮРЭВ",
    pins: [
      { article: bySlug("tov-bank-bodlogyn-huu"), lead: true },
      { article: bySlug("huuliin-tosluud-todorloo") },
      { article: bySlug("startup-horongo-oruulalt") },
      { article: bySlug("5g-suljee-biznes") },
      { article: bySlug("shine-avtobusny-chiglel") },
    ],
    storyCount: 8,
    totalMinutes: 7,
    updatedAtLabel: "7:30-д шинэчлэв",
  },
];

export const dayChips = [
  { label: "Өнөөдөр · 08.07", date: "2026-08-07", active: true },
  { label: "Лх · 08.06", date: "2026-08-06", active: false },
  { label: "Мя · 08.05", date: "2026-08-05", active: false },
  { label: "Да · 08.04", date: "2026-08-04", active: false },
];

export const events: EventItem[] = [
  { day: "04", monthLabel: "8 САР", title: "Startup Grind UB", venue: "Corporate Convention Centre" },
  { day: "09", monthLabel: "8 САР", title: "Хөх толбо — тоглолт", venue: "Үндэсний цэцэрлэгт хүрээлэн" },
  { day: "15", monthLabel: "8 САР", title: "Digital Forum 2026", venue: "Шангри-Ла төв" },
];

export const mostPinned = [
  "Татварын шинэчлэлийн бүрэн тайлбар",
  "УБ метроны төслийн явц — юу хүлээх вэ",
  "Хилийн боомтуудын шинэ горим",
  "Цалингийн дундаж өсөлт: салбараар",
];

export const videos: VideoItem[] = [
  { id: "v1", title: "«Монголын эдийн засгийн дараагийн 5 жил»", category: "Ярилцлага", duration: "12:40", meta: "Эдийн засагч зочинтой · 24К үзэлт · Өчигдөр", size: "big", palette: 0, delay: 0 },
  { id: "v2", title: "Татварын шинэчлэл — 3 минутад", category: "Тайлбарлая", duration: "3:05", meta: "18К үзэлт", size: "small", palette: 1, delay: 1 },
  { id: "v3", title: "Метроны талбайд: явц ямар байна?", category: "Репортаж", duration: "6:22", meta: "31К үзэлт", size: "small", palette: 2, delay: 1 },
  { id: "v4", title: "Өнөөдрийн пин — 90 секундэд", category: "Shorts", duration: "1:48", meta: "Өдөр бүр", size: "small", palette: 3, delay: 2 },
  { id: "v5", title: "Шинэ автобусаар нэг өдөр", category: "Хотын амьдрал", duration: "8:15", meta: "9К үзэлт", size: "small", palette: 4, delay: 2 },
];

export const searchIndex: SearchEntry[] = [
  { category: "Эдийн засаг", title: "Төв банк бодлогын хүүг хэвээр хадгалав", date: "08.07", slug: "tov-bank-bodlogyn-huu" },
  { category: "Улс төр", title: "Намрын чуулганаар хэлэлцэх хуулийн төслүүд тодорлоо", date: "08.07", slug: "huuliin-tosluud-todorloo" },
  { category: "Технологи", title: "Монгол стартап бүс нутгийн хөрөнгө оруулалт татлаа", date: "08.07", slug: "startup-horongo-oruulalt" },
  { category: "Хот", title: "Шинэ автобусны чиглэлүүд өнөөдрөөс хэрэгжинэ", date: "08.07", slug: "shine-avtobusny-chiglel" },
  { category: "Улс төр", title: "Татварын шинэчлэл юуг өөрчлөх вэ? — бүрэн тайлбар", date: "08.06", slug: "tatvaryn-shinechlel" },
  { category: "Хот", title: "УБ метроны төслийн явц — юу хүлээх вэ", date: "08.05" },
  { category: "Эдийн засаг", title: "Цалингийн дундаж өсөлт: салбараар", date: "08.04" },
  { category: "Нийгэм", title: "Хилийн боомтуудын шинэ горим", date: "08.04" },
];
```

- [ ] **Step 8: Create `src/lib/content/accessors.ts`**

```ts
import type { Article, DailyDigest, EventItem, SearchEntry, VideoItem } from "./types";
import { articles } from "./mock/articles";
import { dayChips, digests, events, mostPinned, searchIndex, videos } from "./mock/site";

const TODAY = "2026-08-07";

export function getDigest(date: string = TODAY): DailyDigest {
  const digest = digests.find((d) => d.date === date);
  if (!digest) throw new Error(`no digest for ${date}`);
  return digest;
}

export function getDigestDayChips(): { label: string; date: string; active: boolean }[] {
  return dayChips;
}

export function getAllArticles(): Article[] {
  return articles;
}

export function getArticle(slug: string): Article | undefined {
  return articles.find((a) => a.slug === slug);
}

export function getFeatured(): Article {
  const featured = getArticle("tatvaryn-shinechlel");
  if (!featured) throw new Error("featured article missing");
  return featured;
}

export function getEvents(): EventItem[] {
  return events;
}

export function getVideos(): VideoItem[] {
  return videos;
}

export function getMostPinned(): string[] {
  return mostPinned;
}

export function getSearchIndex(): SearchEntry[] {
  return searchIndex;
}
```

- [ ] **Step 9: Run accessor tests**

Run: `npx vitest run src/lib/content/accessors.test.ts`
Expected: PASS (5 tests).

- [ ] **Step 10: Write failing search test — `src/lib/content/search.test.ts`**

```ts
import { describe, expect, it } from "vitest";
import { filterSearch } from "./search";
import type { SearchEntry } from "./types";

const index: SearchEntry[] = [
  { category: "Эдийн засаг", title: "Төв банк бодлогын хүүг хэвээр хадгалав", date: "08.07" },
  { category: "Хот", title: "УБ метроны төслийн явц", date: "08.05" },
];

describe("filterSearch", () => {
  it("returns everything for an empty or whitespace query", () => {
    expect(filterSearch(index, "")).toHaveLength(2);
    expect(filterSearch(index, "   ")).toHaveLength(2);
  });

  it("matches title case-insensitively", () => {
    expect(filterSearch(index, "МЕТРО")).toEqual([index[1]]);
  });

  it("matches category and date", () => {
    expect(filterSearch(index, "эдийн")).toEqual([index[0]]);
    expect(filterSearch(index, "08.05")).toEqual([index[1]]);
  });

  it("returns empty for no match", () => {
    expect(filterSearch(index, "zzz")).toEqual([]);
  });
});
```

Run: `npx vitest run src/lib/content/search.test.ts` — Expected: FAIL (module missing).

- [ ] **Step 11: Create `src/lib/content/search.ts`**

```ts
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
```

- [ ] **Step 12: Run all tests + typecheck**

Run: `npm test && npx tsc --noEmit`
Expected: all PASS.

- [ ] **Step 13: Commit**

```bash
git add vitest.config.mts vitest.setup.ts package.json package-lock.json src/lib
git commit -m "feat: content types, mock data, accessors, search filter (TDD)"
```

---

### Task 4: UI provider (toast, audio, search state), Reveal, chrome (Header, Footer, TabBar)

**Files:**
- Create: `src/components/ui/UiProvider.tsx`, `src/components/ui/Toast.module.css`, `src/components/ui/Reveal.tsx`, `src/components/audio/AudioPlayerBar.tsx`, `src/components/audio/AudioPlayerBar.module.css`, `src/components/search/SearchOverlay.tsx`, `src/components/search/SearchOverlay.module.css`, `src/components/chrome/Header.tsx`, `src/components/chrome/Header.module.css`, `src/components/chrome/Footer.tsx`, `src/components/chrome/Footer.module.css`, `src/components/chrome/TabBar.tsx`, `src/components/chrome/TabBar.module.css`, `src/components/ui/quiz-search.test.tsx` (search overlay part; quiz test comes in Task 5)
- Modify: `src/app/layout.tsx` (wrap children in `<UiProvider>`)

**Interfaces:**
- Consumes: `getSearchIndex`, `filterSearch`, `SearchEntry` from Task 3; global classes from Task 2
- Produces (relied on by Tasks 5–7):
  - `useUi(): { toast: (msg: string) => void; playAudio: (title: string, duration: string) => void; openSearch: () => void }` exported from `@/components/ui/UiProvider`
  - `<Reveal as?: string; className?: string; delay?: 0|1|2>` default export of `@/components/ui/Reveal`
  - `<Header/>`, `<Footer/>`, `<TabBar/>` default exports, no props

- [ ] **Step 1: Create `src/components/ui/Reveal.tsx`**

```tsx
"use client";

import { createElement, useEffect, useRef, useState, type ReactNode } from "react";

export default function Reveal({
  as = "div",
  className = "",
  delay = 0,
  children,
}: {
  as?: string;
  className?: string;
  delay?: 0 | 1 | 2;
  children: ReactNode;
}) {
  const ref = useRef<HTMLElement | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setInView(true);
            io.disconnect();
          }
        }
      },
      { threshold: 0.1 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const cls = ["rv", delay ? `d${delay}` : "", inView ? "in" : "", className]
    .filter(Boolean)
    .join(" ");
  return createElement(as, { ref, className: cls }, children);
}
```

- [ ] **Step 2: Create `src/components/ui/UiProvider.tsx`**

The provider owns toast state, audio-player state, and search-overlay visibility, and renders the three singletons. Audio logic ports the mockup's demo simulation (1s tick, auto-pause at end).

```tsx
"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import toastStyles from "./Toast.module.css";
import AudioPlayerBar, { type AudioState } from "@/components/audio/AudioPlayerBar";
import SearchOverlay from "@/components/search/SearchOverlay";

interface UiApi {
  toast: (msg: string) => void;
  playAudio: (title: string, duration: string) => void;
  openSearch: () => void;
}

const UiContext = createContext<UiApi | null>(null);

export function useUi(): UiApi {
  const ctx = useContext(UiContext);
  if (!ctx) throw new Error("useUi must be used inside <UiProvider>");
  return ctx;
}

function parseDur(d: string): number {
  const [m, s] = d.split(":").map(Number);
  return m * 60 + s;
}

export default function UiProvider({ children }: { children: ReactNode }) {
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [audio, setAudio] = useState<AudioState | null>(null);
  const tick = useRef<ReturnType<typeof setInterval> | null>(null);

  const [searchOpen, setSearchOpen] = useState(false);

  const toast = useCallback((msg: string) => {
    setToastMsg(msg);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToastMsg(null), 2000);
  }, []);

  const stopTick = () => {
    if (tick.current) clearInterval(tick.current);
    tick.current = null;
  };

  const startTick = useCallback(() => {
    stopTick();
    tick.current = setInterval(() => {
      setAudio((a) => {
        if (!a || !a.playing) return a;
        const cur = a.cur + 1;
        if (cur >= a.dur) {
          stopTick();
          return { ...a, cur: a.dur, playing: false };
        }
        return { ...a, cur };
      });
    }, 1000);
  }, []);

  const playAudio = useCallback(
    (title: string, duration: string) => {
      setAudio({ title, dur: parseDur(duration), cur: 0, playing: true, open: true });
      startTick();
    },
    [startTick],
  );

  const togglePlay = useCallback(() => {
    setAudio((a) => {
      if (!a) return a;
      const cur = a.cur >= a.dur ? 0 : a.cur;
      const playing = !a.playing;
      if (playing) startTick();
      else stopTick();
      return { ...a, cur, playing };
    });
  }, [startTick]);

  const closePlayer = useCallback(() => {
    stopTick();
    setAudio((a) => (a ? { ...a, playing: false, open: false } : a));
  }, []);

  useEffect(() => () => stopTick(), []);

  const openSearch = useCallback(() => setSearchOpen(true), []);

  return (
    <UiContext.Provider value={{ toast, playAudio, openSearch }}>
      {children}
      <AudioPlayerBar state={audio} onToggle={togglePlay} onClose={closePlayer} />
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} onOpen={openSearch} toast={toast} />
      <div className={`${toastStyles.toast} ${toastMsg ? toastStyles.show : ""}`}>{toastMsg}</div>
    </UiContext.Provider>
  );
}
```

- [ ] **Step 3: Create `src/components/ui/Toast.module.css`**

Port from `docs/mockups/pin-homepage-v6.html` selector `.toast` / `.toast.show` verbatim (rename nothing; both are classes already).

- [ ] **Step 4: Create `src/components/audio/AudioPlayerBar.tsx` + module CSS**

```tsx
"use client";

import styles from "./AudioPlayerBar.module.css";

export interface AudioState {
  title: string;
  dur: number;
  cur: number;
  playing: boolean;
  open: boolean;
}

function fmt(s: number): string {
  const v = Math.max(0, Math.round(s));
  return `${Math.floor(v / 60)}:${String(v % 60).padStart(2, "0")}`;
}

export default function AudioPlayerBar({
  state,
  onToggle,
  onClose,
}: {
  state: AudioState | null;
  onToggle: () => void;
  onClose: () => void;
}) {
  const open = state?.open ?? false;
  const paused = !state?.playing;
  return (
    <div className={`${styles.player} ${open ? styles.open : ""} ${paused ? styles.paused : ""}`}>
      <div className={styles.prog} style={{ width: state ? `${(state.cur / state.dur) * 100}%` : 0 }} />
      <div className={styles.pinner}>
        <button className={styles.pbtn} onClick={onToggle} aria-label={paused ? "Тоглуулах" : "Түр зогсоох"}>
          {paused ? <span className={styles.tri} /> : <span className={styles.pause}><i /><i /></span>}
        </button>
        <div className={styles.ptitle}>
          <div className={styles.pk}>PIN Аудио</div>
          <h6>{state?.title ?? "—"}</h6>
        </div>
        <div className={styles.pwave}><i /><i /><i /><i /><i /></div>
        <span className={styles.ptime}>{state ? `${fmt(state.cur)} / ${fmt(state.dur)}` : "0:00 / 0:00"}</span>
        <button className={styles.pclose} onClick={onClose} aria-label="Хаах">✕</button>
      </div>
    </div>
  );
}
```

`AudioPlayerBar.module.css`: port verbatim from the homepage mockup the selectors `.player`, `.player.open`, `.player .prog`, `.player .pinner`, `.pbtn` (+`:hover`, `.tri`, `.pause`, `.pause i`), `.ptitle` (+`.pk`, `h6`), `.ptime`, `.pclose` (+`:hover`), `.pwave` (+`i`, the five `:nth-child` rules), `@keyframes wv`, `.player.paused .pwave i`, and the `@media(max-width:700px)` player block.

- [ ] **Step 5: Create `src/components/search/SearchOverlay.tsx` + module CSS**

```tsx
"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./SearchOverlay.module.css";
import { getSearchIndex } from "@/lib/content/accessors";
import { filterSearch } from "@/lib/content/search";

const HOT = [
  { label: "татварын шинэчлэл", q: "татвар" },
  { label: "метро", q: "метро" },
  { label: "бодлогын хүү", q: "хүү" },
  { label: "автобус", q: "автобус" },
];
const DATES = [
  { label: "Өнөөдөр · 08.07", q: "08.07" },
  { label: "08.06", q: "08.06" },
  { label: "08.05", q: "08.05" },
  { label: "08.04", q: "08.04" },
];

export default function SearchOverlay({
  open,
  onClose,
  onOpen,
  toast,
}: {
  open: boolean;
  onClose: () => void;
  onOpen: () => void;
  toast: (msg: string) => void;
}) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const index = getSearchIndex();
  const results = filterSearch(index, query);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "/" && !open && document.activeElement?.tagName !== "INPUT") {
        e.preventDefault();
        onOpen();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose, onOpen]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 100);
  }, [open]);

  const set = (q: string) => {
    setQuery(q);
    inputRef.current?.focus();
  };

  return (
    <div className={`${styles.searchov} ${open ? styles.svopen : ""}`} role="dialog" aria-label="Хайлт">
      <div className={`wrap ${styles.sinner}`}>
        <div className={styles.srow}>
          <span className={styles.sico}>⌕</span>
          <input
            ref={inputRef}
            value={query}
            placeholder="Хайх — гарчиг, сэдэв, таг..."
            onChange={(e) => setQuery(e.target.value)}
          />
          <button className={styles.sclose} onClick={onClose} aria-label="Хаах">✕</button>
        </div>
        <div className={styles.sgroup}>
          <span className={styles.k}>Их хайгдсан</span>
          {HOT.map((c) => (
            <button key={c.q} className={styles.schip} onClick={() => set(c.q)}>{c.label}</button>
          ))}
        </div>
        <div className={styles.sgroup}>
          <span className={styles.k}>Архив · өдрөөр</span>
          {DATES.map((c) => (
            <button key={c.q} className={styles.schip} onClick={() => set(c.q)}>{c.label}</button>
          ))}
          <button className={styles.schip} onClick={() => toast("Архивын бүрэн хуудас (демо)")}>Бүх архив →</button>
        </div>
        <div className={styles.sres}>
          {results.length ? (
            results.map((r) => (
              <div key={`${r.title}${r.date}`} className={styles.srrow} onClick={() => toast("Мэдээ рүү (демо)")}>
                <span className={styles.src}>{r.category}</span>
                <span className={styles.srt}>{r.title}</span>
                <span className={styles.srd}>{r.date}</span>
              </div>
            ))
          ) : (
            <div className={styles.snone}>«{query.trim()}» — илэрц олдсонгүй. Өөр түлхүүр үг туршаад үзээрэй.</div>
          )}
        </div>
      </div>
    </div>
  );
}
```

`SearchOverlay.module.css`: port verbatim the mockup selectors `.searchov`, `.searchov.open` (rename the state class to `.svopen` to avoid colliding with the module's generic word "open"), `.sinner`, `.srow` (+`.sico`, `input`, `input::placeholder`), `.sclose` (+`:hover`), `.sgroup` (+`.k`), `.schip` (+`:hover`), `.sres`, `.srrow` (+`:hover .srt`, `.src`, `.srt`, `.srd`), `.snone`, and the `@media(max-width:700px)` search block.

- [ ] **Step 6: Write failing SearchOverlay test — `src/components/search/SearchOverlay.test.tsx`**

```tsx
import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SearchOverlay from "./SearchOverlay";

describe("SearchOverlay", () => {
  it("shows all 8 archive rows with no query and filters as the user types", async () => {
    const user = userEvent.setup();
    render(<SearchOverlay open onClose={() => {}} onOpen={() => {}} toast={vi.fn()} />);
    expect(screen.getAllByText(/08\.0\d/).length).toBeGreaterThanOrEqual(8);
    await user.type(screen.getByPlaceholderText(/Хайх/), "метро");
    expect(screen.getByText(/метроны төслийн явц/)).toBeInTheDocument();
    expect(screen.queryByText("Төв банк бодлогын хүүг хэвээр хадгалав")).not.toBeInTheDocument();
  });

  it("shows the empty state for a miss", async () => {
    const user = userEvent.setup();
    render(<SearchOverlay open onClose={() => {}} onOpen={() => {}} toast={vi.fn()} />);
    await user.type(screen.getByPlaceholderText(/Хайх/), "zzz");
    expect(screen.getByText(/илэрц олдсонгүй/)).toBeInTheDocument();
  });
});
```

Run: `npx vitest run src/components/search/SearchOverlay.test.tsx`
Expected: PASS if Steps 5 done correctly (write the test before running the component in the browser; if it fails, fix the component, not the test).

- [ ] **Step 7: Create Header / Footer / TabBar**

`src/components/chrome/Header.tsx`:

```tsx
"use client";

import Link from "next/link";
import styles from "./Header.module.css";
import { useUi } from "@/components/ui/UiProvider";

export default function Header({ dateLabel }: { dateLabel: string }) {
  const { toast, openSearch } = useUi();
  return (
    <header className={styles.header}>
      <div className={`wrap ${styles.head}`}>
        <Link className={styles.logo} href="/">
          P<span className={styles.bang}>!</span>N<span className={styles.dot}>.</span>
        </Link>
        <nav className={styles.main}>
          <a className={styles.active} href="/">Өнөөдөр</a>
          <a href="#" onClick={(e) => { e.preventDefault(); toast("Тайлбар хуудас (демо)"); }}>Тайлбар</a>
          <a href="#video">Видео</a>
          <a href="#" onClick={(e) => { e.preventDefault(); toast("Үйл явдал хуудас (демо)"); }}>Үйл явдал</a>
          <a href="#manif">Бидний тухай</a>
        </nav>
        <div className={styles.headRight}>
          <span className={styles.datechip}>{dateLabel}</span>
          <button className={styles.burger} onClick={openSearch} title="Хайлт / Архив">⌕</button>
          <button className={styles.burger} onClick={() => toast("Цэс (демо)")}>≡</button>
        </div>
      </div>
    </header>
  );
}
```

`Header.module.css`: port `header{}` → `.header`, then `.head`, `.logo` (+`.bang`, `.dot`), `nav.main` → `.main` (+`.main a`, `:hover`, `.main a.active` → `.main .active` with its `::after`), `.head-right` → `.headRight`, `.datechip`, `.burger` (+`:hover`), plus from the mobile media query the `nav.main,.datechip{display:none}` and `.head{height:60px}` rules (rewritten against the module class names).

`src/components/chrome/Footer.tsx` (server component):

```tsx
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`wrap ${styles.froot}`}>
        <span className={styles.logo}>P<span className={styles.bang}>!</span>N<span className={styles.bang}>.</span></span>
        <span className={styles.tag}>Өдрийн чухлыг хадлаа.</span>
        <div className={styles.soc}>
          <a href="#">Instagram</a><a href="#">Facebook</a><a href="#">Холбоо</a>
        </div>
      </div>
    </footer>
  );
}
```

`Footer.module.css`: port `footer{}` → `.footer`, `.froot` (+ its `.logo` size override, `.tag`, `.soc`, `.soc a:hover`), and re-declare `.logo` base rules (family/weight/letter-spacing from the header logo) since modules don't share the header's class. `.bang { color: var(--accent); }`.

`src/components/chrome/TabBar.tsx`:

```tsx
"use client";

import styles from "./TabBar.module.css";
import { useUi } from "@/components/ui/UiProvider";

export default function TabBar() {
  const { toast, openSearch } = useUi();
  return (
    <nav className={styles.tabbar}>
      <a className={styles.active} href="/"><span className={styles.ico}>📌</span>Өнөөдөр</a>
      <a href="#" onClick={(e) => { e.preventDefault(); toast("Тайлбар хуудас (демо)"); }}><span className={styles.ico}>📰</span>Тайлбар</a>
      <a href="#video"><span className={styles.ico}>▶️</span>Видео</a>
      <a href="#" onClick={(e) => { e.preventDefault(); toast("Үйл явдал хуудас (демо)"); }}><span className={styles.ico}>📅</span>Үйл явдал</a>
      <a href="#" onClick={(e) => { e.preventDefault(); openSearch(); }}><span className={styles.ico}>⌕</span>Хайх</a>
    </nav>
  );
}
```

`TabBar.module.css`: port `.tabbar{display:none}` plus the whole `@media(max-width:700px)` `.tabbar` block (`.tabbar`, `.tabbar a`, `.tabbar a.active` → `.tabbar .active`, `.tabbar .ico`).

- [ ] **Step 8: Wire UiProvider into `src/app/layout.tsx`**

Wrap children: `<UiProvider>{children}</UiProvider>` (import from `@/components/ui/UiProvider`).

- [ ] **Step 9: Verify**

Run: `npm test && npx tsc --noEmit && npm run build`
Expected: all pass.

- [ ] **Step 10: Commit**

```bash
git add src
git commit -m "feat: UI provider (toast/audio/search), reveal, header/footer/tabbar"
```

---

### Task 5: Homepage main column — TodayBar, FeatureCard, DayChips, PinCard, Quiz

**Files:**
- Create: `src/components/home/TodayBar.tsx` + `.module.css`, `src/components/home/FeatureCard.tsx` + `.module.css`, `src/components/home/DayChips.tsx` + `.module.css`, `src/components/home/PinCard.tsx` + `.module.css`, `src/components/home/SectionBar.tsx` + `.module.css`, `src/components/home/Quiz.tsx` + `.module.css`, `src/components/home/Quiz.test.tsx`
- Test: `src/components/home/Quiz.test.tsx`

**Interfaces:**
- Consumes: `useUi`, `Reveal` (Task 4); `Article`, `DigestPin`, `DailyDigest` types (Task 3)
- Produces:
  - `<TodayBar digest={DailyDigest}/>`
  - `<FeatureCard article={Article}/>`
  - `<DayChips chips={{label,date,active}[]}/>`
  - `<PinCard pin={DigestPin} num={string}/>` (renders lead/regular/sponsored variants from the article data)
  - `<SectionBar title={string} meta={string} onDark?: boolean/>`
  - `<Quiz/>`

- [ ] **Step 1: `SectionBar`**

```tsx
import styles from "./SectionBar.module.css";
import Reveal from "@/components/ui/Reveal";

export default function SectionBar({ title, meta, onDark = false }: { title: string; meta: string; onDark?: boolean }) {
  return (
    <Reveal className={`${styles.secbar} ${onDark ? styles.onDark : ""}`}>
      <span className={styles.bdot} />
      <h3>{title}</h3>
      <span className={styles.meta}>{meta}</span>
    </Reveal>
  );
}
```

CSS: port `.secbar` (+`.bdot`, `h3`, `.meta`, `.secbar.on-dark` → `.secbar.onDark` and `.secbar.on-dark h3` → `.onDark h3`).

- [ ] **Step 2: `TodayBar`**

```tsx
"use client";

import styles from "./TodayBar.module.css";
import Reveal from "@/components/ui/Reveal";
import { useUi } from "@/components/ui/UiProvider";
import type { DailyDigest } from "@/lib/content/types";

export default function TodayBar({ digest }: { digest: DailyDigest }) {
  const { playAudio } = useUi();
  return (
    <Reveal className={styles.todaybar}>
      <div className={styles.tbl}>
        <h1 className={styles.tbk}><span className={styles.bdot} />Өнөөдрийн пин</h1>
        <span className={styles.tbt}>— мэдэхэд хангалттай.</span>
      </div>
      <div className={styles.tbr}>
        <button className={styles.listen} onClick={() => playAudio("Өнөөдрийн пин — бүтэн дугаар", "7:00")}>
          <span className={styles.lp} />Дугаарыг сонсох · 7:00
        </button>
        <span className={styles.tbm}>
          <b>{digest.storyCount}</b> мэдээ · <b>{digest.totalMinutes}</b> минут · {digest.updatedAtLabel}
        </span>
      </div>
    </Reveal>
  );
}
```

CSS: port `.todaybar` block (`.tbl`, `.tbk`, `.tbk .bdot` → `.bdot`, `.tbt`, `.tbr`, `.tbm`, `.tbm b`) plus the shared `.listen`/`.lp` rules (copy the `.listen` selector group into this module).

- [ ] **Step 3: `FeatureCard`**

```tsx
"use client";

import Link from "next/link";
import styles from "./FeatureCard.module.css";
import Reveal from "@/components/ui/Reveal";
import { useUi } from "@/components/ui/UiProvider";
import type { Article } from "@/lib/content/types";

export default function FeatureCard({ article }: { article: Article }) {
  const { toast } = useUi();
  return (
    <Reveal className={styles.outer}>
      <Link href={`/${article.slug}`} className={styles.feature}>
        <div className={styles.featArt}>
          <svg viewBox="0 0 600 420" preserveAspectRatio="xMidYMid slice">
            <rect width="600" height="420" fill="#16130F" />
            <rect x="60" y="90" width="70" height="330" fill="#B23A26" />
            <rect x="150" y="0" width="90" height="420" fill="#E8442E" />
            <rect x="262" y="150" width="70" height="270" fill="#16130F" stroke="#2A241C" />
            <rect x="352" y="60" width="80" height="360" fill="#D96C4A" />
            <rect x="452" y="180" width="70" height="240" fill="#8A2D1D" />
            <circle cx="300" cy="120" r="150" fill="none" stroke="#E8A87C" strokeWidth="34" strokeDasharray="240 700" />
            <circle cx="470" cy="80" r="34" fill="#E8A87C" />
          </svg>
          <button
            className={styles.featVidchip}
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); toast("Видео тоглуулна (демо)"); }}
          >
            <span className={styles.tri} /> Видео тайлбар · 3:05
          </button>
        </div>
        <div className={styles.featBody}>
          <span className={styles.cat}>Онцлох · {article.category.name}</span>
          <h2>{article.title}</h2>
          <p>Иргэн, бизнес эрхлэгч бүрийн мэдэх ёстой 5 өөрчлөлт.</p>
          <div className={styles.featCta}><span>Уншиж эхлэх</span><span className={styles.arr}>⟶</span></div>
        </div>
      </Link>
    </Reveal>
  );
}
```

CSS: port `.feature` (grid, hover `.arr` transform), `.feat-art` → `.featArt`, `.feat-body` → `.featBody` (+`.cat`, `h2`, `p`), `.feat-cta` → `.featCta` (+`.arr`), `.feat-vidchip` → `.featVidchip` (+`.tri`), and the 880px media query. `.outer` is an empty hook class (Reveal wrapper needs one). Make `.feature { display:grid; ... }` apply on the `<a>`.

- [ ] **Step 4: `DayChips`**

```tsx
"use client";

import styles from "./DayChips.module.css";
import Reveal from "@/components/ui/Reveal";
import { useUi } from "@/components/ui/UiProvider";

export default function DayChips({ chips }: { chips: { label: string; date: string; active: boolean }[] }) {
  const { toast } = useUi();
  return (
    <Reveal className={styles.daysbar}>
      {chips.map((c) => (
        <button
          key={c.date}
          className={`${styles.daychip} ${c.active ? styles.active : ""}`}
          onClick={c.active ? undefined : () => toast(`${c.label.slice(-5)}-ны пинүүд (демо)`)}
        >
          {c.label}
        </button>
      ))}
      <button className={`${styles.daychip} ${styles.arch}`} onClick={() => toast("Архив хуудас (демо)")}>
        Бүх архив →
      </button>
    </Reveal>
  );
}
```

CSS: port `.daysbar`, `.daychip` (+`:hover`, `.daychip.active` → `.daychip.active` both local, `.daychip.arch`).

- [ ] **Step 5: `PinCard`**

```tsx
"use client";

import styles from "./PinCard.module.css";
import Reveal from "@/components/ui/Reveal";
import { useUi } from "@/components/ui/UiProvider";
import Link from "next/link";
import type { DigestPin } from "@/lib/content/types";

export default function PinCard({ pin, num }: { pin: DigestPin; num: string }) {
  const { toast, playAudio } = useUi();
  const a = pin.article;
  const sponsored = Boolean(a.sponsored);
  const cls = [styles.pin, pin.lead ? styles.lead : "", sponsored ? styles.sponsored : ""].filter(Boolean).join(" ");

  return (
    <Reveal as="article" className={cls}>
      <div className={styles.num}>{sponsored ? "S" : num}</div>
      <div>
        <div className={styles.cat}>
          {sponsored ? (
            <><span className={styles.pbadge}>Powered by</span>{a.sponsored!.partner} · Хамтарсан контент</>
          ) : pin.lead ? (
            <>Нэг гол зүйл · {a.category.name}</>
          ) : (
            a.category.name
          )}
        </div>
        <h4><Link href={`/${a.slug}`}>{a.title}</Link></h4>
        <p className={styles.why}>
          <b>{sponsored ? "Товчхон" : "Яагаад чухал вэ?"}</b>
          {a.whyItMatters}
          {sponsored && <i> {a.sponsored!.disclosure}</i>}
        </p>
        {pin.lead && (
          <>
            <ul className={styles.bullets}>
              {a.keyPoints.map((k) => {
                const [head, ...rest] = k.split(":");
                return <li key={k}><b>{head}:</b>{rest.join(":")}</li>;
              })}
            </ul>
            <Link className={styles.godeeper} href={`/${a.slug}`}>Гүнзгийрэх ⟶</Link>
          </>
        )}
        <div className={styles.pmeta}>
          <span className={styles.auth}>
            <i className={styles.av} style={sponsored ? { background: "var(--gold)" } : undefined}>{a.author.initials}</i>
            {a.author.name}
          </span>
          {a.listenDuration && (
            <button className={styles.listen} onClick={() => playAudio(a.title, a.listenDuration!)}>
              <span className={styles.lp} />Сонсох{pin.lead ? ` · ${a.listenDuration}` : ""}
            </button>
          )}
          <span>{a.readMinutes} мин унших</span>
          <span className={styles.save} onClick={() => toast("Пинлэгдлээ 📌")}>+ ПИНЛЭХ</span>
        </div>
      </div>
    </Reveal>
  );
}
```

CSS: port the whole `.pin` family verbatim: `.pin`, `.pin .num` → `.num`, `.cat`, `.pin h4` (+hover via `.pin:hover h4`), `.why` (+`.why b`), `.pmeta` (+`.save`), `.pin.lead h4`/`.pin.lead .num` → `.pin.lead` combos (both classes local), `.bullets` (+`li`, `li::before`, `li b`), `.godeeper` (+`:hover`), `.listen`/`.lp`, `.pin.sponsored` (+`.num`,`.cat` gold overrides, `.why i`), `.pbadge`, `.auth`/`.av`, and the mobile `.pin{grid-template-columns:50px 1fr;...}` rule.

- [ ] **Step 6: Write failing Quiz test — `src/components/home/Quiz.test.tsx`**

```tsx
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import UiProvider from "@/components/ui/UiProvider";
import Quiz from "./Quiz";

describe("Quiz", () => {
  it("marks the correct answer and disables options after a wrong pick", async () => {
    const user = userEvent.setup();
    render(<UiProvider><Quiz /></UiProvider>);
    await user.click(screen.getByRole("button", { name: "Бууруулсан" }));
    expect(screen.getByRole("button", { name: "Хэвээр хадгалсан" })).toHaveAttribute("data-state", "ok");
    expect(screen.getByRole("button", { name: "Бууруулсан" })).toHaveAttribute("data-state", "no");
    expect(screen.getByRole("button", { name: "Нэмэгдүүлсэн" })).toBeDisabled();
  });

  it("marks only the picked correct answer as ok", async () => {
    const user = userEvent.setup();
    render(<UiProvider><Quiz /></UiProvider>);
    await user.click(screen.getByRole("button", { name: "Хэвээр хадгалсан" }));
    expect(screen.getByRole("button", { name: "Хэвээр хадгалсан" })).toHaveAttribute("data-state", "ok");
    expect(screen.getByRole("button", { name: "Бууруулсан" })).toHaveAttribute("data-state", "no");
  });
});
```

Run: `npx vitest run src/components/home/Quiz.test.tsx` — Expected: FAIL (Quiz missing).

- [ ] **Step 7: Implement `Quiz`**

```tsx
"use client";

import { useState } from "react";
import styles from "./Quiz.module.css";
import Reveal from "@/components/ui/Reveal";
import { useUi } from "@/components/ui/UiProvider";

const OPTIONS = [
  { label: "Бууруулсан", ok: false },
  { label: "Хэвээр хадгалсан", ok: true },
  { label: "Нэмэгдүүлсэн", ok: false },
];

export default function Quiz() {
  const { toast } = useUi();
  const [picked, setPicked] = useState<number | null>(null);

  const pick = (i: number) => {
    if (picked !== null) return;
    setPicked(i);
    toast(OPTIONS[i].ok ? "Зөв! 🎯 1/5 — дараагийн асуулт (демо)" : "Харамсалтай! Зөв хариултыг тодруулав");
  };

  const stateOf = (i: number): string | undefined => {
    if (picked === null) return undefined;
    if (OPTIONS[i].ok) return "ok";
    if (i === picked) return "no";
    return OPTIONS[picked].ok ? "no" : undefined;
  };

  return (
    <Reveal as="section" className={styles.quiz}>
      <div>
        <span className={styles.k}>Пин сорил · №32</span>
        <h3>Энэ 7 хоногийг санаж үлдэв үү?</h3>
        <p>Долоо хоногийн пинүүдээс автоматаар үүсдэг 5 асуулт. Баасан бүр шинэчлэгдэнэ — оноогоо картаар хуваалцаж, найзаа сориорой.</p>
        <div className={styles.qmeta}>
          <span>5 асуулт</span><span>·</span><span>2 минут</span><span>·</span>
          <span className={styles.qshare} onClick={() => toast("Оноонд зориулсан карт үүслээ (демо) 🎯")}>Оноогоо хуваалцах →</span>
        </div>
      </div>
      <div className={styles.qcard}>
        <div className={styles.qnum}>Асуулт 1/5</div>
        <h4>Төв банк энэ долоо хоногт бодлогын хүүгээ яасан бэ?</h4>
        {OPTIONS.map((o, i) => (
          <button
            key={o.label}
            className={styles.qopt}
            data-state={stateOf(i)}
            disabled={picked !== null}
            onClick={() => pick(i)}
          >
            {o.label}
          </button>
        ))}
        <div className={styles.qhint}>Санахгүй байна уу? — Пин №01-ийг дахин хараарай</div>
      </div>
    </Reveal>
  );
}
```

CSS: port `.quiz` family; the `.qopt.ok`/`.qopt.no` rules become attribute selectors: `.qopt[data-state="ok"]{...}` and `.qopt[data-state="no"]{...}`. Add `.qopt:disabled { pointer-events: none; }`.

- [ ] **Step 8: Run tests + typecheck**

Run: `npm test && npx tsc --noEmit`
Expected: PASS.

- [ ] **Step 9: Commit**

```bash
git add src/components/home
git commit -m "feat: homepage main-column components (today bar, feature, chips, pins, quiz)"
```

---

### Task 6: Sidebar, VideoBand, Manifesto

**Files:**
- Create: `src/components/home/Sidebar.tsx` + `Sidebar.module.css`, `src/components/home/VideoBand.tsx` + `VideoBand.module.css`, `src/components/home/Manifesto.tsx` + `Manifesto.module.css`

**Interfaces:**
- Consumes: `useUi`, `Reveal`, `SectionBar`; `EventItem`, `VideoItem` types
- Produces: `<Sidebar events={EventItem[]} mostPinned={string[]}/>`, `<VideoBand videos={VideoItem[]}/>`, `<Manifesto/>`

- [ ] **Step 1: `Sidebar`**

```tsx
"use client";

import styles from "./Sidebar.module.css";
import Reveal from "@/components/ui/Reveal";
import { useUi } from "@/components/ui/UiProvider";
import type { EventItem } from "@/lib/content/types";

export default function Sidebar({ events, mostPinned }: { events: EventItem[]; mostPinned: string[] }) {
  const { toast } = useUi();
  return (
    <aside className={styles.aside}>
      <Reveal className={styles.nlbox}>
        <span className={styles.k}>Өглөө бүр · 07:30</span>
        <h4>Инбокс руугаа пиндээрэй</h4>
        <p>Өдрийн хамгийн чухал мэдээ — имэйлээр, 7 минутад.</p>
        <div className={styles.nlform}>
          <input type="email" placeholder="И-мэйл хаяг" />
          <button onClick={() => toast("Баярлалаа! Маргааш 07:30-д уулзъя 📬")}>ПИНЛЭХ →</button>
        </div>
        <div className={styles.fine}>Спамгүй. Хэзээ ч цуцалж болно.</div>
      </Reveal>

      <Reveal className={styles.sidesec}>
        <div className={styles.shead}><h5>Энэ 7 хоногт</h5><span>→</span></div>
        {events.map((e) => (
          <div key={e.title} className={styles.evrow}>
            <div className={styles.d}>{e.day}<small>{e.monthLabel}</small></div>
            <div><h6>{e.title}</h6><span>{e.venue}</span></div>
          </div>
        ))}
      </Reveal>

      <Reveal className={styles.sidesec}>
        <div className={styles.shead}><h5>Их пинлэгдсэн</h5><span>🔥</span></div>
        {mostPinned.map((t, i) => (
          <div key={t} className={styles.toprow} onClick={() => toast("Мэдээ рүү (демо)")}>
            <em>{String(i + 1).padStart(2, "0")}</em>{t}
          </div>
        ))}
      </Reveal>

      <Reveal className={styles.adslot}>
        <span className={styles.adlbl}>Сурталчилгаа</span>
        <div className={styles.adcard}>
          <span className={styles.lbl}>Хас Банк</span>
          <h4>Дижитал зээл — 10 минутад шийдвэр</h4>
          <p>Апп-аар хүсэлтээ илгээгээд, хариугаа шууд аваарай.</p>
          <a href="#" onClick={(e) => { e.preventDefault(); toast("Спонсорын хуудас (демо)"); }}>Дэлгэрэнгүй</a>
        </div>
      </Reveal>
    </aside>
  );
}
```

CSS: port `aside{padding-top:38px}` → `.aside`, `.nlbox` family (`.k`, `h4`, `p`, `.nlform` + `input` + `button` + `:hover`, `.fine`), `.sidesec` (+`.shead`, `h5`, `span`), `.evrow` (+`.d`, `.d small`, `h6`, `span`, `:last-child`), `.toprow` (+`em`, `:hover`, `:last-child`), `.adslot`/`.adlbl`/`.adcard` (+`.lbl`, `h4`, `p`, `a`).

- [ ] **Step 2: `VideoBand`**

The five SVG art variants live in a local `Palette` component keyed by `video.palette` — copy each `<svg>` from the mockup's five `.vcard` blocks verbatim (JSX-ified attributes: `strokeWidth`, `strokeDasharray`).

```tsx
"use client";

import styles from "./VideoBand.module.css";
import Reveal from "@/components/ui/Reveal";
import SectionBar from "./SectionBar";
import { useUi } from "@/components/ui/UiProvider";
import type { VideoItem } from "@/lib/content/types";

function Palette({ n }: { n: number }) {
  switch (n) {
    case 0:
      return (
        <svg viewBox="0 0 600 500" preserveAspectRatio="xMidYMid slice">
          <rect width="600" height="500" fill="#221B12" />
          <circle cx="440" cy="130" r="180" fill="none" stroke="#D96C4A" strokeWidth="40" strokeDasharray="300 900" />
          <rect x="80" y="180" width="90" height="320" fill="#E8442E" />
          <rect x="200" y="260" width="80" height="240" fill="#8A2D1D" />
          <rect x="310" y="220" width="90" height="280" fill="#E8A87C" />
          <circle cx="140" cy="110" r="40" fill="#E8A87C" />
        </svg>
      );
    case 1:
      return (
        <svg viewBox="0 0 600 375" preserveAspectRatio="xMidYMid slice">
          <rect width="600" height="375" fill="#1C2430" />
          <rect x="60" y="120" width="70" height="255" fill="#3D5A72" />
          <rect x="170" y="60" width="80" height="315" fill="#E8442E" />
          <circle cx="420" cy="120" r="120" fill="none" stroke="#7F97B8" strokeWidth="30" strokeDasharray="190 600" />
        </svg>
      );
    case 2:
      return (
        <svg viewBox="0 0 600 375" preserveAspectRatio="xMidYMid slice">
          <rect width="600" height="375" fill="#241B26" />
          <rect x="90" y="90" width="85" height="285" fill="#6D4A72" />
          <rect x="210" y="160" width="75" height="215" fill="#E8442E" />
          <circle cx="440" cy="260" r="110" fill="none" stroke="#B88A9E" strokeWidth="28" strokeDasharray="170 600" />
        </svg>
      );
    case 3:
      return (
        <svg viewBox="0 0 600 375" preserveAspectRatio="xMidYMid slice">
          <rect width="600" height="375" fill="#16130F" />
          <rect x="70" y="70" width="80" height="305" fill="#E8442E" />
          <rect x="180" y="140" width="70" height="235" fill="#D96C4A" />
          <circle cx="430" cy="150" r="100" fill="#E8A87C" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 600 375" preserveAspectRatio="xMidYMid slice">
          <rect width="600" height="375" fill="#14201A" />
          <rect x="100" y="100" width="75" height="275" fill="#2E5E4E" />
          <rect x="210" y="60" width="85" height="315" fill="#E8442E" />
          <circle cx="450" cy="120" r="90" fill="none" stroke="#7FAE8E" strokeWidth="26" strokeDasharray="150 500" />
        </svg>
      );
  }
}

export default function VideoBand({ videos }: { videos: VideoItem[] }) {
  const { toast } = useUi();
  return (
    <section className={styles.vband} id="video">
      <div className="wrap">
        <SectionBar title="Үзэх ёстой" meta="PIN Видео" onDark />
        <div className={styles.vgrid}>
          {videos.map((v) => (
            <Reveal
              key={v.id}
              as="article"
              delay={v.delay}
              className={`${styles.vcard} ${v.size === "big" ? styles.big : ""}`}
            >
              <div className={styles.art} onClick={() => toast("Видео тоглуулна (демо)")}>
                <Palette n={v.palette} />
                <div className={`${styles.vplay} ${v.size === "small" ? styles.sm : ""}`} />
                <span className={styles.vdur}>{v.duration}</span>
              </div>
              <div className={styles.vinfo}>
                <div className={styles.vcat}>{v.category}</div>
                <h4>{v.title}</h4>
                <div className={styles.vm}>{v.meta}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
```

CSS: port `.vband`, `.vgrid` (+media queries), `.vcard` (+`.vcard.big`, `.art`, `.big .art`, `.art svg` hover), `.vplay` (+`::after`, hover, `.sm`), `.vdur`, `.vinfo` family.

- [ ] **Step 3: `Manifesto`**

```tsx
import styles from "./Manifesto.module.css";
import Reveal from "@/components/ui/Reveal";

const VALS = [
  { n: "01", h: "Сонгоно", p: "Өдөрт заавал мэдэх цөөхөн сэдэв." },
  { n: "02", h: "Тайлбарлана", p: "Яагаад чухлыг нь товч, тодорхой." },
  { n: "03", h: "Хүндэтгэнэ", p: "Таны цаг, анхаарал, итгэлийг." },
];

export default function Manifesto() {
  return (
    <section className={styles.manif} id="manif">
      <div className="wrap">
        <Reveal className={styles.k}>PIN гэж юу вэ?</Reveal>
        <Reveal as="h2" delay={1} className={styles.h2}>
          Илүү их мэдээ биш.<br /><span className={styles.ital}>Илүү их ойлголт.</span>
        </Reveal>
        <Reveal delay={2} className={styles.vals}>
          {VALS.map((v) => (
            <div key={v.n} className={styles.val}>
              <div className={styles.n}>{v.n}</div>
              <h5>{v.h}</h5>
              <p>{v.p}</p>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
```

CSS: port `.manif` (+`.k`, `h2` → `.h2`, `.ital`, `.vals`, `.val` family, media queries).

- [ ] **Step 4: Verify**

Run: `npm test && npx tsc --noEmit`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/home
git commit -m "feat: sidebar, video band, manifesto"
```

---

### Task 7: Homepage assembly

**Files:**
- Modify: `src/app/page.tsx`
- Create: `src/app/page.module.css`

**Interfaces:**
- Consumes: everything from Tasks 3–6
- Produces: complete `/` route

- [ ] **Step 1: Replace `src/app/page.tsx`**

```tsx
import styles from "./page.module.css";
import Header from "@/components/chrome/Header";
import Footer from "@/components/chrome/Footer";
import TabBar from "@/components/chrome/TabBar";
import TodayBar from "@/components/home/TodayBar";
import FeatureCard from "@/components/home/FeatureCard";
import DayChips from "@/components/home/DayChips";
import PinCard from "@/components/home/PinCard";
import SectionBar from "@/components/home/SectionBar";
import Quiz from "@/components/home/Quiz";
import Sidebar from "@/components/home/Sidebar";
import VideoBand from "@/components/home/VideoBand";
import Manifesto from "@/components/home/Manifesto";
import {
  getDigest, getDigestDayChips, getEvents, getFeatured, getMostPinned, getVideos,
} from "@/lib/content/accessors";

export default function Home() {
  const digest = getDigest();
  let num = 0;

  return (
    <>
      <Header dateLabel={`${digest.dateLabel} · ${digest.weekdayLabel}`} />
      <section className={styles.hero}>
        <div className="wrap">
          <TodayBar digest={digest} />
          <FeatureCard article={getFeatured()} />
        </div>
      </section>

      <div className="wrap">
        <SectionBar title="Өдрийн пинүүд" meta={`${digest.pins.length} мэдээ · 10 минут`} />
        <DayChips chips={getDigestDayChips()} />
        <div className={styles.grid}>
          <main>
            {digest.pins.map((pin) => {
              if (!pin.article.sponsored) num += 1;
              return <PinCard key={pin.article.slug} pin={pin} num={String(num).padStart(2, "0")} />;
            })}
          </main>
          <Sidebar events={getEvents()} mostPinned={getMostPinned()} />
        </div>
      </div>

      <div className="wrap">
        <Quiz />
      </div>

      <VideoBand videos={getVideos()} />
      <Manifesto />
      <Footer />
      <TabBar />
    </>
  );
}
```

- [ ] **Step 2: Create `src/app/page.module.css`**

Port `.hero{padding:26px 0 44px}` (+ mobile `padding:16px 0 26px`) and `.grid` (+960px media query) from the homepage mockup.

- [ ] **Step 3: Verify in browser**

Run: `npm run dev` and open `http://localhost:3000`. Compare side-by-side against `docs/mockups/pin-homepage-v6.html` opened directly in the browser. Check: sticky header, today bar, feature card, 5 pins (sponsored gold treatment on #S), day chips, quiz interaction, video band grid, manifesto, footer; search overlay via ⌕ and `/` key; audio player bar via any Сонсох button; mobile layout (narrow window: tab bar appears, nav hides).

- [ ] **Step 4: Verify build + tests**

Run: `npm test && npx tsc --noEmit && npm run build`
Expected: PASS; `/` static.

- [ ] **Step 5: Commit**

```bash
git add src/app
git commit -m "feat: homepage assembly"
```

---

### Task 8: Article page — components, route, metadata, JSON-LD (TDD for metadata)

**Files:**
- Create: `src/lib/metadata.ts`, `src/lib/metadata.test.ts`, `src/app/[slug]/page.tsx`, `src/app/[slug]/article.module.css`, `src/components/article/ArticleBody.tsx`, `src/components/article/ShareRail.tsx`, `src/components/article/ArticleSidebar.tsx`, `src/components/article/ProgressBar.tsx` (all styled from `article.module.css` or their own modules — implementer's choice, one module file `article.module.css` shared via imports is acceptable here because the article mockup is a single cohesive stylesheet)

**Interfaces:**
- Consumes: `Article`, `getArticle`, `getAllArticles` (Task 3); `useUi` (Task 4)
- Produces:
  - `buildArticleMetadata(article: Article): Metadata` and `buildNewsArticleJsonLd(article: Article): object` from `@/lib/metadata`
  - Route `/[slug]` with `generateStaticParams`, `generateMetadata`, 404 for unknown slugs

- [ ] **Step 1: Write failing metadata tests — `src/lib/metadata.test.ts`**

```ts
import { describe, expect, it } from "vitest";
import { buildArticleMetadata, buildNewsArticleJsonLd } from "./metadata";
import { getArticle } from "./content/accessors";

const article = getArticle("tatvaryn-shinechlel")!;

describe("buildArticleMetadata", () => {
  it("emits the §4.5 tag set", () => {
    const m = buildArticleMetadata(article);
    expect(m.title).toBe("Намрын чуулган: Татварын шинэчлэл юуг өөрчлөх вэ? — PIN");
    expect(m.alternates?.canonical).toBe("https://pin.mn/tatvaryn-shinechlel");
    const og = m.openGraph as Record<string, unknown>;
    expect(og.type).toBe("article");
    expect(og.siteName).toBe("PIN");
    expect(og.locale).toBe("mn_MN");
    expect(og.url).toBe("https://pin.mn/tatvaryn-shinechlel");
    expect(m.twitter).toMatchObject({ card: "summary_large_image" });
  });

  it("falls back to title/lead when social fields are absent", () => {
    const a = getArticle("shine-avtobusny-chiglel")!;
    const m = buildArticleMetadata(a);
    const og = m.openGraph as Record<string, unknown>;
    expect(og.title).toBe(a.title);
    expect(og.description).toBe(a.lead);
  });
});

describe("buildNewsArticleJsonLd", () => {
  it("emits a NewsArticle with publisher PIN", () => {
    const ld = buildNewsArticleJsonLd(article) as Record<string, unknown>;
    expect(ld["@type"]).toBe("NewsArticle");
    expect(ld.headline).toBe(article.title);
    expect((ld.publisher as Record<string, unknown>).name).toBe("PIN");
    expect(ld.datePublished).toBe(article.publishedAt);
  });
});
```

Run: `npx vitest run src/lib/metadata.test.ts` — Expected: FAIL (module missing).

- [ ] **Step 2: Implement `src/lib/metadata.ts`**

```ts
import type { Metadata } from "next";
import type { Article } from "./content/types";

const SITE = "https://pin.mn";
const PLACEHOLDER_OG = `${SITE}/og-placeholder.png`; // replaced by the Satori card engine in a later milestone

export function buildArticleMetadata(article: Article): Metadata {
  const title = article.socialTitle ?? article.title;
  const description = article.socialDescription ?? article.lead;
  const url = `${SITE}/${article.slug}`;
  return {
    title: `${article.title} — PIN`,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      siteName: "PIN",
      locale: "mn_MN",
      title,
      description,
      url,
      images: [{ url: PLACEHOLDER_OG, width: 1200, height: 630, alt: article.title }],
      publishedTime: article.publishedAt,
      modifiedTime: article.modifiedAt ?? article.publishedAt,
      section: article.category.name,
      tags: article.tags,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [PLACEHOLDER_OG],
    },
  };
}

export function buildNewsArticleJsonLd(article: Article): object {
  return {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article.title,
    datePublished: article.publishedAt,
    dateModified: article.modifiedAt ?? article.publishedAt,
    author: { "@type": "Person", name: article.author.name },
    publisher: {
      "@type": "Organization",
      name: "PIN",
      logo: { "@type": "ImageObject", url: `${SITE}/logo.png` },
    },
    image: [PLACEHOLDER_OG],
    mainEntityOfPage: `${SITE}/${article.slug}`,
  };
}
```

- [ ] **Step 3: Run metadata tests**

Run: `npx vitest run src/lib/metadata.test.ts` — Expected: PASS.

- [ ] **Step 4: Article components**

`src/components/article/ProgressBar.tsx`:

```tsx
"use client";

import { useEffect, useState } from "react";
import styles from "@/app/[slug]/article.module.css";

export default function ProgressBar() {
  const [pct, setPct] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      setPct((h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return <div className={styles.progress} style={{ width: `${pct}%` }} />;
}
```

`src/components/article/ShareRail.tsx` — client; four `.shareBtn` buttons with the mockup's inline SVGs (Facebook, X, link, 📌) each firing the mockup's toast text, plus `.shareCount` ("1.2К хуваалцсан").

`src/components/article/ArticleBody.tsx` — client (needs toast for the follow button and video block):

```tsx
"use client";

import styles from "@/app/[slug]/article.module.css";
import { useUi } from "@/components/ui/UiProvider";
import type { Article, BodyBlock } from "@/lib/content/types";

function Block({ block, toast }: { block: BodyBlock; toast: (m: string) => void }) {
  switch (block.type) {
    case "whatHappened":
      return (
        <div className={styles.block}>
          <div className={styles.blockLabel}>{block.label}</div>
          {block.paragraphs.map((p) => <p key={p}>{p}</p>)}
          {block.bullets && <ul>{block.bullets.map((b) => <li key={b}>{b}</li>)}</ul>}
        </div>
      );
    case "whyItMatters":
      return (
        <div className={`${styles.block} ${styles.view}`}>
          <div className={styles.blockLabel}>{block.label}</div>
          {block.paragraphs.map((p) => <p key={p}>{p}</p>)}
        </div>
      );
    case "quote":
      return (
        <div className={styles.pull}>
          {block.text}
          <span>{block.attribution}</span>
        </div>
      );
    case "video":
      return (
        <div className={styles.block}>
          <div className={styles.blockLabel}>{block.label}</div>
          <div className={styles.inlineVideo} onClick={() => toast("Видео тоглуулна (демо)")}>
            <div className={styles.play} />
            <span className={styles.duration}>{block.duration}</span>
            <div className={styles.ivBody}>{block.title}</div>
          </div>
          <p className={styles.caption}>{block.caption}</p>
        </div>
      );
    case "whatsNext":
      return (
        <div className={styles.block}>
          <div className={styles.blockLabel}>{block.label}</div>
          {block.paragraphs.map((p) => <p key={p}>{p}</p>)}
          <button className={`${styles.btn} ${styles.accent}`} onClick={() => toast("Энэ сэдвийг пинлэлээ 📌 — шинэчлэл бүрд мэдэгдэнэ")}>
            📌 Энэ сэдвийг дагах
          </button>
        </div>
      );
  }
}

export default function ArticleBody({ article }: { article: Article }) {
  const { toast } = useUi();
  return (
    <>
      {article.body.map((b, i) => <Block key={i} block={b} toast={toast} />)}
      <div className={styles.tags}>
        {article.tags.map((t) => (
          <a key={t} href="#" onClick={(e) => { e.preventDefault(); toast("Таг хуудас (демо)"); }}>#{t}</a>
        ))}
      </div>
    </>
  );
}
```

`src/components/article/ArticleSidebar.tsx` — client; the three boxes from the article mockup: related pins (three `.rel` rows, static copy from mockup), dark newsletter box (toast on button), ad MPU (toast on button).

- [ ] **Step 5: Route — `src/app/[slug]/page.tsx`**

```tsx
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import styles from "./article.module.css";
import { getAllArticles, getArticle } from "@/lib/content/accessors";
import { buildArticleMetadata, buildNewsArticleJsonLd } from "@/lib/metadata";
import ProgressBar from "@/components/article/ProgressBar";
import ShareRail from "@/components/article/ShareRail";
import ArticleBody from "@/components/article/ArticleBody";
import ArticleSidebar from "@/components/article/ArticleSidebar";
import Footer from "@/components/chrome/Footer";
import Header from "@/components/chrome/Header";
import TabBar from "@/components/chrome/TabBar";

export function generateStaticParams() {
  return getAllArticles().map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) return {};
  return buildArticleMetadata(article);
}

function formatWhen(iso: string, readMinutes: number): string {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}.${pad(d.getMonth() + 1)}.${pad(d.getDate())} · ${pad(d.getHours())}:${pad(d.getMinutes())} · ${readMinutes} мин унших`;
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();

  return (
    <div className={styles.articleRoot}>
      <ProgressBar />
      <Header dateLabel="08.07 · ПҮРЭВ" />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildNewsArticleJsonLd(article)) }}
      />
      <div className={`wrap ${styles.articleGrid}`}>
        <ShareRail />
        <main>
          <div className={styles.crumb}>Нүүр / {article.category.name} / <b>Онцлох</b></div>
          <span className={styles.tag}>{article.category.name} · Тайлбар</span>
          <h1 className={styles.title}>{article.title}</h1>
          <p className={styles.lead}>{article.lead}</p>
          <div className={styles.byline}>
            <div className={styles.avatar} />
            <div>
              <div className={styles.who}>{article.author.name}{article.author.role ? ` · ${article.author.role}` : ""}</div>
              <div className={styles.when}>{formatWhen(article.publishedAt, article.readMinutes)}</div>
            </div>
            {article.listenDuration && <button className={styles.listenBtn}>🎧 Сонсох · {article.listenDuration}</button>}
          </div>
          <div className={styles.heroImg} />
          <p className={styles.caption}>Төрийн ордон, 2026 оны наймдугаар сар. Зураг: PIN</p>
          <ArticleBody article={article} />
        </main>
        <ArticleSidebar />
      </div>
      <Footer />
      <TabBar />
    </div>
  );
}
```

Note: `ArticlePage`/`generateMetadata` receive `params` as a **Promise** (Next 15+); always `await` it.

- [ ] **Step 6: `src/app/[slug]/article.module.css`**

Port the whole stylesheet of `docs/mockups/pin-article.html` into this module. Renames: `.progress` stays, `.article-grid` → `.articleGrid`, `.share-rail` → `.shareRail`, `.share-btn` → `.shareBtn`, `.share-count` → `.shareCount`, `h1.title` → `.title`, `.block-label` → `.blockLabel`, `.block.view` → `.block.view` (both local), `.inline-video` → `.inlineVideo`, `.iv-body` → `.ivBody`, `.hero-img` → `.heroImg`, `.nl-form` → `.nlForm`, `.ad-label` → `.adLabel`, `.ad-mpu` → `.adMpu`, `.byline .listen` → `.listenBtn`. Wrap the article mockup's distinct token values as literals on `.articleRoot` (`.articleRoot { background:#FAF8F5; color:#141414; ... }` — the article page intentionally uses its own lighter palette per mockup; the mockup's `--accent` matches the global token so keep `var(--accent)` where it appears). The article page keeps the mockup's system font stack for body text: set `font-family` on `.articleRoot` exactly as the article mockup's `body` rule.

- [ ] **Step 7: Verify in browser**

Run: `npm run dev`; open `http://localhost:3000/tatvaryn-shinechlel` and compare with `docs/mockups/pin-article.html`. Also check `/tov-bank-bodlogyn-huu` (short body) and `/no-such-slug` → 404. View page source: OG tags and JSON-LD present.

- [ ] **Step 8: Verify all gates**

Run: `npm test && npx tsc --noEmit && npm run build`
Expected: PASS; all six article slugs prerendered.

- [ ] **Step 9: Commit**

```bash
git add src public
git commit -m "feat: article page with §4.5 metadata and NewsArticle JSON-LD"
```

---

### Task 9: Final verification and README

**Files:**
- Create: `README.md`
- Modify: none

**Interfaces:**
- Consumes: the finished app
- Produces: milestone acceptance evidence

- [ ] **Step 1: Full gate run**

Run: `npm test && npx tsc --noEmit && npm run lint && npm run build`
Expected: all pass, zero warnings that indicate broken behavior. Fix anything that fails before proceeding.

- [ ] **Step 2: Manual acceptance sweep (spec §9)**

With `npm run dev`:
- `/` faithful to `docs/mockups/pin-homepage-v6.html` (all sections, sponsored pin gold treatment, reveal-on-scroll animation).
- Search overlay: ⌕ button, `/` key, Escape closes, chips set query, filtering works, empty state renders.
- Audio player: opens from any Сонсох, progress ticks, pause/resume, close.
- Quiz: pick wrong → correct highlighted; options lock.
- Mobile ≤700px: tab bar, hidden nav, player sits above tab bar.
- `/tatvaryn-shinechlel` faithful to `docs/mockups/pin-article.html`; progress bar tracks scroll.
- Page source of an article: `og:*`, `twitter:*`, canonical, JSON-LD `NewsArticle`.

- [ ] **Step 3: Write `README.md`**

```markdown
# PIN — pin.mn news portal

Курац мэдээний портал. Milestone 1: frontend on typed mock data
(spec: docs/superpowers/specs/2026-08-18-pin-frontend-milestone1-design.md,
architecture: pintecharchitecture.md.pdf).

## Commands

- `npm run dev` — dev server (http://localhost:3000)
- `npm test` — Vitest unit/component tests
- `npm run build` — production build (all routes prerender)
- `npx tsc --noEmit` — typecheck

## Structure

- `src/lib/content/` — CMS-shaped types, mock data, accessor layer.
  Pages import **accessors only**; swapping in Payload CMS later means
  reimplementing `accessors.ts`, nothing else.
- `src/components/` — v6 design system components (CSS Modules,
  tokens in `src/app/globals.css`)
- `docs/mockups/` — design source of truth (HTML mockups)

## Next milestones (per architecture doc)

1. Payload CMS + PostgreSQL behind the accessor layer
2. Satori share-card engine (og.png 1200×630, fb-card 1080×1080,
   IG carousel 1080×1350, story 1080×1920)
3. Newsletter (listmonk), search (Meilisearch), deploy (Cloudflare edge-first)
```

- [ ] **Step 4: Commit**

```bash
git add README.md
git commit -m "docs: README with structure and milestone roadmap"
```

---

## Self-Review Notes

- Spec coverage: §3 stack → Tasks 1–3; §4 content model → Task 3; §5 routes → Tasks 7–8; §6 SEO → Task 8; §7 components → Tasks 4–6, 8; §8 testing → Tasks 3, 4 (search test), 5 (quiz test), 8 (metadata test); §9 acceptance → Task 9.
- The homepage `.hero` retains only the v6.2 compact today-bar (the old masthero CSS is dead in the mockup and intentionally not ported).
- Type/signature consistency verified: `useUi`, `Reveal`, accessor names, and `AudioState` are used identically across Tasks 4–8.
