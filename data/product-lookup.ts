/**
 * Master Product Lookup Table
 * Single source of truth for all product identifiers and metadata
 * Maps all platforms: DS, Shopify, Amazon, GTIN, etc.
 */

export interface ProductLookup {
  // Primary identifiers
  dsProductId: string; // Our internal ID (will be Shopify ID after migration)
  originalDsId?: string; // Original alpha-numeric ID for reference
  
  // Platform identifiers
  shopifyId?: string;
  shopifyHandle?: string;
  amazonASIN?: string;
  amazonSKU?: string;
  
  // GTIN identifiers (Amazon compliance)
  gtin?: string; // Global Trade Item Number
  upc?: string; // Universal Product Code (12-digit)
  ean?: string; // European Article Number (13-digit)
  isbn?: string; // International Standard Book Number (books)
  
  // Product metadata
  title: string;
  category: string;
  subCategory?: string;
  author?: string;
  price: number;
  description: string;
  image: string;
  inStock: boolean;
  badge?: string;
  
  // Fulfillment
  fulfillmentProvider: 'amazon_fba' | 'apparel_vendor' | 'manual' | 'digital';
  vendorId?: string;
  
  // Inventory
  inventory?: {
    amazonFBA?: number;
    vendorStock?: number;
    reserved?: number;
    lastUpdated: Date;
  };
  
  // Status
  status: 'active' | 'inactive' | 'discontinued' | 'in_design';
  lastSync: Date;
  syncStatus: 'synced' | 'pending' | 'error' | 'not_mapped';
}

// Master Product Lookup Table
export const PRODUCT_LOOKUP: { [key: string]: ProductLookup } = {
  // Books - Amazon FBA
  'A-01': {
    dsProductId: 'A-01', // Will become Shopify ID after migration
    originalDsId: '1a',
    title: 'First & Light- E-book',
    category: 'Serials/Books',
    author: 'Aries Tiger',
    price: 0,
    description: 'Stage One- First & Light',
    image: '/product-images/1a_first-light-ebook.jpg',
    inStock: true,
    badge: 'New',
    fulfillmentProvider: 'amazon_fba',
    amazonASIN: 'B0ABC123456', // Placeholder - will be assigned by Amazon
    isbn: '9781234567890', // Placeholder - needs real ISBN
    status: 'active',
    lastSync: new Date(),
    syncStatus: 'not_mapped'
  },
  'A-02': {
    dsProductId: 'A-02',
    originalDsId: '1b',
    title: 'First & Light- Paperback',
    category: 'Serials/Books',
    author: 'Aries Tiger',
    price: 9.99,
    description: 'Stage One- First & Light',
    image: '/product-images/1a_first-light-PaperBack.jpg',
    inStock: true,
    badge: 'New',
    fulfillmentProvider: 'amazon_fba',
    amazonASIN: 'B0ABC123457',
    isbn: '9781234567891',
    status: 'active',
    lastSync: new Date(),
    syncStatus: 'not_mapped'
  },
  'A-03': {
    dsProductId: 'A-03',
    originalDsId: '2a',
    title: 'Risque & Safety- E-book',
    category: 'Serials/Books',
    author: 'Aries Tiger',
    price: 4.99,
    description: 'Stage Two- Risque & Safety',
    image: '/product-images/2a_risque-safety-ebook.jpg',
    inStock: true,
    badge: 'New',
    fulfillmentProvider: 'amazon_fba',
    amazonASIN: 'B0ABC123458',
    isbn: '9781234567892',
    status: 'active',
    lastSync: new Date(),
    syncStatus: 'not_mapped'
  },
  'A-04': {
    dsProductId: 'A-04',
    originalDsId: '2b',
    title: 'Risque & Safety- Paperback',
    category: 'Serials/Books',
    author: 'Aries Tiger',
    price: 9.99,
    description: 'Stage Two- Risque & Safety',
    image: '/product-images/2a_risque-safety-PaperBack.jpg',
    inStock: true,
    badge: 'New',
    fulfillmentProvider: 'amazon_fba',
    amazonASIN: 'B0ABC123459',
    isbn: '9781234567893',
    status: 'active',
    lastSync: new Date(),
    syncStatus: 'not_mapped'
  },
  'A-05': {
    dsProductId: 'A-05',
    originalDsId: '3a',
    title: 'Mercury & Memory- E-book',
    category: 'Serials/Books',
    author: 'Aries Tiger',
    price: 4.99,
    description: 'Stage Three- Mercury & Memory',
    image: '/product-images/3a_mercury-memory-ebook.jpg',
    inStock: true,
    badge: 'New',
    fulfillmentProvider: 'amazon_fba',
    amazonASIN: 'B0ABC123460',
    isbn: '9781234567894',
    status: 'active',
    lastSync: new Date(),
    syncStatus: 'not_mapped'
  },
  'A-06': {
    dsProductId: 'A-06',
    originalDsId: '3b',
    title: 'Mercury & Memory- Paperback',
    category: 'Serials/Books',
    author: 'Aries Tiger',
    price: 9.99,
    description: 'Stage Three- Mercury & Memory',
    image: '/product-images/3a_mercury-memory-PaperBack.jpg',
    inStock: true,
    badge: 'New',
    fulfillmentProvider: 'amazon_fba',
    amazonASIN: 'B0ABC123461',
    isbn: '9781234567895',
    status: 'active',
    lastSync: new Date(),
    syncStatus: 'not_mapped'
  },
  
  // Apparel - Vendor Fulfillment
  'B-04': {
    dsProductId: 'B-04',
    originalDsId: 'A4',
    title: 'DarkStreet Tees',
    category: 'Apparel & Intimate Wear',
    author: 'DS LLC',
    price: 24.99,
    description: 'Quotes + neon visuals',
    image: '/product-images/Tees-2.jpg',
    inStock: true,
    badge: 'New',
    fulfillmentProvider: 'apparel_vendor',
    vendorId: 'apparel_vendor_001',
    shopifyId: 'shopify_tee_001', // Placeholder
    upc: '123456789012', // Placeholder - needs real UPC
    status: 'active',
    lastSync: new Date(),
    syncStatus: 'not_mapped'
  },
  'B-08': {
    dsProductId: 'B-08',
    originalDsId: 'A8',
    title: 'Hats',
    category: 'Apparel & Intimate Wear',
    author: 'DS LLC',
    price: 24.99,
    description: 'Baseball Caps',
    image: '/product-images/A8_hats.jpg',
    inStock: true,
    badge: 'New',
    fulfillmentProvider: 'apparel_vendor',
    vendorId: 'apparel_vendor_001',
    shopifyId: 'shopify_hat_001',
    upc: '123456789013',
    status: 'active',
    lastSync: new Date(),
    syncStatus: 'not_mapped'
  },
  'H-02': {
    dsProductId: 'H-02',
    originalDsId: 'G2',
    title: 'DarkStreet Mugs',
    category: 'Culinary & Novelty',
    author: 'DS LLC',
    price: 24.99,
    description: 'Joe on the Road',
    image: '/product-images/G2_dark-street-mug_Front.jpg',
    inStock: true,
    badge: 'New',
    fulfillmentProvider: 'apparel_vendor',
    vendorId: 'apparel_vendor_002',
    shopifyId: 'shopify_mug_001',
    upc: '123456789014',
    status: 'active',
    lastSync: new Date(),
    syncStatus: 'not_mapped'
  },
  
  // Digital Products
  'F-01': {
    dsProductId: 'F-01',
    originalDsId: 'E1',
    title: 'Official DarkStreet Driving Playlists',
    category: 'Media & Experiences',
    author: 'DS LLC',
    price: 24.99,
    description: 'Spotify/Apple collabs',
    image: '/product-images/E1_Official Dark Streets Driving Playlists.jpg',
    inStock: true,
    badge: 'New',
    fulfillmentProvider: 'digital',
    status: 'active',
    lastSync: new Date(),
    syncStatus: 'not_mapped'
  },
  'G-01': {
    dsProductId: 'G-01',
    originalDsId: 'F1',
    title: 'DS Route Generator App',
    category: 'Digital & Curated Services',
    author: 'DS LLC',
    price: 24.99,
    description: 'Find the darkest streets in your city',
    image: '/product-images/placeholder.jpg',
    inStock: true,
    badge: 'New',
    fulfillmentProvider: 'digital',
    status: 'active',
    lastSync: new Date(),
    syncStatus: 'not_mapped'
  },
  
  // Accessories - Manual Fulfillment (DSLLC Manufactured)
  'C-11': {
    dsProductId: 'C-11',
    title: 'DS-Card Sets',
    category: 'Accessories',
    author: 'DS LLC',
    price: 12.99,
    description: 'Hand-crafted confession and dare game cards. Explore sultry opportunities of asking and answering provocative questions. Choose from three unique sets: Lamp Post Set, Streeter Set, or After-Hours Set.',
    image: '/product-images/C-11_ds-card-sets.png',
    inStock: true,
    badge: 'New',
    fulfillmentProvider: 'manual',
    status: 'active',
    lastSync: new Date(),
    syncStatus: 'not_mapped'
    // Note: This product has 3 variants (Lamp Post Set, Streeter Set, After-Hours Set)
    // Variants are defined in data/products.ts
  }
};

// Helper functions for the lookup table
export const productLookup = {
  /**
   * Get product by DS Product ID
   */
  getByDsId(dsProductId: string): ProductLookup | undefined {
    return PRODUCT_LOOKUP[dsProductId];
  },
  
  /**
   * Get product by Shopify ID
   */
  getByShopifyId(shopifyId: string): ProductLookup | undefined {
    return Object.values(PRODUCT_LOOKUP).find(product => product.shopifyId === shopifyId);
  },
  
  /**
   * Get product by Amazon ASIN
   */
  getByAmazonASIN(asin: string): ProductLookup | undefined {
    return Object.values(PRODUCT_LOOKUP).find(product => product.amazonASIN === asin);
  },
  
  /**
   * Get product by UPC
   */
  getByUPC(upc: string): ProductLookup | undefined {
    return Object.values(PRODUCT_LOOKUP).find(product => product.upc === upc);
  },
  
  /**
   * Get product by ISBN
   */
  getByISBN(isbn: string): ProductLookup | undefined {
    return Object.values(PRODUCT_LOOKUP).find(product => product.isbn === isbn);
  },
  
  /**
   * Get all products by category
   */
  getByCategory(category: string): ProductLookup[] {
    return Object.values(PRODUCT_LOOKUP).filter(product => product.category === category);
  },
  
  /**
   * Get all products by fulfillment provider
   */
  getByFulfillmentProvider(provider: string): ProductLookup[] {
    return Object.values(PRODUCT_LOOKUP).filter(product => product.fulfillmentProvider === provider);
  },
  
  /**
   * Update product in lookup table
   */
  updateProduct(dsProductId: string, updates: Partial<ProductLookup>): ProductLookup | undefined {
    if (PRODUCT_LOOKUP[dsProductId]) {
      PRODUCT_LOOKUP[dsProductId] = {
        ...PRODUCT_LOOKUP[dsProductId],
        ...updates,
        lastSync: new Date()
      };
      return PRODUCT_LOOKUP[dsProductId];
    }
    return undefined;
  },
  
  /**
   * Add new product to lookup table
   */
  addProduct(product: ProductLookup): void {
    PRODUCT_LOOKUP[product.dsProductId] = product;
  },
  
  /**
   * Get all products
   */
  getAllProducts(): ProductLookup[] {
    return Object.values(PRODUCT_LOOKUP);
  },
  
  /**
   * Export lookup table to CSV
   */
  exportToCSV(): string {
    const headers = [
      'DS Product ID',
      'Original DS ID',
      'Title',
      'Category',
      'Shopify ID',
      'Shopify Handle',
      'Amazon ASIN',
      'Amazon SKU',
      'UPC',
      'EAN',
      'ISBN',
      'GTIN',
      'Fulfillment Provider',
      'Vendor ID',
      'Price',
      'Status',
      'Sync Status',
      'Last Sync'
    ];
    
    const rows = Object.values(PRODUCT_LOOKUP).map(product => [
      product.dsProductId,
      product.originalDsId || '',
      product.title,
      product.category,
      product.shopifyId || '',
      product.shopifyHandle || '',
      product.amazonASIN || '',
      product.amazonSKU || '',
      product.upc || '',
      product.ean || '',
      product.isbn || '',
      product.gtin || '',
      product.fulfillmentProvider,
      product.vendorId || '',
      product.price.toString(),
      product.status,
      product.syncStatus,
      product.lastSync.toISOString()
    ]);
    
    return [headers, ...rows].map(row => 
      row.map(field => `"${field}"`).join(',')
    ).join('\n');
  }
};
