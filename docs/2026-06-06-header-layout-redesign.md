# Header & Page Hero Layout Redesign

## Problem Statement

The current layout has three issues:

1. **Logo**: The current `logo.png` needs to be replaced with the new `logo_new.png`, displayed larger than the current 36px height.
2. **Navigation Tabs**: The three tabs (Official Ranking / Live Ranking / Race to Turin) sit directly next to the logo on the left side. They should be **centered** in the page (matching the second mockup).
3. **Excessive Whitespace**: The hero area between the nav bar and the table has too much vertical whitespace. The current layout stacks elements vertically:
   - Live indicator badge
   - Title (`Live ATP Rankings`)
   - Subtitle (`Real-time point projections...`)
   - *gap*
   - Filter + Updated badge (right-aligned)
   - *gap*
   - Table

   This creates a tall, sparse hero section that pushes content down unnecessarily.

---

## Proposed Changes

### Change 1: New Logo — Larger & Prominent

**File:** `public/logo_new.png` (copy from root) + `top-nav-bar.tsx`

- Copy `logo_new.png` to `public/` folder.
- Replace the `<Image src="/logo.png" ...>` with `src="/logo_new.png"`.
- Increase height from `36px` → **48px** (a ~33% increase, making it prominently large while fitting the 80px header).
- Increase the nav bar height from `h-16` (64px) to `h-20` (80px) to give the larger logo breathing room — matching the stitch mockup which uses `h-20`.

### Change 2: Centered Navigation Tabs

**File:** `top-nav-bar.tsx`

Current layout is a single flex row: `[Logo + Nav] .............. [Search + SignIn]`

Proposed layout uses a **3-column** approach:

```
[Logo]          [Official | Live | Race]          [Search + SignIn]
 ↑ left           ↑ absolute center                ↑ right
```

Implementation: Use `flex justify-between` with three children:
1. **Left**: Logo only (shrink-0).
2. **Center**: `<nav>` positioned with `absolute left-1/2 -translate-x-1/2` for true centering regardless of left/right column widths.
3. **Right**: Search + Sign In.

This precisely matches the mockup's visual center alignment.

### Change 3: Compact Page Hero — Two Layout Options

This is the key design decision. Below are two proposals:

---

#### **Option A — Inline Header with Controls** ⭐ (Recommended)

Merge the title/subtitle row with the filter/updated controls into a **single horizontal band**:

```
┌───────────────────────────────────────────────────────────────┐
│ ● LIVE UPDATES ACTIVE                                        │
│ Live ATP Rankings                         ⚙ Filter  Updated  │
│ Real-time point projections...                                │
└───────────────────────────────────────────────────────────────┘
│ # │ PLAYER │ LIVE STATUS │ POINTS │ +/- │                    │
```

**How it works:**
- A `flex` container with `justify-between` and `items-end`
- Left column: Live indicator + Title + Subtitle (stacked)
- Right column: Filter button + Updated badge (aligned to the bottom of the title, i.e. baseline of the h1)
- Reduce `mb-8` on subtitle → `mb-4`, and remove the separate controls row `mb-6`
- Net vertical savings: ~60–80px of whitespace eliminated

**Pros:**
- ✅ Eliminates the "dead zone" of whitespace
- ✅ Controls are visually connected to the content they govern
- ✅ Matches standard data-dashboard patterns (Notion, Linear, etc.)
- ✅ On mobile, naturally stacks vertically (no loss of usability)

---

#### **Option B — Floating Toolbar in Table Header**

Move the Filter + Updated badges **into** the table's header row, making them part of the table chrome:

```
┌───────────────────────────────────────────────────────────────┐
│ ● LIVE UPDATES ACTIVE                                        │
│ Live ATP Rankings                                             │
│ Real-time point projections...                                │
├───────────────────────────────────────────────────────────────┤
│ # │ PLAYER │ LIVE STATUS │ POINTS │ +/- │ ⚙ Filter │ Updated │
```

**Pros:**
- ✅ Eliminates whitespace entirely
- ✅ Controls live right where the data is

**Cons:**
- ❌ Table header gets cluttered with non-column-related controls
- ❌ Breaks the consistent `<thead>` pattern across Official/Live/Race
- ❌ Harder to maintain with TanStack Table structure

---

## Recommendation

**Option A** is the recommended approach. It:
- Solves the whitespace problem cleanly
- Keeps controls contextually relevant (same band as the title)
- Maintains table component consistency across all 3 pages
- Is the cleanest to implement (just a layout change in `page.tsx`)
- Works perfectly for the Race to Turin page too (where summary cards replace the controls)

---

## Summary of Files to Modify

| File | Change |
|------|--------|
| `public/logo_new.png` | **[NEW]** Copy from project root |
| `src/components/layout/top-nav-bar.tsx` | New logo, larger size, centered nav tabs, taller header |
| `src/app/page.tsx` | Inline hero layout (Option A) |
| `src/app/race/page.tsx` | Same compact hero pattern for consistency |

---

## Verification Plan

1. Visual comparison of the live page against the mockup screenshots.
2. Test responsive behavior at mobile/tablet breakpoints.
3. Verify dark mode compatibility (if applicable).
4. Check that the logo renders crisply at the new size.
