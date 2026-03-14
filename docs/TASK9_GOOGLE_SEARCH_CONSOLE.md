# Task 9: Google Search Console — Sitemap & Indexing (Manual)

**Status:** Manual steps required — must be done by a human with GSC access.

## Prerequisites

- Google Search Console access for `treasurestate.com` (or the property URL)
- Site must be live and deployed

## Step 1: Submit Sitemap

1. Go to [Google Search Console](https://search.google.com/search-console)
2. Select the property: `https://treasurestate.com` (or `https://www.treasurestate.com` if that's your canonical)
3. In the left sidebar, click **Sitemaps**
4. In "Add a new sitemap", enter: `sitemap.xml`
5. Click **Submit**

The sitemap URL will be: `https://treasurestate.com/sitemap.xml`

**Note:** The sitemap is generated at build time in `web/out/sitemap.xml` and includes all lodging pages, town pages, guides, and other routes.

## Step 2: Request Indexing for Priority Lodging Pages

Request indexing for these high-value lodging pages to speed up discovery:

1. In GSC left sidebar, click **URL Inspection**
2. For each URL below, paste it, press Enter, then click **Request Indexing** (if available):

| URL |
|-----|
| https://treasurestate.com/lodging/bozeman/ |
| https://treasurestate.com/lodging/missoula/ |
| https://treasurestate.com/lodging/whitefish/ |
| https://treasurestate.com/lodging/billings/ |
| https://treasurestate.com/lodging/helena/ |

**Note:** GSC may limit how many indexing requests you can submit per day. If "Request Indexing" is grayed out, the URL may already be in the queue or you've hit the daily limit — try again later.

## Verification

- After submitting the sitemap, check the Sitemaps report in a few days to confirm URLs were discovered
- Use URL Inspection to verify individual pages are indexed after requesting indexing
