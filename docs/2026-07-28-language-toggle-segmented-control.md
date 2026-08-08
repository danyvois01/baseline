# Language Toggle — Segmented Control

**Status:** implemented (2026-07-28)
**Scope:** `src/components/layout/settings-pill.tsx`, `src/lib/i18n/{it,en}.ts`

## Problem Statement

The language segment currently renders the **target** language: while the site
is in Italian the badge reads `EN`. A single code with no context is ambiguous
by construction — it can be read two ways:

- "the current language is English" (false, and contradicts the visible UI)
- "click to switch to English" (the actual intent)

The `aria-label` is unambiguous (`"Switch to English"`), so screen-reader users
are served correctly. The ambiguity is purely visual, and it costs every new
visitor one moment of doubt.

A second, smaller issue: the segment is a state display *and* the only affordance
to change that state, but nothing about it signals "toggle" — no icon, no
segmented affordance, no active/inactive contrast. It reads as a label.

## Proposed Change

Turn the language segment into a real **segmented control** showing both locales,
with the active one visually dominant:

```
┌─────────┬─────────────┐
│   ☾     │  [IT]  EN   │      IT active (bold, foreground)
└─────────┴─────────────┘      EN inactive (muted)
```

Clicking the inactive code switches to it. The active code is not a click
target (already active), which removes the "what does clicking this do?"
question entirely: you click the language you want, you never click to
discover what happens.

This reuses the segmented structure the pill already has, so it introduces no
new visual pattern into the header.

### Why this over the alternatives

| Option | Verdict |
|---|---|
| Both locales, active highlighted | **Chosen.** Removes ambiguity, no new pattern, self-evident. |
| Globe icon + target code | Signals "toggle" but keeps the state ambiguity. |
| Show current language only | Unambiguous as a label, but loses the affordance. |

## Implementation Plan

### 1. `settings-pill.tsx`

Replace the single `toggleLocale` button with two buttons, one per locale,
driven by the existing `dictionaries` keys (no hardcoded list):

- Active locale: `text-foreground`, `font-semibold`, `aria-current="true"`.
  **Not** `disabled` and not a `span`: either would drop it out of the tab
  order, so keyboard and screen-reader users could no longer perceive which
  locale is active. It stays a focusable button whose click is a no-op
  (`setLocale` to the current locale); `cursor-default` signals that visually.
- Inactive locale: `text-foreground/50`, `hover:text-foreground`, calls
  `setLocale(loc)`.
- Keep the existing `h-8 md:h-10` responsive sizing so the pill stays aligned
  with the CTA at every breakpoint.
- Keep `rounded-r-full` on the outer edge.

Because both codes are always rendered, the segment width is naturally stable
across locales — `StableLabel` is no longer needed here (it exists to prevent
layout shift, which this layout avoids structurally).

### 2. Locale provider

`src/providers/locale-provider.tsx` currently exposes only
`{ locale, t, toggleLocale }`; `setLocale` exists as internal `useState`
but is not published on the context.

Change: add `setLocale` to `LocaleContextValue` and to the provider value.

`toggleLocale` can be **removed** rather than kept: `settings-pill.tsx` is its
only consumer in the whole codebase (verified by grep), and this change
replaces that call site. Keeping it would leave dead API surface.

### 3. i18n strings

- `settings.targetLanguage` (`"EN"` / `"IT"`) becomes unused → **remove** it
  from both dictionaries. Locale codes come from the `dictionaries` keys,
  uppercased, so they are no longer duplicated as translated strings.
- `settings.switchLanguage` is still needed for the per-code `aria-label`,
  but it must become locale-specific rather than a single string, e.g.
  `settings.switchToLocale.it` / `.en`, so each button gets an accurate label
  in the *current* language.

### 4. Accessibility

- Wrap the two codes in `role="group"` with an `aria-label` ("Language" /
  "Lingua") so the pair is announced as one control.
- `aria-current="true"` on the active code.
- Add `focus-visible:` rings to both codes. Note the wider project gap: no
  header control currently has a visible focus state. This doc fixes it only
  for the elements it touches; the header-wide pass is tracked separately.

## Verification Plan

1. `npx tsc --noEmit` — type check.
2. Confirm the removed `targetLanguage` key has no remaining references
   (`grep -rn "targetLanguage" src/`).
3. Confirm `switchLanguage` call sites are all updated.
4. Manual check by the user (project rule 8 — no automated screenshots):
   - both codes visible, active one clearly dominant, light and dark mode;
   - clicking the inactive code switches language;
   - pill height matches the CTA at mobile and desktop widths;
   - keyboard tab reaches both codes and shows a focus ring.

> **Build caveat:** `next build` cannot run in this environment — Next.js 16
> requires Node >= 20.9 and the sandbox is pinned to Node 16 (Node 20 is not
> installable: the system glibc is older than the prebuilt binaries need).
> Type checking via `tsc` works. Full build verification must happen on the
> user's machine.

## Out of Scope

Tracked from the earlier header review, not addressed here:

- Homepage has no mobile navigation (section links are `hidden lg:flex`,
  the mobile tab bar is gated behind `!isHome`).
- Homepage never marks a nav link active (`isActive` is `!isHome && ...`,
  always false on `/`) — the `layoutId="active-nav-pill"` animation never runs there.
- Duplicate radius tokens: `--radius-2xl`, `--radius-3xl`, `--radius-4xl` are all `3rem`.
- Fixed-header offset is a different magic number per page (`pt-20`, `pt-24`,
  `pt-28`, `pt-32`) — candidate for a single `--header-h`.
- Project-wide missing `focus-visible` states outside `components/ui/`.
