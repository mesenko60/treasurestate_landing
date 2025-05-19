const fs = require('fs');
const path = require('path');

// Get current date in YYYY-MM-DD format
const now = new Date();
const year = now.getFullYear();
const month = String(now.getMonth() + 1).padStart(2, '0');
const day = String(now.getDate()).padStart(2, '0');
const currentDate = `${year}-${month}-${day}`;

// Path to the sitemap file
const sitemapPath = path.join(__dirname, 'sitemap.xml');

// Read the current sitemap
let sitemap = fs.readFileSync(sitemapPath, 'utf8');

// Update the generation date in the comment
sitemap = sitemap.replace(
  /<!-- Generated[^>]+-->/,
  `<!-- Generated ${currentDate} – TreasureState.com -->`
);

// Update lastmod dates for all URLs
sitemap = sitemap.replace(
  /<lastmod>\d{4}-\d{2}-\d{2}<\/lastmod>/g,
  `<lastmod>${currentDate}</lastmod>`
);

// Write the updated sitemap back to file
fs.writeFileSync(sitemapPath, sitemap, 'utf8');

console.log('Sitemap updated successfully with date:', currentDate);
