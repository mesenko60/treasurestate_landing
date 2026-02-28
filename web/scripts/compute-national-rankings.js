const fs = require('fs');
const path = require('path');
const https = require('https');

const ZHVI_URL = 'https://files.zillowstatic.com/research/public_csvs/zhvi/City_zhvi_uc_sfrcondo_tier_0.33_0.67_sm_sa_month.csv';
const CENSUS_URL = 'https://api.census.gov/data/2023/acs/acs5?get=NAME,B25077_001E,B25064_001E,B19013_001E&for=place:*&in=state:*';

function fetch(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return fetch(res.headers.location).then(resolve).catch(reject);
      }
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => resolve(data));
      res.on('error', reject);
    }).on('error', reject);
  });
}

function parseCSV(text) {
  const lines = text.split('\n');
  const headers = lines[0].split(',').map(h => h.replace(/"/g, '').trim());
  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    const vals = [];
    let current = '';
    let inQuotes = false;
    for (const ch of line) {
      if (ch === '"') { inQuotes = !inQuotes; continue; }
      if (ch === ',' && !inQuotes) { vals.push(current.trim()); current = ''; continue; }
      current += ch;
    }
    vals.push(current.trim());
    const obj = {};
    headers.forEach((h, idx) => { obj[h] = vals[idx] || ''; });
    rows.push(obj);
  }
  return { headers, rows };
}

function percentile(value, sortedArray) {
  let below = 0;
  for (const v of sortedArray) {
    if (v < value) below++;
    else break;
  }
  return Math.round((below / sortedArray.length) * 100);
}

function slugify(name) {
  return name.toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

(async () => {
  const housingPath = path.resolve(__dirname, '..', 'data', 'town-housing.json');
  const coordsPath = path.resolve(__dirname, '..', 'data', 'town-coordinates.json');
  const housing = JSON.parse(fs.readFileSync(housingPath, 'utf8'));
  const coords = JSON.parse(fs.readFileSync(coordsPath, 'utf8'));
  const ourSlugs = Object.keys(coords);

  const SLUG_ALIASES = {
    'anaconda-deer lodge county': 'anaconda',
    'east helena valley': 'east-helena',
  };

  // === 1. Build national Zillow home value distribution ===
  console.log('Downloading national Zillow ZHVI data...');
  const zhviText = await fetch(ZHVI_URL);
  const { headers: zhviHeaders, rows: zhviRows } = parseCSV(zhviText);
  const dateKeys = zhviHeaders.filter(h => /^\d{4}-\d{2}-\d{2}$/.test(h)).sort();
  const latestDateKey = dateKeys[dateKeys.length - 1];

  const allZhviValues = [];
  const mtZhviMap = {};
  for (const row of zhviRows) {
    const val = parseFloat(row[latestDateKey]);
    if (!isNaN(val) && val > 0) {
      allZhviValues.push(val);
      if (row.State === 'MT') {
        let slug = slugify(row.RegionName);
        if (SLUG_ALIASES[slug]) slug = SLUG_ALIASES[slug];
        mtZhviMap[slug] = val;
      }
    }
  }
  allZhviValues.sort((a, b) => a - b);
  console.log(`  National cities with ZHVI: ${allZhviValues.length}`);
  console.log(`  Latest date: ${latestDateKey}`);
  console.log(`  National median: $${Math.round(allZhviValues[Math.floor(allZhviValues.length / 2)]).toLocaleString()}`);

  // === 2. Build national Census distributions ===
  console.log('\nDownloading national Census ACS data...');
  const censusRaw = await fetch(CENSUS_URL);
  const censusRows = JSON.parse(censusRaw);
  const censusData = censusRows.slice(1);
  console.log(`  National places: ${censusData.length}`);

  const allHomeValues = [];
  const allRents = [];
  const allIncomes = [];

  for (const row of censusData) {
    const homeVal = parseInt(row[1], 10);
    const rent = parseInt(row[2], 10);
    const income = parseInt(row[3], 10);
    if (homeVal > 0) allHomeValues.push(homeVal);
    if (rent > 0) allRents.push(rent);
    if (income > 0) allIncomes.push(income);
  }

  allHomeValues.sort((a, b) => a - b);
  allRents.sort((a, b) => a - b);
  allIncomes.sort((a, b) => a - b);

  console.log(`  Places with home values: ${allHomeValues.length}`);
  console.log(`  Places with rent data: ${allRents.length}`);
  console.log(`  Places with income data: ${allIncomes.length}`);
  console.log(`  National median home value (Census): $${allHomeValues[Math.floor(allHomeValues.length / 2)].toLocaleString()}`);
  console.log(`  National median rent (Census): $${allRents[Math.floor(allRents.length / 2)].toLocaleString()}`);
  console.log(`  National median income (Census): $${allIncomes[Math.floor(allIncomes.length / 2)].toLocaleString()}`);

  // === 3. Compute rankings for our towns ===
  console.log('\nComputing national rankings for Montana towns...');
  let ranked = 0;
  for (const slug of ourSlugs) {
    if (!housing[slug]) continue;
    const h = housing[slug];

    // Zillow home value percentile (preferred, most current)
    const zhvi = mtZhviMap[slug] || h.zillowHomeValue;
    if (zhvi) {
      h.homeValuePercentile = percentile(zhvi, allZhviValues);
    } else if (h.medianHomeValue) {
      h.homeValuePercentile = percentile(h.medianHomeValue, allHomeValues);
    }

    // Rent percentile
    const rent = h.zillowRent || h.medianRent;
    if (rent) {
      h.rentPercentile = percentile(rent, allRents);
    }

    // Income percentile
    if (h.medianHouseholdIncome) {
      h.incomePercentile = percentile(h.medianHouseholdIncome, allIncomes);
    }

    // Affordability percentile (lower = more affordable, so we invert)
    const homeVal = zhvi || h.zillowHomeValue || h.medianHomeValue;
    if (homeVal && h.medianHouseholdIncome) {
      const ratio = homeVal / h.medianHouseholdIncome;
      h.affordabilityRatio = parseFloat(ratio.toFixed(1));
    }

    h.nationalRankingsSource = `Zillow ZHVI (${latestDateKey}) + Census ACS 2023`;
    ranked++;
  }

  console.log(`  Ranked: ${ranked}/134`);

  // === 4. Show sample results ===
  console.log('\n=== Sample Rankings ===');
  console.log('Town                  | Home Value %ile | Rent %ile | Income %ile | Afford. Ratio');
  console.log('---                   | ---             | ---       | ---         | ---');
  for (const s of ['bozeman', 'missoula', 'billings', 'whitefish', 'helena', 'great-falls', 'red-lodge', 'glasgow', 'circle']) {
    const h = housing[s];
    if (!h) continue;
    const name = (s + '                    ').slice(0, 21);
    const hv = h.homeValuePercentile != null ? `${h.homeValuePercentile}th` : 'N/A';
    const rv = h.rentPercentile != null ? `${h.rentPercentile}th` : 'N/A';
    const iv = h.incomePercentile != null ? `${h.incomePercentile}th` : 'N/A';
    const ar = h.affordabilityRatio || 'N/A';
    console.log(`${name} | ${hv.padEnd(15)} | ${rv.padEnd(9)} | ${iv.padEnd(11)} | ${ar}x`);
  }

  fs.writeFileSync(housingPath, JSON.stringify(housing, null, 2));
  console.log(`\nSaved rankings to ${housingPath}`);
})();
