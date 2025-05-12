#!/usr/bin/env python3

import os
import re
import glob
from bs4 import BeautifulSoup

# This script addresses additional styling inconsistencies found in the visual review
# It should be run after the main standardization script

town_dir = os.path.dirname(os.path.abspath(__file__))  # Current directory (montana-towns)

print("Starting visual style standardization of Montana town pages...\n")

# Process each town page
html_files = glob.glob(os.path.join(town_dir, "*.html"))

for file_path in html_files:
    filename = os.path.basename(file_path)
    
    # Skip index.html and this script if saved as .html
    if filename == "index.html" or filename == os.path.basename(__file__):
        continue
        
    town_slug = os.path.splitext(filename)[0]
    town_name = town_slug.capitalize().replace('-', ' ')
    
    print(f"Processing {filename}...")
    
    # Read the HTML file
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Load the content into BeautifulSoup for easier manipulation
    soup = BeautifulSoup(content, 'html.parser')
    
    # 1. Remove HR tags if present (standard is no HR tags)
    hr_tags = soup.find_all('hr')
    if hr_tags:
        print(f"  Removing {len(hr_tags)} HR tags from {filename}")
        for hr in hr_tags:
            hr.decompose()
    
    # 2. Check for Quick Facts section and add if missing
    content_section = soup.find('section', class_='content-section')
    if content_section:
        # Look for Quick Facts heading
        quick_facts = None
        for h3 in content_section.find_all('h3'):
            if 'Quick Facts' in h3.text:
                quick_facts = h3
                break
        
        # If no Quick Facts section, check if we need to transform paragraphs to list
        if not quick_facts:
            # Find main town heading
            town_heading = content_section.find('h2')
            if town_heading:
                # Check if there are paragraphs with 'Population:', 'County:', etc.
                info_paras = []
                current = town_heading.next_sibling
                while current and current.name != 'h3':
                    if current.name == 'p' and any(x in current.text for x in ['Population:', 'County:', 'Founded:', 'Elevation:', 'Known For:', 'Nearby Landmarks:', 'Fun Fact:']):
                        info_paras.append(current)
                    current = current.next_sibling
                
                if info_paras:
                    print(f"  Converting paragraph facts to bulleted list in {filename}")
                    # Create Quick Facts heading
                    quick_facts = soup.new_tag('h3')
                    quick_facts.string = 'Quick Facts'
                    info_paras[0].insert_before(quick_facts)
                    
                    # Create unordered list
                    ul = soup.new_tag('ul')
                    quick_facts.insert_after(ul)
                    
                    # Move content from paragraphs to list items
                    for p in info_paras:
                        li = soup.new_tag('li')
                        # Preserve the strong tag and content
                        strong = p.find('strong')
                        if strong:
                            new_strong = soup.new_tag('strong')
                            new_strong.string = strong.string
                            li.append(new_strong)
                            # Add the rest of the text
                            li.append(p.text.replace(strong.text, ''))
                        else:
                            li.string = p.text
                        ul.append(li)
                        p.decompose()
    
    # 3. Check for "Where to Stay" section and add if missing
    has_where_to_stay = False
    for h3 in soup.find_all('h3'):
        if 'Where to Stay' in h3.text or 'Lodging' in h3.text:
            has_where_to_stay = True
            break
    
    if not has_where_to_stay and content_section:
        print(f"  Adding 'Where to Stay' section to {filename}")
        # Find a good place to insert - before coming-soon div
        coming_soon = soup.find('div', id='coming-soon')
        if coming_soon and coming_soon.parent.name == 'main':
            # Create Where to Stay section
            where_to_stay_html = f'''
        <h3>Where to Stay in {town_name}</h3>
        <ul>
          <li><strong>Hotels:</strong> Find hotels in {town_name} on <a href="https://expedia.com/affiliates/hotel-search-{town_slug}.placeholder" target="_blank" rel="noopener">Expedia</a>.</li>
          <li><strong>Motels:</strong> Find motels in {town_name} on <a href="https://expedia.com/affiliates/hotel-search-{town_slug}.placeholder" target="_blank" rel="noopener">Expedia</a>.</li>
          <li><strong>Vacation Rentals:</strong> Find houses, apartments, and cabins for rent on <a href="https://vrbo.com/affiliates/search-{town_slug}-dateless.placeholder" target="_blank" rel="noopener">VRBO</a>.</li>
        </ul>
        <!-- End {town_name} content -->
'''
            # Insert before closing section tag
            section_close = content_section.find_all(text=re.compile('<!-- End .* content -->'))
            if section_close:
                for comment in section_close:
                    comment.replace_with(where_to_stay_html)
            else:
                # If no end comment, add before section end
                content_section.append(BeautifulSoup(where_to_stay_html, 'html.parser'))
    
    # Write the updated content back to the file
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(str(soup))
    
    print(f"  Completed style standardization for {filename}")

print("\nVisual style standardization complete!")
print("Please review all pages manually to ensure styling is consistent.")
print("For affiliate links marked as 'placeholder', you'll need to replace them with proper tracking URLs.")
