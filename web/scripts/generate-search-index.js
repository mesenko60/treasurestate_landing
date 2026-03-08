/* Generate search-index.json into public/ at build time */
const fs = require('fs');
const path = require('path');

function loadJson(filePath) {
  try {
    if (fs.existsSync(filePath)) return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch { /* ignore */ }
  return {};
}

function getTownList(repoRoot) {
  const listPath = path.join(repoRoot, 'cities_towns_list', 'towns.txt');
  if (!fs.existsSync(listPath)) return [];
  const seen = new Set();
  return fs
    .readFileSync(listPath, 'utf8')
    .split(/\r?\n/)
    .map(l => l.trim())
    .filter(Boolean)
    .map(name => ({
      name,
      slug: name.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-'),
    }))
    .filter(t => { if (seen.has(t.slug)) return false; seen.add(t.slug); return true; });
}

(function main() {
  const webDir = path.resolve(__dirname, '..');
  const repoRoot = path.resolve(webDir, '..');
  const dataDir = path.join(webDir, 'data');

  const entries = [];

  // 1. Towns
  const towns = getTownList(repoRoot);
  const nicknames = loadJson(path.join(dataDir, 'town-nicknames.json'));
  const townData = loadJson(path.join(dataDir, 'town-data.json'));

  for (const t of towns) {
    const nick = nicknames[t.slug] || '';
    const data = townData[t.slug] || {};
    entries.push({
      type: 'town',
      title: `${t.name}, Montana`,
      description: nick || `Explore ${t.name}, Montana`,
      url: `/montana-towns/${t.slug}/`,
      keywords: [t.name, nick, data.county ? `${data.county} County` : '', data.region || ''].filter(Boolean).join(' '),
    });
  }

  // 2. Planners / Guides
  const planners = [
    { title: 'Montana Travel Planners', desc: 'Plan your perfect Montana adventure', url: '/planners/' },
    { title: 'Backroads Travel Planner', desc: 'Interactive map with 13 scenic corridors and 850+ points of interest', url: '/planners/backroads-planner/' },
    { title: "Montana's Backroads Guide", desc: 'Hidden gems, scenic byways, and off-the-beaten-path adventures', url: '/planners/montana-backroads/' },
    { title: 'Fly Fishing Guide', desc: "Montana's trout legacy from 1919 to today. Madison, Gallatin, Yellowstone rivers.", url: '/planners/fly-fishing-guide/' },
    { title: 'Fly Fishing Rivers Deep Dive', desc: 'Madison, Bitterroot, Big Hole, Gallatin, Yellowstone, Flathead, Missouri rivers', url: '/planners/fly-fishing-rivers/' },
    { title: 'Hot Springs Guide', desc: 'Natural and developed geothermal hot springs across Montana', url: '/planners/hot-springs-guide/' },
    { title: 'Campgrounds & RV Parks', desc: '100+ campgrounds and RV parks across Montana', url: '/planners/campgrounds-guide/' },
    { title: 'Hiking Guide', desc: "Montana's best trails, wilderness areas, and national park hikes", url: '/planners/hiking-guide/' },
    { title: 'Summer Road Trips', desc: 'Scenic drives through Montana for summer travel', url: '/planners/summer-road-trips/' },
    { title: 'Winter Driving Guide', desc: 'Safe winter travel tips and road conditions for Montana', url: '/planners/winter-driving-guide/' },
    { title: 'Bitterroot Valley Guide', desc: 'Complete guide to the Bitterroot Valley in western Montana', url: '/planners/bitterroot-valley/' },
  ];
  for (const p of planners) {
    entries.push({ type: 'guide', title: p.title, description: p.desc, url: p.url, keywords: p.title + ' ' + p.desc });
  }

  // 3. Corridors
  const corridorsPath = path.join(dataDir, 'corridors.json');
  if (fs.existsSync(corridorsPath)) {
    const corridors = JSON.parse(fs.readFileSync(corridorsPath, 'utf8'));
    for (const c of corridors) {
      entries.push({
        type: 'guide',
        title: c.name,
        description: `${c.distanceMiles} mile scenic drive: ${c.highways.join(', ')}`,
        url: `/planners/corridors/${c.id}/`,
        keywords: `${c.name} ${c.highways.join(' ')} scenic drive corridor`,
      });
    }
  }

  // 4. Best-of Rankings
  const rankings = [
    { slug: 'most-affordable-towns', title: '10 Most Affordable Towns in Montana' },
    { slug: 'best-outdoor-recreation', title: '10 Best Montana Towns for Outdoor Recreation' },
    { slug: 'best-ski-towns', title: '10 Best Montana Ski Towns' },
    { slug: 'best-fishing-towns', title: '10 Best Montana Towns for Fly Fishing' },
    { slug: 'towns-near-hot-springs', title: '10 Best Montana Towns Near Hot Springs' },
    { slug: 'best-small-towns', title: '10 Best Small Towns in Montana' },
    { slug: 'best-towns-near-glacier-yellowstone', title: '10 Best Montana Towns Near Glacier & Yellowstone' },
    { slug: 'best-towns-for-retirees', title: '10 Best Montana Towns for Retirees' },
    { slug: 'best-climate', title: '10 Montana Towns with the Best Climate' },
    { slug: 'best-towns-for-families', title: '10 Best Montana Towns for Families' },
    { slug: 'best-towns-for-young-professionals', title: '10 Best Montana Towns for Young Professionals' },
    { slug: 'best-towns-for-digital-nomads', title: '10 Best Montana Towns for Digital Nomads' },
    { slug: 'safest-towns', title: '10 Safest Towns in Montana' },
  ];
  for (const r of rankings) {
    entries.push({
      type: 'ranking',
      title: r.title,
      description: `Data-driven ranking of Montana towns`,
      url: `/best-of/${r.slug}/`,
      keywords: r.title,
    });
  }

  // 5. Information articles
  const infoPages = [
    { title: 'Montana Facts', desc: 'Key facts about the Treasure State', url: '/Information/montana-facts/' },
    { title: 'Mining History of Montana', desc: 'Gold, silver, and copper — the story of Montana mining', url: '/Information/mining-history-of-montana/' },
    { title: 'Geology of Western Montana', desc: 'Ancient seas, volcanic rock, and glacial floods', url: '/Information/geology-of-western-montana/' },
    { title: 'Story of the Montana Vigilantes', desc: 'Frontier justice in the 1860s gold camps', url: '/Information/story-of-montana-vigilantes/' },
    { title: 'Why "The Treasure State"?', desc: "The story behind Montana's nickname", url: '/Information/why-treasure-state/' },
  ];
  for (const p of infoPages) {
    entries.push({ type: 'article', title: p.title, description: p.desc, url: p.url, keywords: p.title + ' ' + p.desc });
  }

  // 6. Other pages
  entries.push({ type: 'tool', title: 'Compare Towns', description: 'Side-by-side comparison of Montana towns', url: '/compare/', keywords: 'compare towns side by side' });
  entries.push({ type: 'tool', title: 'Moving Guides', description: 'Relocation guides for every Montana town', url: '/guides/', keywords: 'moving guide relocation' });
  entries.push({ type: 'tool', title: 'Explore Montana', description: 'Discover Montana travel and information', url: '/explore-montana/', keywords: 'explore Montana travel' });

  const outPath = path.join(webDir, 'public', 'search-index.json');
  fs.writeFileSync(outPath, JSON.stringify(entries), 'utf8');
  console.log(`search-index.json generated (${entries.length} entries)`);
})();
