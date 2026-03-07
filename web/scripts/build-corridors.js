#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const OUT_FILE = path.join(DATA_DIR, 'corridors.json');

const EARTH_RADIUS_MI = 3958.8;
const MAX_DIST_MI = 15;
const BBOX_PAD_DEG = 0.15;

const REC_TYPES_KEEP = new Set([
  'National Park', 'National Forest', 'Wilderness', 'State Park',
  'Lake', 'River', 'Hot Spring', 'Ski Area', 'Waterfall',
  'Scenic Drive', 'Museum', 'Historic Site',
]);

// ── Haversine ──────────────────────────────────────────────────────────
function toRad(d) { return d * Math.PI / 180; }

function haversine(lat1, lng1, lat2, lng2) {
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return EARTH_RADIUS_MI * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function distToLine(lat, lng, coords) {
  let min = Infinity;
  for (let i = 0; i < coords.length - 1; i++) {
    const d = distToSegment(lat, lng, coords[i][1], coords[i][0], coords[i + 1][1], coords[i + 1][0]);
    if (d < min) min = d;
  }
  if (coords.length === 1) {
    min = haversine(lat, lng, coords[0][1], coords[0][0]);
  }
  return min;
}

function distToSegment(pLat, pLng, aLat, aLng, bLat, bLng) {
  const dx = bLng - aLng;
  const dy = bLat - aLat;
  if (dx === 0 && dy === 0) return haversine(pLat, pLng, aLat, aLng);

  let t = ((pLng - aLng) * dx + (pLat - aLat) * dy) / (dx * dx + dy * dy);
  t = Math.max(0, Math.min(1, t));
  const projLat = aLat + t * dy;
  const projLng = aLng + t * dx;
  return haversine(pLat, pLng, projLat, projLng);
}

// ── Bounding box ───────────────────────────────────────────────────────
function bbox(coords) {
  let minLng = Infinity, maxLng = -Infinity, minLat = Infinity, maxLat = -Infinity;
  for (const [lng, lat] of coords) {
    if (lng < minLng) minLng = lng;
    if (lng > maxLng) maxLng = lng;
    if (lat < minLat) minLat = lat;
    if (lat > maxLat) maxLat = lat;
  }
  return {
    minLng: minLng - BBOX_PAD_DEG,
    maxLng: maxLng + BBOX_PAD_DEG,
    minLat: minLat - BBOX_PAD_DEG,
    maxLat: maxLat + BBOX_PAD_DEG,
  };
}

function inBbox(lat, lng, bb) {
  return lat >= bb.minLat && lat <= bb.maxLat && lng >= bb.minLng && lng <= bb.maxLng;
}

// ── Load data ──────────────────────────────────────────────────────────
function loadJson(name) {
  return JSON.parse(fs.readFileSync(path.join(DATA_DIR, name), 'utf-8'));
}

// ── Corridors ──────────────────────────────────────────────────────────
const CORRIDORS = [
  {
    id: 'beartooth',
    name: 'Beartooth Highway',
    description: 'One of America\'s most scenic drives, climbing to 10,947 feet through alpine tundra above Red Lodge.',
    highways: ['US-212'],
    distanceMiles: 68,
    elevationRange: [5200, 10947],
    season: 'Late May – mid October',
    difficulty: 'challenging',
    color: '#c0392b',
    startTown: 'red-lodge',
    endTown: 'west-yellowstone',
    throughTowns: [],
    geometry: {
      type: 'LineString',
      coordinates: [
        [-109.123, 45.406], [-109.166, 45.362], [-109.233, 45.251], [-109.250, 45.174],
        [-109.270, 45.156], [-109.321, 45.091], [-109.333, 45.086], [-109.370, 45.086],
        [-109.415, 45.044], [-109.411, 45.004], [-109.859, 45.003], [-109.939, 45.018],
        [-110.002, 45.003],
      ],
    },
  },
  {
    id: 'paradise_valley',
    name: 'Paradise Valley',
    description: 'Follow the Yellowstone River south from Livingston through ranch country to the north entrance of Yellowstone.',
    highways: ['US-89'],
    distanceMiles: 53,
    elevationRange: [4500, 5314],
    season: 'Year-round',
    difficulty: 'easy',
    color: '#27ae60',
    startTown: 'livingston',
    endTown: 'west-yellowstone',
    throughTowns: [],
    geometry: {
      type: 'LineString',
      coordinates: [
        [-110.455, 45.707], [-110.501, 45.687], [-110.551, 45.646], [-110.574, 45.644],
        [-110.692, 45.018], [-110.706, 45.033], [-110.750, 45.052], [-110.766, 45.065],
        [-110.780, 45.100], [-110.821, 45.155], [-110.840, 45.166], [-110.874, 45.172],
        [-110.900, 45.194], [-110.899, 45.201], [-110.868, 45.257], [-110.857, 45.275],
        [-110.816, 45.313], [-110.782, 45.328],
      ],
    },
  },
  {
    id: 'skalkaho',
    name: 'Skalkaho Highway',
    description: 'A rugged mountain pass road connecting the Bitterroot Valley to the Philipsburg area, passing Skalkaho Falls.',
    highways: ['MT-38'],
    distanceMiles: 54,
    elevationRange: [3500, 7260],
    season: 'June – October',
    difficulty: 'challenging',
    color: '#8e44ad',
    startTown: 'hamilton',
    endTown: 'anaconda',
    throughTowns: [],
    geometry: {
      type: 'LineString',
      coordinates: [
        [-114.156, 46.207], [-114.092, 46.188], [-114.044, 46.174], [-113.963, 46.160],
        [-113.938, 46.166], [-113.931, 46.166], [-113.850, 46.219], [-113.826, 46.254],
        [-113.773, 46.246],
      ],
    },
  },
  {
    id: 'seeley_swan',
    name: 'Seeley-Swan Corridor',
    description: 'Wind through the scenic Clearwater and Swan valleys between the Mission and Swan mountain ranges.',
    highways: ['MT-83'],
    distanceMiles: 91,
    elevationRange: [3000, 4200],
    season: 'Year-round (winter driving caution)',
    difficulty: 'easy',
    color: '#2980b9',
    startTown: 'missoula',
    endTown: 'bigfork',
    throughTowns: [],
    geometry: {
      type: 'LineString',
      coordinates: [
        [-113.372, 47.002], [-113.396, 47.059], [-113.385, 47.079], [-113.402, 47.101],
        [-113.444, 47.118], [-113.495, 47.192], [-113.511, 47.206], [-113.575, 47.304],
        [-113.594, 47.362], [-113.633, 47.387], [-113.670, 47.436], [-113.677, 47.488],
        [-113.743, 47.561], [-113.760, 47.600], [-113.810, 47.682], [-113.831, 47.781],
        [-113.835, 47.911], [-113.884, 47.958], [-113.954, 48.008], [-113.974, 48.052],
        [-113.975, 48.094], [-114.089, 48.095],
      ],
    },
  },
  {
    id: 'pintler',
    name: 'Pintler Scenic Route',
    description: 'A peaceful alternative to I-90, looping through Georgetown Lake and the Pintler Mountains.',
    highways: ['MT-1'],
    distanceMiles: 64,
    elevationRange: [4300, 6800],
    season: 'Year-round',
    difficulty: 'moderate',
    color: '#d35400',
    startTown: 'anaconda',
    endTown: 'deer-lodge',
    throughTowns: [],
    geometry: {
      type: 'LineString',
      coordinates: [
        [-112.790, 46.094], [-112.827, 46.097], [-112.897, 46.128], [-112.928, 46.126],
        [-112.964, 46.131], [-113.285, 46.218], [-113.292, 46.232], [-113.297, 46.233],
        [-113.333, 46.247], [-113.323, 46.291], [-113.306, 46.310], [-113.315, 46.359],
        [-113.313, 46.382], [-113.307, 46.398], [-113.297, 46.402], [-113.266, 46.436],
        [-113.235, 46.459], [-113.234, 46.481], [-113.222, 46.495], [-113.228, 46.515],
        [-113.217, 46.555], [-113.171, 46.624], [-113.154, 46.672],
      ],
    },
  },
  {
    id: 'flathead_lake',
    name: 'Flathead Lake Loop',
    description: 'Circle Montana\'s largest natural freshwater lake through cherry orchards, state parks, and lake towns.',
    highways: ['US-93', 'MT-35'],
    distanceMiles: 85,
    elevationRange: [2893, 3200],
    season: 'Year-round',
    difficulty: 'easy',
    color: '#2e86ab',
    startTown: 'polson',
    endTown: 'kalispell',
    throughTowns: ['bigfork'],
    geometry: {
      type: 'LineString',
      coordinates: [
        [-114.096, 47.173], [-114.106, 47.198], [-114.169, 47.244], [-114.172, 47.253],
        [-114.168, 47.261], [-114.185, 47.280], [-114.171, 47.292], [-114.147, 47.297],
        [-114.124, 47.307], [-114.097, 47.327], [-114.097, 47.531], [-114.113, 47.548],
        [-114.126, 47.689], [-114.143, 47.693], [-114.176, 47.697], [-114.209, 47.726],
        [-114.228, 47.743], [-114.242, 47.770], [-114.236, 47.798], [-114.239, 47.807],
        [-114.260, 47.812], [-114.291, 47.799], [-114.310, 47.798], [-114.318, 47.811],
        [-114.348, 47.819], [-114.350, 47.830], [-114.345, 47.834], [-114.309, 47.839],
        [-114.284, 47.839], [-114.278, 47.850], [-114.286, 47.859], [-114.284, 47.868],
        [-114.222, 47.876], [-114.213, 47.886], [-114.219, 47.894], [-114.218, 47.903],
        [-114.175, 47.921], [-114.193, 47.948], [-114.189, 47.962],
      ],
    },
  },
  {
    id: 'bitterroot',
    name: 'Bitterroot Valley',
    description: 'Follow the Bitterroot River south from Missoula through small towns backed by the dramatic Bitterroot Range.',
    highways: ['US-93'],
    distanceMiles: 75,
    elevationRange: [3200, 4300],
    season: 'Year-round',
    difficulty: 'easy',
    color: '#16a085',
    startTown: 'missoula',
    endTown: 'hamilton',
    throughTowns: [],
    geometry: {
      type: 'LineString',
      coordinates: [
        [-114.039, 46.904], [-114.039, 46.885], [-114.039, 46.837],
        [-114.170, 46.081], [-114.178, 46.022], [-114.167, 46.006],
        [-114.170, 45.994], [-114.161, 45.982], [-114.138, 45.970], [-114.117, 45.929],
      ],
    },
  },
  {
    id: 'kings_hill',
    name: 'Kings Hill Scenic Byway',
    description: 'Climb through the Little Belt Mountains past Showdown ski area, with views stretching to the Crazy Mountains.',
    highways: ['US-89'],
    distanceMiles: 71,
    elevationRange: [3900, 7393],
    season: 'Year-round (snow in winter)',
    difficulty: 'moderate',
    color: '#f39c12',
    startTown: 'great-falls',
    endTown: 'lewistown',
    throughTowns: [],
    geometry: {
      type: 'LineString',
      coordinates: [
        [-111.214, 47.493], [-110.970, 47.425], [-110.932, 47.238], [-110.910, 47.268],
        [-110.900, 47.292], [-110.905, 47.322], [-110.903, 47.343], [-110.897, 47.349],
        [-110.914, 47.369], [-110.952, 47.384], [-110.963, 47.418], [-110.971, 47.425],
        [-110.906, 46.548], [-110.872, 46.551], [-110.843, 46.585], [-110.841, 46.605],
        [-110.849, 46.628], [-110.870, 46.649], [-110.878, 46.670], [-110.878, 46.678],
        [-110.863, 46.699], [-110.851, 46.731], [-110.864, 46.750], [-110.865, 46.770],
        [-110.832, 46.773], [-110.757, 46.761], [-110.719, 46.760], [-110.700, 46.776],
        [-110.697, 46.787], [-110.706, 46.809], [-110.695, 46.826], [-110.695, 46.841],
      ],
    },
  },
  {
    id: 'big_hole',
    name: 'Big Hole Valley',
    description: 'Remote ranch country and world-class trout fishing in the "Valley of 10,000 Haystacks."',
    highways: ['MT-43', 'MT-278'],
    distanceMiles: 110,
    elevationRange: [5100, 6800],
    season: 'Year-round (snow common)',
    difficulty: 'moderate',
    color: '#8b6914',
    startTown: 'butte',
    endTown: 'dillon',
    throughTowns: [],
    geometry: {
      type: 'LineString',
      coordinates: [
        [-112.731, 45.753], [-112.752, 45.750], [-112.781, 45.757], [-112.809, 45.761],
        [-112.835, 45.777], [-112.866, 45.777], [-112.892, 45.787], [-112.902, 45.780],
        [-112.938, 45.792], [-112.951, 45.791], [-112.979, 45.800], [-113.044, 45.830],
        [-113.069, 45.851], [-113.084, 45.861], [-113.103, 45.883], [-113.178, 45.886],
        [-113.195, 45.879], [-113.215, 45.879], [-113.253, 45.851], [-113.272, 45.821],
        [-113.295, 45.822], [-113.313, 45.808], [-113.330, 45.803], [-113.352, 45.786],
        [-113.366, 45.752], [-113.427, 45.697], [-113.437, 45.680], [-113.448, 45.618],
        [-113.503, 45.632], [-113.573, 45.627], [-113.680, 45.638], [-113.718, 45.657],
        [-113.806, 45.656], [-113.916, 45.685], [-113.930, 45.681], [-113.934, 45.685],
      ],
    },
  },
  {
    id: 'pioneer',
    name: 'Pioneer Mountains Scenic Byway',
    description: 'Loop through the Pioneer Mountains past ghost towns, Crystal Park, and pristine alpine meadows.',
    highways: ['MT-43', 'MT-484'],
    distanceMiles: 49,
    elevationRange: [5500, 7800],
    season: 'June – October',
    difficulty: 'moderate',
    color: '#7d3c98',
    startTown: 'dillon',
    endTown: 'butte',
    throughTowns: [],
    geometry: {
      type: 'LineString',
      coordinates: [
        [-112.731, 45.753], [-112.781, 45.757], [-112.809, 45.761], [-112.835, 45.777],
        [-112.866, 45.777], [-112.892, 45.787], [-112.938, 45.792], [-112.979, 45.800],
        [-113.044, 45.830], [-113.069, 45.851], [-113.084, 45.861], [-113.103, 45.883],
        [-113.178, 45.886], [-113.215, 45.879], [-113.253, 45.851], [-113.295, 45.822],
        [-113.313, 45.808],
      ],
    },
  },
  {
    id: 'glacier_east',
    name: 'Glacier Park East Side',
    description: 'Drive along the Rocky Mountain Front from Browning to East Glacier, with views of Glacier\'s peaks rising to the west.',
    highways: ['US-2', 'US-89'],
    distanceMiles: 110,
    elevationRange: [3400, 5216],
    season: 'Year-round (US-2); Going-to-the-Sun seasonal',
    difficulty: 'moderate',
    color: '#1a5276',
    startTown: 'kalispell',
    endTown: 'choteau',
    throughTowns: [],
    geometry: {
      type: 'LineString',
      coordinates: [
        [-113.379, 48.998], [-113.395, 48.957], [-113.432, 48.922], [-113.439, 48.902],
        [-113.437, 48.858], [-113.416, 48.843], [-113.420, 48.818], [-113.407, 48.793],
        [-113.416, 48.760], [-113.429, 48.746], [-113.415, 48.725], [-113.415, 48.702],
        [-113.390, 48.699], [-113.350, 48.688], [-113.358, 48.682], [-113.344, 48.671],
        [-113.341, 48.659], [-113.333, 48.659], [-113.314, 48.647], [-113.311, 48.630],
        [-113.271, 48.592], [-113.278, 48.571], [-113.269, 48.553], [-113.271, 48.549],
        [-113.263, 48.539], [-113.189, 48.543], [-113.175, 48.549], [-113.134, 48.544],
        [-113.088, 48.556], [-113.022, 48.556], [-113.010, 48.548], [-113.010, 48.530],
        [-112.955, 48.532], [-112.863, 48.577], [-112.830, 48.583], [-112.780, 48.602],
        [-112.676, 48.624], [-112.389, 48.624], [-112.356, 48.630], [-112.338, 48.640],
        [-112.276, 48.610], [-112.189, 48.579],
      ],
    },
  },
  {
    id: 'hwy200',
    name: 'Highway 200 Corridor',
    description: 'Cross the heart of Montana from Missoula through the Blackfoot Valley to Great Falls — the route of Lewis and Clark.',
    highways: ['MT-200'],
    distanceMiles: 175,
    elevationRange: [3200, 5600],
    season: 'Year-round',
    difficulty: 'easy',
    color: '#566573',
    startTown: 'missoula',
    endTown: 'great-falls',
    throughTowns: [],
    geometry: {
      type: 'LineString',
      coordinates: [
        [-114.131, 46.952], [-114.036, 46.914], [-113.975, 46.866], [-113.951, 46.867],
        [-113.925, 46.888], [-113.875, 46.869], [-113.836, 46.889], [-113.780, 46.893],
        [-113.752, 46.904], [-113.698, 46.915], [-113.684, 46.908], [-113.667, 46.914],
        [-113.621, 46.892], [-113.481, 46.882], [-113.458, 46.890], [-113.442, 46.910],
        [-113.429, 46.950], [-113.390, 46.995], [-113.303, 47.024], [-113.185, 47.045],
        [-113.122, 47.021], [-113.049, 47.007], [-112.990, 46.979], [-112.960, 46.948],
        [-112.941, 46.939], [-112.904, 46.946], [-112.873, 46.936], [-112.865, 46.924],
        [-112.847, 46.939], [-112.805, 46.950], [-112.796, 46.939], [-112.584, 46.965],
        [-112.528, 46.987], [-112.432, 47.045], [-112.387, 47.045], [-112.374, 47.061],
        [-112.373, 47.087], [-112.354, 47.101], [-112.359, 47.115], [-112.334, 47.134],
        [-112.299, 47.179], [-112.232, 47.227], [-112.213, 47.268], [-112.185, 47.285],
        [-112.130, 47.298], [-112.087, 47.326], [-112.046, 47.366], [-112.010, 47.402],
        [-111.971, 47.471], [-111.940, 47.494], [-111.828, 47.495], [-111.801, 47.511],
        [-111.749, 47.519], [-111.708, 47.540], [-111.605, 47.546], [-111.536, 47.563],
        [-111.345, 47.485], [-111.332, 47.489], [-111.301, 47.494], [-111.214, 47.493],
      ],
    },
  },
  {
    id: 'missouri_breaks',
    name: 'Missouri Breaks Country',
    description: 'Open prairie, deep river canyons, and the wild Upper Missouri River Breaks — Lewis and Clark\'s Montana.',
    highways: ['US-87'],
    distanceMiles: 145,
    elevationRange: [2600, 4400],
    season: 'Year-round',
    difficulty: 'easy',
    color: '#a04000',
    startTown: 'lewistown',
    endTown: 'great-falls',
    throughTowns: [],
    geometry: {
      type: 'LineString',
      coordinates: [
        [-108.631, 46.811], [-108.672, 46.842], [-108.680, 46.855], [-108.744, 46.911],
        [-108.755, 46.934], [-108.751, 46.958], [-108.786, 46.992], [-108.803, 47.041],
        [-108.953, 47.048], [-109.012, 47.062], [-109.168, 47.059], [-109.266, 47.076],
        [-109.308, 47.059], [-109.346, 47.072], [-109.418, 47.071], [-109.442, 47.056],
        [-109.554, 47.055], [-109.589, 47.041], [-109.629, 47.012], [-109.685, 46.984],
        [-109.756, 46.985], [-109.799, 46.997], [-109.869, 47.004], [-109.874, 47.021],
        [-109.905, 47.053], [-110.072, 47.055], [-110.095, 47.059], [-110.117, 47.076],
        [-110.144, 47.077], [-110.160, 47.096], [-110.235, 47.154], [-110.297, 47.168],
        [-110.424, 47.213], [-110.490, 47.256], [-110.679, 47.258], [-110.703, 47.265],
        [-110.720, 47.264], [-110.758, 47.280], [-110.788, 47.283], [-110.827, 47.293],
        [-110.836, 47.307], [-110.894, 47.347], [-110.913, 47.368], [-110.951, 47.383],
        [-110.963, 47.418], [-110.971, 47.425], [-111.032, 47.450], [-111.123, 47.461],
        [-111.175, 47.486], [-111.214, 47.493],
      ],
    },
  },
];

// ── Main ───────────────────────────────────────────────────────────────
function main() {
  const hotSprings = loadJson('hot-springs.json');
  const campgrounds = loadJson('campgrounds.json');
  const hiking = loadJson('hiking.json');
  const townRec = loadJson('town-recreation.json');
  const townCoords = loadJson('town-coordinates.json');

  const allTownSlugs = new Set(Object.keys(townCoords));

  const corridorTowns = (c) => [c.startTown, c.endTown, ...c.throughTowns];

  const result = CORRIDORS.map((corridor) => {
    const coords = corridor.geometry.coordinates;
    const bb = bbox(coords);
    const pois = [];
    const seen = new Set();

    const addPoi = (p) => {
      const key = `${p.name}|${p.lat}|${p.lng}`;
      if (seen.has(key)) return;
      seen.add(key);
      pois.push(p);
    };

    // Hot springs
    for (const hs of hotSprings) {
      if (!inBbox(hs.lat, hs.lng, bb)) continue;
      const d = distToLine(hs.lat, hs.lng, coords);
      if (d <= MAX_DIST_MI) {
        addPoi({
          name: hs.name,
          type: hs.type || 'hot spring',
          category: 'hotspring',
          lat: hs.lat,
          lng: hs.lng,
          distFromRoute: Math.round(d * 10) / 10,
          rating: hs.rating ?? null,
          reviews: hs.reviews ?? null,
        });
      }
    }

    // Campgrounds
    for (const cg of campgrounds) {
      if (!inBbox(cg.lat, cg.lng, bb)) continue;
      const d = distToLine(cg.lat, cg.lng, coords);
      if (d <= MAX_DIST_MI) {
        addPoi({
          name: cg.name,
          type: cg.category || cg.type || 'campground',
          category: 'campground',
          lat: cg.lat,
          lng: cg.lng,
          distFromRoute: Math.round(d * 10) / 10,
          rating: cg.rating ?? null,
          reviews: cg.reviews ?? null,
        });
      }
    }

    // Hiking
    for (const h of hiking) {
      if (!inBbox(h.lat, h.lng, bb)) continue;
      const d = distToLine(h.lat, h.lng, coords);
      if (d <= MAX_DIST_MI) {
        addPoi({
          name: h.name,
          type: h.category || h.type || 'trail',
          category: 'hiking',
          lat: h.lat,
          lng: h.lng,
          distFromRoute: Math.round(d * 10) / 10,
          rating: h.rating ?? null,
          reviews: h.reviews ?? null,
        });
      }
    }

    // Town recreation — find towns near the corridor and pull qualifying sites
    const nearTowns = new Set(corridorTowns(corridor));
    for (const slug of allTownSlugs) {
      const tc = townCoords[slug];
      if (!tc || tc.lat == null || tc.lng == null) continue;
      if (!inBbox(tc.lat, tc.lng, bb)) continue;
      const d = distToLine(tc.lat, tc.lng, coords);
      if (d <= MAX_DIST_MI) nearTowns.add(slug);
    }

    for (const slug of nearTowns) {
      const entry = townRec[slug];
      if (!entry || !entry.places) continue;
      for (const place of entry.places) {
        if (!REC_TYPES_KEEP.has(place.type)) continue;
        if (place.lat == null || place.lng == null) continue;
        const d = distToLine(place.lat, place.lng, coords);
        if (d <= MAX_DIST_MI) {
          addPoi({
            name: place.name,
            type: place.type,
            category: 'recreation',
            lat: place.lat,
            lng: place.lng,
            distFromRoute: Math.round(d * 10) / 10,
            rating: null,
            reviews: null,
          });
        }
      }
    }

    pois.sort((a, b) => a.distFromRoute - b.distFromRoute);

    return {
      id: corridor.id,
      name: corridor.name,
      description: corridor.description,
      highways: corridor.highways,
      distanceMiles: corridor.distanceMiles,
      elevationRange: corridor.elevationRange,
      season: corridor.season,
      difficulty: corridor.difficulty,
      color: corridor.color,
      startTown: corridor.startTown,
      endTown: corridor.endTown,
      throughTowns: corridor.throughTowns,
      connections: [],
      geometry: corridor.geometry,
      pois,
    };
  });

  // Build connections: corridors that share a start/end town
  const townEndpoints = new Map();
  for (const c of result) {
    for (const t of [c.startTown, c.endTown, ...c.throughTowns]) {
      if (!townEndpoints.has(t)) townEndpoints.set(t, []);
      townEndpoints.get(t).push(c.id);
    }
  }

  for (const c of result) {
    const connected = new Set();
    for (const t of [c.startTown, c.endTown, ...c.throughTowns]) {
      const ids = townEndpoints.get(t) || [];
      for (const id of ids) {
        if (id !== c.id) connected.add(id);
      }
    }
    c.connections = [...connected].sort();
  }

  fs.writeFileSync(OUT_FILE, JSON.stringify(result, null, 2));

  // Summary
  let totalPois = 0;
  for (const c of result) {
    totalPois += c.pois.length;
    console.log(
      `  ${c.name.padEnd(32)} ${String(c.pois.length).padStart(4)} POIs  connections: [${c.connections.join(', ')}]`
    );
  }
  console.log(`\nWrote ${result.length} corridors (${totalPois} total POIs) → ${OUT_FILE}`);
}

main();
