/**
 * Shopify Product Filter System
 * Controls which products are available for Shopify import/export
 */

import { UnifiedProduct } from './unified-product-data';

/**
 * Master toggle for Shopify product availability
 * Set to false to exclude ALL products from Shopify
 * Set to true to include products based on individual availability
 */
export const SHOPIFY_PRODUCTS_ENABLED = true; // Master toggle - ENABLED for first 10 products

/**
 * Individual product availability for Shopify
 * Only used when SHOPIFY_PRODUCTS_ENABLED = true
 */
export const SHOPIFY_PRODUCT_AVAILABILITY: { [productId: string]: boolean } = {
  // Books - Category A (6 books for Shopify import)
  'A-01': true,  // First & Light E-book
  'A-02': true,  // First & Light Paperback  
  'A-03': true,  // Risque & Safety E-book
  'A-04': true,  // Risque & Safety Paperback
  'A-05': true,  // Mercury & Memory E-book
  'A-06': true,  // Mercury & Memory Paperback
  
  // Apparel - Category B (4 apparel items for Shopify import)
  'B-01': true,  // DarkStreet Panties
  'B-02': true,  // Mesh Bodysuits
  'B-03': true,  // Asphalt Black Denim Jackets
  'B-04': true,  // DarkStreet Tees
  
  // All other products default to false when master toggle is enabled
};

/**
 * Check if a product should be included in Shopify operations
 */
export function isProductAvailableForShopify(product: UnifiedProduct): boolean {
  // If master toggle is OFF, exclude ALL products
  if (!SHOPIFY_PRODUCTS_ENABLED) {
    return false;
  }
  
  // If master toggle is ON, check individual availability
  return SHOPIFY_PRODUCT_AVAILABILITY[product.id] || false;
}

/**
 * Filter products for Shopify operations
 */
export function filterProductsForShopify(products: UnifiedProduct[]): UnifiedProduct[] {
  return products.filter(isProductAvailableForShopify);
}

/**
 * Get count of products available for Shopify
 */
export function getShopifyProductCount(products: UnifiedProduct[]): number {
  return filterProductsForShopify(products).length;
}

/**
 * Get status message for Shopify availability
 */
export function getShopifyStatusMessage(): string {
  if (!SHOPIFY_PRODUCTS_ENABLED) {
    return "🚫 Shopify products DISABLED - All 95 products managed on DS LLC only";
  }
  
  const availableCount = Object.values(SHOPIFY_PRODUCT_AVAILABILITY).filter(Boolean).length;
  return `✅ Shopify products ENABLED - ${availableCount} products available for import`;
}
