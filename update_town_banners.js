const fs = require('fs');
const path = require('path');

// Directory containing town pages
const townsDir = path.join(__dirname, 'montana-towns');

// Skip these files
const skipFiles = ['index.html', 'template.html'];

// The new banner HTML to insert
const newBannerHTML = `  <section id="affiliate-banner" class="banner-section" style="min-height: 100px; margin: 20px 0; text-align: center; background: #f8f9fa; padding: 15px 0 10px 0; width: 100%;">
    <div style="width: 100%; max-width: 1200px; margin: 0 auto; text-align: center;">
      <iframe 
        class="eg-affiliate-banners-frame" 
        src="https://affiliates.expediagroup.com/products/banners?program=us-expedia&layout=leaderboard&image=mountains&message=hotel-treehouse-find-perfect-place-stay&link=stays&network=pz&camref=1011l52GG6" 
        style="width: 728px; height: 90px; margin: 0 auto; border: none; display: block;"
        title="Expedia Hotel Deals">
      </iframe>
    </div>
  </section>`;

// Function to update a single file
function updateFile(filePath) {
  try {
    // Read the file
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Check if the file already has the new banner format
    if (content.includes('eg-affiliate-banners-frame')) {
      console.log(`Skipping ${filePath} - already updated`);
      return;
    }
    
    // Find and replace the banner section
    const bannerRegex = /<section[^>]*id=["']affiliate-banner["'][^>]*>.*?<\/section>/s;
    
    if (bannerRegex.test(content)) {
      // Replace existing banner
      const newContent = content.replace(bannerRegex, newBannerHTML);
      fs.writeFileSync(filePath, newContent, 'utf8');
      console.log(`Updated banner in ${filePath}`);
    } else {
      // If no banner section found, try to add it before the coming-soon div
      const comingSoonRegex = /(\s*<div[^>]*id=["']coming-soon["'][^>]*>)/s;
      if (comingSoonRegex.test(content)) {
        const newContent = content.replace(comingSoonRegex, `\n${newBannerHTML}\n$1`);
        fs.writeFileSync(filePath, newContent, 'utf8');
        console.log(`Added banner to ${filePath}`);
      } else {
        console.warn(`Could not find banner or coming-soon section in ${filePath}`);
      }
    }
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
  }
}

// Get all HTML files in the towns directory
fs.readdir(townsDir, (err, files) => {
  if (err) {
    console.error('Error reading directory:', err);
    return;
  }

  // Filter HTML files and process each one
  const htmlFiles = files.filter(file => 
    file.endsWith('.html') && 
    !skipFiles.includes(file) &&
    !file.includes('backup') // Skip backup directories
  );

  console.log(`Found ${htmlFiles.length} town pages to process`);
  
  htmlFiles.forEach(file => {
    const filePath = path.join(townsDir, file);
    updateFile(filePath);
  });

  console.log('Banner update complete!');
});
