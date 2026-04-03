#!/usr/bin/env node
/**
 * Replace straight-line history trail segments with road-following geometry
 * from the Mapbox Directions API.
 *
 * For each trail:
 * 1. Resolve markerIds → lat/lng from historic-markers.json
 * 2. Order stops via nearest-neighbor from easternmost
 * 3. Route consecutive stops through the Directions API
 * 4. Store pre-computed routeGeometry in history-trails.json
 *
 * Usage:  node scripts/update-trail-geometry.js
 */

const fs = require('fs');
const path = require('path');

require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
const TRAILS_PATH = path.join(__dirname, '..', 'data', 'history-trails.json');
const MARKERS_PATH = path.join(__dirname, '..', 'data', 'historic-markers.json');
const MAX_EDGE_MILES = 95;

if (!MAPBOX_TOKEN) {
  console.error('Missing NEXT_PUBLIC_MAPBOX_TOKEN in .env.local');
  process.exit(1);
}

function haversineMiles(lat1, lng1, lat2, lng2) {
  const R = 3959;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function orderStopsNearestNeighborFromEast(stops) {
  if (stops.length <= 2) return [...stops];
  const remaining = [...stops];
  const easternmost = remaining.reduce((a, b) => (a.lng >= b.lng ? a : b));
  const startIdx = remaining.indexOf(easternmost);
  const ordered = [];
  const [first] = remaining.splice(startIdx, 1);
  ordered.push(first);
  let current = first;
  while (remaining.length) {
    let bestI = 0, bestD = Infinity;
    for (let i = 0; i < remaining.length; i++) {
      const d = haversineMiles(current.lat, current.lng, remaining[i].lat, remaining[i].lng);
      if (d < bestD) { bestD = d; bestI = i; }
    }
    current = remaining.splice(bestI, 1)[0];
    ordered.push(current);
  }
  return ordered;
}

async function getDirectionsGeometry(waypoints) {
  const coordStr = waypoints.map(p => `${p[0]},${p[1]}`).join(';');
  const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${coordStr}`
    + `?geometries=geojson&overview=full&continue_straight=true`
    + `&access_token=${MAPBOX_TOKEN}`;

  const resp = await fetch(url);
  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(`Directions API ${resp.status}: ${text}`);
  }
  const data = await resp.json();
  if (!data.routes || data.routes.length === 0) {
    throw new Error('No route found');
  }
  return data.routes[0].geometry.coordinates;
}

/**
 * For a group of stops, get road-following geometry via chunked Directions API calls.
 * Handles the 25-waypoint limit by splitting into overlapping chunks.
 */
async function getRouteForStops(stops) {
  const MAX_WAYPOINTS = 25;
  const waypoints = stops.map(s => [s.lng, s.lat]);

  if (waypoints.length < 2) return [];

  if (waypoints.length <= MAX_WAYPOINTS) {
    return getDirectionsGeometry(waypoints);
  }

  const allCoords = [];
  let start = 0;

  while (start < waypoints.length - 1) {
    const end = Math.min(start + MAX_WAYPOINTS, waypoints.length);
    const chunk = waypoints.slice(start, end);

    const coords = await getDirectionsGeometry(chunk);
    if (allCoords.length > 0) {
      allCoords.push(...coords.slice(1));
    } else {
      allCoords.push(...coords);
    }

    start = end - 1;
    if (start < waypoints.length - 1) {
      await new Promise(r => setTimeout(r, 250));
    }
  }

  return allCoords;
}

/**
 * Build route segments for a trail, breaking at gaps > MAX_EDGE_MILES.
 * Each contiguous group of stops gets its own Directions API route.
 */
async function buildTrailRouteSegments(orderedStops) {
  if (orderedStops.length < 2) return [];

  // Group consecutive stops into segments, breaking at large gaps
  const groups = [];
  let group = [orderedStops[0]];

  for (let i = 1; i < orderedStops.length; i++) {
    const d = haversineMiles(
      orderedStops[i - 1].lat, orderedStops[i - 1].lng,
      orderedStops[i].lat, orderedStops[i].lng
    );
    if (d <= MAX_EDGE_MILES) {
      group.push(orderedStops[i]);
    } else {
      if (group.length >= 2) groups.push(group);
      group = [orderedStops[i]];
    }
  }
  if (group.length >= 2) groups.push(group);

  // Get Directions geometry for each group
  const segments = [];
  for (let g = 0; g < groups.length; g++) {
    const grp = groups[g];
    console.log(`    Segment ${g + 1}/${groups.length}: ${grp.length} stops`);
    try {
      const coords = await getRouteForStops(grp);
      if (coords.length > 0) {
        // Round to 5 decimal places
        const rounded = coords.map(p => [
          Math.round(p[0] * 100000) / 100000,
          Math.round(p[1] * 100000) / 100000,
        ]);
        segments.push(rounded);
      }
    } catch (err) {
      console.error(`    Error routing segment: ${err.message}`);
    }
    if (g < groups.length - 1) {
      await new Promise(r => setTimeout(r, 300));
    }
  }

  return segments;
}

async function main() {
  const trails = JSON.parse(fs.readFileSync(TRAILS_PATH, 'utf8'));
  const allMarkers = JSON.parse(fs.readFileSync(MARKERS_PATH, 'utf8'));
  const idLookup = new Map(allMarkers.map(m => [m.id, m]));

  let updated = 0;

  for (const trail of trails) {
    console.log(`\n=== ${trail.name} (${trail.id}) ===`);

    // Resolve markerIds → marker objects
    const rawStops = [];
    for (const mid of trail.markerIds) {
      const m = idLookup.get(mid);
      if (m) rawStops.push({ id: m.id, lat: m.lat, lng: m.lng });
    }

    if (rawStops.length < 2) {
      console.log(`  Only ${rawStops.length} stops — skipping`);
      continue;
    }

    // Order stops geographically
    const ordered = orderStopsNearestNeighborFromEast(rawStops);
    console.log(`  ${ordered.length} stops ordered`);

    // Build road-following segments
    const segments = await buildTrailRouteSegments(ordered);
    const totalPts = segments.reduce((s, seg) => s + seg.length, 0);
    console.log(`  ${segments.length} segments, ${totalPts} total road-following points`);

    trail.routeGeometry = segments;
    updated++;

    // Rate limit between trails
    await new Promise(r => setTimeout(r, 300));
  }

  fs.writeFileSync(TRAILS_PATH, JSON.stringify(trails, null, 2) + '\n');
  console.log(`\n✓ Updated ${updated}/${trails.length} trails`);
  console.log(`  File: ${TRAILS_PATH}`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
