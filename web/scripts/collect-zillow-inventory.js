const fs = require('fs');
const path = require('path');
const https = require('https');

const INVENTORY_URL = 'https://files.zillowstatic.com/research/public_csvs/invt_fs/City_invt_fs_uc_sfrcondo_sm_month.csv';
const NEW_LISTINGS_URL = 'https://files.zillowstatic.com/research/public_csvs/new_listings/City_new_listings_uc_sfrcondo_sm_month.csv';
const MED_LIST_PRICE_URL = 'https://files.zillowstatic.com/research/public_csvs/mlp/City_mlp_uc_sfrcondo_sm_month.csv';

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
  return { headers, rows };
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

function getYearAgoValue(row, headers, latestDate) {
  if (!latestDate) return null;
  const y = parseInt(latestDate.slice(0, 4)) - 1;
  const rest = latestDate.slice(4);
  const target = y + rest;
  const dateKeys = headers.filter(h => /^\d{4}-\d{2}-\d{2}$/.test(h)).sort();
  const idx = dateKeys.indexOf(target);
  if (idx >= 0) {
    const val = parseFloat(row[dateKeys[idx]]);
    if (!isNaN(val) && val > 0) return val;
  }
  return null;
}

const SLUG_ALIASES = {
  'anaconda-deer lodge county': 'anaconda',
  'east helena valley': 'east-helena',
};

(async () => {
  const dataDir = path.resolve(__dirname, '..', 'data');
  const coords = JSON.parse(fs.readFileSync(path.join(dataDir, 'town-coordinates.json'), 'utf8'));
  const townData = JSON.parse(fs.readFileSync(path.join(dataDir, 'town-data.json'), 'utf8'));
  const housing = JSON.parse(fs.readFileSync(path.join(dataDir, 'town-housing.json'), 'utf8'));
  const ourSlugs = Object.keys(coords);

  // ─── For-Sale Inventory ─────────────────────────────────
  console.log('Downloading for-sale inventory...');
  const invText = await download(INVENTORY_URL);
  const inv = parseCSV(invText);
  const mtInv = inv.rows.filter(r => r.State === 'MT');
  console.log(`  Montana cities: ${mtInv.length}`);

  let invMatched = 0;
  for (const row of mtInv) {
    let slug = slugify(row.RegionName);
    if (SLUG_ALIASES[slug]) slug = SLUG_ALIASES[slug];
    if (!ourSlugs.includes(slug)) continue;

    const latest = getLatestValue(row, inv.headers);
    if (!latest) continue;

    const yearAgo = getYearAgoValue(row, inv.headers, latest.date);
    const yoyChange = yearAgo ? Math.round((latest.value - yearAgo) / yearAgo * 1000) / 10 : null;

    const pop = townData[slug]?.population;
    const perCapita = pop ? Math.round(latest.value / pop * 1000 * 10) / 10 : null;

    if (!housing[slug]) housing[slug] = {};
    housing[slug].forSaleInventory = latest.value;
    housing[slug].forSaleInventoryDate = latest.date;
    if (yoyChange !== null) housing[slug].inventoryYoY = yoyChange;
    if (perCapita !== null) housing[slug].inventoryPer1000 = perCapita;
    invMatched++;
  }
  console.log(`  Matched: ${invMatched}`);

  // ─── New Listings ───────────────────────────────────────
  console.log('\nDownloading new listings...');
  const nlText = await download(NEW_LISTINGS_URL);
  const nl = parseCSV(nlText);
  const mtNl = nl.rows.filter(r => r.State === 'MT');
  console.log(`  Montana cities: ${mtNl.length}`);

  let nlMatched = 0;
  for (const row of mtNl) {
    let slug = slugify(row.RegionName);
    if (SLUG_ALIASES[slug]) slug = SLUG_ALIASES[slug];
    if (!ourSlugs.includes(slug)) continue;

    const latest = getLatestValue(row, nl.headers);
    if (!latest) continue;

    if (!housing[slug]) housing[slug] = {};
    housing[slug].newListings = latest.value;
    housing[slug].newListingsDate = latest.date;
    nlMatched++;
  }
  console.log(`  Matched: ${nlMatched}`);

  // ─── Median List Price ──────────────────────────────────
  console.log('\nDownloading median list price...');
  const mlpText = await download(MED_LIST_PRICE_URL);
  const mlp = parseCSV(mlpText);
  const mtMlp = mlp.rows.filter(r => r.State === 'MT');
  console.log(`  Montana cities: ${mtMlp.length}`);

  let mlpMatched = 0;
  for (const row of mtMlp) {
    let slug = slugify(row.RegionName);
    if (SLUG_ALIASES[slug]) slug = SLUG_ALIASES[slug];
    if (!ourSlugs.includes(slug)) continue;

    const latest = getLatestValue(row, mlp.headers);
    if (!latest) continue;

    if (!housing[slug]) housing[slug] = {};
    housing[slug].medianListPrice = latest.value;
    housing[slug].medianListPriceDate = latest.date;
    mlpMatched++;
  }
  console.log(`  Matched: ${mlpMatched}`);

  // ─── Summary ────────────────────────────────────────────
  console.log('\n=== Coverage Summary ===');
  let hasInv = 0, hasNl = 0, hasMlp = 0;
  for (const slug of ourSlugs) {
    if (housing[slug]?.forSaleInventory) hasInv++;
    if (housing[slug]?.newListings) hasNl++;
    if (housing[slug]?.medianListPrice) hasMlp++;
  }
  console.log(`For-sale inventory: ${hasInv}/${ourSlugs.length}`);
  console.log(`New listings:       ${hasNl}/${ourSlugs.length}`);
  console.log(`Median list price:  ${hasMlp}/${ourSlugs.length}`);

  // Show some samples
  console.log('\nSample — Missoula:');
  const m = housing['missoula'];
  console.log(`  Inventory: ${m.forSaleInventory} homes (${m.inventoryPer1000}/1000 residents)`);
  console.log(`  YoY change: ${m.inventoryYoY}%`);
  console.log(`  New listings: ${m.newListings}`);
  console.log(`  Median list price: $${m.medianListPrice?.toLocaleString()}`);

  console.log('\nSample — Bozeman:');
  const b = housing['bozeman'];
  console.log(`  Inventory: ${b.forSaleInventory} homes (${b.inventoryPer1000}/1000 residents)`);
  console.log(`  YoY change: ${b.inventoryYoY}%`);
  console.log(`  New listings: ${b.newListings}`);
  console.log(`  Median list price: $${b.medianListPrice?.toLocaleString()}`);

  fs.writeFileSync(path.join(dataDir, 'town-housing.json'), JSON.stringify(housing, null, 2));
  console.log(`\nSaved to town-housing.json`);
})();
