#!/usr/bin/env python3

import os
import re
from bs4 import BeautifulSoup

# Define paths
town_dir = "/Volumes/2TB SSD/BC/code/treasurestate_landing/montana-towns"

# Fix West Glacier duplicate sections
west_glacier_path = os.path.join(town_dir, "west-glacier.html")
print("Fixing West Glacier duplicate 'Where to Stay' sections...")

with open(west_glacier_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Parse with BeautifulSoup
soup = BeautifulSoup(content, 'html.parser')

# Find all Where to Stay sections
where_to_stay_sections = []
for heading in soup.find_all(['h3', 'h4']):
    if 'Where to Stay' in heading.text:
        where_to_stay_sections.append(heading)

# If there are multiple sections, keep only the most complete one
if len(where_to_stay_sections) > 1:
    print(f"  Found {len(where_to_stay_sections)} 'Where to Stay' sections")
    
    # Keep only the h3 version (standard heading level) and remove others
    for heading in where_to_stay_sections:
        if heading.name != 'h3':
            # Find the next UL after this heading and remove both
            next_ul = heading.find_next('ul')
            if next_ul:
                next_ul.decompose()
            heading.decompose()
            print("  Removed duplicate h4 'Where to Stay' section")
        else:
            print("  Kept h3 'Where to Stay' section")

# Write updated content back to file
with open(west_glacier_path, 'w', encoding='utf-8') as f:
    f.write(str(soup))

# Fix Alberton affiliate links
alberton_path = os.path.join(town_dir, "alberton.html")
print("\nFixing Alberton affiliate links...")

with open(alberton_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Create proper affiliate links for Alberton
# Remove 'bozeman.' from the URLs and keep just the tracking IDs
content = content.replace(
    'https://expedia.com/affiliates/hotel-search-bozeman.alberton.uM4434Y',
    'https://expedia.com/affiliates/hotel-search-alberton.uM4434Y'
)

content = content.replace(
    'https://vrbo.com/affiliates/search-bozeman-dateless.9Hobjwz',
    'https://vrbo.com/affiliates/search-alberton-dateless.9Hobjwz'
)

print("  Updated Alberton affiliate links to use proper URL structure")

# Write updated content back to file
with open(alberton_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("\nFinal cleanup complete! All town pages should now be properly standardized.")
