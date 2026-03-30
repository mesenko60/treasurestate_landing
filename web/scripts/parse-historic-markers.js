#!/usr/bin/env node
/**
 * Parse Montana Historic Markers CSV and generate JSON data files
 * 
 * Input: Historic_markers/Montana_Historic_Markers_Directory.csv
 * Output: 
 *   - web/data/historic-markers.json (all markers)
 *   - web/data/historic-markers-curated.json (high-value markers for individual pages)
 */

const fs = require('fs');
const path = require('path');

const CSV_PATH = path.join(__dirname, '../../Historic_markers/Montana_Historic_Markers_Directory.csv');
const TOWN_COORDS_PATH = path.join(__dirname, '../data/town-coordinates.json');
const OUTPUT_PATH = path.join(__dirname, '../data/historic-markers.json');
const CURATED_OUTPUT_PATH = path.join(__dirname, '../data/historic-markers-curated.json');

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

// Generate URL-safe slug from title
function slugify(text, id) {
  const base = text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .substring(0, 60);
  return `${base}-${id}`;
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

/** Decode common HTML entities (numeric + a few named). */
function decodeHtmlEntities(text) {
  if (!text) return '';
  return text
    .replace(/&#(\d+);/g, (_, n) => {
      const code = parseInt(n, 10);
      if (!Number.isFinite(code) || code < 0 || code > 0x10ffff) return _;
      return String.fromCodePoint(code);
    })
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => {
      const code = parseInt(h, 16);
      if (!Number.isFinite(code) || code < 0 || code > 0x10ffff) return _;
      return String.fromCodePoint(code);
    })
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'");
}

/** Strip simple HTML tags (HMDB sometimes wraps titles in <i>). */
function stripHtmlTags(text) {
  if (!text) return '';
  return text.replace(/<\/?[a-z][a-z0-9]*(?:\s[^>]*)?>\s*/gi, '');
}

/** Plain-text title/subtitle for display; slugs still use raw CSV title. */
function cleanTitle(text) {
  if (!text) return '';
  let t = decodeHtmlEntities(text);
  t = stripHtmlTags(t);
  t = t.replace(/\u00a0/g, ' ').replace(/\s+/g, ' ').trim();
  return t;
}

/**
 * Remove HMDB directory boilerplate and normalize whitespace.
 * Does not rewrite marker wording — only strips site metadata and fixes spacing.
 */
function cleanInscription(text) {
  if (!text) return '';

  let t = text
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .replace(/\u00a0/g, ' ')
    .replace(/\u200b/g, '')
    .replace(/\ufeff/g, '');

  // HMDB insertions mid-inscription (GeoTour / photo index — NOT on the physical marker)
  t = t.replace(/\n?\s*Paid Advertisement\s*\n?/gi, '\n');
  // Remove each Photographed-by line only (do NOT cut from first occurrence to EOF — that drops real text)
  t = t.replace(/\nPhotographed by[^\n]+/gi, '');
  // Catalog lines like "2. Black Gold Marker on left"
  t = t.replace(/\n\d+\.\s*[^\n]*\bMarker\b[^\n]*/gi, '');

  // HMDB tails (order: broad cuts that include everything after the header)
  t = t.replace(/\s*Topics and series\.?[\s\S]*$/im, '');

  // Fragments if Topics line was missing or malformed
  t = t.replace(/\s*This historical marker is listed in these topic\s*\n*\s*lists?:[\s\S]*$/im, '');
  t = t.replace(/\s*This historical marker is listed in this topic\s*\n*\s*list:[\s\S]*$/im, '');
  t = t.replace(/\s*Location\.[\s\S]*$/im, '');
  t = t.replace(/\s*Touch for map\.[\s\S]*$/im, '');
  t = t.replace(/\s*Other nearby markers\.[\s\S]*$/im, '');
  t = t.replace(/\s*More about this marker\.[\s\S]*$/im, '');
  t = t.replace(/\s*Additional keywords\.[\s\S]*$/im, '');

  t = t.replace(/Paid Advertisement/gi, '');

  // HMDB photo-guide lines (quoted-title variant; numbered Marker lines handled above)
  t = t.replace(/\nMarker at the [^\n]*\s*/gi, '\n');
  t = t.replace(/\nThe marker is on the (left|right)\.?\s*\n?/gi, '\n');

  // Legacy single-line patterns
  t = t.replace(/Topics\.\s*$/gm, '');
  t = t.replace(/^\s*Topics and series\.?\s*$/gim, '');
  t = t.replace(/This historical marker is listed in these topic lists:.*$/gm, '');
  t = t.replace(/This historical marker is listed in this topic list:.*$/gm, '');
  t = t.replace(/Location\.\s*Marker (is|was) located.*$/gm, '');
  t = t.replace(/Touch for map\..*$/gm, '');

  t = stripHtmlTags(decodeHtmlEntities(t));

  // Rejoin narrative broken when HMDB lines were removed (e.g. "paleontologists" / "identified")
  let prevJoin;
  do {
    prevJoin = t;
    t = t.replace(/([a-z,;])\s*\n+\s*([a-z])/g, '$1 $2');
  } while (t !== prevJoin);

  // Clear section headers from HMDB GeoTour panels (keep bullet content; spacing only)
  t = t.replace(/\n(GeoFacts:|Geo-Activities:)\s*\n/g, '\n\n$1\n\n');

  t = t.replace(/\n{3,}/g, '\n\n');
  t = t
    .split('\n')
    .map((line) => line.replace(/[ \t]+$/g, '').replace(/^[ \t]+/g, ''))
    .join('\n');
  t = t.trim();

  return t;
}

// Determine if marker qualifies for individual page (~150-200 target)
// Tier3 threshold below 2000 because cleaned inscriptions drop HMDB boilerplate length.
function isCuratedMarker(marker) {
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
  
  // Tier 3: Exceptional length markers (post-clean text; threshold tuned vs pre-clean ~2000)
  if (inscriptionLength > 1880) {
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
    const title = cleanTitle(rawTitle) || 'Unknown Marker';
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
    const subtitleClean = subtitleRaw ? cleanTitle(subtitleRaw) : '';

    const rawInscription = record['Inscription'] || '';
    const marker = {
      id,
      slug: slugify(rawTitle, id),
      title,
      subtitle: subtitleClean || null,
      lat,
      lng,
      town: record['City or Town'] || null,
      townSlug,
      county: county.replace(' County', '').replace(' Parish', ''),
      inscription: cleanInscription(rawInscription),
      topics,
      yearErected: record['Year Erected'] || null,
      erectedBy: record['Erected By'] || null,
      hmdbLink: record['Link'] || null,
      nearbyMarkers: record['Nearby Markers']
        ? record['Nearby Markers']
            .split('|')
            .map((s) => s.trim())
            .filter((s) => s && s !== 'Marker')
            .slice(0, 5)
        : [],
    };
    
    markers.push(marker);
    stats.total++;
    
    if (isCuratedMarker(marker)) {
      curated.push(marker);
      stats.curated++;
    }
  }
  
  // Sort markers by title
  markers.sort((a, b) => a.title.localeCompare(b.title));
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
