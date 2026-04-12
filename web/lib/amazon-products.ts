import type { AmazonProduct, AmazonProductCollection, AmazonProductCategory } from '../types/amazon-product';
import productData from '../data/amazon-products.json';

interface ProductDataFile {
  collections: AmazonProductCollection[];
}

const data = productData as ProductDataFile;

/**
 * Get all product collections
 */
export function getAllCollections(): AmazonProductCollection[] {
  return data.collections;
}

/**
 * Get a specific collection by ID
 */
export function getCollection(id: string): AmazonProductCollection | undefined {
  return data.collections.find(c => c.id === id);
}

/**
 * Get all products across all collections
 */
export function getAllProducts(): AmazonProduct[] {
  return data.collections.flatMap(c => c.products);
}

/**
 * Get products by category
 */
export function getProductsByCategory(category: AmazonProductCategory): AmazonProduct[] {
  return getAllProducts().filter(p => p.category === category);
}

/**
 * Get products by tag
 */
export function getProductsByTag(tag: string): AmazonProduct[] {
  return getAllProducts().filter(p => p.tags?.includes(tag));
}

/**
 * Get products matching any of the provided tags
 */
export function getProductsByTags(tags: string[]): AmazonProduct[] {
  return getAllProducts().filter(p => 
    p.tags?.some(t => tags.includes(t))
  );
}

/**
 * Map guide/topic slugs to relevant Amazon collection IDs
 */
export const TOPIC_COLLECTION_MAP: Record<string, string> = {
  'fly-fishing': 'fly-fishing-essentials',
  'fishing': 'fly-fishing-essentials',
  'hiking': 'hiking-gear',
  'backpacking': 'hiking-gear',
  'wildlife': 'wildlife-watching',
  'wildlife-watching': 'wildlife-watching',
  'skiing': 'skiing-gear',
  'snowboarding': 'skiing-gear',
  'winter-sports': 'skiing-gear',
};

/**
 * Get the appropriate collection for a topic/guide
 */
export function getCollectionForTopic(topic: string): AmazonProductCollection | undefined {
  const collectionId = TOPIC_COLLECTION_MAP[topic];
  return collectionId ? getCollection(collectionId) : undefined;
}
