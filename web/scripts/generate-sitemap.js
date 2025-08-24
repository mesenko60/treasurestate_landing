/* Generate sitemap.xml into out/ after next export */
const fs = require('fs');
const path = require('path');

function getTownList(repoRoot) {
  const listPath = path.join(repoRoot, 'cities_towns_list', 'towns.txt');
  if (!fs.existsSync(listPath)) return [];
  return fs
    .readFileSync(listPath, 'utf8')
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean)
    .map((name) => ({ name, slug: name.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-') }));
}

function url(loc, lastmod = new Date()) {
  return `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${lastmod.toISOString()}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.7</priority>\n  </url>`;
}

(function main() {
  const webDir = path.resolve(__dirname, '..');
  const outDir = path.join(webDir, 'out');
  const repoRoot = path.resolve(__dirname, '..', '..');
  const baseUrl = process.env.SITE_URL || 'https://treasurestate.com';

  const towns = getTownList(repoRoot);

  const entries = [];
  // Core pages
  entries.push(url(`${baseUrl}/`));
  entries.push(url(`${baseUrl}/Montana-towns/`));
  entries.push(url(`${baseUrl}/explore-montana.html`));

  // Information pages discovered in out/Information
  const infoDir = path.join(outDir, 'Information');
  if (fs.existsSync(infoDir)) {
    for (const f of fs.readdirSync(infoDir)) {
      if (f.endsWith('.html')) entries.push(url(`${baseUrl}/Information/${f}`));
    }
  }

  // Town pages
  for (const t of towns) {
    entries.push(url(`${baseUrl}/montana-towns/${t.slug}/`));
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries.join('\n')}\n</urlset>\n`;
  fs.writeFileSync(path.join(outDir, 'sitemap.xml'), xml, 'utf8');
  console.log('sitemap.xml generated');
})();
