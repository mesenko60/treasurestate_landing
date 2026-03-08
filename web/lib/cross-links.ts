import fs from 'fs';
import path from 'path';

export type CrossLink = { label: string; href: string };

let _coordsCache: Set<string> | null = null;

function getTownSlugs(): Set<string> {
  if (_coordsCache) return _coordsCache;
  try {
    const p = path.resolve(process.cwd(), 'data', 'town-coordinates.json');
    if (fs.existsSync(p)) {
      _coordsCache = new Set(Object.keys(JSON.parse(fs.readFileSync(p, 'utf8'))));
      return _coordsCache;
    }
  } catch { /* ignore */ }
  _coordsCache = new Set();
  return _coordsCache;
}

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
  'best-towns-for-digital-nomads': 'Best for Digital Nomads',
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
  return getTownSlugs().has(townSlug);
}

export function guideLink(townSlug: string): CrossLink | null {
  if (!getTownSlugs().has(townSlug)) return null;
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

export function plannerLinks(_townSlug: string): CrossLink[] {
  return [
    { label: 'Hunting Guide', href: '/planners/hunting-guide/' },
  ];
}

export function allCrossLinks(townSlug: string): CrossLink[] {
  const links: CrossLink[] = [];
  const guide = guideLink(townSlug);
  if (guide) links.push(guide);
  links.push(...rankingLinks(townSlug));
  links.push(...plannerLinks(townSlug));
  return links;
}

export function getRelatedRankings(currentSlug: string): { slug: string; title: string }[] {
  return Object.entries(RANKING_TITLES)
    .filter(([s]) => s !== currentSlug)
    .map(([slug, title]) => ({ slug, title }));
}
