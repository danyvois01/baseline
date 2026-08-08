# Rankings Pages — Restyling (Header + Table Refinement)

**Date:** 2026-07-26
**Status:** Approved in chat, implementing
**Scope:** `/live`, `/official`, `/race` pages — shared shell and the three tables

## Problem

The three ranking pages share `RankingPageShell` (small title + search/filter
controls on a plain light background) and three near-duplicate tables. After the
homepage restyling, these pages feel visually disconnected: they don't carry the
Baseline identity (deep-navy editorial moments, lime accent, display typography).
Table rows rely on borders alone for separation and duplicate the +/- badge
markup in three places.

## What Will Be Implemented

### 1. Editorial dark header band (`RankingPageShell`)

The shell is restructured to render a **full-bleed `bg-deep-navy` band** below
the nav, with inner content aligned to the `max-w-[1280px]` container:

- **Micro-label**: uppercase lime, wide tracking (new i18n string
  `rankings.shell.microLabel`, IT/EN — e.g. "ATP Tour — Rankings").
- **Display title**: hero-style `font-heading font-extrabold uppercase
  tracking-tighter`, ~44–60px, white.
- **Subtitle**: `text-white/70`.
- **Controls row inside the band**: search input and filter pill in dark
  variant (`bg-white/10`, `border-white/15`, white text, lime focus ring);
  "Updated" badge with a lime dot. The filter popover panel is unchanged
  (floating surface tokens work in both themes).

Because the band is full-bleed, the `max-w-[1280px]` container moves from the
three `page.tsx` files into the shell: the shell renders the band full-width
and wraps both the band content and the table content in the container. The
three `page.tsx` files drop their inner container div (keep `pt-28` clearance
for the floating nav — the band starts beneath it).

Dark mode: `deep-navy` (#0A0E14) stays distinct from the dark surface
(#141921); no variant needed.

### 2. Table row refinement (all three tables)

No special top-3 treatment — readability only:

- **Subtle zebra striping**: alternate rows get `bg-surface-gray/20`; row
  borders soften to `border-subtle/40`.
- **`tabular-nums` on the rank number** (2-digit ranks currently shift).
- **Shared `PointsDiffBadge` component** (`src/components/rankings/
  points-diff-badge.tsx`): the +/- pill is duplicated verbatim in
  `rankings-table` and `race-table`; extract it and reuse. Same visual output.
- **Consistent vertical rhythm** across the three tables (same row padding,
  same hover `baseline-lime/5`).
- Mobile: same zebra + shared badge; layout unchanged.

## What Will NOT Change

- Filter/search/pagination logic, existing i18n keys, Live expanded card,
  Race summary cards and Turin cut separator, scraper and data layer.
- No new dependencies.

## Files Touched

| File | Change |
|------|--------|
| `src/components/rankings/ranking-page-shell.tsx` | Navy band header, dark control variants, owns the page container |
| `src/components/rankings/rankings-table.tsx` | Zebra, tabular-nums rank, use shared badge |
| `src/components/rankings/official-table.tsx` | Zebra, tabular-nums rank |
| `src/components/rankings/race-table.tsx` | Zebra, tabular-nums rank, use shared badge |
| `src/components/rankings/points-diff-badge.tsx` | New shared component |
| `src/app/live/page.tsx`, `src/app/official/page.tsx`, `src/app/race/page.tsx` | Drop inner container (moves into shell) |
| `src/lib/i18n/en.ts`, `src/lib/i18n/it.ts` | `rankings.shell.microLabel` |

## Iteration 2 (user feedback)

The first pass pushed the table too far down the page. Changes:

- **Compact navy band**: only micro-label + title + subtitle (title reduced to
  32–44px, tighter vertical padding). Controls removed from the band.
- **Toolbar embedded in the table widget**: the shell now builds the controls
  row (search, filter popover, "updated" badge with lime dot) as a light-theme
  `toolbar` node and passes it to the children render prop
  (`children(filtered, toolbar)`). `RankingsTable` and `OfficialTable` accept a
  `toolbar` prop rendered at the top of the widget; the Race page renders it
  inside its own widget wrapper above `RaceTable`.

## Iteration 3 (user feedback — Race page uniformity)

The Race page was the only one with summary cards between the band and the
table. Changes:

- **Qualified Players card removed** (`race-summary-cards.tsx` deleted, barrel
  export removed).
- **Cut-off projection moved into the navy band**: new optional `headerExtra`
  prop on `RankingPageShell`, rendered right-aligned in the band. The Race
  client passes the cut-off stat (icon + label, big white points value,
  caption) so the table starts immediately below the band, like Live/Official.

## Iteration 4 (user feedback — row info styling)

- **Live status readability** (`live-status-cell.tsx`): drop the
  `opacity-50 + grayscale` treatment on eliminated players. Distinction is now
  structural: active keeps the pulsing lime dot + semibold text + filled lime
  round badge; eliminated gets a solid neutral dot, full-strength `text-muted`
  text, and an outlined (border, no fill) round badge.
- **Expanded card hierarchy** (`expanded-card.tsx`): projected values (Next /
  Max) become the protagonists (~20px, Proj. Max in primary-olive); Career
  High and Official Points stay as secondary data. The eliminated-state dash
  stays (projections are meaningless when out; exit round already shown in the
  main row) but loses the extra opacity. Local `fmt()` replaced with shared
  `formatPoints`.
- **Player cell pill restyle** (`player-cell.tsx`): keep flag + nationality
  pill + dot + age, but restyle to Baseline tokens (`surface-gray` /
  `text-muted`) instead of the legacy Material vocabulary
  (`surface-container-high` / `on-surface-variant`).
- Rejected: movement badge icon/tooltip work (scraper emits no MR/NMR codes),
  "pts" suffix on the in-row points column.

## Iteration 5 (user feedback — kill the mid-grays, unify badge grammar)

Established a single visual grammar for the ranking tables:
**filled pill = signal** (lime active, green/red movement), **outlined pill =
neutral** (round badge when out, "—" movement, "—" diff, nationality code),
**foreground/60 = captions** (age, pts suffix, footnotes). Specifically:

- Table header labels: 11px bold `foreground` (was muted `label-md`).
- Eliminated status: `bg-foreground` dot, full-contrast text, outlined badge.
- Neutral "—" badges (movement, diff, next-week): outlined `foreground/20`
  border + `foreground` text, replacing the gray-filled Material pills.
- Nationality pill: outlined, `foreground` text (was gray fill).
- Expanded card: labels in bold `foreground`, captions `foreground/60`; the
  dash for eliminated players removed entirely — the projections block simply
  doesn't render (exit round is already in the main row).
- Remaining legacy Material tokens (`on-surface-variant`, `surface-container*`)
  removed from all rankings components.

## Verification

- `npx tsc --noEmit`.
- Manual check by user (no browser/screenshot tooling per project rules).
