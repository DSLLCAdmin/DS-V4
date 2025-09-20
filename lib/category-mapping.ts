/**
 * Category Mapping System
 * Preserves the A-J category structure while using Shopify IDs
 * Maps Shopify Product IDs to DS Category System
 */

export interface CategoryMapping {
  shopifyId: string;
  dsCategory: string;
  dsSubCategory?: string;
  originalDsId?: string; // Keep for reference during migration
}

// Category mapping based on the current A-J system
export const CATEGORY_MAPPINGS: { [key: string]: string } = {
  // A - Apparel & Intimate Wear
  'B-01': 'Apparel & Intimate Wear',
  'B-02': 'Apparel & Intimate Wear', 
  'B-03': 'Apparel & Intimate Wear',
  'B-04': 'Apparel & Intimate Wear',
  'B-05': 'Apparel & Intimate Wear',
  'B-06': 'Apparel & Intimate Wear',
  'B-07': 'Apparel & Intimate Wear',
  'B-08': 'Apparel & Intimate Wear',
  'B-09': 'Apparel & Intimate Wear',
  'B-10': 'Apparel & Intimate Wear',
  
  // B - Auto & Mobility
  'C-01': 'Auto & Mobility',
  'C-02': 'Auto & Mobility',
  'C-03': 'Auto & Mobility',
  'C-04': 'Auto & Mobility',
  'C-05': 'Auto & Mobility',
  'C-06': 'Auto & Mobility',
  'C-07': 'Auto & Mobility',
  'C-08': 'Auto & Mobility',
  'C-09': 'Auto & Mobility',
  'C-10': 'Auto & Mobility',
  
  // C - Accessories
  'D-01': 'Accessories',
  'D-02': 'Accessories',
  'D-03': 'Accessories',
  'D-04': 'Accessories',
  'D-05': 'Accessories',
  'D-06': 'Accessories',
  'D-07': 'Accessories',
  'D-08': 'Accessories',
  'D-09': 'Accessories',
  'D-10': 'Accessories',
  
  // D - Home & Mood & Atmosphere
  'E-01': 'Home & Mood & Atmosphere',
  'E-02': 'Home & Mood & Atmosphere',
  'E-03': 'Home & Mood & Atmosphere',
  'E-04': 'Home & Mood & Atmosphere',
  'E-05': 'Home & Mood & Atmosphere',
  'E-06': 'Home & Mood & Atmosphere',
  'E-07': 'Home & Mood & Atmosphere',
  'E-08': 'Home & Mood & Atmosphere',
  'E-09': 'Home & Mood & Atmosphere',
  'E-10': 'Home & Mood & Atmosphere',
  'E-11': 'Home & Mood & Atmosphere',
  'E-12': 'Home & Mood & Atmosphere',
  'E-13': 'Home & Mood & Atmosphere',
  'E-14': 'Home & Mood & Atmosphere',
  
  // E - Media & Experiences
  'F-01': 'Media & Experiences',
  'F-02': 'Media & Experiences',
  'F-03': 'Media & Experiences',
  'F-04': 'Media & Experiences',
  'F-05': 'Media & Experiences',
  'F-06': 'Media & Experiences',
  'F-07': 'Media & Experiences',
  'F-08': 'Media & Experiences',
  'F-09': 'Media & Experiences',
  'F-10': 'Media & Experiences',
  
  // F - Digital & Curated Services
  'G-01': 'Digital & Curated Services',
  'G-02': 'Digital & Curated Services',
  'G-03': 'Digital & Curated Services',
  'G-04': 'Digital & Curated Services',
  'G-05': 'Digital & Curated Services',
  'G-06': 'Digital & Curated Services',
  'G-07': 'Digital & Curated Services',
  
  // G - Culinary & Novelty
  'H-01': 'Culinary & Novelty',
  'H-02': 'Culinary & Novelty',
  'H-03': 'Culinary & Novelty',
  'H-04': 'Culinary & Novelty',
  'H-05': 'Culinary & Novelty',
  
  // H - Collector & Art-Based
  'I-01': 'Collector & Art-Based',
  'I-02': 'Collector & Art-Based',
  'I-03': 'Collector & Art-Based',
  'I-04': 'Collector & Art-Based',
  'I-05': 'Collector & Art-Based',
  'I-06': 'Collector & Art-Based',
  'I-07': 'Collector & Art-Based',
  
  // I - Live & Social Activation
  'J-01': 'Live & Social Activation',
  'J-02': 'Live & Social Activation',
  'J-03': 'Live & Social Activation',
  'J-04': 'Live & Social Activation',
  'J-05': 'Live & Social Activation',
  'J-06': 'Live & Social Activation',
  
  // J - Relationship & Erotic & Mystery-Inspired
  'K-01': 'Relationship & Erotic & Mystery-Inspired',
  'K-02': 'Relationship & Erotic & Mystery-Inspired',
  'K-03': 'Relationship & Erotic & Mystery-Inspired',
  'K-04': 'Relationship & Erotic & Mystery-Inspired',
  'K-05': 'Relationship & Erotic & Mystery-Inspired',
  'K-06': 'Relationship & Erotic & Mystery-Inspired',
  'K-07': 'Relationship & Erotic & Mystery-Inspired',
  'K-08': 'Relationship & Erotic & Mystery-Inspired',
  
  // Books (1a, 1b, 2a, 2b, 3a, 3b, 11a, 11b)
  'A-01': 'Serials/Books',
  'A-02': 'Serials/Books',
  'A-03': 'Serials/Books',
  'A-04': 'Serials/Books',
  'A-05': 'Serials/Books',
  'A-06': 'Serials/Books',
  'A-07': 'Serials/Books',
  'A-08': 'Serials/Books',
};

// All available categories (preserves existing website structure)
export const ALL_CATEGORIES = [
  "All",
  "Serials/Books",
  "Apparel & Intimate Wear", 
  "Auto & Mobility",
  "Accessories",
  "Home & Mood & Atmosphere",
  "Media & Experiences",
  "Digital & Curated Services",
  "Culinary & Novelty",
  "Collector & Art-Based",
  "Live & Social Activation",
  "Relationship & Erotic & Mystery-Inspired"
];

/**
 * Get category for a product based on its original DS ID
 */
export function getCategoryFromDsId(dsId: string): string {
  return CATEGORY_MAPPINGS[dsId] || 'Unknown';
}

/**
 * Get category for a product based on its Shopify ID
 * This will be populated during migration
 */
export function getCategoryFromShopifyId(shopifyId: string): string {
  // This will be populated during the Shopify ID migration
  // For now, return a default category
  return 'Unknown';
}

/**
 * Create category mapping for migration
 */
export function createCategoryMapping(originalDsId: string, shopifyId: string): CategoryMapping {
  return {
    shopifyId,
    dsCategory: getCategoryFromDsId(originalDsId),
    originalDsId
  };
}

/**
 * Validate that all products have category mappings
 */
export function validateCategoryMappings(products: any[]): { valid: boolean; missing: string[] } {
  const missing: string[] = [];
  
  products.forEach(product => {
    if (!CATEGORY_MAPPINGS[product.id]) {
      missing.push(product.id);
    }
  });
  
  return {
    valid: missing.length === 0,
    missing
  };
}
