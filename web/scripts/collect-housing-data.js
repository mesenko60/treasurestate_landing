const fs = require('fs');
const path = require('path');
const https = require('https');

const CENSUS_URL =
  'https://api.census.gov/data/2023/acs/acs5?get=NAME,B25077_001E,B25064_001E,B19013_001E&for=place:*&in=state:30';

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
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

(async () => {
  const coordsPath = path.resolve(__dirname, '..', 'data', 'town-coordinates.json');
  const coords = JSON.parse(fs.readFileSync(coordsPath, 'utf8'));
  const ourSlugs = new Set(Object.keys(coords));

  console.log(`Fetching Census ACS 2023 housing data for Montana...`);
  const raw = await fetch(CENSUS_URL);
  const rows = JSON.parse(raw);
  const header = rows[0];
  const data = rows.slice(1);

  console.log(`Got ${data.length} Census places`);

  // Census NAME format: "Missoula city, Montana" or "Alberton town, Montana"
  // Strip the type suffix and state to get the town name
  const censusMap = {};
  for (const row of data) {
    const fullName = row[0];
    const cleanName = fullName
      .replace(/, Montana$/, '')
      .replace(/ (city|town|CDP|borough|village)$/i, '')
      .replace(/ County$/i, '')
      .trim();
    const slug = slugify(cleanName);
    const medianHomeValue = parseInt(row[1], 10);
    const medianRent = parseInt(row[2], 10);
    const medianIncome = parseInt(row[3], 10);

    censusMap[slug] = {
      name: cleanName,
      medianHomeValue: medianHomeValue > 0 ? medianHomeValue : null,
      medianRent: medianRent > 0 ? medianRent : null,
      medianHouseholdIncome: medianIncome > 0 ? medianIncome : null,
      source: 'US Census ACS 2023 (5-year)',
    };
  }

  // Special mappings for names that don't match directly
  const ALIASES = {
    'anaconda': 'anaconda-deer lodge',
    'west-yellowstone': 'west yellowstone',
    'big-sky': 'big sky',
    'big-timber': 'big timber',
    'columbus': 'columbus',
    'three-forks': 'three forks',
    'twin-bridges': 'twin bridges',
    'white-sulphur-springs': 'white sulphur springs',
    'wolf-point': 'wolf point',
    'cut-bank': 'cut bank',
    'red-lodge': 'red lodge',
    'miles-city': 'miles',
    'fort-benton': 'fort benton',
    'deer-lodge': 'deer lodge',
    'hot-springs': 'hot springs',
    'hungry-horse': 'hungry horse',
    'east-helena': 'east helena',
    'west-glacier': 'west glacier',
    'st-ignatius': 'st ignatius',
    'st-regis': 'st regis',
    'thompson-falls': 'thompson falls',
    'columbia-falls': 'columbia falls',
    'superior': 'superior',
    'virginia-city': 'virginia',
  };

  const results = {};
  let matched = 0;
  let unmatched = [];

  for (const slug of ourSlugs) {
    // Try direct slug match
    if (censusMap[slug]) {
      results[slug] = censusMap[slug];
      matched++;
      continue;
    }

    // Try alias
    const alias = ALIASES[slug];
    if (alias) {
      const aliasSlug = slugify(alias);
      if (censusMap[aliasSlug]) {
        results[slug] = { ...censusMap[aliasSlug], name: coords[slug]?.name || slug };
        matched++;
        continue;
      }
    }

    // Try partial match: find census entry whose slug starts with our slug
    const partialMatch = Object.keys(censusMap).find(
      (cs) => cs.startsWith(slug) || slug.startsWith(cs)
    );
    if (partialMatch && censusMap[partialMatch]) {
      results[slug] = { ...censusMap[partialMatch], name: coords[slug]?.name || slug };
      matched++;
      continue;
    }

    unmatched.push(slug);
  }

  console.log(`\nMatched: ${matched}/${ourSlugs.size}`);
  if (unmatched.length > 0) {
    console.log(`Unmatched (${unmatched.length}):`);
    for (const s of unmatched.sort()) {
      console.log(`  - ${s}`);
    }
  }

  // Show data coverage
  let hasHome = 0, hasRent = 0, hasIncome = 0;
  for (const entry of Object.values(results)) {
    if (entry.medianHomeValue) hasHome++;
    if (entry.medianRent) hasRent++;
    if (entry.medianHouseholdIncome) hasIncome++;
  }
  console.log(`\nData coverage among matched towns:`);
  console.log(`  Median Home Value: ${hasHome}/${matched}`);
  console.log(`  Median Rent:       ${hasRent}/${matched}`);
  console.log(`  Median Income:     ${hasIncome}/${matched}`);

  const outPath = path.resolve(__dirname, '..', 'data', 'town-housing.json');
  fs.writeFileSync(outPath, JSON.stringify(results, null, 2));
  console.log(`\nSaved to ${outPath}`);
})();
