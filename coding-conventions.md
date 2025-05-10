# Treasure State Landing Codebase – Coding Conventions & Best Practices

## 1. Project Structure & Organization
- **Directories:**
  - Place all city/town data in `cities_towns_data/`.
  - Use `includes/` for reusable HTML sections (header, footer, banners, etc.).
  - Store all CSS in `css/`, and all JavaScript in `js/`.
  - Place images in the `images/` directory.
- **File naming:**
  - Use lowercase and hyphens for HTML filenames (e.g., `great-falls.html`).
  - Keep file and directory names descriptive and consistent.

## 2. Page Creation
- **Template:**
  - Use the provided town page template in `how-to-build-town-pages.md` for all new town/city pages.
  - Each page should have a unique `<head>` (meta tags, title, description, keywords) tailored to the specific town.
- **Includes:**
  - Always use the `includes/` directory for navigation, banners, coming soon, and footer sections.
  - Load these via the provided JavaScript snippet (see documentation) to ensure DRY code and easy updates.

## 3. Styling & Scripts
- **Centralize styles:**
  - Make style changes in `css/style.css` and `css/modern-style.css`—do not use inline styles unless absolutely necessary.
- **Centralize scripts:**
  - Place all custom JavaScript in `js/script.js` or other dedicated JS files.
  - Use unobtrusive JavaScript: keep scripts out of HTML where possible.

## 4. Data Consistency
- **Official data source:**
  - Always refer to `cities_towns_data/` for the official list of towns/cities.
  - When automating page creation, generate pages directly from these data files to avoid inconsistencies.

## 5. SEO & Analytics
- **Unique meta tags:**
  - Every page should have a unique title, description, and keywords relevant to the content.
- **Analytics:**
  - Include Google Analytics and AdSense/AdWords code as described in the template and documentation.
- **Sitemap & robots:**
  - Keep `sitemap.xml` and `robots.txt` up to date as you add or remove pages.

## 6. Maintenance & Updates
- **Edit includes for global changes:**
  - To update navigation, banners, or footers, edit the relevant file in `includes/`. All pages will reflect the change automatically.
- **Avoid duplication:**
  - Never copy-paste shared sections into individual pages; always use includes.
- **Keep code clean:**
  - Remove unused files and code.
  - Refactor files that grow too large (over 200–300 lines) into smaller, logical components.

## 7. Development & Deployment
- **Test locally:**
  - Open `index.html` and other pages in a browser to verify changes before deploying.
- **Environment awareness:**
  - Never include test or mock data in production or development environments—only in dedicated test scripts or files.
- **Version control:**
  - Commit changes with clear, descriptive messages.
  - Use `.gitignore` to exclude files that should not be versioned (e.g., local configs, build artifacts).

## 8. Documentation
- **Update docs:**
  - Keep `README.md` and `how-to-build-town-pages.md` up to date with any process, structure, or technology changes.
- **Comment code:**
  - Add comments to complex or non-obvious code sections, especially in JavaScript.

---

**Note:** The AI assistant will follow these conventions when reading, writing, or refactoring code in this project. Please update this document if project standards evolve.
