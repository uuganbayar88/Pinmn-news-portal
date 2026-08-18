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
