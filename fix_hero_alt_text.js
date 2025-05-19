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
      
      // Get the town name from the h1 tag
      const h1Match = content.match(/<h1>([^<]+)<\/h1>/);
      let townName = 'Montana';
      if (h1Match && h1Match[1]) {
        townName = h1Match[1].trim();
      }
      
      // Fix the alt text in the hero image
      const newAltText = `alt="${townName} - Scenic View"`;
      content = content.replace(
        /alt=".*?" class="hero-image/, 
        `${newAltText} class="hero-image`
      );
      
      // Save the updated file
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Updated hero alt text in: ${file}`);
      
    } catch (error) {
      console.error(`❌ Error processing ${file}:`, error.message);
    }
  });
}

// Process all directories
directories.forEach(directory => {
  processDirectory(directory);
});

console.log('\nHero alt text has been updated!');
