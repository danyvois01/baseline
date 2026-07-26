# SEO Tecnica — sitemap, robots, metadata, Open Graph (Fase 3 pre-pubblicazione)

**Date:** 2026-07-26
**Status:** Awaiting approval

## Goal

Make the site fully indexable and shareable before the Vercel deploy:
sitemap + robots for crawlers, `metadataBase` + canonical URLs, richer
per-page metadata, and an Open Graph image for social/link previews.

## Site URL strategy

The production domain doesn't exist yet. All absolute URLs derive from a
single constant that reads `NEXT_PUBLIC_SITE_URL` with a safe fallback:

- `src/lib/site.ts` — exports `SITE_URL` (from `process.env.NEXT_PUBLIC_SITE_URL`,
  fallback `https://baseline-tennis.vercel.app`) and `SITE_NAME`.
- When the real domain is purchased, set `NEXT_PUBLIC_SITE_URL` in Vercel —
  no code changes needed.
- `.env.example` documents the variable.

## Scope

### 1. `src/app/sitemap.ts`

MetadataRoute.Sitemap listing all 6 public routes with sensible hints:

| Route      | changeFrequency | priority |
|------------|-----------------|----------|
| `/`        | weekly          | 1.0      |
| `/live`    | hourly          | 0.9      |
| `/official`| weekly          | 0.9      |
| `/race`    | daily           | 0.9      |
| `/about`   | monthly         | 0.4      |
| `/privacy` | yearly          | 0.2      |

### 2. `src/app/robots.ts`

Allow all crawlers on all routes; point to `${SITE_URL}/sitemap.xml`.

### 3. Root layout metadata upgrade (`src/app/layout.tsx`)

- `metadataBase: new URL(SITE_URL)` — makes all relative OG/canonical URLs absolute.
- `title.template: "%s — Baseline"` + `title.default` so child pages only
  declare their own title part.
- `description` (existing), `applicationName`, `keywords` (small set:
  ATP rankings, live tennis rankings, race to Turin, classifica ATP).
- `alternates.canonical: "/"` on the root; each child page declares its own
  canonical path (`/live`, `/official`, `/race`, `/about`, `/privacy`).
- `openGraph` (type website, siteName, locale `it_IT`) and
  `twitter` (card `summary_large_image`) defaults.
- `robots: { index: true, follow: true }`.

### 4. Per-page metadata refresh

Update the 5 child pages to use the title template (e.g. `title: "Live ATP
Rankings"`), keep unique descriptions, and add `alternates.canonical`.

### 5. Open Graph image

- `src/app/opengraph-image.tsx` — generated at build time with `next/og`
  `ImageResponse` (1200×630): Deep Navy background, "Baseline" wordmark in
  Outfit-style bold white, tennis-lime `#DFFF00` accent line, tagline
  "Live ATP Rankings". Also exported as `twitter-image` via the same file
  convention (`export { default as twitterImage }` is not a convention —
  instead the root `twitter` metadata falls back to the OG image, which is
  the default behavior, so a single `opengraph-image.tsx` is enough.
- `alt` export for accessibility.
- Applies to every route (root segment convention).

### 6. Structured data (JSON-LD)

- `WebSite` schema (name, url) injected in the root layout via a small
  `<script type="application/ld+json">` — helps Google show the site name
  correctly. No `SportsOrganization`/rankings schema for now (no matching
  schema.org type adds value yet).

## Out of scope

- Google Search Console registration (post-deploy, needs the live domain).
- hreflang alternates — the site serves one URL per page with client-side
  locale toggle, so per-language URLs don't exist to reference.
- Analytics.

## Verification

- Container build passes; build output lists `/sitemap.xml` and `/robots.txt`.
- Local render check of generated sitemap/robots content.
