# Missoula Hub + Cluster Buildout — Revised Spec

TreasureState.com · Next.js (Pages Router) · Static Export

---

## Objective

Convert the existing Missoula page into a pillar hub and build 7 tightly
interlinked cluster pages to establish topical authority and improve organic
rankings for Missoula-related queries.

This is a structural SEO build using a **scalable dynamic routing pattern**
so the same architecture can serve Bozeman, Helena, and future cities with
zero code duplication.

---

## Hard Constraints

- Do not change the Missoula hub URL (`/montana-towns/missoula/`).
- Do not remove existing Missoula data tables, stats, or structured blocks.
- Do not introduce heavy client-side JS.
- Do not refactor global styles.
- Keep performance impact minimal (no new npm dependencies).
- Every cluster page must have 800+ words of unique, data-grounded content.
- No thin or filler pages. If a topic can't sustain 800 words of real
  content, it does not ship.

---

## Architecture: Dynamic Routing (Scalable)

### Why not hardcoded files per city?

The original spec called for `pages/montana-towns/missoula/cost-of-living.tsx`,
with the intent to replicate for Bozeman, Helena, etc. That means 10 page files
× N cities = hundreds of manually maintained files with duplicated logic.

Instead, this build uses Next.js dynamic routes:

```
pages/montana-towns/
  [slug]/
    index.tsx      ← Hub page (replaces [slug].tsx for ALL towns)
    [topic].tsx    ← Cluster pages (only generated for towns with cluster data)
```

- `[slug]/index.tsx` renders the same content as today's `[slug].tsx` for every
  town. For towns that have cluster data (initially only Missoula), it adds hub
  cards, FAQ, and an enhanced intro.
- `[slug]/[topic].tsx` only generates pages for town+topic combinations that
  exist in the data layer. Initially: Missoula × 7 topics.
- Adding Bozeman later = adding data, not code.

### Migration step

1. Move `pages/montana-towns/[slug].tsx` → `pages/montana-towns/[slug]/index.tsx`
2. Verify all 134 existing town URLs still resolve identically.
3. Create `pages/montana-towns/[slug]/[topic].tsx`.

---

## Data Layer

### File: `components/town/cluster-data.ts`

Single source of truth for all hub/cluster configuration.

```typescript
export type ClusterGuide = {
  topic: string;       // URL segment: "cost-of-living", "hiking", etc.
  title: string;       // Display title
  h1: string;          // Page <h1>
  metaTitle: string;   // <title> tag
  description: string; // Card description + meta description seed
  icon: string;        // Emoji for hub card
};

export type ClusterFAQ = {
  question: string;
  answer: string;      // 40–80 words, factual
};

export type ClusterConfig = {
  guides: ClusterGuide[];
  faqs: ClusterFAQ[];
};

// Keyed by town slug
export const clusterConfigs: Record<string, ClusterConfig> = {
  missoula: {
    guides: [ /* 7 entries */ ],
    faqs: [ /* 8–10 entries */ ],
  },
};

export function getClusterConfig(slug: string): ClusterConfig | null {
  return clusterConfigs[slug] || null;
}

export function hasCluster(slug: string): boolean {
  return slug in clusterConfigs;
}
```

### File: `components/town/cluster-content.ts`

Long-form content for each cluster page, keyed by `${slug}/${topic}`.
Content is stored as plain strings (not markdown) to avoid adding a markdown
parser dependency for cluster pages. HTML is acceptable where needed for
structure (lists, tables).

Each entry must contain 800+ words of unique content organized into sections.

---

## Part 1: Hub Page Enhancements

**File:** `pages/montana-towns/[slug]/index.tsx`

The hub page retains ALL existing content and components. The following are
**additions**, not replacements.

### 1.1 Intent-Matching Intro (150–250 words)

Placed directly under `<h1>`.

Requirements:
- State page purpose (living + visiting guide)
- Include internal links to 3–4 cluster pages
- Factual tone, no hype
- Only rendered for towns with cluster data

### 1.2 Hub Cards Section

Placed after the intro, before existing content.

Renders cards linking to all cluster pages for this town. Each card:
- Icon
- Title
- 1–2 sentence description
- Link to cluster page

Generated from `clusterConfigs[slug].guides`.

Only rendered for towns with cluster data.

### 1.3 FAQ Section

Added after the main content area (after NearbyTowns, before StoreBanner).

- `<h2 id="faqs">Frequently Asked Questions About {townName}</h2>`
- 8–10 Q&As, specific to the town
- Answers: 40–80 words each, factual
- Generated from `clusterConfigs[slug].faqs`
- FAQPage JSON-LD emitted via existing Schema component

Only rendered for towns with cluster data.

### 1.4 Heading Structure Audit

- Verify exactly ONE `<h1>` (already the case)
- Ensure all major sections use `<h2 id="...">`
- No skipped heading levels

### 1.5 Enhanced JSON-LD

The existing `Schema` component already emits City, TouristAttraction, and
FAQPage schemas. For hub towns, extend with:
- BreadcrumbList (already emitted by Breadcrumbs component)
- Ensure FAQPage uses the curated FAQ data from `cluster-data.ts` (higher
  quality than auto-extracted markdown FAQs)

No changes needed to the Schema component interface — just pass the curated
FAQ data instead of (or in addition to) the auto-extracted aeoData.

---

## Part 2: Cluster Pages

**File:** `pages/montana-towns/[slug]/[topic].tsx`

### 7 Pages (Missoula)

| # | Topic slug | Target keyword | Primary data source |
|---|-----------|---------------|-------------------|
| 1 | `cost-of-living` | "cost of living in Missoula Montana" | town-housing.json (income, affordability, rent) + town-economy.json |
| 2 | `housing` | "Missoula Montana housing market" | town-housing.json (all 26 fields: Zillow, inventory, YoY, vacancy) |
| 3 | `jobs` | "jobs in Missoula Montana" | town-economy.json (13 industries, unemployment, labor force) |
| 4 | `schools` | "Missoula Montana schools" | town-data.json (district, enrollment) + town-economy.json (graduation, spending) |
| 5 | `hiking` | "hiking near Missoula Montana" | town-recreation.json (90 trailheads, 8 wilderness areas, 6 state parks) |
| 6 | `fishing` | "fishing near Missoula Montana" | town-recreation.json (44 fishing access sites, 5 rivers, 127 lakes) |
| 7 | `weekend-itinerary` | "Missoula weekend trip" | town-recreation.json + markdown content (Things to Do, Seasonal Activities) |

### Why these 7 and not 10

**Dropped: neighborhoods**
Zero neighborhood data exists in any data file. Would produce thin,
speculative content that hurts rather than helps.

**Dropped: vs-bozeman, vs-helena**
Comparison pages already exist at `/compare/bozeman-vs-missoula/` and
`/compare/missoula-vs-helena/` with full data tables. Creating new pages at
`/montana-towns/missoula/vs-bozeman/` would split search authority and create
self-cannibalization. Instead, enrich the existing compare pages with
cross-links back to both town hubs (separate task).

### Content differentiation: cost-of-living vs. housing

These two pages share some data points but target different search intents:

| | Cost of Living | Housing Market |
|---|--------------|---------------|
| **Intent** | "Can I afford to live here?" | "What's the market doing?" |
| **Focus** | Monthly budget breakdown, income-to-cost ratios, comparison to state/national averages | Market trends, inventory analysis, buying vs renting, Zillow data |
| **Unique data** | Affordability ratio, income percentile, estimated monthly costs | Inventory, YoY change, median list price, new listings, vacancy rate |
| **Shared data** | Median home value, median rent (used differently) | Median home value, median rent (used differently) |

---

## Part 3: Standard Structure for Every Cluster Page

### 3.1 Metadata (in `<Head>`)

```
Title:    {h1} | Treasure State
Desc:     145–160 chars, must include "Missoula"
Canonical: https://treasurestate.com/montana-towns/{slug}/{topic}/
OG:       title + description + og:image (town image or hero fallback)
```

### 3.2 Breadcrumbs

```
Home → Montana Towns → Missoula → {Topic Title}
```

Using existing `Breadcrumbs` component. Emits BreadcrumbList JSON-LD
automatically.

### 3.3 Page Layout

Each cluster page uses this structure:

1. **Hero** (small) — reuses existing Hero component with town image
2. **Breadcrumbs**
3. **H1**
4. **At-a-glance summary** — 5–8 key stats/bullets
5. **Link to hub** — within first 200 words
6. **Main content** — 800+ words, real data, organized with H2/H3 headings
7. **Related Missoula Guides** — links to hub + 6 sibling cluster pages
8. **Affiliate CTA** — StaysCTA component (already exists)
9. **Store Banner** — existing StoreBanner component

### 3.4 Internal Linking Rules

Each cluster page MUST:
- Link to the hub page (`/montana-towns/missoula/`)
- Link to at least 6 other cluster pages
- Use descriptive anchor text (not "click here")

Links are generated from `clusterConfigs[slug].guides`, filtering out the
current page.

### 3.5 Related Guides Component

**File:** `components/town/RelatedGuides.tsx`

Shared component (not Missoula-scoped). Accepts `slug` and `currentTopic`,
renders cards for all other cluster pages for that town plus a "Back to hub"
link.

```typescript
type Props = {
  slug: string;
  townName: string;
  currentTopic: string;
};
```

---

## Part 4: Data Loading (`getStaticProps` / `getStaticPaths`)

### `[topic].tsx` — getStaticPaths

```typescript
export const getStaticPaths: GetStaticPaths = async () => {
  const paths: { params: { slug: string; topic: string } }[] = [];
  for (const [slug, config] of Object.entries(clusterConfigs)) {
    for (const guide of config.guides) {
      paths.push({ params: { slug, topic: guide.topic } });
    }
  }
  return { paths, fallback: false };
};
```

### `[topic].tsx` — getStaticProps

Each topic page loads only the data it needs:

| Topic | Data loaded |
|-------|------------|
| cost-of-living | town-housing.json, town-economy.json |
| housing | town-housing.json |
| jobs | town-economy.json |
| schools | town-data.json, town-economy.json |
| hiking | town-recreation.json (filtered to trailheads, wilderness, state parks) |
| fishing | town-recreation.json (filtered to fishing access, rivers, lakes) |
| weekend-itinerary | town-recreation.json, town-climate.json, markdown content |

All data loading follows the same try/catch pattern used in the existing
`[slug]/index.tsx`.

---

## Part 5: Sitemap

The existing `scripts/generate-sitemap.js` scans the `out/` directory. New
pages at `out/montana-towns/missoula/hiking/index.html` etc. will be
discovered automatically.

**Verification checklist:**
- [ ] No `noindex` on any cluster page
- [ ] Canonical URLs are correct and absolute
- [ ] Trailing slash behavior is consistent (yes — `trailingSlash: true`)
- [ ] All 7 new URLs appear in `out/sitemap.xml` after build

---

## Part 6: Performance

- No new npm dependencies.
- No client-side TOC logic (anchor links only).
- No unnecessary hydration — pages are static.
- Cluster pages reuse existing components (Hero, Breadcrumbs, Header, Footer,
  StaysCTA, StoreBanner).
- Recreation data is filtered at build time in `getStaticProps`, not at
  runtime. Only relevant places are serialized into the page props.

---

## Part 7: Acceptance Criteria

### Hub page
- [ ] Intro section (150–250 words) with internal links
- [ ] Hub cards linking to all 7 cluster pages
- [ ] FAQ section (8–10 Q&As) with FAQPage JSON-LD
- [ ] Clean heading hierarchy (one H1, H2s with IDs)
- [ ] All existing data tables and content preserved
- [ ] Non-hub towns render identically to before

### Cluster pages
- [ ] All 7 pages exist and render
- [ ] Each has: metadata, canonical, breadcrumbs, OG tags
- [ ] Each has 800+ words of unique, data-grounded content
- [ ] Each links to hub + 6 sibling pages
- [ ] At-a-glance summary on each page
- [ ] StaysCTA and StoreBanner on each page

### Technical
- [ ] All 134 existing town URLs still work
- [ ] Sitemap includes all new URLs
- [ ] Lighthouse performance does not materially regress
- [ ] Build succeeds with `output: 'export'`

---

## Part 8: Future Expansion

### Adding Bozeman (example)

1. Add `bozeman` entry to `clusterConfigs` in `cluster-data.ts`
2. Add Bozeman content entries to `cluster-content.ts`
3. Build. Done. No new page files needed.

### Adding a new topic (e.g., "camping")

1. Add `{ topic: 'camping', ... }` to the guides array for each city
2. Add content entry for `missoula/camping`, `bozeman/camping`, etc.
3. Add data loading logic for the new topic type in `[topic].tsx`
4. Build. Done.

### Adding neighborhoods later

When real neighborhood data is available (school zones, walkability scores,
median values by ZIP), add it as a topic. Do not create it with speculative
content.

---

## Execution Order

| Step | Task | Risk |
|------|------|------|
| 1 | Create `cluster-data.ts` with Missoula guides + FAQs | None |
| 2 | Create `cluster-content.ts` with Missoula content (7 topics) | Content quality |
| 3 | Move `[slug].tsx` → `[slug]/index.tsx`, verify all towns | URL breakage |
| 4 | Add hub enhancements (intro, cards, FAQ) to `[slug]/index.tsx` | None |
| 5 | Create `RelatedGuides.tsx` component | None |
| 6 | Create `[topic].tsx` with routing + data loading | Routing |
| 7 | Build and verify all routes + sitemap | Build errors |
| 8 | Link graph verification | Missing links |

---

## What This Spec Deliberately Does NOT Include

- **Neighborhoods page** — no data to support it
- **vs-bozeman / vs-helena pages** — would cannibalize existing compare pages
- **Missoula-scoped components** — uses shared components for scalability
- **Design changes** — this is structural SEO, not a redesign
- **New images** — reuses existing town images via Hero component
