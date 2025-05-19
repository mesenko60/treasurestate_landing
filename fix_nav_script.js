const fs = require('fs');
const path = require('path');

// Directories to process
const directories = [
  path.join(__dirname, 'montana-towns'),
  __dirname // Root directory for other HTML files
];

// Files to exclude
const excludeFiles = ['index.html'];

// The navigation script
const navScript = `
  <!-- Navigation Script -->
  <script>
    // Include HTML function
    function includeHTML(id, file) {
      fetch(file)
        .then(response => {
          if (!response.ok) throw new Error('Network response was not ok: ' + response.status);
          return response.text();
        })
        .then(data => {
          const element = document.getElementById(id);
          if (element) {
            element.innerHTML = data;
            console.log('Loaded:', file);
          } else {
            console.error('Element not found:', id);
          }
        })
        .catch(error => {
          console.error('Error loading include:', file, error);
        });
    }

    // Load all includes when the DOM is loaded
    document.addEventListener('DOMContentLoaded', function() {
      // Get the base path based on current page location
      const isTownPage = window.location.pathname.includes('/montana-towns/');
      const basePath = isTownPage ? '../' : './';
      
      console.log('Base path:', basePath);
      
      // Include navigation
      includeHTML('site-menu', basePath + 'includes/header.html');
      
      // Include other common elements
      if (document.getElementById('site-hero')) {
        includeHTML('site-hero', basePath + 'includes/hero-interior.html');
      }
      if (document.getElementById('coming-soon')) {
        includeHTML('coming-soon', basePath + 'includes/coming-soon.html');
      }
      if (document.getElementById('site-footer')) {
        includeHTML('site-footer', basePath + 'includes/footer.html');
      }
    });
  </script>`;

// Process all HTML files in the given directory
function processDirectory(directory) {
  if (!fs.existsSync(directory)) {
    console.log(`Directory not found: ${directory}`);
    return;
  }

  const files = fs.readdirSync(directory)
    .filter(file => file.endsWith('.html') && !excludeFiles.includes(file));

  console.log(`\nProcessing ${files.length} files in ${path.basename(directory)}...`);

  files.forEach(file => {
    const filePath = path.join(directory, file);
    try {
      let content = fs.readFileSync(filePath, 'utf8');
      
      // Remove any existing navigation scripts
      content = content.replace(
        /<!-- Navigation Script -->[\s\S]*?<\/script>/g,
        ''
      );
      
      // Ensure the site-menu div exists
      if (!content.includes('id="site-menu"')) {
        content = content.replace(
          '<body>',
          '<body>\n  <div id="site-menu"></div>'
        );
      }
      
      // Add the navigation script before the closing body tag
      content = content.replace(
        '<\/body>',
        `  ${navScript}\n</body>`
      );
      
      // Save the updated file
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Updated: ${file}`);
      
    } catch (error) {
      console.error(`❌ Error processing ${file}:`, error.message);
    }
  });
}

// Process all directories
directories.forEach(directory => {
  processDirectory(directory);
});

console.log('\nNavigation update complete!');
