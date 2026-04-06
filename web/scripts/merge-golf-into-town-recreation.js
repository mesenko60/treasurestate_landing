/**
 * One-off / repeatable: merge golf-courses.json into town-recreation.json
 * as type "Golf" with haversine distMiles from town center.
 *
 * Run from repo root: node web/scripts/merge-golf-into-town-recreation.js
 */
const fs = require('fs');
const path = require('path');

const webDir = path.join(__dirname, '..');
const dataDir = path.join(webDir, 'data');

function slugify(input) {
  return String(input)
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

function haversineMiles(lat1, lng1, lat2, lng2) {
  const R = 3958.8;
  const toR = (d) => (d * Math.PI) / 180;
  const dLat = toR(lat2 - lat1);
  const dLng = toR(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toR(lat1)) * Math.cos(toR(lat2)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/** Cities in golf data that are not town slugs — map to nearest profile town */
const CITY_TO_TOWN_SLUG = {
  'Black Eagle': 'great-falls',
  'East Glacier Park': 'east-glacier',
  Emigrant: 'livingston',
  Fortine: 'eureka',
  Frenchtown: 'missoula',
  Huntley: 'billings',
  'Saint Regis': 'superior',
};

function normName(s) {
  return String(s)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '')
    .trim();
}

function isDuplicateGolf(places, name, lat, lng) {
  const n = normName(name);
  for (const p of places) {
    if (p.type !== 'Golf') continue;
    if (normName(p.name) === n) return true;
    const dlat = Math.abs(p.lat - lat);
    const dlng = Math.abs(p.lng - lng);
    if (dlat < 0.0008 && dlng < 0.0008) return true;
  }
  return false;
}

function main() {
  const golfPath = path.join(dataDir, 'golf-courses.json');
  const recPath = path.join(dataDir, 'town-recreation.json');
  const coordsPath = path.join(dataDir, 'town-coordinates.json');

  const golf = JSON.parse(fs.readFileSync(golfPath, 'utf8'));
  const recreation = JSON.parse(fs.readFileSync(recPath, 'utf8'));
  const coords = JSON.parse(fs.readFileSync(coordsPath, 'utf8'));

  let added = 0;
  let skippedNoTown = 0;
  let skippedDup = 0;

  for (const c of golf.courses) {
    const townSlug = CITY_TO_TOWN_SLUG[c.city] || slugify(c.city);
    if (!coords[townSlug]) {
      console.warn('No town coordinates for city:', c.city, '→', townSlug, '|', c.course_name);
      skippedNoTown++;
      continue;
    }
    if (!recreation[townSlug]) {
      recreation[townSlug] = {
        name: coords[townSlug].name || c.city,
        places: [],
      };
    }
    const places = recreation[townSlug].places;
    if (isDuplicateGolf(places, c.course_name, c.latitude, c.longitude)) {
      skippedDup++;
      continue;
    }
    const { lat: tlat, lng: tlng } = coords[townSlug];
    const distMiles = Math.max(1, Math.round(haversineMiles(tlat, tlng, c.latitude, c.longitude)));
    places.push({
      name: c.course_name,
      type: 'Golf',
      lat: c.latitude,
      lng: c.longitude,
      distMiles,
    });
    added++;
  }

  fs.writeFileSync(recPath, JSON.stringify(recreation, null, 2) + '\n', 'utf8');
  console.log('merge-golf-into-town-recreation:', { added, skippedDup, skippedNoTown });
}

main();
