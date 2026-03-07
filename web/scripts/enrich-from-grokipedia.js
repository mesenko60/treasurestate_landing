#!/usr/bin/env node
/**
 * Grokipedia Enrichment Script
 *
 * Outputs Grokipedia URLs for each town so you can manually fetch and enrich
 * markdown files. Run: node web/scripts/enrich-from-grokipedia.js
 *
 * To fetch programmatically (requires network), uncomment the fetch logic.
 * Grokipedia URL format: https://grokipedia.com/page/{Town}_Montana
 * (spaces → underscores, e.g. "St. Ignatius" → "St._Ignatius")
 */

const fs = require('fs');
const path = require('path');

const townsPath = path.resolve(__dirname, '..', '..', 'cities_towns_list', 'towns.txt');
const contentDir = path.resolve(__dirname, '..', '..', 'cities_towns_content');

function toGrokipediaSlug(name) {
  return name.replace(/\s+/g, '_').replace(/\./g, '.') + ',_Montana';
}

function slugify(name) {
  return name.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-');
}

function hasGrokipediaCitation(mdPath) {
  if (!fs.existsSync(mdPath)) return false;
  const content = fs.readFileSync(mdPath, 'utf8');
  return /Grokipedia|grokipedia\.com/i.test(content);
}

function main() {
  const towns = fs.readFileSync(townsPath, 'utf8')
    .split(/\r?\n/)
    .map(l => l.trim())
    .filter(Boolean);

  console.log('# Grokipedia Enrichment Checklist\n');
  console.log(`Total towns: ${towns.length}\n`);

  let withCitation = 0;
  let withoutCitation = 0;

  for (const town of towns) {
    const slug = toGrokipediaSlug(town);
    const url = `https://grokipedia.com/page/${slug}`;
    const mdName = `${town}, Montana.md`;
    const mdPath = path.join(contentDir, mdName);
    const hasCitation = hasGrokipediaCitation(mdPath);

    if (hasCitation) withCitation++;
    else withoutCitation++;

    const status = hasCitation ? '✓' : ' ';
    console.log(`[${status}] ${town}`);
    console.log(`    URL: ${url}`);
    if (!hasCitation) console.log(`    File: ${mdName}`);
    console.log('');
  }

  console.log(`\n---\nWith Grokipedia: ${withCitation}\nWithout: ${withoutCitation}`);
}

main();
