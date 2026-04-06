#!/usr/bin/env node
/**
 * For each curated marker listed in docs/marker-companion-gaps.txt, write a plain-text
 * copy of marker fields from historic-markers.json (inscription, title, location, etc.).
 *
 * Output: docs/marker-gap-source-text/<slug>.txt
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, '../..');
const GAPS_TXT = path.join(REPO_ROOT, 'docs', 'marker-companion-gaps.txt');
const DATA_PATH = path.join(__dirname, '../data', 'historic-markers.json');
const OUT_DIR = path.join(REPO_ROOT, 'docs', 'marker-gap-source-text');

function main() {
  if (!fs.existsSync(GAPS_TXT)) {
    console.error('Missing', GAPS_TXT, '— run: cd web && npm run markers:gaps');
    process.exit(1);
  }

  const gapSlugs = fs
    .readFileSync(GAPS_TXT, 'utf8')
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  const all = JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'));
  const bySlug = new Map(all.map((m) => [m.slug, m]));

  fs.mkdirSync(OUT_DIR, { recursive: true });

  let written = 0;
  let missing = [];

  for (const slug of gapSlugs) {
    const m = bySlug.get(slug);
    if (!m) {
      missing.push(slug);
      continue;
    }

    const lines = [
      '=== Montana historic marker (source: web/data/historic-markers.json) ===',
      '',
      `Marker ID: ${m.id}`,
      `Slug: ${m.slug}`,
      `Title: ${m.title}`,
      m.subtitle ? `Subtitle: ${m.subtitle}` : null,
      `Town: ${m.town ?? ''}`,
      `County: ${m.county ?? ''}`,
      `Lat / Lng: ${m.lat}, ${m.lng}`,
      `Topics: ${(m.topics || []).join(', ')}`,
      `Year erected: ${m.yearErected ?? ''}`,
      `Erected by: ${m.erectedBy ?? ''}`,
      '',
      '--- Inscription (as stored for the site) ---',
      '',
      m.inscription || '(empty)',
      '',
    ].filter((x) => x !== null);

    const safeName = `${slug}.txt`;
    if (safeName.includes('/') || safeName.includes('..')) {
      missing.push(slug + ' (invalid path)');
      continue;
    }

    fs.writeFileSync(path.join(OUT_DIR, safeName), lines.join('\n'), 'utf8');
    written++;
  }

  console.log(`Wrote ${written} files → ${path.relative(REPO_ROOT, OUT_DIR)}/`);
  if (missing.length) {
    console.warn('Not found in historic-markers.json:', missing.join(', '));
    process.exit(missing.length === gapSlugs.length ? 1 : 0);
  }
}

main();
