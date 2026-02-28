import fs from 'fs';
import path from 'path';

export type CrossLink = { label: string; href: string };

const GUIDE_TOWNS = new Set([
  'missoula', 'bozeman', 'billings', 'great-falls', 'helena', 'butte',
  'kalispell', 'whitefish', 'livingston', 'hamilton', 'belgrade', 'columbia-falls',
  'polson', 'bigfork', 'big-sky', 'red-lodge', 'dillon', 'miles-city',
  'havre', 'sidney', 'lewistown', 'anaconda', 'big-timber', 'ennis',
  'west-yellowstone', 'gardiner',
]);

const RANKING_TITLES: Record<string, string> = {
  'most-affordable-towns': 'Most Affordable Towns',
  'best-outdoor-recreation': 'Best Outdoor Recreation',
  'best-ski-towns': 'Best Ski Towns',
  'best-fishing-towns': 'Best Fly Fishing Towns',
  'towns-near-hot-springs': 'Towns Near Hot Springs',
  'best-small-towns': 'Best Small Towns',
  'best-towns-near-glacier-yellowstone': 'Near Glacier & Yellowstone',
  'best-towns-for-retirees': 'Best for Retirees',
  'best-climate': 'Best Climate',
  'best-towns-for-families': 'Best for Families',
  'best-towns-for-young-professionals': 'Best for Young Professionals',
  'best-housing-availability': 'Best Housing Availability',
};

let _rankingCache: Record<string, string[]> | null = null;

/**
 * Returns a map of townSlug → ranking slugs where that town placed in the top 10.
 * Uses a pre-built index if available; falls back to an empty map.
 */
function loadRankingIndex(): Record<string, string[]> {
  if (_rankingCache) return _rankingCache;
  try {
    const indexPath = path.resolve(process.cwd(), 'data', 'best-of-index.json');
    if (fs.existsSync(indexPath)) {
      _rankingCache = JSON.parse(fs.readFileSync(indexPath, 'utf8'));
      return _rankingCache!;
    }
  } catch { /* ignore */ }
  _rankingCache = {};
  return _rankingCache;
}

export function hasGuide(townSlug: string): boolean {
  return GUIDE_TOWNS.has(townSlug);
}

export function guideLink(townSlug: string): CrossLink | null {
  if (!GUIDE_TOWNS.has(townSlug)) return null;
  return {
    label: 'Moving Guide',
    href: `/guides/moving-to-${townSlug}-montana/`,
  };
}

export function rankingLinks(townSlug: string): CrossLink[] {
  const index = loadRankingIndex();
  const slugs = index[townSlug] || [];
  return slugs.map(s => ({
    label: RANKING_TITLES[s] || s,
    href: `/best-of/${s}/`,
  }));
}

export function allCrossLinks(townSlug: string): CrossLink[] {
  const links: CrossLink[] = [];
  const guide = guideLink(townSlug);
  if (guide) links.push(guide);
  links.push(...rankingLinks(townSlug));
  return links;
}

export function getRelatedRankings(currentSlug: string): { slug: string; title: string }[] {
  return Object.entries(RANKING_TITLES)
    .filter(([s]) => s !== currentSlug)
    .map(([slug, title]) => ({ slug, title }));
}
