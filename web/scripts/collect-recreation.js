const fs = require('fs');
const path = require('path');

// Major Montana recreation sites with coordinates
const RECREATION_SITES = [
  { name: 'Glacier National Park', type: 'National Park', lat: 48.7596, lng: -113.7870 },
  { name: 'Yellowstone National Park', type: 'National Park', lat: 44.4280, lng: -110.5885 },
  { name: 'Flathead Lake', type: 'Lake', lat: 47.8833, lng: -114.1333 },
  { name: 'Fort Peck Lake', type: 'Lake', lat: 47.6000, lng: -106.9500 },
  { name: 'Canyon Ferry Lake', type: 'Lake', lat: 46.6500, lng: -111.7333 },
  { name: 'Hungry Horse Reservoir', type: 'Lake', lat: 48.3000, lng: -113.7833 },
  { name: 'Makoshika State Park', type: 'State Park', lat: 47.0900, lng: -104.6881 },
  { name: 'Lewis and Clark Caverns', type: 'State Park', lat: 45.8333, lng: -111.8667 },
  { name: 'Giant Springs State Park', type: 'State Park', lat: 47.5189, lng: -111.2153 },
  { name: 'Bannack State Park', type: 'State Park', lat: 45.1611, lng: -112.9986 },
  { name: 'Pictograph Cave State Park', type: 'State Park', lat: 45.7339, lng: -108.4742 },
  { name: 'Travelers Rest State Park', type: 'State Park', lat: 46.7389, lng: -114.0897 },
  { name: 'Whitefish Mountain Resort', type: 'Ski Area', lat: 48.4817, lng: -114.3497 },
  { name: 'Big Sky Resort', type: 'Ski Area', lat: 45.2833, lng: -111.4017 },
  { name: 'Bridger Bowl', type: 'Ski Area', lat: 45.8167, lng: -110.8983 },
  { name: 'Snowbowl', type: 'Ski Area', lat: 47.0167, lng: -114.1500 },
  { name: 'Red Lodge Mountain', type: 'Ski Area', lat: 45.1897, lng: -109.3344 },
  { name: 'Lost Trail Powder Mountain', type: 'Ski Area', lat: 45.6911, lng: -113.9489 },
  { name: 'Bob Marshall Wilderness', type: 'Wilderness', lat: 47.5000, lng: -112.8500 },
  { name: 'Absaroka-Beartooth Wilderness', type: 'Wilderness', lat: 45.2000, lng: -109.8000 },
  { name: 'Scapegoat Wilderness', type: 'Wilderness', lat: 47.1000, lng: -112.5000 },
  { name: 'Selway-Bitterroot Wilderness', type: 'Wilderness', lat: 46.1000, lng: -114.7000 },
  { name: 'Lee Metcalf Wilderness', type: 'Wilderness', lat: 45.1500, lng: -111.3500 },
  { name: 'Mission Mountains Wilderness', type: 'Wilderness', lat: 47.3500, lng: -113.8000 },
  { name: 'Beartooth Highway', type: 'Scenic Drive', lat: 45.0100, lng: -109.4300 },
  { name: 'Going-to-the-Sun Road', type: 'Scenic Drive', lat: 48.6967, lng: -113.7217 },
  { name: 'National Bison Range', type: 'Wildlife Refuge', lat: 47.3292, lng: -114.1742 },
  { name: 'Red Rock Lakes NWR', type: 'Wildlife Refuge', lat: 44.6500, lng: -111.8000 },
  { name: 'Charles M. Russell NWR', type: 'Wildlife Refuge', lat: 47.6500, lng: -108.0000 },
  { name: 'Bighorn Canyon NRA', type: 'National Rec Area', lat: 45.1000, lng: -108.2000 },
  { name: 'Missouri Breaks NM', type: 'National Monument', lat: 47.8000, lng: -109.5000 },
  { name: 'Little Bighorn Battlefield', type: 'National Monument', lat: 45.5700, lng: -107.4264 },
  { name: 'Flathead National Forest', type: 'National Forest', lat: 48.1000, lng: -114.0000 },
  { name: 'Gallatin National Forest', type: 'National Forest', lat: 45.4000, lng: -111.0000 },
  { name: 'Helena National Forest', type: 'National Forest', lat: 46.7000, lng: -112.0000 },
  { name: 'Lolo National Forest', type: 'National Forest', lat: 47.0000, lng: -114.2000 },
  { name: 'Bitterroot National Forest', type: 'National Forest', lat: 46.0000, lng: -114.0000 },
  { name: 'Kootenai National Forest', type: 'National Forest', lat: 48.5000, lng: -115.5000 },
  { name: 'Custer National Forest', type: 'National Forest', lat: 45.5000, lng: -109.5000 },
];

function haversineMiles(lat1, lon1, lat2, lon2) {
  const R = 3959;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2)**2 + Math.cos(lat1*Math.PI/180) * Math.cos(lat2*Math.PI/180) * Math.sin(dLon/2)**2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}

function buildRecreation() {
  const coordsPath = path.resolve(__dirname, '..', 'data', 'town-coordinates.json');
  const outPath = path.resolve(__dirname, '..', 'data', 'town-recreation.json');

  const coordinates = JSON.parse(fs.readFileSync(coordsPath, 'utf8'));
  const results = {};

  for (const [slug, town] of Object.entries(coordinates)) {
    const places = RECREATION_SITES.map(site => ({
      name: site.name,
      type: site.type,
      distMiles: Math.round(haversineMiles(town.lat, town.lng, site.lat, site.lng)),
    }))
    .sort((a, b) => a.distMiles - b.distMiles)
    .slice(0, 6); // Top 6 nearest

    results[slug] = { name: town.name, places };
  }

  fs.writeFileSync(outPath, JSON.stringify(results, null, 2));
  console.log(`Recreation data built for ${Object.keys(results).length} towns.`);
  
  // Show sample
  console.log('\nSample - Missoula:');
  if (results.missoula) {
    results.missoula.places.forEach(p => console.log(`  ${p.name}: ${p.distMiles} mi`));
  }
}

buildRecreation();
