# Treasure State Landing Codebase – Coding Conventions & Best Practices

## 1. Project Structure & Organization (Next.js)
- **Framework:** We use Next.js for Static Site Generation (SSG). All dynamic routing and components live in the `web/` directory.
- **Directories (`web/`):**
  - `pages/`: Next.js pages and dynamic routes.
  - `components/`: Reusable React components.
  - `lib/`: Utility functions and markdown parsing.
  - `public/`: Static assets (images, robots.txt).
- **Legacy Files:** Do not use root-level HTML files, bash scripts, or vanilla JS scripts for site generation.

## 2. Issue Tracking
- **Beads (`bd`) Only:** All tasks, bugs, and features MUST be tracked in `beads`. Use `bd create`, `bd update`, and `bd close`.
- Never perform significant work without an associated `bd` issue.

## 3. Answer Engine Optimization (AEO)
- **Direct Answers:** Format content to provide concise, direct answers to common queries (e.g., "What to do in X?", "History of Y").
- **Semantic HTML:** Use semantic tags (`<article>`, `<section>`, `<aside>`) and logical heading structures (`<h2>`, `<h3>`).
- **Structured Data:** Use JSON-LD to inject Schema.org metadata:
  - `FAQPage` for answering common questions.
  - `Place` / `City` for geographic contexts.
  - `TouristAttraction` for POIs.

## 4. Search Engine Optimization (SEO)
- **Dynamic Meta Tags:** Every dynamic page (`pages/[slug].tsx`) must have unique, descriptive `<title>` and `<meta name="description">` tags.
- **OpenGraph/Twitter Cards:** Include complete social sharing meta tags.
- **Core Web Vitals:** Optimize images using `next/image` with `priority` for Hero components to ensure fast Largest Contentful Paint (LCP). Use modern formats (WebP/AVIF).
- **Sitemaps:** Maintain dynamic, auto-generating sitemaps for all Next.js routes.

## 5. Maintenance & Updates
- **Keep code clean:** Remove unused files, legacy scripts, and dead code.
- **Version control:** Commit changes with clear, descriptive messages. Always push your changes (`git push`) before ending a session.
- **Documentation:** Keep `AGENTS.md` and this file up to date as standards evolve.
