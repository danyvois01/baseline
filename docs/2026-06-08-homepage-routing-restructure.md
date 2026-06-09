# Homepage & Routing Restructure

## Goal
Promote Live Rankings from root (`/`) to `/live`, making it equal to `/official` and `/race`. 
Create a new landing homepage at `/` with introductory content sections. Add a "Home" nav link.

## Proposed Changes

### 1. Routing
| Route | Before | After |
|-------|--------|-------|
| `/` | Live Rankings | **New Homepage** |
| `/live` | *(N/A)* | **Live Rankings (moved)** |
| `/official` | Official Rankings | *(unchanged)* |
| `/race` | Race to Turin | *(unchanged)* |

### 2. Navigation Bar (`top-nav-bar.tsx`)
- Add `Home` nav item (href `/`) before the rankings tabs
- Change Live Ranking href from `/` → `/live`
- Logo click still goes to `/`

### 3. New Homepage (`src/app/page.tsx`)
Sections: Hero banner, Play, Solder, To Baseline Tennis, Random.
Consistent with Baseline design system (Montserrat headlines, pill shapes, surface-gray bg).

### 4. Live Rankings → `/live`
Move current `page.tsx` content to `src/app/live/page.tsx` with proper metadata.

## Files
- `src/app/page.tsx` — Overwrite with new homepage
- `src/app/live/page.tsx` — **[NEW]** moved from root
- `src/components/layout/top-nav-bar.tsx` — Update NAV_ITEMS
