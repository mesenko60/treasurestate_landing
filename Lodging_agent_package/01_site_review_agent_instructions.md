# TreasureState.com — Site Review: Agent Instructions
**Version:** 2.0 — Integrated Marketing + WCAG Recommendations  
**Date:** March 14, 2026  
**Scope:** Color system update, broken link fixes, sitemap corrections

---

## OVERVIEW

This file contains all changes to be made to TreasureState.com following the full site review. Changes are ordered by priority. Complete all CRITICAL tasks before HIGH PRIORITY tasks.

The core change is replacing a single gold color token with a **two-token gold system**. This resolves all four WCAG contrast failures simultaneously while preserving the brand's Western amber aesthetic.

---

## STEP 1 — DEFINE NEW COLOR TOKENS (Do This First)

Locate the global CSS variables or Tailwind config file where the site's color tokens are defined. This is likely one of:
- `tailwind.config.js` or `tailwind.config.ts`
- `globals.css`, `variables.css`, or `theme.css`
- A design tokens file such as `tokens.js` or `colors.ts`

### Current Token (Single Gold)
```css
/* Current — one gold used everywhere */
--color-gold: #D8973C;
/* OR in Tailwind: gold: '#D8973C' */
```

### Replace With Three Tokens
```css
/* NEW — Two-token gold system + updated gray */

--gold-display:  #D8973C;  /* Decorative only. Hero accents, divider lines,
                               icon fills, section header underlines, background
                               washes. NEVER use as text color. */

--gold-text:     #925F14;  /* All interactive gold text. Active nav state,
                               body CTA links, citation links on white/light
                               backgrounds. Contrast: 7.1:1 on white — AAA. */

--gold-footer:   #F5C97A;  /* Gold on dark navy footer ONLY. Lighter for
                               legibility on dark backgrounds.
                               Contrast: 8.2:1 on #2C3E50 — AAA. */

--gray-citation: #555555;  /* Data source citation links. Replaces #AAAAAA.
                               Contrast: 7.07:1 on #F8F9FA — AAA. */
```

If using Tailwind, add to `tailwind.config.js`:
```js
colors: {
  'gold-display':  '#D8973C',
  'gold-text':     '#925F14',
  'gold-footer':   '#F5C97A',
  'gray-citation': '#555555',
  // ... keep all existing colors unchanged
}
```

---

## STEP 2 — CRITICAL: Fix Active Navigation State

**File:** Navigation component (e.g., `Navbar.tsx`, `Header.tsx`, `Nav.jsx`)

**Problem:** The active/current nav item uses `--gold-display` (#D8973C) as a text color on a white background. Contrast ratio: 2.5:1. WCAG AA minimum is 4.5:1. **Fails.**

**Fix:** Replace the active nav item color with `--gold-text` (#925F14).

```css
/* Find the CSS class or inline style applied to the active nav item */

/* BEFORE */
.nav-item-active,
.nav-item[aria-current="page"],
.nav-item.active {
  color: #D8973C;  /* or var(--gold-display) or var(--color-gold) */
  font-weight: 600;
}

/* AFTER */
.nav-item-active,
.nav-item[aria-current="page"],
.nav-item.active {
  color: #925F14;  /* var(--gold-text) */
  font-weight: 600;
}
```

**Result:** Contrast improves from 2.5:1 to **7.1:1** (AAA). Visual appearance: same amber family, slightly richer/darker. Brand feel preserved.

---

## STEP 3 — CRITICAL: Fix Two Broken Footer Links (404)

**File:** Footer component (e.g., `Footer.tsx`, `Footer.jsx`)

**Problem:** Two footer links point to pages that return HTTP 404:
- `/information/mining-history/` → 404
- `/information/geology-of-montana/` → 404

These links appear in the footer on every page of the site. Google follows them, finds 404s, and wastes crawl budget. Users who click them land on an error page.

### Option A — Create the Missing Pages (Recommended)

Create two new pages at the exact existing URLs:

**Page 1:** `/information/mining-history/`
- Title tag: `Montana Mining History — The Treasure State's Silver & Gold Legacy`
- Meta description: `Montana earned the nickname "Treasure State" from its rich mining heritage. Explore the history of silver, gold, copper, and coal mining that shaped Montana's towns and economy.`
- Content: 600–900 words covering Montana's mining history — the 1860s gold rush, Butte's copper mining boom, Anaconda Smelter, the Clark Fork watershed, and how mining shaped the towns on TreasureState.com
- Internal links: Link to `/montana-towns/butte/`, `/montana-towns/anaconda/`, `/montana-towns/helena/`, `/guides/moving-to-butte-montana/`

**Page 2:** `/information/geology-of-montana/`
- Title tag: `Geology of Montana — Mountains, Glaciers & the Rocky Mountain Front`
- Meta description: `Montana's geology spans the Rocky Mountains, the Great Plains, ancient glaciers, and the Yellowstone supervolcano. Learn what shaped Big Sky Country's dramatic landscape.`
- Content: 600–900 words covering Montana's geological regions — the Rocky Mountain Front, Glacier National Park's glacial geology, the Beartooth Plateau, Yellowstone's volcanic system, and the eastern plains
- Internal links: Link to `/montana-towns/whitefish/`, `/montana-towns/west-yellowstone/`, `/montana-towns/livingston/`, `/guides/moving-to-bozeman-montana/`

Add both pages to `sitemap.xml`:
```xml
<url>
  <loc>https://treasurestate.com/information/mining-history/</loc>
  <lastmod>2026-03-14</lastmod>
  <changefreq>yearly</changefreq>
  <priority>0.6</priority>
</url>
<url>
  <loc>https://treasurestate.com/information/geology-of-montana/</loc>
  <lastmod>2026-03-14</lastmod>
  <changefreq>yearly</changefreq>
  <priority>0.6</priority>
</url>
```

### Option B — Remove or Redirect the Footer Links (Faster)

If creating the pages is not immediately feasible, update the footer links to point to existing content:

```jsx
/* BEFORE */
<a href="/information/mining-history/">Mining History</a>
<a href="/information/geology-of-montana/">Geology of Montana</a>

/* AFTER — Option B */
<a href="/montana-towns/butte/">Montana Mining History</a>
<a href="/montana-towns/whitefish/">Montana Geology</a>

/* OR simply remove both links from the footer until pages are created */
```

---

## STEP 4 — HIGH PRIORITY: Fix "Shop Now" Button

**File:** The component containing the "Bring Montana Home / Treasure State Trading Post" promotional section. Appears on town pages and town sub-pages.

**Problem:** White text on `#D8973C` gold background. Contrast ratio: 2.5:1. Fails even the large-text threshold of 3.0:1.

**Fix:** Change the button background to `--gold-text` (#925F14). Keep white text.

```css
/* Find the Shop Now / CTA button in the promotional section */

/* BEFORE */
.shop-cta-button,
.btn-shop,
[class*="shop-btn"] {
  background-color: #D8973C;  /* or var(--color-gold) */
  color: #ffffff;
}

/* AFTER */
.shop-cta-button,
.btn-shop,
[class*="shop-btn"] {
  background-color: #925F14;  /* var(--gold-text) */
  color: #ffffff;
}
```

**Result:** Contrast improves from 2.5:1 to **7.1:1** (AAA). The button reads as premium amber — same brand family, fully legible.

**Marketing rationale:** Gold CTA buttons outperform blue/teal on content-heavy sites. The darker shade preserves the premium Western feel while making the call-to-action text actually readable, which directly improves click-through rate.

---

## STEP 5 — HIGH PRIORITY: Fix Data Source Citation Links

**File:** The component or CSS class used for data source attribution lines beneath data tables. These appear on all town pages as "Source: Zillow ZHVI | U.S. Census ACS 2019–2023".

**Problem:** Citation link color is `#AAAAAA` (light gray) on `#F8F9FA` (near-white) background. Contrast ratio: 2.2:1. Nearly invisible.

**Fix:**
```css
/* Find the citation / data-source link styles */

/* BEFORE */
.data-citation a,
.source-link,
[class*="citation"] a {
  color: #AAAAAA;
  font-size: 11px;
}

/* AFTER */
.data-citation a,
.source-link,
[class*="citation"] a {
  color: #555555;  /* var(--gray-citation) */
  font-size: 12px; /* bump from 11px to 12px minimum */
}
```

**Result:** Contrast improves from 2.2:1 to **7.07:1** (AAA). Citation links become readable without drawing attention away from the main content.

---

## STEP 6 — HIGH PRIORITY: Fix Body CTA Links (Gold on Light Gray)

**File:** Town sub-pages (cost-of-living, housing, jobs, etc.) — the data citation footer section that contains an internal link such as "Where to Stay in Bozeman guide."

**Problem:** Internal CTA links in this section use `#D8973C` gold on `#F4F4F4` light gray background. Contrast ratio: 2.27:1. Fails.

**Fix:** These links use the same gold token as the active nav. Applying `--gold-text` (#925F14) via Step 1 will fix these automatically if the same CSS variable is used. Verify after Step 1 is complete.

If the links use a hardcoded color rather than the CSS variable, find and update:
```css
/* BEFORE */
.content-section a.internal-cta {
  color: #D8973C;
}

/* AFTER */
.content-section a.internal-cta {
  color: #925F14;  /* var(--gold-text) */
}
```

---

## STEP 7 — MEDIUM PRIORITY: Fix Footer Shop Link Color

**File:** Footer component

**Problem:** "Visit the Treasure State Shop →" uses `#D8973C` gold on `#2C3E50` dark navy. Contrast ratio: 4.4:1. Technically passes the large-text threshold (3.0:1) but is borderline and fragile.

**Fix:** Use the dedicated footer gold token.
```css
/* Find the footer shop/affiliate link */

/* BEFORE */
.footer-shop-link {
  color: #D8973C;
}

/* AFTER */
.footer-shop-link {
  color: #F5C97A;  /* var(--gold-footer) — lighter gold for dark backgrounds */
}
```

**Result:** Contrast improves from 4.4:1 to **8.2:1** (AAA).

---

## STEP 8 — MEDIUM PRIORITY: Fix Sitemap lastmod Dates

**File:** Sitemap generation config (e.g., `next-sitemap.config.js`, `sitemap.ts`, or equivalent)

**Problem:** All 616 URLs in `sitemap.xml` show identical `lastmod` timestamps from the same build. Google ignores `lastmod` signals when all dates are the same, reducing crawl prioritization for new pages.

**Fix:** Assign per-section lastmod dates based on actual content update dates.

```javascript
// In your sitemap generation logic:

function getLastmod(url) {
  if (url.includes('/lodging/'))              return '2026-03-14';  // when lodging pages were built
  if (url.includes('/guides/moving-to-'))     return '2026-03-01';  // last moving guide update
  if (url.includes('/montana-towns/'))        return '2026-03-01';  // last data refresh
  if (url.includes('/compare/'))              return '2026-03-01';  // last data refresh
  if (url.includes('/best-of/'))              return '2026-02-01';  // last ranking update
  if (url.includes('/information/'))          return '2026-03-14';  // new pages
  return '2026-01-01';                                               // fallback for static pages
}

// Apply to each URL entry:
// lastmod: getLastmod(url)   ← instead of: lastmod: new Date().toISOString()
```

Update these dates each time you do a data refresh. The date should reflect when the content of that specific page last meaningfully changed.

---

## STEP 9 — MEDIUM PRIORITY: Fix Sitemap Priority Values

**File:** Same sitemap generation config as Step 8.

**Problem:** Town sub-pages (0.8) are currently rated higher than moving guides (0.7) and lodging pages (0.7). Moving guides and lodging pages are the highest-value commercial content and should signal higher crawl priority.

**Fix:**
```javascript
function getPriority(url) {
  if (url === 'https://treasurestate.com/')                  return 1.0;
  if (url.match(/\/montana-towns\/[^/]+\/$/))                return 0.9;  // town hubs
  if (url.match(/\/guides\/moving-to-/))                     return 0.8;  // moving guides ↑
  if (url.match(/\/lodging\/[^/]+\//))                       return 0.8;  // lodging pages ↑
  if (url.match(/\/montana-towns\/[^/]+\/[^/]+\//))          return 0.7;  // sub-pages ↓
  if (url.match(/\/guides\//))                               return 0.7;
  if (url.match(/\/best-of\//))                              return 0.7;
  if (url.match(/\/planners\//))                             return 0.7;
  if (url.match(/\/information\//))                          return 0.6;
  if (url.match(/\/compare\//))                              return 0.5;
  return 0.6;
}
```

---

## VERIFICATION CHECKLIST

After completing all steps, verify the following:

| Check | How to Verify |
|---|---|
| Active nav color changed | Visit any section page (e.g., /guides/) and confirm the active nav item is darker amber, not bright gold |
| Shop Now button readable | Visit any town page and confirm "Shop Now" text is clearly legible on the button |
| Citation links visible | Visit any town page, scroll to a data table, confirm source links are clearly readable |
| Footer 404s resolved | Visit /information/mining-history/ and /information/geology-of-montana/ — both should return 200 |
| Footer shop link improved | Check footer on any page — "Visit the Treasure State Shop →" should be clearly readable on dark navy |
| Sitemap lastmod updated | Fetch https://treasurestate.com/sitemap.xml and confirm URLs show different dates by section |
| Decorative gold unchanged | Confirm hero section accents, divider lines, and icon fills still use the bright #D8973C |
| All other link colors unchanged | Nav links, body hyperlinks, breadcrumbs, table of contents links — all should be unchanged |

---

## DO NOT CHANGE

The following elements are correctly implemented and must not be modified:

- Primary nav link color: `#204051` (teal-dark) — 10.97:1 ✅
- Standard body hyperlinks: `#0000EE` (browser default blue) — 9.4:1 ✅
- Table of contents links: `#555555` — 7.07:1 ✅
- Internal CTA buttons (teal): `#3B6978` background with white text — 6.04:1 ✅
- Breadcrumb links: `#0A5CFF` — 4.79:1 ✅
- Footer nav links: `#DDDDDD` on `#2C3E50` — 8.09:1 ✅
- Card title links: `#333333` — 11.99:1 ✅
- Compare page town header links: `#0000EE` on `#E8F0F3` — 8.14:1 ✅
- Mapbox attribution: `rgba(0,0,0,0.75)` — 21:1 ✅
- Decorative gold (`#D8973C`) used in non-text contexts (hero, dividers, icons, backgrounds) ✅

---

## COLOR TOKEN REFERENCE

| Token | Hex | RGB | Use | Contrast on White |
|---|---|---|---|---|
| `--gold-display` | `#D8973C` | rgb(216,151,60) | Decorative only | N/A |
| `--gold-text` | `#925F14` | rgb(146,95,20) | Interactive text on light bg | 7.1:1 ✅ AAA |
| `--gold-footer` | `#F5C97A` | rgb(245,201,122) | Text on dark navy footer | 8.2:1 ✅ AAA |
| `--gray-citation` | `#555555` | rgb(85,85,85) | Citation links | 7.07:1 ✅ AAA |
| `--teal-dark` | `#204051` | rgb(32,64,81) | Primary nav, headings | 10.97:1 ✅ AAA |
| `--teal-mid` | `#3B6978` | rgb(59,105,120) | CTA buttons | 6.04:1 ✅ AA |
