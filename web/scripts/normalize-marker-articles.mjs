#!/usr/bin/env node
/**
 * Dedupe and rename articles_information/markers/*.md:
 * - Delete space-titled copies when a slug-style twin exists (same content or near-dup).
 * - Rename remaining Title Case / spaced files to slugifyBase(filename) to match marker URLs.
 *
 * Slug rules mirror web/scripts/parse-historic-markers.js slugifyBase().
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const MARKERS_DIR = path.resolve(__dirname, '../../articles_information/markers');

function slugifyBase(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .substring(0, 60)
    .replace(/-$/, '');
}

/** Already URL-safe stems: do not slugify (avoids turning 1910_fire into 1910fire). */
function needsSlugRename(stem) {
  if (/[A-Z]/.test(stem)) return true;
  if (/\s/.test(stem)) return true;
  if (/[^a-z0-9._-]/i.test(stem)) return true;
  return false;
}

/** Exact duplicates (keep slug-style twin). */
const DELETE_IF_EXISTS = new Set([
  'A Lost World.md',
  'A Shortcut.md',
  'A Vast Network of Indigenous Trails.md',
  'Big Arm School.md',
  'Brave New World.md',
  'Cycles and Circles.md',
  'Danger Ahead!.md',
  'Fort Fizzle.md',
  'Journey Through the Blackfoot.md',
  'Lewis and Clark on Lolo Creek.md',
  'Motoring Through Paradise_ The Vigilante Trail.md',
  'Name That River.md',
  'Northwest Passage.md',
  'Soldiers as Naturalists.md',
  'The Beginning of the _Endless Missouri_.md',
  'The Blackfoot River Corridor.md',
  'The Bruck.md',
  'The Journey Home.md',
  'The Lewis Minus Clark Expedition.md',
  'The Way They Saw It.md',
  'Coursing Through Miles Of Montana.md',
  'Join the Voyage of Discovery.md',
  'Rattlesnake Creek.md',
  'Trapper Peak.md',
  'Lewis and Clark in Salish Territory.md',
]);

function main() {
  const files = fs.readdirSync(MARKERS_DIR).filter((f) => f.endsWith('.md'));
  let deleted = 0;
  let renamed = 0;

  for (const name of DELETE_IF_EXISTS) {
    const fp = path.join(MARKERS_DIR, name);
    if (fs.existsSync(fp)) {
      fs.unlinkSync(fp);
      deleted++;
      console.log('deleted', name);
    }
  }

  const remaining = fs.readdirSync(MARKERS_DIR).filter((f) => f.endsWith('.md'));

  for (const name of remaining) {
    const stem = name.replace(/\.md$/i, '');
    if (!needsSlugRename(stem)) continue;
    const targetStem = slugifyBase(stem);
    if (!targetStem) continue;
    const targetName = `${targetStem}.md`;
    if (name === targetName) continue;

    const src = path.join(MARKERS_DIR, name);
    const dest = path.join(MARKERS_DIR, targetName);

    if (fs.existsSync(dest)) {
      console.warn('skip rename (target exists):', name, '->', targetName);
      continue;
    }

    fs.renameSync(src, dest);
    renamed++;
    console.log('rename', name, '->', targetName);
  }

  console.log(JSON.stringify({ deleted, renamed }, null, 2));
}

main();
