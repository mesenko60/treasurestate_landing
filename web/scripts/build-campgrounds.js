#!/usr/bin/env node
/**
 * Build web/data/campgrounds.json from Supabase `places` (Montana bounds).
 * Includes Google types Campground, RV park, and Holiday park (KOAs / resorts).
 *
 * Prereq: web/.env.local with NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY
 *
 * Usage:  node web/scripts/build-campgrounds.js
 * After:  node web/scripts/build-corridors.js   (corridor POIs embed campgrounds.json)
 */

const fs = require('fs');
const path = require('path');

require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });

const { createClient } = require('@supabase/supabase-js');

const MONTANA = {
  minLat: 44.0,
  maxLat: 49.0,
  minLng: -116.5,
  maxLng: -104.0,
};

/** Matches trip planner / POI_LAYER outdoor camping layers */
const PLACE_TYPES = ['Campground', 'RV park', 'Holiday park'];

const PAGE = 1000;

function slugify(name) {
  return name
    .toLowerCase()
    .replace(/['']/g, '')
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
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

function categorize(row) {
  const name = (row.name || '').toLowerCase();
  const address = `${row.address || ''} ${row.city || ''}`.toLowerCase();
  const type = (row.type || '').toLowerCase();

  if (name.includes('koa')) return 'koa';
  if (type === 'rv park') return 'rv';

  if (name.includes('state') || address.includes('state p') || address.includes('state park')) {
    return 'state';
  }
  const stateKeywords = [
    'wayfarers',
    'big arm',
    'west shore',
    'lewis & clark caverns',
    'cooney reservoir',
    'missouri headwaters',
  ];
  if (stateKeywords.some((k) => name.includes(k))) return 'state';

  const publicKeywords = ['national forest', 'blm', 'forest service', 'holter dam'];
  if (publicKeywords.some((k) => name.includes(k) || address.includes(k))) return 'public';

  if (type === 'holiday park') return 'private';

  return 'private';
}

function formatAddress(row) {
  const line1 = (row.address || '').trim();
  const cityState = [row.city, row.state].filter(Boolean).join(', ');
  const zip = (row.zipcode || '').trim();
  const parts = [];
  if (line1) parts.push(line1);
  if (cityState) parts.push(cityState + (zip ? ` ${zip}` : ''));
  else if (zip) parts.push(zip);
  return parts.length ? parts.join(', ') : null;
}

function formatPhone(phone) {
  if (phone == null || phone === '') return null;
  const s = String(phone).trim();
  return s || null;
}

async function fetchCampgroundRows(supabase) {
  const rows = [];
  let from = 0;

  for (;;) {
    const { data, error } = await supabase
      .from('places')
      .select(
        'place_id, name, address, city, state, zipcode, latitude, longitude, type, category, rating, reviews, phone, website',
      )
      .in('type', PLACE_TYPES)
      .not('latitude', 'is', null)
      .not('longitude', 'is', null)
      .not('name', 'is', null)
      .gte('latitude', MONTANA.minLat)
      .lte('latitude', MONTANA.maxLat)
      .gte('longitude', MONTANA.minLng)
      .lte('longitude', MONTANA.maxLng)
      .range(from, from + PAGE - 1);

    if (error) throw error;
    if (!data || data.length === 0) break;
    rows.push(...data);
    if (data.length < PAGE) break;
    from += PAGE;
  }

  return rows;
}

function main() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    console.error(
      'Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY in web/.env.local',
    );
    process.exit(1);
  }

  const supabase = createClient(url, key);

  return (async () => {
    const rawRows = await fetchCampgroundRows(supabase);
    const seenPlace = new Set();
    const deduped = [];
    for (const row of rawRows) {
      const pid = row.place_id || `${row.latitude}|${row.longitude}|${row.name}`;
      if (seenPlace.has(pid)) continue;
      seenPlace.add(pid);
      deduped.push(row);
    }

    const townData = JSON.parse(
      fs.readFileSync(path.join(__dirname, '..', 'data', 'town-data.json'), 'utf8'),
    );
    const towns = Object.entries(townData).map(([slug, t]) => ({
      slug,
      name: t.name,
      lat: t.lat,
      lng: t.lng,
    }));

    function findNearestTown(lat, lng) {
      let best = null;
      let bestDist = Infinity;
      for (const t of towns) {
        const d = haversineMiles(lat, lng, t.lat, t.lng);
        if (d < bestDist) {
          bestDist = d;
          best = t;
        }
      }
      return best;
    }

    const usedSlugs = new Set();
    const result = deduped.map((row) => {
      const lat = Number(row.latitude);
      const lng = Number(row.longitude);
      const nearest = findNearestTown(lat, lng);
      let base = slugify(row.name);
      if (!base) base = 'campground';
      let slug = base;
      let n = 0;
      while (usedSlugs.has(slug)) {
        n += 1;
        slug = `${base}-${n}`;
      }
      usedSlugs.add(slug);

      const rating = row.rating != null ? Number(row.rating) : null;
      const reviews = row.reviews != null ? Number(row.reviews) : null;

      return {
        name: row.name,
        slug,
        category: categorize(row),
        lat,
        lng,
        nearestTown: nearest.slug,
        nearestTownName: nearest.name,
        address: formatAddress(row),
        phone: formatPhone(row.phone),
        website: row.website && String(row.website).trim() ? String(row.website).trim() : null,
        rating: Number.isFinite(rating) ? rating : null,
        reviews: Number.isFinite(reviews) ? reviews : null,
      };
    });

    result.sort((a, b) => (b.reviews || 0) - (a.reviews || 0));

    const outPath = path.join(__dirname, '..', 'data', 'campgrounds.json');
    fs.writeFileSync(outPath, `${JSON.stringify(result, null, 2)}\n`);

    const byCat = (c) => result.filter((x) => x.category === c).length;
    console.log(`Wrote ${result.length} campgrounds to ${outPath}`);
    console.log(`  KOA: ${byCat('koa')}`);
    console.log(`  State Park: ${byCat('state')}`);
    console.log(`  Public Land: ${byCat('public')}`);
    console.log(`  RV Park: ${byCat('rv')}`);
    console.log(`  Private: ${byCat('private')}`);
    console.log('Next: node web/scripts/build-corridors.js');
  })();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
