export const DEFAULT_COLLECTION = 'montana';

const COLLECTION_OVERRIDES: Record<string, string> = {
  // Add overrides here when a town slug doesn't match its Shopify collection handle.
  // Example: 'great-falls': 'great-falls-mt',
};

/**
 * Returns the Shopify collection handle for a given town slug.
 * Uses the override map first, then falls back to the slug itself
 * (convention: Shopify collection handle === town slug).
 */
export function getShopifyCollection(slug: string): string {
  return COLLECTION_OVERRIDES[slug] || slug;
}

/**
 * Extract a plausible collection handle from a "moving-to-{town}" guide slug.
 * Returns the town portion or DEFAULT_COLLECTION if the slug doesn't match.
 */
export function guideSlugToCollection(slug: string): string {
  const match = slug.match(/^moving-to-(.+)$/);
  return match ? getShopifyCollection(match[1]) : DEFAULT_COLLECTION;
}

/**
 * For corridor pages: picks the first town in the throughTowns list
 * (most representative), falling back to DEFAULT_COLLECTION.
 */
export function corridorToCollection(throughTowns: string[]): string {
  if (throughTowns.length === 0) return DEFAULT_COLLECTION;
  return getShopifyCollection(throughTowns[0]);
}

/**
 * Label for the "Shop X Gear" heading.
 * Returns a town name for town-specific collections, or "Montana" for general.
 */
export function collectionLabel(collection: string): string {
  if (collection === DEFAULT_COLLECTION) return 'Montana';
  return collection.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}
