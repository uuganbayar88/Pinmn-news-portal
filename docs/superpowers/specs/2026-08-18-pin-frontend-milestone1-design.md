# PIN Frontend — Milestone 1 Design

**Date:** 2026-08-18
**Status:** Approved
**Scope:** First working slice of the pin.mn news portal — frontend on typed mock data.
**Companion documents:** `pintecharchitecture.md.pdf` (full architecture, v1.0 2026-08-07), `pin-homepage-v6.html` (homepage design), `pin-review-hub_2.html` (article page design, embedded), `pin-social-formats.html` (share-card visuals, later milestone).

## 1. Goal

A running Next.js application that renders the approved v6 design as real React components — homepage (today's digest) and article detail page — backed by typed mock data shaped exactly like the future Payload CMS schema. Swapping in the real CMS later must be a data-source change, not a rewrite.

## 2. Non-goals (this milestone)

- Payload CMS, PostgreSQL, Redis/BullMQ — stubbed behind the content interfaces.
- Satori share-card rendering (og.png, fb-card, IG carousel, story) — placeholder static og:image.
- Newsletter backend, search backend, audio hosting, video hosting — demo stubs as in the mockups.
- Deployment/infrastructure (Cloudflare, VPC, UB cache node).

## 3. Stack

| Concern | Choice | Rationale |
|---|---|---|
| Framework | Next.js 15 (App Router, TypeScript strict) | Matches architecture doc; SSG/ISR-ready for the edge-first model |
| Styling | Global design-token stylesheet + CSS Modules per component | Faithful port of the bespoke v6 CSS; Tailwind translation would be slower and lossier |
| Fonts | `next/font/google`: Inter Tight (display), Spectral (serif), Playfair Display (italic), Golos Text (sans) — Cyrillic subsets | Same faces as v6 mockup |
| Tests | Vitest + React Testing Library | Component/data-logic tests only; visual fidelity verified in-browser |
| Package manager | npm | Present on machine; no lockfile conflicts |

Design tokens (from v6): accent `#E8442E`, ink `#16130F`, paper `#F7F3EB`, soft `#6B6157`, line `#E5DED2`, gold `#C9A227`.

## 4. Content model — `src/lib/content/`

TypeScript types mirroring the architecture doc's CMS collections (§4.4, §4.5 field names kept verbatim where the doc names them):

- `Category` — slug, name (mn), color.
- `Author` — name, initials, role.
- `Article` — slug, title, `socialTitle?` (≤60), `socialDescription?` (≤110), lead, `whyItMatters`, `keyPoints[]` (2–4 items, ≤110 chars each), body blocks (Semafor-style: whatHappened / whyItMatters / quote / video / whatsNext), category, author, publishedAt, readMinutes, listenDuration?, `sponsored?` (partner name + disclosure).
- `DailyDigest` — date, ordered pin refs (lead first), stats (count, total minutes, updatedAt).
- `Event` — date, title, venue.
- `Video` — title, category label, duration, views, size (big/small).

Mock data in Mongolian, lifted from the v6 and article mockups, lives in `src/lib/content/mock/`. A thin accessor layer (`getDigest(date)`, `getArticle(slug)`, `getEvents()`, `getVideos()`, `getMostPinned()`) is the only import surface for pages — the future Payload adapter replaces the accessor internals only.

## 5. Routes

| Route | Renders | Source mockup |
|---|---|---|
| `/` | Today bar, featured story, numbered pin list (incl. sponsored treatment), day-switch chips, quiz block, video band, manifesto, sidebar (newsletter box, events, most-pinned, ad slot) | `pin-homepage-v6.html` |
| `/[slug]` | Article page: breadcrumb, tag, title, lead, byline, hero, Semafor-style blocks (Юу болов / Яагаад чухал вэ / pull quote / video / Цаашид), share rail, tags, sidebar (related pins, newsletter, ad), reading-progress bar | article doc embedded in `pin-review-hub_2.html` |

Interactive mockup behaviors ported as client components: search overlay (`/` key, Escape), demo audio player (Zetland-style bottom bar), quiz single-question interaction, mobile tab bar, toasts. All remain demo stubs where the mockup stubs them.

## 6. SEO scaffold

Per-page `generateMetadata` emitting the architecture doc §4.5 tag set: title pattern `{title} — PIN`, description, canonical `https://pin.mn/{slug}`, og:type/site_name/locale (`mn_MN`)/title/description/url/image (+dimensions/alt), article:published_time/modified_time/section/tag, twitter summary_large_image set, NewsArticle JSON-LD. og:image points at a placeholder static asset until the share-card milestone.

## 7. Component inventory

Header, TodayBar, FeatureCard, PinCard (lead / regular / sponsored variants), DayChips, Bullets, GoDeeper, ListenButton, AudioPlayer, SearchOverlay, QuizCard, VideoBand/VideoCard, Manifesto, SidebarNewsletter, SidebarEvents, SidebarMostPinned, SidebarAd, Footer, TabBar, Toast, article-page blocks (BlockLabel, ViewBlock, PullQuote, InlineVideo, ShareRail, RelatedPins, ProgressBar).

Reveal-on-scroll animation (`.rv`) via a small IntersectionObserver hook.

## 8. Testing

- TypeScript strict as the first gate.
- Vitest + RTL for data-driven behavior: digest ordering and date lookup, accessor layer, metadata generation output, quiz interaction, search filtering.
- No screenshot/visual-regression tooling this milestone; fidelity checked manually against mockups.

## 9. Acceptance

`npm run dev` serves: a homepage visually faithful to `pin-homepage-v6.html` with all sections present and mock-interactive; article pages at `/[slug]` faithful to the article mockup; correct OG/meta/JSON-LD in page source; `npm run build`, `npm test`, `tsc --noEmit` all pass.
