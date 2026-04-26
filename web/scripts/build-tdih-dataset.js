/**
 * Merge docs/TDIH/cards/MMDD.json into:
 *   - docs/TDIH/montana_tdih_dataset/montana_tdih.json (SSG, sitemap, search index)
 *   - web/public/data/tdih.json (client fetch: Today in History widget)
 */
const fs = require('fs');
const path = require('path');

const repoRoot = path.resolve(__dirname, '..', '..');
const cardsDir = path.join(repoRoot, 'docs', 'TDIH', 'cards');
const outDataset = path.join(repoRoot, 'docs', 'TDIH', 'montana_tdih_dataset', 'montana_tdih.json');
const outPublic = path.join(repoRoot, 'web', 'public', 'data', 'tdih.json');

const files = fs.readdirSync(cardsDir).filter((f) => /^\d{4}\.json$/.test(f));
if (files.length !== 365) {
  console.warn(`TDIH: expected 365 MMDD.json files, found ${files.length}`);
}

const entries = files.map((f) => {
  const p = path.join(cardsDir, f);
  const o = JSON.parse(fs.readFileSync(p, 'utf8'));
  if (!o.id || o.id !== f.replace('.json', '')) {
    console.warn(`TDIH: id mismatch in ${f} (id=${o.id})`);
  }
  return o;
});

entries.sort((a, b) => String(a.id).localeCompare(String(b.id), 'en'));

const json = `${JSON.stringify(entries, null, 2)}\n`;

fs.mkdirSync(path.dirname(outDataset), { recursive: true });
fs.mkdirSync(path.dirname(outPublic), { recursive: true });
fs.writeFileSync(outDataset, json, 'utf8');
fs.writeFileSync(outPublic, json, 'utf8');
console.log(`TDIH: wrote ${entries.length} entries to montana_tdih_dataset/montana_tdih.json and web/public/data/tdih.json`);
