# Dark Mode + Language Toggle (IT/EN)

**Date:** 2026-07-23
**Status:** Approved design — pending implementation plan

## Goal

Add two user-facing settings to the platform:

1. **Dark mode** — activate the existing (but currently dormant) dark theme, with a toggle in the navbar.
2. **Language switch (IT/EN)** — client-side translation of the whole site, defaulting to Italian.

Both controls live in a single **segmented pill** in the navbar, placed before the primary CTA.

## Current State (findings)

- Dark-mode CSS tokens already exist in `src/app/globals.css` (`.dark { ... }` block, `@custom-variant dark`), and `src/providers/theme-provider.tsx` wraps `next-themes` — but the provider is **never mounted** in `src/app/layout.tsx`.
- ~28 component files use **hardcoded light-mode colors** (`bg-white/80`, `text-deep-navy`, `bg-surface-gray`, `border-border-subtle`, …) via the static brand tokens in `@theme inline`. These do not react to `.dark`, so enabling the toggle today would produce a broken dark theme.
- All copy is hardcoded Italian (navbar, footer, ranking tables, homepage editorial sections). There is no i18n infrastructure.
- Homepage sections are already Client Components (Framer Motion), so they can consume a React context without architectural changes.

## Design

### 1. UI — `SettingsPill` component

New component `src/components/layout/settings-pill.tsx`, rendered in the right-hand cluster of `TopNavBar`, before the CTA button:

```
( ☾ │ EN )  [Vai alle Classifiche]
```

- **Ghost pill**: 1px `border-subtle` border, transparent background, internal vertical divider. Visually quieter than the solid navy CTA so the CTA remains the strongest element in the navbar.
- **Left segment — theme**: Lucide `Sun`/`Moon` icon, cycles light ↔ dark. Icon swap animated with a micro-rotation (Framer Motion).
- **Right segment — language**: text label showing the **target** language ("EN" while the site is in Italian, "IT" while in English). No flags — flags represent countries, not languages.
- Visible on mobile as-is (compact enough); the CTA already shortens its label on small screens.
- Hover states: subtle `surface-gray` background per segment, consistent with existing nav link hovers.
- Accessibility: each segment is a `<button>` with a localized `aria-label`; theme icon rendering guards against hydration mismatch (render after mount, standard next-themes pattern).

### 2. Dark mode

- Mount `ThemeProvider` (`next-themes`) in `src/app/layout.tsx` with `attribute="class"`, `defaultTheme="light"`, `enableSystem={false}`.
- **Semantic token strategy**: convert the static brand tokens in `@theme inline` (`--color-surface-white`, `--color-surface-gray`, `--color-surface-hover`, `--color-border-subtle`, `--color-text-muted`, `--color-text-secondary`, `--color-deep-navy` used as text, tonal surface containers, success/error backgrounds) into CSS variables that flip inside `.dark`. Most of the 28 affected files then adapt **without being touched**, because their class names (`bg-surface-white`, `text-deep-navy`, …) resolve to the flipped variables.
  - Example mapping in dark: `surface-white → #141921`, `surface-gray → #1C2333`, `border-subtle → rgba(255,255,255,0.1)`, `text on navy → #F8F9FA`.
- **Residual sweep**: raw literals that bypass the tokens (e.g. navbar `bg-white/80` glassmorphism, `bg-white/90` cards) are replaced with semantic tokens or explicit `dark:` variants where a bespoke value is needed (e.g. navbar glass in dark: `dark:bg-[#141921]/80`).
- **Baseline Lime `#DFFF00` stays identical in both themes** (high contrast on navy, per project brief). Semantic green/red badge colors get dark-appropriate background variants.
- Persistence handled by next-themes (localStorage + inline script, no flash of wrong theme).

### 3. i18n — client-side toggle

- **No route changes.** URLs stay as-is (`/`, `/official`, `/live`, `/race`). No middleware, no `[locale]` segment. Accepted trade-off: no per-language SEO indexing.
- `LocaleProvider` in `src/providers/locale-provider.tsx`: React context holding `locale: "it" | "en"`, persisted to `localStorage`, default `it`.
- Dictionaries in `src/lib/i18n/`:
  - `it.ts` — source of truth, nested object of UI strings.
  - `en.ts` — typed as the same shape as `it.ts` (`satisfies` the IT dictionary type), so a missing translation is a **compile error**.
  - `index.ts` — exports `useTranslation()` returning `t(key)` plus the current locale and a `toggleLocale()` helper.
- **Scope: whole site.** Navbar, footer, ranking pages (table headers, tooltips, empty states, expanded card, summary cards, status labels like "Qualified"), and all homepage editorial content (hero, scoring, pyramid, timeline, glossary).
- **Not translated**: scraped data (tournament names, round/stage strings from source), player names, and dates already localized by the formatting layer.
- **Accepted trade-off**: SSR first paint is Italian; users who chose EN may see a brief flash before hydration. If noticeable in practice, mitigate later with the same inline-script pattern next-themes uses. Not part of this iteration.
- **`<html lang>` attribute**: currently hardcoded to `"en"` in `layout.tsx`. `LocaleProvider` sets `document.documentElement.lang` on locale change; the SSR default becomes `"it"` to match the default locale.

### 4. Out of scope

- Localized routes / `next-intl` middleware.
- Translation of scraped tournament data.
- A language dropdown (two languages → toggle is sufficient).
- System-theme detection (`enableSystem`) — explicit user choice only, can be revisited.

## Component/Data Flow Summary

```
layout.tsx
└─ ThemeProvider (next-themes, class attr)
   └─ LocaleProvider (context + localStorage)
      └─ pages…
         └─ TopNavBar
            └─ SettingsPill ── useTheme() / useTranslation()
```

## Error Handling

- `localStorage` unavailable (SSR, private mode): provider falls back to defaults (`light`, `it`) without throwing.
- Unknown/corrupt stored locale value: reset to `it`.

## Testing

- Type-level: EN dictionary shape enforced by TypeScript.
- Manual: user verifies both themes and both languages across all four routes (per project rule 8, no automated browser verification).
