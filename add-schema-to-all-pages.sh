#!/bin/bash

# This script adds the JSON-LD schema to all HTML files in the website

# The JSON-LD script to add to all pages
JSON_LD_SCRIPT="  <script type=\"application/ld+json\">\n  {\n    \"@context\": \"https://schema.org\",\n    \"@type\": \"WebSite\",\n    \"name\": \"Montana - The Treasure State\",\n    \"alternateName\": [\"Treasure State\", \"TreasureState\"],\n    \"url\": \"https://treasurestate.com/\"\n  }\n  </script>"

# Process all HTML files
find /Volumes/2TB\ SSD/BC/code/treasurestate_landing -name "*.html" | while read file; do
  # Skip files in backups directories
  if [[ $file == *"backups"* ]]; then
    echo "Skipping backup file: $file"
    continue
  fi
  
  # Check if the file already has the JSON-LD script
  if grep -q "@type.*WebSite" "$file"; then
    echo "Schema already exists in: $file"
  else
    # Add the script before the closing head tag
    sed -i '' "s|</head>|$JSON_LD_SCRIPT\n</head>|" "$file"
    echo "Added schema to: $file"
  fi
done

echo "\nJSON-LD schema has been added to all HTML files."
echo "Schema used: \"Montana - The Treasure State\" with alternates [\"Treasure State\", \"TreasureState\"]"
