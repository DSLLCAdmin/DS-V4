/**
 * Shopify Product Import System
 * Handles importing DarkStreet products to Shopify with proper categorization and pricing
 */

import { UnifiedProduct } from './unified-product-data';
import { createShopifyProduct, ShopifyProduct } from './shopify-integration';
import { filterProductsForShopify, getShopifyStatusMessage } from './shopify-product-filter';

export interface ImportProduct {
  dsProduct: UnifiedProduct;
  shopifyProduct?: ShopifyProduct;
  importStatus: 'pending' | 'success' | 'failed' | 'skipped';
  error?: string;
  shopifyId?: string;
}

export interface ImportResult {
  totalProducts: number;
  successfulImports: number;
  failedImports: number;
  skippedImports: number;
  products: ImportProduct[];
  errors: string[];
}

/**
 * First 10 products to import to Shopify
 * 6 Books (Category A) + 4 Apparel (Category B)
 */
export const FIRST_10_PRODUCTS = [
  // Books - Category A (actual products that exist)
  'A-02', // First & Light Paperback  
  'A-03', // Risque & Safety E-book
  'A-04', // Risque & Safety Paperback
  'A-05', // Mercury & Memory E-book
  'A-06', // Mercury & Memory Paperback
  
  // Apparel - Category B (actual products that exist)
  'B-01', // DarkStreet Panties
  'B-02', // Mesh Bodysuits
  'B-03', // Asphalt Black Denim Jackets
  'B-04', // DarkStreet Tees
  'B-05', // Additional apparel item
];

/**
 * Product category mapping for Shopify
 */
export const SHOPIFY_CATEGORY_MAP: { [key: string]: string } = {
  'Serials/Books': 'Books & Media',
  'Apparel & Intimate Wear': 'Apparel & Accessories',
  'Culinary & Novelty': 'Home & Kitchen',
  'Media & Experiences': 'Digital Products',
  'Digital & Curated Services': 'Digital Services',
};

/**
 * Product type mapping for Shopify
 */
export const SHOPIFY_PRODUCT_TYPE_MAP: { [key: string]: string } = {
  'Serials/Books': 'Books',
  'Apparel & Intimate Wear': 'Apparel',
  'Culinary & Novelty': 'Home & Kitchen',
  'Media & Experiences': 'Digital Media',
  'Digital & Curated Services': 'Digital Services',
};

/**
 * Generate Shopify product data from DS product
 */
export function generateShopifyProductData(dsProduct: UnifiedProduct): any {
  const shopifyCategory = SHOPIFY_CATEGORY_MAP[dsProduct.category] || dsProduct.category;
  const shopifyProductType = SHOPIFY_PRODUCT_TYPE_MAP[dsProduct.category] || 'General';
  
  // Generate tags based on product attributes
  const tags = [
    'darkstreet',
    dsProduct.category.toLowerCase().replace(/[^a-z0-9]/g, '-'),
    shopifyProductType.toLowerCase(),
    dsProduct.id.toLowerCase()
  ].filter(Boolean);

  // Generate product description
  const description = `
    <div class="product-description">
      <h3>About This Product</h3>
      <p>${dsProduct.description}</p>
      ${dsProduct.longDescription ? `<p>${dsProduct.longDescription}</p>` : ''}
      
      <h4>Product Details</h4>
      <ul>
        <li><strong>Product ID:</strong> ${dsProduct.id}</li>
        <li><strong>Category:</strong> ${dsProduct.category}</li>
        <li><strong>Author/Creator:</strong> ${dsProduct.author}</li>
        ${dsProduct.badge ? `<li><strong>Special:</strong> ${dsProduct.badge}</li>` : ''}
      </ul>
      
      <h4>About DarkStreet LLC</h4>
      <p>Discover the world of DarkStreet through our carefully curated collection of books, apparel, and digital experiences. Each product is crafted with attention to detail and quality.</p>
    </div>
  `;

  return {
    title: dsProduct.title,
    body_html: description,
    vendor: 'DarkStreet LLC',
    product_type: shopifyProductType,
    tags: tags.join(', '),
    status: dsProduct.inStock ? 'active' : 'draft',
    variants: [{
      price: dsProduct.price.toString(),
      sku: dsProduct.id,
      inventory_quantity: dsProduct.inStock ? 999 : 0,
      inventory_policy: 'deny',
      fulfillment_service: 'manual',
      requires_shipping: dsProduct.category !== 'Digital & Curated Services',
      taxable: true,
      weight: getProductWeight(dsProduct.category),
      weight_unit: 'kg',
      option1: 'Default Title'
    }],
    options: [{
      name: 'Title',
      values: ['Default Title']
    }]
  };
}

/**
 * Get product weight based on category
 */
function getProductWeight(category: string): number {
  switch (category) {
    case 'Serials/Books':
      return 0.3; // Books are lightweight
    case 'Apparel & Intimate Wear':
      return 0.2; // Apparel items
    case 'Culinary & Novelty':
      return 0.5; // Mugs and kitchen items
    case 'Media & Experiences':
    case 'Digital & Curated Services':
      return 0.0; // Digital products have no weight
    default:
      return 0.3;
  }
}

/**
 * Import first 10 products to Shopify
 */
export async function importFirst10Products(dsProducts: UnifiedProduct[]): Promise<ImportResult> {
  const result: ImportResult = {
    totalProducts: 0,
    successfulImports: 0,
    failedImports: 0,
    skippedImports: 0,
    products: [],
    errors: []
  };

  // Filter to first 10 products AND check Shopify availability
  const productsToImport = dsProducts.filter(product => 
    FIRST_10_PRODUCTS.includes(product.id)
  );

  // Apply Shopify availability filter
  const shopifyAvailableProducts = filterProductsForShopify(productsToImport);

  result.totalProducts = shopifyAvailableProducts.length;

  // If no products are available for Shopify, return early
  if (shopifyAvailableProducts.length === 0) {
    result.errors.push(getShopifyStatusMessage());
    return result;
  }

  for (const dsProduct of shopifyAvailableProducts) {
    const importProduct: ImportProduct = {
      dsProduct,
      importStatus: 'pending'
    };

    try {
      // Generate Shopify product data
      const shopifyData = generateShopifyProductData(dsProduct);
      
      // Create product in Shopify
      const shopifyProduct = await createShopifyProduct(dsProduct);
      
      if (shopifyProduct) {
        importProduct.shopifyProduct = shopifyProduct;
        importProduct.shopifyId = shopifyProduct.id.toString();
        importProduct.importStatus = 'success';
        result.successfulImports++;
        
        console.log(`✅ Imported: ${dsProduct.title} (${dsProduct.id})`);
      } else {
        importProduct.importStatus = 'failed';
        importProduct.error = 'Failed to create Shopify product';
        result.failedImports++;
        result.errors.push(`Failed to import ${dsProduct.title} (${dsProduct.id})`);
      }
    } catch (error) {
      importProduct.importStatus = 'failed';
      importProduct.error = error instanceof Error ? error.message : 'Unknown error';
      result.failedImports++;
      result.errors.push(`Error importing ${dsProduct.title} (${dsProduct.id}): ${importProduct.error}`);
      
      console.error(`❌ Failed to import ${dsProduct.title}:`, error);
    }

    result.products.push(importProduct);
  }

  return result;
}

/**
 * Validate products before import
 */
export function validateProductsForImport(dsProducts: UnifiedProduct[]): {
  valid: UnifiedProduct[];
  invalid: { product: UnifiedProduct; reason: string }[];
} {
  const valid: UnifiedProduct[] = [];
  const invalid: { product: UnifiedProduct; reason: string }[] = [];

  for (const product of dsProducts) {
    if (!FIRST_10_PRODUCTS.includes(product.id)) {
      invalid.push({ product, reason: 'Not in first 10 products list' });
      continue;
    }

    if (!product.title || product.title.trim() === '') {
      invalid.push({ product, reason: 'Missing or empty title' });
      continue;
    }

    if (!product.price || product.price <= 0) {
      invalid.push({ product, reason: 'Invalid price' });
      continue;
    }

    if (!product.category) {
      invalid.push({ product, reason: 'Missing category' });
      continue;
    }

    valid.push(product);
  }

  return { valid, invalid };
}

/**
 * Generate import report
 */
export function generateImportReport(result: ImportResult): string {
  const report = `
# Shopify Product Import Report

## Summary
- **Total Products:** ${result.totalProducts}
- **Successful Imports:** ${result.successfulImports}
- **Failed Imports:** ${result.failedImports}
- **Skipped Imports:** ${result.skippedImports}
- **Success Rate:** ${result.totalProducts > 0 ? Math.round((result.successfulImports / result.totalProducts) * 100) : 0}%

## Product Details

${result.products.map(product => `
### ${product.dsProduct.title} (${product.dsProduct.id})
- **Status:** ${product.importStatus.toUpperCase()}
- **Category:** ${product.dsProduct.category}
- **Price:** $${product.dsProduct.price}
- **Shopify ID:** ${product.shopifyId || 'N/A'}
${product.error ? `- **Error:** ${product.error}` : ''}
`).join('')}

## Errors
${result.errors.length > 0 ? result.errors.map(error => `- ${error}`).join('\n') : 'No errors'}

---
Generated on: ${new Date().toLocaleString()}
  `;

  return report;
}
