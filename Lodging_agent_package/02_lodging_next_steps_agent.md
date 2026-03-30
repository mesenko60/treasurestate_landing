# TreasureState.com — Lodging Section: Next Steps
## Coding Agent Instructions · March 29, 2026

---

## Current State Summary

The lodging section is live with 27 town pages plus a hub at `/lodging/`. The foundation is solid. This document defines every remaining improvement, ordered by priority and impact. Complete tasks in the order listed.

**Affiliate IDs (do not change these):**
- Expedia: `camref=1011l52GG6`
- VRBO: `camref=1011l52GGp` + `creativeref=1101l63118`

---

## TASK 1 — Fix Generic Expedia Search Links (CRITICAL · Do First)

**Problem:** Several properties across multiple town pages link to a generic Expedia city search (`/Hotel-Search?destination=...`) instead of the specific property listing page. These links do not earn commission on the correct property and create a poor user experience. Confirmed on Bozeman page:

- `Gallatin River Lodge` → generic search URL (no hotel ID)
- `Rainbow Ranch Lodge` → generic search URL (no hotel ID)

**How to fix:** For each property with a generic search URL, find the correct Expedia hotel ID using this method:

1. Go to `https://www.expedia.com`
2. Search for the property name + city
3. Click the property listing page
4. The URL will contain the hotel ID in this format: `.h[NUMBER].Hotel-Information`
5. Replace the generic search URL with the property-specific URL, keeping the affiliate parameters

**Correct URL format:**
```
https://www.expedia.com/[City]-Hotels-[Property-Name].h[HOTEL_ID].Hotel-Information?camref=1011l52GG6&adref=[town]-[property-slug]-table
```

**Properties confirmed needing this fix on Bozeman page:**

| Property | Current URL | Action |
|---|---|---|
| Gallatin River Lodge | `/Hotel-Search?destination=Bozeman...` | Find hotel ID, replace with deep link |
| Rainbow Ranch Lodge | `/Hotel-Search?destination=Bozeman...` | Find hotel ID, replace with deep link |

**After fixing Bozeman, audit every other town page for the same pattern.** Any Expedia link containing `/Hotel-Search?destination=` must be replaced with a property-specific deep link.

---

## TASK 2 — Fix Missing Property Name Links in Comparison Tables (HIGH PRIORITY)

**Problem:** On the Missoula page (and likely others), several properties in the Quick Comparison table have **no link at all** on the property name. The property name should always be a linked Expedia deep link. Confirmed missing links on Missoula table:

- Staybridge Suites Missoula — no link
- Super 8 by Wyndham Missoula/Reserve St. — no link
- Days Inn and Suites by Wyndham Downtown Missoula-University — no link
- Loge Camps Missoula — no link
- Courtyard Missoula — no link
- Holiday Inn Express & Suites Northwest — no link

**Rule:** Every property name in every Quick Comparison table on every lodging page must be a linked Expedia deep link with the affiliate ID and an `adref` label ending in `-table`.

**Correct table row format:**
```markdown
| [Property Name](https://www.expedia.com/[City]-Hotels-[Name].h[ID].Hotel-Information?camref=1011l52GG6&adref=[town]-[slug]-table) | Type | Location | Best For | Price Range |
```

**Action:** Audit all 27 town lodging pages. For every property name in a Quick Comparison table that is either unlinked or points to a generic search URL, find the Expedia hotel ID and add the correct deep link.

---

## TASK 3 — Fix Missoula Intro Paragraph (MEDIUM PRIORITY)

**Problem:** The Missoula lodging page intro paragraph reads like raw notes rather than polished editorial copy. Compare:

**Current (Missoula):**
> "Downtown Missoula is highlighted as the best area for walkability and access to local attractions, museums, and art. The University District is also mentioned as an academic enclave."

**Target quality (Bozeman):**
> "Bozeman's lodging is primarily concentrated in the downtown area, offering convenient access to restaurants, shops, and local attractions. The town serves as a popular basecamp for exploring Yellowstone National Park..."

**Action:** Rewrite the Missoula intro paragraph in the same confident, editorial voice as Bozeman. Use this replacement:

> Missoula sits at the confluence of five valleys and three rivers, making it Montana's most walkable and culturally rich city. Lodging is concentrated in two main areas: **Downtown**, where boutique hotels and historic inns put you steps from the Clark Fork Riverfront Trail, the University of Montana campus, and the city's acclaimed restaurant scene; and the **Grant Creek / Reserve Street corridor**, where national chain hotels offer easy freeway access and free parking. Missoula is also a natural basecamp for day trips into the Rattlesnake Wilderness, the Bitterroot Valley, and Glacier Country to the north.

---

## TASK 4 — Add Missing Town Page → Lodging Page Links (HIGH PRIORITY)

**Problem:** None of the 27 Montana town pages (`/montana-towns/[town]/`) currently link to their corresponding lodging page. This means the highest-traffic pages on the site are not passing link equity or user traffic to the lodging section.

**Action:** On every town page, in the **"Where to Stay"** section (which currently contains only Expedia and VRBO affiliate buttons), add a sentence with an internal link to the dedicated lodging page. Place it immediately before the existing affiliate buttons.

**Template to add (replace `[TOWN]` and `[town-slug]` with the correct values):**

```
For a full breakdown of the best hotels, B&Bs, cabins, and vacation rentals in [TOWN], 
see our <a href="/lodging/[town-slug]/">complete [TOWN] lodging guide</a>.
```

**All 27 town → lodging page mappings:**

| Town Page | Lodging Page |
|---|---|
| `/montana-towns/anaconda/` | `/lodging/anaconda-montana/` |
| `/montana-towns/big-sky/` | `/lodging/big-sky/` |
| `/montana-towns/bigfork/` | `/lodging/bigfork/` |
| `/montana-towns/billings/` | `/lodging/billings/` |
| `/montana-towns/bozeman/` | `/lodging/bozeman/` |
| `/montana-towns/butte/` | `/lodging/butte/` |
| `/montana-towns/choteau/` | `/lodging/choteau-montana/` |
| `/montana-towns/columbia-falls/` | `/lodging/columbia-falls/` |
| `/montana-towns/deer-lodge/` | `/lodging/deer-lodge/` |
| `/montana-towns/dillon/` | `/lodging/dillon-montana/` |
| `/montana-towns/glendive/` | `/lodging/glendive/` |
| `/montana-towns/great-falls/` | `/lodging/great-falls/` |
| `/montana-towns/hamilton/` | `/lodging/hamilton-montana/` |
| `/montana-towns/hardin/` | `/lodging/hardin-montana/` |
| `/montana-towns/havre/` | `/lodging/havre/` |
| `/montana-towns/helena/` | `/lodging/helena/` |
| `/montana-towns/kalispell/` | `/lodging/kalispell/` |
| `/montana-towns/lewistown/` | `/lodging/lewistown/` |
| `/montana-towns/libby/` | `/lodging/libby-montana/` |
| `/montana-towns/livingston/` | `/lodging/livingston-montana/` |
| `/montana-towns/miles-city/` | `/lodging/miles-city/` |
| `/montana-towns/missoula/` | `/lodging/missoula/` |
| `/montana-towns/polson/` | `/lodging/polson/` |
| `/montana-towns/red-lodge/` | `/lodging/red-lodge/` |
| `/montana-towns/three-forks/` | `/lodging/three-forks-montana/` |
| `/montana-towns/west-yellowstone/` | `/lodging/west-yellowstone/` |
| `/montana-towns/whitefish/` | `/lodging/whitefish/` |

---

## TASK 5 — Fix Anaconda Slug Inconsistency (MEDIUM PRIORITY)

**Problem:** The lodging hub table links to `/lodging/anaconda/` but the actual page lives at `/lodging/anaconda-montana/`. This causes a 404 from the hub for Anaconda.

**Action:** In the lodging hub page (`/lodging/`), update the Anaconda table row link from `/lodging/anaconda/` to `/lodging/anaconda-montana/`. Also verify the same fix is needed for these other towns that use the `-montana` suffix in their slug:

- Choteau → `/lodging/choteau-montana/`
- Dillon → `/lodging/dillon-montana/`
- Hamilton → `/lodging/hamilton-montana/`
- Hardin → `/lodging/hardin-montana/`
- Libby → `/lodging/libby-montana/`
- Livingston → `/lodging/livingston-montana/`
- Three Forks → `/lodging/three-forks-montana/`
- Whitefish → `/lodging/whitefish-montana/`

Check each hub table link against the actual live URL and correct any mismatches.

---

## TASK 6 — Improve Property Descriptions (MEDIUM PRIORITY)

**Problem:** Several property descriptions across the pages read as template-generated text with minimal editorial value. Compare:

**Weak (Missoula — Staybridge Suites):**
> "Staybridge Suites Missoula is located in Further from downtown and is best suited for Extended stays. Good amenities."

**Strong (Bozeman — Kimpton Armory):**
> "Kimpton Armory Hotel is located in Downtown and is best suited for Couples, Luxury. Rooftop pool and lounge, modern amenities."

**Action:** For each property description that contains only generic phrases like "Good amenities," "Convenient location," or "Different kind of experience," expand it with 1–2 specific, factual details about the property. Minimum standard: every description must include at least one specific feature (e.g., pool, restaurant, pet policy, view, proximity to a named landmark).

**Priority pages for this fix (highest traffic towns first):**
1. Missoula — multiple weak descriptions confirmed
2. Billings
3. Great Falls
4. Kalispell
5. Helena

---

## TASK 7 — Add `rel="sponsored noopener"` to All Affiliate Links (SEO COMPLIANCE)

**Problem:** Google's link spam policies require that all paid/affiliate links carry `rel="sponsored"`. Missing this attribute is a minor but real compliance risk.

**Action:** Ensure every Expedia and VRBO affiliate link across all 27 lodging pages and the hub page includes `rel="sponsored noopener"` in the anchor tag.

**Correct format:**
```html
<a href="https://www.expedia.com/...?camref=1011l52GG6&adref=..." rel="sponsored noopener" target="_blank">Check current rates on Expedia</a>
```

This applies to all links — both the property name links in tables and the "Check current rates on Expedia" links in body text.

---

## TASK 8 — Add JSON-LD Schema to Lodging Pages (SEO ENHANCEMENT)

**Problem:** The lodging pages currently have no structured data markup. Adding schema will make them eligible for rich results in Google Search.

**Action:** Add the following JSON-LD block to the `<head>` of every town lodging page. Replace bracketed values with the correct data for each town.

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "Where to Stay in [TOWN], Montana",
  "description": "Hotels, B&Bs, cabins, and vacation rentals in [TOWN], Montana. Compare lodging options with current rates on Expedia and VRBO.",
  "url": "https://treasurestate.com/lodging/[town-slug]/",
  "breadcrumb": {
    "@type": "BreadcrumbList",
    "itemListElement": [
      {"@type": "ListItem", "position": 1, "name": "Home", "item": "https://treasurestate.com/"},
      {"@type": "ListItem", "position": 2, "name": "Lodging", "item": "https://treasurestate.com/lodging/"},
      {"@type": "ListItem", "position": 3, "name": "Where to Stay in [TOWN]", "item": "https://treasurestate.com/lodging/[town-slug]/"}
    ]
  },
  "about": {
    "@type": "City",
    "name": "[TOWN]",
    "addressRegion": "MT",
    "addressCountry": "US"
  }
}
</script>
```

---

## TASK 9 — Add Events Hub Page (NEW PAGE · HIGH SEO VALUE)

**Problem:** TreasureState.com has no events content. This is the second-largest gap in the content capability comparison (Accommodation & Events score: 3.5 vs. VisitMT.com's 9.0). A single hub page targeting "Montana events" and "Montana festivals" queries will immediately compete for traffic that currently goes entirely to VisitMT.com.

**Action:** Create a new page at `/events/` with the following structure:

**Page title:** `Montana Events & Festivals 2026 — Annual Calendar | Treasure State`
**Meta description:** `The complete guide to Montana's best annual events and festivals — from the Sweet Pea Festival in Bozeman to the Montana Folk Festival in Butte. Plan your visit around Montana's biggest celebrations.`

**Page sections:**

1. **Intro paragraph** — Montana's event calendar runs year-round, from winter ski festivals to summer rodeos and fall harvest celebrations.

2. **Featured Annual Events table** — Include at minimum these 20 events with name, town, month, and a 1-sentence description:

| Event | Town | Month | Description |
|---|---|---|---|
| Sweet Pea Festival | Bozeman | August | Three-day arts and music festival in Lindley Park |
| Montana Folk Festival | Butte | July | Free outdoor music festival, one of the largest in the Northwest |
| Whitefish Winter Carnival | Whitefish | February | Parade, snow sculptures, and ski events at Whitefish Mountain Resort |
| Little Bighorn Days | Hardin | June | Reenactment of the Battle of Little Bighorn with period costumes |
| Crow Fair | Crow Agency | August | One of the largest Native American gatherings in North America |
| Livingston Roundup Rodeo | Livingston | July 4th weekend | PRCA-sanctioned rodeo and parade |
| Missoula Marathon | Missoula | July | One of the most scenic road races in the country |
| Red Ants Pants Music Festival | White Sulphur Springs | July | Country and roots music on the Montana prairie |
| Montana State Fair | Great Falls | August | Largest annual fair in the state |
| Glacier Jazz Stampede | Kalispell | October | Jazz festival across multiple Flathead Valley venues |
| Helena Vigilante Parade | Helena | May | One of Montana's oldest parades |
| Miles City Bucking Horse Sale | Miles City | May | Legendary rodeo and wild horse sale |
| Rendezvous Cross Country Ski Race | West Yellowstone | March | One of the oldest Nordic ski races in the US |
| Beartooth Rally | Red Lodge | June | Motorcycle rally along the Beartooth Highway |
| Flathead Lake Cherry Festival | Polson | July | Celebrates the Flathead Valley cherry harvest |
| Havre Festival Days | Havre | July | Community festival with parade, carnival, and entertainment |
| Bigfork Summer Playhouse | Bigfork | June–August | Professional summer theater in a lakeside village |
| Bozeman Ice Festival | Bozeman | January | Ice climbing competition and clinics |
| Dillon Jaycee Rodeo | Dillon | July 4th | Traditional small-town Montana rodeo |
| Lewistown Art Center Harvest Show | Lewistown | October | Juried art show in the heart of Montana |

3. **"Events by Season" section** — Brief paragraphs for Winter, Spring, Summer, Fall linking to relevant town pages.

4. **Internal links** — Link each event's town name to the corresponding `/montana-towns/[town]/` page.

5. **Add `/events/` to the sitemap.xml** after the page is published.

---

## TASK 10 — Submit All New Lodging Pages to Google Search Console (INDEXING)

**Action:** Log into Google Search Console for TreasureState.com. Use the URL Inspection tool to manually request indexing for the following priority pages. Do this in order — highest traffic potential first.

1. `https://treasurestate.com/lodging/`
2. `https://treasurestate.com/lodging/bozeman/`
3. `https://treasurestate.com/lodging/missoula/`
4. `https://treasurestate.com/lodging/whitefish/`
5. `https://treasurestate.com/lodging/billings/`
6. `https://treasurestate.com/lodging/kalispell/`
7. `https://treasurestate.com/lodging/helena/`
8. `https://treasurestate.com/lodging/big-sky/`
9. `https://treasurestate.com/lodging/west-yellowstone/`
10. `https://treasurestate.com/lodging/great-falls/`
11. `https://treasurestate.com/events/` (after Task 9 is complete)

Google Search Console allows 10 manual indexing requests per day. Submit the top 10 today, then the remaining 17 town pages over the following two days.

---

## Priority Order Summary

| Task | Priority | Effort | Impact |
|---|---|---|---|
| Task 1 — Fix generic Expedia search links | Critical | Low | High — direct revenue |
| Task 2 — Add missing table property name links | High | Medium | High — direct revenue |
| Task 4 — Add town page → lodging page links | High | Low | High — SEO + traffic |
| Task 5 — Fix Anaconda/slug hub mismatches | Medium | Low | Medium — crawlability |
| Task 3 — Rewrite Missoula intro paragraph | Medium | Low | Medium — content quality |
| Task 6 — Improve weak property descriptions | Medium | Medium | Medium — content quality |
| Task 7 — Add `rel="sponsored"` to all affiliate links | Medium | Low | Medium — compliance |
| Task 8 — Add JSON-LD schema to lodging pages | Medium | Medium | High — rich results |
| Task 9 — Build `/events/` hub page | High | High | High — new traffic channel |
| Task 10 — Submit to Google Search Console | High | Low | High — indexing speed |

---

## DO NOT CHANGE

- The affiliate IDs (`camref=1011l52GG6`, `camref=1011l52GGp`, `creativeref=1101l63118`)
- The URL structure of any existing lodging page
- The breadcrumb structure (Home > Lodging > [Town])
- The "What to Know Before You Book" section content
- The "Moving to [Town]?" section and its internal links
- The "Also nearby:" section and its town links
- The footer affiliate disclosure text
