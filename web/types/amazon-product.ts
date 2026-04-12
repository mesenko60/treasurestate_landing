/**
 * Amazon product data types for affiliate integration.
 * 
 * NOTE: We intentionally omit price fields because Amazon requires
 * real-time pricing via Product Advertising API. Static prices
 * violate the Operating Agreement.
 */

export interface AmazonProduct {
  /** Amazon Standard Identification Number */
  asin: string;
  /** Product title/name */
  title: string;
  /** Brief description (your own words, not Amazon's) */
  description?: string;
  /** Product category for filtering */
  category: AmazonProductCategory;
  /** Optional sub-categories or tags for more granular filtering */
  tags?: string[];
  /** Amazon-hosted product image URL (must be from Amazon CDN) */
  imageUrl?: string;
  /** Why this product is recommended for Montana activities */
  recommendation?: string;
}

export type AmazonProductCategory =
  | 'fly-fishing'
  | 'hiking'
  | 'camping'
  | 'skiing'
  | 'hunting'
  | 'wildlife-watching'
  | 'photography'
  | 'winter-gear'
  | 'road-trip'
  | 'general';

export interface AmazonProductCollection {
  /** Collection identifier (e.g., "fly-fishing-essentials") */
  id: string;
  /** Display title for the collection */
  title: string;
  /** Optional description */
  description?: string;
  /** Products in this collection */
  products: AmazonProduct[];
}
