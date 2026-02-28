const fs = require('fs');
const path = require('path');

function haversine(lat1, lon1, lat2, lon2) {
  const R = 3958.8;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// Montana hospitals with coordinates, bed counts, and trauma designation
// Sources: Wikipedia, MT DPHHS Trauma Facility List (Nov 2024), officialusa.com
const HOSPITALS = [
  // Level 1 Trauma (Comprehensive)
  { name: 'Billings Clinic', city: 'Billings', lat: 45.7833, lng: -108.5007, beds: 272, trauma: 1 },
  { name: 'St. Vincent Healthcare', city: 'Billings', lat: 45.7780, lng: -108.5170, beds: 286, trauma: 1 },

  // Level 2 Trauma (Regional)
  { name: 'Providence St. Patrick Hospital', city: 'Missoula', lat: 46.8721, lng: -114.0153, beds: 253, trauma: 2 },
  { name: 'Benefis Health System', city: 'Great Falls', lat: 47.5200, lng: -111.2820, beds: 332, trauma: 2 },

  // Level 3 Trauma (Area)
  { name: 'Logan Health Medical Center', city: 'Kalispell', lat: 48.2050, lng: -114.3150, beds: 174, trauma: 3 },
  { name: 'Bozeman Health Deaconess', city: 'Bozeman', lat: 45.6825, lng: -111.0350, beds: 86, trauma: 3 },

  // Level 4 Trauma (Community)
  { name: 'St. James Healthcare', city: 'Butte', lat: 46.0038, lng: -112.5348, beds: 73, trauma: 4 },
  { name: 'Community Medical Center', city: 'Missoula', lat: 46.8590, lng: -114.0010, beds: 146, trauma: 4 },
  { name: 'St. Peter\'s Health', city: 'Helena', lat: 46.5960, lng: -112.0380, beds: 123, trauma: 4 },
  { name: 'Northern Montana Hospital', city: 'Havre', lat: 48.5460, lng: -109.6780, beds: 49, trauma: 4 },
  { name: 'Holy Rosary Healthcare', city: 'Miles City', lat: 46.4083, lng: -105.8406, beds: 90, trauma: 4 },
  { name: 'Central Montana Medical Center', city: 'Lewistown', lat: 47.0633, lng: -109.4283, beds: 90, trauma: 4 },
  { name: 'Livingston Healthcare', city: 'Livingston', lat: 45.6617, lng: -110.5600, beds: 25, trauma: 4 },
  { name: 'Sidney Health Center', city: 'Sidney', lat: 47.7167, lng: -104.1567, beds: 55, trauma: 4 },

  // Level 5 / Critical Access / General hospitals
  { name: 'North Valley Hospital', city: 'Whitefish', lat: 48.4106, lng: -114.3528, beds: 25, trauma: 5 },
  { name: 'Bitterroot Health - Daly Hospital', city: 'Hamilton', lat: 46.2467, lng: -114.1600, beds: 25, trauma: 5 },
  { name: 'Community Hospital of Anaconda', city: 'Anaconda', lat: 46.1283, lng: -112.9467, beds: 25, trauma: 5 },
  { name: 'Barrett Hospital & HealthCare', city: 'Dillon', lat: 45.2150, lng: -112.6367, beds: 25, trauma: 5 },
  { name: 'Cabinet Peaks Medical Center', city: 'Libby', lat: 48.3883, lng: -115.5550, beds: 25, trauma: 5 },
  { name: 'Clark Fork Valley Hospital', city: 'Plains', lat: 47.4600, lng: -114.8833, beds: 18, trauma: 5 },
  { name: 'Frances Mahon Deaconess Hospital', city: 'Glasgow', lat: 48.1967, lng: -106.6367, beds: 25, trauma: 5 },
  { name: 'Glendive Medical Center', city: 'Glendive', lat: 47.1050, lng: -104.7117, beds: 25, trauma: 5 },
  { name: 'St. Joseph Medical Center', city: 'Polson', lat: 47.6933, lng: -114.1633, beds: 22, trauma: 5 },
  { name: 'Northern Rockies Medical Center', city: 'Cut Bank', lat: 48.6333, lng: -112.3267, beds: 20, trauma: 5 },
  { name: 'St. Luke Community Hospital', city: 'Ronan', lat: 47.5283, lng: -114.1000, beds: 25, trauma: 5 },
  { name: 'Big Horn County Memorial Hospital', city: 'Hardin', lat: 45.7317, lng: -107.6117, beds: 25, trauma: 5 },
  { name: 'Pondera Medical Center', city: 'Conrad', lat: 48.1700, lng: -111.9500, beds: 25, trauma: 5 },
  { name: 'Powell County Medical Center', city: 'Deer Lodge', lat: 46.3983, lng: -112.7333, beds: 19, trauma: 5 },
  { name: 'Fallon Medical Complex', city: 'Baker', lat: 46.3650, lng: -104.2833, beds: 24, trauma: 5 },
  { name: 'Pioneer Medical Center', city: 'Big Timber', lat: 45.8350, lng: -109.9550, beds: 25, trauma: 5 },
  { name: 'Mineral Community Hospital', city: 'Superior', lat: 47.1917, lng: -114.8900, beds: 15, trauma: 5 },
  { name: 'Beartooth Hospital', city: 'Red Lodge', lat: 45.1867, lng: -109.2467, beds: 10, trauma: 5 },
  { name: 'Wheatland Memorial Hospital', city: 'Harlowton', lat: 46.4350, lng: -109.8317, beds: 25, trauma: 5 },
  { name: 'Phillips County Hospital', city: 'Malta', lat: 48.3567, lng: -107.8700, beds: 13, trauma: 5 },
  { name: 'Logan Health - Shelby', city: 'Shelby', lat: 48.5050, lng: -111.8567, beds: 25, trauma: 5 },
  { name: 'Rosebud Health Care Center', city: 'Forsyth', lat: 46.2683, lng: -106.6783, beds: 25, trauma: 5 },
  { name: 'Teton Medical Center', city: 'Choteau', lat: 47.8117, lng: -112.1833, beds: 40, trauma: 5 },
  { name: 'Roundup Memorial Healthcare', city: 'Roundup', lat: 46.4450, lng: -108.5417, beds: 25, trauma: 5 },
  { name: 'Missouri River Medical Center', city: 'Fort Benton', lat: 47.8183, lng: -110.6617, beds: 10, trauma: 5 },
  { name: 'Mountainview Medical Center', city: 'White Sulphur Springs', lat: 46.5467, lng: -110.9017, beds: 15, trauma: 5 },
  { name: 'Ruby Valley Hospital', city: 'Sheridan', lat: 45.4567, lng: -112.1950, beds: 8, trauma: 5 },
  { name: 'Daniels Memorial Healthcare Center', city: 'Scobey', lat: 48.7883, lng: -105.4233, beds: 10, trauma: 5 },
  { name: 'Sheridan Memorial Hospital', city: 'Plentywood', lat: 48.7717, lng: -104.5617, beds: 17, trauma: 5 },
  { name: 'Broadwater Health Center', city: 'Townsend', lat: 46.3200, lng: -111.5200, beds: 10, trauma: 5 },
  { name: 'Madison Valley Hospital', city: 'Ennis', lat: 45.3450, lng: -111.7283, beds: 10, trauma: 5 },
  { name: 'Granite County Medical Center', city: 'Philipsburg', lat: 46.3317, lng: -113.2933, beds: 10, trauma: 5 },
  { name: 'Big Sky Medical Center', city: 'Big Sky', lat: 45.2833, lng: -111.4017, beds: 4, trauma: 5 },
  { name: 'Stillwater Billings Clinic', city: 'Columbus', lat: 45.6350, lng: -109.2517, beds: 10, trauma: 5 },
  { name: 'Poplar Community Hospital', city: 'Poplar', lat: 48.1100, lng: -105.1933, beds: 20, trauma: 5 },
  { name: 'Trinity Hospital', city: 'Wolf Point', lat: 48.0883, lng: -105.6400, beds: 25, trauma: 5 },
  { name: 'Roosevelt Memorial Medical Center', city: 'Culbertson', lat: 48.1467, lng: -104.5167, beds: 13, trauma: 5 },
  { name: 'Liberty County Hospital', city: 'Chester', lat: 48.5117, lng: -110.9633, beds: 12, trauma: 5 },
  { name: 'McCone County Health Center', city: 'Circle', lat: 47.4183, lng: -105.5917, beds: 11, trauma: 5 },
  { name: 'Laurel Health Center', city: 'Laurel', lat: 45.6717, lng: -108.7717, beds: 0, trauma: 0 },
];

const dataDir = path.resolve(__dirname, '..', 'data');
const coords = JSON.parse(fs.readFileSync(path.join(dataDir, 'town-coordinates.json'), 'utf8'));

const results = {};
let matched = 0;

for (const [slug, town] of Object.entries(coords)) {
  const tlat = town.lat;
  const tlng = town.lng;

  const hospitalsWithDist = HOSPITALS.map(h => ({
    ...h,
    dist: Math.round(haversine(tlat, tlng, h.lat, h.lng) * 10) / 10,
  })).sort((a, b) => a.dist - b.dist);

  const nearest = hospitalsWithDist[0];
  const nearestMajor = hospitalsWithDist.find(h => h.trauma <= 3);
  const hasLocalHospital = hospitalsWithDist.some(h => h.dist <= 5);
  const hospitalsWithin30 = hospitalsWithDist.filter(h => h.dist <= 30).length;
  const hospitalsWithin60 = hospitalsWithDist.filter(h => h.dist <= 60).length;
  const bestTraumaWithin60 = hospitalsWithDist.filter(h => h.dist <= 60).reduce((best, h) => Math.min(best, h.trauma || 99), 99);

  // Healthcare access score (0-10)
  // Factors: distance to nearest hospital, distance to major trauma center, 
  // number of hospitals within 30/60 mi, whether town has its own hospital
  let score = 0;

  // Distance to nearest hospital (0-3 pts): <5mi=3, <15mi=2.5, <25mi=2, <40mi=1, <60mi=0.5
  if (nearest.dist <= 5) score += 3;
  else if (nearest.dist <= 15) score += 2.5;
  else if (nearest.dist <= 25) score += 2;
  else if (nearest.dist <= 40) score += 1;
  else if (nearest.dist <= 60) score += 0.5;

  // Trauma level access within 60mi (0-3 pts)
  if (bestTraumaWithin60 <= 1) score += 3;
  else if (bestTraumaWithin60 <= 2) score += 2.5;
  else if (bestTraumaWithin60 <= 3) score += 2;
  else if (bestTraumaWithin60 <= 4) score += 1.5;
  else if (bestTraumaWithin60 <= 5) score += 1;

  // Hospital density within 30mi (0-2 pts)
  score += Math.min(hospitalsWithin30 / 2, 2);

  // Major center distance (0-2 pts): <30mi=2, <60mi=1.5, <100mi=1, <150mi=0.5
  if (nearestMajor) {
    if (nearestMajor.dist <= 30) score += 2;
    else if (nearestMajor.dist <= 60) score += 1.5;
    else if (nearestMajor.dist <= 100) score += 1;
    else if (nearestMajor.dist <= 150) score += 0.5;
  }

  score = Math.round(Math.min(score, 10) * 10) / 10;

  results[slug] = {
    nearestHospital: nearest.name,
    nearestHospitalCity: nearest.city,
    nearestHospitalDist: nearest.dist,
    nearestHospitalBeds: nearest.beds,
    nearestHospitalTrauma: nearest.trauma,
    nearestMajorHospital: nearestMajor ? nearestMajor.name : null,
    nearestMajorHospitalCity: nearestMajor ? nearestMajor.city : null,
    nearestMajorHospitalDist: nearestMajor ? nearestMajor.dist : null,
    nearestMajorTraumaLevel: nearestMajor ? nearestMajor.trauma : null,
    hasLocalHospital,
    hospitalsWithin30,
    hospitalsWithin60,
    healthcareScore: score,
  };
  matched++;
}

console.log(`Healthcare data computed for ${matched} towns`);

// Samples
['missoula', 'bozeman', 'big-sky', 'ennis', 'west-yellowstone', 'browning', 'seeley-lake', 'helena', 'billings', 'jordan'].forEach(s => {
  const d = results[s];
  if (d) {
    console.log(`  ${s}: nearest=${d.nearestHospital} (${d.nearestHospitalDist}mi, L${d.nearestHospitalTrauma}), major=${d.nearestMajorHospital} (${d.nearestMajorHospitalDist}mi), score=${d.healthcareScore}`);
  }
});

// Score distribution
const scores = Object.values(results).map(r => r.healthcareScore);
console.log(`\nScore range: ${Math.min(...scores)} - ${Math.max(...scores)}`);
console.log(`Average: ${(scores.reduce((a, b) => a + b) / scores.length).toFixed(1)}`);
const buckets = [0, 0, 0, 0, 0];
scores.forEach(s => { buckets[Math.min(Math.floor(s / 2), 4)]++; });
console.log(`0-2: ${buckets[0]}, 2-4: ${buckets[1]}, 4-6: ${buckets[2]}, 6-8: ${buckets[3]}, 8-10: ${buckets[4]}`);

const outPath = path.join(dataDir, 'town-healthcare.json');
fs.writeFileSync(outPath, JSON.stringify(results, null, 2));
console.log(`\nSaved to ${outPath}`);

require('./stamp-freshness').stamp('healthcare');
