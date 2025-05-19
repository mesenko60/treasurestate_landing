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
      
      // 1. Extract town name from the h1
      const townNameMatch = content.match(/<h1>(.*?), Montana<\/h1>/);
      if (townNameMatch) {
        const townName = townNameMatch[1];
        
        // 2. Remove the redundant h1
        updatedContent = updatedContent.replace(
          /<h1>.*?<\/h1>\s*<p>.*?<\/p>/,
          ''
        );
        
        // 3. Update the hero title and subtitle in the script section
        updatedContent = updatedContent.replace(
          /setHeroContent\(\{[^}]*title:[^,]+,/,
          `setHeroContent({\n            title: '${townName}, Montana',`
        );
        
        // 4. Change the first h2 to h1 (for the first section after the hero)
        updatedContent = updatedContent.replace(
          /<h2(.*?)>/, 
          '<h1$1>',
          1 // Only replace the first occurrence
        );
        updatedContent = updatedContent.replace(
          /<\/h2>/, 
          '</h1>',
          1 // Only replace the first occurrence
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
  
  console.log('\nHero and heading update complete!');
  
} catch (error) {
  console.error('Error reading directory:', error);
}
