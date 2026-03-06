/**
 * Generates best-of-index.json mapping town slugs to the rankings they appear in.
 * Run before `next build` to enable cross-linking on town profile pages.
 *
 * Output format: { "missoula": ["best-outdoor-recreation", "best-towns-for-families"], ... }
 */
const fs = require('fs');
const path = require('path');

const dataDir = path.resolve(__dirname, '..', 'data');
const load = (f) => {
  const p = path.join(dataDir, f);
  return fs.existsSync(p) ? JSON.parse(fs.readFileSync(p, 'utf8')) : {};
};

const townData = load('town-data.json');
const housing = load('town-housing.json');
const recreation = load('town-recreation.json');
const climate = load('town-climate.json');
const coords = load('town-coordinates.json');
const crime = load('town-crime.json');
const envData = load('town-environmental.json');
const economy = load('town-economy.json');
const healthcare = load('town-healthcare.json');
const airportDist = load('town-airport-distances.json');

function recScore(places) {
  if (!places || places.length === 0) return 0;
  const types = new Set(places.map(p => p.type));
  const diversity = Math.min(types.size / 10, 1) * 3;
  const volume = Math.min(places.length / 80, 1) * 2;
  const qualityTypes = ['National Park', 'Wilderness', 'National Forest', 'Ski Area'];
  const qualityCount = places.filter(p => qualityTypes.includes(p.type)).length;
  const quality = Math.min(qualityCount / 5, 1) * 3;
  const nearest = places[0]?.distMiles ?? 100;
  const proximity = Math.max(0, 1 - nearest / 50) * 2;
  return Math.round((diversity + volume + quality + proximity) * 10) / 10;
}

const allTowns = Object.keys(coords).map(s => {
  const d = townData[s] || {};
  const h = housing[s] || {};
  const rec = recreation[s]?.places || [];
  const clim = climate[s]?.months;
  return {
    slug: s,
    name: d.name || s,
    population: d.population || null,
    medianHomeValue: h.zillowHomeValue ?? h.medianHomeValue ?? null,
    medianRent: h.zillowRent ?? h.medianRent ?? null,
    medianHouseholdIncome: h.medianHouseholdIncome ?? null,
    affordabilityRatio: h.affordabilityRatio ?? null,
    forSaleInventory: h.forSaleInventory ?? null,
    inventoryYoY: h.inventoryYoY ?? null,
    totalHousingUnits: h.totalHousingUnits ?? null,
    vacancyRate: h.vacancyRate ?? null,
    recScore: recScore(rec),
    recPlaces: rec,
    nearestSki: rec.find(p => p.type === 'Ski Area') || null,
    nearestHotSpring: rec.find(p => p.type === 'Hot Spring') || null,
    nearestGlacier: rec.find(p => p.type === 'National Park' && /glacier/i.test(p.name)) || null,
    nearestYellowstone: rec.find(p => p.type === 'National Park' && /yellowstone/i.test(p.name)) || null,
    julHigh: clim?.[6]?.avgHigh ?? null,
    janLow: clim?.[0]?.avgLow ?? null,
    annualSnow: clim ? Math.round(clim.reduce((s, m) => s + (m.snowIn || 0), 0)) : null,
    schoolEnrollment: d.schoolEnrollment || null,
    safetyScore: crime[s]?.safetyScore ?? null,
    environmentalScore: envData[s]?.environmentalScore ?? null,
    unemploymentRate: economy[s]?.unemploymentRate ?? null,
    laborForceParticipation: economy[s]?.laborForceParticipation ?? null,
    jobScore: economy[s]?.jobScore ?? null,
    graduationRate: economy[s]?.graduationRate ?? null,
    schoolScore: economy[s]?.schoolScore ?? null,
    healthcareScore: healthcare[s]?.healthcareScore ?? null,
    nearestAirportMiles: (() => {
      const ap = airportDist[s];
      if (!ap) return null;
      const closest = Object.values(ap).reduce((best, cur) =>
        !best || cur.distanceMiles < best.distanceMiles ? cur : best, null);
      return closest?.distanceMiles ?? null;
    })(),
  };
});

function housingAvailScore(t) {
  const vacScore = t.vacancyRate != null ? Math.min(t.vacancyRate / 3, 3) : 1.5;
  const invScore = t.forSaleInventory != null && t.population
    ? Math.min((t.forSaleInventory / Math.max(t.population, 1)) * 1000 / 5, 3) : 1;
  const yoyBonus = t.inventoryYoY != null && t.inventoryYoY > 0 ? Math.min(t.inventoryYoY / 20, 1) : 0;
  return vacScore + invScore + yoyBonus;
}

const rankings = [
  {
    slug: 'most-affordable-towns', count: 10,
    filter: t => t.affordabilityRatio != null && t.affordabilityRatio > 0 && t.medianHomeValue != null,
    sort: (a, b) => (a.affordabilityRatio ?? 99) - (b.affordabilityRatio ?? 99),
  },
  {
    slug: 'best-outdoor-recreation', count: 10,
    sort: (a, b) => b.recScore - a.recScore,
  },
  {
    slug: 'best-ski-towns', count: 10,
    filter: t => t.nearestSki != null,
    sort: (a, b) => (a.nearestSki?.distMiles ?? 999) - (b.nearestSki?.distMiles ?? 999),
  },
  {
    slug: 'best-fishing-towns', count: 10,
    sort: (a, b) => {
      const fs = (t) => {
        const rivers = t.recPlaces.filter(p => p.type === 'River').length;
        const fas = t.recPlaces.filter(p => p.type === 'Fishing Access').length;
        const lakes = t.recPlaces.filter(p => p.type === 'Lake').length;
        return rivers * 3 + fas * 2 + lakes;
      };
      return fs(b) - fs(a);
    },
  },
  {
    slug: 'towns-near-hot-springs', count: 10,
    filter: t => t.nearestHotSpring != null,
    sort: (a, b) => (a.nearestHotSpring?.distMiles ?? 999) - (b.nearestHotSpring?.distMiles ?? 999),
  },
  {
    slug: 'best-small-towns', count: 10,
    filter: t => t.population != null && t.population < 5000,
    sort: (a, b) => {
      const sc = (t) => {
        const safety = (t.safetyScore ?? 5) * 3;
        const school = (t.schoolScore ?? 5) * 3;
        const housing = housingAvailScore(t) * 2;
        const env = (t.environmentalScore ?? 8) * 2;
        const job = (t.jobScore ?? 5) * 2;
        const rec = t.recScore * 3;
        const afford = t.affordabilityRatio ? Math.max(0, 10 - t.affordabilityRatio) * 2 : 5;
        return safety + school + housing + env + job + rec + afford;
      };
      return sc(b) - sc(a);
    },
  },
  {
    slug: 'best-towns-near-glacier-yellowstone', count: 10,
    filter: t => t.nearestGlacier != null || t.nearestYellowstone != null,
    sort: (a, b) => {
      const dist = (t) => Math.min(t.nearestGlacier?.distMiles ?? 999, t.nearestYellowstone?.distMiles ?? 999);
      return dist(a) - dist(b);
    },
  },
  {
    slug: 'best-towns-for-retirees', count: 10,
    sort: (a, b) => {
      const sc = (t) => {
        const health = (t.healthcareScore ?? 3) * 4;
        const safety = (t.safetyScore ?? 5) * 3;
        const env = (t.environmentalScore ?? 8) * 3;
        const afford = t.affordabilityRatio ? Math.max(0, 10 - t.affordabilityRatio) * 3 : 5;
        const housing = housingAvailScore(t) * 2;
        const climate = t.janLow != null ? Math.min(Math.max(t.janLow + 10, 0), 30) / 30 * 2 : 1;
        const rec = t.recScore * 2;
        const job = (t.jobScore ?? 5) * 1;
        return health + safety + env + afford + housing + climate + rec + job;
      };
      return sc(b) - sc(a);
    },
  },
  {
    slug: 'best-climate', count: 10,
    filter: t => t.janLow != null && t.julHigh != null,
    sort: (a, b) => {
      const sc = (t) => {
        const winter = Math.min(Math.max((t.janLow ?? -20) + 20, 0), 40) / 40 * 3;
        const snow = Math.max(0, 1 - (t.annualSnow ?? 50) / 100) * 2;
        const summer = t.julHigh ? (1 - Math.abs(t.julHigh - 82) / 20) : 0.5;
        return winter + snow + summer;
      };
      return sc(b) - sc(a);
    },
  },
  {
    slug: 'best-towns-for-families', count: 10,
    sort: (a, b) => {
      const sc = (t) => {
        const safety = (t.safetyScore ?? 5) * 4;
        const school = (t.schoolScore ?? 5) * 4;
        const env = (t.environmentalScore ?? 8) * 3;
        const job = (t.jobScore ?? 5) * 3;
        const afford = t.affordabilityRatio ? Math.max(0, 10 - t.affordabilityRatio) * 3 : 5;
        const health = (t.healthcareScore ?? 3) * 2;
        const housing = housingAvailScore(t) * 2;
        const enrollment = t.schoolEnrollment ? Math.min(t.schoolEnrollment / 2000, 1) * 2 : 0.5;
        const rec = t.recScore * 2;
        const pop = t.population ? Math.min(t.population / 20000, 1) : 0.3;
        return safety + school + env + job + afford + health + housing + enrollment + rec + pop;
      };
      return sc(b) - sc(a);
    },
  },
  {
    slug: 'best-towns-for-young-professionals', count: 10,
    filter: t => t.population != null && t.population >= 2000,
    sort: (a, b) => {
      const sc = (t) => {
        const job = (t.jobScore ?? 5) * 5;
        const housing = housingAvailScore(t) * 3;
        const afford = t.affordabilityRatio ? Math.max(0, 10 - t.affordabilityRatio) * 3 : 5;
        const safety = (t.safetyScore ?? 5) * 3;
        const rec = t.recScore * 2;
        const pop = t.population ? Math.min(t.population / 30000, 1) : 0.3;
        const env = (t.environmentalScore ?? 8);
        return job + housing + afford + safety + rec + pop + env;
      };
      return sc(b) - sc(a);
    },
  },
  {
    slug: 'best-housing-availability', count: 10,
    filter: t => t.forSaleInventory != null && t.forSaleInventory > 0 && t.totalHousingUnits != null && t.population != null && t.population > 500,
    sort: (a, b) => housingAvailScore(b) - housingAvailScore(a),
  },
  {
    slug: 'best-towns-for-digital-nomads', count: 10,
    filter: t => t.population != null && t.population >= 2000 && t.affordabilityRatio != null && t.nearestAirportMiles != null,
    sort: (a, b) => {
      const sc = (t) => {
        const internet = Math.min(Math.log10(Math.max(t.population ?? 1, 1)) / Math.log10(100000), 1) * 10;
        const airport = Math.max(10 - (t.nearestAirportMiles ?? 200) / 20, 0);
        const afford = Math.max(8 - (t.affordabilityRatio ?? 8), 0) * 1.25;
        const safety = (t.safetyScore ?? 5);
        const climate = Math.max(((t.janLow ?? -20) + 20), 0) / 4;
        const amenity = Math.min((t.population ?? 0) / 10000, 1) * 5 + (t.healthcareScore ?? 3) * 0.5;
        return internet * 5 + airport * 4 + afford * 3 + t.recScore * 3 + safety * 2 + climate * 2 + amenity;
      };
      return sc(b) - sc(a);
    },
  },
];

const index = {};

for (const ranking of rankings) {
  let filtered = ranking.filter ? allTowns.filter(ranking.filter) : [...allTowns];
  filtered.sort(ranking.sort);
  const top = filtered.slice(0, ranking.count);
  for (const t of top) {
    if (!index[t.slug]) index[t.slug] = [];
    index[t.slug].push(ranking.slug);
  }
}

const outPath = path.join(dataDir, 'best-of-index.json');
fs.writeFileSync(outPath, JSON.stringify(index, null, 2));

const townCount = Object.keys(index).length;
const totalAppearances = Object.values(index).reduce((s, arr) => s + arr.length, 0);
console.log(`Generated best-of-index.json: ${townCount} towns across ${rankings.length} rankings (${totalAppearances} total placements)`);
