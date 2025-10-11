/**
 * Shopify Product Sync System
 * Fetches product data from Shopify Admin API to keep DS LLC website in sync
 */

// Shopify configuration
const SHOPIFY_STORE_DOMAIN = 'wenugu-5b.myshopify.com';
const SHOPIFY_ADMIN_API_TOKEN = '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';
const SHOPIFY_API_VERSION = '2024-10';

export interface ShopifyProduct {
  id: string;
  title: string;
  handle: string;
  variants: {
    edges: Array<{
      node: {
        id: string;
        title: string;
        price: {
          amount: string;
          currencyCode: string;
        };
        sku?: string;
        inventoryQuantity: number;
      };
    }>;
  };
  images: {
    edges: Array<{
      node: {
        url: string;
        altText?: string;
      };
    }>;
  };
  description?: string;
  productType?: string;
  tags: string[];
}

export interface ShopifyProductResponse {
  data: {
    products: {
      edges: Array<{
        node: ShopifyProduct;
      }>;
    };
  };
}

/**
 * Fetch all products from Shopify Admin API
 */
export async function fetchShopifyProducts(): Promise<ShopifyProduct[]> {
  const query = `
    query getProducts($first: Int!) {
      products(first: $first) {
        edges {
          node {
            id
            title
            handle
            description
            productType
            tags
            variants(first: 10) {
              edges {
                node {
                  id
                  title
                  price {
                    amount
                    currencyCode
                  }
                  sku
                  inventoryQuantity
                }
              }
            }
            images(first: 5) {
              edges {
                node {
                  url
                  altText
                }
              }
            }
          }
        }
      }
    }
  `;

  try {
    const response = await fetch(`https://${SHOPIFY_STORE_DOMAIN}/admin/api/${SHOPIFY_API_VERSION}/graphql.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': SHOPIFY_ADMIN_API_TOKEN,
      },
      body: JSON.stringify({
        query,
        variables: { first: 50 }
      }),
    });

    if (!response.ok) {
      throw new Error(`Shopify API error: ${response.status} ${response.statusText}`);
    }

    const data: ShopifyProductResponse = await response.json();
    
    if (data.data?.products?.edges) {
      return data.data.products.edges.map(edge => edge.node);
    }
    
    return [];
  } catch (error) {
    console.error('Error fetching Shopify products:', error);
    throw error;
  }
}

/**
 * Map Shopify product to DS LLC product format
 */
export function mapShopifyToDSProduct(shopifyProduct: ShopifyProduct): any {
  const primaryVariant = shopifyProduct.variants.edges[0]?.node;
  const primaryImage = shopifyProduct.images.edges[0]?.node;

  if (!primaryVariant) {
    return null;
  }

  // Extract variant ID number from GraphQL ID
  const variantId = primaryVariant.id.split('/').pop();
  
  return {
    id: generateDSProductId(shopifyProduct.title),
    category: mapProductTypeToCategory(shopifyProduct.productType),
    title: shopifyProduct.title,
    author: extractAuthorFromTitle(shopifyProduct.title),
    price: parseFloat(primaryVariant.price.amount),
    description: shopifyProduct.description || '',
    image: primaryImage?.url || '/product-images/placeholder.jpg',
    inStock: primaryVariant.inventoryQuantity > 0,
    badge: shopifyProduct.tags.includes('new') ? 'New' : undefined,
    shopifyVariantId: parseInt(variantId),
    requiresShipping: !shopifyProduct.tags.includes('digital'),
    // Add other DS-specific fields as needed
  };
}

/**
 * Generate DS product ID from Shopify title
 */
function generateDSProductId(title: string): string {
  // Map known products to their DS IDs
  const productMap: { [key: string]: string } = {
    'DarkStreets Tee - V-Neck': 'T-01',
    'First & Light- E-book': 'A-01',
    'First & Light- Paperback': 'A-02',
    'Risque & Safety- E-book': 'A-03',
    // Add more mappings as needed
  };

  return productMap[title] || `DS-${title.replace(/[^a-zA-Z0-9]/g, '').substring(0, 8)}`;
}

/**
 * Map Shopify product type to DS category
 */
function mapProductTypeToCategory(productType?: string): string {
  if (!productType) return 'General';
  
  const categoryMap: { [key: string]: string } = {
    'Apparel': 'Apparel',
    'Books': 'Serials/Books',
    'Digital': 'Serials/Books',
    'Merchandise': 'Apparel',
  };

  return categoryMap[productType] || 'General';
}

/**
 * Extract author from product title
 */
function extractAuthorFromTitle(title: string): string {
  // For books, extract author from title pattern
  if (title.includes('-')) {
    const parts = title.split('-');
    if (parts.length > 1) {
      return parts[1].trim();
    }
  }
  
  // Default author based on product type
  if (title.includes('Tee') || title.includes('Apparel')) {
    return 'DarkStreets';
  }
  
  return 'Aries Tiger'; // Default author for books
}

/**
 * Sync all products from Shopify to DS LLC format
 */
export async function syncProductsFromShopify(): Promise<any[]> {
  try {
    console.log('🔄 Starting Shopify product sync...');
    
    const shopifyProducts = await fetchShopifyProducts();
    console.log(`📦 Found ${shopifyProducts.length} products in Shopify`);
    
    const dsProducts = shopifyProducts
      .map(mapShopifyToDSProduct)
      .filter(product => product !== null);
    
    console.log(`✅ Successfully synced ${dsProducts.length} products`);
    console.log('📋 Synced products:', dsProducts.map(p => `${p.title}: $${p.price}`));
    
    return dsProducts;
  } catch (error) {
    console.error('❌ Error syncing products from Shopify:', error);
    throw error;
  }
}

/**
 * Get specific product by Shopify variant ID
 */
export async function getProductByVariantId(variantId: number): Promise<any | null> {
  try {
    const products = await syncProductsFromShopify();
    return products.find(p => p.shopifyVariantId === variantId) || null;
  } catch (error) {
    console.error(`Error getting product for variant ${variantId}:`, error);
    return null;
  }
}
