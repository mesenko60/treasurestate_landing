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

function getLastmod(loc) {
  if (loc.includes('/lodging/') && !loc.endsWith('/lodging/')) return '2026-03-14';
  if (/\/guides\/moving-to-/.test(loc)) return '2026-03-01';
  if (loc.includes('/montana-towns/')) return '2026-03-01';
  if (loc.includes('/compare/')) return '2026-03-01';
  if (loc.includes('/best-of/')) return '2026-02-01';
  if (loc.includes('/information/')) return '2026-03-14';
  if (loc.includes('/guides/')) return '2026-03-01';
  if (loc.includes('/planners/')) return '2026-03-01';
  return '2026-01-01';
}

function getPriority(loc, baseUrl) {
  if (loc === baseUrl + '/') return 1.0;
  if (loc === baseUrl + '/montana-towns/') return 0.9;
  if (/\/montana-towns\/[^/]+\/$/.test(loc)) return 0.9;
  if (/\/guides\/moving-to-/.test(loc)) return 0.8;
  if (/\/lodging\/[^/]+\//.test(loc)) return 0.8;
  if (loc === baseUrl + '/lodging/') return 0.75;
  if (/\/montana-towns\/[^/]+\/[^/]+\//.test(loc)) return 0.7;
  if (/\/guides\//.test(loc)) return 0.7;
  if (/\/best-of\//.test(loc)) return 0.7;
  if (/\/planners\//.test(loc)) return 0.7;
  if (/\/information\//.test(loc)) return 0.6;
  if (/\/compare\//.test(loc)) return 0.5;
  return 0.6;
}

function url(loc, baseUrl, changefreq = 'monthly') {
  const lastmod = getLastmod(loc);
  const priority = getPriority(loc, baseUrl);
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

  function add(loc, changefreq = 'monthly') {
    if (seen.has(loc)) return;
    seen.add(loc);
    entries.push(url(loc, baseUrl, changefreq));
  }

  add(`${baseUrl}/`, 'weekly');
  add(`${baseUrl}/montana-towns/`, 'weekly');
  add(`${baseUrl}/compare/`);
  add(`${baseUrl}/planners/`);
  add(`${baseUrl}/guides/montana-backroads/`);
  add(`${baseUrl}/guides/fly-fishing-guide/`);
  add(`${baseUrl}/guides/fly-fishing-rivers/`);
  add(`${baseUrl}/guides/hot-springs-guide/`);
  add(`${baseUrl}/guides/campgrounds-guide/`);
  add(`${baseUrl}/guides/hiking-guide/`);
  add(`${baseUrl}/guides/hunting-guide/`);
  add(`${baseUrl}/guides/skiing-guide/`);
  add(`${baseUrl}/guides/state-parks-guide/`);
  add(`${baseUrl}/guides/wildlife-guide/`);
  add(`${baseUrl}/guides/photography-guide/`);
  add(`${baseUrl}/planners/backroads-planner/`, 'weekly');
  add(`${baseUrl}/guides/summer-road-trips/`);
  add(`${baseUrl}/guides/winter-driving-guide/`);
  add(`${baseUrl}/guides/bitterroot-valley/`);

  const corridorsPath = path.join(webDir, 'data', 'corridors.json');
  if (fs.existsSync(corridorsPath)) {
    const corridors = JSON.parse(fs.readFileSync(corridorsPath, 'utf8'));
    for (const c of corridors) {
      add(`${baseUrl}/planners/corridors/${c.id}/`);
    }
  }

  const infoDir = path.join(outDir, 'information');
  if (fs.existsSync(infoDir)) {
    for (const f of fs.readdirSync(infoDir)) {
      const full = path.join(infoDir, f);
      const isPage = f.endsWith('.html') ||
        (fs.statSync(full).isDirectory() && fs.existsSync(path.join(full, 'index.html')));
      if (isPage) {
        const slug = f.replace('.html', '');
        add(`${baseUrl}/information/${slug}/`);
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

    add(`${baseUrl}/montana-towns/${t.slug}/`, hasTopics ? 'weekly' : 'monthly');

    if (fs.existsSync(townOutDir)) {
      for (const sub of fs.readdirSync(townOutDir)) {
        const subPath = path.join(townOutDir, sub);
        if (fs.statSync(subPath).isDirectory() && fs.existsSync(path.join(subPath, 'index.html'))) {
          add(`${baseUrl}/montana-towns/${t.slug}/${sub}/`);
        }
      }
    }
  }

  add(`${baseUrl}/guides/`);
  add(`${baseUrl}/lodging/`);
  const lodgingDir = path.join(outDir, 'lodging');
  if (fs.existsSync(lodgingDir)) {
    for (const f of fs.readdirSync(lodgingDir)) {
      const full = path.join(lodgingDir, f);
      if (fs.statSync(full).isDirectory()) {
        add(`${baseUrl}/lodging/${f}/`);
      }
    }
  }

  const guidesDir = path.join(outDir, 'guides');
  if (fs.existsSync(guidesDir)) {
    for (const f of fs.readdirSync(guidesDir)) {
      if (fs.statSync(path.join(guidesDir, f)).isDirectory()) {
        add(`${baseUrl}/guides/${f}/`);
      }
    }
  }

  add(`${baseUrl}/best-of/`);
  const bestOfDir = path.join(outDir, 'best-of');
  if (fs.existsSync(bestOfDir)) {
    for (const f of fs.readdirSync(bestOfDir)) {
      if (fs.statSync(path.join(bestOfDir, f)).isDirectory()) {
        add(`${baseUrl}/best-of/${f}/`);
      }
    }
  }

  const compareDir = path.join(outDir, 'compare');
  if (fs.existsSync(compareDir)) {
    for (const f of fs.readdirSync(compareDir)) {
      if (fs.statSync(path.join(compareDir, f)).isDirectory()) {
        add(`${baseUrl}/compare/${f}/`);
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
