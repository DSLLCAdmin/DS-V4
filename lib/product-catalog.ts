/**
 * Product Catalog Integration System
 * Manages product data synchronization between DS LLC systems
 * Handles product mapping (DS product ID → Amazon ASIN, Shopify ID, etc.)
 */

export interface ProductMapping {
  dsProductId: string;
  amazonASIN?: string;
  shopifyId?: string;
  vendorId?: string;
  fulfillmentProvider: 'amazon_fba' | 'apparel_vendor' | 'manual' | 'digital';
  lastSync: Date;
  syncStatus: 'synced' | 'pending' | 'error' | 'not_mapped';
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

// Sample product mappings for DS LLC products
const sampleMappings: ProductMapping[] = [
  // Books - Amazon FBA
  {
    dsProductId: '1a',
    amazonASIN: 'B0ABC123456', // First & Light E-book
    fulfillmentProvider: 'amazon_fba',
    lastSync: new Date(),
    syncStatus: 'synced'
  },
  {
    dsProductId: '1b',
    amazonASIN: 'B0ABC123457', // First & Light Paperback
    fulfillmentProvider: 'amazon_fba',
    lastSync: new Date(),
    syncStatus: 'synced'
  },
  {
    dsProductId: '2a',
    amazonASIN: 'B0ABC123458', // Risque & Safety E-book
    fulfillmentProvider: 'amazon_fba',
    lastSync: new Date(),
    syncStatus: 'synced'
  },
  {
    dsProductId: '2b',
    amazonASIN: 'B0ABC123459', // Risque & Safety Paperback
    fulfillmentProvider: 'amazon_fba',
    lastSync: new Date(),
    syncStatus: 'synced'
  },
  {
    dsProductId: '3a',
    amazonASIN: 'B0ABC123460', // Mercury & Memory E-book
    fulfillmentProvider: 'amazon_fba',
    lastSync: new Date(),
    syncStatus: 'synced'
  },
  {
    dsProductId: '3b',
    amazonASIN: 'B0ABC123461', // Mercury & Memory Paperback
    fulfillmentProvider: 'amazon_fba',
    lastSync: new Date(),
    syncStatus: 'synced'
  },
  // Apparel - Vendor Fulfillment
  {
    dsProductId: 'A4',
    shopifyId: 'shopify_tee_001',
    vendorId: 'apparel_vendor_001',
    fulfillmentProvider: 'apparel_vendor',
    lastSync: new Date(),
    syncStatus: 'synced'
  },
  {
    dsProductId: 'A8',
    shopifyId: 'shopify_hat_001',
    vendorId: 'apparel_vendor_001',
    fulfillmentProvider: 'apparel_vendor',
    lastSync: new Date(),
    syncStatus: 'synced'
  },
  {
    dsProductId: 'G2',
    shopifyId: 'shopify_mug_001',
    vendorId: 'apparel_vendor_002',
    fulfillmentProvider: 'apparel_vendor',
    lastSync: new Date(),
    syncStatus: 'synced'
  },
  // Digital Products
  {
    dsProductId: 'E1',
    fulfillmentProvider: 'digital',
    lastSync: new Date(),
    syncStatus: 'synced'
  },
  {
    dsProductId: 'F1',
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
