# Montana Town Pages Standardization Checklist

This checklist ensures all Montana town pages follow a consistent structure, styling, and functionality. Use this document when creating or updating town pages.

## File Structure and Naming

- [ ] File is saved in the `montana-towns/` directory
- [ ] Filename is the town name in lowercase with hyphens replacing spaces (e.g., `west-glacier.html`)

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

## Affiliate Links

- [ ] Expedia affiliate banner is present in the banner section
- [ ] Hotels/Motels link with proper tracking URL
- [ ] Vacation Rentals link with proper tracking URL
- [ ] All external links have `target="_blank" rel="noopener"` attributes

---

Use this checklist when creating new town pages or updating existing ones to ensure consistency across the Montana towns section of the Treasure State website.
