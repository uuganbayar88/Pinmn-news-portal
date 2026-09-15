# Teal frontend integration

This branch integrates the approved teal/coral reader frontend into the existing web repository root.
The independent backend is uuganbayar88/pinmn-cms. No backend files or deployment settings are changed.

The historical September 14 sample edition is used until the API adapter is connected.
Set CONTENT_SOURCE=api and CONTENT_API_URL only after the CMS exposes the public adapter in openapi.json.
The contract is not Payload's raw REST response. Sample data never silently replaces an API error.

Existing root-level article URLs remain readable, with the original content identified as earlier design samples. The source modules, photography, documentation and Vitest tests are preserved.

The new application adds categories, search, daily briefing, browser-local saved articles and social sharing.
Account and newsletter screens remain explicitly unavailable until those backend services exist.
IG sharing supports manual Link stickers; automatic card packages remain a backend worker task.

Vercel continues building at the repository root with npm run build.
In production, canonical/share URLs default to https://pinmn.vercel.app.
Preview builds use VERCEL_URL; NEXT_PUBLIC_SITE_URL can explicitly override the domain.
Fixture content remains noindex.

The source document's 50k RPS, latency, immediate multi-layer cache purge and disaster recovery requirements are infrastructure milestones, not claims about this branch.
