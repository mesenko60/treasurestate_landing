# Town Images

This directory contains hero images for town pages. Each town should have an image file named after the town's slug (e.g., 'billings.jpg').

If a town-specific image is not found, the page will fall back to 'default-town.jpg'.

## Adding Images

1. Place the source image in this directory. Name it using the town's slug (e.g., 'billings.jpg').
2. Recommended size: 1920×800 pixels. Format: JPG or PNG.
3. **Run WebP conversion** (after `copy-assets` copies to web/public): `cd web && npm run images:convert`
   This generates `{slug}-480.webp`, `{slug}-800.webp`, and `{slug}.webp` for responsive loading.
4. If the image requires attribution, add a credit (e.g., "Photo: Name / Source (CC BY 4.0)") to the town content.

## Default Image

The 'default-town.jpg' image is used as a fallback when a town-specific image is not available.
