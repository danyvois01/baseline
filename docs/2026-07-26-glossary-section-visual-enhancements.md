# Glossary Section — Visual Enhancements

**Date:** 2026-07-26
**Status:** Approved (card counter, corner court-lines detail, category badge)
**Scope:** `src/components/homepage/glossary-section.tsx`, `src/lib/i18n/it.ts`, `src/lib/i18n/en.ts`

## Problem

The navy glossary cards are plain text-on-navy (term + definition) with no texture,
no orientation (how many cards? where am I?), and no thematic context per term.

## What Will Be Implemented

### 1. Card position counter ("3 / 15")
- Small "current / total" indicator under the card stack (or inside the top card's
  bottom edge), `font-heading`, white/40 with the current number in lime.
- Driven by existing `activeIndex` — no new state.

### 2. Court-lines corner detail on cards
- A small SVG in the top-right corner of each card: 2–3 straight lines meeting at a
  right angle (corner of a tennis court seen from above), stroke white or lime at
  ~6–8% opacity. Echoes the Hero court + service boxes language.
- Pure decoration: `aria-hidden`, `pointer-events-none`. Same markup on every card.

### 3. Category badge per term
- Categories (id in component metadata, index-matched to the i18n `terms` array —
  same pattern as Timeline's `EVENT_META`):

| Category id | IT label | EN label | Terms |
|-------------|----------|----------|-------|
| `serve` | Servizio | Serve | ACE, LET, DOUBLE FAULT |
| `shots` | Colpi | Shots | DROP SHOT, LOB, PASSANTE, TOP SPIN, VOLLEY, SMASH, SLICE |
| `play` | Gioco | Play | BREAK, WINNER, UNFORCED ERROR, SERVE & VOLLEY |
| `court` | Campo | Court | BASELINE |

- Badge: small pill at the top of the card, `bg-white/10 text-white/70` with lime dot,
  uppercase tracking-widest — consistent with the site's pill language.
- i18n: add `glossary.categories` object (4 labels) to both dictionaries. Term
  entries themselves are NOT touched (order must stay stable since categories are
  index-matched).

## What Will NOT Change

- Card stack mechanics, swipe/drag, marquee ticker, arrows, copy of terms.
- No new dependencies.

## Files Touched

| File | Change |
|------|--------|
| `src/components/homepage/glossary-section.tsx` | Counter, corner SVG, category badge + metadata |
| `src/lib/i18n/it.ts` | `glossary.categories` labels |
| `src/lib/i18n/en.ts` | `glossary.categories` labels |

## Design Rationale (from ui-ux-pro-max)

- Orientation/progress visibility (interaction feedback rule): the counter tells
  users where they are in the deck.
- Texture through brand motifs, not noise: the corner lines repeat the court
  language from the Hero rather than introducing new decoration.
- Categories add a second reading layer (information scent) at minimal cost.

## Verification

- `npx tsc --noEmit` (full build/lint blocked by Node 16 on this machine).
- Manual check by user.
