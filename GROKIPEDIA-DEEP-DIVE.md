# Grokipedia Deep Dive: Making Treasure State "All Things Montana"

This document outlines the strategy for extracting and integrating every interesting fact from Grokipedia into the Treasure State website, transforming it into the definitive Montana resource.

---

## 1. What Is Grokipedia?

**Grokipedia** is an AI-powered encyclopedia (xAI, launched Oct 2025) with 6.1M+ articles. It is fact-checked by Grok and provides:
- Town/city articles with rich, structured content
- Citations to primary sources (Census, NPS, local sites)
- Categories like "People from [Town], Montana"
- Consistent URL pattern: `https://grokipedia.com/page/{Town_Name}`

**URL format:** Replace spaces with underscores, commas preserved:
- `Philipsburg,_Montana`
- `Butte,_Montana`
- `St._Ignatius,_Montana`

---

## 2. Current State of Grokipedia Usage

| Location | Usage |
|----------|-------|
| **cities_towns_content/*.md** | ~50 towns cite Grokipedia in Notable People, Quick Facts, or Sources |
| **cities_towns_data/*_history.txt** | Raw history drafts with Grokipedia URLs as references |
| **Montana_ A Land of Intrigue and Wonder.md** | State-level facts; Grokipedia listed in references |
| **.cursor/rules/Fact-checking.mdc** | Grokipedia designated as source of truth |

**Gaps:** Most town markdown files have 2–4 notable people/facts; Grokipedia articles often contain 15–30+ extractable facts per town.

---

## 3. Fact Categories to Extract

Based on Grokipedia article structure (Philipsburg, Butte, etc.), extract:

### A. Quick Facts & Demographics
- Population (with year/source)
- County (full name)
- Founded (year, founding figure if notable)
- Elevation
- Climate (Köppen, precipitation, snowfall)
- Median age, household income, homeownership rate

### B. Notable People
- **Born in town:** Actors, athletes, politicians, scientists
- **Raised/lived in town:** With dates/context
- **Associated:** Celebrities who married, filmed, or visited

*Example (Philipsburg):* Kate Bosworth married Michael Polish at Ranch at Rock Creek (Aug 31, 2013); Scarlett Johansson married Romain Dauriac in Philipsburg (Oct 1, 2014)

### C. History & Heritage
- Founding story (who, when, why)
- Mining/industry peaks (e.g., "Granite Mountain shipped $21M bullion 1883–1898")
- Firsts (e.g., Darby: first all-woman town council in Montana, 1930)
- National Register / Historic District designations
- Population peaks and busts

### D. Culture & Media
- Literary references (e.g., Richard Hugo's "Degrees of Gray in Philipsburg")
- Films/TV filmed in town (e.g., Father Stu, The Call of the Wild)
- Oldest operating [theatre, newspaper, etc.]
- Festivals and annual events with dates

### E. Economy & Industry
- Historical dominance (e.g., Butte: 51% U.S. copper in 1896)
- Current top employers
- Unique businesses (e.g., Sweet Palace – 1,100+ confections)
- Awards (e.g., Sunset Magazine 2015 Best Municipal Makeover)

### F. Geography & Environment
- Coordinates, land area
- Proximity to parks, wilderness, lakes
- Unique features (e.g., 75+ lakes in Granite County)

### G. Fun Facts & Quirks
- Records (e.g., world's shortest river – Roe River, Great Falls)
- Oddities (e.g., 10,000 miles of tunnels under Butte)
- Naming stories (e.g., Sidney named after 6-year-old Sidney Walters)

---

## 4. Where Facts Go on the Site

| Fact Type | Markdown Section | Renders As |
|-----------|------------------|------------|
| Quick Facts | `## Quick Facts` list | Schema/FAQs; population syncs to town-data.json via extract-population.js |
| Notable People | `## Notable People & Pop Culture` | Main body; becomes FAQ |
| History | `## History & Heritage` | Main body; becomes FAQ |
| Fun Fact | Quick Facts or dedicated line | Schema/FAQs |
| Events | `## Seasonal Activities & Local Events` | Main body |
| Economy | `## Local Industry & Economy` | Main body |

---

## 5. Extraction Strategy

### Phase 1: Manual Enrichment (Immediate)
1. **Prioritize hub cities:** Billings, Missoula, Bozeman, Great Falls, Helena, Kalispell, Butte
2. **Then high-traffic towns:** Livingston, Whitefish, Red Lodge, Philipsburg, Virginia City, etc.
3. **Process:** Fetch Grokipedia page → extract facts by category → add to markdown with `(Source: Grokipedia)` or `(Source: Grokipedia, [second source])`
4. **Verification:** Per `.cursor/rules/Fact-checking.mdc`, add second source (Wikipedia, IMDb, Census, official site) for claims that affect credibility

### Phase 2: Semi-Automated (Optional)
- **Grokipedia API** (if available): `GET /v1/articles/{title}` for batch fetching
- **Web fetch:** Use `mcp_web_fetch` for `https://grokipedia.com/page/{Town}_Montana`
- **Script:** Node script that fetches, parses, and outputs suggested markdown additions

### Phase 3: State-Level Facts
- **Montana main article:** `https://grokipedia.com/page/Montana` (~1,000+ lines)
- Extract: wildlife stats, weather records, hydrology, tribes, economy, films
- Integrate into `web/pages/Information/montana-facts.tsx` and `Montana_ A Land of Intrigue and Wonder.md`

---

## 6. Quality Guidelines

1. **Attribution:** Always cite `(Source: Grokipedia)` or `(Source: Grokipedia, [second source])`
2. **Verification:** For notable people, film credits, population: add second source when possible
3. **Recency:** Prefer Census 2020 for population; note if Grokipedia uses 2023/2024 estimates
4. **Tone:** Keep facts concise; avoid academic jargon
5. **Conflict resolution:** If Grokipedia conflicts with Census/official data, use official source and note discrepancy

---

## 7. Example: Philipsburg Enrichment

**Current Philipsburg markdown** has:
- Philip Deidesheimer, Zane Glenn Murfitt
- Generic "Spirit of the Mining Era" placeholder

**Grokipedia adds (examples to add):**

```markdown
## Notable People & Pop Culture

- **Philip Deidesheimer** – German mining engineer for whom the town is named; designed the Hope Smelter and platted the townsite in 1867 (Source: Grokipedia)
- **Kate Bosworth** – Married director Michael Polish at The Ranch at Rock Creek, Aug 31, 2013 (Source: Grokipedia, People.com)
- **Scarlett Johansson** – Married Romain Dauriac in Philipsburg, Oct 1, 2014 (Source: Grokipedia, Vanity Fair)
- **Richard Hugo** – Poem "Degrees of Gray in Philipsburg" (1975) portrays the town's mining-era melancholy (Source: Grokipedia)
- **Zane Glenn Murfitt** – Montana Hall of Fame inductee for Fast Pitch Softball; State Championship 1949 (Source: Grokipedia)

## Fun Fact (expand Quick Facts)

- **Philipsburg Theatre** – Montana's oldest operating opera house (1891) (Source: Grokipedia)
- **Sweet Palace** – Over 1,100 nostalgic confections produced daily; one of the largest candy stores in the Northwest (Source: Grokipedia, sweetpalace.com)
- **Films:** Father Stu (2022) and The Call of the Wild (2020) filmed in Philipsburg (Source: Grokipedia, IMDb)
- **Award:** Sunset Magazine 2015 Best Municipal Makeover (Source: Grokipedia, Montana Right Now)
```

---

## 8. Town Coverage Checklist

| Status | Count | Towns |
|--------|-------|-------|
| Has Grokipedia citations | 36+ | Hub cities, Livingston, Whitefish, Red Lodge, Virginia City, Anaconda, Belgrade, Big Sky, Bigfork, Ennis, Gardiner, Philipsburg, West Yellowstone, Hamilton, Deer Lodge, Three Forks, Dillon, Choteau, Cut Bank, Columbus, Boulder, etc. |
| cities_towns_data history files | 50+ | Boulder, Butte, Hamilton, Havre, etc. |
| No Grokipedia yet | ~85 | Many smaller towns |

**Action:** For towns without Grokipedia citations, check if `https://grokipedia.com/page/{Town}_Montana` exists. Many smaller towns may not have dedicated articles; use Montana main article and nearby hub articles for regional facts.

---

## 9. Implementation Checklist

- [x] Create `web/scripts/enrich-from-grokipedia.js` to output Grokipedia URLs per town
- [x] Enrich Philipsburg as pilot (add 5–10 facts from Grokipedia)
- [x] Enrich Butte (add Frank Little, Marcus Daly, Speculator Mine, Dumas Brothel, etc.)
- [x] Enrich hub cities (Billings, Bozeman, Helena, Great Falls, Kalispell, Missoula, Butte)
- [x] Add state-level facts from Montana article to montana-facts.tsx (Anzick site, reservations)
- [x] Enrich high-traffic towns (Livingston, Whitefish, Red Lodge, Virginia City, Anaconda)
- [x] Enrich next batch (Belgrade, Big Sky, Bigfork, Ennis, Gardiner)
- [x] Enrich batch: West Yellowstone, Hamilton, Deer Lodge, Three Forks
- [x] Enrich batch: Dillon, Choteau, Cut Bank, Columbus, Boulder
- [ ] Enrich remaining ~85 towns (run script, fetch Grokipedia, add facts in batches)
- [ ] Document "People from X" category URLs for notable people (format may vary)
- [ ] Run extract-population.js after markdown population updates

---

## 10. References

- Grokipedia: https://grokipedia.com
- Town URL pattern: `https://grokipedia.com/page/{Town}_Montana`
- Fact-checking rule: `.cursor/rules/Fact-checking.mdc`
- Markdown structure: `city_markdown.txt`
- Extract population: `web/scripts/extract-population.js`
