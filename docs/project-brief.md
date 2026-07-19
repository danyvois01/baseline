# Project Brief: Baseline ATP Rankings

## 1. Project Overview
**Baseline** is a modern, high-fidelity web platform designed for tennis enthusiasts to track ATP rankings in real-time and understand the complex structure of the ATP Tour. The platform prioritizes data clarity, visual hierarchy, and a premium aesthetic inspired by contemporary UI trends, particularly focusing on immersive **Scrollytelling** experiences.

## 2. Design Vision & Identity (Baseline Design System)
* **Visual Style:** Minimalist-Athletic combined with **Glassmorphism**. Uses expansive white space, high-contrast typography, and fluid scroll-linked animations to make complex data engaging.
* **Core Aesthetic:** Pill-shaped UI elements, floating frosted glass cards (`bg-white/90 backdrop-blur-xl`), and dynamic scroll-triggered states.
* **Color Palette:** 
  * **Primary/Accent:** Baseline Lime / "Tennis Green" (`#DFFF00`). Used for active states, key highlights, and primary CTAs.
  * **Secondary/Text:** Deep Navy (`#0A0E14`). Used for primary text and bold headers.
  * **Backgrounds:** Clean white (`#FFFFFF` or `surface-white`) with soft neutral gray (`#F8F9FA` or `surface-gray`) for section containment and inactive states.
  * **Semantic:** Success green (`#22C55E`) for upward climbs, crisp red (`#EF4444`) for drops. Specific surface colors for tournaments: Blue (Hard), Orange (Clay), Green (Grass), Purple (Indoor).
* **Typography:** 
  * **Headlines:** Montserrat (Sans-serif) for a bold, geometric, athletic feel. (`font-heading`, `font-extrabold`).
  * **Body & Data Tables:** Inter, for exceptional legibility at small sizes.
* **Shapes:** Extensive use of Level 3 Pill-shaped curves (`rounded-full`, `rounded-2xl`, `rounded-3xl`).
* **Layout:** Generous spacing, large paddings (`py-24`, `py-32`), avoiding compressed elements.
* **Elevation/Shadows:** Tonal layers with soft ambient shadows (`shadow-ambient`: `0px 4px 20px rgba(0, 0, 0, 0.04)`) for floating cards and prominent elements. Borders are subtle 1px `#E9ECEF`.

## 3. Homepage Architecture (The Scrollytelling Experience)
The homepage serves as an interactive guide to the ATP Tour, heavily utilizing `framer-motion` for scroll-linked animations.

### A. Hero Section
* **Features:** Massive typography with an SVG tennis court that rotates in 3D (`rotateX`, `rotateZ`) as the user scrolls down, creating an immersive depth effect.

### B. Le Regole del Ranking (Ranking Rules)
* **Features:** A large central SVG circle that draws itself (stroke dashoffset) based on scroll progress (completes at 70% scroll).
* **Elements:** 4 floating Glassmorphism cards containing crucial ranking concepts (19 best results, 52 weeks, no reset, points drop). The cards fade in and float upwards at specific scroll ranges.

### C. La Discesa (Tournament Hierarchy / Pyramid)
* **Concept:** A split-screen sticky layout explaining tournament tiers.
* **Left (Sticky):** A graphical pyramid. The **Grand Slams** form the apex of the stacked structure, while the **ATP Finals** float independently above it as a distinct "Crown". As the user scrolls, passed tiers remain subtly colored and active, building the pyramid from the top down.
* **Right (Scrolling):** Text blocks describing each tier. When a text block reaches the center of the viewport, its corresponding graphical tier on the left fully illuminates and enlarges.

### D. Un anno di Tennis (Timeline)
* **Concept:** A vertical chronological timeline of the tennis season.
* **Design:** A straight vertical central line that fills with "Baseline Lime" as the user scrolls. 
* **Cards:** Tournament periods slide in alternating from left to right (zigzag pattern). Each card has plenty of vertical breathing room.
* **Legend:** A sticky, compact legend at the top of the section displaying the color codes for the different court surfaces (Hard, Clay, Grass, Indoor).

## 4. Ranking Data Architecture

### A. Official ATP Rankings
* **Purpose:** Display the verified weekly standings from the ATP Tour.
* **Key Data:** Rank, Player (with avatar and nationality), Age, Total Points, and Weekly Movement (+/-).

### B. Live ATP Rankings
* **Purpose:** Real-time point projections based on ongoing tournament results.
* **Key Design Innovations:**
  * **Unified Player Info:** Nationality (flag/code) integrated directly with the player name to reduce eye travel.
  * **Live Status Column:** Consolidates "Current Tournament" and "Previous Tournament" into a single status indicator.
  * **Emphasis:** High-weight typography for Rank and Points to ensure they remain the primary focal points.

### C. Race to Turin
* **Purpose:** Track progress toward the year-end ATP Finals.
* **Features:** Qualifying Cut-off projections, Status indicators for "Qualified" vs. "In Contention."

## 5. Technical Requirements
* **Framework:** Next.js 16+ (App Router).
* **Styling:** Tailwind CSS v4.
* **Animations:** Framer Motion (`useScroll`, `useTransform`, `useInView`).
* **Icons:** Lucide React.
* **Responsiveness:** Desktop-first logic for Scrollytelling (using sticky/alternating layouts), degrading gracefully to vertical stacked layouts on mobile.

## 6. Future Considerations
* Full Dark Mode support (must ensure high contrast with the Baseline Lime).
* Live data API integration.
* Player-specific detail pages with performance analytics.
