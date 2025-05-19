const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'montana-towns/butte.html');

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

      // Function to set up the hero section
      function setupHero() {
        var img = new Image();
        var townSlug = 'butte';
        var townName = 'Butte';
        var townImg = '../images/towns/' + townSlug + '.jpg';
        var defaultImg = '../images/hero-image.jpg';
        
        function updateHero() {
          // Set up the hero section
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
        }
        
        // Check if the image loads successfully
        img.onload = updateHero;
        
        // If image fails to load, use default
        img.onerror = function() {
          townImg = defaultImg;
          updateHero();
        };
        
        // Start loading the image
        img.src = townImg;
      }

      // Function to load all includes and then initialize the hero
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

// Read the file
let content = fs.readFileSync(filePath, 'utf8');

// Remove any existing hero initialization code
content = content.replace(
  /<script async[\s\S]*?<\/script>\s*<script[\s\S]*?<\/script>/,
  '<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8089329941656548" crossorigin="anonymous"></script>\n'
);

// Remove the duplicate initializeHero function
content = content.replace(
  /\/\/ Dynamically set hero image: use town-specific image if it exists, otherwise use the default hero-image\.jpg[\s\S]*?window\.addEventListener\('load', initializeHero\);/g,
  ''
);

// Add the new hero initialization code before the closing script tag
content = content.replace(
  /<\/script>/,
  `\n${newHeroCode}\n    </script>`
);

// Remove the duplicate town name from the content section
content = content.replace(
  /<h1[^>]*>Butte, Montana<\/h1>\s*<h1>Quick Facts<\/h1>/i,
  '<h1>Quick Facts</h1>'
);

// Write the updated content back to the file
fs.writeFileSync(filePath, content, 'utf8');

console.log('✅ Successfully updated Butte page!');
