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

// Montana regions based on longitude bands
function getRegion(lng) {
  if (lng <= -112.5) return 'Western';
  if (lng <= -108.5) return 'Central';
  return 'Eastern';
}

async function buildTownData() {
  const coordsPath = path.resolve(__dirname, '..', 'data', 'town-coordinates.json');
  const outPath = path.resolve(__dirname, '..', 'data', 'town-data.json');

  const coordinates = JSON.parse(fs.readFileSync(coordsPath, 'utf8'));
  
  let existing = {};
  if (fs.existsSync(outPath)) {
    existing = JSON.parse(fs.readFileSync(outPath, 'utf8'));
  }

  const results = { ...existing };
  const slugs = Object.keys(coordinates);

  console.log(`Building data for ${slugs.length} towns...`);

  for (const slug of slugs) {
    if (results[slug] && results[slug].elevation != null) {
      continue; // Already have data
    }

    const town = coordinates[slug];
    console.log(`Fetching data for ${town.name}...`);

    let elevation = null;
    let county = null;

    // Fetch elevation from open-meteo (free, no key needed)
    try {
      const elevUrl = `https://api.open-meteo.com/v1/elevation?latitude=${town.lat}&longitude=${town.lng}`;
      const elevData = await fetchJson(elevUrl);
      if (elevData && elevData.elevation && elevData.elevation.length > 0) {
        elevation = Math.round(elevData.elevation[0] * 3.28084); // meters to feet
      }
    } catch (err) {
      console.error(`  Elevation error for ${town.name}: ${err.message}`);
    }

    // Fetch county from Nominatim reverse geocoding
    try {
      const revUrl = `https://nominatim.openstreetmap.org/reverse?lat=${town.lat}&lon=${town.lng}&format=json&zoom=10`;
      const revData = await fetchJson(revUrl);
      if (revData && revData.address) {
        county = revData.address.county || null;
      }
    } catch (err) {
      console.error(`  County error for ${town.name}: ${err.message}`);
    }

    results[slug] = {
      name: town.name,
      lat: town.lat,
      lng: town.lng,
      elevation: elevation,
      county: county,
      region: getRegion(town.lng)
    };

    // Save incrementally
    fs.writeFileSync(outPath, JSON.stringify(results, null, 2));

    // Rate limit (Nominatim requires 1 req/sec)
    await new Promise(r => setTimeout(r, 1200));
  }

  console.log(`\nData collection complete for ${Object.keys(results).length} towns.`);
}

buildTownData().catch(console.error);
