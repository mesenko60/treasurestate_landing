const fs = require('fs');
const path = require('path');
const https = require('https');

function fetch(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => resolve(data));
      res.on('error', reject);
    }).on('error', reject);
  });
}

function slugify(name) {
  return name.toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

const ALIASES = {
  'anaconda': 'anaconda-deer lodge',
  'miles-city': 'miles',
  'virginia-city': 'virginia',
  'st-ignatius': 'st ignatius',
  'st-regis': 'st regis',
};

const INDUSTRY_LABELS = [
  { key: 'agriculture', label: 'Agriculture, Forestry & Mining', short: 'Agriculture & Mining' },
  { key: 'construction', label: 'Construction', short: 'Construction' },
  { key: 'manufacturing', label: 'Manufacturing', short: 'Manufacturing' },
  { key: 'wholesale', label: 'Wholesale Trade', short: 'Wholesale' },
  { key: 'retail', label: 'Retail Trade', short: 'Retail' },
  { key: 'transportation', label: 'Transportation, Warehousing & Utilities', short: 'Transportation' },
  { key: 'information', label: 'Information', short: 'Information' },
  { key: 'finance', label: 'Finance, Insurance & Real Estate', short: 'Finance & Real Estate' },
  { key: 'professional', label: 'Professional, Scientific & Management', short: 'Professional Services' },
  { key: 'education_health', label: 'Educational Services, Healthcare & Social Assistance', short: 'Education & Healthcare' },
  { key: 'arts_food', label: 'Arts, Entertainment, Recreation, Accommodation & Food', short: 'Tourism & Hospitality' },
  { key: 'other', label: 'Other Services', short: 'Other Services' },
  { key: 'public_admin', label: 'Public Administration', short: 'Government' },
];

(async () => {
  const dataDir = path.resolve(__dirname, '..', 'data');
  const coords = JSON.parse(fs.readFileSync(path.join(dataDir, 'town-coordinates.json'), 'utf8'));
  const ourSlugs = Object.keys(coords);

  const vars = [
    'DP03_0033PE', 'DP03_0034PE', 'DP03_0035PE', 'DP03_0036PE',
    'DP03_0037PE', 'DP03_0038PE', 'DP03_0039PE', 'DP03_0040PE',
    'DP03_0041PE', 'DP03_0042PE', 'DP03_0043PE', 'DP03_0044PE', 'DP03_0045PE',
  ];

  console.log('Fetching Census industry data...');
  const url = `https://api.census.gov/data/2023/acs/acs5/profile?get=NAME,${vars.join(',')}&for=place:*&in=state:30`;
  const raw = await fetch(url);
  const rows = JSON.parse(raw);
  const data = rows.slice(1);
  console.log(`Census places: ${data.length}`);

  const censusIndustry = {};
  for (const row of data) {
    const fullName = row[0];
    const cleanName = fullName
      .replace(/, Montana$/, '')
      .replace(/ (city|town|CDP|borough|village)$/i, '')
      .trim();
    const slug = slugify(cleanName);

    const sectors = INDUSTRY_LABELS.map((ind, i) => ({
      ...ind,
      pct: parseFloat(row[i + 1]) || 0,
    })).filter(s => s.pct > 0).sort((a, b) => b.pct - a.pct);

    if (sectors.length > 0) {
      censusIndustry[slug] = sectors;
    }
  }

  // Load existing economy data to merge into
  const econPath = path.join(dataDir, 'town-economy.json');
  const economy = JSON.parse(fs.readFileSync(econPath, 'utf8'));

  let matched = 0;
  for (const slug of ourSlugs) {
    let sectors = censusIndustry[slug];
    if (!sectors) {
      const alias = ALIASES[slug];
      if (alias) sectors = censusIndustry[slugify(alias)];
    }
    if (!sectors) {
      const partial = Object.keys(censusIndustry).find(cs => cs.startsWith(slug) || slug.startsWith(cs));
      if (partial) sectors = censusIndustry[partial];
    }

    if (sectors && economy[slug]) {
      const top3 = sectors.slice(0, 3);
      economy[slug].topIndustries = top3.map(s => ({
        name: s.short,
        fullName: s.label,
        pct: s.pct,
      }));
      economy[slug].mainIndustry = top3[0].short;
      economy[slug].industryBreakdown = sectors.map(s => ({ name: s.short, pct: s.pct }));
      economy[slug].industrySource = 'ACS 5-Year 2019-2023 (DP03)';
      matched++;
    } else if (economy[slug]) {
      economy[slug].topIndustries = null;
      economy[slug].mainIndustry = null;
      economy[slug].industryBreakdown = null;
    }
  }

  console.log(`Industry data matched: ${matched}/${ourSlugs.length}`);

  // Samples
  ['missoula', 'bozeman', 'colstrip', 'west-yellowstone', 'browning', 'big-timber', 'glasgow', 'billings'].forEach(s => {
    const d = economy[s];
    if (d?.topIndustries) {
      console.log(`  ${s}: ${d.topIndustries.map(t => `${t.name} (${t.pct}%)`).join(', ')}`);
    }
  });

  fs.writeFileSync(econPath, JSON.stringify(economy, null, 2));
  console.log(`\nSaved to ${econPath}`);

  require('./stamp-freshness').stamp('censusIndustry');
})();
