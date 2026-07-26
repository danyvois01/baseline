# Dark Mode + Language Toggle (IT/EN) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Activate dark mode and add a client-side IT/EN language toggle, both controlled from a single segmented pill in the navbar.

**Architecture:** Dark mode works by making the brand tokens in `globals.css` flip inside `.dark` (so `bg-surface-white` etc. auto-adapt), plus a targeted sweep of raw literals. i18n is a React context (`LocaleProvider`) + typed dictionaries (`it.ts` is source of truth; `en.ts` is compile-checked against its shape). URLs never change.

**Tech Stack:** Next.js 16 (App Router), Tailwind CSS v4 (`@theme inline` tokens), next-themes 0.4 (already installed), Framer Motion, Lucide React.

**Spec:** `docs/2026-07-23-dark-mode-language-toggle.md`

## Global Constraints

- All code, comments, and identifiers in English (project rule).
- Pill aesthetic: `rounded-full` / `rounded-xl` for new UI.
- **No test runner exists in this repo** (scripts: dev/build/start/lint only). Per-task verification is `npx tsc --noEmit` and, at milestones, `npm run build > build.log 2>&1` + `npm run lint`. Dictionary completeness is enforced by TypeScript (missing EN key = compile error). UI verification is manual by the user (project rule 8 — no browser automation).
- `#DFFF00` (baseline-lime) and `#0A0E14` (deep-navy) are **fixed brand colors — identical in both themes**. Never flip them.
- Language labels are text ("EN"/"IT"), never flags.
- The language control always shows the **target** language (shows "EN" while site is Italian).
- Scraped data (tournament names, stages), player names are never translated.
- Page `metadata` exports stay English and static — client-side locale cannot affect server-rendered metadata (accepted limitation, note kept in spec).
- Commit after every task (one commit per task, message given in each task).

---

### Task 1: Flip brand tokens for dark mode in globals.css

**Files:**
- Modify: `src/app/globals.css`

**Interfaces:**
- Consumes: existing `@theme inline` block (lines 11–85), existing `:root` / `.dark` shadcn blocks (lines 87–156).
- Produces: utility classes `bg-surface-white`, `bg-surface-gray`, `bg-surface-hover`, `border-border-subtle`, `text-text-muted`, `text-text-secondary`, `text-badge-gray-text`, `bg-success-green-bg`, `text-success-green-text`, `bg-error-red-bg`, `text-error-red-text`, `bg-surface-container-*`, `text-on-surface-variant` now auto-flip in `.dark`. `deep-navy`, `baseline-lime`, `primary-olive`, `on-primary-container` stay static.

- [ ] **Step 1: Convert static brand tokens to var() references**

In the `@theme inline` block, replace the literal values of the flippable tokens with var() references (leave `--color-baseline-lime`, `--color-baseline-lime-hover`, `--color-deep-navy`, `--color-primary-olive`, `--color-on-primary-container`, `--color-success-green`, `--color-error-red` untouched — they are fixed):

```css
  --color-surface-white: var(--surface-white);
  --color-surface-gray: var(--surface-gray);
  --color-surface-hover: var(--surface-hover);
  --color-border-subtle: var(--border-subtle);
  --color-success-green-bg: var(--success-green-bg);
  --color-success-green-text: var(--success-green-text);
  --color-error-red-bg: var(--error-red-bg);
  --color-error-red-text: var(--error-red-text);
  --color-text-muted: var(--text-muted);
  --color-text-secondary: var(--text-secondary);
  --color-badge-gray-text: var(--badge-gray-text);

  --color-surface-container-lowest: var(--surface-container-lowest);
  --color-surface-container-low: var(--surface-container-low);
  --color-surface-container: var(--surface-container);
  --color-surface-container-high: var(--surface-container-high);
  --color-surface-container-highest: var(--surface-container-highest);
  --color-on-surface-variant: var(--on-surface-variant);
```

- [ ] **Step 2: Add light values to `:root` and dark values to `.dark`**

Append inside the existing `:root` block:

```css
  /* --- Baseline semantic surfaces (light) --- */
  --surface-white: #FFFFFF;
  --surface-gray: #F1F3F5;
  --surface-hover: #F8F9FA;
  --border-subtle: #E9ECEF;
  --success-green-bg: #DCFCE7;
  --success-green-text: #166534;
  --error-red-bg: #FEE2E2;
  --error-red-text: #991B1B;
  --text-muted: #6B7280;
  --text-secondary: #9CA3AF;
  --badge-gray-text: #4B5563;
  --surface-container-lowest: #FFFFFF;
  --surface-container-low: #F3F4F5;
  --surface-container: #EDEEEF;
  --surface-container-high: #E7E8E9;
  --surface-container-highest: #E1E3E4;
  --on-surface-variant: #454932;
```

Append inside the existing `.dark` block:

```css
  /* --- Baseline semantic surfaces (dark) --- */
  --surface-white: #141921;
  --surface-gray: #1C2333;
  --surface-hover: #1A2029;
  --border-subtle: rgba(255, 255, 255, 0.10);
  --success-green-bg: rgba(34, 197, 94, 0.15);
  --success-green-text: #4ADE80;
  --error-red-bg: rgba(239, 68, 68, 0.15);
  --error-red-text: #F87171;
  --text-muted: #9CA3AF;
  --text-secondary: #6B7280;
  --badge-gray-text: #B0B6BF;
  --surface-container-lowest: #10151C;
  --surface-container-low: #141921;
  --surface-container: #181E27;
  --surface-container-high: #1C2333;
  --surface-container-highest: #232B3D;
  --on-surface-variant: #C9CFAD;
```

- [ ] **Step 3: Verify build**

Run: `npm run build > build.log 2>&1 && tail -n 5 build.log`
Expected: successful build ("Compiled successfully" / route table, exit 0).

- [ ] **Step 4: Commit**

```bash
git add src/app/globals.css
git commit -m "feat(theme): make brand tokens flip in dark mode"
```

---

### Task 2: i18n foundation — dictionaries, LocaleProvider, useTranslation

**Files:**
- Create: `src/lib/i18n/it.ts`
- Create: `src/lib/i18n/en.ts`
- Create: `src/lib/i18n/index.ts`
- Create: `src/providers/locale-provider.tsx`

**Interfaces:**
- Produces (used by every later task):
  - `useTranslation(): { t: Dictionary; locale: Locale; toggleLocale: () => void }` from `@/providers/locale-provider`
  - `type Locale = "it" | "en"`, `type Dictionary = typeof it` from `@/lib/i18n`
  - `LocaleProvider` component (mounted in Task 3)
- Dictionary shape grows in later tasks; `it.ts` is the source of truth, `en.ts` must satisfy `Dictionary` (compile-enforced).

- [ ] **Step 1: Create `src/lib/i18n/it.ts` with the starter section (settings pill + navbar)**

```ts
/**
 * Italian dictionary — source of truth for the i18n shape.
 * Every user-facing string lives here; `en.ts` must mirror this shape
 * (enforced at compile time via the Dictionary type).
 */
export const it = {
  settings: {
    switchToDark: "Attiva il tema scuro",
    switchToLight: "Attiva il tema chiaro",
    switchLanguage: "Switch to English",
    targetLanguage: "EN",
  },
  nav: {
    home: {
      ranking: "Ranking",
      tournaments: "Tornei",
      season: "Stagione",
      scoring: "Punteggio",
      glossary: "Dizionario",
    },
    app: {
      official: "Official Ranking",
      live: "Live Ranking",
      race: "Race to Turin",
    },
    goToRankings: "Vai alle Classifiche",
    goToRankingsShort: "Classifiche",
    backToHome: "Torna alla Home",
  },
};

/**
 * Widens literal string types to `string` (and function-valued entries to
 * their signature) so `en.ts` can hold different text with the same shape.
 */
type DeepString<T> = {
  [K in keyof T]: T[K] extends string
    ? string
    : T[K] extends (...args: infer A) => string
      ? (...args: A) => string
      : DeepString<T[K]>;
};

export type Dictionary = DeepString<typeof it>;
```

Note: `settings.switchLanguage` / `settings.targetLanguage` describe the **target** language, so the IT dictionary points to English and vice versa. No `as const` on `it` — a plain object literal plus `DeepString` gives shape enforcement while allowing different EN text.

- [ ] **Step 2: Create `src/lib/i18n/en.ts`**

```ts
import type { Dictionary } from "./it";

/** English dictionary — shape checked against the Italian source of truth. */
export const en: Dictionary = {
  settings: {
    switchToDark: "Switch to dark theme",
    switchToLight: "Switch to light theme",
    switchLanguage: "Passa all'italiano",
    targetLanguage: "IT",
  },
  nav: {
    home: {
      ranking: "Ranking",
      tournaments: "Tournaments",
      season: "Season",
      scoring: "Scoring",
      glossary: "Glossary",
    },
    app: {
      official: "Official Ranking",
      live: "Live Ranking",
      race: "Race to Turin",
    },
    goToRankings: "Go to Rankings",
    goToRankingsShort: "Rankings",
    backToHome: "Back to Home",
  },
};
```

- [ ] **Step 3: Create `src/lib/i18n/index.ts`**

```ts
import { it, type Dictionary } from "./it";
import { en } from "./en";

export type Locale = "it" | "en";
export type { Dictionary };

export const dictionaries: Record<Locale, Dictionary> = { it, en };
export const DEFAULT_LOCALE: Locale = "it";
```

- [ ] **Step 4: Create `src/providers/locale-provider.tsx`**

```tsx
"use client";

/**
 * LocaleProvider — client-side locale state for the IT/EN toggle.
 * Persists the choice to localStorage and mirrors it onto <html lang>.
 * SSR always renders the default locale (accepted trade-off, see spec).
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { DEFAULT_LOCALE, dictionaries, type Dictionary, type Locale } from "@/lib/i18n";

const STORAGE_KEY = "baseline-locale";

interface LocaleContextValue {
  locale: Locale;
  t: Dictionary;
  toggleLocale: () => void;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useState<Locale>(DEFAULT_LOCALE);

  // Restore persisted choice after hydration; ignore unknown/corrupt values.
  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored === "it" || stored === "en") setLocale(stored);
    } catch {
      // localStorage unavailable (private mode) — keep default.
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
    try {
      window.localStorage.setItem(STORAGE_KEY, locale);
    } catch {
      // Non-fatal: preference simply won't persist.
    }
  }, [locale]);

  const toggleLocale = useCallback(
    () => setLocale((prev) => (prev === "it" ? "en" : "it")),
    [],
  );

  return (
    <LocaleContext.Provider
      value={{ locale, t: dictionaries[locale], toggleLocale }}
    >
      {children}
    </LocaleContext.Provider>
  );
}

export function useTranslation(): LocaleContextValue {
  const ctx = useContext(LocaleContext);
  if (!ctx) {
    throw new Error("useTranslation must be used within LocaleProvider");
  }
  return ctx;
}
```

- [ ] **Step 5: Verify types**

Run: `npx tsc --noEmit`
Expected: exit 0, no errors. (Sanity check the enforcement: temporarily delete `nav.backToHome` from `en.ts`, re-run, expect a missing-property error; restore it.)

- [ ] **Step 6: Commit**

```bash
git add src/lib/i18n src/providers/locale-provider.tsx
git commit -m "feat(i18n): typed IT/EN dictionaries and LocaleProvider"
```

---

### Task 3: Mount providers in root layout

**Files:**
- Modify: `src/app/layout.tsx`

**Interfaces:**
- Consumes: `ThemeProvider` (`src/providers/theme-provider.tsx`, exists), `LocaleProvider` (Task 2).
- Produces: theme + locale contexts available to the whole tree.

- [ ] **Step 1: Wire providers, default lang, body background**

Changes to `src/app/layout.tsx`:
1. Add imports: `import { ThemeProvider } from "@/providers/theme-provider";` and `import { LocaleProvider } from "@/providers/locale-provider";`
2. `<html lang="en"` → `<html lang="it"` (SSR default matches default locale; `suppressHydrationWarning` is already present — required by next-themes).
3. Body: `bg-surface-white` → `bg-background` (page background must be `#0A0E14` in dark, not the card color).
4. Wrap children:

```tsx
      <body className="min-h-full flex flex-col bg-background" suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} disableTransitionOnChange>
          <LocaleProvider>
            <CustomCursor />
            {children}
          </LocaleProvider>
        </ThemeProvider>
      </body>
```

- [ ] **Step 2: Verify build**

Run: `npm run build > build.log 2>&1 && tail -n 5 build.log`
Expected: success, exit 0.

- [ ] **Step 3: Commit**

```bash
git add src/app/layout.tsx
git commit -m "feat(theme): mount ThemeProvider and LocaleProvider in root layout"
```

---

### Task 4: SettingsPill component + navbar integration

**Files:**
- Create: `src/components/layout/settings-pill.tsx`
- Modify: `src/components/layout/top-nav-bar.tsx`
- Modify: `src/components/layout/index.ts` (export SettingsPill)

**Interfaces:**
- Consumes: `useTheme` (next-themes), `useTranslation` (Task 2).
- Produces: `<SettingsPill />` rendered in TopNavBar's right cluster before the CTA.

- [ ] **Step 1: Create `src/components/layout/settings-pill.tsx`**

```tsx
"use client";

/**
 * SettingsPill — Segmented ghost pill hosting the theme toggle (left)
 * and the language toggle (right). Sits before the primary CTA in the
 * navbar; intentionally quieter than the CTA (border only, no fill).
 * The language segment shows the TARGET language ("EN" while in Italian).
 */

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslation } from "@/providers/locale-provider";

export function SettingsPill() {
  const { resolvedTheme, setTheme } = useTheme();
  const { t, toggleLocale } = useTranslation();

  // next-themes is undefined until mounted; render a stable icon first
  // to avoid a hydration mismatch.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const isDark = mounted && resolvedTheme === "dark";

  return (
    <div className="flex items-center rounded-full border border-border-subtle bg-transparent">
      <button
        type="button"
        onClick={() => setTheme(isDark ? "light" : "dark")}
        aria-label={isDark ? t.settings.switchToLight : t.settings.switchToDark}
        className="flex h-10 w-10 items-center justify-center rounded-l-full text-foreground/80 transition-colors hover:bg-surface-gray/50 hover:text-foreground cursor-pointer"
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={isDark ? "moon" : "sun"}
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 90, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="flex"
          >
            {isDark ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          </motion.span>
        </AnimatePresence>
      </button>

      <div className="h-5 w-px bg-border-subtle" aria-hidden />

      <button
        type="button"
        onClick={toggleLocale}
        aria-label={t.settings.switchLanguage}
        className="flex h-10 items-center justify-center rounded-r-full px-3 text-sm font-semibold text-foreground/80 transition-colors hover:bg-surface-gray/50 hover:text-foreground cursor-pointer"
      >
        {t.settings.targetLanguage}
      </button>
    </div>
  );
}
```

- [ ] **Step 2: Integrate into TopNavBar and translate its strings**

In `src/components/layout/top-nav-bar.tsx`:
1. Import `SettingsPill` and `useTranslation`.
2. Replace the two nav-item constants with locale-aware arrays built inside the component:

```tsx
  const { t } = useTranslation();

  const homeNavItems = [
    { label: t.nav.home.ranking, href: "#ranking" },
    { label: t.nav.home.tournaments, href: "#pyramid" },
    { label: t.nav.home.season, href: "#timeline" },
    { label: t.nav.home.scoring, href: "#scoring" },
    { label: t.nav.home.glossary, href: "#glossary" },
  ];

  const appNavItems = [
    { label: t.nav.app.official, href: "/official" },
    { label: t.nav.app.live, href: "/live" },
    { label: t.nav.app.race, href: "/race" },
  ];
```

(Delete the module-level `HOME_NAV_ITEMS` / `APP_NAV_ITEMS`.)
3. CTA labels: `"Classifiche"` → `{t.nav.goToRankingsShort}`, `"Vai alle Classifiche"` → `{t.nav.goToRankings}`, `"Torna alla Home"` → `{t.nav.backToHome}`.
4. Insert `<SettingsPill />` as the first child of the right-hand actions div (before the CTA `Link`).
5. Dark-mode fixes in the same file: header `bg-white/80` → `bg-surface-white/80`; nav links `text-deep-navy/70 hover:text-deep-navy` → `text-foreground/70 hover:text-foreground` and hover bg `hover:bg-surface-gray/50` stays; active link keeps `text-deep-navy` (it sits on the lime pill, which stays lime); CTA buttons `bg-deep-navy ... text-white hover:bg-deep-navy/90` → `bg-primary text-primary-foreground hover:bg-primary/90`.

- [ ] **Step 3: Export from barrel**

Add to `src/components/layout/index.ts`: `export { SettingsPill } from "./settings-pill";`

- [ ] **Step 4: Verify**

Run: `npx tsc --noEmit && npm run lint`
Expected: exit 0 for both.

- [ ] **Step 5: Commit**

```bash
git add src/components/layout
git commit -m "feat(nav): SettingsPill with theme and language toggles"
```

---

### Task 5: Dark-mode sweep — rankings components and app pages

**Files:**
- Modify: `src/components/rankings/rankings-table.tsx`, `official-table.tsx`, `race-table.tsx`, `race-summary-cards.tsx`, `ranking-page-shell.tsx`, `expanded-card.tsx`, `live-status-cell.tsx`, `movement-badge.tsx`, `player-cell.tsx`, `player-avatar.tsx`
- Modify: `src/app/official/loading.tsx`, `src/app/live/loading.tsx`, `src/app/race/loading.tsx`, `src/app/race/race-client.tsx`
- Modify: `src/app/error.tsx`, `src/app/official/error.tsx`, `src/app/live/error.tsx`, `src/app/race/error.tsx`, `src/app/not-found.tsx`

**Interfaces:** none new — class-name substitutions only, no logic changes.

- [ ] **Step 1: Apply the substitution rules to every file above**

| Current class | Replacement | Where |
|---|---|---|
| `bg-white` | `bg-surface-white` | table containers, load-more buttons, stat cards, popover, pills, skeleton shells, error card |
| `text-deep-navy` (on white/gray surfaces) | `text-foreground` | headings, cell text, labels |
| `text-deep-navy` (on `bg-baseline-lime`) | **keep as-is** | live badge in `live-status-cell.tsx`, filter-count badge in `ranking-page-shell.tsx` |
| `bg-deep-navy text-white` (buttons/badges needing page contrast) | `bg-primary text-primary-foreground` | retry/home buttons in all error pages + not-found; "Turin Cut" badge in `race-table.tsx` |
| `hover:bg-deep-navy/90` | `hover:bg-primary/90` | same buttons |

Token-based classes (`bg-surface-gray`, `border-border-subtle`, `text-text-muted`, `bg-success-green-bg`, …) need **no change** — they flip via Task 1. `border-white/10` in race-table (inside the navy badge) stays.

- [ ] **Step 2: Verify no raw literals remain in these files**

Run:
```bash
grep -rn "bg-white\b\|bg-white/" src/components/rankings src/app/official src/app/live src/app/race src/app/error.tsx src/app/not-found.tsx
```
Expected: no output.

- [ ] **Step 3: Verify build**

Run: `npx tsc --noEmit && npm run build > build.log 2>&1 && tail -n 5 build.log`
Expected: success.

- [ ] **Step 4: Commit**

```bash
git add src/components/rankings src/app
git commit -m "feat(theme): dark-mode color sweep for rankings pages"
```

---

### Task 6: Dark-mode sweep — homepage sections, layout chrome

**Files:**
- Modify: `src/components/homepage/hero-section.tsx`, `ranking-section.tsx`, `pyramid-section.tsx`, `timeline-section.tsx`, `glossary-section.tsx`, `section-navigator.tsx`
- Modify: `src/components/layout/footer.tsx` (colors only; strings in Task 7)
- Modify: `src/app/page.tsx` (colors only; strings in Task 8)
- NOT modified: `scoring-section.tsx` (deliberately dark "stage" — keeps `bg-deep-navy text-white` in both themes), `custom-cursor.tsx` (lime cursor + navy icon valid in both themes)

**Interfaces:** none new — visual-only changes.

- [ ] **Step 1: Apply per-file changes**

- `hero-section.tsx`: court SVG `fill="#1C2127"` → replace attribute with `className="fill-[#1C2127] dark:fill-[#1C2333]"` (slightly lighter than the dark page bg so the court reads as a surface). Headline/text `text-deep-navy` → `text-foreground`.
- `ranking-section.tsx`: glass cards `bg-white/60` → `bg-surface-white/60`, `bg-white/80` → `bg-surface-white/80`; `text-deep-navy` → `text-foreground`.
- `pyramid-section.tsx`: info card `bg-white/80` → `bg-surface-white/80`; `text-deep-navy` → `text-foreground`; colored tier badges (`bg-amber-400` etc. with `text-white`) unchanged.
- `timeline-section.tsx`: event cards `bg-white/90` → `bg-surface-white/90`; year pill `bg-white/95` → `bg-surface-white/95`; timeline dots `border-white` → `border-background` (dot ring must match page bg); surface chips get dark variants: `bg-blue-50 text-blue-700` → add `dark:bg-blue-500/15 dark:text-blue-300`, `bg-orange-50 text-orange-700` → add `dark:bg-orange-500/15 dark:text-orange-300`, `bg-green-50 text-green-700` → add `dark:bg-green-500/15 dark:text-green-300`, `bg-purple-50 text-purple-700` → add `dark:bg-purple-500/15 dark:text-purple-300`; `dotHex` inline colors unchanged (vivid hues work on both themes); `text-deep-navy` → `text-foreground`.
- `glossary-section.tsx`: arrow buttons `bg-white` → `bg-surface-white`; definition cards keep `bg-deep-navy text-white` (deliberately dark, valid in both themes); active tab keeps `bg-[#DFFF00] text-deep-navy` (lime is fixed); other `text-deep-navy` → `text-foreground`.
- `section-navigator.tsx`: tooltip `bg-deep-navy text-white` → `bg-primary text-primary-foreground` (must contrast with page bg in both themes).
- `footer.tsx`: `hover:text-deep-navy` → `hover:text-foreground` (bg/border are token-based already).
- `app/page.tsx`: final CTA panel keeps `bg-deep-navy` + `text-white` + lime button (deliberately dark stage); any `text-deep-navy` on light surfaces elsewhere in the file → `text-foreground`.

- [ ] **Step 2: Verify remaining literals are intentional**

Run: `grep -rn "bg-white/\|bg-white\b\|text-deep-navy" src/components/homepage src/components/layout src/app/page.tsx`
Expected: hits only in `scoring-section.tsx` (opt-out stage) and `text-deep-navy`-on-lime cases listed above.

- [ ] **Step 3: Verify build + commit**

Run: `npx tsc --noEmit && npm run build > build.log 2>&1 && tail -n 5 build.log` → success.

```bash
git add src/components/homepage src/components/layout/footer.tsx src/app/page.tsx
git commit -m "feat(theme): dark-mode color sweep for homepage and chrome"
```

---

### Task 7: i18n — footer, errors, 404, rankings pages

**Files:**
- Modify: `src/lib/i18n/it.ts`, `src/lib/i18n/en.ts` (add `footer`, `errors`, `notFound`, `rankings` sections)
- Modify: `src/components/layout/footer.tsx` (becomes `"use client"`)
- Modify: `src/app/error.tsx`, `src/app/not-found.tsx`, `src/app/official/error.tsx`, `src/app/live/error.tsx`, `src/app/race/error.tsx`
- Modify: `src/components/rankings/ranking-page-shell.tsx`, `rankings-table.tsx`, `official-table.tsx`, `race-table.tsx`, `race-summary-cards.tsx`, `expanded-card.tsx`, `live-status-cell.tsx`
- Modify: `src/components/rankings/primitives/use-pagination.ts`
- Modify: `src/app/official/official-client.tsx`, `src/app/live/live-client.tsx`, `src/app/race/race-client.tsx`

**Interfaces:**
- Consumes: `useTranslation` (Task 2).
- Produces: dictionary sections `footer`, `errors`, `notFound`, `rankings` (shape below).
- `usePagination` signature changes to `usePagination(totalCount: number, initialCount?: number, showAllLabel?: string)` — unchanged externally, but labels now come from the dictionary internally; `showAllLabel` remains an optional override (used by race-table).

- [ ] **Step 1: Extend dictionaries**

Add to `it.ts` (and mirror in `en.ts` — the current site text IS the English version for these sections, so `en.ts` takes today's hardcoded strings verbatim; `it.ts` gets the Italian translations below):

```ts
  footer: {
    terms: "Termini di Servizio",
    privacy: "Informativa sulla Privacy",
    support: "Contatta il Supporto",
    about: "Chi Siamo",
    copyright: "© 2026 Baseline Tennis. Tutti i diritti riservati.",
  },
  errors: {
    title: "Qualcosa è andato storto",
    genericBody:
      "Si è verificato un errore imprevisto. Il nostro team è stato avvisato. Riprova o torna alla homepage.",
    officialBody:
      "Non siamo riusciti a caricare il ranking ufficiale. Potrebbe essere un problema temporaneo della fonte dati. Riprova.",
    liveBody:
      "Non siamo riusciti a caricare il ranking live. Potrebbe essere un problema temporaneo della fonte dati. Riprova.",
    raceBody:
      "Non siamo riusciti a caricare la Race to Turin. Potrebbe essere un problema temporaneo della fonte dati. Riprova.",
    tryAgain: "Riprova",
    homepage: "Homepage",
    errorId: "ID errore: ",
  },
  notFound: {
    title: "Pagina non trovata",
    body: "La pagina che cerchi non esiste o è stata spostata. Torna alla homepage.",
    backHome: "Torna a Baseline",
  },
  rankings: {
    shell: {
      searchPlaceholder: "Cerca giocatore...",
      filter: "Filtri",
      filtersHeading: "Filtri",
      reset: "Azzera",
      nationality: "Nazionalità",
      ageGroup: "Fascia d'età",
      selectNationality: "Seleziona nazionalità",
      selectAgeGroup: "Seleziona fascia d'età",
      allNationalities: "Tutte le nazionalità",
      allAges: "Tutte le età",
      under21: "Under 21",
      age21to25: "21 - 25",
      age26to30: "26 - 30",
      over30: "Over 30",
      updated: "Aggiornato: ",
    },
    table: {
      rank: "#",
      move: "Mov.",
      player: "Giocatore",
      liveStatus: "Stato Live",
      points: "Punti",
      diff: "+/-",
      nextWeek: "Pross. Sett.",
      status: "Stato",
    },
    pagination: {
      showAll: "Mostra tutti i giocatori",
      showTop: (n: number) => `Mostra Top ${n}`,
    },
    expandedCard: {
      careerHigh: "Best Ranking",
      projNext: "Proi. Prossima",
      projMax: "Proi. Max",
      officialPoints: "Punti Ufficiali",
      pts: "pt",
      winsNextMatch: "Se vince il prossimo match",
      titleWin: "Se vince il torneo",
      atpVerified: "Verificato ATP",
    },
    liveStatus: {
      active: "In gara",
      out: "Eliminato",
    },
    race: {
      turinCut: "Taglio Torino",
      qualified: "Qualificato",
      inContention: "In corsa",
      qualifiedPlayers: "Giocatori qualificati",
      cutoffProjection: "Proiezione del taglio",
      cutoffCaption: "Punti stimati necessari per qualificarsi",
      showFullRace: "Mostra tutta la Race",
    },
    pages: {
      officialTitle: "Official ATP Rankings",
      officialSubtitle: "Il ranking ufficiale ATP di singolare, aggiornato ogni settimana.",
      liveTitle: "Live ATP Rankings",
      liveSubtitle: "Proiezioni punti in tempo reale basate sui tornei in corso.",
      raceTitle: "Race to Turin",
      raceSubtitle:
        "I migliori 8 giocatori dell'anno solare si qualificano per le prestigiose Finals di Torino.",
    },
  },
```

For `en.ts`: copy the corresponding English strings currently hardcoded in the components (e.g. `errors.title: "Something went wrong"`, `rankings.shell.searchPlaceholder: "Search player..."`, `rankings.race.turinCut: "Turin Cut"`, `rankings.pagination.showTop: (n) => \`Show Top ${n}\``, `movement` abbreviations stay as-is, etc.). TypeScript flags any missed key.

- [ ] **Step 2: Wire components to the dictionary**

- `footer.tsx`: add `"use client"`, call `useTranslation()`, build the links array inside the component from `t.footer.*`; copyright from `t.footer.copyright`.
- Error pages + `not-found.tsx`: already client components (`"use client"` required by Next error files); replace literals with `t.errors.*` / `t.notFound.*`. Each route error page uses its specific body key.
- `ranking-page-shell.tsx`: all labels/placeholders from `t.rankings.shell.*`. **Do not touch Select `value` props** — they are filter logic keys; translate only visible spans.
- Tables: column headers from `t.rankings.table.*`; race-table status labels from `t.rankings.race.qualified` / `.inContention`, cut badge from `t.rankings.race.turinCut`, and pass `t.rankings.race.showFullRace` to `usePagination`.
- `race-summary-cards.tsx`: labels from `t.rankings.race.*`.
- `expanded-card.tsx`: labels from `t.rankings.expandedCard.*`.
- `live-status-cell.tsx`: `"Active"`/`"Out"` from `t.rankings.liveStatus.*`.
- `use-pagination.ts`: call `useTranslation()` internally; `buttonLabel` uses `t.rankings.pagination.showTop(nextLimit)` and default show-all from `t.rankings.pagination.showAll`; keep the optional `showAllLabel` parameter as override.
- `official-client.tsx` / `live-client.tsx` / `race-client.tsx`: `title` / `subtitle` props from `t.rankings.pages.*`.
- `movement-badge.tsx`: "MR"/"NMR" abbreviations and ▲/▼ symbols stay untranslated (rank-movement notation, locale-neutral).

- [ ] **Step 3: Verify + commit**

Run: `npx tsc --noEmit && npm run build > build.log 2>&1 && tail -n 5 build.log` → success.

```bash
git add src/lib/i18n src/components src/app
git commit -m "feat(i18n): translate chrome, errors, and rankings pages"
```

---

### Task 8: i18n — homepage editorial content

**Files:**
- Modify: `src/lib/i18n/it.ts`, `src/lib/i18n/en.ts` (add `home` section)
- Modify: `src/components/homepage/hero-section.tsx`, `ranking-section.tsx`, `pyramid-section.tsx`, `timeline-section.tsx`, `scoring-section.tsx`, `glossary-section.tsx`, `section-navigator.tsx`
- Modify: `src/app/page.tsx`

**Interfaces:**
- Consumes: `useTranslation`.
- Produces: dictionary section `home` with sub-sections `hero`, `ranking`, `pyramid`, `timeline`, `scoring`, `glossary`, `cta`, `sections`.

- [ ] **Step 1: Extend dictionaries with the `home` section**

Procedure (the Dictionary type makes any omission a compile error):
1. For every editorial constant, move the **Italian strings verbatim** from the component into `it.ts` and write natural English translations in `en.ts`. Keep tennis proper nouns (Grand Slam, ATP Finals, tournament names, "Deuce", "Tie-Break") untranslated in both.
2. Structure — arrays of objects keyed by the same shape the components already use, so the components map over `t.home.<section>.<items>` instead of module constants:

```ts
  home: {
    sections: {
      intro: "Intro", ranking: "Ranking", tournaments: "Tornei",
      season: "Stagione", scoring: "Punteggio", glossary: "Dizionario",
      navAriaLabel: "Navigazione sezioni",
      goTo: (label: string) => `Vai a ${label}`,
    },
    hero: {
      subtitle: "La Linea Di Fondo",
      lead: "La linea di fondo campo è il punto di partenza di ogni scambio. Qui su Baseline, è anche il fondamento della tua conoscenza del tennis professionistico.",
      scrollLabel: "Scopri",
      scrollAria: "Scorri verso il basso",
    },
    ranking: {
      title: "Il Ranking",
      lead: "Il tennis è l'unico sport globale che dura 11 mesi l'anno. Non esiste una \"stagione regolare\": esiste solo il ranking mondiale, una classifica viva che cambia ogni lunedì.",
      highlights: [
        { value: "19", label: "I Migliori Risultati", desc: "Vengono sommati solo i tuoi migliori piazzamenti stagionali." },
        // …remaining 3 items moved verbatim from HIGHLIGHTS
      ],
    },
    pyramid: {
      title: "La Piramide dei Tornei",
      lead: "Non tutti i tornei sono uguali",
      // intro paragraphs, "Punti al vincitore:", "Esplora la piramide", scroll aria,
      // tiers: array of 6 { name, points, tagline, description } moved verbatim from TIERS
    },
    timeline: {
      title: "Un anno di Tennis",
      lead: "La stagione tennistica dura circa 11 mesi e segue l'estate in giro per il mondo, cambiando superficie di gioco.",
      surfaces: { hard: "Cemento", clay: "Terra Rossa", grass: "Erba", indoor: "Indoor" },
      // events: array of 6 { period, title, highlight, description } moved verbatim from EVENTS
    },
    scoring: {
      // chapters: array of 4 { title, content, curiosity? } from CHAPTERS
      // curiosityLabel: "Curiosità:", you: "Tu", opponent: "Avversario",
      // replay: "Rigioca", plusOneGame: "+1 Game", clickHint: "+ Clicca",
      // badges: all 12 getBadgeText() strings across the three visuals, e.g.:
      //   gameYouWin: "Hai vinto il game!", gameOpponentWins: "L'avversario vince il game!",
      //   advantageYou: "Vantaggio: Tu", advantageOpponent: "Vantaggio: Avversario",
      //   deuceClick: "Deuce: Clicca per il vantaggio", deuce: "Parità (Deuce)",
      //   gameIdle: "Il Game: Clicca per giocare",
      //   setYouWin: "Hai vinto il Set!", setOpponentWins: "L'avversario vince il Set!",
      //   setTiebreak: "Tie-Break! (6-6)", setIdle: "Il Set: Vinci 6 Game",
      //   tbYouWin: "Hai vinto poi il set! (7-6)", tbOpponentWins: "L'avversario vince il set (7-6)",
      //   tbIdle: "Tie-Break: Arriva a 7 punti"
      // Score display values ("0","15","30","40","GAME","AD") stay untranslated.
    },
    glossary: {
      title: "Parla come un Pro",
      lead: "I telecronisti parlano spesso in codice. Ecco le parole chiave per seguire una partita senza perderti neanche un punto.",
      prevCard: "Carta precedente",
      nextCard: "Prossima carta",
      swipeHint: "← Swipe →",
      // terms: array of 15 { term, def } moved verbatim from TERMS
      // (term names like "ACE", "BREAK" stay identical in EN; "PASSANTE" → "PASSING SHOT" in en.ts)
    },
    cta: {
      badge: "Entra nel Tour",
      title: "Pronto a seguire l'azione?",
      body: "Ora che conosci le basi e i segreti del circuito, sei pronto a tuffarti nella stagione. Esplora le classifiche aggiornate.",
      button: "Esplora i Live Rankings",
    },
  },
```

The commented lines are the required keys — write them out fully with the verbatim strings when editing (they are elided here only for plan brevity; the component files contain the exact source text).

- [ ] **Step 2: Wire homepage components**

For each component: delete the module-level editorial constant, call `useTranslation()`, and map over the dictionary array instead. Non-text fields (ids, colors, icons, point values used for logic) stay in the component — merge by index, e.g. in `pyramid-section.tsx`:

```tsx
const TIER_META = [
  { id: "finals", color: "bg-amber-400", /* …non-text fields kept from TIERS… */ },
  // …
] as const;

// inside the component:
const { t } = useTranslation();
const tiers = TIER_META.map((meta, i) => ({ ...meta, ...t.home.pyramid.tiers[i] }));
```

Apply the same merge-by-index pattern to `EVENTS` (timeline), `CHAPTERS` (scoring), `TERMS` (glossary), `HIGHLIGHTS` (ranking). In `app/page.tsx`, `SECTIONS` labels come from `t.home.sections.*`; `section-navigator.tsx` aria-label uses `t.home.sections.navAriaLabel` and `t.home.sections.goTo(section.label)`.

- [ ] **Step 3: Verify + commit**

Run: `npx tsc --noEmit && npm run build > build.log 2>&1 && tail -n 5 build.log` → success.

```bash
git add src/lib/i18n src/components/homepage src/app/page.tsx
git commit -m "feat(i18n): translate homepage editorial content"
```

---

### Task 9: Final verification

**Files:** none new.

- [ ] **Step 1: Full clean build + lint**

Run: `npx tsc --noEmit && npm run lint && npm run build > build.log 2>&1 && tail -n 10 build.log`
Expected: all exit 0.

- [ ] **Step 2: Residual-literal audit**

Run:
```bash
grep -rn "bg-white\b\|bg-white/" src --include="*.tsx" | grep -v scoring-section
```
Expected: no output. Then spot-check that remaining Italian literals live only in `src/lib/i18n/it.ts`:
```bash
grep -rn "Vai alle\|Torna alla\|Giocatore\|Qualcosa è andato" src --include="*.tsx"
```
Expected: no output.

- [ ] **Step 3: Hand off to user for manual testing**

Per project rule 8: no automated browser verification. Ask the user to run `npm run dev` and check both themes × both languages on `/`, `/official`, `/live`, `/race`.
