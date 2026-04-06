#!/usr/bin/env node
/**
 * Parse Montana Historic Markers CSV and generate JSON data files
 *
 * All display text is normalized via scripts/lib/historic-marker-text.js (source-metadata
 * junk, spacing, entities). Site-wide regex belongs there only for unambiguous metadata
 * stripping — not for narrative formatting (orphan line breaks, kiosk typos, etc.).
 * Those are fixed one marker at a time in historic-marker-inscription-overrides.json
 * (agent-reviewed). Use scripts/audit-historic-marker-text.js to find candidates.
 *
 * Input: Historic_markers/Montana_Historic_Markers_Directory.csv
 * Output:
 *   - web/data/historic-markers.json (all markers)
 *   - web/data/historic-markers-curated.json (high-value markers for individual pages)
 */

const fs = require('fs');
const path = require('path');

const {
  cleanMarkerTitle,
  cleanMarkerShortField,
  cleanMarkerInscription,
} = require('./lib/historic-marker-text');

const MARKER_ARTICLES_DIR = path.join(__dirname, '../../articles_information/markers');
const CSV_PATH = path.join(__dirname, '../../Historic_markers/Montana_Historic_Markers_Directory.csv');
const TOWN_COORDS_PATH = path.join(__dirname, '../data/town-coordinates.json');
const OUTPUT_PATH = path.join(__dirname, '../data/historic-markers.json');
const CURATED_OUTPUT_PATH = path.join(__dirname, '../data/historic-markers-curated.json');
const OVERRIDES_PATH = path.join(__dirname, '../data/historic-marker-inscription-overrides.json');

function loadInscriptionOverrides() {
  try {
    const raw = fs.readFileSync(OVERRIDES_PATH, 'utf8');
    const obj = JSON.parse(raw);
    return obj && typeof obj === 'object' ? obj : {};
  } catch {
    return {};
  }
}

// Topic normalization map
const TOPIC_MAP = {
  'Architecture': 'architecture',
  'Industry & Commerce': 'industry',
  'Exploration': 'exploration',
  'Indigenous Peoples and Communities': 'native-american',
  'Settlements & Settlers': 'settlements',
  'Wars': 'military',
  'US Indian': 'military',
  'Roads & Vehicles': 'transportation',
  'Disasters': 'disasters',
  'Animals': 'nature',
  'Entertainment': 'culture',
  'Railroads & Streetcars': 'railroads',
  'Natural Features': 'nature',
  'Waterways & Vessels': 'nature',
  'Mining': 'mining',
  'Agriculture': 'agriculture',
  'Education': 'education',
  'Government': 'government',
  'Religion': 'religion',
  'Science & Medicine': 'science',
  'Military': 'military',
  'Notable Events': 'events',
  'Notable Places': 'landmarks',
  'Notable People': 'people',
  'Cemeteries & Burial Sites': 'cemeteries',
  'Parks & Recreational Areas': 'parks',
  'African Americans': 'people',
  'Women': 'people',
  'Forts': 'military',
  'Man-Made Features': 'landmarks',
};

// Parse CSV with proper handling of quoted fields and multi-line content
function parseCSV(content) {
  const lines = content.split('\n');
  const headers = parseCSVLine(lines[0]);
  const records = [];
  
  let currentRecord = '';
  let inQuotes = false;
  
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    
    // Count quotes to track if we're inside a quoted field
    const quoteCount = (line.match(/"/g) || []).length;
    
    if (!inQuotes) {
      currentRecord = line;
      inQuotes = quoteCount % 2 === 1;
    } else {
      currentRecord += '\n' + line;
      if (quoteCount % 2 === 1) {
        inQuotes = false;
      }
    }
    
    if (!inQuotes && currentRecord.trim()) {
      const values = parseCSVLine(currentRecord);
      if (values.length >= headers.length - 2) { // Allow some flexibility
        const record = {};
        headers.forEach((h, idx) => {
          record[h] = values[idx] || '';
        });
        records.push(record);
      }
      currentRecord = '';
    }
  }
  
  return records;
}

function parseCSVLine(line) {
  const values = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];
    
    if (char === '"' && !inQuotes) {
      inQuotes = true;
    } else if (char === '"' && inQuotes) {
      if (nextChar === '"') {
        current += '"';
        i++; // Skip escaped quote
      } else {
        inQuotes = false;
      }
    } else if (char === ',' && !inQuotes) {
      values.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  values.push(current.trim());
  
  return values;
}

// Generate URL-safe slug from title (base only, no ID)
function slugifyBase(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .substring(0, 60)
    .replace(/-$/, '');
}

// Match marker town to our town slugs
function matchTown(markerTown, townCoords) {
  if (!markerTown) return null;
  
  const normalized = markerTown.toLowerCase().trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-');
  
  // Direct match
  if (townCoords[normalized]) {
    return normalized;
  }
  
  // Try variations
  const variations = [
    normalized,
    normalized.replace(/-/g, ''),
    normalized.replace(/\s/g, '-'),
  ];
  
  for (const v of variations) {
    if (townCoords[v]) return v;
  }
  
  // Partial match
  for (const slug of Object.keys(townCoords)) {
    if (slug.includes(normalized) || normalized.includes(slug)) {
      return slug;
    }
  }
  
  return null;
}

// Normalize topics
function normalizeTopics(topicsStr) {
  if (!topicsStr) return [];
  
  const topics = topicsStr.split(',').map(t => t.trim()).filter(Boolean);
  const normalized = new Set();
  
  for (const topic of topics) {
    // Skip junk
    if (topic.includes('Paid Advertisement') || 
        topic.match(/^\d+\/\d+\/\d+$/) ||
        topic.length < 3) {
      continue;
    }
    
    // Map to normalized topic
    for (const [key, value] of Object.entries(TOPIC_MAP)) {
      if (topic.toLowerCase().includes(key.toLowerCase())) {
        normalized.add(value);
        break;
      }
    }
  }
  
  return Array.from(normalized);
}

// Determine if marker qualifies for individual page (~150-200 target)
// Tier3 threshold below 2000 because cleaned inscriptions drop boilerplate length.
function hasCompanionMarkerArticle(slug) {
  if (!slug) return false;
  try {
    return fs.existsSync(path.join(MARKER_ARTICLES_DIR, `${slug}.md`));
  } catch {
    return false;
  }
}

function isCuratedMarker(marker) {
  // Deep-read companion: any marker with a matching markdown file gets its own page.
  if (hasCompanionMarkerArticle(marker.slug)) {
    return true;
  }

  const inscriptionLength = marker.inscription.length;
  const topicCount = marker.topics.length;
  
  // Tier 1: Must-have high-value markers (title match only)
  const tier1Keywords = [
    'little bighorn', 'lewis and clark', 'lewis & clark', 'sacagawea',
    'national monument', 'national battlefield', 'bear paw battlefield',
    'big hole battlefield', 'chief joseph', 'nez perce',
    'vigilante', 'copper king', 'marcus daly', 'william a. clark'
  ];
  
  const titleLower = marker.title.toLowerCase();
  if (tier1Keywords.some(k => titleLower.includes(k))) {
    return true;
  }
  
  // Tier 2: Very substantial content with important topics
  const tier2Topics = ['military', 'native-american', 'exploration'];
  const hasTier2Topic = marker.topics.some(t => tier2Topics.includes(t));
  
  if (inscriptionLength > 1500 && hasTier2Topic && topicCount >= 2) {
    return true;
  }
  
  // Tier 3: Exceptional length markers (post-clean text; threshold tuned as cleaning rules evolve)
  if (inscriptionLength > 1874) {
    return true;
  }
  
  return false;
}

// Main execution
function main() {
  console.log('Parsing historic markers CSV...');
  
  // Load town coordinates for matching
  const townCoords = JSON.parse(fs.readFileSync(TOWN_COORDS_PATH, 'utf8'));
  
  // Read and parse CSV
  const csvContent = fs.readFileSync(CSV_PATH, 'utf8');
  const records = parseCSV(csvContent);
  
  console.log(`Parsed ${records.length} raw records`);

  const inscriptionOverrides = loadInscriptionOverrides();

  // Process markers
  const markers = [];
  const curated = [];
  const stats = {
    total: 0,
    missing: 0,
    noCoords: 0,
    matched: 0,
    unmatched: 0,
    curated: 0,
    byTopic: {},
    byCounty: {},
  };
  
  for (const record of records) {
    // Skip missing markers
    if (record['Missing'] && record['Missing'].trim()) {
      stats.missing++;
      continue;
    }
    
    const lat = parseFloat(record['Latitude (minus=S)']);
    const lng = parseFloat(record['Longitude (minus=W)']);
    
    // Skip invalid coordinates
    if (isNaN(lat) || isNaN(lng) || lat === 0 || lng === 0) {
      stats.noCoords++;
      continue;
    }
    
    const id = record['MarkerID'] || `m${stats.total}`;
    const rawTitle = record['Title'] || 'Unknown Marker';
    const title = cleanMarkerTitle(rawTitle) || 'Unknown Marker';
    const townSlug = matchTown(record['City or Town'], townCoords);
    
    if (townSlug) {
      stats.matched++;
    } else {
      stats.unmatched++;
    }
    
    const topics = normalizeTopics(record['Topics']);
    topics.forEach(t => {
      stats.byTopic[t] = (stats.byTopic[t] || 0) + 1;
    });
    
    const county = record['County or Parish'] || '';
    if (county) {
      stats.byCounty[county] = (stats.byCounty[county] || 0) + 1;
    }
    
    const subtitleRaw = record['Subtitle'] || '';
    const subtitleClean = subtitleRaw ? cleanMarkerTitle(subtitleRaw) : '';

    const rawInscription = record['Inscription'] || '';
    const ov = inscriptionOverrides[String(id)];

    let inscription = cleanMarkerInscription(rawInscription);
    if (ov && typeof ov.inscription === 'string' && ov.inscription.trim() !== '') {
      inscription = cleanMarkerInscription(ov.inscription);
    }

    let erectedBy = record['Erected By']
      ? cleanMarkerShortField(record['Erected By']) || null
      : null;
    if (ov && typeof ov.erectedBy === 'string' && ov.erectedBy.trim() !== '') {
      erectedBy = cleanMarkerShortField(ov.erectedBy);
    }

    const marker = {
      id,
      slug: slugifyBase(rawTitle),
      title,
      subtitle: subtitleClean || null,
      lat,
      lng,
      town: record['City or Town'] || null,
      townSlug,
      county: county.replace(' County', '').replace(' Parish', ''),
      inscription,
      topics,
      yearErected: record['Year Erected']
        ? cleanMarkerShortField(record['Year Erected']) || null
        : null,
      erectedBy,
      nearbyMarkers: record['Nearby Markers']
        ? record['Nearby Markers']
            .split('|')
            .map((s) => cleanMarkerTitle(s.trim()))
            .filter(
              (s) =>
                s &&
                s !== 'Marker' &&
                !/^paid advertisement$/i.test(s)
            )
            .slice(0, 5)
        : [],
    };
    
    markers.push(marker);
    stats.total++;
  }
  
  // Sort markers by title
  markers.sort((a, b) => a.title.localeCompare(b.title));
  
  // Deduplicate slugs: add -2, -3, etc. for collisions
  const slugCounts = {};
  for (const m of markers) {
    const base = m.slug;
    if (slugCounts[base] === undefined) {
      slugCounts[base] = 1;
    } else {
      slugCounts[base]++;
      m.slug = `${base}-${slugCounts[base]}`;
    }
  }
  
  // Curated list only after final slugs (companion filenames must match these slugs).
  curated.length = 0;
  for (const m of markers) {
    if (isCuratedMarker(m)) {
      curated.push(m);
    }
  }
  stats.curated = curated.length;
  curated.sort((a, b) => a.title.localeCompare(b.title));
  
  // Write output files
  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(markers, null, 2));
  fs.writeFileSync(CURATED_OUTPUT_PATH, JSON.stringify(curated, null, 2));
  
  // Print stats
  console.log('\n=== Historic Markers Processing Complete ===');
  console.log(`Total active markers: ${stats.total}`);
  console.log(`Skipped (missing): ${stats.missing}`);
  console.log(`Skipped (no coords): ${stats.noCoords}`);
  console.log(`Matched to towns: ${stats.matched}`);
  console.log(`Unmatched towns: ${stats.unmatched}`);
  console.log(`Curated for pages: ${stats.curated}`);
  console.log(`\nTop topics:`);
  Object.entries(stats.byTopic)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .forEach(([t, c]) => console.log(`  ${c}: ${t}`));
  console.log(`\nOutput files:`);
  console.log(`  ${OUTPUT_PATH}`);
  console.log(`  ${CURATED_OUTPUT_PATH}`);
}

main();
