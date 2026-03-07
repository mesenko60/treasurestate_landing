const fs = require('fs');
const path = require('path');
const https = require('https');

const WEB_DIR = path.resolve(__dirname, '..');
const CORRIDORS_PATH = path.join(WEB_DIR, 'data', 'corridors.json');
const ENV_PATH = path.join(WEB_DIR, '.env.local');
const OUT_DIR = path.join(WEB_DIR, 'public', 'images', 'corridors');

function readMapboxToken() {
  const env = fs.readFileSync(ENV_PATH, 'utf8');
  const match = env.match(/NEXT_PUBLIC_MAPBOX_TOKEN=(\S+)/);
  if (!match) throw new Error('NEXT_PUBLIC_MAPBOX_TOKEN not found in .env.local');
  return match[1].trim();
}

/**
 * Downsample coordinates to at most maxPoints using uniform selection,
 * always keeping the first and last points to preserve endpoints.
 */
function simplifyCoords(coords, maxPoints) {
  if (coords.length <= maxPoints) return coords;
  const result = [coords[0]];
  const step = (coords.length - 1) / (maxPoints - 1);
  for (let i = 1; i < maxPoints - 1; i++) {
    result.push(coords[Math.round(i * step)]);
  }
  result.push(coords[coords.length - 1]);
  return result;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https
      .get(url, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          file.close();
          if (fs.existsSync(dest)) fs.unlinkSync(dest);
          return download(res.headers.location, dest).then(resolve).catch(reject);
        }
        if (res.statusCode !== 200) {
          file.close();
          if (fs.existsSync(dest)) fs.unlinkSync(dest);
          reject(new Error(`HTTP ${res.statusCode}`));
          return;
        }
        res.pipe(file);
        file.on('finish', () => file.close(resolve));
      })
      .on('error', (err) => {
        file.close();
        if (fs.existsSync(dest)) fs.unlinkSync(dest);
        reject(err);
      });
  });
}

async function main() {
  const token = readMapboxToken();
  const corridors = JSON.parse(fs.readFileSync(CORRIDORS_PATH, 'utf8'));

  fs.mkdirSync(OUT_DIR, { recursive: true });

  console.log(`Generating map images for ${corridors.length} corridors...\n`);

  for (const corridor of corridors) {
    const simplified = simplifyCoords(corridor.geometry.coordinates, 25);
    const hexColor = corridor.color.replace('#', '');
    const coordStr = simplified.map(([lng, lat]) => `${lng},${lat}`).join(',');

    const overlay = `path-4+${hexColor}-0.8(${coordStr})`;
    const apiUrl =
      `https://api.mapbox.com/styles/v1/mapbox/outdoors-v12/static/` +
      `${overlay}/auto/1200x630?padding=60&access_token=${token}`;

    const dest = path.join(OUT_DIR, `${corridor.id}.png`);

    try {
      await download(apiUrl, dest);
      const size = fs.statSync(dest).size;
      console.log(`  OK  ${corridor.id}.png  (${(size / 1024).toFixed(0)} KB)`);
    } catch (err) {
      console.error(`  ERR ${corridor.id}: ${err.message}`);
    }

    await sleep(300);
  }

  console.log('\nDone!');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
