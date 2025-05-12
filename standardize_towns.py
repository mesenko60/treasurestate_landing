#!/usr/bin/env python3

import os
import re
import shutil
from datetime import datetime
import sys
from bs4 import BeautifulSoup
import glob

# Create backup directory
timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
base_dir = "/Volumes/2TB SSD/BC/code/treasurestate_landing"
town_dir = os.path.join(base_dir, "montana-towns")
backup_dir = os.path.join(town_dir, f"backups_{timestamp}")

if not os.path.exists(backup_dir):
    os.makedirs(backup_dir)
    print(f"Created backup directory: {backup_dir}")

# Ensure we have BeautifulSoup available
try:
    from bs4 import BeautifulSoup
except ImportError:
    print("BeautifulSoup is required. Please install it using 'pip install beautifulsoup4'")
    print("You can run: pip3 install beautifulsoup4")
    sys.exit(1)

print("Starting standardization of Montana town pages...\n")

# Process each town page
html_files = glob.glob(os.path.join(town_dir, "*.html"))

for file_path in html_files:
    filename = os.path.basename(file_path)
    
    # Skip index.html
    if filename == "index.html":
        print("Skipping index.html")
        continue
        
    print(f"Processing {filename}...")
    
    # Create backup
    backup_path = os.path.join(backup_dir, filename)
    shutil.copy2(file_path, backup_path)
    
    # Read the HTML file
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Extract the town name and slug
    town_slug = os.path.splitext(filename)[0]
    town_name_match = re.search(r'<h2>(.*?), Montana</h2>', content)
    town_name = town_name_match.group(1) if town_name_match else town_slug.capitalize().replace('-', ' ')
    
    # 1. Fix path references - standardize to relative paths
    content = content.replace('href="/css/', 'href="../css/')
    content = content.replace('src="/js/', 'src="../js/')
    
    # Fix include paths
    content = re.sub(r'includeHTML\(\'([^\']+)\', \'/includes/',
                    r"includeHTML('\1', '../includes/", content)
    
    # 2. Fix hero image paths
    content = content.replace('image: "/images/', 'image: "../images/')
    content = re.sub(r'townImg = [\'"]?/images/',
                    r'townImg = "../images/', content)
    content = re.sub(r'defaultImg = [\'"]?/images/',
                    r'defaultImg = "../images/', content)
    
    # 3. Fix duplicate script tags for Expedia banner
    expedia_script_count = content.count('src="https://affiliates.expediagroup.com/products/banners/assets/eg-affiliate-banners.js"')
    if expedia_script_count > 1:
        print(f"  Removing duplicate Expedia banner scripts")
        
        # Keep only the one in the banner section
        content = re.sub(r'<script src="https://affiliates\.expediagroup\.com/products/banners/assets/eg-affiliate-banners\.js"></script>\s*</body>',
                         "</body>", content)
    
    # 4. Check for hero image dynamic loading approach
    if "var img = new Image();" not in content:
        print(f"  Adding dynamic image handling for {town_name}")
        
        # Find setHeroContent call and replace it with dynamic loading
        setHero_match = re.search(r'\s*setHeroContent\({[^}]+}\);\s*', content)
        
        if setHero_match:
            # Get subtitle from existing setHeroContent if it exists
            subtitle_match = re.search(r'subtitle: ['"](.*?)['"]', setHero_match.group(0))
            subtitle = subtitle_match.group(1) if subtitle_match else 'A Montana Community'
            
            # Create dynamic image handling block
            dynamic_block = f'''
      // Dynamically set hero image: use town-specific image if it exists, otherwise use the default hero-image.jpg
      (function() {{
        var img = new Image();
        var townSlug = '{town_slug}';
        var townName = '{town_name}';
        var townImg = '../images/towns/' + townSlug + '.jpg';
        var defaultImg = '../images/hero-image.jpg';
        img.onload = function() {{
          setHeroContent({{
            title: townName,
            subtitle: '{subtitle}',
            image: townImg,
            alt: townName + ' - Scenic View'
          }});
        }};
        img.onerror = function() {{
          setHeroContent({{
            title: townName,
            subtitle: '{subtitle}',
            image: defaultImg,
            alt: townName + ' - Scenic View'
          }});
        }};
        img.src = townImg;
      }})();'''
            
            # Replace direct setHeroContent with dynamic block
            content = content.replace(setHero_match.group(0), dynamic_block + '\n')
    
    # 5. Check for "Where to Stay" section
    if "Where to Stay" not in content and "Lodging" not in content:
        print(f"  WARNING: No 'Where to Stay' section found in {filename}")
    
    # 6. Check for Expedia and VRBO affiliate links
    if "expedia.com/affiliates" not in content:
        print(f"  WARNING: No Expedia affiliate links found in {filename}")
    
    if "vrbo.com/affiliates" not in content:
        print(f"  WARNING: No VRBO affiliate links found in {filename}")
    
    # Write the updated content back to the file
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"  Completed processing {filename}")

print("\nStandardization complete!")
print(f"Backups saved to: {backup_dir}")
print("Please review all pages manually to ensure everything looks correct.")
print("Use the montana-towns-checklist.md file for a complete verification.")
