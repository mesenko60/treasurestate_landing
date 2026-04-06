/**
 * Links from town pages to the historic markers explorer (map + curated pages + deep reads).
 */

/** Client-safe label from URL slug (no filesystem). */
export function formatTownNameFromSlug(slug: string): string {
  if (!slug) return '';
  return slug
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

/** Explorer URL filtered to markers matched to this town slug in the statewide dataset. */
export function townHistoricMarkersDirectoryHref(townSlug: string): string {
  return `/historic-markers/?town=${encodeURIComponent(townSlug)}`;
}

/** County string from town-data.json (e.g. "Cascade County") → marker JSON county field (e.g. "Cascade"). */
export function normalizeCountyForMarkerFilter(countyRaw: string | null | undefined): string | null {
  if (!countyRaw || typeof countyRaw !== 'string') return null;
  const t = countyRaw.trim();
  if (!t) return null;
  return t.replace(/\s+County$/i, '').replace(/\s+Parish$/i, '').trim() || null;
}

export function countyHistoricMarkersDirectoryHref(countyBase: string): string {
  return `/historic-markers/?county=${encodeURIComponent(countyBase)}`;
}
