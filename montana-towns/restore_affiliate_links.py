#!/usr/bin/env python3

import os
import re
from bs4 import BeautifulSoup

# Define paths
town_dir = "/Volumes/2TB SSD/BC/code/treasurestate_landing/montana-towns"
backup_dir = "/Volumes/2TB SSD/BC/code/treasurestate_landing/montana-towns/backups_20250511_011858"

# Function to extract affiliate links from backup file
def extract_affiliate_links(town_slug):
    backup_file = os.path.join(backup_dir, f"{town_slug}.html")
    current_file = os.path.join(town_dir, f"{town_slug}.html")
    
    # If backup doesn't exist, return None
    if not os.path.exists(backup_file):
        return None, None
    
    # Load backup file
    with open(backup_file, 'r', encoding='utf-8') as f:
        backup_content = f.read()
    
    # Extract Expedia affiliate link from backup
    expedia_match = re.search(r'expedia\.com/affiliates/hotel-search-[^"]+', backup_content)
    expedia_link = expedia_match.group(0) if expedia_match else None
    
    # Extract VRBO affiliate link from backup
    vrbo_match = re.search(r'vrbo\.com/affiliates/search-[^"]+', backup_content)
    vrbo_link = vrbo_match.group(0) if vrbo_match else None
    
    # If the current file doesn't have these links, we need to check if similar towns have them
    # This is for towns that didn't have affiliate links before
    if not expedia_link or not vrbo_link:
        with open(current_file, 'r', encoding='utf-8') as f:
            current_content = f.read()
        
        # Check if current file has the links with placeholders
        has_placeholder = 'hotel-search-' + town_slug + '.placeholder' in current_content or 'search-' + town_slug + '-dateless.placeholder' in current_content
        
        if has_placeholder:
            print(f"  {town_slug}.html has placeholder links that need replacing")
    
    return expedia_link, vrbo_link

# Function to restore or update the affiliate links
def restore_affiliate_links():
    # List all HTML files in town directory
    town_files = [f[:-5] for f in os.listdir(town_dir) if f.endswith('.html') and f != 'index.html']
    
    # Store affiliate links from all backups
    affiliate_links = {}
    for town in town_files:
        expedia_link, vrbo_link = extract_affiliate_links(town)
        if expedia_link and vrbo_link:
            affiliate_links[town] = {
                'expedia': expedia_link,
                'vrbo': vrbo_link
            }
    
    print(f"Found affiliate links for {len(affiliate_links)} towns")
    
    # Store fallback links for towns without specific affiliate links
    fallback_links = None
    if 'bozeman' in affiliate_links:
        fallback_links = affiliate_links['bozeman']  # Use Bozeman as a fallback
    elif affiliate_links:
        fallback_links = next(iter(affiliate_links.values()))
    
    # Process each town file
    for town in town_files:
        current_file = os.path.join(town_dir, f"{town}.html")
        
        print(f"Processing {town}.html...")
        
        # Read the current file
        with open(current_file, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Check if file has placeholder links
        has_placeholder = f'hotel-search-{town}.placeholder' in content or f'search-{town}-dateless.placeholder' in content
        
        if has_placeholder:
            # Determine which links to use
            if town in affiliate_links:
                links = affiliate_links[town]
            elif fallback_links:
                # If we don't have specific links, use fallback but modify the town name
                expedia_base = re.sub(r'hotel-search-([^.]+)', f'hotel-search-{town}', fallback_links['expedia'])
                vrbo_base = re.sub(r'search-([^-]+)-dateless', f'search-{town}-dateless', fallback_links['vrbo'])
                
                # Keep the tracking parameters
                expedia_id = fallback_links['expedia'].split('.')[-1]
                vrbo_id = fallback_links['vrbo'].split('.')[-1]
                
                links = {
                    'expedia': f"{expedia_base.split('.')[0]}.{expedia_id}",
                    'vrbo': f"{vrbo_base.split('.')[0]}.{vrbo_id}"
                }
            else:
                print(f"  WARNING: No affiliate links found for {town}.html and no fallback available")
                continue
            
            # Replace placeholder links
            content = content.replace(f'expedia.com/affiliates/hotel-search-{town}.placeholder', links['expedia'])
            content = content.replace(f'vrbo.com/affiliates/search-{town}-dateless.placeholder', links['vrbo'])
            
            print(f"  Restored affiliate links for {town}.html")
            
            # Save the updated file
            with open(current_file, 'w', encoding='utf-8') as f:
                f.write(content)
        elif town in affiliate_links:
            print(f"  {town}.html already has proper affiliate links")
        else:
            print(f"  {town}.html does not need affiliate links updated")

# Main execution
if __name__ == "__main__":
    print("Restoring affiliate links from backup files...")
    restore_affiliate_links()
    print("\nAffiliate link restoration complete!")
