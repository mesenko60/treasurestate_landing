const fs = require('fs');
const path = require('path');
const https = require('https');

const ZHVI_URL = 'https://files.zillowstatic.com/research/public_csvs/zhvi/City_zhvi_uc_sfrcondo_tier_0.33_0.67_sm_sa_month.csv';
const ZORI_URL = 'https://files.zillowstatic.com/research/public_csvs/zori/City_zori_uc_sfrcondomfr_sm_sa_month.csv';

function download(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return download(res.headers.location).then(resolve).catch(reject);
      }
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
  return rows;
}

function getLatestValue(row, headers) {
  const dateKeys = headers.filter(h => /^\d{4}-\d{2}-\d{2}$/.test(h)).sort();
  for (let i = dateKeys.length - 1; i >= 0; i--) {
    const val = parseFloat(row[dateKeys[i]]);
    if (!isNaN(val) && val > 0) {
      return { value: Math.round(val), date: dateKeys[i] };
    }
  }
  return null;
}

(async () => {
  const coordsPath = path.resolve(__dirname, '..', 'data', 'town-coordinates.json');
  const housingPath = path.resolve(__dirname, '..', 'data', 'town-housing.json');
  const coords = JSON.parse(fs.readFileSync(coordsPath, 'utf8'));
  const housing = JSON.parse(fs.readFileSync(housingPath, 'utf8'));
  const ourSlugs = Object.keys(coords);

  const SLUG_ALIASES = {
    'anaconda-deer lodge county': 'anaconda',
    'east helena valley': 'east-helena',
  };

  // --- ZHVI (home values) ---
  console.log('Downloading Zillow ZHVI (home values)...');
  const zhviText = await download(ZHVI_URL);
  const zhviHeaders = zhviText.split('\n')[0].split(',').map(h => h.replace(/"/g, '').trim());
  const zhviRows = parseCSV(zhviText);
  const mtZhvi = zhviRows.filter(r => r.State === 'MT');

  console.log(`  Montana cities in ZHVI: ${mtZhvi.length}`);

  let zhviMatched = 0;
  let zhviDate = '';
  for (const row of mtZhvi) {
    const cityName = row.RegionName;
    let slug = slugify(cityName);
    if (SLUG_ALIASES[slug]) slug = SLUG_ALIASES[slug];

    if (!ourSlugs.includes(slug)) continue;

    const latest = getLatestValue(row, zhviHeaders);
    if (!latest) continue;

    if (!housing[slug]) housing[slug] = { source: 'Zillow' };
    housing[slug].zillowHomeValue = latest.value;
    housing[slug].zillowHomeValueDate = latest.date;
    zhviDate = latest.date;
    zhviMatched++;
  }
  console.log(`  Matched to our towns: ${zhviMatched}`);
  console.log(`  Latest data date: ${zhviDate}`);

  // --- ZORI (rent) ---
  console.log('\nDownloading Zillow ZORI (rent)...');
  const zoriText = await download(ZORI_URL);
  const zoriHeaders = zoriText.split('\n')[0].split(',').map(h => h.replace(/"/g, '').trim());
  const zoriRows = parseCSV(zoriText);
  const mtZori = zoriRows.filter(r => r.State === 'MT');

  console.log(`  Montana cities in ZORI: ${mtZori.length}`);

  let zoriMatched = 0;
  let zoriDate = '';
  for (const row of mtZori) {
    const cityName = row.RegionName;
    let slug = slugify(cityName);
    if (SLUG_ALIASES[slug]) slug = SLUG_ALIASES[slug];

    if (!ourSlugs.includes(slug)) continue;

    const latest = getLatestValue(row, zoriHeaders);
    if (!latest) continue;

    if (!housing[slug]) housing[slug] = { source: 'Zillow' };
    housing[slug].zillowRent = latest.value;
    housing[slug].zillowRentDate = latest.date;
    zoriDate = latest.date;
    zoriMatched++;
  }
  console.log(`  Matched to our towns: ${zoriMatched}`);
  console.log(`  Latest data date: ${zoriDate}`);

  // Summary
  console.log('\n=== Coverage Summary ===');
  let hasZhvi = 0, hasZori = 0, hasCensusHome = 0;
  for (const slug of ourSlugs) {
    if (housing[slug]?.zillowHomeValue) hasZhvi++;
    if (housing[slug]?.zillowRent) hasZori++;
    if (housing[slug]?.medianHomeValue) hasCensusHome++;
  }
  console.log(`Census home value: ${hasCensusHome}/134`);
  console.log(`Zillow home value: ${hasZhvi}/134`);
  console.log(`Zillow rent:       ${hasZori}/134`);

  fs.writeFileSync(housingPath, JSON.stringify(housing, null, 2));
  console.log(`\nSaved updated housing data to ${housingPath}`);
})();
