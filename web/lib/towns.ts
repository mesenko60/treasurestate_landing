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
