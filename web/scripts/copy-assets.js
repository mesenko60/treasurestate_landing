/* Copies assets from the legacy site into Next public/ before build */
const fs = require('fs');
const path = require('path');

function copyDir(src, dest) {
  if (!fs.existsSync(src)) return;
  if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, entry.name);
    const d = path.join(dest, entry.name);
    if (entry.isDirectory()) copyDir(s, d);
    else fs.copyFileSync(s, d);
  }
}

const repoRoot = path.resolve(__dirname, '..', '..');
const webRoot = path.resolve(__dirname, '..');
const publicDir = path.join(webRoot, 'public');

// Ensure public exists
if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true });

// Copy images/ into web/public/images
copyDir(path.join(repoRoot, 'images'), path.join(publicDir, 'images'));

// Copy css/ into web/public/css (for global styles referenced by _app)
copyDir(path.join(repoRoot, 'css'), path.join(publicDir, 'css'));

// Copy robots.txt and ads.txt and sitemap.xml
for (const file of ['robots.txt', 'ads.txt', 'sitemap.xml']) {
  const src = path.join(repoRoot, file);
  if (fs.existsSync(src)) fs.copyFileSync(src, path.join(publicDir, file));
}

// Copy Information/ static pages so legacy links keep working
copyDir(path.join(repoRoot, 'Information'), path.join(publicDir, 'Information'));

// Copy includes/ so legacy pages can include header/footer via ../includes/*.html
copyDir(path.join(repoRoot, 'includes'), path.join(publicDir, 'includes'));

// Copy js/ to root for legacy scripts; also mirror under Information/js for relative paths
copyDir(path.join(repoRoot, 'js'), path.join(publicDir, 'js'));
copyDir(path.join(repoRoot, 'js'), path.join(publicDir, 'Information', 'js'));

// Copy root _redirects if present
const redirectsSrc = path.join(repoRoot, '_redirects');
if (fs.existsSync(redirectsSrc)) {
  fs.copyFileSync(redirectsSrc, path.join(publicDir, '_redirects'));
}

// Copy specific root-level static HTML pages referenced by navigation
for (const page of ['explore-montana.html', '404.html']) {
  const src = path.join(repoRoot, page);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, path.join(publicDir, page));
  }
}

console.log('Assets copied to web/public');
