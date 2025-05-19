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
      
      // Get the town name from the file content
      const titleMatch = content.match(/<title>([^<]+)<\/title>/);
      let townName = 'Montana';
      if (titleMatch && titleMatch[1]) {
        // Extract just the town name from the title
        townName = titleMatch[1].split(' - ')[0].trim();
      }
      
      // Create the hero section HTML
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
        /<div id="site-hero">[\s\S]*?<\/div>/, 
        `<div id="site-hero">${heroSection}</div>`
      );
      
      // Remove the hero-interior include from the JavaScript
      content = content.replace(
        /includeHTML\('site-hero', basePath \+ 'includes\/hero-interior.html'\);/,
        ''
      );
      
      // Save the updated file
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Updated hero section for: ${file}`);
      
    } catch (error) {
      console.error(`❌ Error processing ${file}:`, error.message);
    }
  });
}

// Process all directories
directories.forEach(directory => {
  processDirectory(directory);
});

console.log('\nHero sections have been updated!');
