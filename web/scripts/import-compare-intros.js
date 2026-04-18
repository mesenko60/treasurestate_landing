#!/usr/bin/env node
/**
 * Copy town_comparison_ articles/*.md into web/content/compare-intros/{a}-vs-{b}.md
 * using canonical alphabetical slug order. Logs files whose segments are not valid town slugs.
 *
 * Run from repo root: node web/scripts/import-compare-intros.js
 */
'use strict';

const fs = require('fs');
const path = require('path');

const repoRoot = path.resolve(__dirname, '..', '..');
const webRoot = path.join(repoRoot, 'web');
const sourceDir = path.join(repoRoot, 'town_comparison_ articles');
const destDir = path.join(webRoot, 'content', 'compare-intros');

function slugify(input) {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

function loadValidSlugs() {
  const townsPath = path.join(repoRoot, 'cities_towns_list', 'towns.txt');
  const lines = fs.readFileSync(townsPath, 'utf8').split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  return new Set(lines.map((name) => slugify(name)));
}

function main() {
  if (!fs.existsSync(sourceDir)) {
    console.error('Source dir missing:', sourceDir);
    process.exit(1);
  }
  fs.mkdirSync(destDir, { recursive: true });
  const slugSet = loadValidSlugs();
  const files = fs.readdirSync(sourceDir).filter((f) => f.endsWith('.md'));
  let ok = 0;
  let skipped = 0;
  const problems = [];

  for (const file of files) {
    const base = file.replace(/\.md$/i, '');
    const parts = base.split('_vs_');
    if (parts.length !== 2) {
      problems.push(`bad name (expected towna_vs_townb): ${file}`);
      skipped += 1;
      continue;
    }
    const slugA = parts[0].replace(/_/g, '-');
    const slugB = parts[1].replace(/_/g, '-');
    if (!slugSet.has(slugA) || !slugSet.has(slugB)) {
      problems.push(`unknown slug: ${file} -> ${slugA}, ${slugB}`);
      skipped += 1;
      continue;
    }
    const [a, b] = [slugA, slugB].sort();
    const destName = `${a}-vs-${b}.md`;
    const src = path.join(sourceDir, file);
    const dest = path.join(destDir, destName);
    fs.copyFileSync(src, dest);
    ok += 1;
  }

  console.log(`Copied ${ok} intro files to ${destDir}`);
  if (skipped) console.log(`Skipped ${skipped} files`);
  if (problems.length) {
    console.log('--- issues ---');
    for (const p of problems) console.log(p);
  }
}

main();
