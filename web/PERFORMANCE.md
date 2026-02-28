# Performance & Core Web Vitals

## Audit Summary (Feb 2026)

Lighthouse performance audit on home page (localhost):
- **Performance score:** 64
- **LCP:** 24.4s (local; production/CDN will be faster)
- **CLS:** 0.01 (good)
- **Key opportunities:**
  - **Modern image formats:** hero-image.jpg (~1.5MB) could save ~3MB as WebP
  - **Render-blocking resources:** ~220ms savings from deferring non-critical CSS
  - **Unused JavaScript:** ~248 KiB in bundles

## Implemented

- Hero image preload on home page (`<link rel="preload" as="image">`) to improve LCP
- Next.js Image component with `priority` on Hero for above-the-fold images

## Recommendations

1. **Convert hero-image.jpg to WebP** — Add a WebP version and use `<picture>` or Next.js image config
2. **Optimize hero dimensions** — Serve appropriately sized images (e.g. 1200px width for hero)
3. **Defer non-critical CSS** — Load modern-style.css async or inline critical CSS
4. **Review AdSense impact** — Third-party scripts can affect LCP; consider lazy-loading below fold
