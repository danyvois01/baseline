# Homepage Hero Redesign — Animated Tennis Court

**Date:** 2026-06-22

## Scope

Redesign the homepage hero section (`hero-section.tsx`) with:

1. **Two-column layout**: Text content (left 55%) + Animated tennis court SVG (right 45%) on desktop
2. **SVG tennis court** with draw-on line animation (pathLength) using Framer Motion
3. **Animated tennis ball** moving along the court with glow effect
4. **Floating particles** (baseline-lime) for depth
5. **Enhanced ambient glow blobs**
6. **Staggered text animations** (badge → title → description → CTA)
7. Mobile fallback: court hidden, text centered

## Technical Details

- All animations use Framer Motion (`motion.path`, `motion.circle`, `motion.div`)
- Court lines use `pathLength` animation with staggered delays
- Tennis ball follows keyframe positions with glow SVG filter
- Particles use fixed positions (no Math.random) to avoid SSR hydration mismatch
- No new dependencies required

## Approved

User selected Proposal A on 2026-06-22.
