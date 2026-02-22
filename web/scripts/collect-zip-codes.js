const fs = require('fs');
const path = require('path');
const https = require('https');

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    const options = {
      headers: { 'User-Agent': 'TreasureStateDirectory/1.0 (contact@treasurestate.com)' }
    };
    https.get(url, options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          try { resolve(JSON.parse(data)); } catch (e) { reject(e); }
        } else {
          reject(new Error(`Status ${res.statusCode}: ${data.substring(0, 200)}`));
        }
      });
    }).on('error', reject);
  });
}

async function collectZipCodes() {
  const dataPath = path.resolve(__dirname, '..', 'data', 'town-data.json');
  const townData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
  const slugs = Object.keys(townData);

  console.log(`Collecting zip codes for ${slugs.length} towns...`);

  let updated = 0;
  for (const slug of slugs) {
    const town = townData[slug];

    if (town.zipCode) {
      continue;
    }

    console.log(`Fetching zip for ${town.name}...`);

    try {
      const url = `https://nominatim.openstreetmap.org/reverse?lat=${town.lat}&lon=${town.lng}&format=json&zoom=18&addressdetails=1`;
      const data = await fetchJson(url);

      if (data && data.address && data.address.postcode) {
        town.zipCode = data.address.postcode;
      } else {
        console.log(`  No zip found for ${town.name}`);
        town.zipCode = null;
      }
    } catch (err) {
      console.error(`  Error for ${town.name}: ${err.message}`);
      town.zipCode = null;
    }

    // All Montana towns share these
    town.areaCode = '406';
    town.timeZone = 'Mountain Time (MT)';

    updated++;
    fs.writeFileSync(dataPath, JSON.stringify(townData, null, 2));

    // Nominatim rate limit
    await new Promise(r => setTimeout(r, 1200));
  }

  // Ensure all towns have area code and time zone even if zip was already present
  for (const slug of slugs) {
    if (!townData[slug].areaCode) townData[slug].areaCode = '406';
    if (!townData[slug].timeZone) townData[slug].timeZone = 'Mountain Time (MT)';
  }
  fs.writeFileSync(dataPath, JSON.stringify(townData, null, 2));

  console.log(`\nDone. Updated ${updated} towns.`);
}

collectZipCodes().catch(console.error);
