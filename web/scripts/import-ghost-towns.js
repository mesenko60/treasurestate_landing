#!/usr/bin/env node
/**
 * Copy ghost-towns-all-75/{slug}.md -> web/content/ghost-towns/{slug}.md
 * Strip **By Editor** and county line (hero + JSON carry metadata).
 * Emit web/data/ghost-towns-curated.json for build-ghost-towns.js.
 *
 * Run from repo root: node web/scripts/import-ghost-towns.js
 */
'use strict';

const fs = require('fs');
const path = require('path');
const {
  extractCountyFromMarkdown,
  REGION_BY_SLUG,
  STATUS_BY_SLUG,
  NEAREST_TOWN_SLUG_BY_SLUG,
  countyLabelFromFips,
} = require('./ghost-towns-meta.cjs');

const repoRoot = path.resolve(__dirname, '..', '..');
const sourceDir = path.join(repoRoot, 'ghost-towns-all-75');
const destDir = path.join(repoRoot, 'web', 'content', 'ghost-towns');
const curatedOut = path.join(repoRoot, 'web', 'data', 'ghost-towns-curated.json');

function stripBylineAndCounty(md) {
  let s = md;
  s = s.replace(/(\r?\n|^)\s*\*\*By Editor\*\*\s*(\r?\n|$)/gi, '\n');
  s = s.replace(/(\r?\n|^)\s*\*By Editor\*\s*(\r?\n|$)/gi, '\n');
  s = s.replace(/\n\*\*[^*\n]+County[^*\n]*\*\*\s*\n+/i, '\n');
  s = s.replace(/\n\*[^*\n]*County[^*\n]*\*\s*\n+/i, '\n');
  return s;
}

function titleFromH1(md) {
  const m = md.match(/^#\s+(.+)/);
  return m ? m[1].trim() : '';
}

function main() {
  if (!fs.existsSync(sourceDir)) {
    console.error('Source dir missing:', sourceDir);
    process.exit(1);
  }
  fs.mkdirSync(destDir, { recursive: true });
  const files = fs.readdirSync(sourceDir).filter((f) => f.endsWith('.md'));
  const curated = [];

  for (const file of files) {
    const slug = file.replace(/\.md$/i, '');
    const src = path.join(sourceDir, file);
    const raw = fs.readFileSync(src, 'utf8');
    const { countyName, countyFips } = extractCountyFromMarkdown(raw);
    const name = titleFromH1(raw) || slug.replace(/-/g, ' ');
    const body = stripBylineAndCounty(raw);
    fs.writeFileSync(path.join(destDir, `${slug}.md`), body, 'utf8');

    const region = REGION_BY_SLUG[slug] || 'Montana';
    const status = STATUS_BY_SLUG[slug] || 'ruins';
    const nearestLivingTownSlug = NEAREST_TOWN_SLUG_BY_SLUG[slug] ?? null;

    curated.push({
      slug,
      name,
      countyName,
      countyFips,
      countyLabel: countyFips ? countyLabelFromFips(countyFips) : countyName ? `${countyName} County` : '',
      region,
      status,
      nearestLivingTownSlug,
    });
  }

  curated.sort((a, b) => a.slug.localeCompare(b.slug));
  fs.writeFileSync(curatedOut, JSON.stringify(curated, null, 2), 'utf8');
  console.log(`Imported ${curated.length} ghost town articles -> ${destDir}`);
  console.log(`Wrote ${curatedOut}`);
}

main();
