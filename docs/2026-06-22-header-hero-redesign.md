# Header & Hero Section Redesign

**Date:** 2026-06-22

## Scope

1. Remove "Sign In" button from the TopNavBar.
2. Move the search bar from the header into the hero section of each rankings page, positioned to the left of Filter and Updated badge.
3. Create a shared `PageHeroSection` component used by Live, Official, and Race to Turin pages.
4. Align the Race to Turin page layout with Live and Official (add search, filter, updated badge).
5. Description text stays on the left under the title for all pages.

## Implementation Details

- **TopNavBar**: Remove search input, `useState`, `Search` icon import, and "Sign In" button. Nav bar becomes Logo + Nav Links only.
- **PageHeroSection**: New client component in `src/components/rankings/`. Accepts `title`, `description`, `updatedAt`, and optional `liveIndicator` props.
- **All three pages** (live, official, race) replace inline hero markup with the shared component.

## Approved

User approved the implementation plan on 2026-06-22.
