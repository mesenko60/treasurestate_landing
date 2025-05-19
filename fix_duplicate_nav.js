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
      
      // Remove hardcoded nav if it exists
      if (content.includes('<nav class="menu-bar">')) {
        content = content.replace(/<nav class="menu-bar">[\s\S]*?<\/nav>\s*<div id="site-menu"><\/div>/g, '<div id="site-menu"></div>');
        console.log(`✅ Fixed duplicate nav in: ${file}`);
      }
      
      // Save the updated file
      fs.writeFileSync(filePath, content, 'utf8');
      
    } catch (error) {
      console.error(`❌ Error processing ${file}:`, error.message);
    }
  });
}

// Process all directories
directories.forEach(directory => {
  processDirectory(directory);
});

console.log('\nDuplicate navigation cleanup complete!');
