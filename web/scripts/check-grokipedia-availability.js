#!/usr/bin/env node
/**
 * Check which unenriched towns have Grokipedia pages (200) vs 404.
 * Run: node web/scripts/check-grokipedia-availability.js
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

const townsPath = path.resolve(__dirname, '..', '..', 'cities_towns_list', 'towns.txt');
const contentDir = path.resolve(__dirname, '..', '..', 'cities_towns_content');

function toGrokipediaSlug(name) {
  return name.replace(/\s+/g, '_').replace(/\./g, '.') + ',_Montana';
}

function hasGrokipediaCitation(mdPath) {
  if (!fs.existsSync(mdPath)) return false;
  const content = fs.readFileSync(mdPath, 'utf8');
  return /Grokipedia|grokipedia\.com/i.test(content);
}

function fetchStatus(url) {
  return new Promise((resolve) => {
    const req = https.get(url, { timeout: 10000 }, (res) => {
      resolve(res.statusCode);
    });
    req.on('error', () => resolve(null));
    req.on('timeout', () => { req.destroy(); resolve(null); });
  });
}

async function main() {
  const towns = fs.readFileSync(townsPath, 'utf8')
    .split(/\r?\n/)
    .map(l => l.trim())
    .filter(Boolean);

  const unenriched = towns.filter((town) => {
    const mdPath = path.join(contentDir, `${town}, Montana.md`);
    return !hasGrokipediaCitation(mdPath);
  });

  console.log(`Checking ${unenriched.length} unenriched towns...\n`);

  const hasPage = [];
  const noPage = [];
  const errors = [];

  for (let i = 0; i < unenriched.length; i++) {
    const town = unenriched[i];
    const slug = toGrokipediaSlug(town);
    const url = `https://grokipedia.com/page/${slug}`;
    process.stderr.write(`[${i + 1}/${unenriched.length}] ${town}... `);
    const status = await fetchStatus(url);
    if (status === 200) {
      hasPage.push({ town, url });
      process.stderr.write('OK\n');
    } else if (status === 404) {
      noPage.push(town);
      process.stderr.write('404\n');
    } else {
      errors.push({ town, status: status || 'error' });
      process.stderr.write(`${status || 'error'}\n`);
    }
    await new Promise((r) => setTimeout(r, 300));
  }

  console.log('\n=== HAS GROKIPEDIA PAGE (200) ===');
  hasPage.forEach(({ town, url }) => console.log(`${town}\n  ${url}`));

  console.log('\n=== NO PAGE (404) ===');
  noPage.forEach((t) => console.log(t));

  if (errors.length) {
    console.log('\n=== ERRORS/TIMEOUTS ===');
    errors.forEach(({ town, status }) => console.log(`${town}: ${status}`));
  }

  console.log('\n--- Summary ---');
  console.log(`Has page (can enrich): ${hasPage.length}`);
  console.log(`404 (no Grokipedia): ${noPage.length}`);
  console.log(`Errors: ${errors.length}`);
}

main().catch(console.error);
