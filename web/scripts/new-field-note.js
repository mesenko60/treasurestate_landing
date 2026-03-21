#!/usr/bin/env node

const readline = require('readline');
const fs = require('fs');
const path = require('path');

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const ask = (q) => new Promise((resolve) => rl.question(q, resolve));

function today() {
  return new Date().toISOString().slice(0, 10);
}

function generateId(existing) {
  const nums = existing
    .map(n => {
      const m = n.id.match(/^fn-(\d+)$/);
      return m ? parseInt(m[1], 10) : 0;
    })
    .filter(Boolean);
  const next = nums.length > 0 ? Math.max(...nums) + 1 : 1;
  return `fn-${String(next).padStart(3, '0')}`;
}

async function main() {
  console.log('\n📌 Add a new field note\n');

  const dataPath = path.resolve(__dirname, '..', 'data', 'field-notes.json');
  let notes = [];
  if (fs.existsSync(dataPath)) {
    try { notes = JSON.parse(fs.readFileSync(dataPath, 'utf8')); } catch { notes = []; }
  }

  const content = await ask('Content: ');
  if (!content.trim()) { console.log('Aborted: content required.'); process.exit(1); }

  const tags = await ask('Tags (comma-separated): ');
  const featured = (await ask('Featured? (y/n): ')).toLowerCase().startsWith('y');
  const socialCaption = await ask('Social caption (or skip): ');

  const id = generateId(notes);
  const note = {
    id,
    content: content.trim(),
    status: 'stored',
    publish_as_article: false,
    tags: tags.split(',').map(t => t.trim()).filter(Boolean),
    related_topics: [],
    featured,
    social_ready: Boolean(socialCaption.trim()),
    social_caption: socialCaption.trim() || '',
    image: null,
    date_created: today(),
  };

  notes.push(note);
  fs.writeFileSync(dataPath, JSON.stringify(notes, null, 2) + '\n');

  console.log(`\n✅ Added ${id} to field-notes.json (status: stored)`);
  console.log(`   To publish: change status to "published" in the JSON file.\n`);

  rl.close();
}

main().catch(err => { console.error(err); process.exit(1); });
