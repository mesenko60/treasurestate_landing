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
