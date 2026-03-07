#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const HIKING_RAW = [
  { name: "Giant Springs State Park", types: ["Tourist attraction"], rating: 4.8, reviews: 2478, lat: 47.534446, lng: -111.228842, address: "4803 Giant Springs Rd, Great Falls, MT 59405", phone: null, website: null },
  { name: "Makoshika State Park", types: ["State park"], rating: 4.8, reviews: 637, lat: 47.089797, lng: -104.7063288, address: "1301 Snyder St, Glendive, MT 59330", phone: null, website: null },
  { name: "West Shore / Flathead Lake State Park", types: ["State park"], rating: 4.7, reviews: 465, lat: 47.9503612, lng: -114.1883987, address: "17768 US-93, Lakeside, MT 59922", phone: null, website: null },
  { name: "Missouri Headwaters State Park", types: ["State park"], rating: 4.5, reviews: 453, lat: 45.920296, lng: -111.4986942, address: "1585 Trident Rd, Three Forks, MT 59752", phone: null, website: null },
  { name: "Big Arm State Park", types: ["State park"], rating: 4.7, reviews: 367, lat: 47.8106872, lng: -114.3107064, address: "28031 Big Arm State Park Rd, Big Arm, MT 59910", phone: null, website: null },
  { name: "Blue Mountain Trailhead", types: ["Hiking area"], rating: 4.7, reviews: 311, lat: 46.8270506, lng: -114.087503, address: "Forest Hill Ln, Missoula, MT 59804", phone: null, website: null },
  { name: "Grinnell Glacier Trailhead", types: ["Hiking area"], rating: 4.9, reviews: 244, lat: 48.7970534, lng: -113.6685667, address: "Browning, MT 59417", phone: null, website: null },
  { name: "Four Dances Trailhead", types: ["Hiking area"], rating: 4.8, reviews: 175, lat: 45.7767308, lng: -108.4672184, address: "1100 Coburn Rd, Billings, MT 59101", phone: null, website: null },
  { name: "Kootenai Creek Trailhead", types: ["Hiking area"], rating: 4.9, reviews: 167, lat: 46.537983, lng: -114.1509561, address: "Stevensville, MT 59870", phone: null, website: null },
  { name: "Fairy Lake Trailhead", types: ["Hiking area"], rating: 4.8, reviews: 160, lat: 45.906921, lng: -110.960913, address: "Bozeman, MT 59715", phone: null, website: null },
  { name: "Lion Mtn Trailhead, Whitefish Trail", types: ["Hiking area"], rating: 4.7, reviews: 146, lat: 48.4039474, lng: -114.3811039, address: "2209 Mountainside Dr, Whitefish, MT 59937", phone: null, website: null },
  { name: "Pine Creek Lake Trailhead", types: ["Hiking area"], rating: 4.8, reviews: 137, lat: 45.4976777, lng: -110.5188353, address: "Livingston, MT 59047", phone: null, website: null },
  { name: "Running Eagle Falls Nature Trail", types: ["Hiking area"], rating: 4.8, reviews: 117, lat: 48.4961314, lng: -113.348369, address: "East Glacier Park, MT 59434", phone: null, website: "http://www.nps.gov/glac" },
  { name: "Ackley Lake State Park", types: ["State park"], rating: 4.4, reviews: 112, lat: 46.9599, lng: -109.9346706, address: "989 Ackley Lake Rd, Hobson, MT 59452", phone: null, website: null },
  { name: "Thompson Falls State Recreation Area", types: ["Park"], rating: 4.5, reviews: 111, lat: 47.6179265, lng: -115.3896615, address: "2220 Blue Slide Rd, Thompson Falls, MT 59873", phone: null, website: null },
  { name: "SKQ Dam Overlook Trailhead", types: ["Hiking area"], rating: 4.7, reviews: 104, lat: 47.6764646, lng: -114.2370234, address: "Polson, MT 59860", phone: null, website: null },
  { name: "Columbia Mountain", types: ["Hiking area"], rating: 4.7, reviews: 104, lat: 48.3814662, lng: -114.1151619, address: "Berne Rd, Columbia Falls, MT 59912", phone: null, website: null },
  { name: "Kootenai Falls Trailhead", types: ["Hiking area"], rating: 4.8, reviews: 91, lat: 48.4527709, lng: -115.7690398, address: "US-2, Troy, MT 59935", phone: null, website: null },
  { name: "South Shore Trailhead", types: ["Hiking area"], rating: 4.8, reviews: 88, lat: 47.5311303, lng: -111.203855, address: "Great Falls, MT 59405", phone: null, website: null },
  { name: "Milltown State Park Overlook", types: ["Park"], rating: 4.5, reviews: 81, lat: 46.8712446, lng: -113.8940926, address: "1353 Deer Creek Rd, Missoula, MT 59802", phone: null, website: "http://stateparks.mt.gov/milltown/" },
  { name: "Gallagator Trail", types: ["Hiking area"], rating: 4.7, reviews: 77, lat: 45.6733571, lng: -111.0306755, address: "Gallagator Linear Trail, Bozeman, MT 59715", phone: null, website: null },
  { name: "Homestake Trailhead", types: ["Hiking area"], rating: 4.5, reviews: 76, lat: 45.9224362, lng: -112.4099234, address: "Whitehall, MT 59759", phone: null, website: null },
  { name: "Memorial Falls Trailhead", types: ["Hiking area"], rating: 4.9, reviews: 65, lat: 46.9128728, lng: -110.6984101, address: "3557 US-89, Neihart, MT 59465", phone: null, website: null },
  { name: "Pirogue Island State Park", types: ["State park"], rating: 4.2, reviews: 54, lat: 46.4403189, lng: -105.8181715, address: "Miles City, MT 59301", phone: null, website: null },
  { name: "Pattee Canyon Trailhead", types: ["Hiking area"], rating: 4.7, reviews: 44, lat: 46.8246041, lng: -113.9220589, address: "County Rd 533, Missoula, MT 59803", phone: null, website: null },
  { name: "Maud S Canyon Trailhead", types: ["Hiking area"], rating: 4.7, reviews: 34, lat: 45.965108, lng: -112.472387, address: "4800 Saddle Rock Rd, Butte, MT 59701", phone: null, website: null },
  { name: "Strawberry Lake Trailhead", types: ["Hiking area"], rating: 4.6, reviews: 34, lat: 48.1872158, lng: -113.9928557, address: "Krause Basin Rd, Kalispell, MT 59901", phone: null, website: null },
  { name: "Copperway Regional Trail", types: ["Hiking area"], rating: 4.1, reviews: 34, lat: 46.0925656, lng: -112.8064491, address: "Anaconda, MT 59711", phone: null, website: null },
  { name: "Glacier Lake Trailhead (Red Lodge)", types: ["Hiking area"], rating: 5.0, reviews: 33, lat: 45.0038889, lng: -109.5141667, address: "US Hwy 212 W, Red Lodge, MT 59068", phone: null, website: null },
  { name: "Old Shooting Range Trailhead", types: ["Hiking area"], rating: 4.6, reviews: 30, lat: 46.5644148, lng: -112.0463679, address: "1782 Davis Gulch Rd, Helena, MT 59601", phone: null, website: null },
  { name: "Glacier Lake Trailhead (Seeley Lake)", types: ["Hiking area"], rating: 4.9, reviews: 27, lat: 47.3817, lng: -113.7929518, address: "Seeley Lake, MT 59868", phone: null, website: null },
  { name: "Lower Sluice Boxes State Park Trailhead", types: ["Hiking area"], rating: 4.6, reviews: 26, lat: 47.2122283, lng: -110.9348921, address: "Evans Riceville Rd, Belt, MT 59412", phone: null, website: null },
  { name: "Mt Helena Ridge Trailhead", types: ["Hiking area"], rating: 4.7, reviews: 25, lat: 46.5422384, lng: -112.1198529, address: "5051 Prospector Gulch Rd, Helena, MT 59601", phone: null, website: null },
  { name: "Trail Creek Trailhead", types: ["Hiking area"], rating: 4.7, reviews: 23, lat: 45.455483, lng: -111.649694, address: "Barn Creek, Ennis, MT 59729", phone: null, website: null },
  { name: "Dillon Town Overlook Trailhead", types: ["Hiking area"], rating: 4.8, reviews: 21, lat: 45.2178217, lng: -112.6741391, address: "Dillon, MT 59725", phone: null, website: null },
  { name: "Coyote Coulee Trailhead", types: ["Hiking area"], rating: 4.8, reviews: 21, lat: 46.121493, lng: -114.228864, address: "Lost Horse Rd, Darby, MT 59829", phone: null, website: null },
  { name: "CDNST Trailhead", types: ["Hiking area"], rating: 4.8, reviews: 21, lat: 46.5570983, lng: -112.3069195, address: "US-12, Helena, MT 59601", phone: null, website: null },
  { name: "Sulphur Springs Trailhead", types: ["Hiking area"], rating: 4.2, reviews: 15, lat: 47.5821389, lng: -111.0645353, address: "Great Falls, MT 59404", phone: null, website: null },
  { name: "Yellowstone Shortline Trail", types: ["Hiking area"], rating: 4.8, reviews: 14, lat: 44.6581185, lng: -111.1133116, address: "Iris St, West Yellowstone, MT 59758", phone: null, website: null },
  { name: "Big Creek Trailhead & Picnic Area", types: ["Hiking area"], rating: 4.6, reviews: 14, lat: 46.464574, lng: -114.213035, address: "Victor, MT 59875", phone: null, website: null },
  { name: "Seeley Creek Trail", types: ["Hiking area"], rating: 4.5, reviews: 13, lat: 47.1883595, lng: -113.4666919, address: "Morrell Creek Rd, Seeley Lake, MT 59868", phone: null, website: null },
  { name: "Superior Vista Trailhead", types: ["Hiking area"], rating: 4.5, reviews: 11, lat: 47.1991596, lng: -114.8906175, address: "210 River St, Superior, MT 59872", phone: null, website: null },
  { name: "Limekiln Trail", types: ["Hiking area"], rating: 4.9, reviews: 11, lat: 47.1356406, lng: -109.3521233, address: "6300 Lime Kiln Rd, Lewistown, MT 59457", phone: null, website: null },
  { name: "Leigh Lake Trail", types: ["Hiking area"], rating: 5.0, reviews: 10, lat: 48.2247037, lng: -115.6408557, address: "NF-4786, Libby, MT 59923", phone: null, website: null },
  { name: "Rocker Station Trailhead", types: ["Hiking area"], rating: 4.9, reviews: 10, lat: 46.0027951, lng: -112.606377, address: "1208 Grizzly Trail, Butte, MT 59701", phone: null, website: null },
  { name: "Beaver Pond Trail Head", types: ["Hiking area"], rating: 4.9, reviews: 9, lat: 48.7385266, lng: -113.4370686, address: "Glacier National Park, Browning, MT 59417", phone: null, website: null },
  { name: "Harrell Forest Community Trails", types: ["Hiking area"], rating: 4.6, reviews: 9, lat: 48.0705669, lng: -114.0695575, address: "1017 Bigfork Stage Rd, Bigfork, MT 59911", phone: null, website: null },
  { name: "Flesher Pass Trailhead", types: ["Hiking area"], rating: 4.9, reviews: 8, lat: 46.9713889, lng: -112.3588889, address: "Flesher Pass Rd, Lincoln, MT 59639", phone: null, website: null },
  { name: "Gold Prize Creek Trailhead", types: ["Hiking area"], rating: 4.6, reviews: 7, lat: 45.2608676, lng: -110.7639334, address: "Pray, MT 59065", phone: null, website: null },
  { name: "US Forest Service Trail #119 Trailhead", types: ["Hiking area"], rating: 4.9, reviews: 7, lat: 46.0413086, lng: -110.2409754, address: "Big Timber, MT 59011", phone: null, website: null },
  { name: "Meyers Lane Parking Lot", types: ["Hiking area"], rating: 4.2, reviews: 6, lat: 45.6659831, lng: -110.5380385, address: "Meyers Ln, Livingston, MT 59047", phone: null, website: null },
  { name: "Trapper Creek Trailhead", types: ["Hiking area"], rating: 4.8, reviews: 5, lat: 45.922471, lng: -114.225831, address: "Trapper Creek Rd, Darby, MT 59829", phone: null, website: null },
  { name: "Goat Mountain Trailhead", types: ["Hiking area"], rating: 4.4, reviews: 5, lat: 46.191957, lng: -114.2229674, address: "Pinesdale, MT 59840", phone: null, website: null },
  { name: "Babcock Mountain Trail #10 Trailhead", types: ["Hiking area"], rating: 5.0, reviews: 4, lat: 46.6978457, lng: -113.6641057, address: "Rock Creek Rd, Clinton, MT 59825", phone: null, website: null },
  { name: "Overlook Trailhead", types: ["Hiking area"], rating: 4.5, reviews: 4, lat: 46.7472164, lng: -111.8873865, address: "6772 Hauser Dam Rd, Helena, MT 59602", phone: null, website: null },
  { name: "Louise Lake Trailhead", types: ["Hiking area"], rating: 4.8, reviews: 4, lat: 45.6093972, lng: -112.055455, address: "Sheridan, MT 59749", phone: null, website: null },
  { name: "Taylor Hills Trailhead", types: ["Hiking area"], rating: 5.0, reviews: 3, lat: 46.9978567, lng: -111.0113847, address: "White Sulphur Springs, MT 59645", phone: null, website: null },
  { name: "South Fork Teton Trailhead", types: ["Hiking area"], rating: 5.0, reviews: 3, lat: 47.8472304, lng: -112.7821898, address: "Choteau, MT 59422", phone: null, website: null },
  { name: "Sawtooth Lake Trailhead", types: ["Hiking area"], rating: 5.0, reviews: 3, lat: 45.4246399, lng: -113.08555, address: "Elkhorn Rd, Polaris, MT 59746", phone: null, website: null },
  { name: "Four Lakes Trailhead", types: ["Hiking area"], rating: 5.0, reviews: 2, lat: 47.7034051, lng: -115.2630657, address: "Thompson Falls, MT 59873", phone: null, website: null },
  { name: "Milk River Trailhead at Sullivan Park", types: ["Hiking area"], rating: 5.0, reviews: 2, lat: 48.1830509, lng: -106.6197767, address: "Sullivan Park Rd, Glasgow, MT 59230", phone: null, website: null },
];

const seen = new Set();
const HIKING = HIKING_RAW.filter(h => {
  if (seen.has(h.name)) return false;
  seen.add(h.name);
  return true;
});

function slugify(name) {
  return name
    .toLowerCase()
    .replace(/['']/g, '')
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function haversineMiles(lat1, lng1, lat2, lng2) {
  const R = 3958.8;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat/2)**2 + Math.cos(lat1 * Math.PI/180) * Math.cos(lat2 * Math.PI/180) * Math.sin(dLng/2)**2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}

function categorize(name, types) {
  const n = name.toLowerCase();
  const t = (types[0] || '').toLowerCase();
  if (t === 'state park' || n.includes('state park') || n.includes('state recreation')) return 'state_park';
  if (n.includes('glacier national') || n.includes('glacier lake') || n.includes('grinnell') ||
      n.includes('running eagle') || n.includes('beaver pond trail')) return 'national_park';
  if (n.includes('falls') || n.includes('waterfall')) return 'waterfall';
  return 'trail';
}

const townData = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'town-data.json'), 'utf8'));
const towns = Object.entries(townData).map(([slug, t]) => ({ slug, name: t.name, lat: t.lat, lng: t.lng }));

function findNearestTown(lat, lng) {
  let best = null;
  let bestDist = Infinity;
  for (const t of towns) {
    const d = haversineMiles(lat, lng, t.lat, t.lng);
    if (d < bestDist) { bestDist = d; best = t; }
  }
  return best;
}

const result = HIKING.map(h => {
  const nearest = findNearestTown(h.lat, h.lng);
  const cat = categorize(h.name, h.types);
  return {
    name: h.name,
    slug: slugify(h.name),
    category: cat,
    lat: h.lat,
    lng: h.lng,
    nearestTown: nearest.slug,
    nearestTownName: nearest.name,
    address: h.address || null,
    phone: h.phone || null,
    website: h.website || null,
    rating: h.rating || null,
    reviews: h.reviews || null,
  };
}).sort((a, b) => (b.reviews || 0) - (a.reviews || 0));

const outPath = path.join(__dirname, '..', 'data', 'hiking.json');
fs.writeFileSync(outPath, JSON.stringify(result, null, 2));
console.log(`Wrote ${result.length} hiking sites to ${outPath}`);
console.log(`  Trails: ${result.filter(h=>h.category==='trail').length}`);
console.log(`  State Parks: ${result.filter(h=>h.category==='state_park').length}`);
console.log(`  National Park: ${result.filter(h=>h.category==='national_park').length}`);
console.log(`  Waterfalls: ${result.filter(h=>h.category==='waterfall').length}`);
