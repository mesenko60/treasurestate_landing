---
trigger: always_on
---

# AI Rules for Treasure State Landing Site

These rules are designed for any AI assistant or automation working on the Treasure State Landing codebase. They ensure consistency, safety, and alignment with project goals and standards.

## 1. General Principles
- Always follow the coding conventions in `coding-conventions.md`.
- Prefer simple, maintainable solutions.
- Do not make changes outside the scope of the current task.
- Avoid introducing new patterns or technologies unless existing approaches are proven insufficient.
- Always check for and iterate on existing code before creating new code.

## 2. Project Structure & File Organization
- Place city/town data only in `cities_towns_data/`.
- Place city/town content only in `cities_towns_content/`.
- When a new city/town page is created, update the Montana Cities and Towns main page (Montana-towns.html) and the towns index.html (montana-towns/index.html) to include a link to it.
- Follow the `montana-towns-checklist.md` file for a complete verification of town page standards. This checklist ensures all town pages maintain consistent structure, styling, and functionality.
- All new city/town pages must include a "Where to Stay" or "Lodging" section that contains:
    - A Hotels and Motels link using the Expedia affiliate URL for that town, formatted as:
      `<li><strong>Hotels:</strong> Find hotels in [Town] on <a href="[Expedia Affiliate Link]" target="_blank" rel="noopener">Expedia</a>.</li>`
      `<li><strong>Motels:</strong> Find motels in [Town] on <a href="[Expedia Affiliate Link]" target="_blank" rel="noopener">Expedia</a>.</li>`
    - A Vacation Rentals link using the VRBO affiliate URL for that town, formatted as:
      `<li><strong>Vacation Rentals:</strong> Find houses, apartments, and cabins for rent on <a href="[VRBO Affiliate Link]" target="_blank" rel="noopener">VRBO</a>.</li>`
    - All links must open in a new window (use `target="_blank" rel="noopener"`).
    - The links must be placed in the lodging/accommodations section of the page, following the established pattern in existing town pages (see Kalispell or Bozeman for reference).
- Be aware that navigation menu links (e.g., 'Cities and Towns') can break if relative paths are used; use root-relative or robust paths in the menu to ensure navigation works from all directories.
- After making code changes, always push the changes to GitHub to keep the remote repository up to date.
- Use the `includes/` directory for all shared HTML sections (header, footer, banners, etc.).
- Store CSS in `css/` and JavaScript in `js/`.
- Use lowercase, hyphenated filenames for HTML files.
- Avoid files growing beyond 300–500 lines; refactor as needed.

## 3. Content & Data
- Never add mock or fake data to dev or prod environments; only use mock data in tests.
- Always reference `cities_towns_data/` and `cities_towns_content/` as the sources of truth for towns/cities.
- Do not duplicate code or data; use includes and templates.

## 4. Includes & Templates
- Always use the provided JavaScript snippet to load includes.
- Never copy-paste shared sections directly into pages.
- Follow the template in `how-to-build-town-pages.md` for new town/city pages.
- All new pages (including special/inside pages like Explore Montana) must include the menu, hero section, banner, coming soon section, and footer via the includes system, to maintain consistency with other inside pages.
- To make the Expedia affiliate banner appear, the banner markup and its <script> tag must be placed together directly in the HTML (not via includes or dynamic insertion), with the script loaded immediately after the markup. Follow the exact pattern in city-town-template.html.

## 5. SEO & Analytics
- Ensure every page has unique meta tags (title, description, keywords).
- Include Google Analytics and AdSense/AdWords code as specified.
- Keep `sitemap.xml` and `robots.txt` updated with site changes.
- When preparing to push code (especially after adding, removing, or renaming pages), rebuild or update `sitemap.xml` to ensure all site URLs are current.
- Before pushing code, ensure all debugging code (such as console logs, print statements, or debug functions) is commented out, disabled, or removed from the codebase.

## 6. Safety & Environment
- Never overwrite the `.env` file without explicit user confirmation.
- Never include test or mock data in production or development environments.
- Do not touch files unrelated to the task at hand.
- Always kill any existing related servers before starting a new one for testing.

## 7. Maintenance & Documentation
- Update `README.md`, `how-to-build-town-pages.md`, and `coding-conventions.md` as standards or processes change.
- Add comments to complex or non-obvious code, especially in JavaScript.

## 8. Testing & Quality
- Write thorough tests for all major functionality.
- Test changes locally before deployment.
- Before pushing code, always run Puppeteer-based automated browser tests to verify that new or updated pages render and function as expected. Address any issues found before completing the push.
- Avoid code duplication in both logic and structure.
- Be aware of and respect different environments (dev, test, prod).

---

**Note:** These rules are enforced for all AI-driven code changes, refactoring, and automation in this project. Update this file as your standards evolve.
