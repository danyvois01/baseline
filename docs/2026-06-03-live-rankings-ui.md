# Live ATP Rankings — UI Implementation

## Overview

Implement the **Live ATP Rankings** view for the Baseline platform, following the Baseline Design System. This is the first fully functional page of the site. The focus is entirely on **design, layout, and visual fidelity** — all player data will be placeholder/mock data.

The reference screenshot shows the exact target layout:
- TopNavBar with "Baseline" text, nav links (Live Ranking active), search, Sign In
- "LIVE UPDATES ACTIVE" indicator with green dot
- "Live ATP Rankings" title + subtitle
- Filter button + "Updated: Just now" badge
- Data table with columns: #, PLAYER, AGE, LIVE STATUS, POINTS, +/-, MAX
- Load More Players link

## Design System Tokens

Based on DESIGN.md:

### Colors
| Token | Value | Usage |
|-------|-------|-------|
| `--baseline-lime` | `#DFFF00` | Primary CTA, active nav, accents |
| `--deep-navy` | `#0A0E14` | Primary text, headers, brand |
| `--surface-white` | `#FFFFFF` | Page background |
| `--surface-gray` | `#F1F3F5` | Section containers |
| `--surface-hover` | `#F8F9FA` | Table row hover, table header bg |
| `--border-subtle` | `#E9ECEF` | Table borders, inputs |
| `--success-green` | `#22C55E` | Rank up, "Active" live status |
| `--error-red` | `#EF4444` | Rank down |
| `--text-muted` | `#6B7280` | Secondary text, column headers |

### Typography
- **Montserrat**: Headings (Display 48px/700, Headline LG 32px/700, Headline MD 24px/600)
- **Inter**: Body and data (Body LG 18px/400, Body SM 14px/400, Label LG 14px/600, Label MD 12px/500)

### Shapes
- Pill elements: `border-radius: 9999px` — buttons, search, badges, active nav
- Table container: `border-radius: 3rem`
- Table rows: rounded corners on far left/right edges

### Elevation
- Ambient shadow: `0px 4px 20px rgba(0, 0, 0, 0.04)` — floating cards
- Borders: `1px solid #E9ECEF`

---

## Component Architecture

### 1. TopNavBar
```
[Baseline] [Official Ranking] [Live Ranking*] [Race to Turin]    [🔍 Search players...] [Sign In]
```
- "Baseline" as bold text logo (olive/dark green)
- "Live Ranking" has pill-shaped Baseline Lime background (active state)
- Others: transparent bg, deep navy text
- Pill-shaped search input, pill-shaped "Sign In" button

### 2. Live Status Indicator
- Green dot + "LIVE UPDATES ACTIVE" in uppercase, olive/green text
- Positioned above the title

### 3. Page Header
- "Live ATP Rankings" — headline-lg Montserrat 32px bold
- "Real-time point projections based on ongoing tournament results." — body-lg Inter
- Filter pill button + "Updated: Just now" pill badge (right-aligned)

### 4. Rankings Table (Live)
Columns: #, PLAYER, AGE, LIVE STATUS, POINTS, +/-, MAX

- **#**: Bold large rank number
- **PLAYER**: Avatar circle (initials) + Name (bold) + Nationality pill badge (e.g. "SRB")
- **AGE**: Body text
- **LIVE STATUS**: "● Out - Indian Wells R32" or "● Active - Indian Wells SF" with round stage badge
- **POINTS**: Bold large number
- **+/-**: MR badge (gray pill), NMR badge (gray pill), or green/red movement pill (▲1, ▼1)
- **MAX**: Career-high points number

### 5. Load More
- "Load More Players" centered text link

### 6. Footer
- Minimalist: Terms, Privacy, Support, About + copyright

---

## Files to Create / Modify

### New Files
| File | Description |
|------|-------------|
| `src/components/layout/top-nav-bar.tsx` | Top navigation bar |
| `src/components/layout/footer.tsx` | Footer component |
| `src/components/rankings/rankings-table.tsx` | Live rankings data table |
| `src/components/rankings/player-avatar.tsx` | Player avatar circle |
| `src/components/rankings/movement-badge.tsx` | Rank movement pill badge |
| `src/components/rankings/live-status-cell.tsx` | Live status cell component |
| `src/lib/mock-data.ts` | Placeholder live rankings data |

### Modified Files
| File | Changes |
|------|---------|
| `src/app/globals.css` | Baseline Design System tokens |
| `src/app/layout.tsx` | Montserrat + Inter fonts, metadata, layout shell |
| `src/app/page.tsx` | Complete rewrite — Live Rankings page |
| `src/components/layout/index.ts` | Export TopNavBar, Footer |
| `src/components/rankings/index.ts` | Export table components |

---

## Verification Plan
- `npm run build` — no errors
- Visual inspection via `npm run dev` matching the reference screenshot
