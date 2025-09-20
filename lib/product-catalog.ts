/**
 * Product Catalog Integration System
 * Manages product data synchronization between DS LLC systems
 * Handles product mapping (DS product ID → Amazon ASIN, Shopify ID, etc.)
 */

export interface ProductMapping {
  dsProductId: string; // Now will be Shopify Product ID
  amazonASIN?: string;
  shopifyId?: string; // Redundant but kept for compatibility
  vendorId?: string;
  fulfillmentProvider: 'amazon_fba' | 'apparel_vendor' | 'manual' | 'digital';
  lastSync: Date;
  syncStatus: 'synced' | 'pending' | 'error' | 'not_mapped';
  // New fields for Amazon compliance
  gtin?: string; // UPC/EAN/ISBN
  upc?: string;
  ean?: string;
  isbn?: string; // For books
}

export interface ProductCatalog {
  id: string;
  dsProductId: string;
  title: string;
  category: string;
  price: number;
  description: string;
  image: string;
  inStock: boolean;
  badge?: string;
  mappings: ProductMapping;
  inventory: {
    amazonFBA?: number;
    vendorStock?: number;
    reserved?: number;
    lastUpdated: Date;
  };
  analytics: {
    views: number;
    addToCart: number;
    purchases: number;
    lastActivity: Date;
  };
  metadata: {
    created: Date;
    updated: Date;
    tags: string[];
    keywords: string[];
  };
}

export interface CatalogSyncStatus {
  totalProducts: number;
  syncedProducts: number;
  pendingSync: number;
  syncErrors: number;
  lastFullSync: Date;
  nextScheduledSync: Date;
}

export interface SyncError {
  productId: string;
  error: string;
  timestamp: Date;
  retryCount: number;
}

// Sample product mappings for DS LLC products (using new A-01, B-01 format)
const sampleMappings: ProductMapping[] = [
  // Books - Amazon FBA (Category A: Serials/Books)
  {
    dsProductId: 'A-01', // First & Light E-book
    shopifyId: 'shopify_book_001',
    amazonASIN: 'B0ABC123456',
    isbn: '9781234567890', // Example ISBN for books
    fulfillmentProvider: 'amazon_fba',
    lastSync: new Date(),
    syncStatus: 'synced'
  },
  {
    dsProductId: 'A-02', // First & Light Paperback
    amazonASIN: 'B0ABC123457',
    fulfillmentProvider: 'amazon_fba',
    lastSync: new Date(),
    syncStatus: 'synced'
  },
  {
    dsProductId: 'A-03', // Risque & Safety E-book
    amazonASIN: 'B0ABC123458',
    fulfillmentProvider: 'amazon_fba',
    lastSync: new Date(),
    syncStatus: 'synced'
  },
  {
    dsProductId: 'A-04', // Risque & Safety Paperback
    amazonASIN: 'B0ABC123459',
    fulfillmentProvider: 'amazon_fba',
    lastSync: new Date(),
    syncStatus: 'synced'
  },
  {
    dsProductId: 'A-05', // Mercury & Memory E-book
    amazonASIN: 'B0ABC123460',
    fulfillmentProvider: 'amazon_fba',
    lastSync: new Date(),
    syncStatus: 'synced'
  },
  {
    dsProductId: 'A-06', // Mercury & Memory Paperback
    amazonASIN: 'B0ABC123461',
    fulfillmentProvider: 'amazon_fba',
    lastSync: new Date(),
    syncStatus: 'synced'
  },
  // Apparel - Vendor Fulfillment (Category B: Apparel & Intimate Wear)
  {
    dsProductId: 'B-04', // DarkStreet Tees
    shopifyId: 'shopify_tee_001',
    vendorId: 'apparel_vendor_001',
    fulfillmentProvider: 'apparel_vendor',
    lastSync: new Date(),
    syncStatus: 'synced'
  },
  {
    dsProductId: 'B-08', // Hats
    shopifyId: 'shopify_hat_001',
    vendorId: 'apparel_vendor_001',
    fulfillmentProvider: 'apparel_vendor',
    lastSync: new Date(),
    syncStatus: 'synced'
  },
  {
    dsProductId: 'H-02', // DarkStreet Mugs (Category H: Culinary & Novelty)
    shopifyId: 'shopify_mug_001',
    vendorId: 'apparel_vendor_002',
    fulfillmentProvider: 'apparel_vendor',
    lastSync: new Date(),
    syncStatus: 'synced'
  },
  // Digital Products
  {
    dsProductId: 'F-01', // Official DarkStreet Driving Playlists (Category F: Media & Experiences)
    fulfillmentProvider: 'digital',
    lastSync: new Date(),
    syncStatus: 'synced'
  },
  {
    dsProductId: 'G-01', // DS Route Generator App (Category G: Digital & Curated Services)
    fulfillmentProvider: 'digital',
    lastSync: new Date(),
    syncStatus: 'synced'
  }
];

// In-memory storage (in production, this would be a database)
let productMappings: ProductMapping[] = [...sampleMappings];
let syncErrors: SyncError[] = [];

export const productCatalog = {
  /**
   * Get all product mappings
   */
  getMappings(): ProductMapping[] {
    return productMappings;
  },

  /**
   * Get mapping for specific DS product ID
   */
  getMapping(dsProductId: string): ProductMapping | undefined {
    return productMappings.find(mapping => mapping.dsProductId === dsProductId);
  },

  /**
   * Add or update product mapping
   */
  updateMapping(mapping: ProductMapping): ProductMapping {
    const existingIndex = productMappings.findIndex(m => m.dsProductId === mapping.dsProductId);
    
    if (existingIndex >= 0) {
      productMappings[existingIndex] = {
        ...mapping,
        lastSync: new Date(),
        syncStatus: 'synced'
      };
    } else {
      productMappings.push({
        ...mapping,
        lastSync: new Date(),
        syncStatus: 'synced'
      });
    }
    
    return productMappings[existingIndex >= 0 ? existingIndex : productMappings.length - 1];
  },

  /**
   * Remove product mapping
   */
  removeMapping(dsProductId: string): boolean {
    const index = productMappings.findIndex(m => m.dsProductId === dsProductId);
    if (index >= 0) {
      productMappings.splice(index, 1);
      return true;
    }
    return false;
  },

  /**
   * Get products by fulfillment provider
   */
  getProductsByProvider(provider: 'amazon_fba' | 'apparel_vendor' | 'manual' | 'digital'): ProductMapping[] {
    return productMappings.filter(mapping => mapping.fulfillmentProvider === provider);
  },

  /**
   * Get sync status overview
   */
  getSyncStatus(): CatalogSyncStatus {
    const totalProducts = productMappings.length;
    const syncedProducts = productMappings.filter(m => m.syncStatus === 'synced').length;
    const pendingSync = productMappings.filter(m => m.syncStatus === 'pending').length;
    const syncErrors = productMappings.filter(m => m.syncStatus === 'error').length;

    return {
      totalProducts,
      syncedProducts,
      pendingSync,
      syncErrors,
      lastFullSync: new Date(),
      nextScheduledSync: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours from now
    };
  },

  /**
   * Get sync errors
   */
  getSyncErrors(): SyncError[] {
    return syncErrors;
  },

  /**
   * Add sync error
   */
  addSyncError(productId: string, error: string): void {
    const existingError = syncErrors.find(e => e.productId === productId);
    
    if (existingError) {
      existingError.retryCount++;
      existingError.timestamp = new Date();
      existingError.error = error;
    } else {
      syncErrors.push({
        productId,
        error,
        timestamp: new Date(),
        retryCount: 0
      });
    }
  },

  /**
   * Clear sync error
   */
  clearSyncError(productId: string): void {
    const index = syncErrors.findIndex(e => e.productId === productId);
    if (index >= 0) {
      syncErrors.splice(index, 1);
    }
  },

  /**
   * Sync product with Amazon FBA
   */
  async syncWithAmazonFBA(dsProductId: string): Promise<boolean> {
    try {
      const mapping = this.getMapping(dsProductId);
      if (!mapping) {
        throw new Error(`No mapping found for product ${dsProductId}`);
      }

      // Simulate Amazon API call
      console.log(`🔄 Syncing ${dsProductId} with Amazon FBA...`);
      
      // Update mapping status
      mapping.syncStatus = 'synced';
      mapping.lastSync = new Date();
      
      // Clear any existing errors
      this.clearSyncError(dsProductId);
      
      return true;
    } catch (error) {
      this.addSyncError(dsProductId, error instanceof Error ? error.message : 'Unknown error');
      return false;
    }
  },

  /**
   * Sync product with Shopify
   */
  async syncWithShopify(dsProductId: string): Promise<boolean> {
    try {
      const mapping = this.getMapping(dsProductId);
      if (!mapping) {
        throw new Error(`No mapping found for product ${dsProductId}`);
      }

      // Simulate Shopify API call
      console.log(`🔄 Syncing ${dsProductId} with Shopify...`);
      
      // Update mapping status
      mapping.syncStatus = 'synced';
      mapping.lastSync = new Date();
      
      // Clear any existing errors
      this.clearSyncError(dsProductId);
      
      return true;
    } catch (error) {
      this.addSyncError(dsProductId, error instanceof Error ? error.message : 'Unknown error');
      return false;
    }
  },

  /**
   * Full catalog sync
   */
  async fullSync(): Promise<{ success: number; errors: number }> {
    console.log('🔄 Starting full catalog sync...');
    
    let successCount = 0;
    let errorCount = 0;

    for (const mapping of productMappings) {
      try {
        if (mapping.fulfillmentProvider === 'amazon_fba') {
          await this.syncWithAmazonFBA(mapping.dsProductId);
        } else if (mapping.fulfillmentProvider === 'apparel_vendor') {
          await this.syncWithShopify(mapping.dsProductId);
        }
        successCount++;
      } catch (error) {
        errorCount++;
        this.addSyncError(mapping.dsProductId, error instanceof Error ? error.message : 'Unknown error');
      }
    }

    console.log(`✅ Full sync completed: ${successCount} success, ${errorCount} errors`);
    return { success: successCount, errors: errorCount };
  },

  /**
   * Get products ready for Amazon FBA
   */
  getAmazonFBAProducts(): ProductMapping[] {
    return productMappings.filter(mapping => 
      mapping.fulfillmentProvider === 'amazon_fba' && 
      mapping.amazonASIN && 
      mapping.syncStatus === 'synced'
    );
  },

  /**
   * Get products ready for vendor fulfillment
   */
  getVendorFulfillmentProducts(): ProductMapping[] {
    return productMappings.filter(mapping => 
      mapping.fulfillmentProvider === 'apparel_vendor' && 
      mapping.shopifyId && 
      mapping.syncStatus === 'synced'
    );
  },

  /**
   * Validate product mapping
   */
  validateMapping(mapping: ProductMapping): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!mapping.dsProductId) {
      errors.push('DS Product ID is required');
    }

    if (!mapping.fulfillmentProvider) {
      errors.push('Fulfillment provider is required');
    }

    if (mapping.fulfillmentProvider === 'amazon_fba' && !mapping.amazonASIN) {
      errors.push('Amazon ASIN is required for Amazon FBA products');
    }

    if (mapping.fulfillmentProvider === 'apparel_vendor' && !mapping.shopifyId) {
      errors.push('Shopify ID is required for vendor fulfillment products');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  },

  /**
   * Export mappings to CSV
   */
  exportMappingsToCSV(): string {
    const headers = [
      'DS Product ID',
      'Amazon ASIN',
      'Shopify ID',
      'Vendor ID',
      'Fulfillment Provider',
      'Sync Status',
      'Last Sync'
    ];

    const rows = productMappings.map(mapping => [
      mapping.dsProductId,
      mapping.amazonASIN || '',
      mapping.shopifyId || '',
      mapping.vendorId || '',
      mapping.fulfillmentProvider,
      mapping.syncStatus,
      mapping.lastSync.toISOString()
    ]);

    return [headers, ...rows].map(row => 
      row.map(field => `"${field}"`).join(',')
    ).join('\n');
  }
};
