# Pyramid Section — Visual Enhancements

**Date:** 2026-07-26
**Status:** Awaiting approval
**Scope:** `src/components/homepage/pyramid-section.tsx`

## Problem

The section works well (sticky scrollytelling, tier narrative, crown finale) and must
not be restructured. Three light touches were agreed with the user (options 1, 2, 4
from the review; option 3 — points inside pyramid blocks — was declined):

1. The ATP Finals crown landing is the narrative climax but lands with no celebration.
2. The white text cards on white background rely on shadow alone; the card ↔ pyramid
   link is only carried by the graphic on the left.
3. The active pyramid block activates with a plain CSS `scale-110` snap.

## What Will Be Implemented

### 1. Crown landing celebration (one-shot particle burst)
- When `finalsLanded` flips to true, render 8 small lime shards radiating out from the
  crown's position (Framer Motion, one-shot: scale/translate/fade over ~600ms).
- Plus a brief glow flash on the crown (box-shadow ramps up then settles).
- Not a loop — runs once per landing (re-runs if the user scrolls back and re-triggers,
  matching the crown's own enter/exit behavior).
- Implementation: absolutely-positioned wrapper around the crown; shards are `motion.span`
  with precomputed angle vectors; `pointer-events-none`, `aria-hidden`.

### 2. Left accent border on the text cards
- Each `TierTextBlock` card gets a 4px left border:
  - `border-l-baseline-lime` while its tier is active (`isInView`),
  - `border-l-deep-navy/20` otherwise.
- Smooth `transition-colors` — reinforces the card ↔ lit pyramid block pairing.

### 3. Spring on the active pyramid block
- Convert the tier row `div` to `motion.div`; drive `scale` (1 / 1.1) via `animate`
  with a light spring (`stiffness ~300, damping ~18`) instead of the CSS class snap.
- Color/opacity keep the existing CSS transition classes (they animate fine in CSS);
  only the scale moves to the spring.

## What Will NOT Change

- Scroll mechanics, sticky behavior, chapter order, copy, i18n.
- Pyramid block sizes/colors/tones, points pill in the cards.
- No new dependencies.

## Files Touched

| File | Change |
|------|--------|
| `src/components/homepage/pyramid-section.tsx` | Burst on crown landing, card left border, spring on active block |

## Design Rationale (from ui-ux-pro-max)

- "Motion conveys meaning": burst = milestone reached (the section's one climax);
  spring = state change acknowledgment. Both one-shot, no infinite decorative loops.
- Duration rules: burst ~600ms total, spring settles ≈300ms — within guidelines.
- Transform/opacity only — no layout-affecting animation.
- `prefers-reduced-motion`: burst skipped entirely via `useReducedMotion`.

## Verification

- `npx tsc --noEmit` (full build/lint blocked by Node 16 on this machine).
- Manual check by user.
