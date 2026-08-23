# 🎾 Baseline — Modern ATP Tennis Rankings

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-16.2.6-black?style=for-the-badge&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-19.2.4-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.0-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-12.x-0055FF?style=for-the-badge&logo=framer&logoColor=white)
![Deploy](https://img.shields.io/badge/Vercel-Deployed-black?style=for-the-badge&logo=vercel&logoColor=white)

**A high-fidelity, real-time web platform for tracking ATP tennis rankings and exploring the tour structure through immersive scrollytelling.**

[Explore Live Demo](https://baseline-tennis.vercel.app) · [Report Bug](https://github.com/danyvois01/baseline/issues) · [Request Feature](https://github.com/danyvois01/baseline/issues)

</div>

---

## 📖 Overview

**Baseline** redefines how tennis enthusiasts interact with ATP data. It pairs high-density, real-time standings with an editorial scrollytelling experience that educates fans on the complex mechanisms of the ATP Tour—from point defense and rolling 52-week windows to tournament pyramids and qualification races.

Designed with a sleek **Minimalist-Athletic** visual identity, Baseline blends glassmorphic surfaces, tactile pill-shaped components, deep charcoal tones, and high-energy **Tennis Green** (`#DFFF00`) accents.

---

## ✨ Features

### 📊 Real-Time Rankings & Data Views
- **🔴 Live ATP Rankings (`/live`)**: Real-time point projections, match-by-match movements, status indicators (active, eliminated, defending), and point differential badges.
- **🏛️ Official Standings (`/official`)**: The official weekly ATP rankings with historical movements and career milestones.
- **🏆 Race to Turin (`/race`)**: Year-to-date points race tracking the top 8 players contending for the Nitto ATP Finals, complete with qualification cut-off indicators.
- **🔍 High-Density Data Tables**: Built on `@tanstack/react-table` with expandable player cards, instant search, country filters, and responsive mobile-first views.

### 🎭 Immersive Homepage Scrollytelling
- **3D Court Hero**: Interactive SVG tennis court that reacts to scrolling with dynamic 3D pitch and roll transitions.
- **52-Week Rolling Rule**: Animated SVG progress ring visualizing the rolling calendar point drops.
- **Tournament Pyramid**: Sticky split-screen hierarchy highlighting Grand Slams, the ATP Finals crown, Masters 1000, ATP 500, and ATP 250 tiers.
- **Season Timeline**: Interactive chronological calendar mapping out the global tennis season with court-surface color coding (Hard, Clay, Grass, Indoor).
- **Tennis Scoring & Glossary**: Storytelling modules breaking down sets, tiebreaks, advantage rules, and key tennis terminology.

### 🌐 System & Architecture Highlights
- **🌓 Dark & Light Mode**: Complete theme support with smooth transitions via `next-themes`.
- **🌍 Internationalization (i18n)**: Instant locale switching between **English** and **Italian**.
- **🖼️ Automated Dynamic Social Cards**: Dynamic 1200x630 OpenGraph card generation via `@vercel/og`.
- **⚡ Resilient Data Fetching**: Multi-strategy data service with automated ScraperAPI integration, exponential backoff, and instant mock-data mode for offline development.
- **📱 Fully Responsive**: Desktop density for statistical analysis with optimized touch layouts on mobile.

---

## 🛠️ Tech Stack

| Category | Technology |
| :--- | :--- |
| **Framework** | [Next.js 16 (App Router)](https://nextjs.org/) + Turbopack |
| **Language** | [TypeScript](https://www.typescriptlang.org/) (Strict Mode) |
| **UI & Styling** | [Tailwind CSS v4](https://tailwindcss.com/) + Base UI / Shadcn Radix Primitives |
| **Animations** | [Framer Motion 12](https://www.framer.com/motion/) |
| **Data Tables** | [TanStack Table v8](https://tanstack.com/table/v8) |
| **Data Visualization** | [Recharts](https://recharts.org/) |
| **Icons** | [Lucide React](https://lucide.dev/) + [Flag Icons](https://flagicons.lipis.dev/) |
| **Parsing & Validation** | [Cheerio](https://cheerio.js.org/) + [Zod](https://zod.dev/) |
| **Theme & i18n** | `next-themes` + Custom React Context Locale Provider |

---

## 📁 Project Structure

```text
baseline/
├── docs/                      # Architectural & feature design specifications
├── public/                    # Static assets & brand assets
├── src/
│   ├── app/                   # Next.js App Router (pages, layouts, metadata)
│   │   ├── (routes)/          # /live, /official, /race, /about, /privacy
│   │   ├── opengraph-image.tsx# Dynamic OpenGraph social card
│   │   ├── robots.ts          # Automated robots.txt
│   │   └── sitemap.ts         # Automated XML sitemap
│   ├── components/
│   │   ├── homepage/          # Hero, Pyramid, Timeline, Glossary, Scrollytelling
│   │   ├── layout/            # TopNavBar, Footer, SettingsPill, LanguageToggle
│   │   ├── rankings/          # Ranking tables, cells, expanded cards, badges
│   │   └── ui/                # Reusable primitives (Buttons, Badges, Tabs)
│   ├── lib/                   # Utilities, country mapping, i18n dictionaries
│   ├── providers/             # Theme & Locale context providers
│   ├── services/              # Rankings data service & scraper logic
│   └── types/                 # TypeScript type declarations & interfaces
└── package.json
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: `20.x` or higher (tested on Node `24.x`)
- **npm**, **pnpm**, or **yarn**

### 1. Clone the repository
```bash
git clone https://github.com/danyvois01/baseline.git
cd baseline
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment variables
Create a `.env.local` file in the root directory (refer to `.env.example`):

```bash
# Optional: ScraperAPI Key for live scraping (https://www.scraperapi.com/)
SCRAPER_API_KEY=your_scraperapi_key_here

# Optional: Set to "true" to serve mock data locally without burning API credits
NEXT_PUBLIC_USE_MOCK_DATA=true

# Canonical URL used for SEO & metadata
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 4. Run the development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

---

## ⚙️ Environment Variables Reference

| Variable | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `SCRAPER_API_KEY` | `string` | *(optional)* | ScraperAPI key for scraping live ATP standings. |
| `NEXT_PUBLIC_USE_MOCK_DATA` | `boolean` | `false` | When set to `true`, serves bundled fixture data (ideal for offline/UI testing). |
| `NEXT_PUBLIC_SITE_URL` | `string` | `https://baseline-tennis.vercel.app` | Base canonical domain for OpenGraph, sitemaps, and robots.txt. |

---

## 🚢 Deployment to Vercel

The platform is optimized for deployment on [Vercel](https://vercel.com/):

1. Push your code to your GitHub repository.
2. In the Vercel Dashboard, select **Add New** → **Project** and import `baseline`.
3. Framework preset is automatically detected as **Next.js**.
4. Configure any necessary **Environment Variables** (`SCRAPER_API_KEY`, etc.).
5. Click **Deploy**.

---

## ⚖️ Disclaimer

**Baseline** is an independent, open-source editorial and statistics platform. It is not affiliated, associated, authorized, endorsed by, or in any way officially connected with the **ATP Tour, Inc.** or any of its subsidiaries or affiliates. All official tennis tournament names, rankings, and player data remain the property of their respective trademark and copyright holders.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
