const fs = require('fs');
const path = require('path');

// EPA Superfund sites mapped to nearest towns, with severity
// Source: EPA NPL + Wikipedia List of Superfund sites in Montana
const SUPERFUND_SITES = [
  { name: 'Silver Bow Creek/Butte Area (Berkeley Pit)', town: 'butte', severity: 'critical', contaminants: 'arsenic, copper, zinc, cadmium, lead', listed: 1983, description: 'One of the largest Superfund complexes in the U.S. Includes the Berkeley Pit, a mile-wide former open-pit copper mine filled with toxic water.' },
  { name: 'Anaconda Co. Smelter', town: 'anaconda', severity: 'critical', contaminants: 'arsenic, copper, cadmium, lead, zinc', listed: 1983, description: 'Century of copper smelting contaminated soil, groundwater, and surface water across thousands of acres.' },
  { name: 'East Helena ASARCO Lead Smelter', town: 'east-helena', severity: 'high', contaminants: 'lead, heavy metals, arsenic', listed: 1984, description: 'Former ASARCO lead smelter contaminated soil, surface water, and groundwater with lead and arsenic.' },
  { name: 'Libby Asbestos', town: 'libby', severity: 'critical', contaminants: 'asbestos (tremolite)', listed: 2002, description: 'W.R. Grace vermiculite mine released asbestos fibers causing hundreds of deaths and widespread illness. EPA declared a public health emergency in 2009.' },
  { name: 'Libby Ground Water', town: 'libby', severity: 'high', contaminants: 'PCP, PAHs, heavy metals', listed: 1983, description: 'Groundwater contamination from wood and paper industry operations.' },
  { name: 'Montana Pole and Treating Plant', town: 'butte', severity: 'moderate', contaminants: 'PCP, PAHs, dioxins, furans', listed: 1987, description: 'Wood treatment facility contaminated groundwater and soil. Construction completed 2001.' },
  { name: 'Milltown Reservoir Sediments', town: 'missoula', severity: 'moderate', contaminants: 'arsenic, copper', listed: 1983, description: 'Mining-era sediments in reservoir contaminated groundwater. Dam removed 2008, major cleanup completed.' },
  { name: 'Burlington Northern Livingston Shop Complex', town: 'livingston', severity: 'moderate', contaminants: 'petroleum hydrocarbons, VOCs', listed: 1994, description: 'Former railroad shop contaminated soil and the Livingston Aquifer.' },
  { name: 'Idaho Pole (Bozeman)', town: 'bozeman', severity: 'low', contaminants: 'PCP, PAHs, dioxins', listed: 1986, description: 'Former wood treatment plant. Construction completed 1998. Largely remediated.' },
  { name: 'ACM Smelter and Refinery (Black Eagle)', town: 'great-falls', severity: 'moderate', contaminants: 'arsenic, lead, heavy metals', listed: 2011, description: 'Former copper smelter near Great Falls contaminated soil and groundwater.' },
  { name: 'Anaconda Aluminum Co. Reduction Plant', town: 'columbia-falls', severity: 'moderate', contaminants: 'fluoride, cyanide, PAHs', listed: 2016, description: 'Former aluminum reduction plant contaminated groundwater.' },
  { name: 'Flat Creek IMM', town: 'superior', severity: 'moderate', contaminants: 'arsenic, antimony, lead, manganese', listed: 2009, description: 'Mine tailings used as fill material in the town of Superior.' },
  { name: 'Lockwood Solvents', town: 'billings', severity: 'low', contaminants: 'VOCs', listed: 2000, description: 'Groundwater contamination near Billings from solvent use.' },
  { name: 'Mouat Industries (Columbus)', town: 'columbus', severity: 'low', contaminants: 'hexavalent chromium', listed: 1986, description: 'Chromium contamination. Construction completed 1996. Partial deletion proposed.' },
  { name: 'Colstrip Steam Electric Station', town: 'colstrip', severity: 'moderate', contaminants: 'coal ash, selenium, boron', listed: null, description: 'Coal-fired power plant with ash ponds. Not on NPL but has state-level environmental orders. Groundwater contamination documented.' },
];

// Environmental concern categories for towns
const ENVIRONMENTAL_CONCERNS = {
  'butte': { level: 'critical', notes: 'Home to two EPA Superfund sites including the Berkeley Pit, one of the largest Superfund complexes in the U.S.' },
  'anaconda': { level: 'critical', notes: 'Major Superfund site from over a century of copper smelting. Extensive soil and water contamination.' },
  'libby': { level: 'critical', notes: 'Two Superfund sites including the Libby Asbestos site. EPA declared a public health emergency in 2009 due to asbestos-related illness and death.' },
  'east-helena': { level: 'high', notes: 'EPA Superfund site from former ASARCO lead smelter. Lead contamination in soil and groundwater.' },
  'colstrip': { level: 'high', notes: 'Coal-fired power plant with documented groundwater contamination from coal ash ponds. Subject to ongoing environmental remediation orders.' },
  'livingston': { level: 'moderate', notes: 'Burlington Northern railroad shop Superfund site with petroleum and VOC contamination of the aquifer.' },
  'columbia-falls': { level: 'moderate', notes: 'Former aluminum reduction plant Superfund site with groundwater contamination.' },
  'great-falls': { level: 'moderate', notes: 'ACM Smelter Superfund site in nearby Black Eagle with arsenic and lead contamination.' },
  'superior': { level: 'moderate', notes: 'Mine tailings from Flat Creek IMM site were used as fill in town, causing arsenic and lead contamination.' },
  'missoula': { level: 'low', notes: 'Milltown Reservoir Superfund site upstream was largely remediated with dam removal in 2008.' },
  'bozeman': { level: 'low', notes: 'Idaho Pole wood treatment Superfund site was largely remediated by 1998.' },
  'columbus': { level: 'low', notes: 'Mouat Industries chromium site is partially deleted from NPL following cleanup.' },
  'billings': { level: 'low', notes: 'Lockwood Solvents site near Billings involves localized groundwater contamination.' },
};

// Compute environmental score (10 = cleanest, 0 = worst)
const LEVEL_SCORES = { 'critical': 1, 'high': 3, 'moderate': 5, 'low': 7 };

(function main() {
  const dataDir = path.resolve(__dirname, '..', 'data');
  const coords = JSON.parse(fs.readFileSync(path.join(dataDir, 'town-coordinates.json'), 'utf8'));
  const allSlugs = Object.keys(coords);

  const envData = {};

  for (const slug of allSlugs) {
    const concern = ENVIRONMENTAL_CONCERNS[slug];
    if (concern) {
      const sites = SUPERFUND_SITES.filter(s => s.town === slug);
      envData[slug] = {
        environmentalConcernLevel: concern.level,
        environmentalScore: LEVEL_SCORES[concern.level],
        superfundSites: sites.length,
        superfundSiteNames: sites.map(s => s.name),
        notes: concern.notes,
        source: 'EPA National Priorities List (NPL) / Superfund Program',
      };
    } else {
      envData[slug] = {
        environmentalConcernLevel: 'none',
        environmentalScore: 10,
        superfundSites: 0,
        superfundSiteNames: [],
        notes: 'No known EPA Superfund sites or major environmental concerns.',
        source: 'EPA National Priorities List (NPL) / Superfund Program',
      };
    }
  }

  // Summary
  const byConcern = {};
  for (const d of Object.values(envData)) {
    byConcern[d.environmentalConcernLevel] = (byConcern[d.environmentalConcernLevel] || 0) + 1;
  }
  console.log('Environmental data summary:');
  console.log(`  None (clean): ${byConcern.none}`);
  console.log(`  Low: ${byConcern.low || 0}`);
  console.log(`  Moderate: ${byConcern.moderate || 0}`);
  console.log(`  High: ${byConcern.high || 0}`);
  console.log(`  Critical: ${byConcern.critical || 0}`);

  console.log('\nTowns with concerns:');
  for (const [slug, d] of Object.entries(envData)) {
    if (d.environmentalConcernLevel !== 'none') {
      console.log(`  ${slug}: ${d.environmentalConcernLevel} (score: ${d.environmentalScore}/10, ${d.superfundSites} Superfund site(s))`);
    }
  }

  const outPath = path.join(dataDir, 'town-environmental.json');
  fs.writeFileSync(outPath, JSON.stringify(envData, null, 2));
  console.log(`\nSaved to ${outPath}`);
})();
