#!/usr/bin/env node
/**
 * Generate web/public/_redirects for Netlify from historic marker data.
 *
 * Legacy URLs used the pattern: /historic-markers/{slug}-{markerID}/
 * Current URLs are:              /historic-markers/{slug}/
 *
 * This script writes one 301 redirect per marker so old links (search-engine
 * cached, bookmarks, external sites) resolve correctly. It also handles
 * curated markers with dedup suffixes (e.g. "bannack-2") whose legacy URL
 * would be "bannack-2-{id}".
 *
 * Run after parse-historic-markers.js has written historic-markers.json.
 *
 * Usage: node web/scripts/generate-redirects.js
 */

'use strict';

const fs = require('fs');
const path = require('path');

const DATA_PATH = path.join(__dirname, '..', 'data', 'historic-markers.json');
const CURATED_PATH = path.join(__dirname, '..', 'data', 'historic-markers-curated.json');
const OUT_PATH = path.join(__dirname, '..', 'public', '_redirects');

function main() {
  const markers = JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'));

  let curatedSlugs = new Set();
  if (fs.existsSync(CURATED_PATH)) {
    const curated = JSON.parse(fs.readFileSync(CURATED_PATH, 'utf8'));
    curatedSlugs = new Set((Array.isArray(curated) ? curated : []).map((m) => m.slug));
  }

  const lines = [];
  const seen = new Set();

  for (const m of markers) {
    const oldPath = `/historic-markers/${m.slug}-${m.id}/`;

    if (seen.has(oldPath)) continue;
    seen.add(oldPath);

    const destPath = curatedSlugs.has(m.slug)
      ? `/historic-markers/${m.slug}/`
      : `/historic-markers/`;

    if (oldPath !== destPath) {
      lines.push(`${oldPath}  ${destPath}  301`);
    }
  }

  lines.sort();

  fs.writeFileSync(OUT_PATH, lines.join('\n') + '\n', 'utf8');
  console.log(`Wrote ${lines.length} redirects to ${OUT_PATH}`);
}

main();
