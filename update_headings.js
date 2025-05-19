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
      let updatedContent = content;
      
      // 1. Change main town name from h2 to h1
      updatedContent = updatedContent.replace(
        /<h2>(.*?), Montana<\/h2>/,
        '<h1>$1, Montana</h1>'
      );
      
      // 2. Change all h3 to h2
      updatedContent = updatedContent.replace(
        /<\/h3>/g,
        '</h2>'
      );
      updatedContent = updatedContent.replace(
        /<h3(.*?)>/g,
        '<h2$1>'
      );
      
      // 3. Fix any h4 that might need to be h3 (if any exist)
      updatedContent = updatedContent.replace(
        /<\/h4>/g,
        '</h3>'
      );
      updatedContent = updatedContent.replace(
        /<h4(.*?)>/g,
        '<h3$1>'
      );
      
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
  
  console.log('\nHeading update complete!');
  
} catch (error) {
  console.error('Error reading directory:', error);
}
