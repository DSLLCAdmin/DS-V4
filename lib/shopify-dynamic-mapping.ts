/**
 * DYNAMIC SHOPIFY VARIANT ID RESOLUTION SYSTEM
 * 
 * This system eliminates manual variant ID assignment by dynamically
 * mapping DS products to Shopify products at runtime.
 * 
 * TSW SOLUTION: Systematic approach to prevent variant ID mismatches
 */

import { products } from '@/data/products';

// Shopify configuration
const SHOPIFY_STORE_DOMAIN = 'wenugu-5b.myshopify.com';
const SHOPIFY_STOREFRONT_API_TOKEN = '42ec4a86d00bfb85a44c99bd24a4f5f2';
const SHOPIFY_API_VERSION = '2024-10';

interface ShopifyVariant {
  id: string;
  title: string;
  price: {
    amount: string;
    currencyCode: string;
  };
}

interface ShopifyProduct {
  id: string;
  title: string;
  variants: {
    edges: Array<{
      node: ShopifyVariant;
    }>;
  };
}

interface ShopifyResponse {
  data: {
    products: {
      edges: Array<{
        node: ShopifyProduct;
      }>;
    };
  };
}

interface ProductMapping {
  dsProductId: string;
  dsTitle: string;
  dsPrice: number;
  shopifyVariantId?: number;
  shopifyPrice?: number;
  mappingConfidence: 'exact' | 'fuzzy' | 'manual' | 'not_found';
  mappingReason: string;
}

/**
 * Fetch all products from Shopify Storefront API
 */
async function fetchShopifyProducts(): Promise<ShopifyProduct[]> {
  const query = `
    query {
      products(first: 50) {
        edges {
          node {
            id
            title
            variants(first: 10) {
              edges {
                node {
                  id
                  title
                  price {
                    amount
                    currencyCode
                  }
                }
              }
            }
          }
        }
      }
    }
  `;

  try {
    const response = await fetch(`https://${SHOPIFY_STORE_DOMAIN}/api/${SHOPIFY_API_VERSION}/graphql.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': SHOPIFY_STOREFRONT_API_TOKEN
      },
      body: JSON.stringify({ query })
    });

    if (!response.ok) {
      throw new Error(`Shopify API error: ${response.status}`);
    }

    const data: ShopifyResponse = await response.json();
    return data.data.products.edges.map(edge => edge.node);
  } catch (error) {
    console.error('Error fetching Shopify products:', error);
    return [];
  }
}

/**
 * Extract variant ID number from GraphQL ID
 */
function extractVariantId(graphqlId: string): number {
  return parseInt(graphqlId.split('/').pop() || '0');
}

/**
 * Calculate string similarity for fuzzy matching
 */
function calculateSimilarity(str1: string, str2: string): number {
  const s1 = str1.toLowerCase().replace(/[^a-z0-9]/g, '');
  const s2 = str2.toLowerCase().replace(/[^a-z0-9]/g, '');
  
  if (s1 === s2) return 1.0;
  
  // Simple Levenshtein distance
  const matrix = Array(s2.length + 1).fill(null).map(() => Array(s1.length + 1).fill(null));
  
  for (let i = 0; i <= s1.length; i++) matrix[0][i] = i;
  for (let j = 0; j <= s2.length; j++) matrix[j][0] = j;
  
  for (let j = 1; j <= s2.length; j++) {
    for (let i = 1; i <= s1.length; i++) {
      const cost = s1[i - 1] === s2[j - 1] ? 0 : 1;
      matrix[j][i] = Math.min(
        matrix[j][i - 1] + 1,
        matrix[j - 1][i] + 1,
        matrix[j - 1][i - 1] + cost
      );
    }
  }
  
  const maxLength = Math.max(s1.length, s2.length);
  return maxLength === 0 ? 1 : (maxLength - matrix[s2.length][s1.length]) / maxLength;
}

/**
 * Map DS product to Shopify product with confidence scoring
 */
function mapDsProductToShopify(
  dsProduct: any, 
  shopifyProducts: ShopifyProduct[]
): ProductMapping {
  const mapping: ProductMapping = {
    dsProductId: dsProduct.id,
    dsTitle: dsProduct.title,
    dsPrice: dsProduct.price,
    mappingConfidence: 'not_found',
    mappingReason: 'No matching Shopify product found'
  };

  // Strategy 1: Exact title match
  let exactMatch = shopifyProducts.find(sp => 
    sp.title.toLowerCase() === dsProduct.title.toLowerCase()
  );
  
  if (exactMatch) {
    const variant = exactMatch.variants.edges[0]?.node;
    if (variant) {
      mapping.shopifyVariantId = extractVariantId(variant.id);
      mapping.shopifyPrice = parseFloat(variant.price.amount);
      mapping.mappingConfidence = 'exact';
      mapping.mappingReason = `Exact title match: "${exactMatch.title}"`;
      return mapping;
    }
  }

  // Strategy 2: Fuzzy title matching
  let bestMatch: ShopifyProduct | null = null;
  let bestScore = 0;
  
  for (const sp of shopifyProducts) {
    const score = calculateSimilarity(dsProduct.title, sp.title);
    if (score > bestScore && score > 0.7) { // 70% similarity threshold
      bestMatch = sp;
      bestScore = score;
    }
  }
  
  if (bestMatch) {
    const variant = bestMatch.variants.edges[0]?.node;
    if (variant) {
      mapping.shopifyVariantId = extractVariantId(variant.id);
      mapping.shopifyPrice = parseFloat(variant.price.amount);
      mapping.mappingConfidence = 'fuzzy';
      mapping.mappingReason = `Fuzzy match (${Math.round(bestScore * 100)}%): "${bestMatch.title}"`;
      return mapping;
    }
  }

  // Strategy 3: Manual mapping rules
  const manualMappings: { [key: string]: string } = {
    'Hats': 'DS Cap',
    'DarkStreets Tee - V-Neck': 'DS Cap', // Temporary until Printful sync
  };
  
  const manualTarget = manualMappings[dsProduct.title];
  if (manualTarget) {
    const manualMatch = shopifyProducts.find(sp => 
      sp.title.toLowerCase().includes(manualTarget.toLowerCase())
    );
    
    if (manualMatch) {
      const variant = manualMatch.variants.edges[0]?.node;
      if (variant) {
        mapping.shopifyVariantId = extractVariantId(variant.id);
        mapping.shopifyPrice = parseFloat(variant.price.amount);
        mapping.mappingConfidence = 'manual';
        mapping.mappingReason = `Manual mapping: "${dsProduct.title}" → "${manualMatch.title}"`;
        return mapping;
      }
    }
  }

  return mapping;
}

/**
 * Generate dynamic product mappings for all DS products
 */
export async function generateDynamicProductMappings(): Promise<ProductMapping[]> {
  console.log('🔄 Generating dynamic Shopify product mappings...');
  
  const shopifyProducts = await fetchShopifyProducts();
  console.log(`📦 Found ${shopifyProducts.length} Shopify products`);
  
  const mappings: ProductMapping[] = [];
  
  for (const dsProduct of products) {
    const mapping = mapDsProductToShopify(dsProduct, shopifyProducts);
    mappings.push(mapping);
    
    console.log(`🔍 ${dsProduct.id}: ${mapping.mappingConfidence} - ${mapping.mappingReason}`);
    
    if (mapping.shopifyVariantId && mapping.shopifyPrice) {
      const priceMatch = Math.abs(mapping.dsPrice - mapping.shopifyPrice) < 0.01;
      console.log(`💰 Price: DS $${mapping.dsPrice} vs Shopify $${mapping.shopifyPrice} ${priceMatch ? '✅' : '❌'}`);
    }
  }
  
  return mappings;
}

/**
 * Get Shopify variant ID for a specific DS product
 */
export async function getShopifyVariantId(dsProductId: string): Promise<number | null> {
  const mappings = await generateDynamicProductMappings();
  const mapping = mappings.find(m => m.dsProductId === dsProductId);
  
  if (mapping && mapping.shopifyVariantId) {
    console.log(`✅ Dynamic mapping for ${dsProductId}: ${mapping.shopifyVariantId} (${mapping.mappingConfidence})`);
    return mapping.shopifyVariantId;
  }
  
  console.warn(`⚠️ No Shopify variant found for ${dsProductId}`);
  return null;
}

/**
 * Validate all current product mappings
 */
export async function validateAllProductMappings(): Promise<void> {
  console.log('🔍 Validating all product mappings...');
  
  const mappings = await generateDynamicProductMappings();
  
  const stats = {
    exact: 0,
    fuzzy: 0,
    manual: 0,
    not_found: 0,
    price_mismatches: 0
  };
  
  for (const mapping of mappings) {
    stats[mapping.mappingConfidence]++;
    
    if (mapping.shopifyPrice && Math.abs(mapping.dsPrice - mapping.shopifyPrice) > 0.01) {
      stats.price_mismatches++;
    }
  }
  
  console.log('📊 Mapping Statistics:');
  console.log(`  Exact matches: ${stats.exact}`);
  console.log(`  Fuzzy matches: ${stats.fuzzy}`);
  console.log(`  Manual mappings: ${stats.manual}`);
  console.log(`  Not found: ${stats.not_found}`);
  console.log(`  Price mismatches: ${stats.price_mismatches}`);
  
  if (stats.not_found > 0) {
    console.warn('⚠️ Some products could not be mapped to Shopify');
  }
  
  if (stats.price_mismatches > 0) {
    console.warn('⚠️ Some products have price mismatches with Shopify');
  }
}
