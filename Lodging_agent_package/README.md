# TreasureState.com — Coding Agent Implementation Package

**Prepared:** March 2026  
**Site:** [TreasureState.com](https://treasurestate.com)  
**Purpose:** Complete implementation instructions and deep link reference data for the TreasureState.com lodging section and site-wide fixes.

---

## How to Use This Package

This package contains everything your coding agent needs to implement all outstanding improvements to TreasureState.com. Work through the tasks in the order listed below. Each task references a specific file in this package.

**Do not skip ahead.** Tasks 1 and 2 are foundational — they affect every lodging page. Tasks 3–5 build on top of them.

---

## Implementation Order

### TASK 1 — Apply Site-Wide Color, Contrast & Sitemap Fixes
**File:** `01_site_review_agent_instructions.md`  
**Priority:** Critical — fix before any other work  
**Estimated effort:** 2–3 hours

Fixes 4 WCAG contrast failures, 2 broken 404 footer links, sitemap lastmod dates, and sitemap priority values. All changes are CSS token-level or sitemap configuration — no content changes required.

The file contains exact CSS selectors, before/after code, and a verification checklist.

---

### TASK 2 — Apply Deep Links to All Lodging Pages
**Files:** `02_lodging_next_steps_agent.md` + `03_expedia_vrbo_deep_links_COMPLETE.json` + `03_expedia_vrbo_deep_links_COMPLETE.md`  
**Priority:** High — highest affiliate revenue impact  
**Estimated effort:** 4–6 hours (automated with JSON reference)

Replace all generic Expedia city-search buttons and unlinked property names with property-specific deep links. The JSON file contains the complete lookup table for all 292 properties across 31 towns — your agent should parse it directly to automate the replacement.

**Implementation rules from the JSON:**
- `status: "DEEP_LINK"` → Use `body_link_url` for the CTA button; use `table_link_url` for the property name anchor in the comparison table
- `status: "VRBO_DEEP_LINK"` → Use `vrbo_body_link` for the CTA; `vrbo_table_link` for the table anchor
- `status: "VRBO_SEARCH"` → Use `vrbo_body_link` as a "Browse rentals on VRBO" button
- `status: "NOT_ON_EXPEDIA"` → Keep existing generic Expedia city search or remove button
- `status: "NOT_ON_VRBO"` → Link to property's direct website or remove
- All affiliate links must include: `rel="sponsored noopener" target="_blank"`
- `adref_body` and `adref_table` values are pre-built — use them exactly as provided

---

### TASK 3 — Fix Town Pages → Lodging Page Cross-Links
**File:** `02_lodging_next_steps_agent.md` (Task 4 within that file)  
**Priority:** High — internal link equity and traffic routing  
**Estimated effort:** 30 minutes (template-level change)

Add a link to the corresponding `/lodging/[town]/` page in the "Where to Stay" section of every town page at `/montana-towns/[town]/`. This is a single template change that propagates to all 27 towns automatically. The full URL mapping table is in `02_lodging_next_steps_agent.md`.

---

### TASK 4 — Fix Whitefish and West Yellowstone Empty Sections
**File:** `02_lodging_next_steps_agent.md` (Task 5 within that file)  
**Priority:** Medium  
**Estimated effort:** 1 hour

Two lodging pages have empty "Hotels & Motels" sections — the heading exists but no content. Property names, descriptions, and affiliate links are provided in the instructions file.

---

### TASK 5 — Add JSON-LD Schema to All Lodging Pages
**File:** `02_lodging_next_steps_agent.md` (Task 8 within that file)  
**Priority:** Medium — structured data for Google  
**Estimated effort:** 1–2 hours (template-level)

No lodging page currently has structured data. A copy-paste JSON-LD schema template is provided. This is a template-level addition that propagates to all pages automatically.

---

### TASK 6 — Submit Priority Pages to Google Search Console
**File:** `02_lodging_next_steps_agent.md` (Task 10 within that file)  
**Priority:** High — do this immediately after Tasks 1–5 are deployed  
**Estimated effort:** 15 minutes

A prioritized list of 11 URLs to manually request indexing for is provided. Do this as soon as the above changes are live.

---

## File Reference

| File | Contents | Used In |
|---|---|---|
| `README.md` | This file — implementation guide | — |
| `01_site_review_agent_instructions.md` | Color/contrast fixes, broken links, sitemap | Task 1 |
| `02_lodging_next_steps_agent.md` | Lodging page fixes, cross-links, schema, GSC | Tasks 2–6 |
| `03_expedia_vrbo_deep_links_COMPLETE.json` | Machine-readable deep link lookup (292 properties) | Task 2 |
| `03_expedia_vrbo_deep_links_COMPLETE.md` | Human-readable deep link reference (same data) | Task 2 |
| `04_color_mockup_v2.html` | Visual before/after mock-up for color changes | Task 1 reference |
| `05_lodging_audit_report.md` | Full audit narrative with reasoning | Background reference |

---

## Affiliate ID Reference

| Program | Affiliate ID |
|---|---|
| Expedia | `camref=1011l52GG6` |
| VRBO (ID 1) | `camref=1011l52GGp` |
| VRBO (ID 2) | `creativeref=1101l63118` |

These IDs are already embedded in every URL in `03_expedia_vrbo_deep_links_COMPLETE.json`. Do not modify them.

---

## Do Not Change

- Any existing page content not referenced in the instruction files
- Any affiliate links that already contain a hotel ID (e.g., `.h12345678.`)
- The sitemap URL list — only update `lastmod` dates and `priority` values
- The robots.txt file

---

## Verification Checklist

After completing all tasks, verify the following before submitting to Google Search Console:

- [ ] Active nav color passes WCAG AA (≥ 4.5:1) — use browser DevTools color picker
- [ ] "Mining History" and "Geology of Montana" footer links resolve without 404
- [ ] Shop Now button text is legible on its background
- [ ] At least 5 lodging pages have property name links in their comparison tables
- [ ] At least 5 town pages link to their `/lodging/[town]/` page
- [ ] Sitemap `lastmod` dates reflect actual last-modified dates (not all identical)
- [ ] JSON-LD schema present on at least one lodging page (verify with Google Rich Results Test)
