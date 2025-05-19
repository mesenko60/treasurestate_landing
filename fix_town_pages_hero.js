const fs = require('fs');
const path = require('path');

const townsDir = path.join(__dirname, 'montana-towns');
const excludeFiles = ['index.html'];

// The new hero initialization code
const newHeroCode = `
      // Helper: Wait for an element to exist in the DOM
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

      // Set hero content after include loads
      function setHeroContent(options) {
        return new Promise((resolve) => {
          const hero = document.querySelector('#site-hero .hero-section');
          if (hero) {
            updateHeroContent(hero, options);
            resolve();
          } else {
            waitForElement('#site-hero .hero-section').then(hero => {
              updateHeroContent(hero, options);
              resolve();
            }).catch(() => {
              console.warn('Hero section not found after timeout');
              resolve();
            });
          }
        });
      }

      // Helper function to update hero content
      function updateHeroContent(hero, options) {
        if (!hero) return;
        
        const h1 = hero.querySelector('h1');
        const p = hero.querySelector('p');
        const img = hero.querySelector('img');
        
        // Only update if the element exists and the option is provided
        if (h1 && options.title) h1.textContent = options.title;
        if (p && options.subtitle) p.textContent = options.subtitle;
        
        // For the image, we'll use a new Image() to preload it
        if (img && (options.image || options.alt)) {
          // If we have a new image to load, preload it first
          if (options.image) {
            const newImg = new Image();
            newImg.onload = function() {
              // Only update the src once the image is loaded
              img.src = options.image;
              if (options.alt) img.alt = options.alt;
            };
            newImg.src = options.image;
          } else if (options.alt) {
            // If only the alt text is being updated
            img.alt = options.alt;
          }
        }
      }


      // Set up the hero section
      function setupHero() {
        var townSlug = '{{TOWN_SLUG}}';
        var townName = '{{TOWN_NAME}}';
        var townImg = '../images/towns/' + townSlug + '.jpg';
        var defaultImg = '../images/hero-image.jpg';
        
        // Set hero content
        setHeroContent({
          title: townName + ', Montana',
          subtitle: 'A Montana Community',
          image: townImg,
          alt: townName + ', Montana - Scenic View'
        }).then(() => {
          // If the image fails to load, use the default
          const img = document.querySelector('#site-hero .hero-section img');
          if (img) {
            img.onerror = function() {
              this.src = defaultImg;
            };
          }
        });
      }

      // Function to load all includes
      function loadAll() {
        // Load all includes
        includeHTML('site-menu', '../includes/header.html');
        includeHTML('site-hero', '../includes/hero-interior.html');
        includeHTML('coming-soon', '../includes/coming-soon.html');
        includeHTML('site-footer', '../includes/footer.html');
        
        // Set up the hero after a short delay to allow includes to load
        setTimeout(setupHero, 300);
      }
      
      // Start the process when the DOM is ready
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadAll);
      } else {
        loadAll();
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
      
      // Extract town name from the filename
      const townSlug = file.replace('.html', '');
      const townName = townSlug.split('-').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ');
      
      // Remove any existing script tags in the head
      content = content.replace(
        /<script[^>]*>([\s\S]*?)<\/script>/g,
        (match, scriptContent) => {
          // Keep Google Analytics and other important scripts
          if (scriptContent.includes('gtag') || 
              scriptContent.includes('google-adsense') || 
              scriptContent.includes('googletagmanager')) {
            return match;
          }
          return '';
        }
      );
      
      // Add the new hero initialization code before the closing body tag
      content = content.replace(
        /<\/body>/,
        `  <script>
${newHeroCode.replace(/\{\{TOWN_SLUG\}\}/g, townSlug).replace(/\{\{TOWN_NAME\}\}/g, townName)}\n  </script>\n</body>`
      );
      
      // Ensure the includeHTML function is present
      if (!content.includes('function includeHTML')) {
        content = content.replace(
          '<script>',
          `<script>
      function includeHTML(id, file) {
        fetch(file)
          .then(response => response.text())
          .then(data => { 
            const el = document.getElementById(id);
            if (el) el.innerHTML = data; 
          });
      }`
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
