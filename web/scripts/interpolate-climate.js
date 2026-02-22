const fs = require('fs');
const path = require('path');

function haversineMiles(lat1, lon1, lat2, lon2) {
  const R = 3959;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

const coordsPath = path.resolve(__dirname, '..', 'data', 'town-coordinates.json');
const climatePath = path.resolve(__dirname, '..', 'data', 'town-climate.json');
const townDataPath = path.resolve(__dirname, '..', 'data', 'town-data.json');

const coords = JSON.parse(fs.readFileSync(coordsPath, 'utf8'));
const climate = JSON.parse(fs.readFileSync(climatePath, 'utf8'));
const townData = JSON.parse(fs.readFileSync(townDataPath, 'utf8'));

const haveSlugs = Object.keys(climate);
const needSlugs = Object.keys(coords).filter(s => !climate[s]);

// Elevation lapse rate: ~3.5°F per 1000 ft
const LAPSE_PER_1000FT = 3.5;

console.log(`Interpolating climate for ${needSlugs.length} towns from ${haveSlugs.length} existing...`);

for (const slug of needSlugs) {
  const town = coords[slug];
  const townElev = townData[slug]?.elevation || null;

  const neighbors = haveSlugs
    .filter(s => coords[s])
    .map(s => ({
      slug: s,
      dist: haversineMiles(town.lat, town.lng, coords[s].lat, coords[s].lng),
      elev: townData[s]?.elevation || null,
    }))
    .sort((a, b) => a.dist - b.dist)
    .slice(0, 3);

  const months = [];
  for (let m = 0; m < 12; m++) {
    let totalWeight = 0;
    let wHigh = 0, wLow = 0, wPrecip = 0, wSnow = 0;

    for (const nb of neighbors) {
      const nbMonths = climate[nb.slug]?.months;
      if (!nbMonths || !nbMonths[m]) continue;

      const weight = 1 / Math.max(nb.dist, 1);
      totalWeight += weight;

      let elevAdj = 0;
      if (townElev && nb.elev) {
        elevAdj = ((nb.elev - townElev) / 1000) * LAPSE_PER_1000FT;
      }

      wHigh += (nbMonths[m].avgHigh + elevAdj) * weight;
      wLow += (nbMonths[m].avgLow + elevAdj) * weight;
      wPrecip += (nbMonths[m].precipIn || 0) * weight;
      wSnow += (nbMonths[m].snowIn || 0) * weight;
    }

    if (totalWeight > 0) {
      months.push({
        month: climate[haveSlugs[0]].months[m].month,
        avgHigh: Math.round(wHigh / totalWeight),
        avgLow: Math.round(wLow / totalWeight),
        precipIn: +((wPrecip / totalWeight).toFixed(1)),
        snowIn: +((wSnow / totalWeight).toFixed(1)),
      });
    }
  }

  if (months.length === 12) {
    climate[slug] = { name: town.name, months };
    console.log(`  ${town.name}: Jan high ${months[0].avgHigh}°F, Jul high ${months[6].avgHigh}°F (from ${neighbors.map(n => coords[n.slug]?.name).join(', ')})`);
  } else {
    console.log(`  Skipped ${town.name} — insufficient neighbor data`);
  }
}

fs.writeFileSync(climatePath, JSON.stringify(climate, null, 2));
console.log(`\nClimate data now covers ${Object.keys(climate).length} towns.`);
