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
      
      // Remove extra closing header tags
      let newContent = content;
      let count = 0;
      
      // First, remove all extra closing header tags
      while (newContent.includes('</header></div>')) {
        newContent = newContent.replace('</header></div>', '');
        count++;
      }
      
      // Then add back one proper closing div for the site-hero
      newContent = newContent.replace(
        '<div id="site-hero">\n  <header',
        '<div id="site-hero">\n  <header'
      );
      
      // Only save if we made changes
      if (newContent !== content) {
        fs.writeFileSync(filePath, newContent, 'utf8');
        console.log(`✅ Removed ${count} extra closing tags in: ${file}`);
      } else {
        console.log(`ℹ️ No changes needed for: ${file}`);
      }
      
    } catch (error) {
      console.error(`❌ Error processing ${file}:`, error.message);
    }
  });
}

// Process all directories
directories.forEach(directory => {
  processDirectory(directory);
});

console.log('\nExtra tags cleanup complete!');
