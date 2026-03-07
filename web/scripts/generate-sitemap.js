/* Generate sitemap.xml into out/ after next export */
const fs = require('fs');
const path = require('path');

function getTownList(repoRoot) {
  const listPath = path.join(repoRoot, 'cities_towns_list', 'towns.txt');
  if (!fs.existsSync(listPath)) return [];
  const seen = new Set();
  return fs
    .readFileSync(listPath, 'utf8')
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean)
    .map((name) => ({ name, slug: name.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-') }))
    .filter((t) => { if (seen.has(t.slug)) return false; seen.add(t.slug); return true; });
}

function url(loc, priority = 0.5, changefreq = 'monthly') {
  const lastmod = new Date().toISOString();
  return `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`;
}

(function main() {
  const webDir = path.resolve(__dirname, '..');
  const outDir = path.join(webDir, 'out');
  const repoRoot = path.resolve(__dirname, '..', '..');
  const baseUrl = process.env.SITE_URL || 'https://treasurestate.com';

  const towns = getTownList(repoRoot);
  const seen = new Set();
  const entries = [];

  function add(loc, priority, changefreq) {
    if (seen.has(loc)) return;
    seen.add(loc);
    entries.push(url(loc, priority, changefreq));
  }

  add(`${baseUrl}/`, 1.0, 'weekly');
  add(`${baseUrl}/montana-towns/`, 0.9, 'weekly');
  add(`${baseUrl}/compare/`, 0.6, 'monthly');
  add(`${baseUrl}/planners/`, 0.7, 'monthly');
  add(`${baseUrl}/planners/montana-backroads/`, 0.7, 'monthly');
  add(`${baseUrl}/planners/fly-fishing-guide/`, 0.7, 'monthly');
  add(`${baseUrl}/planners/hot-springs-guide/`, 0.7, 'monthly');
  add(`${baseUrl}/planners/campgrounds-guide/`, 0.7, 'monthly');
  add(`${baseUrl}/planners/hiking-guide/`, 0.7, 'monthly');
  add(`${baseUrl}/planners/backroads-planner/`, 0.8, 'weekly');
  add(`${baseUrl}/planners/summer-road-trips/`, 0.7, 'monthly');
  add(`${baseUrl}/planners/winter-driving-guide/`, 0.7, 'monthly');

  const corridorsPath = path.join(webDir, 'data', 'corridors.json');
  if (fs.existsSync(corridorsPath)) {
    const corridors = JSON.parse(fs.readFileSync(corridorsPath, 'utf8'));
    for (const c of corridors) {
      add(`${baseUrl}/planners/corridors/${c.id}/`, 0.7, 'monthly');
    }
  }

  const infoDir = path.join(outDir, 'Information');
  if (fs.existsSync(infoDir)) {
    for (const f of fs.readdirSync(infoDir)) {
      const full = path.join(infoDir, f);
      const isPage = f.endsWith('.html') ||
        (fs.statSync(full).isDirectory() && fs.existsSync(path.join(full, 'index.html')));
      if (isPage) {
        const slug = f.replace('.html', '');
        add(`${baseUrl}/Information/${slug}/`, 0.7, 'monthly');
      }
    }
  }

  for (const t of towns) {
    const townOutDir = path.join(outDir, 'montana-towns', t.slug);
    const hasTopics = fs.existsSync(townOutDir) &&
      fs.readdirSync(townOutDir).some((sub) => {
        const subPath = path.join(townOutDir, sub);
        return fs.statSync(subPath).isDirectory() && fs.existsSync(path.join(subPath, 'index.html'));
      });

    add(`${baseUrl}/montana-towns/${t.slug}/`, hasTopics ? 0.9 : 0.7, hasTopics ? 'weekly' : 'monthly');

    if (fs.existsSync(townOutDir)) {
      for (const sub of fs.readdirSync(townOutDir)) {
        const subPath = path.join(townOutDir, sub);
        if (fs.statSync(subPath).isDirectory() && fs.existsSync(path.join(subPath, 'index.html'))) {
          add(`${baseUrl}/montana-towns/${t.slug}/${sub}/`, 0.8, 'monthly');
        }
      }
    }
  }

  add(`${baseUrl}/guides/`, 0.7, 'monthly');
  const guidesDir = path.join(outDir, 'guides');
  if (fs.existsSync(guidesDir)) {
    for (const f of fs.readdirSync(guidesDir)) {
      if (fs.statSync(path.join(guidesDir, f)).isDirectory()) {
        add(`${baseUrl}/guides/${f}/`, 0.6, 'monthly');
      }
    }
  }

  add(`${baseUrl}/best-of/`, 0.6, 'monthly');
  const bestOfDir = path.join(outDir, 'best-of');
  if (fs.existsSync(bestOfDir)) {
    for (const f of fs.readdirSync(bestOfDir)) {
      if (fs.statSync(path.join(bestOfDir, f)).isDirectory()) {
        add(`${baseUrl}/best-of/${f}/`, 0.6, 'monthly');
      }
    }
  }

  const compareDir = path.join(outDir, 'compare');
  if (fs.existsSync(compareDir)) {
    for (const f of fs.readdirSync(compareDir)) {
      if (fs.statSync(path.join(compareDir, f)).isDirectory()) {
        add(`${baseUrl}/compare/${f}/`, 0.5, 'monthly');
      }
    }
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries.join('\n')}\n</urlset>\n`;
  if (fs.existsSync(outDir)) {
    fs.writeFileSync(path.join(outDir, 'sitemap.xml'), xml, 'utf8');
    console.log(`sitemap.xml generated in out/ (${entries.length} URLs)`);
  } else {
    console.log('out/ directory does not exist, sitemap.xml skipped.');
  }
})();
