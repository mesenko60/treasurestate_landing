/* Generate WebP variants (480w, 800w, full) for town and hero images */
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const SIZES = [480, 800]; // additional widths; full-size WebP uses original dimensions (capped at 1500)
const MAX_FULL = 1500;

async function convertToWebp(srcPath, destDir, baseName) {
  const ext = path.extname(srcPath);
  if (!['.jpg', '.jpeg', '.png'].includes(ext.toLowerCase())) return;

  const base = path.join(destDir, baseName);
  let count = 0;

  try {
    const meta = await sharp(srcPath).metadata();
    const origW = meta.width || 0;
    const origH = meta.height || 0;

    // Resized variants
    for (const w of SIZES) {
      if (origW <= w) continue;
      const outPath = `${base}-${w}.webp`;
      await sharp(srcPath)
        .resize(w, null, { withoutEnlargement: true })
        .webp({ quality: 82 })
        .toFile(outPath);
      count++;
    }

    // Full-size WebP (cap at MAX_FULL)
    const fullW = Math.min(origW, MAX_FULL);
    const fullPath = `${base}.webp`;
    if (fullW < origW) {
      await sharp(srcPath)
        .resize(fullW, null, { withoutEnlargement: true })
        .webp({ quality: 85 })
        .toFile(fullPath);
    } else {
      await sharp(srcPath)
        .webp({ quality: 85 })
        .toFile(fullPath);
    }
    count++;
  } catch (err) {
    console.error(`  ERROR ${baseName}:`, err.message);
  }
  return count;
}

(async () => {
  const webDir = path.resolve(__dirname, '..');
  const publicDir = path.join(webDir, 'public', 'images');
  const townsDir = path.join(publicDir, 'towns');

  let total = 0;

  // Hero image (in images/ root)
  const heroPath = path.join(publicDir, 'hero-image.jpg');
  if (fs.existsSync(heroPath)) {
    const n = await convertToWebp(heroPath, publicDir, 'hero-image');
    if (n) { total += n; console.log('  hero-image: ' + n + ' WebP files'); }
  }

  // Town images
  if (fs.existsSync(townsDir)) {
    const files = fs.readdirSync(townsDir);
    for (const f of files) {
      const ext = path.extname(f).toLowerCase();
      if (ext !== '.jpg' && ext !== '.jpeg' && ext !== '.png') continue;
      const baseName = path.basename(f, ext);
      const srcPath = path.join(townsDir, f);
      const n = await convertToWebp(srcPath, townsDir, baseName);
      if (n) { total += n; console.log('  ' + baseName + ': ' + n + ' WebP files'); }
    }
  }

  console.log('convert-images-to-webp: ' + total + ' WebP files generated');
})();
