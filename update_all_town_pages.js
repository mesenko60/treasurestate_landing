const fs = require('fs');
const path = require('path');

const townsDir = path.join(__dirname, 'montana-towns');
const excludeFiles = ['index.html'];

// Template for meta description
function getMetaDescription(townName) {
  return `Discover ${townName}, Montana: Explore local attractions, history, and things to do in this beautiful Montana community.`;
}

// Get all HTML files in the directory
try {
  const files = fs.readdirSync(townsDir)
    .filter(file => file.endsWith('.html') && !excludeFiles.includes(file));

  console.log(`Found ${files.length} town files to process...`);
  
  files.forEach(file => {
    const filePath = path.join(townsDir, file);
    try {
      let content = fs.readFileSync(filePath, 'utf8');
      const townSlug = file.replace('.html', '');
      const townName = townSlug.split('-').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ');
      
      // 1. Ensure proper meta tags
      if (!content.includes('<meta charset="utf-8"')) {
        content = content.replace(
          '<head>',
          '<head>\n<meta charset="utf-8">'
        );
      }
      
      if (!content.includes('name="description"')) {
        content = content.replace(
          '<meta name="viewport"',
          `<meta name="description" content="${getMetaDescription(townName)}">\n  <meta name="viewport"`
        );
      }
      
      // 2. Fix hero section
      const heroSection = `
  <header class="hero-section hero-section--small">
    <img src="../images/towns/${townSlug}.jpg" alt="${townName}, Montana - Scenic View" class="hero-image hero-image--small" width="1920" height="800">
    <div class="hero-text hero-text--small">
      <h1>${townName}, Montana</h1>
      <p>A Montana Community</p>
    </div>
  </header>`;
      
      // Replace existing hero section or add new one
      if (content.includes('id="site-hero"')) {
        content = content.replace(
          /<div id="site-hero">[\s\S]*?<\/div>/,
          `<div id="site-hero">${heroSection}</div>`
        );
      } else {
        content = content.replace(
          '<main>',
          `<div id="site-hero">${heroSection}</div>\n<main>`
        );
      }
      
      // 3. Ensure content starts with Quick Facts
      if (!content.includes('<h1>Quick Facts</h1>')) {
        const contentSection = content.match(/<section[^>]*class=["']content-section["'][^>]*>([\s\S]*?)<\/section>/);
        if (contentSection) {
          const newContent = contentSection[0].replace(
            /<h1[^>]*>.*?<\/h1>/, 
            '<h1>Quick Facts</h1>'
          );
          content = content.replace(contentSection[0], newContent);
        }
      }
      
      // 4. Ensure proper script loading
      if (!content.includes('script.js')) {
        content = content.replace(
          '</body>',
          '  <script src="../js/script.js"></script>\n</body>'
        );
      }
      
      // Write the updated content back to the file
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Updated: ${file}`);
      
    } catch (error) {
      console.error(`❌ Error processing ${file}:`, error.message);
    }
  });
  
  console.log('\nTown pages update complete!');
  
} catch (error) {
  console.error('Error reading directory:', error);
}
