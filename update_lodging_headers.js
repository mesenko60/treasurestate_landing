const fs = require('fs');
const path = require('path');

const townsDir = path.join(__dirname, 'montana-towns');
const excludeFiles = ['index.html'];

// Get all HTML files in the directory
try {
  const files = fs.readdirSync(townsDir)
    .filter(file => file.endsWith('.html') && !excludeFiles.includes(file));

  console.log(`Found ${files.length} town files to process...`);
  
  files.forEach(file => {
    const filePath = path.join(townsDir, file);
    try {
      let content = fs.readFileSync(filePath, 'utf8');
      
      // Extract town name from filename (remove .html and replace hyphens with spaces)
      const townName = file
        .replace(/\.html$/, '')
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      
      // Create the new header
      const newHeader = `<h3>Best ${townName} Hotels & Lodging Guide (2025)</h3>`;
      
      // Replace the old header with the new one (handling both h2 and h3)
      let updatedContent = content;
      
      // Try h3 first, then h2 if no match
      if (content.match(/<h3>Where to Stay in .*?<\/h3>/i)) {
        updatedContent = content.replace(
          /<h3>Where to Stay in .*?<\/h3>/i, 
          newHeader
        );
      } else if (content.match(/<h2>Where to Stay<\/h2>/i)) {
        updatedContent = content.replace(
          /<h2>Where to Stay<\/h2>/i, 
          newHeader
        );
      }
      
      // Only write if changes were made
      if (content !== updatedContent) {
        fs.writeFileSync(filePath, updatedContent, 'utf8');
        console.log(`✅ Updated: ${file}`);
      } else {
        console.log(`ℹ️  No changes needed: ${file}`);
      }
      
    } catch (error) {
      console.error(`❌ Error processing ${file}:`, error.message);
    }
  });
  
  console.log('\nUpdate complete!');
  
} catch (error) {
  console.error('Error reading directory:', error);
}
