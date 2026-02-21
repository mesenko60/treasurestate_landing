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
  // Filter out current town
  const otherTowns = towns.filter(t => t.slug !== currentSlug);
  
  // Deterministic "random" selection based on the string length and characters of the current slug
  // This ensures the related towns for a specific town don't change on every build
  let seed = 0;
  for (let i = 0; i < currentSlug.length; i++) {
    seed += currentSlug.charCodeAt(i);
  }
  
  const related = [];
  for (let i = 0; i < count; i++) {
    const index = (seed + i * 17) % otherTowns.length;
    related.push(otherTowns[index]);
  }
  
  return related;
}
