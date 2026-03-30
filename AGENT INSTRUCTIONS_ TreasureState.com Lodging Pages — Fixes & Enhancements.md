# AGENT INSTRUCTIONS: TreasureState.com Lodging Pages — Fixes & Enhancements
**Site:** https://treasurestate.com  
**Section:** /lodging/ (28 pages: 1 hub + 27 town pages)  
**Execute tasks in the order listed. Do not skip steps.**

---

## CREDENTIALS & AFFILIATE IDs

- Expedia affiliate ID: `camref=1011l52GG6`
- VRBO affiliate ID: `camref=1011l52GGp` + `creativeref=1101l63118`
- All affiliate links must include `rel="sponsored noopener"`

---

## TASK 1 — CRITICAL: Replace Generic Expedia URLs with Property Deep Links
**Do this on all 27 town lodging pages.**

### Current (wrong) pattern:
Every Expedia link currently uses a generic city search URL:
```
https://www.expedia.com/Hotel-Search?destination=Bozeman%2C%20Montana%2C%20United%20States%20of%20America&sort=RECOMMEND&camref=1011l52GG6&adref=...
```

### Required (correct) pattern:
Each link must point to the specific property listing page using the Expedia hotel ID:
```
https://www.expedia.com/[City]-Hotels-[Property-Name].h[HOTEL_ID].Hotel-Information?camref=1011l52GG6&adref=[town]-[property-slug]
```

### How to find the Expedia hotel ID:
1. Go to expedia.com
2. Search for the property name + city (e.g., "Kimpton Armory Hotel Bozeman")
3. Open the property listing page
4. Copy the number after `.h` in the URL — that is the hotel ID
5. Example: `https://www.expedia.com/Bozeman-Hotels-Kimpton-Armory-Hotel.h22532097.Hotel-Information` → hotel ID is `22532097`

### adref naming convention:
- Body text link: `adref=[town]-[property-slug]` (e.g., `adref=bozeman-kimpton-armory`)
- Table link: `adref=[town]-[property-slug]-table` (e.g., `adref=bozeman-kimpton-armory-table`)

### Apply to every property on every page. Priority order:
1. /lodging/bozeman/ — 8 hotel properties + 1 B&B
2. /lodging/missoula/ — 8 hotel properties + 3 B&Bs
3. /lodging/whitefish/ — 3 B&Bs (hotels to be added in Task 3)
4. /lodging/billings/
5. /lodging/helena/
6. /lodging/kalispell/
7. /lodging/great-falls/
8. /lodging/big-sky/
9. /lodging/livingston/
10. /lodging/red-lodge/
11. All remaining town pages

### Do NOT change VRBO links — they are correctly implemented.

---

## TASK 2 — HIGH: Link Property Names in Quick Comparison Tables
**Do this at the same time as Task 1 — both require the same hotel ID lookup.**

### Current (wrong):
Property names in the Quick Comparison table are plain unlinked text:
```markdown
| Kimpton Armory Hotel | Boutique Hotel | Downtown | Couples, Luxury | $$$$ |
```

### Required (correct):
Wrap each property name in a link to its Expedia deep-link URL. Use the `-table` adref suffix:
```markdown
| [Kimpton Armory Hotel](https://www.expedia.com/Bozeman-Hotels-Kimpton-Armory-Hotel.h22532097.Hotel-Information?camref=1011l52GG6&adref=bozeman-kimpton-armory-table) | Boutique Hotel | Downtown | Couples, Luxury | $$$$ |
```

### Rules:
- Link destination is always the Expedia property page (same as body text link)
- Always use `rel="sponsored noopener"` on the anchor tag
- Do NOT link to any internal TreasureState.com page
- Apply to every property row in every Quick Comparison table on all 27 pages

---

## TASK 3 — HIGH: Add Missing Content to Whitefish and West Yellowstone

### /lodging/whitefish/ — Hotels & Motels section is empty. Add these three properties:

**The Lodge at Whitefish Lake**
- Location: On Whitefish Lake
- Best for: Couples, families seeking waterfront access
- Description: Full-service resort with marina, restaurant, and spa. Waterfront location with direct lake access and mountain views.
- Price range: $$$–$$$$
- Find Expedia hotel ID and deep-link using Task 1 pattern

**Grouse Mountain Lodge**
- Location: Near downtown Whitefish
- Best for: Families, ski travelers
- Description: Nordic ski trails on property, close to Whitefish Mountain Resort shuttle, year-round outdoor access.
- Price range: $$$
- Find Expedia hotel ID and deep-link using Task 1 pattern

**Hampton Inn & Suites Whitefish**
- Location: Near downtown Whitefish
- Best for: General travelers, business visitors
- Description: Reliable amenities, free breakfast, indoor pool. Convenient access to downtown and resort shuttle.
- Price range: $$–$$$
- Find Expedia hotel ID and deep-link using Task 1 pattern

Also update the Quick Comparison table on /lodging/whitefish/ — currently shows "(See text below for lodging options)". Replace with the three properties above plus the three existing B&Bs (Good Medicine Lodge, Garden Wall Inn, Haymoon Resort).

---

### /lodging/west-yellowstone/ — Hotels & Motels section is empty. Add these three properties:

**Gray Wolf Inn & Suites**
- Location: Heart of West Yellowstone
- Best for: Families, park visitors
- Description: Indoor pool, hot tub, close to the west entrance of Yellowstone National Park.
- Price range: $$–$$$
- Find Expedia hotel ID and deep-link using Task 1 pattern

**Holiday Inn West Yellowstone**
- Location: Near the park entrance
- Best for: General travelers
- Description: Full-service hotel with on-site restaurant, seasonal operation.
- Price range: $$–$$$
- Find Expedia hotel ID and deep-link using Task 1 pattern

**Yellowstone Park Hotel**
- Location: Steps from the west park entrance
- Best for: Park-first travelers
- Description: Seasonal operation (May–October). Walking distance to park entrance, shuttle access.
- Price range: $$
- Find Expedia hotel ID and deep-link using Task 1 pattern

Also update the Quick Comparison table on /lodging/west-yellowstone/ — currently shows "(See text below for lodging options)". Replace with the three new hotels above plus the existing West Yellowstone Bed and Breakfast.

---

## TASK 4 — HIGH: Add Lodging Page Links to All Town Pages
**This is a template-level change. If town pages are generated from a shared template, add once and it propagates to all 27 towns.**

### Location on town page:
Find the section with the ID `where-to-stay-in-[town]` on each town page (e.g., `where-to-stay-in-bozeman`). This section currently has a short intro paragraph and generic Expedia/VRBO buttons.

### What to add:
Immediately after the existing intro paragraph in the "Where to Stay" section, add this sentence using the town's name and slug:

```html
For a full breakdown of hotels, B&Bs, cabins, and vacation rentals — including current rates and booking tips — see our complete <a href="/lodging/[town-slug]/">Where to Stay in [Town]</a> guide.
```

### Slug reference — use these exact slugs:

| Town | Slug to use |
|---|---|
| Anaconda | anaconda-montana |
| Big Sky | big-sky |
| Bigfork | bigfork |
| Billings | billings |
| Bozeman | bozeman |
| Butte | butte |
| Choteau | choteau |
| Columbia Falls | columbia-falls |
| Deer Lodge | deer-lodge |
| Dillon | dillon |
| Glendive | glendive |
| Great Falls | great-falls |
| Hamilton | hamilton |
| Hardin | hardin |
| Havre | havre |
| Helena | helena |
| Kalispell | kalispell |
| Lewistown | lewistown |
| Libby | libby |
| Livingston | livingston |
| Miles City | miles-city |
| Missoula | missoula |
| Polson | polson |
| Red Lodge | red-lodge |
| Three Forks | three-forks |
| West Yellowstone | west-yellowstone |
| Whitefish | whitefish |

---

## TASK 5 — MEDIUM: Add Town Page Back-Links from Lodging Pages
**On each lodging page, add a direct link back to the town's main page.**

### Location on lodging page:
Find the "Moving to [Town]?" paragraph at the bottom of each lodging page. It currently reads:

```
If you are visiting to scout a potential relocation, read our full [Moving to [Town] Guide] for a detailed breakdown...
```

### What to add:
After the existing sentence, add:

```html
You can also read our full <a href="/montana-towns/[town-slug]/">[Town] town guide</a> for things to do, local history, and seasonal events.
```

Use the same slug table from Task 4. Note: Anaconda's town page slug is `anaconda-montana`, matching the lodging page slug.

---

## TASK 6 — MEDIUM: Fill Empty Quick Comparison Tables on Thin Pages

The following pages have Quick Comparison tables showing "(See text below for lodging options)" instead of actual property data. Research and populate the table for each:

- /lodging/choteau/
- /lodging/glendive/
- /lodging/hardin/
- /lodging/three-forks/

For each page, find 3–5 real properties from Expedia for that town and add them to the table with Type, Location, Best For, and Price Range columns. Apply Task 1 and Task 2 patterns (deep links + linked property names) at the same time.

---

## TASK 7 — LOW: Add Nearby Towns Cross-Links

At the bottom of each lodging page, before the affiliate disclosure line, add a "Also nearby:" section with 2–3 links to geographically adjacent lodging pages.

### Suggested pairings:

| Town Page | Add links to |
|---|---|
| /lodging/bozeman/ | /lodging/big-sky/, /lodging/livingston/, /lodging/three-forks/ |
| /lodging/missoula/ | /lodging/hamilton/, /lodging/polson/, /lodging/deer-lodge/ |
| /lodging/whitefish/ | /lodging/kalispell/, /lodging/columbia-falls/, /lodging/bigfork/ |
| /lodging/west-yellowstone/ | /lodging/livingston/, /lodging/bozeman/ |
| /lodging/helena/ | /lodging/butte/, /lodging/deer-lodge/, /lodging/three-forks/ |
| /lodging/billings/ | /lodging/hardin/, /lodging/miles-city/, /lodging/red-lodge/ |
| /lodging/kalispell/ | /lodging/whitefish/, /lodging/columbia-falls/, /lodging/bigfork/ |
| /lodging/livingston/ | /lodging/bozeman/, /lodging/west-yellowstone/ |
| /lodging/red-lodge/ | /lodging/billings/, /lodging/livingston/ |
| /lodging/hamilton/ | /lodging/missoula/, /lodging/dillon/ |

### Format:
```html
<p><strong>Also nearby:</strong> <a href="/lodging/big-sky/">Big Sky</a> · <a href="/lodging/livingston/">Livingston</a> · <a href="/lodging/three-forks/">Three Forks</a></p>
```

---

## TASK 8 — LOW: Update Meta Descriptions

Replace auto-generated meta descriptions with action-oriented versions using this pattern:

```
Find the best hotels, B&Bs, cabins, and vacation rentals in [Town], Montana. Compare properties, read booking tips, and check current rates on Expedia and VRBO.
```

Keep under 160 characters. Apply to all 27 town lodging pages.

---

## TASK 9 — ONE-TIME: Submit Sitemap to Google Search Console

1. Confirm `/lodging/` and all 27 sub-pages appear in `sitemap.xml`
2. Log into Google Search Console for treasurestate.com
3. Submit the sitemap if not already submitted
4. Use URL Inspection → Request Indexing for these 5 pages manually:
   - https://treasurestate.com/lodging/bozeman/
   - https://treasurestate.com/lodging/missoula/
   - https://treasurestate.com/lodging/whitefish/
   - https://treasurestate.com/lodging/billings/
   - https://treasurestate.com/lodging/helena/

---

## DO NOT CHANGE — These are confirmed correct

- All `camref` affiliate IDs on existing links
- All `adref` tracking labels on existing links (update only when replacing URLs in Tasks 1 & 2)
- Breadcrumb navigation on all pages
- Canonical URLs on all pages
- H1 tag format: "Where to Stay in [Town]"
- Title tag format: "Where to Stay in [Town], Montana — Hotels, Cabins & B&Bs | Treasure State"
- Hub page at /lodging/ — all 27 town links are correct
- Moving guide links on all pages
- Montana towns index link on all pages
- Compare tool links on all pages
- VRBO links (search destination format is correct for VRBO)
