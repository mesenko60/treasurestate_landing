const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

function post(url, body) {
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    const mod = u.protocol === 'https:' ? https : http;
    const req = mod.request(u, { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => resolve(data));
      res.on('error', reject);
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

const QUERIES = [
  {
    label: 'Campgrounds',
    type: 'Campground',
    query: `node["tourism"="camp_site"](area.mt);way["tourism"="camp_site"](area.mt);`,
  },
  {
    label: 'Trailheads',
    type: 'Trailhead',
    query: `node["highway"="trailhead"](area.mt);node["information"="trailhead"](area.mt);`,
  },
  {
    label: 'Viewpoints',
    type: 'Viewpoint',
    query: `node["tourism"="viewpoint"](area.mt);`,
  },
  {
    label: 'Picnic Areas',
    type: 'Picnic Area',
    query: `node["tourism"="picnic_site"](area.mt);node["leisure"="picnic_table"](area.mt);`,
  },
  {
    label: 'Waterfalls',
    type: 'Waterfall',
    query: `node["natural"="waterfall"](area.mt);way["natural"="waterfall"](area.mt);`,
  },
  {
    label: 'Springs (hot)',
    type: 'Hot Spring',
    query: `node["natural"="hot_spring"](area.mt);`,
  },
  {
    label: 'Boat Launches',
    type: 'Boat Launch',
    query: `node["leisure"="slipway"](area.mt);way["leisure"="slipway"](area.mt);`,
  },
  {
    label: 'Fishing Sites',
    type: 'Fishing Access',
    query: `node["leisure"="fishing"](area.mt);node["sport"="fishing"](area.mt);`,
  },
  {
    label: 'Swimming',
    type: 'Swimming Area',
    query: `node["sport"="swimming"](area.mt);node["leisure"="swimming_area"](area.mt);`,
  },
  {
    label: 'Visitor Centers',
    type: 'Visitor Center',
    query: `node["information"="visitor_centre"](area.mt);node["tourism"="information"]["information"="office"](area.mt);`,
  },
];

(async () => {
  const allSites = [];
  const OVERPASS_URL = 'https://overpass-api.de/api/interpreter';

  for (const q of QUERIES) {
    console.log(`Fetching ${q.label}...`);
    const overpassQuery = `[out:json][timeout:60];area["name"="Montana"]["admin_level"="4"]->.mt;(${q.query});out center;`;

    try {
      const raw = await post(OVERPASS_URL, `data=${encodeURIComponent(overpassQuery)}`);
      const data = JSON.parse(raw);
      const elements = data.elements || [];

      let named = 0;
      for (const el of elements) {
        const name = el.tags?.name;
        if (!name) continue;
        const lat = el.lat || el.center?.lat;
        const lng = el.lon || el.center?.lon;
        if (!lat || !lng) continue;
        allSites.push({ name, type: q.type, lat, lng });
        named++;
      }
      console.log(`  Found ${elements.length} total, ${named} with names`);
    } catch (e) {
      console.error(`  Error: ${e.message}`);
    }

    // Rate limit courtesy
    await new Promise(r => setTimeout(r, 2000));
  }

  console.log(`\nTotal named OSM sites: ${allSites.length}`);

  // Deduplicate by name (keep first occurrence)
  const seen = new Set();
  const unique = [];
  for (const s of allSites) {
    const key = s.name.toLowerCase().trim();
    if (!seen.has(key)) {
      seen.add(key);
      unique.push(s);
    }
  }
  console.log(`After dedup: ${unique.length}`);

  // Save
  const outPath = path.resolve(__dirname, '..', 'data', 'osm-recreation-sites.json');
  fs.writeFileSync(outPath, JSON.stringify(unique, null, 2));
  console.log(`Saved to ${outPath}`);

  // Stats
  const byType = {};
  for (const s of unique) {
    byType[s.type] = (byType[s.type] || 0) + 1;
  }
  console.log('\nBy type:');
  for (const [t, c] of Object.entries(byType).sort((a, b) => b[1] - a[1])) {
    console.log(`  ${t}: ${c}`);
  }
})();
