const fs = require('fs');
const path = require('path');

const townsDir = path.join(__dirname, 'montana-towns');
const filesWithIssues = [
  'alberton.html',
  'bigfork.html',
  'billings.html',
  'bozeman.html',
  'butte.html',
  'east-glacier.html',
  'gardiner.html',
  'great-falls.html',
  'helena.html',
  'kalispell.html',
  'missoula.html',
  'polson.html',
  'west-glacier.html'
];

// Function to generate a meta description for each town
function getMetaDescription(townName) {
  return `Discover ${townName}, Montana: Explore local attractions, history, and things to do in this beautiful Montana community.`;
}

console.log(`Fixing meta descriptions for ${filesWithIssues.length} files...\n`);

filesWithIssues.forEach(file => {
  const filePath = path.join(townsDir, file);
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    const townName = file.replace('.html', '').split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
    
    const metaDescription = `<meta name="description" content="${getMetaDescription(townName)}">`;
    
    // Add meta description if it's missing
    if (!content.includes('name="description"')) {
      content = content.replace(
        '<meta name="viewport"',
        `${metaDescription}\n  <meta name="viewport"`
      );
      
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Added meta description to ${file}`);
    } else {
      // Update existing meta description
      content = content.replace(
        /<meta\s+name=["']description["']\s+content=["'][^"']*["']\s*\/?>/,
        metaDescription
      );
      
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Updated meta description in ${file}`);
    }
    
  } catch (error) {
    console.error(`❌ Error processing ${file}:`, error.message);
  }
});

console.log('\nMeta descriptions update complete!');
