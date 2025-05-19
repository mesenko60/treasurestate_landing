const fs = require('fs');
const path = require('path');

const townsDir = path.join(__dirname, 'montana-towns');
const excludeFiles = ['index.html'];

// The new hero initialization code template
const newHeroCode = `      // Helper: Wait for an element to exist in the DOM
      function waitForElement(selector, timeout = 2000) {
        return new Promise((resolve, reject) => {
          const interval = 50;
          let elapsed = 0;
          const check = () => {
            const el = document.querySelector(selector);
            if (el) return resolve(el);
            elapsed += interval;
            if (elapsed >= timeout) return reject();
            setTimeout(check, interval);
          };
          check();
        });
      }

      // Wait for the hero section to be loaded before setting content
      function initializeHero() {
        var img = new Image();
        var townSlug = '{{TOWN_SLUG}}';
        var townName = '{{TOWN_NAME}}';
        var townImg = '../images/towns/' + townSlug + '.jpg';
        var defaultImg = '../images/hero-image.jpg';
        
        img.onload = function() {
          // Ensure the hero section exists
          waitForElement('#site-hero .hero-section').then(function(hero) {
            const h1 = hero.querySelector('h1');
            const p = hero.querySelector('p');
            const img = hero.querySelector('img');
            
            if (h1) h1.textContent = townName + ', Montana';
            if (p) p.textContent = 'A Montana Community';
            if (img) {
              img.src = townImg;
              img.alt = townName + ', Montana - Scenic View';
            }
          }).catch(function() {
            console.warn('Hero section not found after timeout');
          });
        };
        
        img.onerror = function() {
          waitForElement('#site-hero .hero-section').then(function(hero) {
            const h1 = hero.querySelector('h1');
            const p = hero.querySelector('p');
            const img = hero.querySelector('img');
            
            if (h1) h1.textContent = townName + ', Montana';
            if (p) p.textContent = 'A Montana Community';
            if (img) {
              img.src = defaultImg;
              img.alt = townName + ', Montana - Scenic View';
            }
          }).catch(function() {
            console.warn('Hero section not found after timeout');
          });
        };
        
        img.src = townImg;
      }
      
      // Run after the page loads
      if (document.readyState === 'complete') {
        initializeHero();
      } else {
        window.addEventListener('load', initializeHero);
      }`;

// Get all HTML files in the directory
try {
  const files = fs.readdirSync(townsDir)
    .filter(file => file.endsWith('.html') && !excludeFiles.includes(file));

  console.log(`Found ${files.length} town files to process...`);
  
  files.forEach(file => {
    const filePath = path.join(townsDir, file);
    try {
      let content = fs.readFileSync(filePath, 'utf8');
      
      // Extract town name from the first h1 tag or filename
      const townNameMatch = content.match(/<h1[^>]*>([^<]+), Montana<\/h1>/i) || 
                          [null, file.replace('.html', '').replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())];
      
      const townName = townNameMatch[1] || file.replace('.html', '').replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      const townSlug = file.replace('.html', '');
      
      // Remove any existing hero initialization code
      content = content.replace(/\/\/ (Helper: Wait for an element to exist in the DOM|Wait for the hero section to be loaded before setting content)[\s\S]*?window\.addEventListener\('load', initializeHero\);[\s\n]*<\/script>/g, '');
      
      // Add the new hero initialization code before the closing script tag
      const updatedContent = content.replace(
        /<\/script>/,
        `\n${newHeroCode.replace(/\{\{TOWN_SLUG\}\}/g, townSlug).replace(/\{\{TOWN_NAME\}\}/g, townName)}\n    </script>`
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
  
  console.log('\nHero initialization update complete!');
  
} catch (error) {
  console.error('Error reading directory:', error);
}
