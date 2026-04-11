#!/usr/bin/env node
/**
 * ETL script: imports all web/data/*.json POI files into the unified
 * Supabase `pois` table for GPS proximity queries.
 *
 * Usage:
 *   node scripts/import-pois-to-supabase.js          # upsert all sources
 *   node scripts/import-pois-to-supabase.js --dry-run # preview without writing
 */

require('dotenv').config({ path: require('path').resolve(__dirname, '../.env.local') });
// Fall back to parent .env if .env.local doesn't have Supabase vars
if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
}

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const DRY_RUN = process.argv.includes('--dry-run');
const DATA_DIR = path.resolve(__dirname, '../data');
const BATCH_SIZE = 200;

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

function loadJSON(filename) {
  const filepath = path.join(DATA_DIR, filename);
  if (!fs.existsSync(filepath)) {
    console.warn(`  Skipping ${filename} — file not found`);
    return null;
  }
  return JSON.parse(fs.readFileSync(filepath, 'utf8'));
}

function slugify(text) {
  if (!text) return null;
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function cleanString(val) {
  if (!val) return null;
  return String(val).replace(/^"+|"+$/g, '').trim() || null;
}

// ─── Source adapters ────────────────────────────────────────────

function extractHistoricMarkers() {
  const data = loadJSON('historic-markers-curated.json');
  if (!data) return [];
  return data.map(m => ({
    source_id: m.id,
    slug: m.slug,
    name: m.title,
    description: m.inscription ? m.inscription.substring(0, 1000) : null,
    category: 'historic_marker',
    subcategory: m.topics && m.topics.length ? m.topics[0] : null,
    lat: m.lat,
    lng: m.lng,
    content_url: `/guides/historic-markers/${m.slug}/`,
    nearest_town: m.town,
    nearest_town_slug: m.townSlug,
    county: m.county,
    source_file: 'historic-markers-curated.json',
    metadata: { subtitle: m.subtitle, topics: m.topics, yearErected: m.yearErected, erectedBy: m.erectedBy },
  }));
}

function extractHotSprings() {
  const data = loadJSON('hot-springs.json');
  if (!data) return [];
  return data.map(h => ({
    source_id: h.slug,
    slug: h.slug,
    name: h.name,
    description: h.description,
    category: 'hot_spring',
    subcategory: h.type,
    lat: h.lat,
    lng: h.lng,
    content_url: `/guides/hot-springs/${h.slug}/`,
    nearest_town: h.nearestTownName,
    nearest_town_slug: h.nearestTown,
    website: h.website,
    phone: cleanString(h.phone),
    address: h.address,
    rating: h.rating,
    reviews: h.reviews,
    source_file: 'hot-springs.json',
    metadata: { tempF: h.tempF, hours: h.hours, cost: h.cost, access: h.access, hikeMiles: h.hikeMiles, yearRound: h.yearRound },
  }));
}

function extractCampgrounds() {
  const data = loadJSON('campgrounds.json');
  if (!data) return [];
  return data.map(c => ({
    source_id: c.slug,
    slug: c.slug,
    name: c.name,
    description: null,
    category: 'campground',
    subcategory: c.category,
    lat: c.lat,
    lng: c.lng,
    content_url: `/guides/campgrounds/${c.slug}/`,
    nearest_town: c.nearestTownName,
    nearest_town_slug: c.nearestTown,
    website: cleanString(c.website),
    phone: cleanString(c.phone),
    address: cleanString(c.address),
    rating: c.rating,
    reviews: c.reviews,
    source_file: 'campgrounds.json',
    metadata: {},
  }));
}

function extractHiking() {
  const data = loadJSON('hiking.json');
  if (!data) return [];
  return data.map(h => ({
    source_id: h.slug,
    slug: h.slug,
    name: h.name,
    description: null,
    category: 'hiking',
    subcategory: h.category,
    lat: h.lat,
    lng: h.lng,
    content_url: `/guides/hiking/${h.slug}/`,
    nearest_town: h.nearestTownName,
    nearest_town_slug: h.nearestTown,
    website: cleanString(h.website),
    phone: cleanString(h.phone),
    address: cleanString(h.address),
    rating: h.rating,
    reviews: h.reviews,
    source_file: 'hiking.json',
    metadata: {},
  }));
}

function extractStateParks() {
  const data = loadJSON('state-parks.json');
  if (!data) return [];
  return data.map(p => ({
    source_id: p.slug,
    slug: p.slug,
    name: p.name,
    description: p.description,
    category: 'state_park',
    subcategory: p.category,
    lat: p.lat,
    lng: p.lng,
    content_url: `/guides/state-parks/${p.slug}/`,
    nearest_town: p.nearestTownName,
    nearest_town_slug: p.nearestTown,
    website: p.website,
    phone: p.phone,
    address: p.address,
    source_file: 'state-parks.json',
    metadata: { acreage: p.acreage, camping: p.camping, campsites: p.campsites, activities: p.activities, established: p.established },
  }));
}

function extractSkiAreas() {
  const data = loadJSON('skiing-areas.json');
  if (!data) return [];
  return data.map(s => ({
    source_id: s.slug,
    slug: s.slug,
    name: s.name,
    description: s.description,
    category: 'ski_area',
    subcategory: s.category,
    lat: s.lat,
    lng: s.lng,
    content_url: `/guides/skiing/${s.slug}/`,
    nearest_town: s.nearestTownName,
    nearest_town_slug: s.nearestTown,
    website: s.website,
    phone: s.phone,
    address: s.address,
    source_file: 'skiing-areas.json',
    metadata: { verticalDrop: s.verticalDrop, skiableAcres: s.skiableAcres, runs: s.runs, lifts: s.lifts, annualSnowfall: s.annualSnowfall, nightSkiing: s.nightSkiing },
  }));
}

function extractWildlifeViewing() {
  const data = loadJSON('wildlife-viewing-areas.json');
  if (!data) return [];
  return data.map(w => ({
    source_id: w.slug,
    slug: w.slug,
    name: w.name,
    description: w.description,
    category: 'wildlife_viewing',
    subcategory: w.category,
    lat: w.lat,
    lng: w.lng,
    content_url: `/guides/wildlife-viewing/${w.slug}/`,
    nearest_town: w.nearestTownName,
    nearest_town_slug: w.nearestTown,
    website: w.website,
    phone: w.phone,
    address: w.address,
    source_file: 'wildlife-viewing-areas.json',
    metadata: { species: w.species, bestSeason: w.bestSeason, managedBy: w.managedBy, accessType: w.accessType },
  }));
}

function extractPhotographyLocations() {
  const data = loadJSON('photography-locations.json');
  if (!data) return [];
  return data.map(p => ({
    source_id: p.slug,
    slug: p.slug,
    name: p.name,
    description: p.description,
    category: 'photography',
    subcategory: p.category,
    lat: p.lat,
    lng: p.lng,
    content_url: `/guides/photography/${p.slug}/`,
    nearest_town: p.nearestTownName,
    nearest_town_slug: p.nearestTown,
    website: p.website,
    address: p.address,
    source_file: 'photography-locations.json',
    metadata: { subjects: p.subjects, bestSeason: p.bestSeason, bestTime: p.bestTime, difficulty: p.difficulty, hikingRequired: p.hikingRequired },
  }));
}

function extractHuntingAreas() {
  const data = loadJSON('hunting-areas.json');
  if (!data) return [];
  return data.map(h => ({
    source_id: h.slug,
    slug: h.slug,
    name: h.name,
    description: h.description,
    category: 'hunting_area',
    subcategory: h.category,
    lat: h.lat,
    lng: h.lng,
    content_url: `/guides/hunting/${h.slug}/`,
    nearest_town: h.nearestTownName,
    nearest_town_slug: h.nearestTown,
    website: h.website,
    source_file: 'hunting-areas.json',
    metadata: { species: h.species, season: h.season, accessType: h.accessType, managedBy: h.managedBy, acreage: h.acreage },
  }));
}

function extractGolfCourses() {
  const data = loadJSON('golf-courses.json');
  if (!data || !data.courses) return [];
  return data.courses
    .filter(c => c.latitude && c.longitude)
    .map(c => ({
      source_id: slugify(c.course_name),
      slug: slugify(c.course_name),
      name: c.course_name,
      description: c.description,
      category: 'golf_course',
      subcategory: c.course_type,
      lat: c.latitude,
      lng: c.longitude,
      content_url: `/guides/golf/${slugify(c.course_name)}/`,
      nearest_town: c.city,
      county: c.county,
      website: c.website,
      phone: c.phone,
      address: c.address,
      rating: (c.rating && !isNaN(Number(c.rating))) ? Number(c.rating) : null,
      source_file: 'golf-courses.json',
      metadata: { holes: c.holes, par: c.par, yardage: c.yardage, slope: c.slope, designer: c.designer, yearOpened: c.year_opened },
    }));
}

function extractTowns() {
  const data = loadJSON('town-coordinates.json');
  if (!data) return [];
  return Object.entries(data).map(([slug, t]) => ({
    source_id: slug,
    slug,
    name: t.name,
    description: null,
    category: 'town',
    subcategory: null,
    lat: t.lat,
    lng: t.lng,
    content_url: `/montana-towns/${slug}/`,
    source_file: 'town-coordinates.json',
    metadata: {},
  }));
}

function extractCorridorPOIs() {
  const data = loadJSON('corridors.json');
  if (!data) return [];
  const pois = [];
  for (const corridor of data) {
    if (!corridor.pois) continue;
    for (const poi of corridor.pois) {
      pois.push({
        source_id: `${corridor.id}_${slugify(poi.name)}`,
        slug: slugify(poi.name),
        name: poi.name,
        description: null,
        category: 'corridor_poi',
        subcategory: poi.category,
        lat: poi.lat,
        lng: poi.lng,
        content_url: `/planners/corridors/${corridor.id}/`,
        rating: poi.rating,
        reviews: poi.reviews,
        source_file: 'corridors.json',
        metadata: { corridor_id: corridor.id, corridor_name: corridor.name, type: poi.type, distFromRoute: poi.distFromRoute },
      });
    }
  }
  return pois;
}

function extractGNIS(filename, category) {
  const data = loadJSON(filename);
  if (!data) return [];
  return data
    .filter(item => item.lat && item.lng)
    .map(item => ({
      source_id: `gnis_${slugify(item.name)}_${item.lat}`,
      slug: slugify(item.name),
      name: item.name,
      description: null,
      category,
      subcategory: item.type || null,
      lat: item.lat,
      lng: item.lng,
      source_file: filename,
      metadata: {},
    }));
}

function extractOSMRecreation() {
  const data = loadJSON('osm-recreation-sites.json');
  if (!data) return [];
  return data
    .filter(item => item.lat && item.lng)
    .map(item => ({
      source_id: `osm_${slugify(item.name)}_${item.lat}`,
      slug: slugify(item.name),
      name: item.name,
      description: null,
      category: 'recreation_site',
      subcategory: item.type || null,
      lat: item.lat,
      lng: item.lng,
      source_file: 'osm-recreation-sites.json',
      metadata: {},
    }));
}

// ─── Main ─────────────────────────────────────────────────────

async function upsertBatch(rows) {
  if (DRY_RUN) return { count: rows.length };
  const { data, error } = await supabase
    .from('pois')
    .upsert(rows, { onConflict: 'source_file,source_id', ignoreDuplicates: false });
  if (error) throw new Error(`Upsert error: ${error.message}`);
  return { count: rows.length };
}

async function importSource(label, extractFn) {
  process.stdout.write(`  ${label}... `);
  let rows = extractFn();
  if (!rows.length) {
    console.log('0 rows (skipped)');
    return 0;
  }

  // Deduplicate by (source_file, source_id) — keep the last occurrence
  const seen = new Map();
  for (const row of rows) {
    const key = `${row.source_file}::${row.source_id}`;
    seen.set(key, row);
  }
  rows = [...seen.values()];

  let total = 0;
  for (let i = 0; i < rows.length; i += BATCH_SIZE) {
    const batch = rows.slice(i, i + BATCH_SIZE);
    const result = await upsertBatch(batch);
    total += result.count;
  }
  console.log(`${total} rows`);
  return total;
}

async function main() {
  console.log(`\nPOI Import to Supabase${DRY_RUN ? ' (DRY RUN)' : ''}`);
  console.log('─'.repeat(50));

  let grandTotal = 0;

  grandTotal += await importSource('Historic markers', extractHistoricMarkers);
  grandTotal += await importSource('Hot springs', extractHotSprings);
  grandTotal += await importSource('Campgrounds', extractCampgrounds);
  grandTotal += await importSource('Hiking / trails', extractHiking);
  grandTotal += await importSource('State parks', extractStateParks);
  grandTotal += await importSource('Ski areas', extractSkiAreas);
  grandTotal += await importSource('Wildlife viewing', extractWildlifeViewing);
  grandTotal += await importSource('Photography locations', extractPhotographyLocations);
  grandTotal += await importSource('Hunting areas', extractHuntingAreas);
  grandTotal += await importSource('Golf courses', extractGolfCourses);
  grandTotal += await importSource('Towns', extractTowns);
  grandTotal += await importSource('Corridor POIs', extractCorridorPOIs);
  grandTotal += await importSource('Waterfalls (GNIS)', () => extractGNIS('gnis-waterfalls.json', 'waterfall'));
  grandTotal += await importSource('Fishing access (GNIS)', () => extractGNIS('gnis-fishing-access.json', 'fishing_access'));
  grandTotal += await importSource('State parks (GNIS)', () => extractGNIS('gnis-state-parks.json', 'gnis_state_park'));
  grandTotal += await importSource('Recreation sites (OSM)', extractOSMRecreation);

  console.log('─'.repeat(50));
  console.log(`Total: ${grandTotal} POIs${DRY_RUN ? ' (dry run — nothing written)' : ' imported'}\n`);
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
