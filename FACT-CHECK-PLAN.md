# Treasure State Website — Fact-Check Plan

**Focus: Narratives.** This plan prioritizes verifying the *written content* — prose, claims, descriptions, and stories — over data pipelines and JSON. Reports of inaccuracies suggest narrative claims may be overstated, outdated, or unsupported.

---

## 1. Narrative Content Inventory

| Content Type | Location | What to Fact-Check |
|-------------|----------|--------------------|
| **Town markdown** | `cities_towns_content/*.md` | Quick Facts, "Known For," history, notable people, events, distances, industry descriptions |
| **Hub intros & taglines** | `web/components/town/cluster-data.ts` | `hubIntro` prose, characterizations ("western Montana's largest city," "most livable") |
| **FAQs** | `web/components/town/cluster-data.ts` | Narrative answers — claims about climate, recreation, schools, economy |
| **Topic page prose** | `web/components/town/topics/{slug}/*.tsx` | Fishing/Hiking/Schools descriptions, river names, trail descriptions, "best" claims |
| **Best-of highlights** | `web/pages/best-of/[slug].tsx` | One-line highlights per town — are they accurate and defensible? |
| **Best-of methodology** | Best-of pages | How rankings are explained; any narrative that could mislead |
| **Moving guide prose** | `web/pages/guides/[slug].tsx` | Templated sections (pros/cons, climate, recreation) — tone and claims |
| **Information pages** | `web/pages/Information/*.tsx` | Montana history, mining, geology, vigilantes — historical claims |
| **Corridor descriptions** | `web/data/corridors.json`, planner pages | Scenic drive descriptions, "one of America's most scenic" type claims |
| **Planner copy** | Hiking, hot springs, campgrounds | Intro/methodology text, any superlatives |

---

## 2. Phase 1: Town Markdown Narratives (Highest Priority)

**Goal:** Verify `cities_towns_content/*.md` — the richest narrative source.

### 2.1 Quick Facts & "Known For"

- [ ] **Population** — Match Census; note if estimate vs. decennial.
- [ ] **Founded / elevation** — Grokipedia, city/county sites, USGS.
- [ ] **"Known For"** — Are these accurate? Avoid overclaiming (e.g., "world-class" without basis).
- [ ] **Notable people** — Birthplace, residence claims; verify with IMDb, bios, news.

### 2.2 History & Heritage

- [ ] Dates (founding, railroad arrival, etc.) — Montana Historical Society, local museums.
- [ ] Industry claims ("lumber was historically significant") — Supportable?

### 2.3 Events & Seasonal Activities

- [ ] Event names and typical months — Cross-check with Destination [Town], chamber of commerce, official calendars.
- [ ] "Annual events" — Still held? Correct timing?

### 2.4 Distances & Geography

- [ ] "X miles to Glacier/Yellowstone" — Verify with Google Maps or routing.
- [ ] "Largest freshwater lake west of the Mississippi" — Fact-check (Flathead).
- [ ] River/lake names — Correct spelling and geography.

### 2.5 Local Industry & Economy

- [ ] Sector descriptions — Align with chamber, EDC, or Census.
- [ ] Avoid overstating (e.g., "major employer" without data).

### 2.6 Priority towns (start here)

Missoula, Bozeman, Billings, Helena, Kalispell, Whitefish, Great Falls, Livingston, West Yellowstone, Big Sky, Seeley Lake, Hamilton, Red Lodge, Dillon, Butte, Anaconda.


---

## 3. Phase 2: Hub Content & FAQs (`cluster-data.ts`)

**Goal:** Audit narrative claims in hub intros and FAQ answers.

### 3.1 Hub intros

For each hub (Missoula, Bozeman, etc.):

- [ ] Characterizations — "largest city," "regional center," "most livable" — defensible?
- [ ] Recreation claims — "167 recreation sites," "49 trailheads" — must match data or be softened.
- [ ] Distance claims — "Snowbowl 12 miles," "Rattlesnake Wilderness 5 miles" — verify.
- [ ] Tone — Avoid marketing superlatives that can't be backed up.

### 3.2 FAQ answers

- [ ] Each FAQ answer is a mini-narrative. Fact-check:
  - Climate descriptions (temps, snow, seasons).
  - Recreation access (counts, distances).
  - School stats (enrollment, graduation) — match OPI/NCES.
  - Healthcare (hospital names, distances).
  - Industry/employment claims.
- [ ] Remove or soften unverifiable claims ("consistently ranks among Montana's most livable").

---

## 4. Phase 3: Topic Page Prose

**Goal:** Verify Fishing, Hiking, Schools, CostOfLiving, Housing, Jobs, WeekendItinerary content.

### 4.1 Per-town topic components

- [ ] **River/lake names** — Correct? Present in recreation data?
- [ ] **Trail names** — Real trails? Correct distances?
- [ ] **School names** — Correct district, enrollment, graduation.
- [ ] **"Best" or "top" claims** — Supported by data or remove.
- [ ] **Weekend itineraries** — Attractions exist? Hours/access accurate?

### 4.2 Towns with custom topics

List: Anaconda, Butte, Bigfork, Columbia Falls, Dillon, Hamilton, Lewistown, Miles City, Three Forks, Hardin, etc. Audit each.

---

## 5. Phase 4: Best-of Narratives

**Goal:** Ensure ranking highlights and methodology copy are accurate and not misleading.

### 5.1 Methodology documentation

- [ ] Document how each ranking is computed (see `generate-best-of-index.js` and `[slug].tsx`).
- [ ] Publish methodology on each best-of page (or link to a central doc).

### 5.2 Highlight verification

For each ranking, the page shows a "highlight" per town. Verify:

- Highlights are generated from actual fields (e.g., `recTotal`, `fishingCount`).
- No highlights contradict the underlying data (e.g., "10 fishing access sites" when JSON says 8).

### 5.3 Edge cases

- Towns with sparse data (e.g., no recreation) — ensure they’re not over-claimed.
- Affordability: confirm formula and that "most affordable" uses the intended metric.

---

## 6. Phase 5: Moving Guides & Information Pages

### 6.1 Moving guide prose

- [ ] Templated pros/cons — Are they fair? Any claims that could be wrong?
- [ ] Climate descriptions — Match climate data.
- [ ] Recreation summaries — Match recreation data.

### 6.2 Information pages

- [ ] Montana Facts, mining history, geology, vigilantes — Historical claims.
- [ ] Cross-check with Montana Historical Society, USGS, academic sources.

---

## 7. Phase 6: Planners & Corridors

### 7.1 Corridor descriptions

- [ ] "One of America's most scenic drives" — Attributable? Or soften.
- [ ] Season, elevation, highway numbers — Fact-check.

### 7.2 Planner intros

- [ ] Hiking, hot springs, campgrounds — Intro copy, methodology, any superlatives.

---

## 8. Narrative Red Flags to Watch For

- **Superlatives:** "world-class," "best," "most," "premier" — Only use if defensible.
- **Unverifiable claims:** "Consistently ranks," "locals say," "known as" — Source or remove.
- **Outdated events:** Festivals that moved, were cancelled, or renamed.
- **Wrong geography:** River through wrong town, wrong mountain range.
- **Celebrity/residence claims:** "Born in X," "lives in Y" — Verify.
- **Distance claims:** Round to reasonable precision; verify with mapping.

---

## 9. Execution Order (Narrative-First)

| Phase | Focus | Suggested order |
|-------|-------|----------------|
| 1. Town markdown | Full narrative audit | **First** |
| 2. Hub & FAQs | High-visibility prose | **Second** |
| 3. Topic pages | Per-town descriptions | **Third** |
| 4. Best-of | Highlights & methodology | Fourth |
| 5. Moving guides & Info | Templated & evergreen | Fifth |
| 6. Planners & corridors | Supporting copy | Sixth |

---

## 10. Tracking & Reporting

- Use a spreadsheet or issue tracker for: Town | Narrative claim | Source | Status (OK / Fix / Verify).
- Tag issues by priority (P1: wrong claim on high-traffic page; P2: outdated; P3: minor).

---

## 11. Key File Reference (Narrative Sources)

| Purpose | Path |
|---------|------|
| Town narratives | `cities_towns_content/*.md` |
| Hub intros, FAQs, meta | `web/components/town/cluster-data.ts` |
| Topic prose | `web/components/town/topics/{slug}/*.tsx` |
| Best-of highlights | `web/pages/best-of/[slug].tsx` |
| Moving guide templates | `web/pages/guides/[slug].tsx` |
| Information pages | `web/pages/Information/*.tsx` |
| Corridor descriptions | `web/data/corridors.json` |
| Planner copy | `web/pages/planners/*.tsx` |
