# Treasure State (treasurestate.com)

Next.js static site: town guides, comparisons, rankings, lodging, planners, and editorial content under `/information/` and `/guides/`.

## Repository layout

| Path | Purpose |
|------|---------|
| `web/` | Next.js app (`pages/`, `components/`, `lib/`, `data/`, `public/`) |
| `articles_information/` | Markdown articles for **Montana Facts** (`/information/<slug>/`) |
| `articles_guides/` | Markdown articles for **Guides** (`/guides/<slug>/`) |
| `web/data/field-notes.json` | Short **Field Notes** (stored vs published; homepage / embeds) |
| `cities_towns_content/` | Town profile markdown |
| `lodging_pages/` | Lodging guide markdown |
| `netlify.toml` | Build and publish settings for Netlify |

## Prerequisites

- **Node.js 18+** (matches Netlify; see `netlify.toml`)

## Local development

```bash
cd web
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Build (production output)

From `web/`:

```bash
npm run build
```

This runs:

1. **prebuild** — asset copy, WebP conversion, `generate-search-index.js` → `public/search-index.json`
2. **next build** + **next export** — static HTML to `web/out/`
3. **generate-sitemap.js** — writes `web/out/sitemap.xml`

Preview the static site locally:

```bash
npm start
# serves web/out (default port from `serve`)
```

## Publishing the site (deploy)

**Production uses Netlify** (`netlify.toml` at repo root):

- **Base directory:** `web`
- **Publish directory:** `out`
- **Build command:** `npm install && npm run build`

Pushing to the connected Git branch triggers a build; Netlify publishes `web/out/`.

**To go live with code + content changes:** commit, push to `main` (or your deploy branch), and let Netlify finish. Verify the deploy in the Netlify dashboard.

## Publishing new content (articles & field notes)

Content is file-based; there is no CMS. **Publishing = merge to the deploy branch** so Netlify rebuilds.

### Articles (Montana Facts or Guides)

1. Add a `.md` file under `articles_information/` or `articles_guides/` with YAML frontmatter (`title`, `slug`, `type`, `tags`, `featured`, `excerpt`, `hero_image`, `meta_description`, `related_towns`, etc.).  
   Or run: `node web/scripts/new-article.js` from `web/` (interactive scaffold).
2. Ensure body meets project rules: sufficient word count, internal links, headings as needed.
3. Commit and push. The next build generates routes, search index entries, and sitemap URLs automatically.

**Note:** Slugs that already exist as dedicated `.tsx` pages under `pages/Information/` or `pages/guides/` are not duplicated by dynamic routes—avoid filename collisions.

### Field notes

1. Edit `web/data/field-notes.json` or run `node web/scripts/new-field-note.js` (adds a **stored** note).
2. Set `"status": "published"` (and optionally `"featured": true`) to surface notes on the homepage module (when `content_hub_enabled` is true in `web/lib/feature-flags.ts`).
3. Embed in articles with `{{field_note:fn-001}}` in markdown; list note IDs in article frontmatter `field_notes: [...]` if you use embeddings.

### Feature flag

`web/lib/feature-flags.ts` — `content_hub_enabled` gates article paths, homepage culture module, related modules, etc. Set to `false` to disable those surfaces without removing content files.

### After adding routes or new page types

- Search: `web/scripts/generate-search-index.js` runs on **prebuild**; confirm `web/public/search-index.json` after build.
- Sitemap: generated **after** export in `web/out/sitemap.xml`.

## Issue tracking

This project uses **bd (beads)** for issues. See `AGENTS.md` and run `bd onboard`.

## Fact-checking

Editorial content should be verified against [Grokipedia](https://www.grokipedia.com) per project rules.
