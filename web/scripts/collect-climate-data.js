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
          reject(new Error(`Status ${res.statusCode}: ${data.substring(0, 300)}`));
        }
      });
    }).on('error', reject);
  });
}

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

async function collectClimateData() {
  const coordsPath = path.resolve(__dirname, '..', 'data', 'town-coordinates.json');
  const outPath = path.resolve(__dirname, '..', 'data', 'town-climate.json');

  const coordinates = JSON.parse(fs.readFileSync(coordsPath, 'utf8'));

  let existing = {};
  if (fs.existsSync(outPath)) {
    existing = JSON.parse(fs.readFileSync(outPath, 'utf8'));
  }

  const results = { ...existing };
  const slugs = Object.keys(coordinates);

  console.log(`Collecting climate data for ${slugs.length} towns...`);

  for (const slug of slugs) {
    if (results[slug]) {
      continue;
    }

    const town = coordinates[slug];
    console.log(`Fetching climate for ${town.name}...`);

    try {
      // Use Open-Meteo Historical Weather API with daily aggregation over 5 years
      const url = `https://archive-api.open-meteo.com/v1/archive?latitude=${town.lat}&longitude=${town.lng}&start_date=2019-01-01&end_date=2023-12-31&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,snowfall_sum&temperature_unit=fahrenheit&precipitation_unit=inch&timezone=America/Denver`;

      const data = await fetchJson(url);

      if (data && data.daily) {
        const times = data.daily.time || [];
        const highs = data.daily.temperature_2m_max || [];
        const lows = data.daily.temperature_2m_min || [];
        const precip = data.daily.precipitation_sum || [];
        const snow = data.daily.snowfall_sum || [];

        // Aggregate by month
        const monthlyHighs = new Array(12).fill(0);
        const monthlyLows = new Array(12).fill(0);
        const monthlyPrecip = new Array(12).fill(0);
        const monthlySnow = new Array(12).fill(0);
        const monthlyCounts = new Array(12).fill(0);

        for (let i = 0; i < times.length; i++) {
          const monthIdx = new Date(times[i] + 'T12:00:00').getMonth();
          if (highs[i] != null) monthlyHighs[monthIdx] += highs[i];
          if (lows[i] != null) monthlyLows[monthIdx] += lows[i];
          if (precip[i] != null) monthlyPrecip[monthIdx] += precip[i];
          if (snow[i] != null) monthlySnow[monthIdx] += snow[i];
          monthlyCounts[monthIdx]++;
        }

        const months = [];
        for (let m = 0; m < 12; m++) {
          const count = monthlyCounts[m] || 1;
          // precip and snow are sums per day, so monthly total = sum / years
          const years = 5;
          months.push({
            month: MONTH_NAMES[m],
            avgHigh: Math.round(monthlyHighs[m] / count),
            avgLow: Math.round(monthlyLows[m] / count),
            precipIn: +(monthlyPrecip[m] / years).toFixed(1),
            snowIn: +(monthlySnow[m] / years / 2.54).toFixed(1), // cm to inches
          });
        }

        results[slug] = { name: town.name, months };
        console.log(`  OK: ${town.name} - Jan high: ${months[0].avgHigh}°F, Jul high: ${months[6].avgHigh}°F`);
      } else {
        console.log(`  No climate data returned for ${town.name}`);
      }
    } catch (err) {
      console.error(`  Error for ${town.name}: ${err.message}`);
    }

    fs.writeFileSync(outPath, JSON.stringify(results, null, 2));
    await new Promise(r => setTimeout(r, 2000));
  }

  console.log(`\nClimate data complete for ${Object.keys(results).length} towns.`);
}

collectClimateData().catch(console.error);
