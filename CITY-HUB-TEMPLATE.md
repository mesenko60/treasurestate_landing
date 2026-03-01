# City Hub + Cluster Buildout — Template

TreasureState.com · Next.js (Pages Router) · Static Export

Use this template when adding a new city hub. Replace all `{CITY}`,
`{city}`, and `{slug}` placeholders with actual values.

For reference implementation, see `MISSOULA-HUB-SPEC.md`.

---

## Prerequisites

Before starting, verify:

- [ ] The city already has a working page at `/montana-towns/{slug}/`
- [ ] The following data files have entries for `{slug}`:
  - `web/data/town-housing.json` (housing, rent, income, affordability)
  - `web/data/town-economy.json` (industries, unemployment, labor force)
  - `web/data/town-data.json` (population, school district, elevation)
  - `web/data/town-recreation.json` (trails, lakes, fishing access, etc.)
  - `web/data/town-climate.json` (monthly temperature and precipitation)
- [ ] The dynamic routing is already in place (`[slug]/index.tsx` and `[topic].tsx`)

---

## Step 1: Audit Recreation Data Quality

Before writing content, audit the recreation data for the city. Bad data
will surface as embarrassing errors on the live site.

```bash
cd web && python3 -c "
import json
d = json.load(open('data/town-recreation.json'))
places = d.get('{slug}', {}).get('places', [])
from collections import Counter
types = Counter(p['type'] for p in places)
for t, c in types.most_common():
    print(f'{t:25s} {c}')
within50 = [p for p in places if p['distMiles'] <= 50]
print(f'Total within 50 mi: {len(within50)}')
"
```

Check for:
- [ ] Phantom locations (places that don't actually exist near the city)
- [ ] Mislabeled types (e.g., a statue labeled as "Museum")
- [ ] Unreasonable distances (places listed at 5 mi that are actually 50 mi)
- [ ] Duplicate entries

Record the verified counts:

| Type | Within 50 mi |
|------|-------------|
| Trailheads | _____ |
| Lakes | _____ |
| Fishing Access | _____ |
| Wilderness Areas | _____ |
| State Parks | _____ |
| Museums | _____ |
| All recreation | _____ |

---

## Step 2: Verify Housing & Economy Data

```bash
cd web && python3 -c "
import json
h = json.load(open('data/town-housing.json')).get('{slug}', {})
e = json.load(open('data/town-economy.json')).get('{slug}', {})
t = json.load(open('data/town-data.json')).get('{slug}', {})
print('=== HOUSING ===')
for k in ['zillowHomeValue','zillowHomeValueDate','medianHomeValue','medianRent',
          'zillowRent','medianHouseholdIncome','homeValuePercentile','rentPercentile',
          'incomePercentile','affordabilityRatio','forSaleInventory','inventoryYoY',
          'medianListPrice','totalHousingUnits','vacancyRate']:
    print(f'  {k}: {h.get(k)}')
print('=== ECONOMY ===')
for k in ['unemploymentRate','laborForceParticipation','mainIndustry']:
    print(f'  {k}: {e.get(k)}')
if e.get('topIndustries'):
    for ind in e['topIndustries']:
        print(f'    {ind[\"name\"]}: {ind[\"pct\"]}%')
print(f'population: {t.get(\"population\")}')
print(f'schoolDistrict: {t.get(\"schoolDistrict\")}')
print(f'graduationRate: {e.get(\"graduationRate\")}')
print(f'perPupilSpending: {e.get(\"perPupilSpending\")}')
"
```

Record key figures for use in content:

| Metric | Value |
|--------|-------|
| Population | _____ |
| Zillow Home Value | $_____ |
| Median Rent (Zillow) | $_____ |
| Median Household Income | $_____ |
| Affordability Ratio | _____ |
| Home Value Percentile | _____th |
| Unemployment Rate | _____% |
| Top Industry | _____ (____%) |
| School District | _____ |
| Graduation Rate | _____% |

---

## Step 3: Add Cluster Config

**File:** `web/components/town/cluster-data.ts`

Add a new entry to `clusterConfigs`:

```typescript
'{slug}': {
  hubIntro: `{CITY} ... [2-3 paragraphs, HTML string with <a> links to cluster pages]
    ...paragraph 1: geography, population, positioning...
    ...paragraph 2: what makes the city notable, key stats...
    ...paragraph 3: what this guide covers, link to sub-guides...`,
  guides: [
    {
      topic: 'cost-of-living',
      title: 'Cost of Living',
      h1: 'Cost of Living in {CITY}, Montana',
      metaTitle: 'Cost of Living in {CITY}, Montana (2026) | Treasure State',
      metaDescription: '...145-160 chars, must include {CITY}...',
      description: '...1-2 sentences for hub card...',
      icon: '💰',
    },
    {
      topic: 'housing',
      title: 'Housing Market',
      h1: '{CITY}, Montana Housing Market',
      metaTitle: '{CITY}, Montana Housing Market (2026) | Treasure State',
      metaDescription: '...include key stat like median home value...',
      description: '...1-2 sentences...',
      icon: '🏠',
    },
    {
      topic: 'jobs',
      title: 'Jobs & Economy',
      h1: 'Jobs & Economy in {CITY}, Montana',
      metaTitle: 'Jobs & Economy in {CITY}, Montana (2026) | Treasure State',
      metaDescription: '...include unemployment rate and top industry...',
      description: '...1-2 sentences...',
      icon: '💼',
    },
    {
      topic: 'schools',
      title: 'Schools & Education',
      h1: 'Schools in {CITY}, Montana',
      metaTitle: 'Schools in {CITY}, Montana — K-12 & University Guide | Treasure State',
      metaDescription: '...include district name and enrollment...',
      description: '...1-2 sentences...',
      icon: '🎓',
    },
    {
      topic: 'hiking',
      title: 'Hiking & Trails',
      h1: 'Hiking Near {CITY}, Montana',
      metaTitle: 'Best Hiking Near {CITY}, Montana — Trails & Routes | Treasure State',
      metaDescription: '...include trailhead count and closest trail...',
      description: '...1-2 sentences...',
      icon: '🥾',
    },
    {
      topic: 'fishing',
      title: 'Fishing',
      h1: 'Fishing Near {CITY}, Montana',
      metaTitle: 'Fishing Near {CITY}, Montana — Rivers, Access & Guide | Treasure State',
      metaDescription: '...include fishing access count and key river...',
      description: '...1-2 sentences...',
      icon: '🎣',
    },
    {
      topic: 'weekend-itinerary',
      title: 'Weekend Itinerary',
      h1: 'A Weekend in {CITY}, Montana',
      metaTitle: 'Weekend in {CITY}, Montana — 3-Day Itinerary | Treasure State',
      metaDescription: '...include key activities...',
      description: '...1-2 sentences...',
      icon: '📅',
    },
  ],
  faqs: [
    // 8-10 FAQs. Each answer: 40-80 words, factual, data-grounded.
    // Required topics:
    //   - Cost of living (include specific numbers)
    //   - Climate/winters
    //   - Family-friendliness / schools
    //   - Outdoor recreation
    //   - Best time to visit
    //   - Distance to nearest major destination (e.g., Glacier, Yellowstone)
    //   - Main industries / jobs
    //   - Retirement suitability
    //   - Housing market
    //   - Airport / how to get there
  ],
},
```

### Meta Description Rules

- 145–160 characters
- Must include the city name
- Include at least one specific data point (e.g., "$547K median home value")
- Avoid generic superlatives ("best", "amazing")

### FAQ Rules

- 8–10 questions per city
- Answers: 40–80 words, factual
- Include specific numbers from the data (not vague claims)
- These FAQs are used for both the hub page display AND the FAQPage JSON-LD schema

---

## Step 4: Create or Adapt Topic Components

**Directory:** `web/components/town/topics/`

### Option A: Generalize Existing Components (Preferred)

If the topic content can work across cities by using `{townName}` and data
props, refactor the Missoula components to remove city-specific references.

City-specific references to look for:
- Named employers (e.g., "University of Montana")
- Named neighborhoods (e.g., "Rattlesnake")
- Named landmarks (e.g., "M Trail")
- Named hospitals, schools, rivers
- Hardcoded statistics that should come from data

### Option B: City-Specific Components

If a topic requires substantially different narrative for different cities
(e.g., Weekend Itinerary with specific restaurant and landmark recommendations),
create a city-specific variant or use conditional content within the component.

### Content Requirements

Every topic component must:

- [ ] Contain 800+ words of unique, data-grounded content
- [ ] Include an "At a Glance" section with 5-8 key stats
- [ ] Link to the hub page within the first 200 words
- [ ] Link to at least 2 other cluster pages in natural context
- [ ] Use data from props (not hardcoded values) for all statistics
- [ ] Handle null/missing data gracefully (show "—" or hide section)
- [ ] Use the `ordinal()` helper for percentile displays
- [ ] Use explicit `{' '}` for JSX whitespace around dynamic values

### Helper Functions (Copy to Each Component as Needed)

```typescript
function fmt(n: number | null): string {
  if (n == null) return '—';
  return n.toLocaleString('en-US');
}

function fmtDollar(n: number | null): string {
  if (n == null) return '—';
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  return `$${Math.round(n / 1_000).toLocaleString('en-US')}K`;
}

function ordinal(n: number): string {
  const mod100 = n % 100;
  if (mod100 >= 11 && mod100 <= 13) return `${n}th`;
  const suffixes: Record<number, string> = { 1: 'st', 2: 'nd', 3: 'rd' };
  return `${n}${suffixes[n % 10] || 'th'}`;
}
```

---

## Step 5: Register Topic in `[topic].tsx`

If adding a new topic component, add its import and `case` branch in
`pages/montana-towns/[slug]/[topic].tsx`:

```typescript
import NewTopic from '../../../components/town/topics/NewTopic';

// Inside the switch statement:
case 'new-topic':
  content = <NewTopic townName={townName} slug={slug} /* props */ />;
  break;
```

For existing topics (cost-of-living through weekend-itinerary), no changes
are needed — the existing switch statement and data loading handle all cities.

---

## Step 6: Build & Verify

```bash
cd web && npx next build && node scripts/generate-sitemap.js
```

### Verification Checklist

- [ ] All 7 new cluster pages exist in `out/montana-towns/{slug}/`
- [ ] Each cluster page has `index.html` in its directory
- [ ] All 7 new URLs appear in `out/sitemap.xml`
- [ ] Canonical URLs are correct and absolute
- [ ] Hub page shows intro, guide cards, and FAQ section
- [ ] Non-hub towns render identically to before
- [ ] No console errors during build

### Content Spot-Check

For each cluster page, verify:

- [ ] Statistics match the source data (check at least 3 numbers per page)
- [ ] No phantom locations in recreation tables
- [ ] Lake/trail/fishing access counts match verified data
- [ ] Named places actually exist near the city
- [ ] Ordinal suffixes are correct (e.g., "82nd" not "82th")
- [ ] No missing spaces around dynamic values
- [ ] Internal links point to correct URLs

---

## Common Pitfalls (Learned from Missoula Build)

### Data Quality
- **Phantom locations**: The recreation dataset may include places that don't
  exist near a city. Audit lake, trail, and museum entries before launch.
- **Misleading type labels**: "National HQ" and "Historic Site" entries are
  filtered out of weekend-itinerary highlights. Check if other noisy types
  appear for the new city.
- **Distance ranges**: The data extends beyond 50 miles for some types. Use
  accurate counts for "within 50 miles" claims.

### JSX Rendering
- **Whitespace collapse**: React collapses whitespace between JSX expressions.
  Always use `{' '}` between text and dynamic values:
  ```tsx
  // BAD: "throughout theMissoula area"
  throughout the{townName} area
  // GOOD: "throughout the Missoula area"
  throughout the{' '}{townName} area
  ```
- **Unicode in JSX text**: Use actual Unicode characters (–, —, °) instead
  of escape sequences (`\u2013`) in JSX text content.

### Content
- **Verify all named places**: Don't assume names from the dataset are real
  or correctly categorized. Spot-check at least the first 5 entries in each
  recreation table.
- **Don't hardcode data values in narrative**: Use props and conditional
  rendering. Hardcoded numbers become stale.
- **Check ordinal suffixes**: Use the `ordinal()` helper, not manual suffixes.

---

## Topic-by-Topic Data Loading Reference

This table shows which data files and filters each topic uses in
`getStaticProps`:

| Topic | Data files | Recreation filters | Caps |
|-------|-----------|-------------------|------|
| cost-of-living | housing, economy | — | — |
| housing | housing | — | — |
| jobs | economy, town-data | — | — |
| schools | town-data, economy | — | — |
| hiking | recreation | Trailhead, Wilderness, State Park | — |
| fishing | recreation | Fishing Access, River, Lake | Lakes: 15 |
| weekend-itinerary | recreation, climate | Museum, State Park, Hot Spring, Ski Area | Highlights: 20, Museums shown: 6, within 10 mi |

---

## URL Pattern

All cluster pages follow this pattern:

```
https://treasurestate.com/montana-towns/{slug}/{topic}/
```

Examples for a Bozeman hub:
- `/montana-towns/bozeman/` (hub)
- `/montana-towns/bozeman/cost-of-living/`
- `/montana-towns/bozeman/housing/`
- `/montana-towns/bozeman/jobs/`
- `/montana-towns/bozeman/schools/`
- `/montana-towns/bozeman/hiking/`
- `/montana-towns/bozeman/fishing/`
- `/montana-towns/bozeman/weekend-itinerary/`
