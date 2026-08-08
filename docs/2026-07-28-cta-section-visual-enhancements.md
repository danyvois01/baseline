# CTA Section — Visual Enhancements

**Date:** 2026-07-28
**Status:** Proposed — awaiting approval
**Scope:** `src/app/page.tsx` → new `src/components/homepage/cta-section.tsx`

## Problem

The CTA is the only homepage section never touched in this review pass, and it is
the weakest link in the page. Concretely:

1. **No visual weight as a finale.** It is a bare centered text block on
   `bg-surface-white`, immediately after the Glossary, which is also
   `bg-surface-white`. There is no container, no background change, no boundary —
   the page just stops. Every other section now has a strong focal object (the
   Ranking ring, the pyramid, the timeline line, the scoreboard, the navy card
   deck). The CTA has none.
2. **Zero navy.** Same complaint the user raised about the Timeline: the closing
   moment of a navy + lime brand is rendered entirely in white and grey.
3. **The button is not the focal point.** `bg-baseline-lime` on
   `bg-surface-white` is a low-contrast pairing (lime is a light colour — roughly
   1.2:1 against white). The one element that must dominate visually is the one
   that blends in most.
4. **An orphaned string.** `home.cta.badge` ("Entra nel Tour" / "Join the Tour")
   exists in both dictionaries but is never rendered.
5. **No entrance animation.** Every other section reveals on scroll; this one
   pops in fully formed.

## What Will Be Implemented

### 1. Navy closing panel (the main change)

Wrap the CTA in a full `bg-deep-navy` rounded panel (`rounded-[40px]`,
`max-w-5xl`, generous `py-16 md:py-24`) instead of leaving the content loose on
white.

Why this and not a gradient or an animated background: it is the same move the
Glossary card already makes. Navy reads well on this site when it is **an object
with a role** — the court, the scoreboard, the glossary deck — never as an
isolated decorative detail. Here the role is obvious: the closing card that ends
the page. It also solves problems 1, 2 and 3 at once, because lime on navy is
about **14:1**, so the button becomes the single brightest thing on screen with
no extra effort.

Text inside inverts to `text-white` / `text-white/70`, exactly as in the
Glossary card.

### 2. Badge pill above the title

Render the existing `t.home.cta.badge` as a pill: `bg-white/10`,
`text-white/70`, uppercase `tracking-widest`, with a `bg-baseline-lime` dot —
byte-for-byte the same component language as the Glossary category badge. No new
i18n keys; this just uses a string that is already translated.

### 3. Lime glow behind the button

A single soft radial `bg-baseline-lime/20` blur behind the button, `aria-hidden`
+ `pointer-events-none`. Same device as the glow behind the Ranking progress
ring. **One** element, centred on the focal point — not scattered particles.

### 4. Scroll reveal + reduced motion

One-shot `whileInView` reveal on the panel (`opacity 0→1`, `y 16→0`, 400ms,
`easeOut`, `once: true`), matching the skill's "Subtle Scroll Reveal" tier and
the pattern already used by `ChapterCard` in the Scoring section. The existing
button hover (glow + `-translate-y-1` + icon rotate) is kept as-is — it already
sits in the skill's 150–300ms micro-interaction window.

No infinite pulse on the button: the skill's animation rules rule out infinite
decorative loops, and the user has already rejected that kind of ambient motion
in the Hero.

### 5. Extract to its own component

Move the markup out of `page.tsx` into
`src/components/homepage/cta-section.tsx`, alongside the other six section
components. `page.tsx` then renders `<CtaSection />` and drops its now-unused
`Link` and `Zap` imports. Purely structural — matches the documented project
layout.

## Explicitly Rejected

Ideas from the earlier review pass that I am **not** proposing, and why:

| Idea | Why not |
|------|---------|
| Animated background elements behind the button | This is the "scattered decoration" the user rejected in the Hero. The navy panel gives the section presence without it. |
| Idle glow/pulse loop on the button | Infinite decorative loop; against the skill's motion rules and prior user feedback. |
| Social-proof stat above the CTA ("500+ players tracked") | Would need a real, defensible number. Inventing one is not acceptable on a site whose value proposition is data accuracy. |
| Gradient background | Flat colour wash — exactly the failure mode from the Hero round. |

## What Will NOT Change

- Copy, i18n values, the `/live` destination, `id="cta"` (the Glossary
  `ScrollCue` targets it), the button's hover behaviour.
- The `sections` array feeding the floating navigator — the CTA is intentionally
  not a chapter.
- No new dependencies.

## Files Touched

| File | Change |
|------|--------|
| `src/components/homepage/cta-section.tsx` | New — navy panel, badge, glow, reveal |
| `src/app/page.tsx` | Render `<CtaSection />`; remove inline markup + unused imports |

## Design Rationale (from ui-ux-pro-max)

- Pattern "Hero + Features + CTA" → *"Deep CTA placement. Use contrasting
  colour (at least 7:1 contrast ratio)."* Lime on navy clears this at ~14:1;
  lime on white fails it outright. This is the single strongest argument for the
  panel.
- Style "Hero-Centric Design" → high-contrast CTA, scroll reveal, subtle CTA
  glow — all three adopted, in their restrained form.
- Motion "Scroll Reveal / Subtle" → 300–400ms, `y` offset 8–16px so it reads as
  a fade rather than a slide. Adopted at 400ms / 16px.
- Pre-delivery checklist → contrast ≥ 4.5:1, visible focus state,
  `prefers-reduced-motion` respected, Lucide icons (already `Zap`), hover
  transitions in 150–300ms.

## Verification

- `npx tsc --noEmit` (full `next build` / `next lint` remain blocked on this
  machine: Node 16.20.2 active, Next requires ≥ 20.9.0).
- Manual check by user in light and dark mode.
