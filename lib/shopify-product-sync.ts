/**
 * Shopify Product Sync System
 * Fetches product data from Shopify Admin API to keep DS LLC website in sync
 */

// Shopify configuration - using environment variables for security
const SHOPIFY_STORE_DOMAIN = process.env.SHOPIFY_STORE_DOMAIN || 'wenugu-5b.myshopify.com';
const SHOPIFY_ADMIN_API_TOKEN = process.env.SHOPIFY_ADMIN_API_TOKEN || process.env.SHOPIFY_ADMIN_API_ACCESS_TOKEN || '';
const SHOPIFY_API_VERSION = process.env.SHOPIFY_API_VERSION || '2024-10';

export interface ShopifyProduct {
  id: string;
  title: string;
  handle: string;
  status: 'ACTIVE' | 'DRAFT' | 'ARCHIVED'; // Product status in Shopify
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
        inventoryQuantity: number | null; // Can be null if inventory not tracked
        inventoryPolicy?: string; // 'DENY' or 'CONTINUE'
        inventoryManagement?: string | null; // Can be null if inventory not tracked
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
            status
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
                  inventoryPolicy
                  inventoryManagement
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
  
  if (!variantId) {
    console.error('Could not extract variant ID from:', primaryVariant.id);
    return null;
  }
  
  // Determine inStock status:
  // 1. If product status is ACTIVE in Shopify, it's available
  // 2. If inventory is tracked and quantity > 0, it's in stock
  // 3. If inventory is NOT tracked (inventoryManagement is null) and status is ACTIVE, it's available
  const isInventoryTracked = primaryVariant.inventoryManagement !== null;
  const hasInventory = primaryVariant.inventoryQuantity !== null && primaryVariant.inventoryQuantity > 0;
  const isActiveInShopify = shopifyProduct.status === 'ACTIVE';
  
  // Product is in stock if:
  // - Shopify status is ACTIVE AND
  //   - Inventory is not tracked (always available when active), OR
  //   - Inventory is tracked AND quantity > 0
  const inStock = isActiveInShopify && (!isInventoryTracked || hasInventory);
  
  return {
    id: generateDSProductId(shopifyProduct.title),
    category: mapProductTypeToCategory(shopifyProduct.productType),
    title: shopifyProduct.title,
    author: extractAuthorFromTitle(shopifyProduct.title),
    price: parseFloat(primaryVariant.price.amount),
    description: shopifyProduct.description || '',
    image: primaryImage?.url || '/product-images/placeholder.jpg',
    inStock: inStock,
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
