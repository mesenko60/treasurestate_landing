const fs = require('fs');
const path = require('path');

const FRESHNESS_PATH = path.resolve(__dirname, '..', 'data', 'data-freshness.json');

/**
 * Updates the lastCollected timestamp for a data source in data-freshness.json.
 * Call at the end of any collection script.
 *
 * @param {string} key - The key in data-freshness.json (e.g. "zillowInventory")
 * @param {string} [dateStr] - ISO date string override; defaults to today
 */
function stamp(key, dateStr) {
  const today = dateStr || new Date().toISOString().slice(0, 10);
  let freshness = {};
  if (fs.existsSync(FRESHNESS_PATH)) {
    freshness = JSON.parse(fs.readFileSync(FRESHNESS_PATH, 'utf8'));
  }
  if (!freshness[key]) {
    freshness[key] = { label: key, frequency: 'unknown' };
  }
  freshness[key].lastCollected = today;
  fs.writeFileSync(FRESHNESS_PATH, JSON.stringify(freshness, null, 2));
  console.log(`[freshness] Stamped ${key} → ${today}`);
}

module.exports = { stamp };
