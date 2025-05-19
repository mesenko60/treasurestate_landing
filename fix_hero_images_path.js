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
      
      // Fix the hero image path for town pages
      if (directory.includes('montana-towns')) {
        // For town pages, ensure the path is relative to the montana-towns directory
        content = content.replace(
          /<img[^>]*src=["'](?:\w+\/)*images\/towns\/([^"']+)["'][^>]*>/,
          (match) => {
            return match.replace(
              /src=["'](.*?)["']/,
              'src="../images/towns/default-town.jpg"'
            );
          }
        );
      } else {
        // For root pages, ensure the path is correct
        content = content.replace(
          /<img[^>]*src=["'](?:\w+\/)*images\/towns\/([^"']+)["'][^>]*>/,
          (match) => {
            return match.replace(
              /src=["'](.*?)["']/,
              'src="images/towns/default-town.jpg"'
            );
          }
        );
      }
      
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

console.log('\nHero image paths update complete!');
