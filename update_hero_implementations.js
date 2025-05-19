const fs = require('fs');
const path = require('path');

// List of files that use the hero section
const filesToUpdate = [
  'index.html',
  'explore-montana.html',
  'Montana-Facts.html',
  'Montana-towns.html',
  'mining-history-of-montana.html',
  'story-of-montana-vigilantes.html',
  'planners.html'
];

// The new hero initialization code
const newHeroCode = `      // Set up the hero section
      function setupHero() {
        const options = {
          title: document.title.split(' - ')[0],
          subtitle: 'The Treasure State',
          image: 'images/hero-image.jpg',
          alt: 'Scenic Montana Landscape - The Treasure State'
        };
        
        // Set default values based on page
        if (document.body.classList.contains('town-page')) {
          options.subtitle = 'A Montana Community';
          options.image = 'images/towns/' + window.location.pathname.split('/').pop().replace('.html', '') + '.jpg';
          options.alt = options.title + ' - Scenic View';
        }
        
        // Set hero content
        setHeroContent(options).then(() => {
          console.log('Hero content updated');
        });
      }
      
      // Initialize the hero when the page loads
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', setupHero);
      } else {
        setupHero();
      }`;

// Update each file
filesToUpdate.forEach(file => {
  const filePath = path.join(__dirname, file);
  
  try {
    if (fs.existsSync(filePath)) {
      let content = fs.readFileSync(filePath, 'utf8');
      
      // Remove any existing hero initialization code
      content = content.replace(/\/\/ Set up the hero section[\s\S]*?setupHero\(\);[\s\n]*<\/script>/g, '');
      
      // Add the new hero initialization code before the closing body tag
      content = content.replace(
        '</body>',
        `  <script>
${newHeroCode}
  </script>
</body>`
      );
      
      // Add town-page class if it's a town page
      if (file.startsWith('montana-towns/')) {
        content = content.replace('<body', '<body class="town-page"');
      }
      
      // Write the updated content back to the file
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Updated: ${file}`);
    } else {
      console.log(`ℹ️  File not found: ${file}`);
    }
  } catch (error) {
    console.error(`❌ Error updating ${file}:`, error.message);
  }
});

console.log('\nHero implementations update complete!');
