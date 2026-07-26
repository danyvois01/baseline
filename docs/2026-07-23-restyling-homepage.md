# 2026-07-23 — Homepage Visual Restyling

## Goal

Refine the homepage ("Baseline: Partiamo dalle Basi") toward the premium
aesthetic defined in the project brief. Interventions were agreed section by
section with the user. Scope is strictly visual/interaction polish of the
homepage: `src/app/page.tsx` and `src/components/homepage/*`. No data logic,
routing, or ranking pages are touched.

Three cross-cutting issues are also addressed:

1. **Bug — card/circle overlap** in the Ranking section on certain viewports
   (e.g. 14" screens): cards are absolutely positioned with container
   percentages while the circle has a fixed 500px size, so the two collide
   depending on the viewport aspect ratio.
2. **Inconsistent scroll pacing**: only the Ranking section pins the viewport
   ("scroll-trattenuto" effect); the user wants that feel extended to Timeline
   and Glossary, and better tuned in Scoring.
3. **Inconsistent "next section" affordance**: a scroll cue button exists only
   on Hero and Pyramid intro; it should exist on every section.

## Changes by section

### 1. Hero (`hero-section.tsx`)

Kept as-is except the title treatment:

- "La Linea Di Fondo" loses the navy→olive gradient (`bg-clip-text` +
  `bg-gradient-to-r from-deep-navy to-primary-olive`), which reads muddy.
- New treatment: solid `text-deep-navy`, with a hand-drawn-style lime
  underline (SVG stroke, `baseline-lime`) under the word "Fondo" as the
  graphic accent. The underline draws itself on entrance (pathLength
  animation), consistent with the court-line animation on the right.

### 2. Il Ranking (`ranking-section.tsx`) — layout rebuild + card polish

**Layout rebuild (fixes the overlap bug).** The desktop sticky frame moves
from absolute-positioned cards to a true 3-column grid:

- Column 1: two stacked cards ("19", "Zero"), right-aligned text.
- Column 2: the animated SVG circle with the central "ATP / Il Ranking" text.
- Column 3: two stacked cards ("52", "Scadenza"), left-aligned text.

Overlap becomes structurally impossible at any viewport. The section keeps
its `300vh` pinned scrollytelling: circle draw progress and per-card
fade/float reveals stay bound to `scrollYProgress` ranges as today.

Targeted refactor while rebuilding: extract the highlight card into its own
component so the `useTransform` hooks are no longer called inside a `.map()`
callback (removes the two `eslint-disable react-hooks/rules-of-hooks`).

**Card polish.** Cards go from `bg-white/60` (too transparent, weak
legibility) to `bg-white/85`, keep `backdrop-blur-xl`, get a slightly more
defined border and stronger ambient shadow, and a firmer lime accent on the
icon chip.

Mobile layout (vertical reel) is unchanged.

### 3. La Piramide dei Tornei (`pyramid-section.tsx`) — unified brand palette

Remove the rainbow palette (amber/violet/blue/emerald/gray/stone). New
scheme, brand-only:

- Pyramid tiers use a tonal navy scale: lightest at the base
  (Challenger/ITF) up to full `deep-navy` at the top (Grand Slam).
- The floating ATP Finals crown uses `baseline-lime` (fill) with navy icon.
- The **active** tier is highlighted in `baseline-lime` (navy text/icon),
  passed tiers keep their navy tone, future tiers stay neutral gray.
- Text cards on the right adapt: icon chip and tagline/points accents use
  navy/lime instead of the per-tier rainbow color.

Structure, sticky behavior, and copy unchanged.

### 4. Un anno di Tennis (`timeline-section.tsx`) — refined cards + scroll pin

**Refined cards.** Surface colors remain (they carry meaning) but move to a
more restrained treatment: neutral subtle border (`border-border-subtle`)
plus a colored side bar (4px, rounded, surface color) on the card's inner
edge, instead of the full colored border. Period badge and highlight text
keep the surface color.

**Scroll pin (desktop).** The section becomes pinned scrollytelling, same
pattern as Ranking:

- Section height ~`400vh`; inside, a sticky `h-screen` frame containing the
  header, the sticky legend, and the central vertical line.
- The line fills with `baseline-lime` as section progress advances; the 6
  event cards fade/slide in one at a time (alternating left/right of the
  line) as progress crosses their range. Cards remain visible once revealed
  (building the year), the frame releases after the last event.

**Mobile:** keeps the current free-scrolling vertical layout (no pinning on
touch), with the refined card treatment applied.

### 5. Il Punteggio (`scoring-section.tsx`) — color unification, header, transition, pacing

- **Yellow unification:** all `yellow-400` badge states become
  `baseline-lime` (with the existing lime glow shadows); no second yellow in
  the section.
- **Section header:** add an intro header inside the dark section, styled
  like the other sections ("Il Punteggio" + one-line subtitle), so the
  section no longer starts abruptly with the first chapter.
- **Soft transition to dark:** a curved/gradient seam at the top of the navy
  section (white→navy) instead of the hard edge.
- **Pacing tune:** chapter blocks grow from `min-h-[50vh]` to ~`70vh` and
  `useInView` margins are adjusted so each chapter "rests" longer while the
  sticky scoreboard is in view — matching the held-scroll feel of Ranking.

### 6. Parla come un Pro (`glossary-section.tsx`) — marquee, arrows, scroll pin

- **Marquee refinement:** inactive terms move from `text-deep-navy/30` to
  `/50` for legibility; the gray dot separators are removed; the active pill
  uses the `baseline-lime` token instead of hard-coded `#DFFF00`.
- **Twin arrows:** the prev/next buttons (today one white, one navy) become
  identical pill-outline buttons (white bg, subtle border, navy icon, lime
  hover), mirrored.
- **Scroll pin (desktop):** section becomes ~`250vh` with a sticky frame;
  scroll progress drives the active card index through the deck
  deterministically. Arrow clicks and marquee jumps scroll the page
  programmatically to the progress point of the target card, so manual and
  scroll navigation never fight.
- **Mobile:** no pinning; current swipe deck stays.

### 7. Final CTA banner (`page.tsx`)

- **Brand glow:** background halos change from blue (`bg-blue-500/5`,
  `bg-blue-400/5`) to a subtle lime halo + a lighter navy halo.
- **Tennis court motif:** the generic decorative ring is replaced by thin
  tennis-court lines (SVG, `baseline-lime` at ~10% opacity) echoing the hero
  court.
- **Legible paragraph:** `text-surface-gray` (near-invisible on navy)
  becomes `text-white/70`.
- **Consistent CTA hover:** the lime button no longer turns white on hover;
  it stays lime with a stronger glow and a slight lift (`-translate-y`).

### 8. Cross-section: scroll cue on every section

New shared component `src/components/homepage/scroll-cue.tsx`: small
label + animated chevron button (same style as the hero's "Scopri"),
scrolling smoothly to the next section. Placed at the bottom of every
section — Hero → Ranking → Pyramid → Timeline → Scoring → Glossary → CTA.
On the dark Scoring section it renders in a light variant (`text-white/60`).
The existing hero and pyramid cues are replaced by this component.

## Cross-cutting notes

- Wherever a touched file hard-codes `#DFFF00`, replace it with the
  `baseline-lime` token (identical visual result, consistent code).
- All copy stays in Italian; all code/comments in English.
- Section ids and the floating `SectionNavigator` are unchanged.
- Framer Motion patterns already in the codebase (`useScroll`,
  `useTransform`, `useInView`, sticky frames) are reused; no new
  dependencies.

## Out of scope

Dark mode wiring, ranking pages, custom cursor, nav bar, footer, scraper,
and mobile-specific redesigns beyond what is listed above.
