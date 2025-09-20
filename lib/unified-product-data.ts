/**
 * Unified Product Data System
 * Single source of truth for all product data across the platform
 * Serves both customer-facing pages and admin dashboards
 */

import { products } from '@/data/products';
import { ProductMapping, CatalogSyncStatus, SyncError } from '@/lib/product-catalog';

// Extended product interface that includes admin data
export interface UnifiedProduct {
  // Core product data (from data/products.ts)
  id: string;
  category: string;
  title: string;
  author: string;
  price: number;
  description: string;
  longDescription?: string;
  image: string;
  inStock: boolean;
  badge?: string;
  
  // Admin/mapping data
  mappings?: ProductMapping;
  fulfillmentProvider?: 'amazon_fba' | 'apparel_vendor' | 'manual' | 'digital';
  syncStatus?: 'synced' | 'pending' | 'error' | 'not_mapped';
  lastSync?: Date;
  
  // External platform IDs
  shopifyId?: string;
  amazonASIN?: string;
  gtin?: string;
  upc?: string;
  ean?: string;
  isbn?: string;
  
  // Vendor information
  vendorId?: string;
}

// Generate admin mappings from core product data
function generateProductMappings(): ProductMapping[] {
  return products.map(product => {
    // Determine fulfillment provider based on category and product type
    let fulfillmentProvider: 'amazon_fba' | 'apparel_vendor' | 'manual' | 'digital' = 'manual';
    let shopifyId: string | undefined;
    let amazonASIN: string | undefined;
    let isbn: string | undefined;
    
    // Books (Category A) - Amazon FBA
    if (product.category === 'Serials/Books') {
      fulfillmentProvider = 'amazon_fba';
      // Generate mock Amazon ASIN for books
      amazonASIN = `B0ABC${String(product.id.charCodeAt(0)).padStart(3, '0')}${String(product.id.charCodeAt(3)).padStart(3, '0')}`;
      // Generate mock ISBN for books
      isbn = `978${String(Date.now()).slice(-9)}`;
    }
    // Apparel (Category B) - Vendor Fulfillment
    else if (product.category === 'Apparel & Intimate Wear') {
      fulfillmentProvider = 'apparel_vendor';
      shopifyId = `shopify_${product.id.toLowerCase().replace('-', '_')}`;
    }
    // Digital products (Categories F, G) - Digital
    else if (product.category === 'Media & Experiences' || product.category === 'Digital & Curated Services') {
      fulfillmentProvider = 'digital';
    }
    // Culinary (Category H) - Vendor Fulfillment
    else if (product.category === 'Culinary & Novelty') {
      fulfillmentProvider = 'apparel_vendor';
      shopifyId = `shopify_${product.id.toLowerCase().replace('-', '_')}`;
    }
    
    return {
      dsProductId: product.id,
      shopifyId,
      amazonASIN,
      isbn,
      fulfillmentProvider,
      lastSync: new Date(),
      syncStatus: 'synced' as const
    };
  });
}

// Generate unified products with admin data
function generateUnifiedProducts(): UnifiedProduct[] {
  const mappings = generateProductMappings();
  
  return products.map(product => {
    const mapping = mappings.find(m => m.dsProductId === product.id);
    
    return {
      ...product,
      mappings: mapping, // Single mapping, not array
      fulfillmentProvider: mapping?.fulfillmentProvider,
      syncStatus: mapping?.syncStatus,
      lastSync: mapping?.lastSync,
      shopifyId: mapping?.shopifyId,
      amazonASIN: mapping?.amazonASIN,
      isbn: mapping?.isbn
    };
  });
}

// Export unified data
export const unifiedProducts = generateUnifiedProducts();
export const productMappings = generateProductMappings();

// Generate sync status
export const catalogSyncStatus: CatalogSyncStatus = {
  totalProducts: products.length,
  syncedProducts: productMappings.filter(m => m.syncStatus === 'synced').length,
  pendingSync: productMappings.filter(m => m.syncStatus === 'pending').length,
  syncErrors: productMappings.filter(m => m.syncStatus === 'error').length,
  lastFullSync: new Date(),
  nextScheduledSync: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours from now
};

// Generate sync errors (empty for now, but structure is ready)
export const syncErrors: SyncError[] = [];

// Utility functions for admin dashboards
export const unifiedProductCatalog = {
  /**
   * Get all product mappings (for admin dashboard)
   */
  getMappings(): ProductMapping[] {
    return productMappings;
  },

  /**
   * Get mapping for specific DS product ID
   */
  getMapping(dsProductId: string): ProductMapping | undefined {
    return productMappings.find(m => m.dsProductId === dsProductId);
  },

  /**
   * Get all unified products (for admin dashboard)
   */
  getUnifiedProducts(): UnifiedProduct[] {
    return unifiedProducts;
  },

  /**
   * Get unified product by ID
   */
  getUnifiedProduct(id: string): UnifiedProduct | undefined {
    return unifiedProducts.find(p => p.id === id);
  },

  /**
   * Get sync status
   */
  getSyncStatus(): CatalogSyncStatus {
    return catalogSyncStatus;
  },

  /**
   * Get sync errors
   */
  getSyncErrors(): SyncError[] {
    return syncErrors;
  },

  /**
   * Get products by fulfillment provider
   */
  getProductsByProvider(provider: string): UnifiedProduct[] {
    return unifiedProducts.filter(p => p.fulfillmentProvider === provider);
  },

  /**
   * Get products by category
   */
  getProductsByCategory(category: string): UnifiedProduct[] {
    return unifiedProducts.filter(p => p.category === category);
  },

  /**
   * Validate data consistency (check for divergences)
   */
  validateConsistency(): { isValid: boolean; issues: string[] } {
    const issues: string[] = [];
    
    // Check if all products have mappings
    const productsWithoutMappings = products.filter(p => 
      !productMappings.some(m => m.dsProductId === p.id)
    );
    
    if (productsWithoutMappings.length > 0) {
      issues.push(`${productsWithoutMappings.length} products missing mappings: ${productsWithoutMappings.map(p => p.id).join(', ')}`);
    }
    
    // Check if all mappings have corresponding products
    const mappingsWithoutProducts = productMappings.filter(m => 
      !products.some(p => p.id === m.dsProductId)
    );
    
    if (mappingsWithoutProducts.length > 0) {
      issues.push(`${mappingsWithoutProducts.length} mappings without products: ${mappingsWithoutProducts.map(m => m.dsProductId).join(', ')}`);
    }
    
    return {
      isValid: issues.length === 0,
      issues
    };
  }
};

// Log validation results on import
const validation = unifiedProductCatalog.validateConsistency();
if (!validation.isValid) {
  console.warn('🚨 Product data consistency issues detected:', validation.issues);
} else {
  console.log('✅ Product data consistency validated successfully');
}
