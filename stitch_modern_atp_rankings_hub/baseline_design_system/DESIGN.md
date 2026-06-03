---
name: Baseline Design System
colors:
  surface: '#f8f9fa'
  surface-dim: '#d9dadb'
  surface-bright: '#f8f9fa'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f4f5'
  surface-container: '#edeeef'
  surface-container-high: '#e7e8e9'
  surface-container-highest: '#e1e3e4'
  on-surface: '#191c1d'
  on-surface-variant: '#454932'
  inverse-surface: '#2e3132'
  inverse-on-surface: '#f0f1f2'
  outline: '#767960'
  outline-variant: '#c6c9ab'
  surface-tint: '#576500'
  primary: '#576500'
  on-primary: '#ffffff'
  primary-container: '#dfff00'
  on-primary-container: '#647400'
  inverse-primary: '#b8d300'
  secondary: '#5b5e66'
  on-secondary: '#ffffff'
  secondary-container: '#dfe2eb'
  on-secondary-container: '#61646c'
  tertiary: '#006e2f'
  on-tertiary: '#ffffff'
  tertiary-container: '#c3ffc7'
  on-tertiary-container: '#007e37'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d2f000'
  primary-fixed-dim: '#b8d300'
  on-primary-fixed: '#191e00'
  on-primary-fixed-variant: '#414c00'
  secondary-fixed: '#dfe2eb'
  secondary-fixed-dim: '#c3c6cf'
  on-secondary-fixed: '#181c22'
  on-secondary-fixed-variant: '#43474e'
  tertiary-fixed: '#6bff8f'
  tertiary-fixed-dim: '#4ae176'
  on-tertiary-fixed: '#002109'
  on-tertiary-fixed-variant: '#005321'
  background: '#f8f9fa'
  on-background: '#191c1d'
  surface-variant: '#e1e3e4'
typography:
  display-lg:
    fontFamily: Montserrat
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Montserrat
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
  headline-md:
    fontFamily: Montserrat
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-sm:
    fontFamily: Montserrat
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-lg:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
  headline-lg-mobile:
    fontFamily: Montserrat
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
rounded:
  sm: 0.5rem
  DEFAULT: 1rem
  md: 1.5rem
  lg: 2rem
  xl: 3rem
  full: 9999px
spacing:
  base: 4px
  xs: 8px
  sm: 16px
  md: 24px
  lg: 48px
  xl: 80px
  container-max: 1280px
  gutter: 24px
---

## Brand & Style

This design system is built for a premium tennis rankings platform, balancing the high-energy spirit of the sport with a sophisticated, data-driven aesthetic. The personality is athletic, precise, and contemporary.

The visual direction follows a **Minimalist-Athletic** style. It utilizes expansive white space and high-contrast typography to ensure complex ranking data remains legible. The "pill-shaped" motif is central to the identity, appearing in navigation, buttons, and badges to echo the aerodynamic curves of a tennis ball and racket. This softens the technical nature of the data, making the experience approachable yet professional.

## Colors

The palette is anchored by "Baseline Lime," a high-visibility vibrant green that serves as the primary brand identifier and call-to-action color. 

- **Primary:** Baseline Lime (#DFFF00). Used for active states, key highlights, and primary CTAs.
- **Secondary:** Deep Navy (#0A0E14). Used for primary text, headers, and heavy brand accents to provide a grounded, premium contrast.
- **Surface & Background:** A clean white (#FFFFFF) background is paired with soft gray (#F1F3F5) for section containment and row alternating.
- **Semantic:** Ranking movements use a success green (#22C55E) for upward climbs and a crisp red (#EF4444) for drops, ensuring immediate data comprehension.

## Typography

The system utilizes two typefaces to balance character and utility. **Montserrat** is used for headlines to provide a bold, geometric, and modern athletic feel. **Inter** is the workhorse for body text and data tables, chosen for its exceptional legibility at small sizes and its neutral, professional tone.

Data-heavy tables should utilize the `label-md` and `body-sm` styles to maximize information density while maintaining a clear hierarchy. Numeric data should ideally use tabular lining (if available in the font) to ensure columns align perfectly in rankings.

## Layout & Spacing

The layout follows a **Fixed Grid** model for desktop to maintain the integrity of wide data tables, centered within a 1280px container. 

- **Grid:** A 12-column system with 24px gutters.
- **Mobile:** Margins reduce to 16px. Tables should utilize horizontal scrolling or hidden columns for the best experience on small screens.
- **Vertical Rhythm:** Spacing follows a 4px baseline, but primary components are separated by `md` (24px) or `lg` (48px) increments to preserve the minimal, airy feel.

## Elevation & Depth

To maintain a clean and flat aesthetic, depth is primarily conveyed through **Tonal Layers** rather than heavy shadows.

- **Surface Tiers:** The main background is pure white. Secondary containers (like table headers or sidebar cards) use a soft neutral tint (#F8F9FA).
- **Shadows:** Only one elevation level of shadow is used—a very soft, highly diffused "Ambient" shadow (0px 4px 20px rgba(0, 0, 0, 0.04)) applied only to floating cards or active dropdowns.
- **Outlines:** Subtle 1px borders in #E9ECEF are used to define table rows and input fields, creating a crisp but low-contrast structure.

## Shapes

The design system uses a **Pill-shaped (Level 3)** roundedness strategy. This is the most defining characteristic of the UI.

- **Pill Elements:** Buttons, search bars, tags, and active navigation indicators must use a fully rounded (pill) radius.
- **Containers:** Larger cards and table containers use a `rounded-xl` (3rem) radius to maintain the soft, aerodynamic language without appearing overly circular at large scales.
- **Data Rows:** For ranking tables, the individual rows should have rounded corners on the far left and right edges to create a "floating pill" effect for each player.

## Components

### Navigation
Main navigation items use a transparent background with a Deep Navy text. The active state is a pill-shaped "Baseline Lime" background with Deep Navy text, providing high contrast and clear location signaling.

### Buttons
- **Primary:** Pill-shaped, Baseline Lime background, Deep Navy text, bold weight.
- **Secondary:** Pill-shaped, transparent background, 1px Deep Navy border.

### Ranking Tables
Table rows should have a hover state that applies a subtle #F8F9FA background and increases the corner radius to create a distinct pill shape. Ranking numbers (#1, #2) should be bolded in Deep Navy.

### Badges & Chips
- **Movement Badges:** Small, pill-shaped badges. Upward arrows and positive numbers use a soft green tint with dark green text. Downward use a soft red tint with dark red text.
- **Category Chips:** Used for tournament levels (e.g., ATP 1000). These are neutral gray pills with medium weight Inter text.

### Input Fields
Search bars and filter inputs must be pill-shaped with a soft 1px border and an inset search icon. Focus states should use a 2px Baseline Lime border.