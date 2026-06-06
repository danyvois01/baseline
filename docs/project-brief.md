# Project Brief: Baseline ATP Rankings

## 1. Project Overview
**Baseline** is a modern, high-fidelity web platform designed for tennis enthusiasts to track ATP rankings in real-time. The platform prioritizes data clarity, visual hierarchy, and a premium "pill-shaped" aesthetic inspired by contemporary UI trends.

## 2. Design Vision & Identity (Baseline Design System)
* **Visual Style:** Minimalist-Athletic. Uses expansive white space and high-contrast typography to ensure complex ranking data remains legible.
* **Core Aesthetic:** Pill-shaped UI elements (buttons, badges, containers).
* **Color Palette:** 
  * **Primary/Accent:** Baseline Lime / "Tennis Green" (`#DFFF00`). Used for active states, key highlights, and primary CTAs.
  * **Secondary/Text:** Deep Navy (`#0A0E14`). Used for primary text and headers.
  * **Backgrounds:** Clean white (`#FFFFFF`) with soft neutral gray (`#F8F9FA` or `#F1F3F5`) for section containment.
  * **Semantic:** Success green (`#22C55E`) for upward climbs, crisp red (`#EF4444`) for drops.
* **Typography:** 
  * **Headlines:** Montserrat (Sans-serif) for a bold, geometric, athletic feel.
  * **Body & Data Tables:** Inter, for exceptional legibility at small sizes.
* **Shapes:** Extensive use of Level 3 Pill-shaped curves (`rounded-full` for buttons/badges, `rounded-xl` for containers) to echo the aerodynamic curves of a tennis ball.
* **Layout:** Fixed Grid model (12-column, 1280px max-width container, 24px gutters).
* **Elevation/Shadows:** Tonal layers with a very soft ambient shadow (`0px 4px 20px rgba(0, 0, 0, 0.04)`) only for floating cards. Borders are subtle 1px `#E9ECEF`.

## 3. Information Architecture

The application is structured into three primary views, accessible via a persistent top navigation bar:

### A. Official ATP Rankings
* **Purpose:** Display the verified weekly standings from the ATP Tour.
* **Key Data:** Rank, Player (with avatar and nationality), Age, Total Points, and Weekly Movement (+/-).

### B. Live ATP Rankings (Priority View)
* **Purpose:** Real-time point projections based on ongoing tournament results.
* **Key Design Innovations:**
  * **Unified Player Info:** Nationality (flag/code) integrated directly with the player name to reduce eye travel.
  * **Live Status Column:** Consolidates "Current Tournament" and "Previous Tournament" into a single status indicator (e.g., "Active - Indian Wells SF" or "Out - Indian Wells R32").
  * **Emphasis:** High-weight typography for Rank and Points to ensure they remain the primary focal points.
  * **Badges:** Project-specific badges for "MR" (Career High) and "NMR" (New Career High).

### C. Race to Turin
* **Purpose:** Track progress toward the year-end ATP Finals.
* **Features:**
  * Qualifying Cut-off projections (e.g., "~3500 pts").
  * Status indicators for "Qualified" vs. "In Contention."
  * Progress tracking (e.g., "4 / 8 Qualified Players").

## 4. Component Strategy
* **TopNavBar:** Includes brand logo, primary navigation links (Official, Live, Race), search functionality, and user authentication.
* **Data Tables:** Custom-styled with subtle borders, generous whitespace, pill-shaped badges, and hover states with increased corner radius (`#F8F9FA` background).
* **Footer:** Minimalist design with essential links.

## 5. Technical Requirements
* **Framework:** Next.js 14+ (App Router).
* **Styling:** Tailwind CSS v4.
* **Responsiveness:** Primary target is Desktop, optimized for high-density data visualization. Mobile tables utilize horizontal scrolling.
* **Interactivity:** Smooth hover transitions on interactive elements and "Load More" functionality.

## 6. Future Considerations
* WTA Rankings integration.
* Dark Mode support (tokens already defined).
* Player-specific detail pages with performance analytics.
