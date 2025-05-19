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
      
      // Extract town name from the filename
      const townName = file.replace('.html', '').replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      
      // Remove any duplicate town name from the content section
      // This will remove <h1>Town, Montana</h1> if it's immediately followed by <h1>Quick Facts</h1>
      const updatedContent = content.replace(
        new RegExp(`<h1[^>]*>${townName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}, Montana<\\/h1>\\s*<h1>Quick Facts<\\/h1>`, 'i'),
        '<h1>Quick Facts</h1>'
      );
      
      // Only write if changes were made
      if (content !== updatedContent) {
        fs.writeFileSync(filePath, updatedContent, 'utf8');
        console.log(`✅ Updated: ${file}`);
      } else {
        // If no changes were made, try a more aggressive approach
        const moreAggressiveUpdate = content.replace(
          new RegExp(`<h1[^>]*>${townName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}, Montana<\\/h1>\\s*<h1>`, 'i'),
          '<h1>'
        );
        
        if (content !== moreAggressiveUpdate) {
          fs.writeFileSync(filePath, moreAggressiveUpdate, 'utf8');
          console.log(`✅ Updated (aggressive): ${file}`);
        } else {
          console.log(`ℹ️  No changes needed: ${file}`);
        }
      }
      
    } catch (error) {
      console.error(`❌ Error processing ${file}:`, error.message);
    }
  });
  
  console.log('\nDuplicate town names cleanup complete!');
  
} catch (error) {
  console.error('Error reading directory:', error);
}
