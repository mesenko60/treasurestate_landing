#!/usr/bin/env node

/**
 * Stamps the service worker with a unique version based on build timestamp + git SHA.
 * Run after `next build && next export` but before publishing the `out/` directory.
 *
 * Usage: node scripts/stamp-sw-version.js
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const SW_PATH = path.join(__dirname, '..', 'out', 'sw.js');

if (!fs.existsSync(SW_PATH)) {
  console.error('sw.js not found in out/ — is this running after export?');
  process.exit(1);
}

let gitHash = 'unknown';
try {
  gitHash = execSync('git rev-parse --short HEAD', { encoding: 'utf-8' }).trim();
} catch {
  // not a git repo or git not available
}

const version = `ts-pwa-${Date.now()}-${gitHash}`;

let sw = fs.readFileSync(SW_PATH, 'utf-8');
sw = sw.replace(/__SW_VERSION__/g, version);
fs.writeFileSync(SW_PATH, sw, 'utf-8');

console.log(`Stamped sw.js with version: ${version}`);
