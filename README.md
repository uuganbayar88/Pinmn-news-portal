# PIN — Mongolian news frontend

The existing pin.mn frontend, updated with the approved deep teal and coral design.

- Frontend repository: https://github.com/uuganbayar88/Pinmn-news-portal
- Separate CMS repository: https://github.com/uuganbayar88/pinmn-cms
- Existing Vercel site: https://pinmn.vercel.app

## Start locally

Requires Node.js 22 or newer. Open pin-web.code-workspace in VS Code, then:

    npm ci
    cp .env.example .env.local
    npm run dev

Open http://localhost:3000. Vercel builds this repository root with npm run build.

## Current implementation

Responsive home, article, category, search, daily briefing, saved-story and share views. Reading and search work without JavaScript. Facebook links, clipboard sharing, native device sharing, manual Instagram Link stickers and generated 1200×630 Cyrillic OG images are included.

Saved stories remain in the current browser. Login, registration, password recovery and newsletter screens clearly show unavailable states until backend services are connected. No credentials or emails are collected.

The initial content is the dated September 14, 2026 sample issue. Existing root-level article URLs still render their original content, labeled as older design examples. Earlier source modules, photography, documentation and tests remain in the repository.

## Headless integration

New pages read through src/lib/content.ts. CONTENT_SOURCE=fixtures uses dated sample data. CONTENT_SOURCE=api uses CONTENT_API_URL and validates responses against the contract in docs/headless/openapi.json. API failures never silently load fixtures.

The contract is a public adapter to be implemented by the separate CMS, not its raw Payload REST response. This branch does not modify the CMS.

URLs use NEXT_PUBLIC_SITE_URL when provided, the pinmn.vercel.app domain for Vercel production, VERCEL_URL for previews, and localhost for development. Fixture content remains noindex. Restart/rebuild after changing environment variables.

## Checks

    npm test
    npm run lint
    npm run typecheck
    npm run build
    npx playwright install chromium
    npm run test:e2e

npm test runs the preserved Vitest suite, new content tests and the HTTP adapter integration test. Browser tests require a production build first. Tests cover both mobile and desktop.

See docs/headless/README.md for migration details. Earlier design references remain under docs/mockups and docs/superpowers.
