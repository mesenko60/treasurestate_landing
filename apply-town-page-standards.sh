#!/bin/bash

# Script to apply standardization to all Montana town pages
# This will ensure consistent structure, paths, and functionality

TOWN_DIR="/Volumes/2TB SSD/BC/code/treasurestate_landing/montana-towns"
TEMPLATE_FILE="/Volumes/2TB SSD/BC/code/treasurestate_landing/city-town-template.html"

echo "Starting standardization of Montana town pages..."
echo ""

# Create a backup directory
BACKUP_DIR="$TOWN_DIR/backups_$(date +%Y%m%d_%H%M%S)"
mkdir -p "$BACKUP_DIR"
echo "Created backup directory: $BACKUP_DIR"

# Process each town page
for file in "$TOWN_DIR"/*.html; do
  # Skip the index.html file
  if [[ $(basename "$file") == "index.html" ]]; then
    echo "Skipping index.html"
    continue
  fi
  
  filename=$(basename "$file")
  echo "Processing $filename..."
  
  # Create a backup
  cp "$file" "$BACKUP_DIR/$filename"
  
  # 1. Fix path references - standardize to relative paths
  # Replace root-relative CSS paths with relative paths
  sed -i '' 's|href="/css/|href="../css/|g' "$file"
  
  # Replace root-relative JS paths with relative paths
  sed -i '' 's|src="/js/|src="../js/|g' "$file"
  
  # Replace root-relative include paths with relative paths
  sed -i '' 's|includeHTML(.\+, \+"/includes/|includeHTML\1, "../includes/|g' "$file"
  
  # 2. Handle hero image paths in the setHeroContent function
  sed -i '' 's|image: "/images/|image: "../images/|g' "$file"
  
  # 3. Fix image paths in the dynamic image loader
  sed -i '' 's|townImg = \+"/images/|townImg = "../images/|g' "$file"
  sed -i '' 's|defaultImg = \+"/images/|defaultImg = "../images/|g' "$file"
  
  # 4. Standardize hero image handling - ensure dynamic approach exists
  # This is complex and might need manual review after running the script
  if ! grep -q "var img = new Image();" "$file"; then
    # Extract town name and slug for later use
    town_name=$(grep -o '<h2>.*</h2>' "$file" | sed 's/<h2>\(.*\), Montana<\/h2>/\1/')
    town_slug=$(basename "$file" .html)
    
    echo "  Adding dynamic image handling for $town_name"
    # Find where setHeroContent is directly called
    LINE_NUM=$(grep -n "setHeroContent({" "$file" | cut -d: -f1)
    
    if [[ ! -z "$LINE_NUM" ]]; then
      # Create dynamic image handling block
      DYNAMIC_BLOCK="      // Dynamically set hero image: use town-specific image if it exists, otherwise use the default hero-image.jpg\n      (function() {\n        var img = new Image();\n        var townSlug = '$town_slug';\n        var townName = '$town_name';\n        var townImg = '../images/towns/' + townSlug + '.jpg';\n        var defaultImg = '../images/hero-image.jpg';\n        img.onload = function() {\n          setHeroContent({\n            title: townName,\n            subtitle: 'A Montana Community',\n            image: townImg,\n            alt: townName + ' - Scenic View'\n          });\n        };\n        img.onerror = function() {\n          setHeroContent({\n            title: townName,\n            subtitle: 'A Montana Community',\n            image: defaultImg,\n            alt: townName + ' - Scenic View'\n          });\n        };\n        img.src = townImg;\n      })();"
      
      # Replace direct setHeroContent with dynamic block
      sed -i '' "${LINE_NUM}s/.*setHeroContent.*/\n$DYNAMIC_BLOCK/" "$file"
    fi
  fi
  
  # 5. Fix duplicate script tags - remove duplicate Expedia banner script
  # Count occurrences of the script tag
  script_count=$(grep -c "src=\"https://affiliates.expediagroup.com/products/banners/assets/eg-affiliate-banners.js\"" "$file")
  
  if [ "$script_count" -gt 1 ]; then
    echo "  Removing duplicate Expedia banner scripts"
    # Keep only the one in the banner section
    sed -i '' '/class="eg-affiliate-banners-script" src="https:\/\/affiliates.expediagroup.com\/products\/banners\/assets\/eg-affiliate-banners.js"/!s/src="https:\/\/affiliates.expediagroup.com\/products\/banners\/assets\/eg-affiliate-banners.js"//g' "$file"
  fi
  
  # 6. Check for "Where to Stay" section with affiliate links
  if ! grep -q "Where to Stay" "$file"; then
    echo "  WARNING: No 'Where to Stay' section found in $filename"
  fi
  
  # 7. Check for Expedia and VRBO affiliate links
  if ! grep -q "expedia.com/affiliates" "$file"; then
    echo "  WARNING: No Expedia affiliate links found in $filename"
  fi
  
  if ! grep -q "vrbo.com/affiliates" "$file"; then
    echo "  WARNING: No VRBO affiliate links found in $filename"
  fi
  
  echo "  Completed processing $filename"
done

echo ""
echo "Standardization complete!"
echo "Backups saved to: $BACKUP_DIR"
echo "Please review all pages manually to ensure everything looks correct."
echo "Use the montana-towns-checklist.md file for a complete verification."
