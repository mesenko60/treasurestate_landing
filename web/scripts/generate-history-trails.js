#!/usr/bin/env node
/**
 * Generate curated history trails from historic markers
 * 
 * Each trail is a themed collection of markers that can be visited
 * as a road trip, organized geographically for logical driving order.
 */

const fs = require('fs');
const path = require('path');

const MARKERS_PATH = path.join(__dirname, '../data/historic-markers.json');
const OUTPUT_PATH = path.join(__dirname, '../data/history-trails.json');

// Haversine distance in miles
function distance(lat1, lng1, lat2, lng2) {
  const R = 3959; // Earth radius in miles
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

// Sort markers by longitude (west to east) for driving order
function sortWestToEast(markers) {
  return [...markers].sort((a, b) => a.lng - b.lng);
}

// Sort markers by latitude (south to north)
function sortSouthToNorth(markers) {
  return [...markers].sort((a, b) => a.lat - b.lat);
}

// Calculate total trail distance (point to point)
function calculateTrailDistance(markers) {
  let total = 0;
  for (let i = 1; i < markers.length; i++) {
    total += distance(markers[i-1].lat, markers[i-1].lng, markers[i].lat, markers[i].lng);
  }
  return Math.round(total);
}

// Main
function main() {
  const allMarkers = JSON.parse(fs.readFileSync(MARKERS_PATH, 'utf8'));
  
  const trails = [];
  
  // ═══════════════════════════════════════════════════════════════════
  // TRAIL 1: Lewis & Clark Expedition
  // ═══════════════════════════════════════════════════════════════════
  const lewisClarkMarkers = allMarkers.filter(m => {
    const text = (m.title + ' ' + m.inscription).toLowerCase();
    return (text.includes('lewis') && text.includes('clark')) || 
           text.includes('corps of discovery') ||
           text.includes('sacagawea') ||
           text.includes('meriwether lewis') ||
           text.includes('william clark expedition');
  });
  
  // Select best markers, limit to ~30 for a manageable trail
  const lewisClarkSorted = sortWestToEast(lewisClarkMarkers)
    .filter(m => m.inscription.length > 200)
    .slice(0, 35);
  
  trails.push({
    id: 'lewis-and-clark',
    name: 'Lewis & Clark Expedition Trail',
    description: 'Follow the path of the Corps of Discovery across Montana. From the Missouri River headwaters to the Bitterroot Mountains, experience the landmarks where Lewis and Clark made history in 1805-1806.',
    difficulty: 'multi-day',
    estimatedDays: '3-5',
    totalMiles: calculateTrailDistance(lewisClarkSorted),
    markerCount: lewisClarkSorted.length,
    regions: ['Southwest Montana', 'Central Montana', 'Western Montana'],
    highlights: [
      'Three Forks - Headwaters of the Missouri',
      'Gates of the Mountains',
      'Lemhi Pass - Continental Divide crossing',
      'Traveler\'s Rest - Lolo'
    ],
    markerIds: lewisClarkSorted.map(m => m.id),
  });
  
  // ═══════════════════════════════════════════════════════════════════
  // TRAIL 2: Mining Heritage Trail
  // ═══════════════════════════════════════════════════════════════════
  const miningMarkers = allMarkers.filter(m => {
    const text = (m.title + ' ' + m.inscription).toLowerCase();
    const isMiningTown = ['butte', 'anaconda', 'virginia-city', 'philipsburg', 
                          'granite', 'deer-lodge', 'helena'].includes(m.townSlug);
    return (text.includes('mining') || text.includes('copper') || 
            text.includes('gold') || text.includes('smelter') ||
            text.includes('ore') || text.includes('miner')) &&
           (isMiningTown || text.includes('copper king') || text.includes('gold rush'));
  });
  
  const miningSorted = sortWestToEast(miningMarkers)
    .filter(m => m.inscription.length > 150)
    .slice(0, 40);
  
  trails.push({
    id: 'mining-heritage',
    name: 'Montana Mining Heritage Trail',
    description: 'Discover Montana\'s rich mining history from the gold rush days of Virginia City to the copper empire of Butte. See where fortunes were made and lost, and where the Copper Kings built their empires.',
    difficulty: 'moderate',
    estimatedDays: '2-3',
    totalMiles: calculateTrailDistance(miningSorted),
    markerCount: miningSorted.length,
    regions: ['Southwest Montana'],
    highlights: [
      'Butte - The Richest Hill on Earth',
      'Anaconda Smelter Stack',
      'Virginia City Ghost Town',
      'Granite Ghost Town'
    ],
    markerIds: miningSorted.map(m => m.id),
  });
  
  // ═══════════════════════════════════════════════════════════════════
  // TRAIL 3: Indian Wars & Battlefields
  // ═══════════════════════════════════════════════════════════════════
  const battleMarkers = allMarkers.filter(m => {
    const text = (m.title + ' ' + m.inscription).toLowerCase();
    return text.includes('little bighorn') || text.includes('custer') ||
           text.includes('bear paw') || text.includes('big hole') ||
           text.includes('nez perce') || text.includes('chief joseph') ||
           text.includes('sitting bull') || text.includes('crazy horse') ||
           (text.includes('battle') && text.includes('indian')) ||
           text.includes('battlefield') ||
           m.topics.includes('military') && text.includes('1876') ||
           m.topics.includes('military') && text.includes('1877');
  });
  
  const battleSorted = sortSouthToNorth(battleMarkers)
    .filter(m => m.inscription.length > 200)
    .slice(0, 35);
  
  trails.push({
    id: 'indian-wars-battlefields',
    name: 'Indian Wars & Battlefields Circuit',
    description: 'Visit the sites of Montana\'s most significant military conflicts between the U.S. Army and Native American nations. From Little Bighorn to Bear Paw, understand the tragic history of the Indian Wars.',
    difficulty: 'multi-day',
    estimatedDays: '3-4',
    totalMiles: calculateTrailDistance(battleSorted),
    markerCount: battleSorted.length,
    regions: ['Southeast Montana', 'Central Montana', 'North-Central Montana'],
    highlights: [
      'Little Bighorn Battlefield National Monument',
      'Big Hole National Battlefield',
      'Bear Paw Battlefield - Nez Perce surrender',
      'Chief Joseph\'s route'
    ],
    markerIds: battleSorted.map(m => m.id),
  });
  
  // ═══════════════════════════════════════════════════════════════════
  // TRAIL 4: Fur Trade & Fort Trail
  // ═══════════════════════════════════════════════════════════════════
  const fortMarkers = allMarkers.filter(m => {
    const text = (m.title + ' ' + m.inscription).toLowerCase();
    return text.includes('fort ') || text.includes('trading post') ||
           text.includes('fur trade') || text.includes('american fur') ||
           text.includes('hudson\'s bay') || text.includes('trapper');
  });
  
  const fortSorted = sortWestToEast(fortMarkers)
    .filter(m => m.inscription.length > 150)
    .slice(0, 30);
  
  trails.push({
    id: 'fur-trade-forts',
    name: 'Fur Trade & Fort Trail',
    description: 'Explore the frontier era when fur traders, mountain men, and military forts shaped Montana\'s early history. Visit the sites where beaver pelts were traded and where soldiers protected settlers.',
    difficulty: 'multi-day',
    estimatedDays: '2-4',
    totalMiles: calculateTrailDistance(fortSorted),
    markerCount: fortSorted.length,
    regions: ['North-Central Montana', 'Western Montana'],
    highlights: [
      'Fort Benton - Birthplace of Montana',
      'Fort Owen - First permanent settlement',
      'Fort Missoula',
      'Fort Assinniboine'
    ],
    markerIds: fortSorted.map(m => m.id),
  });
  
  // ═══════════════════════════════════════════════════════════════════
  // TRAIL 5: Railroad Heritage
  // ═══════════════════════════════════════════════════════════════════
  const railroadMarkers = allMarkers.filter(m => {
    const text = (m.title + ' ' + m.inscription).toLowerCase();
    return text.includes('railroad') || text.includes('railway') ||
           text.includes('depot') || text.includes('great northern') ||
           text.includes('northern pacific') || text.includes('locomotive') ||
           text.includes('milwaukee road');
  });
  
  const railroadSorted = sortWestToEast(railroadMarkers)
    .filter(m => m.inscription.length > 150)
    .slice(0, 25);
  
  trails.push({
    id: 'railroad-heritage',
    name: 'Montana Railroad Heritage Trail',
    description: 'Ride the rails of history through Montana\'s railroad towns. From grand depots to mountain passes, discover how the iron horse transformed the West and built the communities we know today.',
    difficulty: 'moderate',
    estimatedDays: '2-3',
    totalMiles: calculateTrailDistance(railroadSorted),
    markerCount: railroadSorted.length,
    regions: ['Statewide'],
    highlights: [
      'Great Northern Railway depots',
      'Northern Pacific route',
      'Mullan Pass crossing',
      'Historic railroad towns'
    ],
    markerIds: railroadSorted.map(m => m.id),
  });
  
  // ═══════════════════════════════════════════════════════════════════
  // TRAIL 6: Ghost Towns Loop
  // ═══════════════════════════════════════════════════════════════════
  const ghostTownMarkers = allMarkers.filter(m => {
    const text = (m.title + ' ' + m.inscription).toLowerCase();
    const ghostTowns = ['virginia city', 'nevada city', 'bannack', 'granite', 
                        'garnet', 'elkhorn', 'marysville', 'castle'];
    return text.includes('ghost town') || text.includes('abandoned') ||
           text.includes('boom town') || 
           ghostTowns.some(gt => text.includes(gt) && text.includes('gold'));
  });
  
  const ghostTownSorted = sortWestToEast(ghostTownMarkers)
    .filter(m => m.inscription.length > 100)
    .slice(0, 20);
  
  trails.push({
    id: 'ghost-towns',
    name: 'Montana Ghost Towns Loop',
    description: 'Step back in time to Montana\'s abandoned mining camps and ghost towns. From Bannack to Virginia City, explore the remnants of the gold rush era when fortunes rose and fell overnight.',
    difficulty: 'easy',
    estimatedDays: '1-2',
    totalMiles: calculateTrailDistance(ghostTownSorted),
    markerCount: ghostTownSorted.length,
    regions: ['Southwest Montana'],
    highlights: [
      'Bannack State Park - First territorial capital',
      'Virginia City - Living ghost town',
      'Nevada City - Open-air museum',
      'Garnet Ghost Town'
    ],
    markerIds: ghostTownSorted.map(m => m.id),
  });
  
  // ═══════════════════════════════════════════════════════════════════
  // TRAIL 7: Native American Heritage
  // ═══════════════════════════════════════════════════════════════════
  const nativeMarkers = allMarkers.filter(m => {
    const text = (m.title + ' ' + m.inscription).toLowerCase();
    return m.topics.includes('native-american') ||
           text.includes('blackfeet') || text.includes('crow') ||
           text.includes('salish') || text.includes('kootenai') ||
           text.includes('sioux') || text.includes('cheyenne') ||
           text.includes('flathead') || text.includes('reservation') ||
           text.includes('indigenous') || text.includes('tribe');
  });
  
  const nativeSorted = sortWestToEast(nativeMarkers)
    .filter(m => m.inscription.length > 200)
    .slice(0, 30);
  
  trails.push({
    id: 'native-american-heritage',
    name: 'Native American Heritage Trail',
    description: 'Honor the original inhabitants of Montana through markers that tell the stories of the Blackfeet, Crow, Salish, Kootenai, and other nations. Learn about their history, culture, and ongoing presence.',
    difficulty: 'multi-day',
    estimatedDays: '3-5',
    totalMiles: calculateTrailDistance(nativeSorted),
    markerCount: nativeSorted.length,
    regions: ['Statewide'],
    highlights: [
      'Flathead Reservation history',
      'Blackfeet Nation landmarks',
      'Crow Agency and Little Bighorn',
      'Sacred sites and cultural centers'
    ],
    markerIds: nativeSorted.map(m => m.id),
  });
  
  // ═══════════════════════════════════════════════════════════════════
  // TRAIL 8: Vigilante Trail
  // ═══════════════════════════════════════════════════════════════════
  const vigilanteMarkers = allMarkers.filter(m => {
    const text = (m.title + ' ' + m.inscription).toLowerCase();
    return text.includes('vigilante') || text.includes('road agent') ||
           text.includes('plummer') || text.includes('hanging') ||
           (text.includes('outlaw') && m.townSlug === 'virginia-city') ||
           text.includes('3-7-77');
  });
  
  const vigilanteSorted = sortSouthToNorth(vigilanteMarkers)
    .filter(m => m.inscription.length > 100)
    .slice(0, 15);
  
  trails.push({
    id: 'vigilante-trail',
    name: 'Montana Vigilante Trail',
    description: 'Follow the dark history of frontier justice in Montana. From the hanging of Sheriff Henry Plummer to the secret code 3-7-77, discover the true crime stories that shaped Montana law.',
    difficulty: 'easy',
    estimatedDays: '1-2',
    totalMiles: calculateTrailDistance(vigilanteSorted),
    markerCount: vigilanteSorted.length,
    regions: ['Southwest Montana'],
    highlights: [
      'Bannack - Sheriff Plummer\'s territory',
      'Virginia City gallows',
      'Boot Hill Cemetery',
      'Robber\'s Roost'
    ],
    markerIds: vigilanteSorted.map(m => m.id),
  });
  
  // ═══════════════════════════════════════════════════════════════════
  // TRAIL 9: Missouri River Heritage
  // ═══════════════════════════════════════════════════════════════════
  const missouriMarkers = allMarkers.filter(m => {
    const text = (m.title + ' ' + m.inscription).toLowerCase();
    return text.includes('missouri river') || text.includes('missouri steamboat') ||
           text.includes('great falls of the missouri') ||
           text.includes('headwaters') || text.includes('three forks') ||
           (m.townSlug === 'fort-benton' && text.includes('river'));
  });
  
  const missouriSorted = sortWestToEast(missouriMarkers)
    .filter(m => m.inscription.length > 150)
    .slice(0, 20);
  
  trails.push({
    id: 'missouri-river',
    name: 'Missouri River Heritage Trail',
    description: 'Trace Montana\'s great river from Three Forks to Fort Benton. Follow the route of steamboats, explorers, and settlers who used the Missouri as their highway to the frontier.',
    difficulty: 'moderate',
    estimatedDays: '2-3',
    totalMiles: calculateTrailDistance(missouriSorted),
    markerCount: missouriSorted.length,
    regions: ['Central Montana', 'North-Central Montana'],
    highlights: [
      'Three Forks - Missouri headwaters',
      'Great Falls of the Missouri',
      'Fort Benton steamboat levee',
      'Missouri Breaks'
    ],
    markerIds: missouriSorted.map(m => m.id),
  });
  
  // ═══════════════════════════════════════════════════════════════════
  // TRAIL 10: Bozeman Trail
  // ═══════════════════════════════════════════════════════════════════
  const bozemanTrailMarkers = allMarkers.filter(m => {
    const text = (m.title + ' ' + m.inscription).toLowerCase();
    return text.includes('bozeman trail') || text.includes('john bozeman') ||
           text.includes('bridger trail') || text.includes('emigrant') ||
           (text.includes('bozeman') && text.includes('trail'));
  });
  
  const bozemanTrailSorted = sortWestToEast(bozemanTrailMarkers)
    .filter(m => m.inscription.length > 100)
    .slice(0, 15);
  
  trails.push({
    id: 'bozeman-trail',
    name: 'Historic Bozeman Trail',
    description: 'Walk in the footsteps of emigrants who traveled the Bozeman Trail to the Montana gold fields. This shortcut through Sioux territory was one of the most dangerous routes in the West.',
    difficulty: 'moderate',
    estimatedDays: '1-2',
    totalMiles: calculateTrailDistance(bozemanTrailSorted),
    markerCount: bozemanTrailSorted.length,
    regions: ['South-Central Montana'],
    highlights: [
      'Bozeman Pass',
      'Original trail route markers',
      'John Bozeman murder site',
      'Emigrant camp sites'
    ],
    markerIds: bozemanTrailSorted.map(m => m.id),
  });
  
  // Write output
  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(trails, null, 2));
  
  // Print summary
  console.log('=== History Trails Generated ===\n');
  trails.forEach(t => {
    console.log(`${t.name}`);
    console.log(`  ID: ${t.id}`);
    console.log(`  Markers: ${t.markerCount}`);
    console.log(`  Est. Miles: ${t.totalMiles}`);
    console.log(`  Days: ${t.estimatedDays}`);
    console.log('');
  });
  console.log(`Total trails: ${trails.length}`);
  console.log(`Output: ${OUTPUT_PATH}`);
}

main();
