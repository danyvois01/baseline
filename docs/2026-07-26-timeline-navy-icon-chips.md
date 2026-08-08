# Timeline Section — Navy Icon Chips

**Date:** 2026-07-26
**Status:** Approved (option A — completes the navy badge with a matching icon chip)
**Scope:** `src/components/homepage/timeline-section.tsx`

## Problem

The navy period badge alone looked orphaned on the white cards (user feedback).
The navy accent needs to be a *pattern* inside the card, not a single element.
Solution: add the same navy icon chip used in the Pyramid cards (deep-navy circle,
lime icon) so badge + chip form a consistent branded pair.

## What Will Be Implemented

### Navy icon chip in each card header
- A `deep-navy` circle (w-12 h-12 md:w-14 md:h-14, rounded-full, shadow) containing a
  lucide icon in `baseline-lime` — same treatment as Pyramid's tier chips.
- Placed at the left of the card header, beside title + highlight (flex row with gap,
  like Pyramid's icon + title layout).
- Icon per event (index-matched to `EVENT_META`):

| # | Event | Icon | Reasoning |
|---|-------|------|-----------|
| 0 | Australian swing / AO | `Sun` | Australian summer opener |
| 1 | Sunshine Double | `Sparkles` | The "sunshine" nickname, twin events |
| 2 | European clay / RG | `Trophy` | Slam on clay — trophy for the major |
| 3 | Grass / Wimbledon | `Crown` | "The Temple", most prestigious major |
| 4 | US hardcourt swing / USO | `Zap` | Fast New York finale, night energy |
| 5 | Asian/Indoor Finals | `Building2` | Indoor arenas closing the season |

- Icons imported from `lucide-react` (already a dependency).
- `EVENT_META` extended with the icon component per event.

## What Will NOT Change

- Navy period badge (kept as implemented), hyphens, node hierarchy, glows,
  traveling dot, entrance animations, copy, i18n.

## Files Touched

| File | Change |
|------|--------|
| `src/components/homepage/timeline-section.tsx` | Icon in EVENT_META; chip in card header |

## Design Rationale

- Repeats an existing pattern (Pyramid tier chips) instead of inventing a new one —
  consistency rule from the skill's style-selection priority.
- SVG icons only, no emoji (skill anti-pattern rule).

## Verification

- `npx tsc --noEmit` (full build/lint blocked by Node 16 on this machine).
- Manual check by user.
