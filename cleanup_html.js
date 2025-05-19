const fs = require('fs');
const path = require('path');

// Directories to process
const directories = [
  path.join(__dirname, 'montana-towns'),
  __dirname // Root directory for other HTML files
];

// Files to exclude
const excludeFiles = ['index.html'];

// Process all HTML files in the given directory
function processDirectory(directory) {
  if (!fs.existsSync(directory)) {
    console.log(`Directory not found: ${directory}`);
    return;
  }

  const files = fs.readdirSync(directory)
    .filter(file => file.endsWith('.html') && !excludeFiles.includes(file));

  console.log(`\nProcessing ${files.length} files in ${path.basename(directory)}...`);

  files.forEach(file => {
    const filePath = path.join(directory, file);
    try {
      let content = fs.readFileSync(filePath, 'utf8');
      
      // 1. Fix extra closing header tags
      content = content.replace(/<\/header>\s*<\/header>/g, '</header>');
      
      // 2. Ensure proper hero section structure
      const titleMatch = content.match(/<title>([^<]+)<\/title>/);
      let townName = 'Montana';
      if (titleMatch && titleMatch[1]) {
        // Extract just the town name from the title
        townName = titleMatch[1].split(' - ')[0].trim();
      }
      
      const heroSection = `
  <header class="hero-section hero-section--small">
    <img src="../images/towns/default-town.jpg" alt="${townName}, Montana - Scenic View" class="hero-image hero-image--small" width="1920" height="800" onerror="this.onerror=null; this.src='../images/hero-image.jpg';">
    <div class="hero-text hero-text--small">
      <h1>${townName}</h1>
      <p>A Montana Community</p>
    </div>
  </header>`;
      
      // Replace the site-hero div with the new hero section
      content = content.replace(
        /<div id="site-hero">[\s\S]*?<\/div>/i, 
        `<div id="site-hero">${heroSection}</div>`
      );
      
      // 3. Clean up any remaining script issues
      content = content.replace(
        /if \(document\.getElementById\('site-hero'\)\) \{\s*\n\s*\n\s*\}/g,
        'if (document.getElementById(\'site-hero\')) {}'
      );
      
      // 4. Ensure the navigation script is correct
      const navScript = `
    // Load all includes when the DOM is loaded
    document.addEventListener('DOMContentLoaded', function() {
      // Get the base path based on current page location
      const isTownPage = window.location.pathname.includes('/montana-towns/');
      const basePath = isTownPage ? '../' : './';
      
      console.log('Base path:', basePath);
      
      // Include navigation
      includeHTML('site-menu', basePath + 'includes/header.html');
      
      // Include other common elements
      if (document.getElementById('coming-soon')) {
        includeHTML('coming-soon', basePath + 'includes/coming-soon.html');
      }
      if (document.getElementById('site-footer')) {
        includeHTML('site-footer', basePath + 'includes/footer.html');
      }
    });`;
      
      content = content.replace(
        /\/\/ Load all includes when the DOM is loaded[\s\S]*?\/\/ End of includes\s*\n\s*<\/script>/,
        navScript + '\n  </script>'
      );
      
      // Save the updated file
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Cleaned up: ${file}`);
      
    } catch (error) {
      console.error(`❌ Error processing ${file}:`, error.message);
    }
  });
}

// Process all directories
directories.forEach(directory => {
  processDirectory(directory);
});

console.log('\nHTML cleanup complete!');
