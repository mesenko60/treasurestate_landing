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
      
      // 1. Remove extra blank lines (more than 2 consecutive)
      content = content.replace(/\n{3,}/g, '\n\n');
      
      // 2. Fix any remaining duplicate "Montana" in alt text
      content = content.replace(/(alt=".*?)Montana, Montana(.*?")/g, '$1$2');
      
      // 3. Remove any empty script blocks
      content = content.replace(/\s*if \(document\.getElementById\('site-hero'\)\) \{\s*\}\s*/g, '\n');
      
      // 4. Clean up whitespace at the end of the file
      content = content.trim() + '\n';
      
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

console.log('\nFinal cleanup complete!');
