# Footer Pages — Privacy Policy & About (Fase 2 pre-pubblicazione)

**Date:** 2026-07-26
**Status:** Awaiting approval

## Goal

Eliminate broken footer links before the Vercel deploy by creating the two
pages that are actually needed — `/privacy` (GDPR requirement) and `/about`
(brand story + ATP non-affiliation disclaimer) — and removing the `/terms`
and `/support` links from the footer until those pages exist.

## Scope

### 1. New route: `/privacy`

- `src/app/privacy/page.tsx` — Server Component with its own `metadata`
  (title/description), standard page shell (`TopNavBar` + `Footer`), and a
  client content component for i18n.
- `src/app/privacy/privacy-content.tsx` — `"use client"` component rendering
  the localized policy text via `useTranslation()`.
- Content sections (IT + EN, written in the i18n dictionaries):
  1. **Titolare del trattamento** — name + contact with a visible `[EMAIL]`
     placeholder to be replaced by the owner before deploy.
  2. **Dati raccolti** — no accounts, no tracking cookies; hosting provider
     (Vercel) processes IP addresses in server logs for security/delivery.
  3. **Preferenze locali** — theme and language stored in `localStorage`
     only (technical storage, never leaves the browser, no consent needed).
  4. **Terze parti** — Vercel as hosting/processor; link to Vercel's privacy
     policy. No analytics at launch.
  5. **Diritti dell'utente** — GDPR rights (access, rectification, erasure,
     etc.) and how to exercise them via the contact above.
  6. **Aggiornamenti** — last-updated date shown on the page.

### 2. New route: `/about`

- `src/app/about/page.tsx` + `src/app/about/about-content.tsx` (same
  structure as `/privacy`).
- Content sections (IT + EN):
  1. **Cos'è Baseline** — short brand story: modern platform for real-time
     ATP rankings (Live, Official, Race to Turin).
  2. **I dati** — where the data comes from, update frequency (SWR cache),
     informational purpose only.
  3. **Disclaimer** — prominent callout: *Baseline is an independent project,
     not affiliated with, endorsed by, or sponsored by ATP Tour, Inc. All
     trademarks belong to their respective owners. Data is provided for
     informational purposes only and is not official.*

### 3. Footer cleanup

- `src/components/layout/footer.tsx` — remove the `terms` and `support`
  entries from `footerLinks` (keep the dictionary keys for future reuse);
  switch the remaining anchors from `<a>` to Next `<Link>`.

### 4. i18n

- Add `privacyPage` and `aboutPage` namespaces to `src/lib/i18n/it.ts` and
  `en.ts` with all headings/paragraphs, keeping the `Dictionary` type in sync.

## Design

- Simple long-form text layout: max-w readable column (~720px), page title
  in Outfit, section headings + body in the existing typography scale,
  `pt-28` top padding to clear the fixed nav (same as other pages).
- Disclaimer on `/about` rendered as a rounded-xl callout card consistent
  with the pill/rounded aesthetic.
- Full dark-mode support via existing semantic tokens (`bg-surface-white`,
  `text-text-muted`, etc.). Mobile-first, no new dependencies.

## Out of scope

- `/terms` and `/support` pages (future phase).
- Cookie banner (not needed: no profiling cookies or analytics at launch).
- SEO work (sitemap, robots, OG image) — Fase 3.

## Verification

- `npm run build` inside the Node 20 container passes.
- No remaining footer links pointing to non-existent routes.
