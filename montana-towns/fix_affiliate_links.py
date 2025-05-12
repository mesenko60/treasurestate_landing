#!/usr/bin/env python3

import os
import re
from bs4 import BeautifulSoup

# Define paths
town_dir = "/Volumes/2TB SSD/BC/code/treasurestate_landing/montana-towns"
backup_dir = "/Volumes/2TB SSD/BC/code/treasurestate_landing/montana-towns/backups_20250511_011858"

# Read known good affiliate link templates from Bozeman (our reference town)
bozeman_backup = os.path.join(backup_dir, "bozeman.html")
with open(bozeman_backup, 'r', encoding='utf-8') as f:
    bozeman_content = f.read()

# Extract the full Expedia affiliate link pattern
expedia_pattern = re.search(r'(https://expedia\.com/affiliates/hotel-search-[^.]+\.)(\w+)', bozeman_content)
if expedia_pattern:
    expedia_base = expedia_pattern.group(1)
    expedia_code = expedia_pattern.group(2)
    print(f"Found Expedia affiliate pattern: {expedia_base}TOWN_SLUG.{expedia_code}")
else:
    print("ERROR: Could not find Expedia affiliate pattern in Bozeman")
    exit(1)

# Extract the full VRBO affiliate link pattern
vrbo_pattern = re.search(r'(https://vrbo\.com/affiliates/search-[^-]+-dateless\.)(\w+)', bozeman_content)
if vrbo_pattern:
    vrbo_base = vrbo_pattern.group(1)
    vrbo_code = vrbo_pattern.group(2)
    print(f"Found VRBO affiliate pattern: {vrbo_base}TOWN_SLUG.{vrbo_code}")
else:
    print("ERROR: Could not find VRBO affiliate pattern in Bozeman")
    exit(1)

# Process each town HTML file
for filename in os.listdir(town_dir):
    if not filename.endswith('.html') or filename == 'index.html':
        continue
        
    town_slug = filename[:-5]  # Remove .html extension
    filepath = os.path.join(town_dir, filename)
    
    print(f"Processing {filename}...")
    
    # Read the file content
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Detect incorrect affiliate links
    needs_fixing = False
    
    # Check for abbreviated Expedia links
    if re.search(r'href="https://expedia\.\w+"', content):
        print(f"  Found abbreviated Expedia links in {filename}")
        needs_fixing = True
    
    # Check for abbreviated VRBO links
    if re.search(r'href="https://vrbo\.\w+"', content):
        print(f"  Found abbreviated VRBO links in {filename}")
        needs_fixing = True
    
    # Fix affiliate links if needed
    if needs_fixing:
        # Create proper Expedia affiliate link for this town
        expedia_link = f"{expedia_base}{town_slug}.{expedia_code}"
        
        # Create proper VRBO affiliate link for this town
        vrbo_link = f"{vrbo_base}{vrbo_code}"
        
        # Replace abbreviated Expedia links
        content = re.sub(
            r'href="https://expedia\.\w+"', 
            f'href="{expedia_link}"', 
            content
        )
        
        # Replace abbreviated VRBO links
        content = re.sub(
            r'href="https://vrbo\.\w+"', 
            f'href="{vrbo_link}"', 
            content
        )
        
        print(f"  Fixed affiliate links in {filename}")
        
        # Write the updated content back to the file
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        
        # Verify the fix
        if re.search(expedia_link.replace('.', '\\.'), content) and re.search(vrbo_link.replace('.', '\\.'), content):
            print(f"  Verified: Affiliate links properly fixed in {filename}")
        else:
            print(f"  WARNING: Verification failed for {filename}")
    else:
        print(f"  No abbreviated affiliate links found in {filename}")

print("\nAffiliate link fix complete!")
