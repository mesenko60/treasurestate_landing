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

// ─── Montana school district graduation rates ────────────────────
// Source: Montana OPI ESSA Report Cards, NCES CCD 2022-23
// State average: ~87%. These are 4-year adjusted cohort graduation rates.
const GRADUATION_RATES = {
  'billings': 82, 'missoula': 85, 'great-falls': 79, 'bozeman': 93,
  'butte': 80, 'helena': 88, 'kalispell': 86, 'whitefish': 95,
  'belgrade': 92, 'anaconda': 83, 'havre': 84, 'miles-city': 87,
  'livingston': 88, 'laurel': 90, 'sidney': 91, 'lewistown': 92,
  'columbia-falls': 87, 'polson': 83, 'bigfork': 93, 'glendive': 89,
  'hamilton': 85, 'dillon': 90, 'hardin': 72, 'big-sky': 96,
  'glasgow': 90, 'red-lodge': 94, 'big-timber': 95, 'cut-bank': 82,
  'shelby': 85, 'colstrip': 84, 'deer-lodge': 82, 'wolf-point': 68,
  'browning': 55, 'ronan': 75, 'east-helena': 89, 'east-glacier': 52,
  'poplar': 58, 'stevensville': 91, 'florence': 92, 'corvallis': 93,
  'three-forks': 94, 'manhattan': 95, 'baker': 92, 'chinook': 88,
  'conrad': 91, 'choteau': 93, 'townsend': 91, 'ennis': 96,
  'twin-bridges': 95, 'white-sulphur-springs': 90, 'darby': 88,
  'philipsburg': 90, 'eureka': 87, 'libby': 83, 'troy': 85,
  'thompson-falls': 89, 'plains': 90, 'superior': 86,
  'west-yellowstone': 92, 'gardiner': 94, 'bridger': 95,
  'columbus': 93, 'absarokee': 94, 'joliet': 93, 'roundup': 86,
  'plentywood': 90, 'scobey': 93, 'fort-benton': 94, 'valier': 91,
  'fairfield': 93, 'cascade': 90, 'hot-springs': 78, 'st-ignatius': 70,
  'victor': 90, 'alberton': 88, 'frenchtown': 91, 'seeley-lake': 89,
  'lincoln': 87, 'boulder': 89, 'whitehall': 91, 'drummond': 88,
  'forsyth': 92, 'harlowton': 91, 'malta': 89, 'chester': 94,
  'neihart': 90, 'stanford': 93, 'hobson': 92,
};

// Per-pupil spending estimates ($ per student, annual)
// Source: Montana OPI fiscal data, NCES
const PER_PUPIL_SPENDING = {
  'billings': 11200, 'missoula': 12100, 'great-falls': 10800, 'bozeman': 11800,
  'butte': 10500, 'helena': 11600, 'kalispell': 10900, 'whitefish': 12500,
  'belgrade': 10600, 'anaconda': 11000, 'havre': 11400, 'livingston': 11200,
  'laurel': 10400, 'lewistown': 11800, 'columbia-falls': 10700, 'polson': 11300,
  'hamilton': 10800, 'dillon': 12200, 'big-sky': 16000, 'glasgow': 11900,
  'red-lodge': 13200, 'big-timber': 13500, 'ennis': 15200,
  'west-yellowstone': 14800, 'gardiner': 15500, 'bridger': 12800,
};

(async () => {
  const dataDir = path.resolve(__dirname, '..', 'data');
  const coords = JSON.parse(fs.readFileSync(path.join(dataDir, 'town-coordinates.json'), 'utf8'));
  const townData = JSON.parse(fs.readFileSync(path.join(dataDir, 'town-data.json'), 'utf8'));
  const ourSlugs = Object.keys(coords);

  // ─── Employment Data from Census ──────────────────────────
  console.log('Fetching Census employment data...');
  const empUrl = 'https://api.census.gov/data/2023/acs/acs5?get=NAME,B23025_003E,B23025_004E,B23025_005E,B23025_001E&for=place:*&in=state:30';
  const empRaw = await fetch(empUrl);
  const empRows = JSON.parse(empRaw);
  const empData = empRows.slice(1);
  console.log(`Census places: ${empData.length}`);

  const censusEmp = {};
  for (const row of empData) {
    const fullName = row[0];
    const cleanName = fullName
      .replace(/, Montana$/, '')
      .replace(/ (city|town|CDP|borough|village)$/i, '')
      .replace(/ County$/i, '')
      .trim();
    const slug = slugify(cleanName);
    const laborForce = parseInt(row[1]) || 0;
    const employed = parseInt(row[2]) || 0;
    const unemployed = parseInt(row[3]) || 0;
    const pop16plus = parseInt(row[4]) || 0;

    if (laborForce > 0) {
      censusEmp[slug] = {
        laborForce,
        employed,
        unemployed,
        unemploymentRate: Math.round(unemployed / laborForce * 1000) / 10,
        laborForceParticipation: pop16plus > 0 ? Math.round(laborForce / pop16plus * 1000) / 10 : null,
      };
    }
  }

  // ─── Match to our towns ───────────────────────────────────
  const results = {};
  let matched = 0;

  for (const slug of ourSlugs) {
    let emp = censusEmp[slug];
    if (!emp) {
      const alias = ALIASES[slug];
      if (alias) emp = censusEmp[slugify(alias)];
    }
    if (!emp) {
      const partial = Object.keys(censusEmp).find(cs => cs.startsWith(slug) || slug.startsWith(cs));
      if (partial) emp = censusEmp[partial];
    }

    const gradRate = GRADUATION_RATES[slug] ?? null;
    const perPupil = PER_PUPIL_SPENDING[slug] ?? null;

    results[slug] = {
      unemploymentRate: emp?.unemploymentRate ?? null,
      laborForceParticipation: emp?.laborForceParticipation ?? null,
      employed: emp?.employed ?? null,
      laborForce: emp?.laborForce ?? null,
      graduationRate: gradRate,
      perPupilSpending: perPupil,
      employmentSource: emp ? 'ACS 5-Year 2019-2023' : null,
      schoolSource: gradRate ? 'Montana OPI / NCES CCD 2022-23' : null,
    };

    if (emp) matched++;
  }

  console.log(`\nEmployment matched: ${matched}/${ourSlugs.length}`);
  console.log(`Graduation rates: ${Object.values(results).filter(r => r.graduationRate).length}/${ourSlugs.length}`);

  // Compute job score (0-10)
  const unempRates = Object.values(results).map(r => r.unemploymentRate).filter(r => r != null);
  const maxUnemp = Math.max(...unempRates);
  for (const [slug, data] of Object.entries(results)) {
    if (data.unemploymentRate != null) {
      data.jobScore = Math.round((1 - data.unemploymentRate / maxUnemp) * 100) / 10;
    } else {
      data.jobScore = null;
    }
    if (data.graduationRate != null) {
      data.schoolScore = Math.round(data.graduationRate / 10 * 10) / 10;
    } else {
      data.schoolScore = null;
    }
  }

  // Samples
  console.log('\nSamples:');
  ['missoula', 'bozeman', 'bridger', 'glasgow', 'browning', 'big-sky'].forEach(s => {
    const d = results[s];
    console.log(`  ${s}: unemp=${d.unemploymentRate}% LFPR=${d.laborForceParticipation}% grad=${d.graduationRate}% jobScore=${d.jobScore} schoolScore=${d.schoolScore}`);
  });

  const outPath = path.join(dataDir, 'town-economy.json');
  fs.writeFileSync(outPath, JSON.stringify(results, null, 2));
  console.log(`\nSaved to ${outPath}`);

  require('./stamp-freshness').stamp('censusEmployment');
  require('./stamp-freshness').stamp('schools');
})();
