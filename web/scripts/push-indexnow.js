#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const https = require('https');

const INDEXNOW_KEY = process.env.INDEXNOW_KEY || '8448138c6bf54d81b18a30646bd7a68f';
const DOMAIN = 'treasurestate.com';
const SITEMAP_PATH = path.join(__dirname, '../out/sitemap.xml');
const CACHE_PATH = path.join(__dirname, '../.indexnow-cache.json');

// Load previously submitted URLs
let previousUrls = new Set();
if (fs.existsSync(CACHE_PATH)) {
  try {
    const cache = JSON.parse(fs.readFileSync(CACHE_PATH, 'utf8'));
    previousUrls = new Set(cache.urls || []);
    console.log(`Loaded ${previousUrls.size} previously submitted URLs from cache`);
  } catch (e) {
    console.log('Cache file invalid, starting fresh');
  }
}

// Parse sitemap.xml to extract URLs
if (!fs.existsSync(SITEMAP_PATH)) {
  console.error(`Sitemap not found at ${SITEMAP_PATH}`);
  console.log('Run "npm run build" first to generate sitemap');
  process.exit(1);
}

const sitemap = fs.readFileSync(SITEMAP_PATH, 'utf8');
const urlMatches = sitemap.match(/<loc>(.*?)<\/loc>/g) || [];
const allUrls = urlMatches.map(m => m.replace(/<\/?loc>/g, ''));

console.log(`Found ${allUrls.length} URLs in sitemap`);

// Filter to only new/changed URLs (or submit all with --force)
const forceAll = process.argv.includes('--force');
const urlsToSubmit = forceAll 
  ? allUrls 
  : allUrls.filter(url => !previousUrls.has(url));

if (urlsToSubmit.length === 0) {
  console.log('No new URLs to submit');
  process.exit(0);
}

console.log(`Submitting ${urlsToSubmit.length} ${forceAll ? '(forced)' : 'new'} URLs to IndexNow`);

// Submit to IndexNow API
const payload = JSON.stringify({
  host: DOMAIN,
  key: INDEXNOW_KEY,
  urlList: urlsToSubmit.slice(0, 10000)
});

const options = {
  hostname: 'api.indexnow.org',
  path: '/indexnow',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(payload)
  }
};

const req = https.request(options, (res) => {
  let body = '';
  res.on('data', chunk => body += chunk);
  res.on('end', () => {
    console.log(`IndexNow response: ${res.statusCode}`);
    
    if (res.statusCode === 200 || res.statusCode === 202) {
      console.log('URLs submitted successfully to Bing, Yahoo, DuckDuckGo, Yandex');
      
      // Update cache with all submitted URLs
      const newCache = {
        lastSubmit: new Date().toISOString(),
        urlCount: allUrls.length,
        urls: allUrls
      };
      fs.writeFileSync(CACHE_PATH, JSON.stringify(newCache, null, 2));
      console.log('Cache updated');
    } else {
      console.error(`Submission failed: ${body}`);
      process.exit(1);
    }
  });
});

req.on('error', (e) => {
  console.error(`Request error: ${e.message}`);
  process.exit(1);
});

req.write(payload);
req.end();
