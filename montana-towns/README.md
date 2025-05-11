# Montana Towns Standardization

This directory contains the individual town pages for the Treasure State website. All town pages should follow a consistent template structure based on the `city-town-template.html` file in the root directory.

## Maintaining Consistency

To ensure all town pages follow a standardized structure, styling, and functionality, we've created two resources:

1. **Montana Towns Checklist** (`/montana-towns-checklist.md` in the root directory)
2. **Standardization Script** (`standardize_town_pages.py` in this directory)

## How to Run the Standardization Script

The script will analyze all HTML files in this directory and fix common issues to ensure town pages are consistent with the standard template. It makes backups before changing any files.

### Prerequisites

The script requires Python 3 and the BeautifulSoup library. If you don't have BeautifulSoup installed, you can install it with:

```bash
pip3 install beautifulsoup4
```

### Running the Script

From the montana-towns directory:

```bash
cd /Volumes/2TB\ SSD/BC/code/treasurestate_landing/montana-towns
python3 standardize_town_pages.py
```

### What the Script Does

1. Creates a backup of all town pages before making changes
2. Standardizes path references to use relative paths (`../css/`, `../js/`, `../includes/`)
3. Fixes duplicate Expedia script tags
4. Adds dynamic hero image handling with fallbacks
5. Identifies pages missing required sections like "Where to Stay" and affiliate links

### After Running the Script

After running the script, you should:

1. Review each page to ensure everything looks correct
2. Check any pages that displayed warnings about missing sections
3. Test all pages in a browser to verify proper functionality
4. Use `montana-towns-checklist.md` to verify compliance with all standards

## Important Requirements for All Town Pages

- All town pages must include a "Where to Stay" or "Lodging" section with proper Expedia and VRBO affiliate links
- External links must open in a new window (`target="_blank" rel="noopener"`)
- Path references must use the correct relative format (`../css/`, `../js/`, `../includes/`)
- Hero image handling should use the dynamic approach with fallback logic
- Each page should follow the same information structure and heading hierarchy

For the complete standardization requirements, refer to the detailed checklist at `/montana-towns-checklist.md`.
