const SHOPIFY_DOMAIN = 'shop.treasurestate.com';
const STOREFRONT_TOKEN = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN || '';
const API_VERSION = '2025-01';

export type ShopifyProduct = {
  id: string;
  title: string;
  handle: string;
  description: string;
  priceAmount: string;
  priceCurrency: string;
  imageUrl: string | null;
  imageAlt: string | null;
  productUrl: string;
};

type StorefrontProductNode = {
  id: string;
  title: string;
  handle: string;
  descriptionHtml: string;
  priceRange: {
    minVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };
  images: {
    edges: Array<{
      node: {
        url: string;
        altText: string | null;
      };
    }>;
  };
  onlineStoreUrl: string | null;
};

const COLLECTION_QUERY = `
  query CollectionProducts($handle: String!, $first: Int!) {
    collectionByHandle(handle: $handle) {
      id
      title
      products(first: $first) {
        edges {
          node {
            id
            title
            handle
            descriptionHtml
            priceRange {
              minVariantPrice {
                amount
                currencyCode
              }
            }
            images(first: 1) {
              edges {
                node {
                  url
                  altText
                }
              }
            }
            onlineStoreUrl
          }
        }
      }
    }
  }
`;

function mapProduct(node: StorefrontProductNode): ShopifyProduct {
  const img = node.images.edges[0]?.node ?? null;
  return {
    id: node.id,
    title: node.title,
    handle: node.handle,
    description: node.descriptionHtml,
    priceAmount: node.priceRange.minVariantPrice.amount,
    priceCurrency: node.priceRange.minVariantPrice.currencyCode,
    imageUrl: img?.url ?? null,
    imageAlt: img?.altText ?? null,
    productUrl: node.onlineStoreUrl || `https://${SHOPIFY_DOMAIN}/products/${node.handle}`,
  };
}

const ALL_PRODUCTS_QUERY = `
  query AllProducts($first: Int!) {
    products(first: $first) {
      edges {
        node {
          id
          title
          handle
          descriptionHtml
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
          images(first: 1) {
            edges {
              node {
                url
                altText
              }
            }
          }
          onlineStoreUrl
        }
      }
    }
  }
`;

async function storefrontFetch(query: string, variables: Record<string, unknown>): Promise<unknown> {
  if (!STOREFRONT_TOKEN) return null;

  try {
    const res = await fetch(
      `https://${SHOPIFY_DOMAIN}/api/${API_VERSION}/graphql.json`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Storefront-Access-Token': STOREFRONT_TOKEN,
        },
        body: JSON.stringify({ query, variables }),
      },
    );
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function fetchCollectionProducts(
  collectionHandle: string,
  count: number = 10,
): Promise<ShopifyProduct[]> {
  const json = await storefrontFetch(COLLECTION_QUERY, { handle: collectionHandle, first: count }) as Record<string, unknown> | null;
  const edges = (json as any)?.data?.collectionByHandle?.products?.edges;
  if (!Array.isArray(edges)) return [];
  return edges.map((edge: { node: StorefrontProductNode }) => mapProduct(edge.node));
}

export async function fetchAllProducts(
  count: number = 10,
): Promise<ShopifyProduct[]> {
  const json = await storefrontFetch(ALL_PRODUCTS_QUERY, { first: count }) as Record<string, unknown> | null;
  const edges = (json as any)?.data?.products?.edges;
  if (!Array.isArray(edges)) return [];
  return edges.map((edge: { node: StorefrontProductNode }) => mapProduct(edge.node));
}
