# TreasureState.com Lodging Pages — Live Audit Report
**Prepared for:** Coding Agent  
**Audit Date:** March 14, 2026  
**Pages Audited:** 27 town lodging pages + 1 hub index page (28 total)  
**Audit Method:** Live browser crawl, DOM inspection, console-level link and metadata extraction

---

## Executive Summary

The lodging section implementation is **structurally sound** with no broken pages, no missing affiliate IDs, and clean breadcrumb navigation throughout. However, the audit identified **four real issues** ranging from critical to low priority, plus **six content and SEO enhancement opportunities** that will materially improve rankings and affiliate conversion rates. Every issue is described below with exact fix instructions.

---

## Section 1: Errors and Issues (Fix These First)

### Issue 1 — CRITICAL: Affiliate Links Are Generic Search URLs, Not Property-Specific Deep Links

**Severity:** Critical — directly impacts affiliate revenue  
**Affects:** All 27 town pages  
**What was found:**

Every Expedia link on every lodging page currently resolves to the same generic hotel search URL:

```
https://www.expedia.com/Hotel-Search?destination=Bozeman%2C%20Montana%2C%20United%20States%20of%20America&sort=RECOMMEND
```

This means that every "Check current rates on Expedia" link — whether it appears next to the Kimpton Armory Hotel or the Gallatin River Lodge — sends the user to the same generic Bozeman hotel search results page. The user must then search again for the specific property. This creates unnecessary friction and significantly reduces conversion rates.

**What it should be:**

Each property link should deep-link directly to that property's Expedia listing page. The correct format is:

```
https://www.expedia.com/[City]-Hotels-[Property-Name].h[HOTEL_ID].Hotel-Information?camref=1011l52GG6&adref=[property-slug]
```

The Expedia hotel ID (`h[NUMBER]`) is found by navigating to the property on Expedia and copying the number from the URL. For example, the Kimpton Armory Hotel Bozeman is:

```
https://www.expedia.com/Bozeman-Hotels-Kimpton-Armory-Hotel.h22532097.Hotel-Information?camref=1011l52GG6&adref=kimpton-armory-bozeman
```

**Fix instructions for the coding agent:**

For each property on each lodging page, the agent must:
1. Navigate to `expedia.com` and search for the property name + city
2. Open the property listing page
3. Copy the hotel ID number from the URL (the `h[NUMBER]` portion)
4. Replace the generic search URL with the deep-link URL using that hotel ID
5. Append `?camref=1011l52GG6&adref=[town]-[property-slug]`

**Priority towns to fix first** (highest search volume):
1. Bozeman — 8 hotel links to update
2. Missoula — 8 hotel links to update
3. Whitefish — 3 hotel links to update
4. Billings — check and update
5. Helena — check and update

**Note on VRBO links:** VRBO does not support individual property deep links through the affiliate program in the same way. The current VRBO search destination links are acceptable and correctly include the `camref` and `creativeref` parameters. No change needed for VRBO.

---

### Issue 2 — HIGH: Town Pages Do Not Link to Their Corresponding Lodging Pages

**Severity:** High — missing internal link equity and user journey pathway  
**Affects:** All 27 town pages (e.g., `/montana-towns/bozeman/`)  
**What was found:**

Every town page has a "Where to Stay in [Town]" section with a brief lodging overview and generic Expedia/VRBO buttons. However, **none of the town pages contain a link to the corresponding dedicated lodging page** (`/lodging/bozeman/`, `/lodging/missoula/`, etc.).

This means:
- The lodging pages receive zero internal link equity from the town pages — the highest-traffic pages on the site
- Users reading the town page "Where to Stay" section have no pathway to the richer lodging content
- Google cannot follow a logical content hierarchy from town page → lodging page

**Fix instructions for the coding agent:**

In the "Where to Stay in [Town]" section of every town page, add a contextual call-to-action link immediately after the existing intro paragraph. The link text and destination should follow this pattern:

```
For a full breakdown of hotels, B&Bs, cabins, and vacation rentals — including current rates and booking tips — see our complete <a href="/lodging/[town-slug]/">Where to Stay in [Town]</a> guide.
```

**Special case — Anaconda:** The Anaconda town page is at `/montana-towns/anaconda-montana/` and the lodging page is at `/lodging/anaconda-montana/`. Use the `-montana` suffix in the link.

This is a **template-level change** — if the town pages are generated from a template or CMS, this link can be added once to the template using the town's slug variable, and it will propagate to all 27 town pages automatically.

---

### Issue 3 — MEDIUM: Whitefish and West Yellowstone Hotel Sections Are Empty

**Severity:** Medium — thin content, poor user experience, SEO risk  
**Affects:** `/lodging/whitefish/` and `/lodging/west-yellowstone/`  
**What was found:**

Both pages have a `## Hotels & Motels` section heading with no content beneath it. The section exists but is completely empty. Users and Googlebot encounter a heading followed by nothing before the next section.

**Whitefish Hotels & Motels section is empty.** The page only has content in the B&Bs and Cabins sections.

**West Yellowstone Hotels & Motels section is empty.** The page only has one B&B and the Cabins section.

**Fix instructions for the coding agent:**

**Whitefish** — Add the following properties to the Hotels & Motels section:

- **The Lodge at Whitefish Lake** — Located on Whitefish Lake, best for couples and families seeking waterfront access. Full-service resort with marina, restaurant, and spa. Nightly rates typically $$$–$$$$. Link to Expedia property page.
- **Grouse Mountain Lodge** — Located near downtown Whitefish, best for families and ski travelers. Nordic ski trails on property, close to Whitefish Mountain Resort shuttle. Nightly rates typically $$$. Link to Expedia property page.
- **Hampton Inn & Suites Whitefish** — Located near downtown, best for general travelers and business visitors. Reliable amenities, free breakfast, indoor pool. Nightly rates typically $$–$$$. Link to Expedia property page.

**West Yellowstone** — Add the following properties to the Hotels & Motels section:

- **Gray Wolf Inn & Suites** — Located in the heart of West Yellowstone, best for families and park visitors. Indoor pool, hot tub, close to park entrance. Nightly rates typically $$–$$$. Link to Expedia property page.
- **Holiday Inn West Yellowstone** — Located near the park entrance, best for general travelers. Full-service hotel with restaurant. Nightly rates typically $$–$$$. Link to Expedia property page.
- **Yellowstone Park Hotel** — Located steps from the west park entrance, best for park-first travelers. Seasonal operation (May–October). Nightly rates typically $$. Link to Expedia property page.

Also update the Quick Comparison table on both pages to include these properties — currently both tables show only "(See text below for lodging options)" which is not useful to readers or search engines.

---

### Issue 4 — LOW: Missing Schema Markup on Lodging Pages

**Severity:** Low — missed ranking opportunity  
**Affects:** All 27 town lodging pages  
**What was found:**

The lodging pages currently implement four schema types: `Organization`, `WebSite`, `WebPage`, and `BreadcrumbList`. These are the same schemas used across the rest of the site. However, lodging pages are a natural fit for two additional schema types that Google uses to generate rich results:

1. **`LodgingBusiness` schema** — for each individual hotel or B&B mentioned on the page
2. **`ItemList` schema** — for the Quick Comparison table, marking it as a structured list of lodging options

**Fix instructions for the coding agent:**

Add a `LodgingBusiness` JSON-LD block for the top 3 properties on each page. Example for the Kimpton Armory Hotel on the Bozeman page:

```json
{
  "@context": "https://schema.org",
  "@type": "LodgingBusiness",
  "name": "Kimpton Armory Hotel",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "24 W Mendenhall St",
    "addressLocality": "Bozeman",
    "addressRegion": "MT",
    "postalCode": "59715"
  },
  "priceRange": "$$$$",
  "url": "https://www.expedia.com/Bozeman-Hotels-Kimpton-Armory-Hotel.h22532097.Hotel-Information"
}
```

Add an `ItemList` schema block referencing the properties in the Quick Comparison table. This enables Google to display the list as a rich result in search.

---

## Section 2: Enhancement Opportunities (Do These After Fixes)

### Enhancement 1 — Add a Link Back to the Town Page from Each Lodging Page

Currently, the lodging pages link to the Moving Guide and the Montana towns index, but **not directly to the town's main page** (`/montana-towns/bozeman/`). Adding a direct link creates a bidirectional relationship between the town page and lodging page, strengthening the topical cluster.

**Suggested placement:** In the "Moving to [Town]?" footer section, add:

```
You can also read our full <a href="/montana-towns/[town-slug]/">[Town] town guide</a> for things to do, local history, and seasonal events.
```

---

### Enhancement 2 — Expand the Quick Comparison Table on Thin Pages

Several pages — including Whitefish, West Yellowstone, Choteau, Glendive, Hardin, and Three Forks — have Quick Comparison tables showing only "(See text below for lodging options)" because the research data did not populate the table fields. These should be filled in with actual property data to match the quality of the Bozeman, Missoula, Anaconda, and Billings pages.

---

### Enhancement 3 — Add Seasonal Booking Callout Boxes

The "What to Know Before You Book" section on every page contains valuable seasonal pricing information (e.g., "book 6–12 months in advance for West Yellowstone in summer"). This content would perform significantly better as a visually distinct callout box or highlighted tip rather than plain paragraph text. Users scanning the page for booking advice will see it immediately, increasing time-on-page and reducing bounce rate.

**Suggested implementation:** Wrap the seasonal tip in a styled `<div class="booking-tip">` or equivalent component already used elsewhere on the site (e.g., the callout style used in the moving guides).

---

### Enhancement 4 — Add "Nearby Towns" Cross-Links at the Bottom of Each Page

Travelers researching lodging in one town often consider nearby alternatives. Adding a "Also considering nearby towns?" section at the bottom of each lodging page with 2–3 links to geographically adjacent lodging pages will increase pages-per-session and pass internal link equity laterally across the lodging section.

**Suggested pairings:**
- Bozeman → Big Sky, Livingston, Three Forks
- Missoula → Hamilton, Polson, Deer Lodge
- Whitefish → Kalispell, Columbia Falls, Bigfork
- West Yellowstone → Livingston, Bozeman
- Helena → Butte, Deer Lodge, Three Forks
- Billings → Hardin, Miles City, Red Lodge

---

### Enhancement 5 — Add the Lodging Hub to the Sitemap and Submit to Google Search Console

Confirm that `/lodging/` and all 27 sub-pages are included in `sitemap.xml`. If the sitemap is auto-generated from the site's routing, verify that the lodging routes are included. Then submit the sitemap to Google Search Console and use the URL Inspection tool to manually request indexing for the top 5 pages (Bozeman, Missoula, Whitefish, Billings, Helena).

---

### Enhancement 6 — Link Property Names in the Quick Comparison Tables

**Affects:** All 27 town lodging pages  
**What to change:**

Currently, property names in the Quick Comparison tables are plain text. Every property name in every table should be converted to a hyperlink pointing directly to that property's Expedia listing page (the same deep-link URL used in the body text description below).

This change should be implemented **in conjunction with Issue 1** (replacing generic Expedia search URLs with property-specific deep links), since both fixes require the same Expedia hotel ID lookup. Do both at the same time to avoid duplicating the research effort.

**Why this matters:**

Users scanning comparison tables instinctively try to click property names. A non-clickable name is a dead end that increases bounce rate. Linking the name directly to the Expedia listing page captures affiliate clicks from table scanners who never read the body text below — effectively doubling the click surface area per property without adding any new content.

**Implementation pattern:**

In the Markdown or HTML source for each table row, wrap the property name in an anchor tag pointing to the Expedia deep-link URL. Use `rel="sponsored noopener"` on all affiliate links per Google's link attribute guidelines:

```markdown
| [Kimpton Armory Hotel](https://www.expedia.com/Bozeman-Hotels-Kimpton-Armory-Hotel.h22532097.Hotel-Information?camref=1011l52GG6&adref=kimpton-armory-bozeman-table) | Boutique Hotel | Downtown | Couples, Luxury | $$$$ |
```

Note the `adref` label uses a `-table` suffix (e.g., `adref=kimpton-armory-bozeman-table`) to distinguish table clicks from body text clicks in your Expedia affiliate dashboard. This lets you measure exactly how much revenue the table links generate vs. the inline body text links.

**Do not** link property names to internal TreasureState.com pages unless individual property profile pages are built in the future. The correct destination is always the Expedia property listing page.

---

### Enhancement 7 — Meta Description Quality on Several Pages

The meta descriptions on Missoula and several other pages are currently auto-generated from the first paragraph of the page intro. While technically correct (160 characters, no truncation), they read as descriptive rather than action-oriented. A stronger meta description pattern for lodging pages is:

```
Find the best hotels, B&Bs, cabins, and vacation rentals in [Town], Montana. Compare properties, read booking tips, and check current rates on Expedia and VRBO.
```

This pattern targets the query intent ("find hotels in [Town] Montana") and includes a clear call to action. It should be applied to all 27 pages.

---

## Section 3: What Is Working Well (Do Not Change)

The following elements are correctly implemented and should not be modified:

| Element | Status | Notes |
|---|---|---|
| Affiliate camref IDs | Correct | `camref=1011l52GG6` on all Expedia links; `camref=1011l52GGp` + `creativeref=1101l63118` on all VRBO links |
| adref tracking labels | Correct | All 12–14 affiliate links per page have unique `adref=` labels |
| Breadcrumb navigation | Correct | Home > Lodging > Where to Stay in [Town] on all pages |
| Canonical URLs | Correct | All pages self-canonical |
| H1 tags | Correct | "Where to Stay in [Town]" on all pages |
| Title tag format | Correct | "Where to Stay in [Town], Montana — Hotels, Cabins & B&Bs \| Treasure State" |
| Hub page links | Correct | All 27 town slugs in the hub table resolve to live pages (Anaconda correctly uses `/anaconda-montana/`) |
| Moving guide links | Correct | All 27 pages link to the correct `/guides/moving-to-[town]-montana/` URL |
| Montana towns index link | Correct | All pages link to `/montana-towns/` |
| Compare tool link | Correct | All pages link to the compare tool with correct town parameter |
| Zero broken links | Confirmed | No 404s, no empty hrefs, no `href="#"` placeholders |
| Zero orphaned pages | Confirmed | All 27 pages are linked from the hub |
| Page load | Confirmed | All 27 pages return HTTP 200 |

---

## Section 4: Prioritized Fix Order

| Priority | Issue | Effort | Impact |
|---|---|---|---|
| 1 | Deep-link Expedia affiliate URLs (Issue 1) | High (manual per property) | Critical — direct revenue |
| 2 | Add lodging page links to town pages (Issue 2) | Low (template change) | High — internal linking + user flow |
| 3 | Fill empty Hotels sections on Whitefish + West Yellowstone (Issue 3) | Low | Medium — content quality |
| 4 | Add town page back-links from lodging pages (Enhancement 1) | Low | Medium — bidirectional linking |
| 5 | Fill Quick Comparison tables on thin pages (Enhancement 2) | Medium | Medium — content quality |
| 6 | Link property names in comparison tables (Enhancement 6) | High (do alongside Issue 1) | High — doubles affiliate click surface |
| 7 | Add LodgingBusiness schema (Issue 4) | Medium | Low-Medium — rich results |
| 8 | Add seasonal callout boxes (Enhancement 3) | Low | Low-Medium — UX |
| 9 | Add nearby towns cross-links (Enhancement 4) | Low | Low-Medium — internal linking |
| 10 | Update meta descriptions (Enhancement 7) | Low | Low-Medium — CTR |
| 11 | Submit lodging sitemap to GSC (Enhancement 5) | Very Low | High (one-time, do immediately) |

---

## Appendix: Full Page Inventory

| Town | URL | Status | Hotels Section | Table Populated | Affiliate Links |
|---|---|---|---|---|---|
| Anaconda | /lodging/anaconda-montana/ | Live | Yes | Yes (6 properties) | camref present |
| Big Sky | /lodging/big-sky/ | Live | Yes | Yes | camref present |
| Bigfork | /lodging/bigfork/ | Live | Yes | Yes | camref present |
| Billings | /lodging/billings/ | Live | Yes | Yes | camref present |
| Bozeman | /lodging/bozeman/ | Live | Yes | Yes (8 properties) | camref present |
| Butte | /lodging/butte/ | Live | Yes | Yes | camref present |
| Choteau | /lodging/choteau/ | Live | Yes | Partial | camref present |
| Columbia Falls | /lodging/columbia-falls/ | Live | Yes | Yes | camref present |
| Deer Lodge | /lodging/deer-lodge/ | Live | Yes | Yes | camref present |
| Dillon | /lodging/dillon/ | Live | Yes | Yes | camref present |
| Glendive | /lodging/glendive/ | Live | Yes | Partial | camref present |
| Great Falls | /lodging/great-falls/ | Live | Yes | Yes | camref present |
| Hamilton | /lodging/hamilton/ | Live | Yes | Yes | camref present |
| Hardin | /lodging/hardin/ | Live | Yes | Partial | camref present |
| Havre | /lodging/havre/ | Live | Yes | Yes | camref present |
| Helena | /lodging/helena/ | Live | Yes | Yes | camref present |
| Kalispell | /lodging/kalispell/ | Live | Yes | Yes | camref present |
| Lewistown | /lodging/lewistown/ | Live | Yes | Yes | camref present |
| Libby | /lodging/libby/ | Live | Yes | Yes | camref present |
| Livingston | /lodging/livingston/ | Live | Yes | Yes | camref present |
| Miles City | /lodging/miles-city/ | Live | Yes | Yes | camref present |
| Missoula | /lodging/missoula/ | Live | Yes | Yes (8 properties) | camref present |
| Polson | /lodging/polson/ | Live | Yes | Yes | camref present |
| Red Lodge | /lodging/red-lodge/ | Live | Yes | Yes | camref present |
| Three Forks | /lodging/three-forks/ | Live | Yes | Partial | camref present |
| West Yellowstone | /lodging/west-yellowstone/ | Live | **Empty** | No | camref present |
| Whitefish | /lodging/whitefish/ | Live | **Empty** | No | camref present |
| Hub Index | /lodging/ | Live | N/A | All 27 linked | N/A |
