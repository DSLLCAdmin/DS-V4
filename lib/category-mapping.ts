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
  'A1': 'Apparel & Intimate Wear',
  'A2': 'Apparel & Intimate Wear', 
  'A3': 'Apparel & Intimate Wear',
  'A4': 'Apparel & Intimate Wear',
  'A5': 'Apparel & Intimate Wear',
  'A6': 'Apparel & Intimate Wear',
  'A7': 'Apparel & Intimate Wear',
  'A8': 'Apparel & Intimate Wear',
  'A9': 'Apparel & Intimate Wear',
  'A10': 'Apparel & Intimate Wear',
  
  // B - Auto & Mobility
  'B1': 'Auto & Mobility',
  'B2': 'Auto & Mobility',
  'B3': 'Auto & Mobility',
  'B4': 'Auto & Mobility',
  'B5': 'Auto & Mobility',
  'B6': 'Auto & Mobility',
  'B7': 'Auto & Mobility',
  'B8': 'Auto & Mobility',
  'B9': 'Auto & Mobility',
  'B10': 'Auto & Mobility',
  
  // C - Accessories
  'C1': 'Accessories',
  'C2': 'Accessories',
  'C3': 'Accessories',
  'C4': 'Accessories',
  'C5': 'Accessories',
  'C6': 'Accessories',
  'C7': 'Accessories',
  'C8': 'Accessories',
  'C9': 'Accessories',
  'C10': 'Accessories',
  
  // D - Home & Mood & Atmosphere
  'D1': 'Home & Mood & Atmosphere',
  'D2': 'Home & Mood & Atmosphere',
  'D3': 'Home & Mood & Atmosphere',
  'D4': 'Home & Mood & Atmosphere',
  'D5': 'Home & Mood & Atmosphere',
  'D6': 'Home & Mood & Atmosphere',
  'D7': 'Home & Mood & Atmosphere',
  'D8': 'Home & Mood & Atmosphere',
  'D9': 'Home & Mood & Atmosphere',
  'D10': 'Home & Mood & Atmosphere',
  'D11': 'Home & Mood & Atmosphere',
  'D12': 'Home & Mood & Atmosphere',
  'D13': 'Home & Mood & Atmosphere',
  'D14': 'Home & Mood & Atmosphere',
  
  // E - Media & Experiences
  'E1': 'Media & Experiences',
  'E2': 'Media & Experiences',
  'E3': 'Media & Experiences',
  'E4': 'Media & Experiences',
  'E5': 'Media & Experiences',
  'E6': 'Media & Experiences',
  'E7': 'Media & Experiences',
  'E8': 'Media & Experiences',
  'E9': 'Media & Experiences',
  'E10': 'Media & Experiences',
  
  // F - Digital & Curated Services
  'F1': 'Digital & Curated Services',
  'F2': 'Digital & Curated Services',
  'F3': 'Digital & Curated Services',
  'F4': 'Digital & Curated Services',
  'F5': 'Digital & Curated Services',
  'F6': 'Digital & Curated Services',
  'F7': 'Digital & Curated Services',
  
  // G - Culinary & Novelty
  'G1': 'Culinary & Novelty',
  'G2': 'Culinary & Novelty',
  'G3': 'Culinary & Novelty',
  'G4': 'Culinary & Novelty',
  'G5': 'Culinary & Novelty',
  
  // H - Collector & Art-Based
  'H1': 'Collector & Art-Based',
  'H2': 'Collector & Art-Based',
  'H3': 'Collector & Art-Based',
  'H4': 'Collector & Art-Based',
  'H5': 'Collector & Art-Based',
  'H6': 'Collector & Art-Based',
  'H7': 'Collector & Art-Based',
  
  // I - Live & Social Activation
  'I1': 'Live & Social Activation',
  'I2': 'Live & Social Activation',
  'I3': 'Live & Social Activation',
  'I4': 'Live & Social Activation',
  'I5': 'Live & Social Activation',
  'I6': 'Live & Social Activation',
  
  // J - Relationship & Erotic & Mystery-Inspired
  'J1': 'Relationship & Erotic & Mystery-Inspired',
  'J2': 'Relationship & Erotic & Mystery-Inspired',
  'J3': 'Relationship & Erotic & Mystery-Inspired',
  'J4': 'Relationship & Erotic & Mystery-Inspired',
  'J5': 'Relationship & Erotic & Mystery-Inspired',
  'J6': 'Relationship & Erotic & Mystery-Inspired',
  'J7': 'Relationship & Erotic & Mystery-Inspired',
  'J8': 'Relationship & Erotic & Mystery-Inspired',
  
  // Books (1a, 1b, 2a, 2b, 3a, 3b, 11a, 11b)
  '1a': 'Serials/Books',
  '1b': 'Serials/Books',
  '2a': 'Serials/Books',
  '2b': 'Serials/Books',
  '3a': 'Serials/Books',
  '3b': 'Serials/Books',
  '11a': 'Serials/Books',
  '11b': 'Serials/Books',
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
