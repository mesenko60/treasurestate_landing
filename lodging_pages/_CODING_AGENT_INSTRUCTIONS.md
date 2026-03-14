# Coding Agent Instructions — TreasureState.com Lodging Pages

## What These Files Are

This directory contains 28 Markdown files — one lodging page per Montana town, plus one hub index page. These are ready-to-publish content pages for the new `/lodging/` section of TreasureState.com.

## File Structure

```
lodging_pages/
├── index.md                  → Hub page at treasurestate.com/lodging/
├── billings.md               → treasurestate.com/lodging/billings/
├── missoula.md               → treasurestate.com/lodging/missoula/
├── bozeman.md                → treasurestate.com/lodging/bozeman/
├── ... (one file per town)
```

## URL Structure to Implement

Each file maps to a URL following this pattern:
- `index.md` → `treasurestate.com/lodging/`
- `[slug].md` → `treasurestate.com/lodging/[slug]/`

## Required Internal Links to Add

After publishing these pages, add the following internal links to existing pages:

### 1. Town pages (`/montana-towns/[slug]/`)
In the "Where to Stay in [Town]" section of each town page, add a link:
```
→ See our full [Where to Stay in [Town] guide](/lodging/[slug]/) for hotels, B&Bs, cabins, and vacation rentals.
```

### 2. Town sub-pages (cost-of-living, housing, jobs, etc.)
In the footer or sidebar of each town sub-page, add:
```
Planning a visit? See [Where to Stay in [Town]](/lodging/[slug]/).
```

### 3. Moving guides (`/guides/moving-to-[slug]-montana/`)
In the "Where to Stay / Short-Term Housing" section, add:
```
For visitor lodging while you scout the area, see our [Where to Stay in [Town] guide](/lodging/[slug]/).
```

### 4. Main navigation
Add "Lodging" as a nav item linking to `/lodging/` — or add it to the existing "Trip Planner" dropdown.

### 5. Homepage
Add a "Find Lodging" card or section linking to `/lodging/`.

## Affiliate Links

All affiliate links in these files already contain the correct tracked IDs:
- **Expedia:** `camref=1011l52GG6` (do not modify)
- **VRBO:** `camref=1011l52GGp` + `creativeref=1101l63118` (do not modify)
- The `adref=` parameter at the end of each link is a per-property tracking label for the affiliate dashboard

## SEO Metadata to Set Per Page

For each lodging page, set the following in your CMS/framework:

| Field | Value |
|---|---|
| `<title>` | `Where to Stay in [Town], Montana — Hotels, Cabins & B&Bs` |
| `meta description` | `Find the best hotels, B&Bs, cabins, and vacation rentals in [Town], Montana. Includes price ranges, traveler tips, and direct links to Expedia and VRBO.` |
| `og:title` | Same as `<title>` |
| `og:description` | Same as `meta description` |
| Canonical URL | `https://treasurestate.com/lodging/[slug]/` |
| Schema type | `LodgingBusiness` or `TouristAttraction` (WebPage is acceptable) |

## Sitemap

Add all new lodging URLs to your sitemap.xml and submit to Google Search Console after publishing.

## Priority Publishing Order

Publish in this order for maximum SEO impact (highest search volume first):
1. index.md (hub)
2. bozeman.md
3. missoula.md
4. whitefish.md
5. billings.md
6. kalispell.md
7. helena.md
8. big-sky.md
9. west-yellowstone.md
10. red-lodge.md
11. livingston.md
12. great-falls.md
13. hamilton.md
14. columbia-falls.md
15. polson.md
16. bigfork.md
17. butte.md
18. libby.md
19. choteau.md
20. three-forks.md
21. dillon.md
22. lewistown.md
23. deer-lodge.md
24. anaconda.md
25. hardin.md
26. miles-city.md
27. glendive.md
28. havre.md
