# Timeline Section — Visual Enhancements

**Date:** 2026-07-26
**Status:** Approved (options 1, 2, 3, 4; option 5 — period watermark — declined)
**Scope:** `src/components/homepage/timeline-section.tsx`

## Problem

The season timeline is clean but visually uniform: every event carries the same
weight, hover feedback is generic, card entrances slide too far (±50px reads as
"PowerPoint"), and the central line fill — the section's spine — has no focal point.

## What Will Be Implemented

### 1. Node hierarchy: Grand Slams stand out
- Add `isMajor` metadata to the event surface list (majors: Australian Open,
  Roland Garros, Wimbledon, US Open — identified by index in `EVENT_SURFACES`).
- Major nodes: larger (w-10 vs w-8 desktop) + an outer ring in the surface color
  (`ring-2 ring-offset-2`, ring color = surface dot color at ~40% opacity).
- Minor nodes unchanged.

### 2. Surface-tinted hover glow on cards
- Extend `SURFACE_COLORS` with a `glow` class per surface
  (e.g. hard → `hover:shadow-[0_8px_30px_rgba(59,130,246,0.25)]`).
- Applied on `TimelineCardBody`'s existing hover transition — replaces the generic
  `hover:shadow-hover`.

### 3. Refined card entrance
- Slide offset reduced from ±50px to ±24px (skill rule: small offsets read as fade,
  not slide), add `scale: 0.96 → 1`.
- Duration 0.5s (was 0.7), `easeOut`. Transform/opacity only, as before.

### 4. Traveling dot on the central line (section signature)
- A small lime dot (with soft glow) positioned at the leading edge of the line fill,
  driven by the same `smoothProgress` spring that drives `lineFill` — it rides down
  the line as you scroll.
- Desktop: on the central line. Mobile: on the left line.
- Hidden under `prefers-reduced-motion` (the plain fill remains).

## What Will NOT Change

- Section structure, alternating layout, legend, copy, i18n.
- Surface color system (badges/dots) — only extended with glow variants.
- No new dependencies.

## Files Touched

| File | Change |
|------|--------|
| `src/components/homepage/timeline-section.tsx` | Node hierarchy, hover glows, entrance tuning, traveling dot |

## Design Rationale (from ui-ux-pro-max)

- Scroll Reveal (Subtle tier): "keep the y offset small (8–16px) so it reads as a
  fade, not a slide" — applied to the horizontal offset as well.
- Visual hierarchy: majors deserve more visual weight (style-selection priority rule).
- Motion conveys meaning: the traveling dot shows scroll position on the season,
  echoing the tennis-ball motif; respects `prefers-reduced-motion` (HIGH severity).

## Verification

- `npx tsc --noEmit` (full build/lint blocked by Node 16 on this machine).
- Manual check by user.
