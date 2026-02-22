import fs from 'fs';
import path from 'path';
import { slugify } from './slug';

export function getTownList(): { name: string; slug: string }[] {
  const listPath = path.resolve(process.cwd(), '..', 'cities_towns_list', 'towns.txt');
  if (!fs.existsSync(listPath)) return [];
  const raw = fs.readFileSync(listPath, 'utf8');
  return raw
    .split(/\r?\n/)
    .map(line => line.trim())
    .filter(Boolean)
    .map(name => ({ name, slug: slugify(name) }));
}

export function getTownNameFromSlug(slug: string): string {
  const match = getTownList().find(t => t.slug === slug);
  if (match) return match.name;
  // Fallback to title-cased slug
  return slug
    .split('-')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

export function getRelatedTowns(currentSlug: string, count: number = 3): { name: string; slug: string }[] {
  const towns = getTownList();
  const otherTowns = towns.filter(t => t.slug !== currentSlug);

  let coordinates: Record<string, { lat: number; lng: number }> = {};
  try {
    const coordsPath = path.resolve(process.cwd(), 'data', 'town-coordinates.json');
    if (fs.existsSync(coordsPath)) {
      coordinates = JSON.parse(fs.readFileSync(coordsPath, 'utf8'));
    }
  } catch { /* fall through to alphabetical fallback */ }

  const current = coordinates[currentSlug];
  if (!current) {
    return otherTowns.slice(0, count);
  }

  const R = 3959; // Earth radius in miles
  function dist(lat1: number, lon1: number, lat2: number, lon2: number) {
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) ** 2 +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }

  const withDist = otherTowns
    .filter(t => coordinates[t.slug])
    .map(t => ({ ...t, d: dist(current.lat, current.lng, coordinates[t.slug].lat, coordinates[t.slug].lng) }))
    .sort((a, b) => a.d - b.d);

  return withDist.slice(0, count).map(({ name, slug }) => ({ name, slug }));
}
