# Scoring Section — Visual Enhancements

**Date:** 2026-07-26
**Status:** Approved (options 1, 2, 3; option 4 — chapter progression border — discarded)
**Scope:** `src/components/homepage/scoring-section.tsx`

## Problem

The four chapter cards (Game, Deuce, Set, Tie-break) are visually identical with no
sense of progression; winning an interactive game shows only the replay overlay with
no celebration; score buttons give minimal press feedback (`active:scale-95` only).

## What Will Be Implemented

### 1. Chapter number watermark (01–04) — REMOVED
- Implemented (top-right, then moved bottom-left), but removed at user request
  after visual review (2026-07-26): didn't fit the desired look.
- The curiosity box was restyled in the same session: grey rectangle replaced
  by a lime left-border quote style (Lightbulb + olive label + italic text).

### 2. Win celebration burst (reuses the Pyramid CrownBurst pattern)
- Extract the `CrownBurst` component from `pyramid-section.tsx` into a shared
  `src/components/homepage/celebration-burst.tsx` (same 8-shard lime burst,
  parameterized radius so board-sized bursts can be slightly wider).
- Pyramid imports it from the new module (no visual change there).
- In Scoring: when a game/set/tiebreak ends (`gameOver` / `setOver` / `over`
  flips true), fire the burst at the center of the board card, just before the
  replay overlay fades in. One-shot via `AnimatePresence`, skipped under
  `prefers-reduced-motion`.

### 3. Score button press feedback (lime border flash)
- On each score tap, the pressed button's border flashes lime and settles back
  (~250ms). Implemented with a keyed re-triggerable Framer animation on
  `borderColor` (or a brief CSS class toggle via state) — no layout shift.
- Applies to both player and opponent buttons in `InteractiveScoreboard`,
  `SetVisual` rows, and `TieBreakVisual`.

## What Will NOT Change

- Scoring logic, chapter copy, board layout, replay overlay, i18n.
- Pyramid burst visual (only its import path changes).

## Files Touched

| File | Change |
|------|--------|
| `src/components/homepage/celebration-burst.tsx` | New: shared burst component (extracted from pyramid) |
| `src/components/homepage/pyramid-section.tsx` | Import burst from shared module |
| `src/components/homepage/scoring-section.tsx` | Watermark, win burst, button press flash |

## Design Rationale (from ui-ux-pro-max)

- Interaction feedback is a CRITICAL-priority rule: every tap needs immediate
  visible acknowledgment (the border flash).
- Motion conveys meaning: burst = earned win after user interaction; watermark
  gives chapter identity/progression without motion cost.
- Reuse over invention: the burst repeats an established pattern (Pyramid crown).
- `prefers-reduced-motion` respected for the burst; flash is a color transition
  (non-positional) and stays.

## Verification

- `npx tsc --noEmit` (full build/lint blocked by Node 16 on this machine).
- Manual check by user.
