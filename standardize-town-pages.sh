#!/bin/bash

# This script identifies and lists the town pages that need standardization
# It checks for common inconsistencies across the Montana town pages

echo "Analyzing Montana town pages for standardization..."
echo ""

# Directory containing town pages
TOWN_DIR="/Volumes/2TB SSD/BC/code/treasurestate_landing/montana-towns"

# Check CSS path references
echo "=== CSS Path References ==="
grep -l "href=\"../css/" "$TOWN_DIR"/*.html | wc -l | xargs echo "Pages using '../css/' (relative): "
grep -l "href=\"/css/" "$TOWN_DIR"/*.html | wc -l | xargs echo "Pages using '/css/' (root-relative): "
grep -l "href=\"css/" "$TOWN_DIR"/*.html | wc -l | xargs echo "Pages using 'css/' (incorrect): "
echo ""

# Check JS path references
echo "=== JavaScript Path References ==="
grep -l "src=\"../js/" "$TOWN_DIR"/*.html | wc -l | xargs echo "Pages using '../js/' (relative): "
grep -l "src=\"/js/" "$TOWN_DIR"/*.html | wc -l | xargs echo "Pages using '/js/' (root-relative): "
grep -l "src=\"js/" "$TOWN_DIR"/*.html | wc -l | xargs echo "Pages using 'js/' (incorrect): "
echo ""

# Check includes path references
echo "=== Includes Path References ==="
grep -l "includeHTML('site-menu', '../includes/" "$TOWN_DIR"/*.html | wc -l | xargs echo "Pages using '../includes/' (relative): "
grep -l "includeHTML('site-menu', '/includes/" "$TOWN_DIR"/*.html | wc -l | xargs echo "Pages using '/includes/' (root-relative): "
grep -l "includeHTML('site-menu', 'includes/" "$TOWN_DIR"/*.html | wc -l | xargs echo "Pages using 'includes/' (incorrect): "
echo ""

# Check for hr tags
echo "=== Section Separators ==="
grep -l "<hr>" "$TOWN_DIR"/*.html | wc -l | xargs echo "Pages using <hr> separators: "
grep -l "</section>" "$TOWN_DIR"/*.html | wc -l | xargs echo "Total town pages: "
echo ""

# Check hero image implementation
echo "=== Hero Image Handling ==="
grep -l "var img = new Image();" "$TOWN_DIR"/*.html | wc -l | xargs echo "Pages with dynamic image loading: "
grep -l "setHeroContent({" "$TOWN_DIR"/*.html | wc -l | xargs echo "Pages with direct setHeroContent calls: "
echo ""

# Check for Expedia and VRBO affiliate links
echo "=== Affiliate Links ==="
grep -l "expedia.com/affiliates" "$TOWN_DIR"/*.html | wc -l | xargs echo "Pages with Expedia affiliate links: "
grep -l "vrbo.com/affiliates" "$TOWN_DIR"/*.html | wc -l | xargs echo "Pages with VRBO affiliate links: "
echo ""

# Check for Expedia banner
echo "=== Expedia Affiliate Banner ==="
grep -l "eg-affiliate-banners" "$TOWN_DIR"/*.html | wc -l | xargs echo "Pages with Expedia banner markup: "
echo ""

# Count scripts that load the affiliate banners
echo "=== Duplicate Scripts ==="
for file in "$TOWN_DIR"/*.html; do
  count=$(grep -c "eg-affiliate-banners.js" "$file")
  if [ $count -gt 1 ]; then
    echo "$(basename $file) has $count affiliate script tags (duplicated)"
  fi
done

echo ""
echo "Analysis complete. Use this information to standardize all town pages."
echo "See montana-towns-checklist.md for the complete standardization guide."
