# Timeline Section — Navy Period Badge

**Date:** 2026-07-26
**Status:** Approved (option 2 from navy-accent proposals; options 1, 3, 4 declined)
**Scope:** `src/components/homepage/timeline-section.tsx`, `src/lib/i18n/it.ts`, `src/lib/i18n/en.ts`

## Problem

The Timeline is the only homepage section with no deep-navy element — it reads
lighter/off-brand next to Hero (navy court), Scoring (navy boards), Glossary
(navy cards). A full dark background was considered and declined; targeted navy
accents preferred.

## What Will Be Implemented

### 1. Period badge switches to deep-navy
- The period pill on each card ("Gennaio", "Aprile-Maggio", …) changes from
  surface-tinted (`surface.bg` + `surface.text`) to **deep-navy background with
  white text** (`bg-deep-navy text-white`), dark-mode safe.
- The little surface dot inside the badge keeps its surface color — it pops on
  navy even better. Surface color otherwise stays on the highlight text + node.

### 2. Em-dash → hyphen in period labels
- Replace "—" (em dash) with "-" in the timeline `period` strings in both
  locale dictionaries (e.g. "Aprile—Maggio" → "Aprile-Maggio").

## What Will NOT Change

- Card layout, icons (none added), legend, nodes, line, animations.
- Surface color system elsewhere in the card.

## Files Touched

| File | Change |
|------|--------|
| `src/components/homepage/timeline-section.tsx` | Badge classes: navy bg + white text |
| `src/lib/i18n/it.ts` | Period strings: em dash → hyphen |
| `src/lib/i18n/en.ts` | Period strings: em dash → hyphen (if present) |

## Verification

- `npx tsc --noEmit` (full build/lint blocked by Node 16 on this machine).
- Manual check by user.
