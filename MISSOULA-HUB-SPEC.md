# Missoula Hub + Cluster Buildout — As Built

TreasureState.com · Next.js (Pages Router) · Static Export
Completed February 2026

---

## What Was Built

The existing Missoula page was converted into a pillar hub and 7 tightly
interlinked cluster pages were created to establish topical authority for
Missoula-related queries. The architecture uses scalable dynamic routing
so the same pattern can serve Bozeman, Helena, and future cities with
zero code duplication.

---

## Architecture

### Dynamic Routing

```
pages/montana-towns/
  [slug]/
    index.tsx      ← Hub page (replaces [slug].tsx for ALL towns)
    [topic].tsx    ← Cluster pages (only generated for towns with cluster data)
```

- `[slug]/index.tsx` renders the same content as the former `[slug].tsx` for
  every town. For towns with cluster data (currently Missoula), it adds a
  hub intro, guide cards, and a curated FAQ section.
- `[slug]/[topic].tsx` only generates pages for town+topic combinations
  defined in `cluster-data.ts`. Currently: Missoula × 7 topics = 7 pages.
- Adding a new city requires adding data to `cluster-data.ts` and a topic
  component per topic — no new page files.

### Migration (Completed)

1. Moved `pages/montana-towns/[slug].tsx` → `pages/montana-towns/[slug]/index.tsx`
2. All 134 existing town URLs resolve identically.
3. Created `pages/montana-towns/[slug]/[topic].tsx`.

---

## File Inventory

### Data & Configuration

| File | Purpose |
|------|---------|
| `components/town/cluster-data.ts` | Cluster metadata: guide topics, titles, meta tags, icons, FAQs, hub intro |

### Shared Components

| File | Purpose |
|------|---------|
| `components/town/RelatedGuides.tsx` | Links to sibling cluster pages + back-to-hub link |

### Topic Content Components

Each topic has its own React component that renders data-driven narrative
content. Content is JSX (not stored strings), so it can use conditional
rendering, data formatting, and internal `<Link>` components directly.

| File | Props received |
|------|---------------|
| `components/town/topics/CostOfLiving.tsx` | `townName`, `slug`, `housing`, `economy` |
| `components/town/topics/Housing.tsx` | `townName`, `slug`, `housing` |
| `components/town/topics/Jobs.tsx` | `townName`, `slug`, `economy`, `population` |
| `components/town/topics/Schools.tsx` | `townName`, `slug`, `schoolDistrict`, `schoolEnrollment`, `schoolWebsite`, `graduationRate`, `perPupilSpending`, `population` |
| `components/town/topics/Hiking.tsx` | `townName`, `slug`, `trails`, `wilderness`, `stateParks` |
| `components/town/topics/Fishing.tsx` | `townName`, `slug`, `fishingAccess`, `rivers`, `lakes` |
| `components/town/topics/WeekendItinerary.tsx` | `townName`, `slug`, `climate`, `highlights` |

### Page Routes

| File | Purpose |
|------|---------|
| `pages/montana-towns/[slug]/index.tsx` | Hub page for all towns (enhanced for cluster towns) |
| `pages/montana-towns/[slug]/[topic].tsx` | Dynamic cluster page route |

---

## Data Layer

### `cluster-data.ts` — Types

```typescript
export type ClusterGuide = {
  topic: string;          // URL segment: "cost-of-living", "hiking", etc.
  title: string;          // Display title on hub cards and RelatedGuides
  h1: string;             // Page <h1> rendered in Hero
  metaTitle: string;      // <title> tag
  metaDescription: string; // <meta name="description">
  description: string;    // Short description for hub cards
  icon: string;           // Emoji for hub card and RelatedGuides
};

export type ClusterFAQ = {
  question: string;
  answer: string;         // 40–80 words, factual
};

export type ClusterConfig = {
  hubIntro: string;       // HTML string for hub page intro (paragraphs separated by \n)
  guides: ClusterGuide[];
  faqs: ClusterFAQ[];
};

export const clusterConfigs: Record<string, ClusterConfig> = {
  missoula: { /* ... */ },
};
```

### Key Design Decisions

**Why JSX components instead of stored content strings?**
The original spec proposed a `cluster-content.ts` file with long-form content
as plain strings. In practice, topic content needs:
- Conditional rendering based on data availability (`{h?.zillowRent && ...}`)
- Number formatting helpers (`fmtDollar()`, `ordinal()`)
- Internal `<Link>` components for cross-linking
- Data tables rendered from arrays
- JSX whitespace handling

Storing this as strings would require a custom parser. Individual `.tsx`
components per topic are simpler, more maintainable, and type-safe.

**Why `hubIntro` as an HTML string?**
The hub intro is short (2–3 paragraphs) with basic `<a>` tags linking to
cluster pages. It's rendered via `dangerouslySetInnerHTML` on the hub page.
This keeps it in the data layer without needing a separate component.

---

## Missoula Cluster Pages

### 7 Pages

| # | Topic slug | Target keyword | Primary data source |
|---|-----------|---------------|-------------------|
| 1 | `cost-of-living` | "cost of living in Missoula Montana" | town-housing.json, town-economy.json |
| 2 | `housing` | "Missoula Montana housing market" | town-housing.json |
| 3 | `jobs` | "jobs in Missoula Montana" | town-economy.json, town-data.json |
| 4 | `schools` | "Missoula Montana schools" | town-data.json, town-economy.json |
| 5 | `hiking` | "hiking near Missoula Montana" | town-recreation.json |
| 6 | `fishing` | "fishing near Missoula Montana" | town-recreation.json |
| 7 | `weekend-itinerary` | "Missoula weekend trip" | town-recreation.json, town-climate.json |

### Missoula Recreation Data (Verified Counts)

| Type | Total in data | Within 50 mi |
|------|--------------|-------------|
| Trailheads | 90 | 90 |
| Lakes | 126 | 77 |
| Fishing Access | 44 | 44 |
| Wilderness Areas | 8 | 8 |
| State Parks | 6 | 6 |
| Museums | 22 | varies |
| All recreation | 451 | 383 |

Content uses the "within 50 miles" counts. Lake data extends to 60 mi
in the source; the fishing page correctly says "75+ lakes within 50 miles."

### Content Differentiation: cost-of-living vs. housing

| | Cost of Living | Housing Market |
|---|--------------|---------------|
| **Intent** | "Can I afford to live here?" | "What's the market doing?" |
| **Focus** | Monthly budget breakdown, income-to-cost ratios, state comparison | Market trends, inventory, buying vs renting, Zillow data |
| **Unique data** | Affordability ratio, income percentile, budget table | Inventory YoY, median list price, new listings, vacancy rate |
| **Shared data** | Median home value, median rent (used differently) | Median home value, median rent (used differently) |

### Why Only 7 Topics

**Dropped: neighborhoods** — No neighborhood-level data exists.
**Dropped: vs-bozeman, vs-helena** — Comparison pages already exist at
`/compare/`. Duplicating would split search authority.

---

## Hub Page Enhancements

**File:** `pages/montana-towns/[slug]/index.tsx`

All existing content and components are preserved. The following are
additions, rendered only for towns with cluster data:

### Hub Intro
- Placed before the guide cards
- 2–3 paragraphs stored as `hubIntro` in cluster-data.ts
- Contains internal links to cluster pages
- Rendered via `dangerouslySetInnerHTML`

### Hub Cards
- Grid of cards linking to all 7 cluster pages
- Each card: icon + title + 1-sentence description
- Generated from `clusterConfigs[slug].guides`
- Styled with CSS classes injected via `<style>` tag

### FAQ Section
- Placed after NearbyTowns, before StoreBanner
- `<h2 id="faqs">Frequently Asked Questions About {townName}</h2>`
- 10 Q&As for Missoula, specific and factual
- FAQPage JSON-LD emitted via existing Schema component using curated FAQs
  (overrides auto-extracted markdown FAQs for hub towns)

---

## Cluster Page Structure

**File:** `pages/montana-towns/[slug]/[topic].tsx`

Every cluster page follows this layout:

1. **Head** — canonical URL, title, meta description, OG tags, BreadcrumbList JSON-LD
2. **Header** — site-wide header
3. **Breadcrumbs** — Home → Cities and Towns → {Town} → {Topic}
4. **Hero** (small) — town image, guide H1
5. **Topic content** — rendered by the appropriate topic component (800+ words)
6. **Related Guides** — links to hub + 6 sibling cluster pages via RelatedGuides.tsx
7. **StaysCTA** — affiliate CTA
8. **StoreBanner** — store banner
9. **Footer** — site-wide footer

### Data Loading (`getStaticProps`)

All data files are loaded in `getStaticProps` and filtered by type:

```typescript
const trailTypes = new Set(['Trailhead']);
const wildTypes = new Set(['Wilderness']);
const parkTypes = new Set(['State Park']);
const fishTypes = new Set(['Fishing Access']);
const riverTypes = new Set(['River']);
const lakeTypes = new Set(['Lake']);
const highlightTypes = new Set(['Museum', 'State Park', 'Hot Spring', 'Ski Area']);
```

Lakes are capped at 15 entries. Highlights (for weekend-itinerary) are
capped at 20, sorted by distance. "National HQ" and "Historic Site" types
are excluded from highlights to prevent irrelevant entries.

### Data Filtering in Topic Components

**WeekendItinerary.tsx** applies additional filtering for cultural stops:
- Only entries with type `Museum` are shown
- A `SKIP_NAMES` set excludes non-visitor-relevant entries (memorials, statues, org HQs)
- Distance capped at 10 miles from downtown
- Capped at 6 entries

---

## Sitemap

**File:** `scripts/generate-sitemap.js`

Updated to scan for cluster page subdirectories in the build output:

```javascript
const townOutDir = path.join(outDir, 'montana-towns', t.slug);
if (fs.existsSync(townOutDir)) {
  for (const sub of fs.readdirSync(townOutDir)) {
    const subPath = path.join(townOutDir, sub);
    if (fs.statSync(subPath).isDirectory() &&
        fs.existsSync(path.join(subPath, 'index.html'))) {
      entries.push(url(`${baseUrl}/montana-towns/${t.slug}/${sub}/`));
    }
  }
}
```

All 7 Missoula cluster pages appear in `out/sitemap.xml`.

---

## Data Quality Fixes Applied

| Issue | Fix |
|-------|-----|
| "Duffy Lake" listed near Missoula (does not exist) | Removed from town-recreation.json |
| Lake count said "125+" within 50 mi (actual: 77) | Changed to "75+" |
| Recreation site count said "457" (actual within 50 mi: 383) | Corrected in hub intro and FAQ |
| "National HQ" and "Historic Site" polluting cultural stops | Excluded from `highlightTypes` |
| Specific noisy museum entries (memorials, statues) | Added to `SKIP_NAMES` filter |
| JSX whitespace collapse (missing spaces) | Added explicit `{' '}` in multiple components |
| Unicode escape sequences rendering literally | Replaced with actual characters |
| Ordinal suffixes ("82th" → "82nd") | Added `ordinal()` helper function |
| Redundant phrasing ("worthwhile museums worth") | Fixed |

---

## Performance

- No new npm dependencies.
- No client-side JS beyond existing Next.js hydration.
- Cluster pages reuse existing components (Hero, Breadcrumbs, Header, Footer, StaysCTA, StoreBanner).
- Recreation data filtered at build time in `getStaticProps`.
- Build time increase: negligible (7 additional static pages).

---

## Acceptance Criteria (All Met)

### Hub page
- [x] Intro section with internal links to cluster pages
- [x] Hub cards linking to all 7 cluster pages
- [x] FAQ section (10 Q&As) with FAQPage JSON-LD
- [x] Clean heading hierarchy (one H1, H2s with IDs)
- [x] All existing data tables and content preserved
- [x] Non-hub towns render identically to before

### Cluster pages
- [x] All 7 pages exist and render correctly
- [x] Each has: metadata, canonical, breadcrumbs, OG tags
- [x] Each has 800+ words of unique, data-grounded content
- [x] Each links to hub + 6 sibling pages via RelatedGuides
- [x] At-a-glance summary on each page
- [x] StaysCTA and StoreBanner on each page

### Technical
- [x] All 134 existing town URLs still work
- [x] Sitemap includes all 7 new URLs
- [x] Build succeeds with `output: 'export'`
- [x] No new npm dependencies

---

## Future Expansion

### Adding a new city (e.g., Bozeman)

1. Add `bozeman` entry to `clusterConfigs` in `cluster-data.ts`
   - `hubIntro`, `guides` array (7 entries), `faqs` array (8–10 entries)
2. Create topic components in `components/town/topics/` if city-specific
   narrative is needed, OR generalize existing Missoula components to
   accept `townName` and render town-agnostic content
3. Verify recreation data quality for the city (check for phantom entries)
4. Build. Done.

### Adding a new topic (e.g., "camping")

1. Add `{ topic: 'camping', ... }` to the guides array for each city
2. Create `components/town/topics/Camping.tsx`
3. Add the `case 'camping':` branch in `[topic].tsx`
4. Add any needed data filtering in `getStaticProps`
5. Build. Done.

### Generalizing topic components for multiple cities

The current topic components (CostOfLiving, Jobs, etc.) contain some
Missoula-specific references (e.g., "University of Montana", "Providence
St. Patrick Hospital"). To support multiple cities, either:
- Make components fully generic using only data props (preferred)
- Or create city-specific component variants

The data-driven parts (tables, stats, percentiles) already work for any
city. The narrative sections need review per city.
