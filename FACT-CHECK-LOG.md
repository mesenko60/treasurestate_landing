# Fact-Check Execution Log

Executed per `FACT-CHECK-PLAN.md` (narrative focus). Summary of changes made.

---

## Phase 1: Town Markdown Narratives

### Missoula, Montana.md
- **Fixed:** "A River Runs Through It" — Corrected from "filmed in and around Missoula" to accurate: story set in Missoula, film primarily shot in Livingston, Bozeman, Paradise Valley (Gallatin/Yellowstone rivers). Source: IMDb, Wikipedia.

### Bozeman, Montana.md
- **Updated:** Population from "Approximately 58,000 (as of recent estimates)" to "57,305 (U.S. Census Bureau, July 1, 2023 estimate)".

### Billings, Montana.md
- **Verified:** Population 117,116 (2020 census) — correct. No changes.

### Helena, Montana.md
- **Updated:** Population from "Approximately 33,100 (2023)" to "34,464 (U.S. Census Bureau, July 1, 2023 estimate)".

### Kalispell, Montana.md
- **Fixed:** Removed duplicate "** " formatting in Quick Facts (Population, County, Founded, etc.).
- **Fixed:** "2,956 ft ft" typo → "2,956 ft".
- **Updated:** Population to "29,886 (U.S. Census Bureau, July 1, 2023 estimate)".

### Great Falls, Montana.md
- **Updated:** Population from "Around 60,000 (approx. 2023)" to "60,422 (U.S. Census Bureau, July 1, 2023 estimate)".

### Seeley Lake, Montana.md
- **Fixed:** County from "Missoula" to "Missoula County".

### Livingston, Montana.md
- **Updated:** Population from "8,040 (2020 census), growing to approximately 9,196 (2025)" to "8,483 (2020 census); ~8,900 (U.S. Census Bureau, July 1, 2023 estimate)".
- **Fixed:** Yellowstone TV series — Corrected from "set in the Livingston area" to accurate: creator conceived series in Livingston; much of filming occurs in Bitterroot Valley (Chief Joseph Ranch near Darby) and other Montana locations.

### Verified (no changes needed)
- **West Yellowstone:** Population 1,272 (2020 census), -66°F residential record (Feb 9, 1933) — both verified.
- **David Lynch, Dana Carvey:** Born in Missoula — verified.
- **Hank Green:** Resides in Missoula — verified.
- **Garnet Ghost Town:** "Montana's most intact ghost town" — verified.
- **Missoula to Glacier:** "2.5 to 3 hours" / ~150 miles — verified.
- **National Bison Range:** "About an hour's drive north" — verified.
- **Bozeman, Livingston topic pages:** Fishing access counts (1 and 2) and lake counts (16 and 40) match town-recreation.json.

---

## Phase 2: Hub Content & FAQs (cluster-data.ts)

### Missoula
- **Softened:** "consistently ranks among Montana's most livable communities" → "is widely regarded as one of Montana's most livable communities" (removes unverifiable "consistently ranks" claim).

### Bozeman
- **Updated:** Population from "58,000" to "57,305" for consistency with Census.

### Verified (no changes)
- Missoula recreation counts (167 sites, 49 trailheads, 28 fishing access) match town-recreation.json.
- Bozeman recreation counts (91 sites, 16 trailheads) match town-recreation.json.
- Housing/FAQ numbers match town-housing.json (Missoula $547K, 369 listings, etc.).

---

## Phase 3: Topic Page Prose

- **Verified:** Bozeman Fishing (1 access, 16 lakes), Livingston Fishing (2 access, 40 lakes) match recreation data.
- Topic components use data-driven props; no narrative corrections needed for sampled files.

---

## Phase 4: Best-of Narratives

- **Updated:** Recreation methodology — Clarified that "total volume of sites within 30 miles" and "All recreation counts use a 30-mile radius from each town" (was "tiered radius system 50–100 miles" which could mislead).
- Methodology sections and data attribution already present on best-of pages.

---

## Phases 5 & 6

- **Deferred:** Moving guides (templated from data), Information pages (Montana Facts, etc.), Planners & corridors — spot-checked; no critical narrative errors identified in sampled content. Full audit can be done in a follow-up pass.

---

## Files Modified

| File | Changes |
|------|---------|
| `cities_towns_content/Missoula, Montana.md` | A River Runs Through It filming location |
| `cities_towns_content/Bozeman, Montana.md` | Population |
| `cities_towns_content/Helena, Montana.md` | Population |
| `cities_towns_content/Kalispell, Montana.md` | Formatting, population |
| `cities_towns_content/Great Falls, Montana.md` | Population |
| `cities_towns_content/Seeley Lake, Montana.md` | County name |
| `cities_towns_content/Livingston, Montana.md` | Population, Yellowstone TV series |
| `web/components/town/cluster-data.ts` | Missoula livability claim, Bozeman population |
| `web/pages/best-of/[slug].tsx` | Recreation methodology |

---

---

## Phase 7: Non-Hub Towns (Fact-Check Pass)

### Population & County Fixes
- **Alberton:** Population 452 → 451 (2020 Census); County "Mineral" → "Mineral County"
- **Boulder:** Patrick Duffy — Corrected from "born and raised in Boulder" to "born in Townsend, Montana (his parents later owned the Boulder Bar in Montana)" (IMDb, Wikipedia)
- **County standardization:** Updated 24+ non-hub towns from short county names to full (e.g., "Madison" → "Madison County"): Three Forks, Twin Bridges, Wolf Point, Darby, Virginia City, Troy, Eureka, Drummond, Big Sandy, White Sulphur Springs, Plains, Conrad, Ennis, Stevensville, Big Timber, Lodge Grass, Red Lodge, Choteau, Columbia Falls, Sidney, Plentywood, West Glacier, Glendive, Lewistown, Wisdom, Havre, Miles City, Colstrip

### Verified (no changes)
- Twin Bridges: Angela McLean (native), Benny Reynolds (native), Spokane (1889 Kentucky Derby, Doncaster)
- Wolf Point: Ted Schwinden, Hank Adams, Casey FitzSimmons, Dolly Akers, Lisa Lockhart
- Big Timber: Judy Martz (born), Tom Brokaw (ranch), Michael Keaton (property)
- Three Forks: John Q. Adams founder 1908

### Deer Lodge, Sidney
- **Deer Lodge:** Kept "Powell County" — correct (Deer Lodge city is county seat of Powell County; town-data.json lists "Deer Lodge County" which refers to a different entity)
- **Sidney:** Kept population 6,346 (2020 Census); county Richland → Richland County

### Gardiner, Red Lodge
- **Gardiner:** Corrected "Gardner and Yellowstone Rivers" → "Gardner River and Yellowstone River" (river is Gardner; town is Gardiner)
- **Red Lodge:** Softened Horse Whisperer claim — "shot in the stunning landscapes surrounding Red Lodge" → "shot in Montana, including the Absaroka-Beartooth Wilderness and areas near Red Lodge" (primary filming was Livingston, Big Timber, Belgrade)

### Havre
- **Havre:** Fixed duplicate "Hill County County" → "Hill County"

---

## Phase 8: Weirdness Pass & Grokipedia Enrichment

### Overstated popularity / proximity assumptions
- **Cut Bank:** "one of Montana's premier fishing destinations" → "local trout stream; check flow conditions before visiting, as water levels vary seasonally" (Cut Bank Creek is a trout fishery but not widely ranked as premier)
- **Ronan:** "legendary fishing spots" → "casting a line at nearby Flathead Lake or Lake Mary Ronan" (legendary fishing is at Flathead Lake 12 mi away, not Ronan itself)
- **Mission Mountain Golf Course (Ronan):** "one of Montana's finest" → "this scenic 18-hole course (GolfPass 4.1/5)" (rated 20th in Montana per Core Four Golf)

### Pond/lake accuracy
- **Spring Meadow Lake (Helena Fishing.tsx):** Corrected "30-acre spring-fed lake" → "13.7-acre spring-fed pond (officially named Spring Meadow Lake)" (Montana FWP classifies it as a pond)

### Typos
- **Troy:** "perfect basements" → "perfect basecamps"

### Grokipedia enrichment
- **Darby:** Added "First All-Woman Town Council" — In 1930, Darby elected the first all-woman town council in Montana (Source: Grokipedia)
- **Ronan:** Added Marvin Camel Nevada Boxing Hall of Fame 2024; added Shane Morigeau (state senator since 2021)

---

---

## Phase 9: Data Enrichment & Multi-Source Verification

### Duplicate "County County" fixes
- **Miles City:** Custer County County → Custer County
- **Colstrip:** Rosebud County County → Rosebud County

### TBD fills (Census + town-data verification)
- **Glasgow:** 3,194 (2020 Census), Valley County, 2,096 ft
- **Hardin:** 3,807 (2020 Census), Big Horn County, 2,910 ft
- **Harlem:** 769 (2020 Census), Blaine County, 2,372 ft
- **Jordan:** 356 (2020 Census), Garfield County, 2,608 ft
- **Sidney:** 6,346 (2020 Census), Richland County, 1,939 ft
- **Superior:** 835 (2020 Census), Mineral County, 2,759 ft
- **Malta:** 1,860 (2020 Census), Phillips County, 2,254 ft
- **Scobey:** 996 (2020 Census), Daniels County, 2,470 ft
- **Townsend:** 1,787 (2020 Census), Broadwater County, 3,825 ft

### Population & spelling fixes
- **Bigfork:** "Approximately 5,000" → 5,118 (2020 Census)
- **Browning:** "Approximately 1,000" → 1,018 (2020 Census)
- **Philipsburg:** Standardized spelling (Philipsburg, one L — official per townofphilipsburgmt.com); cleaned Quick Facts formatting; added source for Fun Fact

### Multi-source attribution
- **Darby:** First all-woman town council — added Wikipedia as second source (Grokipedia, Wikipedia)
- **Miles City:** Maurice Hilleman — enriched with birth date, MSU, vaccine list; added NIH as second source

---

## Sources Used for Verification

- U.S. Census Bureau QuickFacts (population estimates)
- IMDb, Wikipedia (film locations, celebrity births)
- Web search (West Yellowstone -66°F, Yellowstone TV filming, Livingston population)
- `web/data/town-recreation.json` (recreation counts)
- `web/data/town-housing.json` (housing data)
- town-data.json (population, county, elevation for TBD fills)
- Grokipedia (notable people, history)
