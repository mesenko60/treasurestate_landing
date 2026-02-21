const fs = require('fs');
const path = require('path');

const AIRPORTS = {
  BZN: { name: 'Bozeman Yellowstone Int. Airport', lat: 45.7772, lng: -111.1520 },
  BIL: { name: 'Billings Logan Int. Airport', lat: 45.8077, lng: -108.5429 },
  MSO: { name: 'Missoula Montana Airport', lat: 46.9163, lng: -114.0906 },
  FCA: { name: 'Glacier Park Int. Airport (Kalispell)', lat: 48.3106, lng: -114.2562 },
  GTF: { name: 'Great Falls Int. Airport', lat: 47.4820, lng: -111.3707 },
  HLN: { name: 'Helena Regional Airport', lat: 46.6068, lng: -111.9828 }
};

// Haversine formula to calculate straight-line distance in miles
function getDistanceMiles(lat1, lon1, lat2, lon2) {
  const R = 3958.8; // Radius of earth in miles
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2); 
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  return R * c;
}

function calculateDistances() {
  const coordsPath = path.resolve(__dirname, '..', 'data', 'town-coordinates.json');
  const outPath = path.resolve(__dirname, '..', 'data', 'town-airport-distances.json');
  
  if (!fs.existsSync(coordsPath)) {
    console.error("Coordinates file not found. Run geocode-towns.js first.");
    return;
  }

  const coordinates = JSON.parse(fs.readFileSync(coordsPath, 'utf8'));
  const results = {};
  
  Object.keys(coordinates).forEach(slug => {
    const town = coordinates[slug];
    results[slug] = {};
    
    Object.keys(AIRPORTS).forEach(airportCode => {
      const airport = AIRPORTS[airportCode];
      
      // Calculate straight line distance
      const straightLineMiles = getDistanceMiles(town.lat, town.lng, airport.lat, airport.lng);
      
      // Typical routing factor (roads aren't straight)
      // Montana roads are mostly highways, 1.2 is a good multiplier
      let drivingMiles = straightLineMiles * 1.2;
      
      // Average driving speed ~60mph in Montana
      let durationHours = drivingMiles / 60;
      
      // Add minimum times for very short trips (airport exit, local streets)
      if (drivingMiles < 5) drivingMiles = 5;
      durationHours += 0.25; // 15 mins base penalty for local roads
      
      results[slug][airportCode] = {
        distanceMiles: Math.round(drivingMiles),
        durationSeconds: Math.round(durationHours * 3600), // convert to seconds
        airportName: airport.name
      };
    });
  });

  fs.writeFileSync(outPath, JSON.stringify(results, null, 2));
  console.log(`Saved estimated driving distances for ${Object.keys(results).length} towns to ${outPath}`);
}

calculateDistances();