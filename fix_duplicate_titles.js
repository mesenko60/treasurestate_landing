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
      
      // Extract town name from filename
      const townName = file.replace('.html', '').replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      
      // Remove the duplicate town name from the content section
      // This looks for an h1 with the town name followed by another h1 with "Quick Facts"
      const regex = new RegExp(`(<h1[^>]*>${townName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}, Montana<\\/h1>\\s*<h1>Quick Facts<\\/h1>)`, 'i');
      
      if (regex.test(content)) {
        // Replace the duplicate with just the "Quick Facts" heading
        const updatedContent = content.replace(regex, '<h1>Quick Facts</h1>');
        fs.writeFileSync(filePath, updatedContent, 'utf8');
        console.log(`✅ Fixed duplicate title in: ${file}`);
      } else {
        console.log(`ℹ️  No duplicate found in: ${file}`);
      }
      
    } catch (error) {
      console.error(`❌ Error processing ${file}:`, error.message);
    }
  });
  
  console.log('\nDuplicate titles cleanup complete!');
  
} catch (error) {
  console.error('Error reading directory:', error);
}
