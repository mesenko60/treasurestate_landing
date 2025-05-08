# How to Build Individual City and Town Pages

This document describes the process and best practices for creating a dedicated page for each city or town on the Treasure State website.

---

## 1. Page Structure Overview
Each town page should:
- Have its own unique `<head>` section with:
  - Title, meta description, and meta keywords tailored to the town.
  - Google Analytics code (and Google AdWords/AdSense code if required).
- Contain a unique hero section for the town (image, heading, subheading).
- Use shared includes for the navigation menu, banner/ad section, “Coming Soon” boxes, and footer. This ensures consistency and easy maintenance.

---

## 2. Directory and File Naming
- Place each town page in the project root or a dedicated directory (e.g., `towns/bozeman.html`).
- Use lowercase and hyphens for filenames (e.g., `bozeman.html`, `great-falls.html`).

---

## 2a. Cities and Towns Data Source
- The official list of all cities and towns is stored in the `cities_towns_data` directory in the project. This directory contains the data files (such as lists or details) for each city and town.
- If automating, read from the files in `cities_towns_data` to generate each page with the correct name, meta tags, and content.
- If building manually, refer to the files in `cities_towns_data` for the official list of towns and cities to ensure consistency.

---

## 3. Includes Setup
- Create an `includes/` directory at the project root with:
  - `header.html` (navigation/menu)
  - `banner.html` (ad/banner section)
  - `coming-soon.html` (the three “Coming Soon” boxes)
  - `footer.html` (footer)
- In each town page, use a `<div>` with a unique ID for each include, and load them with a small JavaScript snippet:

```html
<div id="site-menu"></div>
<div id="site-banner"></div>
<div id="coming-soon"></div>
<div id="site-footer"></div>

<script>
function includeHTML(id, file) {
  fetch(file)
    .then(response => response.text())
    .then(data => { document.getElementById(id).innerHTML = data; });
}
includeHTML('site-menu', 'includes/header.html');
includeHTML('site-banner', 'includes/banner.html');
includeHTML('coming-soon', 'includes/coming-soon.html');
includeHTML('site-footer', 'includes/footer.html');
</script>
```

---

## 4. Example Town Page Template
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Bozeman, Montana - Treasure State</title>
  <meta name="description" content="Discover Bozeman, Montana: attractions, history, and more.">
  <meta name="keywords" content="Bozeman, Montana, Treasure State, travel, tourism, Rocky Mountains">
  <!-- Google Analytics -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-NQ8F9RC7DE"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-NQ8F9RC7DE');
  </script>
  <!-- AdWords/AdSense if needed -->
  <script async src="https://pagead2.googlesyndication.com/pagead/js?client=ca-pub-8089329941656548" crossorigin="anonymous"></script>
  <link rel="stylesheet" href="css/style.css">
  <link rel="stylesheet" href="css/modern-style.css">
</head>
<body>
  <!-- Unique hero section for Bozeman -->
  <header class="hero-section">
    <img src="images/bozeman-hero.jpg" alt="Bozeman, Montana" class="hero-image">
    <div class="hero-text">
      <h1>Bozeman</h1>
      <p>The Heart of the Rockies</p>
    </div>
  </header>
  <!-- Includes for menu, banner, coming soon, footer -->
  <div id="site-menu"></div>
  <main>
    <!-- Town-specific content goes here -->
  </main>
  <div id="site-banner"></div>
  <div id="coming-soon"></div>
  <div id="site-footer"></div>
  <script>
    // JS include logic as above
  </script>
</body>
</html>
```

---

## 5. SEO and Analytics Best Practices
- **Meta tags:** Use unique title, description, and keywords for each town.
- **Google Analytics:** Include the GA code on every page.
- **AdWords/AdSense:** Include as required.

---

## 6. Automating Page Creation (Optional)
If you want to create pages for all towns efficiently:
- Prepare a data file (CSV, JSON, etc.) with town names and details.
- Use a script (Python, Node.js, etc.) to generate HTML files from a template, inserting the correct meta tags, hero image, and content for each town.
- This is optional, but highly recommended if you have dozens or hundreds of towns.

---

## 7. Maintenance
- To update navigation, banner, coming soon, or footer, simply edit the corresponding file in `includes/`.
- All pages will reflect the change automatically.

---

For questions or help with automation, contact the site maintainer or your developer.
