#!/usr/bin/env node
/**
 * Prepend YAML frontmatter to marker deep-read articles that lack it.
 * Skips files that already start with ---.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, '../..');
const MARKERS_DIR = path.join(REPO_ROOT, 'articles_information', 'markers');

function loadTownSlugs() {
  const p = path.join(REPO_ROOT, 'cities_towns_list', 'towns.txt');
  if (!fs.existsSync(p)) return new Set();
  const text = fs.readFileSync(p, 'utf8');
  const set = new Set();
  for (const line of text.split(/\r?\n/)) {
    const name = line.trim();
    if (!name) continue;
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
    set.add(slug);
  }
  return set;
}

function stripMd(s) {
  return s
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/\s+/g, ' ')
    .trim();
}

function extractTitle(body) {
  const lines = body.split(/\r?\n/);
  for (const line of lines) {
    const m = line.match(/^#\s+(.+)/);
    if (m) return m[1].trim();
  }
  for (const line of lines) {
    const m = line.match(/^##\s+(.+)/);
    if (m) return m[1].trim();
  }
  for (const line of lines) {
    const t = line.trim();
    if (t && !t.startsWith('*') && !t.startsWith('**')) return t.replace(/^["']|["']$/g, '').trim();
  }
  return 'Montana historic marker';
}

function extractRelatedTowns(body, townSlugs) {
  const italic = body.match(/\*([^*]{3,120})\*/);
  if (!italic) return [];
  const chunk = italic[1].split(/[|—]/)[0].trim();
  const beforeComma = chunk.split(',')[0].trim();
  const words = beforeComma.split(/\s+/);
  const candidates = [];
  for (let n = Math.min(4, words.length); n >= 1; n--) {
    candidates.push(words.slice(-n).join(' '));
  }
  for (const c of candidates) {
    const slug = c
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
    if (townSlugs.has(slug)) return [slug];
  }
  return [];
}

function guessTags(title, body) {
  const t = `${title} ${body}`.toLowerCase();
  const tags = ['history', 'historic-markers'];
  const add = (x) => {
    if (!tags.includes(x)) tags.push(x);
  };
  if (/nez\s*perce|1877|little\s*bighorn|custer|battle/i.test(t)) add('military');
  if (/lewis|clark|corps|expedition|lolo/i.test(t)) add('lewis-and-clark');
  if (/salish|kootenai|flathead|blackfeet|tribal|indigenous/i.test(t)) add('native-american');
  if (/mine|mining|copper|butte|smelter/i.test(t)) add('mining');
  if (/railroad|milwaukee|northern pacific|depot/i.test(t)) add('railroads');
  if (/fire|1910|blowup/i.test(t)) add('disasters');
  if (/geolog|glacial|precambrian|belt supergroup/i.test(t)) add('geology');
  return tags.slice(0, 8);
}

function excerptFromBody(body) {
  const lines = body.split(/\r?\n/);
  let i = 0;
  while (i < lines.length && /^\s*(\*\*|#|\*|By |\*[^*]+\*)\s*$|^\*\*By/.test(lines[i].trim()) || lines[i].trim() === '')
    i++;
  let para = '';
  while (i < lines.length && lines[i].trim() !== '' && !lines[i].trim().startsWith('##')) {
    para += (para ? ' ' : '') + lines[i].trim();
    i++;
  }
  const plain = stripMd(para);
  if (plain.length <= 200) return plain;
  return plain.slice(0, 197).trim() + '…';
}

function yamlEscape(s) {
  if (/["\n]/.test(s)) return JSON.stringify(s);
  return `"${s.replace(/"/g, '\\"')}"`;
}

function main() {
  const townSlugs = loadTownSlugs();
  const today = new Date().toISOString().slice(0, 10);
  let updated = 0;
  let skipped = 0;

  const files = fs.readdirSync(MARKERS_DIR).filter((f) => f.endsWith('.md')).sort();

  for (const name of files) {
    const fp = path.join(MARKERS_DIR, name);
    const raw = fs.readFileSync(fp, 'utf8');
    if (raw.trimStart().startsWith('---')) {
      skipped++;
      continue;
    }

    const title = extractTitle(raw);
    const slug = path.basename(name, '.md');
    const excerpt = excerptFromBody(raw) || `Companion narrative for the historic marker: ${title}.`;
    const metaDesc =
      excerpt.length > 155 ? excerpt.slice(0, 152).trim() + '…' : excerpt;
    const related = extractRelatedTowns(raw, townSlugs);
    const tags = guessTags(title, raw);

    const fm = `---
title: ${yamlEscape(title)}
slug: ${slug}
type: montana-facts
tags: [${tags.join(', ')}]
featured: false
excerpt: ${yamlEscape(excerpt)}
hero_image: /images/hero-image.jpg
hero_alt: ${yamlEscape('Montana landscape')}
meta_description: ${yamlEscape(metaDesc)}
related_towns: [${related.join(', ')}]
related_topics: []
date_published: ${today}
date_modified: ${today}
---

`;

    fs.writeFileSync(fp, fm + raw.trimStart(), 'utf8');
    updated++;
  }

  console.log(JSON.stringify({ updated, skipped, total: files.length }, null, 2));
}

main();
