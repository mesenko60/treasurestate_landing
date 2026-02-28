const fs = require('fs');
const path = require('path');
const https = require('https');

const CENSUS_URL =
  'https://api.census.gov/data/2023/acs/acs5?get=NAME,B25001_001E,B25002_002E,B25002_003E,B25004_002E&for=place:*&in=state:30';

function fetch(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => resolve(data));
      res.on('error', reject);
    }).on('error', reject);
  });
}

function slugify(name) {
  return name.toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

const ALIASES = {
  'anaconda': 'anaconda-deer lodge',
  'miles-city': 'miles',
  'virginia-city': 'virginia',
  'st-ignatius': 'st ignatius',
  'st-regis': 'st regis',
};

(async () => {
  const dataDir = path.resolve(__dirname, '..', 'data');
  const coords = JSON.parse(fs.readFileSync(path.join(dataDir, 'town-coordinates.json'), 'utf8'));
  const housing = JSON.parse(fs.readFileSync(path.join(dataDir, 'town-housing.json'), 'utf8'));
  const ourSlugs = Object.keys(coords);

  console.log('Fetching Census ACS vacancy data...');
  const raw = await fetch(CENSUS_URL);
  const rows = JSON.parse(raw);
  const data = rows.slice(1);
  console.log(`Census places returned: ${data.length}`);

  const censusMap = {};
  for (const row of data) {
    const fullName = row[0];
    const cleanName = fullName
      .replace(/, Montana$/, '')
      .replace(/ (city|town|CDP|borough|village)$/i, '')
      .replace(/ County$/i, '')
      .trim();
    const slug = slugify(cleanName);

    const totalUnits = parseInt(row[1], 10);
    const occupied = parseInt(row[2], 10);
    const vacant = parseInt(row[3], 10);
    const forSale = parseInt(row[4], 10);

    if (totalUnits > 0) {
      censusMap[slug] = {
        totalHousingUnits: totalUnits,
        occupiedUnits: occupied > 0 ? occupied : null,
        vacantUnits: vacant > 0 ? vacant : null,
        vacantForSale: forSale > 0 ? forSale : null,
        vacancyRate: Math.round(vacant / totalUnits * 1000) / 10,
      };
    }
  }

  let matched = 0;
  let unmatched = [];

  for (const slug of ourSlugs) {
    let entry = censusMap[slug];

    if (!entry) {
      const alias = ALIASES[slug];
      if (alias) entry = censusMap[slugify(alias)];
    }

    if (!entry) {
      const partial = Object.keys(censusMap).find(
        cs => cs.startsWith(slug) || slug.startsWith(cs)
      );
      if (partial) entry = censusMap[partial];
    }

    if (!entry) {
      unmatched.push(slug);
      continue;
    }

    if (!housing[slug]) housing[slug] = {};
    housing[slug].totalHousingUnits = entry.totalHousingUnits;
    housing[slug].occupiedUnits = entry.occupiedUnits;
    housing[slug].vacantUnits = entry.vacantUnits;
    housing[slug].vacantForSale = entry.vacantForSale;
    housing[slug].vacancyRate = entry.vacancyRate;
    housing[slug].censusVacancySource = 'ACS 5-Year 2019-2023';
    matched++;
  }

  console.log(`\nMatched: ${matched}/${ourSlugs.length}`);
  if (unmatched.length > 0) {
    console.log(`Unmatched (${unmatched.length}): ${unmatched.sort().join(', ')}`);
  }

  // Sample output
  ['missoula', 'bozeman', 'whitefish', 'flaxville', 'big-sky'].forEach(s => {
    const h = housing[s];
    if (h) {
      console.log(`\n${h.name || s}:`);
      console.log(`  Housing units: ${h.totalHousingUnits} | Vacant: ${h.vacantUnits} (${h.vacancyRate}%) | For sale: ${h.vacantForSale}`);
      if (h.forSaleInventory) console.log(`  Zillow inventory: ${h.forSaleInventory} | Per 1000: ${h.inventoryPer1000}`);
    }
  });

  fs.writeFileSync(path.join(dataDir, 'town-housing.json'), JSON.stringify(housing, null, 2));
  console.log(`\nSaved to town-housing.json`);

  require('./stamp-freshness').stamp('censusVacancy');
})();
