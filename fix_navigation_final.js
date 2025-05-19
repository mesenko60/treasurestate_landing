const fs = require('fs');
const path = require('path');

// Directories to process
const directories = [
  path.join(__dirname, 'montana-towns'),
  __dirname // Root directory for other HTML files
];

// Files to exclude
const excludeFiles = ['index.html'];

// The navigation HTML
const navHTML = `
<nav class="menu-bar">
  <a href="/index.html">Home</a>
  <a href="/Montana-towns.html">Cities and Towns</a>
  <a href="/Montana-Facts.html">Montana Facts</a>
  <a href="/explore-montana.html">Explore Montana</a>
  <a href="#">Gallery</a>
  <a href="#">Contact</a>
</nav>`;

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
      
      // Remove any existing navigation
      content = content.replace(
        /<div id="site-menu">[\s\S]*?<\/div>/,
        '<div id="site-menu"></div>'
      );
      
      // Add the navigation HTML right after the opening body tag
      content = content.replace(
        /<body[^>]*>/,
        (match) => {
          return `${match}\n${navHTML}`;
        }
      );
      
      // Save the updated file
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Updated: ${file}`);
      
    } catch (error) {
      console.error(`❌ Error processing ${file}:`, error.message);
    }
  });
}

// Process all directories
directories.forEach(directory => {
  processDirectory(directory);
});

console.log('\nNavigation update complete!');
