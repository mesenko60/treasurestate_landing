const fs = require('fs');
const path = require('path');
const https = require('https');

// Helper function to fetch data via HTTPS
function fetchJson(url) {
  return new Promise((resolve, reject) => {
    const options = {
      headers: {
        'User-Agent': 'TreasureStateDirectory/1.0 (contact@treasurestate.com)'
      }
    };
    https.get(url, options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          try {
            resolve(JSON.parse(data));
          } catch (e) {
            reject(e);
          }
        } else {
          reject(new Error(`Request failed with status ${res.statusCode}: ${data}`));
        }
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-')       // Replace spaces with -
    .replace(/[^\w\-]+/g, '')   // Remove all non-word chars
    .replace(/\-\-+/g, '-')     // Replace multiple - with single -
    .replace(/^-+/, '')         // Trim - from start of text
    .replace(/-+$/, '');        // Trim - from end of text
}

async function geocodeTowns() {
  const listPath = path.resolve(__dirname, '..', '..', 'cities_towns_list', 'towns.txt');
  const outPath = path.resolve(__dirname, '..', 'data', 'town-coordinates.json');
  
  // Ensure data dir exists
  const dataDir = path.dirname(outPath);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  let existingData = {};
  if (fs.existsSync(outPath)) {
    existingData = JSON.parse(fs.readFileSync(outPath, 'utf8'));
  }

  const raw = fs.readFileSync(listPath, 'utf8');
  const towns = raw.split(/\r?\n/).map(line => line.trim()).filter(Boolean);

  const newCoordinates = { ...existingData };
  let fetchCount = 0;

  console.log(`Starting geocoding for ${towns.length} towns...`);

  for (const town of towns) {
    const slug = slugify(town);
    if (newCoordinates[slug]) {
      // Already geocoded
      continue;
    }

    console.log(`Geocoding ${town}, Montana...`);
    const query = encodeURIComponent(`${town}, Montana, USA`);
    const url = `https://nominatim.openstreetmap.org/search?q=${query}&format=json&limit=1`;

    try {
      const results = await fetchJson(url);
      if (results && results.length > 0) {
        newCoordinates[slug] = {
          name: town,
          lat: parseFloat(results[0].lat),
          lng: parseFloat(results[0].lon)
        };
        console.log(`  -> Found: ${results[0].lat}, ${results[0].lon}`);
      } else {
        console.log(`  -> No results found.`);
      }
      fetchCount++;

      // Save incrementally
      fs.writeFileSync(outPath, JSON.stringify(newCoordinates, null, 2));

      // Respect API rate limits (1 request per second max)
      await new Promise(r => setTimeout(r, 1200));
    } catch (err) {
      console.error(`  -> Error geocoding ${town}: ${err.message}`);
    }
  }

  console.log(`\nGeocoding complete! Fetched ${fetchCount} new locations.`);
  console.log(`Total locations saved: ${Object.keys(newCoordinates).length}`);
}

geocodeTowns().catch(console.error);
