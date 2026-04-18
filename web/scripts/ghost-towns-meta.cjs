/**
 * Shared metadata for Montana ghost towns (curated 75).
 * Used by import-ghost-towns.js and build-ghost-towns.js.
 */
'use strict';

/** Montana county name (no "County" suffix) -> 3-digit county FIPS within state 30 */
const COUNTY_NAME_TO_FIPS = {
  Beaverhead: '001',
  'Big Horn': '003',
  Blaine: '005',
  Broadwater: '007',
  Carbon: '009',
  Carter: '011',
  Cascade: '013',
  Chouteau: '015',
  Custer: '017',
  Daniels: '019',
  Dawson: '021',
  'Deer Lodge': '023',
  Fallon: '025',
  Fergus: '027',
  Flathead: '029',
  Gallatin: '031',
  Garfield: '033',
  Glacier: '035',
  'Golden Valley': '037',
  Granite: '039',
  Hill: '041',
  Jefferson: '043',
  'Judith Basin': '045',
  Lake: '047',
  'Lewis and Clark': '049',
  'Lewis & Clark': '049',
  Liberty: '051',
  Lincoln: '053',
  Madison: '055',
  McCone: '057',
  Meagher: '059',
  Mineral: '061',
  Missoula: '063',
  Musselshell: '065',
  Park: '067',
  Petroleum: '069',
  Phillips: '071',
  Pondera: '073',
  'Powder River': '075',
  Powell: '077',
  Prairie: '079',
  Ravalli: '081',
  Richland: '083',
  Roosevelt: '085',
  Rosebud: '087',
  Sanders: '089',
  Sheridan: '091',
  'Silver Bow': '093',
  Stillwater: '095',
  'Sweet Grass': '097',
  Teton: '099',
  Toole: '101',
  Treasure: '103',
  Valley: '105',
  Wheatland: '107',
  Wibaux: '109',
  Yellowstone: '111',
};

const FIPS_TO_COUNTY_NAME = Object.fromEntries(
  Object.entries(COUNTY_NAME_TO_FIPS).map(([k, v]) => [v, k.replace(' & ', ' and ')]),
);

/** @type {Record<string, string>} */
const REGION_BY_SLUG = {
  bannack: 'Southwest Mining',
  coolidge: 'Southwest Mining',
  elkhorn: 'Southwest Mining',
  granite: 'Southwest Mining',
  comet: 'Southwest Mining',
  marysville: 'Southwest Mining',
  wickes: 'Southwest Mining',
  rimini: 'Southwest Mining',
  cable: 'Southwest Mining',
  glendale: 'Southwest Mining',
  hecla: 'Southwest Mining',
  'lion-city': 'Southwest Mining',
  'trapper-city': 'Southwest Mining',
  vipond: 'Southwest Mining',
  greenhorn: 'Southwest Mining',
  argenta: 'Southwest Mining',
  hassel: 'Southwest Mining',
  'diamond-city': 'Southwest Mining',
  'confederate-gulch': 'Southwest Mining',
  pioneer: 'Southwest Mining',
  pony: 'Southwest Mining',
  rochester: 'Southwest Mining',
  'french-gulch': 'Southwest Mining',
  bearmouth: 'Southwest Mining',
  'nevada-city': 'Southwest Mining',
  'highland-city': 'Southwest Mining',
  'red-mountain-city': 'Southwest Mining',
  brandon: 'Southwest Mining',
  sterling: 'Southwest Mining',
  beartown: 'Southwest Mining',
  ophir: 'Southwest Mining',
  centennial: 'Southwest Mining',
  pardee: 'Southwest Mining',
  carbonate: 'Southwest Mining',
  'reynolds-city': 'Southwest Mining',
  polaris: 'Southwest Mining',
  glen: 'Southwest Mining',
  castle: 'Central Montana',
  kendall: 'Central Montana',
  maiden: 'Central Montana',
  'gilt-edge': 'Central Montana',
  yogo: 'Central Montana',
  hughesville: 'Central Montana',
  barker: 'Central Montana',
  monarch: 'Central Montana',
  copperopolis: 'Central Montana',
  cleveland: 'Central Montana',
  ubet: 'Central Montana',
  'black-butte': 'Central Montana',
  'old-camp-cooke': 'Central Montana',
  quigley: 'Central Montana',
  bedford: 'Central Montana',
  garnet: 'Garnet Range / Missoula Area',
  coloma: 'Garnet Range / Missoula Area',
  curlew: 'Garnet Range / Missoula Area',
  mccartneyville: 'Garnet Range / Missoula Area',
  independence: 'Yellowstone / Beartooth',
  aldridge: 'Yellowstone / Beartooth',
  cinnabar: 'Yellowstone / Beartooth',
  jardine: 'Yellowstone / Beartooth',
  horr: 'Yellowstone / Beartooth',
  combination: 'Bitterroot / West',
  apex: 'Bitterroot / West',
  sylvanite: 'Northwest / Flathead',
  demersville: 'Northwest / Flathead',
  egan: 'Northwest / Flathead',
  jennings: 'Northwest / Flathead',
  'tobacco-plains': 'Northwest / Flathead',
  zortman: 'Hi-Line / Little Rockies',
  landusky: 'Hi-Line / Little Rockies',
  goldstone: 'Hi-Line / Little Rockies',
  lothair: 'Hi-Line / Little Rockies',
  galata: 'Hi-Line / Little Rockies',
  'old-fort-belknap': 'Hi-Line / Little Rockies',
  mildred: 'Hi-Line / Little Rockies',
};

/** @type {Record<string, 'preserved' | 'ruins' | 'vanished' | 'partial'>} */
const STATUS_BY_SLUG = {
  bannack: 'preserved',
  garnet: 'preserved',
  'nevada-city': 'preserved',
  coloma: 'ruins',
  marysville: 'partial',
  rimini: 'partial',
  pony: 'partial',
  polaris: 'partial',
  monarch: 'partial',
  jardine: 'partial',
  zortman: 'partial',
};

/** @type {Record<string, string | null>} town slug from cities_towns_list or null */
const NEAREST_TOWN_SLUG_BY_SLUG = {
  bannack: 'dillon',
  coolidge: 'dillon',
  elkhorn: 'boulder',
  granite: 'philipsburg',
  comet: 'helena',
  marysville: 'helena',
  wickes: 'helena',
  rimini: 'helena',
  cable: 'philipsburg',
  glendale: 'dillon',
  hecla: 'butte',
  'lion-city': 'dillon',
  'trapper-city': 'dillon',
  vipond: 'butte',
  greenhorn: 'helena',
  argenta: 'dillon',
  hassel: 'helena',
  'diamond-city': 'townsend',
  'confederate-gulch': 'townsend',
  pioneer: 'townsend',
  pony: 'ennis',
  rochester: 'helena',
  'french-gulch': 'dillon',
  bearmouth: 'drummond',
  'nevada-city': 'ennis',
  'highland-city': 'butte',
  'red-mountain-city': 'butte',
  brandon: 'whitehall',
  sterling: 'townsend',
  beartown: 'missoula',
  ophir: 'whitehall',
  centennial: 'dillon',
  pardee: 'superior',
  carbonate: 'philipsburg',
  'reynolds-city': 'philipsburg',
  polaris: 'dillon',
  glen: 'dillon',
  castle: 'great-falls',
  kendall: 'lewistown',
  maiden: 'lewistown',
  'gilt-edge': 'lewistown',
  yogo: 'lewistown',
  hughesville: 'lewistown',
  barker: 'stanford',
  monarch: 'stanford',
  copperopolis: 'white-sulphur-springs',
  cleveland: 'chinook',
  ubet: 'lewistown',
  'black-butte': 'white-sulphur-springs',
  'old-camp-cooke': 'lewistown',
  quigley: 'drummond',
  bedford: 'lewistown',
  garnet: 'missoula',
  coloma: 'missoula',
  curlew: 'hamilton',
  mccartneyville: 'missoula',
  independence: 'livingston',
  aldridge: 'gardiner',
  cinnabar: 'gardiner',
  jardine: 'gardiner',
  horr: 'livingston',
  combination: 'hamilton',
  apex: 'superior',
  sylvanite: 'libby',
  demersville: 'kalispell',
  egan: 'libby',
  jennings: 'libby',
  'tobacco-plains': 'eureka',
  zortman: 'malta',
  landusky: 'malta',
  goldstone: 'shelby',
  lothair: 'chester',
  galata: 'shelby',
  'old-fort-belknap': 'harlem',
  mildred: 'glasgow',
};

function slugifyTownName(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

/**
 * @param {string} md
 * @returns {{ countyName: string | null, countyFips: string | null }}
 */
function extractCountyFromMarkdown(md) {
  const after = md.replace(/^#\s[^\n]+\r?\n+/, '');
  /** Prefer explicit **X County** / *X County* so we never treat **By Editor** as *By Editor* (inner stars). */
  const bold = after.match(/\*\*([^*\n]+County[^*\n]*)\*\*/i);
  let raw = null;
  if (bold) raw = bold[1];
  else {
    const it = after.match(/\*([^*\n]*County[^*\n]*)\*/i);
    if (it) raw = it[1];
  }
  if (!raw) return { countyName: null, countyFips: null };
  let countyName = raw.replace(/, Montana$/i, '').replace(/\s+County$/i, '').trim();
  countyName = countyName.replace(/\s+and\s+/i, ' and ');
  const countyFips = COUNTY_NAME_TO_FIPS[countyName] || COUNTY_NAME_TO_FIPS[countyName.replace(/ and /gi, ' & ')] || null;
  return { countyName, countyFips };
}

function countyLabelFromFips(fips) {
  if (!fips) return '';
  const n = FIPS_TO_COUNTY_NAME[fips];
  return n ? `${n} County` : `County FIPS ${fips}`;
}

/**
 * GNIS PPL/PPLQ gaps — approximate coordinates for map + schema (refine later).
 * @type {Record<string, { lat: number, lng: number, gnisId?: number | null }>}
 */
const MANUAL_COORDS_BY_SLUG = {
  'black-butte': { lat: 46.42, lng: -111.15, gnisId: null },
  carbonate: { lat: 46.32, lng: -112.78, gnisId: null },
  centennial: { lat: 44.52, lng: -111.28, gnisId: null },
  combination: { lat: 46.95, lng: -114.86, gnisId: null },
  copperopolis: { lat: 46.55, lng: -111.32, gnisId: null },
  curlew: { lat: 46.18, lng: -114.32, gnisId: null },
  'gilt-edge': { lat: 47.22, lng: -111.3, gnisId: null },
  horr: { lat: 45.04, lng: -110.7, gnisId: null },
  mccartneyville: { lat: 46.92, lng: -114.21, gnisId: null },
  'old-camp-cooke': { lat: 47.67, lng: -109.64, gnisId: null },
  pardee: { lat: 47.01, lng: -115.01, gnisId: null },
  'tobacco-plains': { lat: 48.87, lng: -115.09, gnisId: null },
  ubet: { lat: 47.07, lng: -109.42, gnisId: null },
  /** Mineral County Apex — GNIS has a different "Apex" in Beaverhead; use Mineral locale */
  apex: { lat: 46.418, lng: -114.82, gnisId: null },
};

module.exports = {
  COUNTY_NAME_TO_FIPS,
  FIPS_TO_COUNTY_NAME,
  REGION_BY_SLUG,
  STATUS_BY_SLUG,
  NEAREST_TOWN_SLUG_BY_SLUG,
  slugifyTownName,
  extractCountyFromMarkdown,
  countyLabelFromFips,
  MANUAL_COORDS_BY_SLUG,
};
