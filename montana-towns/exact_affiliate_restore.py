#!/usr/bin/env python3

import os
import re
from bs4 import BeautifulSoup

# Define paths
town_dir = "/Volumes/2TB SSD/BC/code/treasurestate_landing/montana-towns"
backup_dir = "/Volumes/2TB SSD/BC/code/treasurestate_landing/montana-towns/backups_20250511_011858"

# Track results
results = {
    "fixed": [],
    "no_backup": [],
    "no_links_in_backup": [],
    "already_correct": []
}

# Process each town HTML file
for filename in os.listdir(town_dir):
    if not filename.endswith('.html') or filename == 'index.html':
        continue
        
    town_path = os.path.join(town_dir, filename)
    backup_path = os.path.join(backup_dir, filename)
    
    # Skip if backup doesn't exist
    if not os.path.exists(backup_path):
        print(f"No backup available for {filename}")
        results["no_backup"].append(filename)
        continue
    
    print(f"\nProcessing {filename}...")
    
    # Read current file content
    with open(town_path, 'r', encoding='utf-8') as f:
        current_content = f.read()
    
    # Read backup file content
    with open(backup_path, 'r', encoding='utf-8') as f:
        backup_content = f.read()
    
    # Parse both files with BeautifulSoup for better HTML handling
    current_soup = BeautifulSoup(current_content, 'html.parser')
    backup_soup = BeautifulSoup(backup_content, 'html.parser')
    
    # Extract all Expedia affiliate links from backup
    backup_expedia_links = []
    for a in backup_soup.find_all('a', href=re.compile(r'expedia\.com/affiliates')):
        backup_expedia_links.append(a['href'])
    
    # Extract all VRBO affiliate links from backup
    backup_vrbo_links = []
    for a in backup_soup.find_all('a', href=re.compile(r'vrbo\.com/affiliates')):
        backup_vrbo_links.append(a['href'])
    
    # If no affiliate links in backup, note it and continue
    if not backup_expedia_links and not backup_vrbo_links:
        print(f"  No affiliate links found in backup for {filename}")
        results["no_links_in_backup"].append(filename)
        continue
    
    # Check if current file has affiliate links that need fixing
    needs_fixing = False
    
    # Check for incorrect or abbreviated Expedia links
    current_expedia_links = []
    for a in current_soup.find_all('a', href=re.compile(r'expedia')):
        current_expedia_links.append(a['href'])
        if 'expedia.com/affiliates' not in a['href'] or 'placeholder' in a['href'] or len(a['href'].split('/')) < 3:
            needs_fixing = True
    
    # Check for incorrect or abbreviated VRBO links
    current_vrbo_links = []
    for a in current_soup.find_all('a', href=re.compile(r'vrbo')):
        current_vrbo_links.append(a['href'])
        if 'vrbo.com/affiliates' not in a['href'] or 'placeholder' in a['href'] or len(a['href'].split('/')) < 3:
            needs_fixing = True
    
    # If current file has all proper links and matches backup, skip
    if not needs_fixing and len(current_expedia_links) == len(backup_expedia_links) and len(current_vrbo_links) == len(backup_vrbo_links):
        print(f"  Affiliate links already correct in {filename}")
        results["already_correct"].append(filename)
        continue
    
    # Extract all link text and surrounding HTML from backup file for reuse
    hotels_motels_section = None
    vacation_rentals_section = None
    
    # Find the "Where to Stay" section in backup
    where_to_stay = None
    for h3 in backup_soup.find_all('h3'):
        if 'Where to Stay' in h3.text or 'Lodging' in h3.text:
            where_to_stay = h3
            break
    
    if where_to_stay:
        # Find the UL that contains the affiliate links
        ul = where_to_stay.find_next('ul')
        if ul:
            # Save the entire HTML of this section
            hotels_motels_section = str(ul)
    
    # If we couldn't find the section in backup but have links, we'll insert them manually
    if not hotels_motels_section and (backup_expedia_links or backup_vrbo_links):
        # Create a structured "Where to Stay" section based on the backup links
        town_name = filename[:-5].capitalize().replace('-', ' ')
        hotels_motels_section = f'''
        <ul>
          <li><strong>Hotels:</strong> Find hotels in {town_name} on <a href="{backup_expedia_links[0] if backup_expedia_links else '#'}" target="_blank" rel="noopener">Expedia</a>.</li>
          <li><strong>Motels:</strong> Find motels in {town_name} on <a href="{backup_expedia_links[0] if backup_expedia_links else '#'}" target="_blank" rel="noopener">Expedia</a>.</li>
          <li><strong>Vacation Rentals:</strong> Find houses, apartments, and cabins for rent on <a href="{backup_vrbo_links[0] if backup_vrbo_links else '#'}" target="_blank" rel="noopener">VRBO</a>.</li>
        </ul>
        '''
    
    # Now find the where to stay section in the current file
    current_where_to_stay = None
    for h3 in current_soup.find_all('h3'):
        if 'Where to Stay' in h3.text or 'Lodging' in h3.text:
            current_where_to_stay = h3
            break
    
    if current_where_to_stay:
        # Find the UL that follows the heading
        current_ul = current_where_to_stay.find_next('ul')
        if current_ul and hotels_motels_section:
            # Replace the current UL with the one from backup
            new_ul = BeautifulSoup(hotels_motels_section, 'html.parser')
            current_ul.replace_with(new_ul)
            print(f"  Replaced 'Where to Stay' section with backup version in {filename}")
            results["fixed"].append(filename)
        else:
            print(f"  WARNING: Could not find UL after 'Where to Stay' heading in {filename}")
    else:
        print(f"  WARNING: Could not find 'Where to Stay' section in {filename}")
        # TODO: In a real implementation, could add the section if missing
    
    # Write the updated content back to the file
    with open(town_path, 'w', encoding='utf-8') as f:
        f.write(str(current_soup))

# Print summary
print("\n======== SUMMARY ========")
print(f"Fixed affiliate links in {len(results['fixed'])} files: {', '.join(results['fixed'])}")
print(f"Already correct in {len(results['already_correct'])} files")
print(f"No backup available for {len(results['no_backup'])} files")
print(f"No affiliate links in backup for {len(results['no_links_in_backup'])} files")

print("\nComplete! Please manually check the files to ensure all affiliate links are correctly restored.")
