# Footer — centratura link con griglia a 3 colonne

**Date:** 2026-07-27
**Status:** Awaiting approval

## Problem

The footer uses `flex justify-between`: the links sit between logo and
copyright, so their centering depends on the widths of the outer elements
(the copyright text is much wider than the logo). Visually the links appear
off-center relative to the page.

## Solution

Switch the desktop layout of `src/components/layout/footer.tsx` from flex
to a balanced 3-column grid:

- `md:grid md:grid-cols-3 md:items-center` on the container.
- Column 1: logo, left-aligned (`justify-self-start`).
- Column 2: links nav, truly centered (`justify-self-center`).
- Column 3: copyright, right-aligned (`justify-self-end`).
- Mobile (below `md`): keep the current stacked column
  (`flex flex-col items-center gap-4`), unchanged behavior.

## Coherence touches (same intervention)

- Links: keep pill aesthetic — add `px-3 py-1.5 rounded-full
  hover:bg-surface-gray/50` so hover matches the nav pills used elsewhere.
- Slightly larger gap between the two links handled by the pill padding
  (nav gap reduced from 6 to 2).

No copy, i18n, or route changes. Dark mode unaffected (uses existing
semantic tokens).

## Verification

Container build passes.
