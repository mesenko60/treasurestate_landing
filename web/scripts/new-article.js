#!/usr/bin/env node

const readline = require('readline');
const fs = require('fs');
const path = require('path');

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const ask = (q) => new Promise((resolve) => rl.question(q, resolve));

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 60)
    .replace(/-$/, '');
}

function today() {
  return new Date().toISOString().slice(0, 10);
}

async function main() {
  console.log('\n📝 Create a new article\n');

  const title = await ask('Title: ');
  if (!title.trim()) { console.log('Aborted: title required.'); process.exit(1); }

  const typeChoice = await ask('Type: (1) montana-facts  (2) guides  → ');
  const type = typeChoice.trim() === '2' ? 'guides' : 'montana-facts';

  const slug = slugify(title);
  const dir = type === 'montana-facts'
    ? path.resolve(__dirname, '..', '..', 'articles_information')
    : path.resolve(__dirname, '..', '..', 'articles_guides');

  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  const filePath = path.join(dir, `${slug}.md`);
  if (fs.existsSync(filePath)) {
    console.log(`\n❌ File already exists: ${filePath}`);
    process.exit(1);
  }

  const tags = await ask('Tags (comma-separated): ');
  const featured = (await ask('Featured? (y/n): ')).toLowerCase().startsWith('y');
  const excerpt = await ask('Excerpt (1-2 sentences): ');
  const shopLabel = await ask('Shop CTA label (or skip): ');
  const shopUrl = shopLabel.trim() ? await ask('Shop CTA URL: ') : '';

  const frontmatter = [
    '---',
    `title: "${title.trim()}"`,
    `slug: ${slug}`,
    `type: ${type}`,
    `tags: [${tags.split(',').map(t => t.trim()).filter(Boolean).join(', ')}]`,
    `featured: ${featured}`,
    `excerpt: "${excerpt.trim()}"`,
    `hero_image: /images/hero-image.jpg`,
    `hero_alt: "Montana landscape"`,
    `meta_description: "${excerpt.trim()}"`,
    `related_towns: []`,
    `related_topics: []`,
    shopLabel.trim() ? `shop_cta_label: "${shopLabel.trim()}"` : `shop_cta_label: ""`,
    shopUrl.trim() ? `shop_cta_url: "${shopUrl.trim()}"` : `shop_cta_url: ""`,
    `date_published: ${today()}`,
    `date_modified: ${today()}`,
    '---',
    '',
    `## ${title.trim()}`,
    '',
    'Write your content here. Remember:',
    '- Minimum 300 words (600 recommended)',
    '- At least 1 H2 heading',
    '- At least 2 internal links (e.g., [Bozeman](/montana-towns/bozeman/))',
    '- You can embed field notes with {{field_note:fn-001}}',
    '',
  ].join('\n');

  fs.writeFileSync(filePath, frontmatter);
  console.log(`\n✅ Created ${filePath}`);
  console.log('   Open and write your content below the frontmatter.\n');

  rl.close();
}

main().catch(err => { console.error(err); process.exit(1); });
