import { Product } from '@/data/products';

/**
 * Check if a product is currently In-Design (not available for purchase)
 */
export function isProductInDesign(product: Product): boolean {
  // Check if product has placeholder image
  if (product.image === "/product-images/placeholder.jpg") {
    return true;
  }
  
  // Check if product title contains "In-Design" or similar indicators
  const titleLower = product.title.toLowerCase();
  if (titleLower.includes('in-design') || titleLower.includes('coming soon') || titleLower.includes('tba')) {
    return true;
  }
  
  // Check if product has specific badge indicating it's in design
  if (product.badge && product.badge.toLowerCase().includes('in-design')) {
    return true;
  }
  
  return false;
}

/**
 * Get the display status for a product
 */
export function getProductStatus(product: Product): 'available' | 'in-design' | 'out-of-stock' {
  if (isProductInDesign(product)) {
    return 'in-design';
  }
  
  if (!product.inStock) {
    return 'out-of-stock';
  }
  
  return 'available';
}
