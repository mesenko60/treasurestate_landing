const fs = require('fs');
const path = require('path');
const https = require('https');

const BASE_URL = 'https://beautifydata.com/united-states-crimes/fbi-ucr/2023/total-violent-and-property-crimes-per-city/montana/';

const FBI_CITIES = [
  'baker', 'belgrade', 'billings', 'bozeman', 'bridger', 'chinook',
  'colstrip', 'columbia-falls', 'columbus', 'conrad', 'cut-bank',
  'darby', 'deer-lodge', 'dillon', 'east-helena', 'ennis', 'glasgow',
  'glendive', 'great-falls', 'hamilton', 'hardin', 'havre',
  'helena', 'hot-springs', 'kalispell', 'laurel', 'lewistown',
  'libby', 'livingston', 'manhattan', 'miles-city', 'missoula',
  'plains', 'polson', 'ronan-city', 'sidney', 'stevensville',
  'st-ignatius', 'thompson-falls', 'troy', 'west-yellowstone',
  'whitefish', 'wolf-point',
];

const SLUG_MAP = {
  'ronan-city': 'ronan',
  'st-ignatius': 'st-ignatius',
};

function fetch(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0', 'Accept': 'text/html' } }, (res) => {
      if (res.statusCode !== 200) { reject(new Error(`HTTP ${res.statusCode}`)); res.resume(); return; }
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => resolve(data));
      res.on('error', reject);
    }).on('error', reject);
  });
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

(async () => {
  const dataDir = path.resolve(__dirname, '..', 'data');
  const results = {};
  let success = 0;
  let failed = 0;

  for (const city of FBI_CITIES) {
    const url = BASE_URL + city;
    try {
      const html = await fetch(url);
      const cells = [...html.matchAll(/<td[^>]*>([^<]+)<\/td>/g)].map(m => m[1].trim());

      let violent = null, violentRate = null, property = null, propertyRate = null;
      for (let i = 0; i < cells.length - 2; i++) {
        if (cells[i].includes('Violent')) {
          violent = parseInt(cells[i + 1].replace(/,/g, ''));
          violentRate = parseFloat(cells[i + 2].replace(/,/g, ''));
        }
        if (cells[i].includes('Property')) {
          property = parseInt(cells[i + 1].replace(/,/g, ''));
          propertyRate = parseFloat(cells[i + 2].replace(/,/g, ''));
        }
      }

      const ourSlug = SLUG_MAP[city] || city;
      if (violentRate != null || propertyRate != null) {
        results[ourSlug] = {
          violentCrimes: violent,
          violentCrimeRate: violentRate,
          propertyCrimes: property,
          propertyCrimeRate: propertyRate,
          totalCrimeRate: Math.round(((violentRate || 0) + (propertyRate || 0)) * 100) / 100,
          source: 'FBI UCR 2023',
        };
        success++;
        console.log(`  ${ourSlug}: violent=${violentRate} property=${propertyRate} total=${results[ourSlug].totalCrimeRate}`);
      } else {
        console.log(`  ${city}: no data found`);
        failed++;
      }
    } catch (e) {
      console.log(`  ${city}: ERROR - ${e.message}`);
      failed++;
    }
    await sleep(300);
  }

  console.log(`\n=== Summary ===`);
  console.log(`Success: ${success}, Failed: ${failed}`);

  // Compute safety score (0-10, 10 = safest)
  const rates = Object.values(results).map(r => r.totalCrimeRate).filter(Boolean);
  const maxRate = Math.max(...rates);
  const minRate = Math.min(...rates);
  for (const [slug, data] of Object.entries(results)) {
    const normalized = (data.totalCrimeRate - minRate) / (maxRate - minRate);
    data.safetyScore = Math.max(0, Math.min(10, Math.round((1 - normalized) * 100) / 10));
  }

  // Sort by safety
  const sorted = Object.entries(results).sort((a, b) => b[1].safetyScore - a[1].safetyScore);
  console.log('\nSafest towns:');
  sorted.slice(0, 10).forEach(([s, d]) => console.log(`  ${s}: safety=${d.safetyScore}/10 (total rate: ${d.totalCrimeRate})`));
  console.log('\nHighest crime:');
  sorted.slice(-5).forEach(([s, d]) => console.log(`  ${s}: safety=${d.safetyScore}/10 (total rate: ${d.totalCrimeRate})`));

  const outPath = path.join(dataDir, 'town-crime.json');
  fs.writeFileSync(outPath, JSON.stringify(results, null, 2));
  console.log(`\nSaved to ${outPath}`);

  require('./stamp-freshness').stamp('crime');
})();
