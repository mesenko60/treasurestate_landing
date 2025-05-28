#!/bin/bash

# This script fixes the JavaScript error by removing the loadHeadScripts function call
# that's preventing menus from loading on town pages

# Find all HTML files in the montana-towns directory
find /Volumes/2TB\ SSD/BC/code/treasurestate_landing/montana-towns -name "*.html" | while read file; do
  # Skip backup files
  if [[ $file == *"backups"* ]]; then
    echo "Skipping backup file: $file"
    continue
  fi
  
  # Remove the loadHeadScripts line and comment line above it
  sed -i '' '/\/\/ Load JSON-LD and other head scripts/d' "$file"
  sed -i '' '/loadHeadScripts/d' "$file"
  echo "Fixed menu loading in: $file"
done

echo "\nAll town pages have been fixed. Menus should now load correctly."
