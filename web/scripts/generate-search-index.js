/* Generate search-index.json into public/ at build time */
const fs = require('fs');
const path = require('path');

function loadJson(filePath) {
  try {
    if (fs.existsSync(filePath)) return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch { /* ignore */ }
  return null;
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

function fmtPop(n) {
  if (!n) return '';
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K residents`;
  return `${n} residents`;
}

/** Relative paths to each `.md` under absDir (recursive), sorted. */
function walkMarkdownFilesSorted(absDir) {
  if (!fs.existsSync(absDir)) return [];
  const results = [];
  function walk(sub) {
    const abs = sub ? path.join(absDir, sub) : absDir;
    const entries = fs.readdirSync(abs, { withFileTypes: true });
    for (const e of entries) {
      if (e.name.startsWith('.')) continue;
      const childRel = sub ? path.join(sub, e.name) : e.name;
      if (e.isDirectory()) walk(childRel);
      else if (e.isFile() && e.name.endsWith('.md')) results.push(childRel);
    }
  }
  walk('');
  results.sort((a, b) => a.localeCompare(b, 'en'));
  return results;
}

(function main() {
  const webDir = path.resolve(__dirname, '..');
  const repoRoot = path.resolve(webDir, '..');
  const dataDir = path.join(webDir, 'data');

  const entries = [];
  const towns = getTownList(repoRoot);
  const nicknames = loadJson(path.join(dataDir, 'town-nicknames.json')) || {};
  const townData = loadJson(path.join(dataDir, 'town-data.json')) || {};
  const housing = loadJson(path.join(dataDir, 'town-housing.json')) || {};
  const climate = loadJson(path.join(dataDir, 'town-climate.json')) || {};
  const coords = loadJson(path.join(dataDir, 'town-coordinates.json')) || {};
  const campgroundsList = loadJson(path.join(dataDir, 'campgrounds.json')) || [];
  const campgroundCount = Array.isArray(campgroundsList) ? campgroundsList.length : 0;

  // ═══ 1. TOWNS — enriched with county, population, region, elevation ═══
  for (const t of towns) {
    const nick = nicknames[t.slug] || '';
    const d = townData[t.slug] || {};
    const h = housing[t.slug] || {};
    const pop = d.population;
    const county = d.county ? `${d.county} County` : '';
    const region = d.region || '';
    const elev = d.elevation ? `${d.elevation} ft elevation` : '';
    const homeVal = h.zillowHomeValue || h.medianHomeValue;
    const homeStr = homeVal ? `$${Math.round(homeVal / 1000)}K homes` : '';

    entries.push({
      type: 'town',
      title: `${t.name}, Montana`,
      description: [nick, pop ? fmtPop(pop) : '', county].filter(Boolean).join(' · '),
      url: `/montana-towns/${t.slug}/`,
      keywords: [t.name, nick, county, region, elev, homeStr, d.zipCode || '', d.areaCode ? `area code ${d.areaCode}` : ''].filter(Boolean).join(' '),
    });
  }

  // ═══ 2. TOWN TOPIC PAGES — hub city deep-dive guides ═══
  const topicsDir = path.join(webDir, 'components', 'town', 'topics');
  const topicLabels = {
    'cost-of-living': 'Cost of Living',
    housing: 'Housing Market',
    jobs: 'Jobs & Economy',
    schools: 'Schools & Education',
    hiking: 'Hiking & Outdoors',
    fishing: 'Fishing',
    'weekend-itinerary': 'Weekend Itinerary',
  };
  if (fs.existsSync(topicsDir)) {
    const hubDirs = fs.readdirSync(topicsDir).filter(f => {
      const full = path.join(topicsDir, f);
      return fs.statSync(full).isDirectory();
    });
    for (const hubSlug of hubDirs) {
      const hubName = (townData[hubSlug] || {}).name || hubSlug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
      for (const [topicSlug, topicLabel] of Object.entries(topicLabels)) {
        entries.push({
          type: 'topic',
          title: `${topicLabel} in ${hubName}`,
          description: `${topicLabel} guide for ${hubName}, Montana`,
          url: `/montana-towns/${hubSlug}/${topicSlug}/`,
          keywords: `${hubName} ${topicLabel} ${topicSlug.replace(/-/g, ' ')}`,
        });
      }
    }
  }

  // ═══ 3. MOVING / RELOCATION GUIDES — one per town ═══
  for (const t of towns) {
    if (!coords[t.slug]) continue;
    const d = townData[t.slug] || {};
    entries.push({
      type: 'guide',
      title: `Moving to ${t.name}, Montana`,
      description: `Relocation guide: housing, jobs, schools, climate`,
      url: `/guides/moving-to-${t.slug}-montana/`,
      keywords: `moving relocating ${t.name} Montana relocation guide`,
    });
  }

  // ═══ 4. PLANNERS & TRAVEL GUIDES ═══
  const planners = [
    { title: 'Montana Travel Planners', desc: 'Plan your perfect Montana adventure', url: '/planners/' },
    { title: 'Backroads & Trip Planner', desc: 'Interactive map with 13 scenic corridors, 850+ points of interest, and city-to-city road trip routing with 3D terrain', url: '/planners/backroads-planner/', kw: 'trip builder planner road trip itinerary route directions driving distance activities camping hiking hot springs backroads scenic corridors' },
    { title: "Montana's Backroads Guide", desc: 'Hidden gems, scenic byways, and off-the-beaten-path adventures', url: '/guides/montana-backroads/' },
    { title: 'Fly Fishing Guide', desc: "Montana's trout legacy. Madison, Gallatin, Yellowstone, Missouri rivers.", url: '/guides/fly-fishing-guide/', kw: 'fly fishing trout rainbow brown cutthroat brook bull rivers angling' },
    { title: 'Fly Fishing Rivers Deep Dive', desc: 'Madison, Bitterroot, Big Hole, Gallatin, Yellowstone, Flathead, Missouri', url: '/guides/fly-fishing-rivers/', kw: 'rivers deep dive Madison Bitterroot Big Hole Gallatin Yellowstone Flathead Missouri alpine lakes westslope cutthroat Skwala hatch' },
    { title: 'Hot Springs Guide', desc: 'Natural and developed geothermal hot springs across Montana', url: '/guides/hot-springs-guide/', kw: 'hot springs soaking geothermal resort primitive' },
    { title: 'Campgrounds & RV Parks', desc: `${campgroundCount} campgrounds and RV parks across Montana (Supabase places)`, url: '/guides/campgrounds-guide/', kw: 'campground camping RV park tent KOA state park national forest' },
    { title: 'Hiking Guide', desc: "Montana's best trails, wilderness areas, and national park hikes", url: '/guides/hiking-guide/', kw: 'hiking trails trailhead wilderness backpacking state park national park' },
    { title: 'Montana Hunting Guide', desc: 'Seasons, licenses, WMAs, and public land access for deer, elk, antelope, bear, turkey, and more', url: '/guides/hunting-guide/', kw: 'hunting elk deer antelope bear turkey grouse waterfowl WMA FWP license season public land' },
    { title: 'Montana Skiing & Snowboarding Guide', desc: 'All 16 Montana ski areas with vertical drop, acreage, snowfall, lift ticket prices, and pass affiliations', url: '/guides/skiing-guide/', kw: 'skiing snowboarding ski area Big Sky Whitefish Bridger Bowl lift ticket Ikon Indy Pass snow winter' },
    { title: 'Montana State Parks Guide', desc: "Montana's state parks — badlands, ghost towns, cave tours, buffalo jumps, and the Smith River float", url: '/guides/state-parks-guide/', kw: 'state park Makoshika Bannack Lewis Clark Caverns Smith River camping ghost town badlands FWP' },
    { title: 'Montana Wildlife Viewing Guide', desc: 'Best places to see grizzly bears, wolves, bison, elk, bighorn sheep, and more in Montana', url: '/guides/wildlife-guide/', kw: 'wildlife viewing grizzly bear wolf bison elk bighorn sheep mountain goat eagle Lamar Valley Glacier' },
    { title: "Montana Photographer's Guide", desc: 'Best photography locations in Montana — landscape, wildlife, astrophotography, and badlands', url: '/guides/photography-guide/', kw: 'photography landscape wildlife astrophotography Glacier Yellowstone Beartooth badlands sunrise sunset camera' },
    { title: 'Summer Road Trips', desc: 'Scenic drives through Montana for summer travel', url: '/guides/summer-road-trips/', kw: 'road trip scenic drive summer vacation' },
    { title: 'Winter Driving Guide', desc: 'Safe winter travel tips and road conditions for Montana', url: '/guides/winter-driving-guide/', kw: 'winter driving snow ice road conditions chains traction' },
    { title: 'Bitterroot Valley Guide', desc: 'Complete guide to the Bitterroot Valley in western Montana', url: '/guides/bitterroot-valley/', kw: 'Bitterroot Valley Hamilton Stevensville Darby western Montana' },
  ];
  for (const p of planners) {
    entries.push({
      type: 'guide',
      title: p.title,
      description: p.desc,
      url: p.url,
      keywords: (p.kw ? p.kw + ' ' : '') + p.title + ' ' + p.desc,
    });
  }

  // ═══ 5. CORRIDORS ═══
  const corridors = loadJson(path.join(dataDir, 'corridors.json'));
  if (Array.isArray(corridors)) {
    for (const c of corridors) {
      const towns = (c.towns || []).map(t => t.name || t).join(', ');
      entries.push({
        type: 'guide',
        title: c.name,
        description: `${c.distanceMiles} mile scenic drive: ${c.highways.join(', ')}`,
        url: `/planners/corridors/${c.id}/`,
        keywords: `${c.name} ${c.highways.join(' ')} scenic drive corridor ${towns}`,
      });
    }
  }

  // ═══ 6. BEST-OF RANKINGS ═══
  const rankings = [
    { slug: 'most-affordable-towns', title: '10 Most Affordable Towns in Montana', kw: 'affordable cheap low cost housing rent' },
    { slug: 'best-outdoor-recreation', title: '10 Best Montana Towns for Outdoor Recreation', kw: 'outdoor recreation hiking trails parks wilderness' },
    { slug: 'best-ski-towns', title: '10 Best Montana Ski Towns', kw: 'skiing snowboarding ski resort mountain snow powder' },
    { slug: 'best-fishing-towns', title: '10 Best Montana Towns for Fly Fishing', kw: 'fly fishing trout rivers streams angling' },
    { slug: 'towns-near-hot-springs', title: '10 Best Montana Towns Near Hot Springs', kw: 'hot springs soaking geothermal natural pool' },
    { slug: 'best-small-towns', title: '10 Best Small Towns in Montana', kw: 'small town charming rural community' },
    { slug: 'best-towns-near-glacier-yellowstone', title: '10 Best Montana Towns Near Glacier & Yellowstone', kw: 'Glacier National Park Yellowstone gateway' },
    { slug: 'best-towns-for-retirees', title: '10 Best Montana Towns for Retirees', kw: 'retirement retiree senior healthcare hospital' },
    { slug: 'best-climate', title: '10 Montana Towns with the Best Climate', kw: 'climate weather mild winter warm temperature snow' },
    { slug: 'best-towns-for-families', title: '10 Best Montana Towns for Families', kw: 'family kids children schools safety' },
    { slug: 'best-towns-for-young-professionals', title: '10 Best Montana Towns for Young Professionals', kw: 'jobs career young professional employment workforce' },
    { slug: 'best-towns-for-digital-nomads', title: '10 Best Montana Towns for Digital Nomads', kw: 'remote work digital nomad wifi internet coworking' },
    { slug: 'safest-towns', title: '10 Safest Towns in Montana', kw: 'safe safety crime low crime rate' },
    { slug: 'best-housing-availability', title: '10 Montana Towns with Best Housing Availability', kw: 'housing availability homes for sale inventory vacancy' },
  ];
  for (const r of rankings) {
    entries.push({
      type: 'ranking',
      title: r.title,
      description: 'Data-driven ranking of Montana towns',
      url: `/best-of/${r.slug}/`,
      keywords: r.title + ' ' + r.kw,
    });
  }

  // ═══ 7. INDIVIDUAL HOT SPRINGS ═══
  const hotSprings = loadJson(path.join(dataDir, 'hot-springs.json'));
  if (Array.isArray(hotSprings)) {
    for (const hs of hotSprings) {
      entries.push({
        type: 'hotspring',
        title: hs.name,
        description: [hs.location, hs.type, hs.tempF ? `${hs.tempF}°F` : ''].filter(Boolean).join(' · '),
        url: '/guides/hot-springs-guide/',
        keywords: `${hs.name} ${hs.nearestTownName || ''} hot spring ${hs.type || ''} ${hs.location || ''} soaking geothermal`,
      });
    }
  }

  // ═══ 8. INDIVIDUAL CAMPGROUNDS ═══
  if (Array.isArray(campgroundsList)) {
    for (const cg of campgroundsList) {
      entries.push({
        type: 'campground',
        title: cg.name,
        description: [`Near ${cg.nearestTownName || ''}`, cg.category || ''].filter(Boolean).join(' · '),
        url: '/guides/campgrounds-guide/',
        keywords: `${cg.name} ${cg.nearestTownName || ''} campground camping ${cg.category || ''} RV tent`,
      });
    }
  }

  // ═══ 9. INDIVIDUAL TRAILS & PARKS ═══
  const hiking = loadJson(path.join(dataDir, 'hiking.json'));
  if (Array.isArray(hiking)) {
    for (const h of hiking) {
      entries.push({
        type: 'trail',
        title: h.name,
        description: [`Near ${h.nearestTownName || ''}`, h.category === 'state_park' ? 'State Park' : 'Trail'].filter(Boolean).join(' · '),
        url: '/guides/hiking-guide/',
        keywords: `${h.name} ${h.nearestTownName || ''} ${h.category === 'state_park' ? 'state park' : 'trail trailhead hiking'}`,
      });
    }
  }

  // ═══ 10. COMPARISON PAGES (all town pairs, canonical alphabetical URLs) ═══
  const townNameMap = {};
  for (const t of towns) { townNameMap[t.slug] = t.name; }

  const slugs = towns.map((t) => t.slug);
  for (let i = 0; i < slugs.length; i++) {
    for (let j = i + 1; j < slugs.length; j++) {
      const a = slugs[i];
      const b = slugs[j];
      const nameA = townNameMap[a] || a.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
      const nameB = townNameMap[b] || b.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
      entries.push({
        type: 'comparison',
        title: `${nameA} vs ${nameB}`,
        description: 'Side-by-side comparison of housing, climate, schools, recreation',
        url: `/compare/${a}-vs-${b}/`,
        keywords: `${nameA} ${nameB} compare comparison vs versus`,
      });
    }
  }

  // ═══ 11. INFORMATION ARTICLES ═══
  const infoPages = [
    { title: 'Montana Facts', desc: 'Key facts about the Treasure State', url: '/information/montana-facts/', kw: 'facts statistics state capital population area' },
    { title: 'Mining History of Montana', desc: 'Gold, silver, and copper — the story of Montana mining', url: '/information/mining-history-of-montana/', kw: 'mining gold silver copper Butte Anaconda smelter' },
    { title: 'Geology of Western Montana', desc: 'Ancient seas, volcanic rock, and glacial floods', url: '/information/geology-of-western-montana/', kw: 'geology rocks glacial Lake Missoula Sapphire Mountains' },
    { title: 'Story of the Montana Vigilantes', desc: 'Frontier justice in the 1860s gold camps', url: '/information/story-of-montana-vigilantes/', kw: 'vigilantes Henry Plummer Virginia City Bannack frontier justice' },
    { title: 'Why "The Treasure State"?', desc: "The story behind Montana's nickname", url: '/information/why-treasure-state/', kw: 'treasure state nickname origin history gold silver sapphire Yogo' },
  ];
  for (const p of infoPages) {
    entries.push({ type: 'article', title: p.title, description: p.desc, url: p.url, keywords: p.title + ' ' + p.desc + ' ' + p.kw });
  }

  // ═══ 12. LODGING PAGES ═══
  const lodgingDir = path.join(repoRoot, 'lodging_pages');
  if (fs.existsSync(lodgingDir)) {
    entries.push({ type: 'guide', title: 'Where to Stay in Montana', description: 'Lodging guide by town — hotels, B&Bs, cabins, vacation rentals', url: '/lodging/', keywords: 'where to stay Montana hotels cabins B&B vacation rentals lodging' });
    const lodgingFiles = fs.readdirSync(lodgingDir).filter(f => f.endsWith('.md') && f !== 'index.md' && !f.startsWith('_'));
    for (const f of lodgingFiles) {
      const slug = f.replace(/\.md$/, '');
      let townName = slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
      if (slug === 'anaconda-montana') townName = 'Anaconda';
      entries.push({
        type: 'lodging',
        title: `Where to Stay in ${townName}, Montana`,
        description: `Hotels, B&Bs, cabins, and vacation rentals in ${townName}`,
        url: `/lodging/${slug}/`,
        keywords: `where to stay ${townName} Montana hotels lodging cabins B&B vacation rentals`,
      });
    }
  }

  // ═══ 13. EVENTS PAGE ═══
  entries.push({
    type: 'guide',
    title: 'Montana Events & Festivals 2026',
    description: 'Annual calendar of Montana events — Sweet Pea Festival, Montana Folk Festival, rodeos, music festivals, and more',
    url: '/events/',
    keywords: 'Montana events festivals Sweet Pea Festival Montana Folk Festival Crow Fair rodeo Montana State Fair music festival',
  });

  // ═══ 14. HISTORY TRAILS ═══
  entries.push({
    type: 'guide',
    title: 'Montana History Trails',
    description: 'Curated driving routes connecting historic markers — Lewis & Clark, Mining Heritage, Battlefields, and more',
    url: '/guides/history-trails/',
    keywords: 'Montana history trails Lewis Clark mining heritage battlefields Little Bighorn historic markers driving routes',
  });
  const trailsPath = path.join(dataDir, 'history-trails.json');
  if (fs.existsSync(trailsPath)) {
    const trails = JSON.parse(fs.readFileSync(trailsPath, 'utf8'));
    for (const t of trails) {
      entries.push({
        type: 'guide',
        title: t.name,
        description: t.description.substring(0, 150),
        url: `/guides/history-trails/${t.id}/`,
        keywords: `${t.name} ${t.highlights.join(' ')} Montana history trail driving route`,
      });
    }
  }

  // ═══ 15. HISTORIC MARKERS ═══
  entries.push({
    type: 'guide',
    title: 'Montana Historic Markers Explorer',
    description: 'Interactive map of 2,200+ historic markers across Montana — filter by topic, county, or search',
    url: '/historic-markers/',
    keywords: 'Montana historic markers explorer map history landmarks monuments plaques roadside',
  });
  const curatedMarkersPath = path.join(dataDir, 'historic-markers-curated.json');
  if (fs.existsSync(curatedMarkersPath)) {
    const markers = JSON.parse(fs.readFileSync(curatedMarkersPath, 'utf8'));
    for (const m of markers.slice(0, 100)) { // Index top 100 for search performance
      const body = m.inscription.replace(/\s+/g, ' ').trim();
      entries.push({
        type: 'article',
        title: m.title,
        description: body,
        url: `/historic-markers/${m.slug}/`,
        keywords: `${m.title} ${m.town || ''} ${m.county || ''} Montana historic marker`,
      });
    }
  }

  // ═══ 14. CONTENT HUB ARTICLES ═══
  const articlesInfoDir = path.join(repoRoot, 'articles_information');
  const seenInformationSlugs = new Set();
  if (fs.existsSync(articlesInfoDir)) {
    for (const rel of walkMarkdownFilesSorted(articlesInfoDir)) {
      try {
        const raw = fs.readFileSync(path.join(articlesInfoDir, rel), 'utf8');
        const fmMatch = raw.match(/^---\n([\s\S]*?)\n---/);
        if (fmMatch) {
          const titleMatch = fmMatch[1].match(/^title:\s*"?(.+?)"?\s*$/m);
          const excerptMatch = fmMatch[1].match(/^excerpt:\s*"?(.+?)"?\s*$/m);
          const slugMatch = fmMatch[1].match(/^slug:\s*(.+?)\s*$/m);
          const tagsMatch = fmMatch[1].match(/^tags:\s*\[(.+?)\]/m);
          const base = path.basename(rel, '.md');
          const slug = slugMatch ? slugMatch[1].trim() : base;
          if (seenInformationSlugs.has(slug)) continue;
          seenInformationSlugs.add(slug);
          const title = titleMatch ? titleMatch[1] : slug;
          const desc = excerptMatch ? excerptMatch[1] : '';
          const tags = tagsMatch ? tagsMatch[1] : '';
          entries.push({
            type: 'article',
            title,
            description: desc,
            url: `/information/${slug}/`,
            keywords: `${title} ${desc} ${tags} Montana`,
          });
        }
      } catch { /* skip malformed files */ }
    }
  }

  const articlesGuidesDir = path.join(repoRoot, 'articles_guides');
  if (fs.existsSync(articlesGuidesDir)) {
    const mdFiles = fs.readdirSync(articlesGuidesDir).filter(f => f.endsWith('.md'));
    for (const f of mdFiles) {
      try {
        const raw = fs.readFileSync(path.join(articlesGuidesDir, f), 'utf8');
        const fmMatch = raw.match(/^---\n([\s\S]*?)\n---/);
        if (fmMatch) {
          const titleMatch = fmMatch[1].match(/^title:\s*"?(.+?)"?\s*$/m);
          const excerptMatch = fmMatch[1].match(/^excerpt:\s*"?(.+?)"?\s*$/m);
          const slugMatch = fmMatch[1].match(/^slug:\s*(.+?)\s*$/m);
          const tagsMatch = fmMatch[1].match(/^tags:\s*\[(.+?)\]/m);
          const slug = slugMatch ? slugMatch[1] : f.replace(/\.md$/, '');
          const title = titleMatch ? titleMatch[1] : slug;
          const desc = excerptMatch ? excerptMatch[1] : '';
          const tags = tagsMatch ? tagsMatch[1] : '';
          entries.push({
            type: 'article',
            title,
            description: desc,
            url: `/guides/${slug}/`,
            keywords: `${title} ${desc} ${tags} Montana guide`,
          });
        }
      } catch { /* skip malformed files */ }
    }
  }

  // ═══ 14. OTHER PAGES ═══
  entries.push({ type: 'tool', title: 'Compare Towns', description: 'Side-by-side comparison of Montana towns', url: '/compare/', keywords: 'compare towns side by side housing cost climate' });
  entries.push({ type: 'tool', title: 'Moving Guides', description: 'Relocation guides for every Montana town', url: '/guides/', keywords: 'moving guide relocation relocate' });
  entries.push({ type: 'tool', title: 'Best of Montana', description: 'Data-driven rankings of Montana towns', url: '/best-of/', keywords: 'best of rankings top 10 Montana towns' });
  entries.push({ type: 'tool', title: 'Explore Montana', description: 'Discover Montana travel and information', url: '/explore-montana/', keywords: 'explore Montana travel discover' });

  const outPath = path.join(webDir, 'public', 'search-index.json');
  fs.writeFileSync(outPath, JSON.stringify(entries), 'utf8');
  console.log(`search-index.json generated (${entries.length} entries)`);
})();
