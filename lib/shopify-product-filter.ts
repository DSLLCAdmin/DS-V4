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
export const SHOPIFY_PRODUCTS_ENABLED = false; // Master toggle - currently OFF

/**
 * Individual product availability for Shopify
 * Only used when SHOPIFY_PRODUCTS_ENABLED = true
 */
export const SHOPIFY_PRODUCT_AVAILABILITY: { [productId: string]: boolean } = {
  // Books - Category A (when enabled)
  'A-01': true,  // First & Light E-book
  'A-02': true,  // First & Light Paperback  
  'A-03': true,  // First & Light Hardcover
  'A-04': true,  // DarkStreet Chronicles E-book
  'A-05': true,  // DarkStreet Chronicles Paperback
  'A-06': true,  // DarkStreet Chronicles Hardcover
  
  // Apparel - Category B (when enabled)
  'B-01': true,  // DarkStreet Tees
  'B-02': true,  // DarkStreet Caps
  'B-03': true,  // DarkStreet Hoodies
  'B-04': true,  // DarkStreet Mugs
  
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
