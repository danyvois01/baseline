# Ranking Section — Visual Enhancements

**Date:** 2026-07-26
**Status:** Awaiting approval
**Scope:** `src/components/homepage/ranking-section.tsx`

## Problem

The scroll-pinned stats section is the sparsest moment of the page: a bare number on a
plain white background for ~3 viewport heights. The tiny 2px progress bar is easy to
miss, transitions are opacity-only, and there is no visual anchor holding the eye at
the center.

Lesson applied from the Hero iteration: no scattered decorative elements (particles,
grain, grids). Focus on **one strong focal treatment** on the stat itself.

## What Will Be Implemented

### 1. Progress ring around the stat number (replaces the tiny bottom bar)
- An SVG circle (~340–420px diameter, desktop only) drawn around the centered number.
- Track: light `surface-gray` stroke. Fill: `baseline-lime` stroke whose `pathLength`
  is driven by the existing `scrollYProgress` — the ring closes as you scroll
  through the section, giving clear "how much is left" feedback.
- Round line caps; the ring is the section's single visual signature.
- The current 2px bottom bar is removed (the ring replaces it).

### 2. Soft lime radial glow behind the active number
- One `radial-gradient` disc (lime, low opacity, blur) centered behind the number —
  same treatment family as the Hero's existing ambient blob, so it feels consistent.
- Static (no pulse): it simply anchors the composition and lifts the number off
  the white background.

### 3. Scale transition on stat change (in addition to opacity)
- Each stat currently cross-fades (`opacity` only). Add a subtle scale ramp
  (0.92 → 1 → 0.96 across the same scroll bands) via `useTransform`, so numbers
  "arrive and settle" instead of just fading. Transform-only — no layout cost.

### 4. Stat index indicator (01 / 02 / 03 / 04)
- Small counter ("01 — 04" style) under the label area, bold lime current index.
- Orients the user inside the pinned scroll — right now there's no sense of how
  many stats exist.

### 5. Mobile
- Mobile list stays as-is (already clean); only addition is the radial glow behind
  each number (cheap, static).

## What Will NOT Change

- Scroll pinning mechanics, bands, i18n, header copy.
- No background change for the section (stays `surface-white` — the dark-section
  experiment can be discussed separately if wanted).
- No new dependencies.

## Files Touched

| File | Change |
|------|--------|
| `src/components/homepage/ranking-section.tsx` | Ring, glow, scale ramp, index indicator; remove old bottom bar |

## Design Rationale (from ui-ux-pro-max)

- "Loading feedback / progress visibility" (CRITICAL interaction rule): the ring makes
  scroll progress unmissable vs. the current 2px bar.
- Animation rules: transform/opacity only; motion conveys meaning (ring = progress,
  scale = arrival), not decoration.
- Data-dense dashboard style: KPI numbers deserve a strong focal treatment.

## Verification

- `npx tsc --noEmit` (build/lint blocked by Node 16 on this machine).
- Manual check by user.
