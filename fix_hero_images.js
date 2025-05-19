const fs = require('fs');
const path = require('path');

const townsDir = path.join(__dirname, 'montana-towns');
const excludeFiles = ['index.html'];

// Function to get all HTML files in a directory
function getHtmlFiles(dir) {
  return fs.readdirSync(dir)
    .filter(file => file.endsWith('.html') && !excludeFiles.includes(file));
}

// Function to update a single town page
function updateTownPage(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    const townSlug = path.basename(filePath, '.html');
    const townName = townSlug.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
    
    // Create the new hero section HTML
    const heroSection = `
  <header class="hero-section hero-section--small">
    <img src="../images/towns/${townSlug}.jpg" alt="${townName}, Montana - Scenic View" class="hero-image hero-image--small" width="1920" height="800" onerror="this.onerror=null; this.src='../images/hero-image.jpg';">
    <div class="hero-text hero-text--small">
      <h1>${townName}, Montana</h1>
      <p>A Montana Community</p>
    </div>
  </header>`;

    // Remove any existing hero section scripts
    content = content.replace(
      /<script[^>]*>\s*\/\/ Helper: Wait for an element to exist in the DOM[\s\S]*?<\/script>/g,
      ''
    );

    // Remove any existing hero section
    content = content.replace(
      /<div id="site-hero">[\s\S]*?<\/div>/, 
      `<div id="site-hero">${heroSection}</div>`
    );

    // Ensure the includeHTML function is present
    if (!content.includes('function includeHTML')) {
      content = content.replace(
        '<head>',
        `<head>\n    <script>
      function includeHTML(id, file) {
        fetch(file)
          .then(response => response.text())
          .then(data => { 
            const el = document.getElementById(id);
            if (el) el.innerHTML = data; 
          });
      }
    </script>`
      );
    }

    // Remove any duplicate includes
    content = content.replace(
      /includeHTML\(['"]site-menu['"][\s\S]*?includeHTML\(['"]site-footer['"]/g,
      ''
    );

    // Add the includes before the closing body tag
    if (!content.includes('includeHTML')) {
      content = content.replace(
        '<div id="site-footer"></div>',
        `  <div id="site-footer"></div>
  <script>
    // Load includes
    includeHTML('site-menu', '../includes/header.html');
    includeHTML('site-footer', '../includes/footer.html');
    includeHTML('coming-soon', '../includes/coming-soon.html');
  </script>`
      );
    }

    // Write the updated content back to the file
    fs.writeFileSync(filePath, content, 'utf8');
    return true;
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
    return false;
  }
}

// Main function to update all town pages
function updateAllTownPages() {
  try {
    const files = getHtmlFiles(townsDir);
    console.log(`Found ${files.length} town files to process...`);
    
    let successCount = 0;
    files.forEach(file => {
      const filePath = path.join(townsDir, file);
      if (updateTownPage(filePath)) {
        console.log(`✅ Updated: ${file}`);
        successCount++;
      } else {
        console.log(`❌ Failed to update: ${file}`);
      }
    });
    
    console.log(`\nUpdate complete! Successfully updated ${successCount} of ${files.length} files.`);
    return successCount === files.length;
  } catch (error) {
    console.error('Error updating town pages:', error);
    return false;
  }
}

// Run the update
updateAllTownPages();
