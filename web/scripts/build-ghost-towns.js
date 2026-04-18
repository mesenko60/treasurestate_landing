#!/usr/bin/env node
/**
 * Merge ghost-towns-curated.json with GNIS snapshots (offline):
 *   web/data/ghost-towns-all.json       — PPLQ (hub grey pins)
 *   web/data/ghost-towns-ppl-pplq.json  — PPL + PPLQ (detail coords)
 *   web/data/ghost-towns-cmty.json      — cemeteries
 *
 * Writes:
 *   web/data/ghost-towns-detail.json
 *   web/data/cemeteries-near-ghost-towns.json
 *
 * If NEXT_PUBLIC_SUPABASE_URL + NEXT_PUBLIC_SUPABASE_ANON_KEY are set,
 * refreshes ghost-towns-all.json and ghost-towns-cmty.json from Supabase (optional).
 *
 * Usage: node web/scripts/build-ghost-towns.js
 */
'use strict';

const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });
if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  require('dotenv').config({ path: path.join(__dirname, '..', '..', '.env') });
}

const { MANUAL_COORDS_BY_SLUG } = require('./ghost-towns-meta.cjs');

const webDir = path.join(__dirname, '..');
const dataDir = path.join(webDir, 'data');
const curatedPath = path.join(dataDir, 'ghost-towns-curated.json');
const allPath = path.join(dataDir, 'ghost-towns-all.json');
const pplPath = path.join(dataDir, 'ghost-towns-ppl-pplq.json');
const cmtyPath = path.join(dataDir, 'ghost-towns-cmty.json');
const markersPath = path.join(dataDir, 'historic-markers-curated.json');
const detailOut = path.join(dataDir, 'ghost-towns-detail.json');
const cemOut = path.join(dataDir, 'cemeteries-near-ghost-towns.json');
const contentDir = path.join(webDir, 'content', 'ghost-towns');

function excerptFromGhostMarkdown(raw) {
  let s = raw;
  s = s.replace(/^\s*#\s[^\n]+\r?\n?/, '');
  s = s.replace(/^##\s+[^\n]*\r?\n?/, '');
  const beforeNextH2 = s.split(/\n##\s/)[0].trim();
  let plain = beforeNextH2
    .replace(/###?\s+[^\n]*/g, '')
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/\r?\n+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  if (!plain) return '';
  const max = 200;
  if (plain.length <= max) return plain;
  const cut = plain.slice(0, max);
  const lastSpace = cut.lastIndexOf(' ');
  return (lastSpace > 60 ? cut.slice(0, lastSpace) : cut).trim() + '…';
}

function haversineMiles(lat1, lng1, lat2, lng2) {
  const R = 3958.8;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function normGnisName(name) {
  return name
    .replace(/\s*\(historical\)\s*$/i, '')
    .trim()
    .toLowerCase();
}

function slugTokens(slug) {
  return slug.split('-').filter(Boolean);
}

function excludeNoise(nameNorm, slug) {
  if (/(^|\s)(creek|river|lake|coulee|ridge|gulch mine|windmill)\b/.test(nameNorm)) {
    if (!slug.includes('gulch') && !slug.includes('lake')) return true;
  }
  return false;
}

function scoreRow(slug, displayName, row, preferFips) {
  const nameNorm = normGnisName(row.name);
  if (excludeNoise(nameNorm, slug)) return -1;
  const tokens = slugTokens(slug);
  const joined = tokens.join(' ');
  const disp = (displayName || '').toLowerCase();
  let s = 0;
  if (nameNorm === disp) s += 120;
  else if (nameNorm === joined) s += 115;
  else if (nameNorm === `${joined} city`) s += 110;
  else if (nameNorm.startsWith(joined + ' ')) s += 95;
  else if (nameNorm.includes(joined)) s += 70;
  else {
    const words = new Set(nameNorm.split(/\s+/));
    let hit = 0;
    for (const t of tokens) if (words.has(t)) hit++;
    s += hit * 22;
  }
  if (row.countyFips === preferFips) s += 45;
  if (row.featureType === 'PPLQ') s += 8;
  if (row.featureType === 'PPL') s += 5;
  return s;
}

function pickBestRow(slug, displayName, preferFips, pool) {
  let best = null;
  let bestS = -1;
  for (const row of pool) {
    const sc = scoreRow(slug, displayName, row, preferFips);
    if (sc > bestS) {
      bestS = sc;
      best = row;
    }
  }
  if (bestS < 38) return null;
  return best;
}

async function maybeRefreshFromSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return;
  try {
    const { createClient } = require('@supabase/supabase-js');
    const supabase = createClient(url, key);
    const pageSize = 1000;
    const fetchAll = async (type) => {
      const out = [];
      let from = 0;
      while (true) {
        const { data, error } = await supabase
          .from('montana_gnis_features')
          .select('gnis_id,name,feature_type,county_fips,latitude,longitude')
          .eq('feature_type', type)
          .range(from, from + pageSize - 1);
        if (error) throw error;
        if (!data || data.length === 0) break;
        out.push(...data);
        if (data.length < pageSize) break;
        from += pageSize;
      }
      return out;
    };
    const pplq = await fetchAll('PPLQ');
    fs.writeFileSync(
      allPath,
      JSON.stringify(
        pplq.map((r) => ({
          gnisId: r.gnis_id,
          name: r.name,
          countyFips: r.county_fips,
          lat: r.latitude,
          lng: r.longitude,
        })),
      ),
    );
    const cmtyRows = await fetchAll('CMTY');
    fs.writeFileSync(
      cmtyPath,
      JSON.stringify(
        cmtyRows.map((r) => ({
          gnisId: r.gnis_id,
          name: r.name,
          countyFips: r.county_fips,
          lat: r.latitude,
          lng: r.longitude,
        })),
      ),
    );
    console.log('Refreshed ghost-towns-all.json and ghost-towns-cmty.json from Supabase.');
  } catch (e) {
    console.warn('Supabase refresh skipped:', e.message || e);
  }
}

function mainSync() {
  if (!fs.existsSync(curatedPath)) {
    console.error('Missing', curatedPath, '— run import-ghost-towns.js first.');
    process.exit(1);
  }
  if (!fs.existsSync(pplPath)) {
    console.error('Missing', pplPath);
    process.exit(1);
  }

  const curated = JSON.parse(fs.readFileSync(curatedPath, 'utf8'));
  const pplPool = JSON.parse(fs.readFileSync(pplPath, 'utf8'));
  const cmty = fs.existsSync(cmtyPath) ? JSON.parse(fs.readFileSync(cmtyPath, 'utf8')) : [];
  const markerSlugs = new Set();
  if (fs.existsSync(markersPath)) {
    const markers = JSON.parse(fs.readFileSync(markersPath, 'utf8'));
    for (const m of markers) markerSlugs.add(m.slug);
  }

  const details = [];
  const cemNear = {};

  for (const c of curated) {
    const preferFips = c.countyFips || null;
    const countyPool = preferFips ? pplPool.filter((r) => r.countyFips === preferFips) : pplPool;
    let row = pickBestRow(c.slug, c.name, preferFips, countyPool);
    if (!row) row = pickBestRow(c.slug, c.name, preferFips, pplPool);

    let lat = row ? row.lat : null;
    let lng = row ? row.lng : null;
    let gnisId = row ? row.gnisId : null;
    let matchedGnisName = row ? row.name : null;
    let featureType = row ? row.featureType : null;
    let matchNote = !row ? 'no_local_gnis_match' : null;

    const manual = MANUAL_COORDS_BY_SLUG[c.slug];
    if (manual) {
      lat = manual.lat;
      lng = manual.lng;
      if (manual.gnisId != null) gnisId = manual.gnisId;
      if (manual.gnisId == null) {
        matchedGnisName = 'Approximate coordinates (GNIS gap)';
        featureType = 'manual';
      }
      matchNote = null;
    }

    const hasMarkerSlug = markerSlugs.has(c.slug);

    let excerpt = '';
    const mdPath = path.join(contentDir, `${c.slug}.md`);
    if (fs.existsSync(mdPath)) {
      excerpt = excerptFromGhostMarkdown(fs.readFileSync(mdPath, 'utf8'));
    }

    details.push({
      slug: c.slug,
      name: c.name,
      countyName: c.countyName,
      countyFips: c.countyFips,
      countyLabel: c.countyLabel,
      region: c.region,
      status: c.status,
      nearestLivingTownSlug: c.nearestLivingTownSlug,
      gnisId,
      matchedGnisName,
      featureType,
      lat,
      lng,
      hasMarkerSlug,
      matchNote,
      excerpt,
    });

    if (lat != null && lng != null && cmty.length) {
      const near = [];
      for (const t of cmty) {
        const mi = haversineMiles(lat, lng, t.lat, t.lng);
        if (mi <= 10) {
          near.push({
            name: t.name,
            miles: Math.round(mi * 10) / 10,
            lat: t.lat,
            lng: t.lng,
            gnisId: t.gnisId,
          });
        }
      }
      near.sort((a, b) => a.miles - b.miles);
      cemNear[c.slug] = near.slice(0, 12);
    } else {
      cemNear[c.slug] = [];
    }
  }

  fs.writeFileSync(detailOut, JSON.stringify(details, null, 2), 'utf8');
  fs.writeFileSync(cemOut, JSON.stringify(cemNear, null, 2), 'utf8');

  const misses = details.filter((d) => d.matchNote);
  if (misses.length) {
    console.warn('GNIS match misses (coords unset):', misses.map((m) => m.slug).join(', '));
  }
  console.log(`Wrote ${detailOut} (${details.length} rows)`);
  console.log(`Wrote ${cemOut}`);
}

(async () => {
  await maybeRefreshFromSupabase();
  mainSync();
})();
