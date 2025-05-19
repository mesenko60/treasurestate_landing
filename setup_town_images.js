const fs = require('fs');
const path = require('path');

const townsDir = path.join(__dirname, 'montana-towns');
const imagesDir = path.join(__dirname, 'images');
const townsImagesDir = path.join(imagesDir, 'towns');

// Ensure the towns images directory exists
if (!fs.existsSync(townsImagesDir)) {
  fs.mkdirSync(townsImagesDir, { recursive: true });
  console.log('Created towns images directory');
}

// Copy the default hero image to the towns directory if it doesn't exist
const defaultImageSrc = path.join(imagesDir, 'hero-image.jpg');
const defaultImageDest = path.join(townsImagesDir, 'default-town.jpg');

if (fs.existsSync(defaultImageSrc) && !fs.existsSync(defaultImageDest)) {
  fs.copyFileSync(defaultImageSrc, defaultImageDest);
  console.log('Copied default town image');
}

// Get all town HTML files
function getTownSlugs() {
  return fs.readdirSync(townsDir)
    .filter(file => file.endsWith('.html') && file !== 'index.html')
    .map(file => path.basename(file, '.html'));
}

// Create a mapping of town slugs to image filenames we should look for
function getTownImageFilenames(slug) {
  // Common variations of image filenames
  return [
    `${slug}.jpg`,
    `${slug}.jpeg`,
    `${slug}.png`,
    `${slug.split('-').join('')}.jpg`,
    `${slug.split('-').join('_')}.jpg`,
    `${slug.charAt(0).toUpperCase() + slug.slice(1)}.jpg`
  ];
}

// Check if any of the possible filenames exist in the source directory
function findTownImage(slug) {
  const possibleFilenames = getTownImageFilenames(slug);
  
  // First check in the towns directory
  for (const filename of possibleFilenames) {
    const filePath = path.join(townsImagesDir, filename);
    if (fs.existsSync(filePath)) {
      return filename;
    }
  }
  
  // If not found, check in the root images directory
  for (const filename of possibleFilenames) {
    const filePath = path.join(imagesDir, filename);
    if (fs.existsSync(filePath)) {
      // Move the image to the towns directory
      const destPath = path.join(townsImagesDir, `${slug}${path.extname(filename)}`);
      fs.copyFileSync(filePath, destPath);
      console.log(`Moved ${filename} to towns directory as ${path.basename(destPath)}`);
      return path.basename(destPath);
    }
  }
  
  return null;
}

// Update town pages to use the correct image paths
function updateTownPages() {
  const towns = getTownSlugs();
  let updatedCount = 0;
  
  towns.forEach(slug => {
    const htmlPath = path.join(townsDir, `${slug}.html`);
    const imageName = findTownImage(slug) || 'default-town.jpg';
    
    try {
      let content = fs.readFileSync(htmlPath, 'utf8');
      
      // Update the hero image source
      const newContent = content.replace(
        /<img[^>]*src=["'][^"']*["'][^>]*>/,
        `<img src="../images/towns/${imageName}" alt="${slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}, Montana - Scenic View" class="hero-image hero-image--small" width="1920" height="800" onerror="this.onerror=null; this.src='../images/hero-image.jpg';">`
      );
      
      if (newContent !== content) {
        fs.writeFileSync(htmlPath, newContent, 'utf8');
        console.log(`✅ Updated: ${slug}.html`);
        updatedCount++;
      } else {
        console.log(`ℹ️  No changes needed: ${slug}.html`);
      }
    } catch (error) {
      console.error(`❌ Error updating ${slug}.html:`, error.message);
    }
  });
  
  console.log(`\nUpdate complete! Updated ${updatedCount} of ${towns.length} town pages.`);
  
  // Create a README.md in the towns images directory
  const readmePath = path.join(townsImagesDir, 'README.md');
  if (!fs.existsSync(readmePath)) {
    const readmeContent = `# Town Images

This directory contains hero images for town pages. Each town should have an image file named after the town's slug (e.g., 'billings.jpg').

If a town-specific image is not found, the page will fall back to 'default-town.jpg'.

## Adding Images

1. Place the image file in this directory
2. Name it using the town's slug (e.g., 'billings.jpg')
3. Recommended size: 1920x800 pixels
4. Format: JPG or PNG

## Default Image

The 'default-town.jpg' image is used as a fallback when a town-specific image is not available.
`;
    fs.writeFileSync(readmePath, readmeContent, 'utf8');
    console.log('\nCreated README.md in towns images directory');
  }
}

// Run the setup
updateTownPages();
