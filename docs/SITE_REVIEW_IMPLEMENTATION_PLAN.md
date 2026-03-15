# Site Review Implementation Plan

**Source:** `TreasureState.com — Site Review_ Agent Instructions.md` (v2.0, March 14, 2026)  
**Created:** March 14, 2026

---

## Summary

The site review identifies **4 WCAG contrast failures** (all involving gold `#D8973C`) plus **2 broken footer links** and **sitemap improvements**. The fix centers on a **two-token gold system** that resolves all contrast issues while preserving the Western amber brand.

---

## Verification: Footer Links (Step 3)

**Review doc says:** `/information/mining-history/` and `/information/geology-of-montana/` → 404

**Actual footer (`Footer.tsx`):**
- `/information/mining-history-of-montana/` ✅ (page exists)
- `/information/geology-of-western-montana/` ✅ (page exists)

**Conclusion:** Footer links appear correct. Verify in production that both URLs return 200. If the review was based on different URLs, add redirects in `netlify.toml` for `/information/mining-history/` → `/information/mining-history-of-montana/` and `/information/geology-of-montana/` → `/information/geology-of-western-montana/` for any external links.

---

## Implementation Order

### Phase 1: Color Tokens (CRITICAL — Do First)

| Step | Task | File(s) | Effort |
|------|------|---------|--------|
| **1** | Add new color tokens | `web/public/css/modern-style.css` | Small |
| **2** | Fix active nav color | `web/public/css/modern-style.css` | Small |

**Details:**
- **File:** `web/public/css/modern-style.css`
- **Current:** `:root { --secondary: #d8973c; ... }` (line 29)
- **Change:** Add `--gold-display`, `--gold-text`, `--gold-footer`, `--gray-citation`; keep `--secondary` for decorative use only
- **Nav:** `.menu-bar a.active` uses `color: var(--secondary)` (line 203) → change to `color: var(--gold-text)` or `#925F14`

---

### Phase 2: WCAG Fixes (CRITICAL / HIGH)

| Step | Task | File(s) | Effort |
|------|------|---------|--------|
| **3** | Fix footer 404s | Verify or add redirects | Small |
| **4** | Fix Shop Now button | `web/components/StoreBanner.tsx` | Small |
| **5** | Fix citation links | Multiple | Medium |
| **6** | Fix body CTA links | `web/pages/guides/[slug].tsx` + shared components | Small |
| **7** | Fix footer shop link | `web/components/Footer.tsx` | Small |

**Details:**
- **StoreBanner.tsx (line 28):** `background: '#d8973c'` → `#925F14`; update hover `#c68532` → darker variant of `#925F14`
- **Footer.tsx (line 15):** `color: '#d8973c'` → `#F5C97A`
- **Citation links:** `TownHousing.tsx` uses `color: '#aaa'` (lines 176, 238, 304, 306, 309, 314); Housing/CostOfLiving/Jobs components use `color: '#999'` for "Sources: Zillow ZHVI, U.S. Census ACS" — update both to `#555555`, bump font from 0.68–0.8rem to 0.72–0.85rem
- **Body CTA:** Moving guide "Where to Stay" link in `guides/[slug].tsx` (line 450) — check if it uses gold; if so, use `#925F14` or `#3b6978` (teal)

---

### Phase 3: Sitemap (MEDIUM)

| Step | Task | File(s) | Effort |
|------|------|---------|--------|
| **8** | Per-section lastmod | `web/scripts/generate-sitemap.js` | Medium |
| **9** | Priority values | `web/scripts/generate-sitemap.js` | Medium |

**Details:**
- **File:** `web/scripts/generate-sitemap.js`
- **Current:** `url()` uses `new Date().toISOString()` for all lastmod
- **Change:** Add `getLastmod(loc)` returning section-specific dates (lodging: 2026-03-14, guides: 2026-03-01, etc.)
- **Priority:** Add `getPriority(loc)` — moving guides and lodging → 0.8; town sub-pages → 0.7
- **Refactor:** `add()` must accept `loc` and compute priority/lastmod per URL

---

## Files to Modify

| File | Changes |
|------|---------|
| `web/public/css/modern-style.css` | New tokens, `.menu-bar a.active` color |
| `web/components/StoreBanner.tsx` | Shop Now button background |
| `web/components/Footer.tsx` | Shop link color |
| `web/components/TownHousing.tsx` | Citation link color `#aaa` → `#555555` |
| `web/scripts/generate-sitemap.js` | lastmod + priority logic |
| **Batch:** ~25 Housing/CostOfLiving/Jobs components | Citation `#999` → `#555555`, font bump |

---

## Files to Create (Optional — Step 3 Option A)

Only if footer links actually 404:
- `web/pages/Information/mining-history.tsx` → redirect or new content
- `web/pages/Information/geology-of-montana.tsx` → redirect or new content

**Recommendation:** Verify footer URLs in production first. Current footer uses `mining-history-of-montana` and `geology-of-western-montana`, which exist.

---

## Verification Checklist (Post-Implementation)

- [ ] Active nav: darker amber (#925F14), not bright gold
- [ ] Shop Now button: white text clearly legible
- [ ] Citation links: readable (e.g., Zillow ZHVI, Census ACS)
- [ ] Footer 404s: both info pages return 200
- [ ] Footer shop link: readable on dark navy
- [ ] Sitemap: different lastmod by section
- [ ] Decorative gold (#D8973C) unchanged in heroes, dividers, icons

---

## Do Not Change

Per review: primary nav `#204051`, body links `#0000EE`, TOC `#555555`, teal CTAs `#3B6978`, breadcrumbs `#0A5CFF`, footer nav `#DDDDDD`, card titles `#333333`, decorative gold in non-text contexts.
