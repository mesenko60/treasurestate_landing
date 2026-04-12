/**
 * Amazon Associates affiliate link utilities.
 * 
 * IMPORTANT: Per Amazon Operating Agreement:
 * - Do NOT display static prices (they become stale)
 * - Always use rel="noopener noreferrer sponsored" on links
 * - Include disclosure text near product links
 */

// Replace with your actual Amazon Associates tag
export const AMAZON_ASSOCIATE_TAG = 'treasuresta08-20';

// Required disclosure text (exact wording per Amazon Operating Agreement)
export const AMAZON_DISCLOSURE = 'As an Amazon Associate, I earn from qualifying purchases.';

// Shorter inline disclosure for use near individual links
export const AMAZON_LINK_DISCLOSURE = '(affiliate link)';

/**
 * Generate an Amazon product URL with affiliate tag
 */
export function amazonProductUrl(asin: string): string {
  return `https://www.amazon.com/dp/${asin}?tag=${AMAZON_ASSOCIATE_TAG}`;
}

/**
 * Generate an Amazon search URL with affiliate tag
 */
export function amazonSearchUrl(keywords: string): string {
  const encoded = encodeURIComponent(keywords);
  return `https://www.amazon.com/s?k=${encoded}&tag=${AMAZON_ASSOCIATE_TAG}`;
}

/**
 * Generate an Amazon category/browse URL with affiliate tag
 */
export function amazonCategoryUrl(nodeId: string): string {
  return `https://www.amazon.com/b?node=${nodeId}&tag=${AMAZON_ASSOCIATE_TAG}`;
}

/**
 * Product categories relevant to Montana outdoor activities
 */
export const AMAZON_CATEGORIES = {
  flyFishing: '3408711', // Fly Fishing Equipment
  hiking: '706814011', // Hiking & Outdoor Recreation Gear
  camping: '3401321', // Camping & Hiking Equipment
  skiing: '2204518011', // Skiing Equipment
  hunting: '3172301', // Hunting Equipment
  wildlife: '502394', // Binoculars
  photography: '502394', // Camera & Photo
} as const;

export type AmazonCategory = keyof typeof AMAZON_CATEGORIES;
