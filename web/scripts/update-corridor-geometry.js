#!/usr/bin/env node
/**
 * Replace sparse corridor geometry with detailed road-following coordinates.
 *
 * Strategy:
 * 1. Use existing sparse corridor waypoints to anchor the route
 * 2. Call Mapbox Directions API to get road-snapped geometry
 * 3. Optionally enrich with PostGIS highway data from Supabase
 *
 * Usage:  node scripts/update-corridor-geometry.js
 * Prereq: .env.local with NEXT_PUBLIC_MAPBOX_TOKEN (required),
 *         NEXT_PUBLIC_SUPABASE_URL + NEXT_PUBLIC_SUPABASE_ANON_KEY (optional enrichment)
 */

const fs = require('fs');
const path = require('path');

require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
const CORRIDORS_PATH = path.join(__dirname, '..', 'data', 'corridors.json');

if (!MAPBOX_TOKEN) {
  console.error('Missing NEXT_PUBLIC_MAPBOX_TOKEN in .env.local');
  process.exit(1);
}

/**
 * Subsample an array of coordinates to at most `maxPts` points,
 * always keeping first and last.
 */
function subsample(coords, maxPts) {
  if (coords.length <= maxPts) return coords;
  const result = [coords[0]];
  const step = (coords.length - 1) / (maxPts - 1);
  for (let i = 1; i < maxPts - 1; i++) {
    result.push(coords[Math.round(i * step)]);
  }
  result.push(coords[coords.length - 1]);
  return result;
}

/**
 * Call Mapbox Directions API with up to 25 waypoints.
 * Returns the full route geometry as [lng, lat] coordinate array.
 */
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
  return {
    coordinates: data.routes[0].geometry.coordinates,
    distance: data.routes[0].distance,
    duration: data.routes[0].duration,
  };
}

/**
 * For corridors with > 25 waypoints, split into chunks of ≤25,
 * overlapping by 1 point, then concatenate the results.
 */
async function getDirectionsChunked(waypoints) {
  const MAX_WAYPOINTS = 25;

  if (waypoints.length <= MAX_WAYPOINTS) {
    return getDirectionsGeometry(waypoints);
  }

  const allCoords = [];
  let totalDist = 0, totalDur = 0;
  let start = 0;

  while (start < waypoints.length - 1) {
    const end = Math.min(start + MAX_WAYPOINTS, waypoints.length);
    const chunk = waypoints.slice(start, end);

    console.log(`    Chunk ${start}..${end - 1} (${chunk.length} waypoints)`);
    const result = await getDirectionsGeometry(chunk);

    if (allCoords.length > 0) {
      allCoords.push(...result.coordinates.slice(1));
    } else {
      allCoords.push(...result.coordinates);
    }
    totalDist += result.distance;
    totalDur += result.duration;

    start = end - 1; // overlap by 1
    // Rate limit courtesy
    if (start < waypoints.length - 1) {
      await new Promise(r => setTimeout(r, 200));
    }
  }

  return { coordinates: allCoords, distance: totalDist, duration: totalDur };
}

async function main() {
  const corridors = JSON.parse(fs.readFileSync(CORRIDORS_PATH, 'utf8'));
  let updated = 0;

  for (const corridor of corridors) {
    console.log(`\n=== ${corridor.id} (${corridor.highways.join(', ')}) ===`);
    console.log(`  Original: ${corridor.geometry.coordinates.length} sparse points`);
    console.log(`  ${corridor.startTown} → ${corridor.endTown}`);

    const originalWaypoints = corridor.geometry.coordinates;

    try {
      const result = await getDirectionsChunked(originalWaypoints);
      const newCoords = result.coordinates;
      const distMiles = (result.distance / 1609.34).toFixed(1);

      console.log(`  Result: ${newCoords.length} road-following points`);
      console.log(`  Distance: ${distMiles} mi`);
      console.log(`  Start: [${newCoords[0][0].toFixed(4)}, ${newCoords[0][1].toFixed(4)}]`);
      console.log(`  End:   [${newCoords[newCoords.length-1][0].toFixed(4)}, ${newCoords[newCoords.length-1][1].toFixed(4)}]`);

      corridor.geometry.coordinates = newCoords;
      corridor.distanceMiles = parseFloat(distMiles);
      updated++;
    } catch (err) {
      console.error(`  ERROR: ${err.message}`);
      console.log('  Keeping original geometry');
    }

    // Rate limit between corridors
    await new Promise(r => setTimeout(r, 300));
  }

  fs.writeFileSync(CORRIDORS_PATH, JSON.stringify(corridors, null, 2) + '\n');
  console.log(`\n✓ Updated ${updated}/${corridors.length} corridors`);
  console.log(`  File: ${CORRIDORS_PATH}`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
