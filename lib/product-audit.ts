/**
 * COMPREHENSIVE PRODUCT AUDIT SCRIPT
 * 
 * This script performs a thorough comparison between:
 * 1. DS LLC Product Array (data/products.ts)
 * 2. Shopify Product List (via API)
 * 
 * Identifies mismatches, duplicates, and mapping issues
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

interface AuditResult {
  dsProduct: any;
  shopifyMatch?: ShopifyProduct;
  mappingConfidence: 'exact' | 'fuzzy' | 'manual' | 'not_found';
  priceMatch: boolean;
  variantIdMatch: boolean;
  issues: string[];
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

    const data = await response.json();
    return data.data.products.edges.map((edge: any) => edge.node);
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
 * Audit a single DS product against Shopify products
 */
function auditDsProduct(dsProduct: any, shopifyProducts: ShopifyProduct[]): AuditResult {
  const result: AuditResult = {
    dsProduct,
    mappingConfidence: 'not_found',
    priceMatch: false,
    variantIdMatch: false,
    issues: []
  };

  // Strategy 1: Exact title match
  let exactMatch = shopifyProducts.find(sp => 
    sp.title.toLowerCase() === dsProduct.title.toLowerCase()
  );
  
  if (exactMatch) {
    result.shopifyMatch = exactMatch;
    result.mappingConfidence = 'exact';
    
    const variant = exactMatch.variants.edges[0]?.node;
    if (variant) {
      const shopifyPrice = parseFloat(variant.price.amount);
      result.priceMatch = Math.abs(dsProduct.price - shopifyPrice) < 0.01;
      
      if (dsProduct.shopifyVariantId) {
        const expectedVariantId = extractVariantId(variant.id);
        result.variantIdMatch = dsProduct.shopifyVariantId === expectedVariantId;
      }
    }
  } else {
    // Strategy 2: Fuzzy matching
    let bestMatch: ShopifyProduct | null = null;
    let bestScore = 0;
    
    for (const sp of shopifyProducts) {
      const score = calculateSimilarity(dsProduct.title, sp.title);
      if (score > bestScore && score > 0.7) {
        bestMatch = sp;
        bestScore = score;
      }
    }
    
    if (bestMatch) {
      result.shopifyMatch = bestMatch;
      result.mappingConfidence = 'fuzzy';
      
      const variant = bestMatch.variants.edges[0]?.node;
      if (variant) {
        const shopifyPrice = parseFloat(variant.price.amount);
        result.priceMatch = Math.abs(dsProduct.price - shopifyPrice) < 0.01;
        
        if (dsProduct.shopifyVariantId) {
          const expectedVariantId = extractVariantId(variant.id);
          result.variantIdMatch = dsProduct.shopifyVariantId === expectedVariantId;
        }
      }
    }
  }

  // Identify issues
  if (!result.shopifyMatch) {
    result.issues.push('No matching Shopify product found');
  }
  
  if (result.shopifyMatch && !result.priceMatch) {
    const shopifyPrice = parseFloat(result.shopifyMatch.variants.edges[0]?.node.price.amount || '0');
    result.issues.push(`Price mismatch: DS $${dsProduct.price} vs Shopify $${shopifyPrice}`);
  }
  
  if (result.shopifyMatch && dsProduct.shopifyVariantId && !result.variantIdMatch) {
    const expectedVariantId = extractVariantId(result.shopifyMatch.variants.edges[0]?.node.id);
    result.issues.push(`Variant ID mismatch: DS ${dsProduct.shopifyVariantId} vs Shopify ${expectedVariantId}`);
  }

  return result;
}

/**
 * Perform comprehensive product audit
 */
export async function performComprehensiveProductAudit(): Promise<void> {
  console.log('🔍 COMPREHENSIVE PRODUCT AUDIT STARTING...');
  console.log('='.repeat(60));
  
  // Fetch Shopify products
  console.log('📦 Fetching Shopify products...');
  const shopifyProducts = await fetchShopifyProducts();
  console.log(`✅ Found ${shopifyProducts.length} Shopify products`);
  
  // List all Shopify products for reference
  console.log('\n📋 SHOPIFY PRODUCTS:');
  shopifyProducts.forEach((product, index) => {
    const variant = product.variants.edges[0]?.node;
    const variantId = variant ? extractVariantId(variant.id) : 'N/A';
    const price = variant ? variant.price.amount : 'N/A';
    console.log(`  ${index + 1}. "${product.title}" - Variant: ${variantId}, Price: $${price}`);
  });
  
  // Audit each DS product
  console.log('\n🔍 DS LLC PRODUCT AUDIT:');
  console.log('='.repeat(60));
  
  const auditResults: AuditResult[] = [];
  
  for (const dsProduct of products) {
    const audit = auditDsProduct(dsProduct, shopifyProducts);
    auditResults.push(audit);
    
    console.log(`\n📦 ${dsProduct.id}: "${dsProduct.title}"`);
    console.log(`   Price: $${dsProduct.price}`);
    console.log(`   Shopify Variant ID: ${dsProduct.shopifyVariantId || 'Not set'}`);
    console.log(`   Mapping: ${audit.mappingConfidence.toUpperCase()}`);
    
    if (audit.shopifyMatch) {
      const variant = audit.shopifyMatch.variants.edges[0]?.node;
      const variantId = variant ? extractVariantId(variant.id) : 'N/A';
      const price = variant ? variant.price.amount : 'N/A';
      console.log(`   Shopify Match: "${audit.shopifyMatch.title}"`);
      console.log(`   Shopify Variant: ${variantId}, Price: $${price}`);
      console.log(`   Price Match: ${audit.priceMatch ? '✅' : '❌'}`);
      console.log(`   Variant ID Match: ${audit.variantIdMatch ? '✅' : '❌'}`);
    }
    
    if (audit.issues.length > 0) {
      console.log(`   Issues:`);
      audit.issues.forEach(issue => console.log(`     ❌ ${issue}`));
    }
  }
  
  // Summary statistics
  console.log('\n📊 AUDIT SUMMARY:');
  console.log('='.repeat(60));
  
  const stats = {
    total: auditResults.length,
    exact: auditResults.filter(r => r.mappingConfidence === 'exact').length,
    fuzzy: auditResults.filter(r => r.mappingConfidence === 'fuzzy').length,
    not_found: auditResults.filter(r => r.mappingConfidence === 'not_found').length,
    price_mismatches: auditResults.filter(r => !r.priceMatch && r.shopifyMatch).length,
    variant_mismatches: auditResults.filter(r => !r.variantIdMatch && r.shopifyMatch).length,
    products_with_issues: auditResults.filter(r => r.issues.length > 0).length
  };
  
  console.log(`Total DS Products: ${stats.total}`);
  console.log(`Exact Matches: ${stats.exact}`);
  console.log(`Fuzzy Matches: ${stats.fuzzy}`);
  console.log(`Not Found: ${stats.not_found}`);
  console.log(`Price Mismatches: ${stats.price_mismatches}`);
  console.log(`Variant ID Mismatches: ${stats.variant_mismatches}`);
  console.log(`Products with Issues: ${stats.products_with_issues}`);
  
  // Critical issues
  const criticalIssues = auditResults.filter(r => r.issues.length > 0);
  if (criticalIssues.length > 0) {
    console.log('\n🚨 CRITICAL ISSUES REQUIRING ATTENTION:');
    console.log('='.repeat(60));
    criticalIssues.forEach(audit => {
      console.log(`\n❌ ${audit.dsProduct.id}: "${audit.dsProduct.title}"`);
      audit.issues.forEach(issue => console.log(`   ${issue}`));
    });
  }
  
  console.log('\n✅ COMPREHENSIVE PRODUCT AUDIT COMPLETE');
  console.log('='.repeat(60));
}

// Export for use in other modules
export { AuditResult, auditDsProduct, fetchShopifyProducts };
