#!/usr/bin/env node
/**
 * Fail the build if any articles_information/markers/*.md is not backed by a real
 * marker slug in historic-markers.json (filename stem must equal marker.slug).
 *
 * Exceptions:
 * - UMBRELLA_BASENAMES: multi-marker articles wired only via markerDeepReads.ts
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, '../..');
const MARKERS_DIR = path.join(REPO_ROOT, 'articles_information', 'markers');
const DATA_PATH = path.join(__dirname, '../data/historic-markers.json');

/** Companion files whose basename intentionally does not match any marker.slug */
const UMBRELLA_BASENAMES = new Set(['1910_fire']);

function main() {
  const all = JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'));
  const slugSet = new Set(all.map((m) => m.slug));

  const files = fs.readdirSync(MARKERS_DIR).filter((f) => f.endsWith('.md')).sort();
  const errors = [];

  for (const f of files) {
    const base = f.replace(/\.md$/, '');
    if (UMBRELLA_BASENAMES.has(base)) continue;
    if (!slugSet.has(base)) {
      errors.push(`${f}: no marker with slug "${base}" in historic-markers.json (rename file to match marker.slug, or add slug to UMBRELLA_BASENAMES if intentional).`);
    }
  }

  if (errors.length) {
    console.error('lint-marker-articles: FAILED\n' + errors.join('\n'));
    process.exit(1);
  }

  console.log(`lint-marker-articles: OK (${files.length} files, ${UMBRELLA_BASENAMES.size} umbrella)`);
}

main();
