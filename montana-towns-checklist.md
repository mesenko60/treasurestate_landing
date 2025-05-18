# Montana Town Page Creation Checklist

This checklist ensures all Montana town pages are created consistently and thoroughly. Use this document when creating new town pages or updating existing ones.

## 1. Content Preparation
- [ ] Confirm the new town’s markdown content exists in `cities_towns_content/`.
- [ ] Review the content for all required sections (Quick Facts, Notable People, Top Things to Do, Local Industry, History & Heritage, Seasonal Activities, Getting There, Where to Stay).

## 2. Page Creation
- [ ] Create a new file in `montana-towns/` named with lowercase, hyphenated format (e.g., `whitefish.html`).
- [ ] Use the structure from `city-town-template.html` and reference Kalispell/Bozeman for section order and formatting.
- [ ] Add unique meta tags: title, description, keywords.
- [ ] Include the following shared sections using the JS snippet:
  - Header (`includes/header.html`)
  - Hero (`includes/hero-interior.html`)
  - Banner (Expedia affiliate banner and script, placed directly in the page)
  - Coming Soon (`includes/coming-soon.html`)
  - Footer (`includes/footer.html`)

## 3. Content Population
- [ ] Populate all sections from the markdown content, following the template’s order.
- [ ] Ensure all facts, history, and local details are accurate and up to date.
- [ ] Add a unique “Where to Stay” section:
  - [ ] Add **Hotels** and **Motels** links using the provided Expedia affiliate URL for the town.
  - [ ] Add **Vacation Rentals** link using the provided VRBO affiliate URL for the town.
  - [ ] All affiliate links must open in a new tab and use `rel="noopener"`.
## HTML Structure

- [ ] DOCTYPE and HTML5 structure is present
- [ ] Language attribute set to English: `<html lang="en">`

## Head Section

- [ ] Character encoding and viewport tags are present
- [ ] Google Adsense account meta tag is included
- [ ] Title follows format: `<Town Name>, Montana - Treasure State` 
- [ ] Meta description is town-specific and includes key attractions
- [ ] CSS files are linked with correct relative paths:
  - [ ] `<link rel="stylesheet" href="../css/style.css">`
  - [ ] `<link rel="stylesheet" href="../css/modern-style.css">`
- [ ] Google Fonts are properly linked
- [ ] Google Analytics script is present and configured

## Body Structure

- [ ] Site menu container: `<div id="site-menu"></div>`
- [ ] Site hero container: `<div id="site-hero"></div>`
- [ ] Main content section
- [ ] Affiliate banner section with proper Expedia markup
- [ ] Coming soon section: `<div id="coming-soon"></div>`
- [ ] Site footer container: `<div id="site-footer"></div>`

## Town Content

- [ ] Town name as main heading: `<h2>[Town Name], Montana</h2>`
- [ ] Quick Facts section with:
  - [ ] Population
  - [ ] County
  - [ ] Founded/Established date
  - [ ] Elevation
  - [ ] Known For
  - [ ] Nearby Landmarks
  - [ ] Fun Fact
- [ ] Additional sections (using `<h3>` for subheadings):
  - [ ] Top Things to Do
  - [ ] Local Industry & Economy
  - [ ] History & Heritage (if applicable)
  - [ ] Notable People & Pop Culture (if applicable)
  - [ ] Seasonal Activities & Local Events
  - [ ] Getting There & Nearby Destinations
  - [ ] Where to Stay section with:
    - [ ] Hotels/Motels link to Expedia with proper affiliate URL
    - [ ] Vacation Rentals link to VRBO with proper affiliate URL
    - [ ] All external links open in new window (`target="_blank" rel="noopener"`)

## JavaScript and Includes

- [ ] Script tag for site functionality: `<script src="../js/script.js"></script>`
- [ ] Include HTML function is present and consistent
- [ ] Proper include paths with relative references:
  - [ ] `includeHTML('site-menu', '../includes/header.html');`
  - [ ] `includeHTML('site-hero', '../includes/hero-interior.html');`
  - [ ] `includeHTML('coming-soon', '../includes/coming-soon.html');`
  - [ ] `includeHTML('site-footer', '../includes/footer.html');`
- [ ] Dynamic hero image handling with fallback logic is present
- [ ] Expedia affiliate script is correctly placed

## Styling Consistency

- [ ] No inline styles
- [ ] Section separators are consistent (either all use `<hr>` or none do)
- [ ] Heading hierarchy is properly maintained
- [ ] List formatting is consistent (using `<ul>` and `<li>` tags for lists)

## SEO Considerations

- [ ] Town name appears in title tag
- [ ] Description meta tag is present and descriptive
- [ ] Proper heading hierarchy (h2, h3)
- [ ] Image alt text includes town name
- [ ] Add a new entry to sitemap.xml for the town page.
- [ ] Update `<lastmod>` in sitemap.xml to today's date for all `<url>` entries. **Note: This must be done every time the sitemap is changed or a new town is added.**

## Affiliate Links

- [ ] Expedia affiliate banner is present in the banner section
- [ ] Hotels/Motels link with proper tracking URL
- [ ] Vacation Rentals link with proper tracking URL
- [ ] All external links have `target="_blank" rel="noopener"` attributes

---

Use this checklist when creating new town pages or updating existing ones to ensure consistency across the Montana towns section of the Treasure State website.
