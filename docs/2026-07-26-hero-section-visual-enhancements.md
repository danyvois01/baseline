# Hero Section — Visual Enhancements

**Date:** 2026-07-26
**Status:** Awaiting approval
**Scope:** `src/components/homepage/hero-section.tsx` (+ small global CSS addition)

## Problem

The hero has strong foundations (animated court SVG, parallax, typographic scale) but the
background feels empty and flat: a single lime blob on plain white, no texture, no depth
layering, and an abrupt boundary with the Ranking section below.

## Goals

- Add perceived depth without changing the layout, copy, or existing animations.
- Keep the light, clean "Baseline" identity — enhancements must stay subtle.
- Full dark mode support and `prefers-reduced-motion` compliance.
- Zero impact on CLS/performance: everything is absolutely-positioned, GPU-friendly
  (transform/opacity only), and pointer-events-none.

## What Will Be Implemented

### 1. Dual ambient gradient blobs (dimensional layering)
- Keep the existing lime blob (top-left quadrant).
- Add a **second blob** in the bottom-right area: `deep-navy`-based, very low opacity
  (`bg-deep-navy/10` light, `dark:bg-baseline-lime/5`), `blur-[140px]`, larger radius.
- The two blobs create a diagonal light axis (lime ↖ / navy ↘) that gives the section
  a subtle sense of space instead of a flat white void.

### 2. Noise/grain texture overlay
- A full-section overlay using an inline SVG `feTurbulence` data-URI as
  `background-image`, at ~2% opacity, `mix-blend-overlay`.
- Implemented as a reusable utility class `.bg-noise` in `globals.css` so other
  sections can adopt it later.
- Static (no animation) — pure texture, no motion cost.

### 3. Floating ball particles (ambient motion)
- 4 small lime dots (`w-1.5`–`w-2.5`, opacity 0.2–0.35) absolutely positioned around
  the empty areas of the hero.
- Each drifts slowly with Framer Motion (`y: [0, -18, 0]`, 7–11s, `easeInOut`,
  staggered delays) — echoing the tennis-ball motif from the court SVG.
- Hidden entirely when `prefers-reduced-motion` is set (via Framer's `useReducedMotion`).
- Hidden on mobile (`hidden md:block`) to keep small screens clean.

### 4. Faint court-line background pattern
- A very subtle horizontal baseline stripe pattern (CSS `linear-gradient` repeating
  lines, ~2–3% opacity) OR two faint absolute court lines echoing the SVG — final
  choice during implementation based on visual result.
- Masked with a radial gradient so it fades out toward the center where the text sits
  (never competes with the headline).

### 5. Bottom edge gradient fade
- A 120–160px tall gradient strip at the very bottom of the section
  (`from-transparent to-surface-white`) to soften the transition into the
  Ranking section — currently the parallax content scrolls under a hard edge.

### 6. Reduced-motion support
- `useReducedMotion()` from Framer Motion: particles are not rendered and the ball
  rally animation in the court SVG falls back to a static visible ball.

## What Will NOT Change

- Layout, grid, typography, copy, i18n keys.
- The court SVG draw-on animation and the headline underline animation.
- Scroll parallax behavior (`useScroll`/`useTransform`).
- No new dependencies.

## Files Touched

| File | Change |
|------|--------|
| `src/components/homepage/hero-section.tsx` | Add blobs, particles, pattern, bottom fade, reduced-motion handling |
| `src/app/globals.css` | Add `.bg-noise` utility (SVG turbulence data-URI) |

## Design Rationale (from ui-ux-pro-max)

- **Dimensional Layering** style: z-depth via layered ambient elements + elevation.
- Animation rules: only transform/opacity, 150–300ms for micro-interactions,
  slow ambient loops acceptable for decorative background (non-blocking, subtle).
- Accessibility: `prefers-reduced-motion` respected (HIGH severity rule);
  all decorative layers `aria-hidden` + `pointer-events-none`; text contrast unchanged.

## Verification

- `npm run build` + lint pass.
- Manual check by user (per project rule: no browser subagent/screenshot tools).
