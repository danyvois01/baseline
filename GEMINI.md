# ATP Rankings — Project Rules

## Project Overview
**Baseline** is a modern, high-fidelity web platform for real-time ATP tennis rankings.
- **Design System & PRD**: Always refer to `/docs/project-brief.md` for UI/UX specifications, feature logic, naming conventions, and visual identity.
- **Core Theme**: Light mode foundation (Deep Charcoal) + Signature "Tennis Green" accent (`#DFFF00`). Full Dark Mode support required.

## Tech Stack
- **Framework**: Next.js 14+ (App Router) with TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: Shadcn/ui (Radix Primitives)
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Data Tables**: TanStack Table (`@tanstack/react-table`)
- **Charts**: Recharts / Shadcn Charts
- **Data Fetching**: Server Components (fetch) + React Query (client-side when needed)
- **Dark Mode**: next-themes

## Next.js Rules
This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

## Code Guidelines (STRICT)
1. Write clean, modular, documented TypeScript code.
2. All comments, variable names, and documentation MUST be in **English**.
3. Implement ONLY what is explicitly requested. Do NOT add arbitrary exceptions, extra business logic, or unrequested features. Suggest improvements in chat first.
4. Mobile-first responsive design (Desktop optimized for high-density data as per brief).
5. Dark mode must always be supported.
6. Extensive use of `ROUND_FULL` (Tailwind `rounded-full`) and `rounded-xl` for components, buttons, and badges to match the pill-shaped aesthetic.
7. Before developing any new feature or implementation, you MUST create a design document under `/docs` named `YYYY-MM-DD-nome-funzione.md` (check the current local date first). Describe in detail the implementation plan, what will be done, and what will be developed. You MUST wait for explicit user confirmation/approval before proceeding.
8. **DO NOT use the browser subagent, DOM inspection, or automated screenshot tools to verify UI changes.** Implement the requested code and stop. The user will manually test the application and report any errors.

## Project Structure
- `src/app/` — App Router routes and layouts
- `src/components/ui/` — Shadcn/ui components (auto-generated)
- `src/components/layout/` — Header, Footer, Navigation
- `src/components/rankings/` — Rankings-specific components
- `src/components/players/` — Player-specific components
- `src/services/scraper/` — Web scraping logic (rankings, tournaments, players)
- `src/services/cache/` — Scraped data caching
- `src/types/` — TypeScript interfaces and types
- `src/hooks/` — Custom React hooks
- `src/providers/` — Context providers (theme, React Query)
- `src/lib/` — Utilities and constants

---

<!-- context7 -->

Use the `ctx7` CLI to fetch current documentation whenever the user asks about a library, framework, SDK, API, CLI tool, or cloud service -- even well-known ones like React, Next.js, Prisma, Express, Tailwind, Django, or Spring Boot. This includes API syntax, configuration, version migration, library-specific debugging, setup instructions, and CLI tool usage. Use even when you think you know the answer -- your training data may not reflect recent changes. Prefer this over web search for library docs.

Do not use for: refactoring, writing scripts from scratch, debugging business logic, code review, or general programming concepts.

## Steps

1. Resolve library: `npx ctx7@latest library <name> "<user's question>"` — use the official library name with proper punctuation (e.g., "Next.js" not "nextjs", "Customer.io" not "customerio", "Three.js" not "threejs")
2. Pick the best match (ID format: `/org/project`) by: exact name match, description relevance, code snippet count, source reputation (High/Medium preferred), and benchmark score (higher is better). If results don't look right, try alternate names or queries (e.g., "next.js" not "nextjs", or rephrase the question)
3. Fetch docs: `npx ctx7@latest docs <libraryId> "<user's question>"`
4. Answer using the fetched documentation

You MUST call `library` first to get a valid ID unless the user provides one directly in `/org/project` format. Use the user's full question as the query -- specific and detailed queries return better results than vague single words. Do not run more than 3 commands per question. Do not include sensitive information (API keys, passwords, credentials) in queries.

For version-specific docs, use `/org/project/version` from the `library` output (e.g., `/vercel/next.js/v14.3.0`).

If a command fails with a quota error, inform the user and suggest `npx ctx7@latest login` or setting `CONTEXT7_API_KEY` env var for higher limits. Do not silently fall back to training data.
<!-- context7 -->
