/**
 * Test Shopify Product Import
 * Validates the first 10 products are ready for Shopify import
 */

const { unifiedProductCatalog } = require('../lib/unified-product-data.ts');
const { filterProductsForShopify, getShopifyStatusMessage, getShopifyProductCount } = require('../lib/shopify-product-filter.ts');
const { FIRST_10_PRODUCTS, validateProductsForImport } = require('../lib/shopify-product-import.ts');

console.log('🛍️  Shopify Product Import Test\n');

// Get all products
const allProducts = unifiedProductCatalog.getProducts();
console.log(`📊 Total DS Products: ${allProducts.length}`);

// Check Shopify status
console.log(`\n🔧 Shopify Status: ${getShopifyStatusMessage()}`);

// Get products available for Shopify
const shopifyProducts = filterProductsForShopify(allProducts);
console.log(`📦 Products Available for Shopify: ${shopifyProducts.length}`);

// Validate first 10 products
const validation = validateProductsForImport(allProducts);
console.log(`\n✅ Valid Products for Import: ${validation.valid.length}`);
console.log(`❌ Invalid Products: ${validation.invalid.length}`);

if (validation.invalid.length > 0) {
  console.log('\n🚨 Invalid Products:');
  validation.invalid.forEach(({ product, reason }) => {
    console.log(`   - ${product.title} (${product.id}): ${reason}`);
  });
}

// Show first 10 products
console.log('\n📋 First 10 Products for Shopify Import:');
validation.valid.forEach((product, index) => {
  console.log(`   ${index + 1}. ${product.title} (${product.id})`);
  console.log(`      Category: ${product.category}`);
  console.log(`      Price: $${product.price}`);
  console.log(`      In Stock: ${product.inStock ? 'Yes' : 'No'}`);
  console.log('');
});

// Summary
console.log('📈 Import Summary:');
console.log(`   - Books (Category A): ${validation.valid.filter(p => p.category === 'Serials/Books').length}`);
console.log(`   - Apparel (Category B): ${validation.valid.filter(p => p.category === 'Apparel & Intimate Wear').length}`);
console.log(`   - Total Ready: ${validation.valid.length}/10`);

if (validation.valid.length === 10) {
  console.log('\n🎉 All 10 products are ready for Shopify import!');
} else {
  console.log('\n⚠️  Some products need attention before import.');
}
