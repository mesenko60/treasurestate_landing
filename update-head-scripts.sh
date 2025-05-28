#!/bin/bash

# This script updates all HTML files to include the head-scripts.html for JSON-LD schema

# Find all HTML files in the montana-towns directory
find ./montana-towns -name "*.html" | while read file; do
  # Add the loadHeadScripts call to each file
  sed -i '' 's/const basePath = isTownPage ? \.\.\/\' : \'\.\/'\;/const basePath = isTownPage ? \.\.\/\' : \'\.\/'\;\n      \/\/ Load JSON-LD and other head scripts\n      loadHeadScripts(basePath + \'includes\/head-scripts\.html\');\n      \/\/ Load body includes/g' "$file"
  echo "Updated $file"
done

# Update the main index and other root HTML files
find . -maxdepth 1 -name "*.html" | while read file; do
  # Add the loadHeadScripts call to each file
  sed -i '' 's/const basePath = isTownPage ? \.\.\/\' : \'\.\/'\;/const basePath = isTownPage ? \.\.\/\' : \'\.\/'\;\n      \/\/ Load JSON-LD and other head scripts\n      loadHeadScripts(basePath + \'includes\/head-scripts\.html\');\n      \/\/ Load body includes/g' "$file"
  echo "Updated $file"
done

# Check if any files in the Information directory need updating
find ./Information -name "*.html" | while read file; do
  # Add the loadHeadScripts call to each file
  sed -i '' 's/const basePath = isTownPage ? \.\.\/\' : \'\.\/'\;/const basePath = isTownPage ? \.\.\/\' : \'\.\/'\;\n      \/\/ Load JSON-LD and other head scripts\n      loadHeadScripts(basePath + \'includes\/head-scripts\.html\');\n      \/\/ Load body includes/g' "$file"
  echo "Updated $file"
done

echo "All files updated with JSON-LD schema script"
