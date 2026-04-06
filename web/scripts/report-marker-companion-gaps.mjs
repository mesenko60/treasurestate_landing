#!/usr/bin/env node
/**
 * Lists curated historic markers that have no companion deep-read article resolved
 * (same rules as generate-marker-deep-reads.mjs + 1910 umbrella slugs).
 *
 * Writes:
 *   docs/marker-companion-gaps.md   — human table
 *   docs/marker-companion-gaps.txt  — one slug per line (intended filename stem)
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, '../..');
const CURATED = path.join(__dirname, '../data/historic-markers-curated.json');
const MARKERS_DIR = path.join(REPO_ROOT, 'articles_information', 'markers');
const OUT_MD = path.join(REPO_ROOT, 'docs', 'marker-companion-gaps.md');
const OUT_TXT = path.join(REPO_ROOT, 'docs', 'marker-companion-gaps.txt');

const FIRE_SLUGS = new Set([
  'building-from-the-ashes',
  'pluck-and-good-fortune',
  'sliderock-lookout-tower',
]);

function findArticleFile(markerSlug) {
  const exact = path.join(MARKERS_DIR, `${markerSlug}.md`);
  if (fs.existsSync(exact)) return exact;

  const base = markerSlug.replace(/-\d+$/, '');
  if (base === markerSlug) return null;

  const baseFp = path.join(MARKERS_DIR, `${base}.md`);
  if (!fs.existsSync(baseFp)) return null;

  const hasNumberedSibling = fs
    .readdirSync(MARKERS_DIR)
    .some(
      (f) =>
        f.endsWith('.md') &&
        f.startsWith(`${base}-`) &&
        /-\d+\.md$/.test(f),
    );
  if (hasNumberedSibling) return null;

  return baseFp;
}

function escCell(s) {
  return String(s ?? '')
    .replace(/\|/g, '\\|')
    .replace(/\r?\n/g, ' ')
    .trim();
}

function main() {
  const curated = JSON.parse(fs.readFileSync(CURATED, 'utf8'));
  const missing = [];

  for (const m of curated) {
    if (FIRE_SLUGS.has(m.slug)) continue;
    if (findArticleFile(m.slug)) continue;
    missing.push({
      slug: m.slug,
      filename: `${m.slug}.md`,
      id: m.id,
      title: m.title,
      town: m.town || '',
      county: m.county || '',
    });
  }

  missing.sort((a, b) => a.slug.localeCompare(b.slug, 'en'));

  const today = new Date().toISOString().slice(0, 10);
  const md = [
    '# Marker companion gaps',
    '',
    `Generated: **${today}**. Regenerate: \`cd web && npm run markers:gaps\``,
    '',
    'Curated markers with **no** deep-read article (no matching \`articles_information/markers/<slug>.md\`, and no eligible shared \`base.md\` under the sibling rules). The three 1910 umbrella markers (\`building-from-the-ashes\`, \`pluck-and-good-fortune\`, \`sliderock-lookout-tower\`) use \`/information/1910_fire/\` and are omitted.',
    '',
    `**Total missing:** ${missing.length}`,
    '',
    'Plain-text **inscriptions** for these markers (from `historic-markers.json`): [`docs/marker-gap-source-text/`](../marker-gap-source-text/) — regenerate with `npm run markers:export-gap-sources` in `web/`.',
    '',
    '| Filename to create | Marker ID | Title | Town | County |',
    '| --- | --- | --- | --- | --- |',
    ...missing.map(
      (r) =>
        `| \`${escCell(r.filename)}\` | ${escCell(r.id)} | ${escCell(r.title)} | ${escCell(r.town)} | ${escCell(r.county)} |`,
    ),
    '',
  ].join('\n');

  fs.mkdirSync(path.dirname(OUT_MD), { recursive: true });
  fs.writeFileSync(OUT_MD, md, 'utf8');
  fs.writeFileSync(OUT_TXT, missing.map((r) => r.slug).join('\n') + '\n', 'utf8');

  console.log(`Wrote ${missing.length} rows → ${path.relative(REPO_ROOT, OUT_MD)}`);
  console.log(`Wrote slug list → ${path.relative(REPO_ROOT, OUT_TXT)}`);
}

main();
