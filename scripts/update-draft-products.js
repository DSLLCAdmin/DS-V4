#!/usr/bin/env node

/**
 * Update DS LLC products to reflect Shopify Draft status
 * Sets all non-book products to inStock: false
 */

const fs = require('fs');
const path = require('path');

// Read the products file
const productsPath = path.join(__dirname, '..', 'data', 'products.ts');
let content = fs.readFileSync(productsPath, 'utf8');

console.log('🔄 UPDATING PRODUCTS TO REFLECT SHOPIFY DRAFT STATUS');
console.log('='.repeat(60));

// Count current inStock products
const inStockMatches = content.match(/"inStock": true/g);
const currentInStock = inStockMatches ? inStockMatches.length : 0;
console.log(`📊 Current inStock products: ${currentInStock}`);

// Find all products that are NOT books
const bookCategoryPattern = /"category": "Serials\/Books"/g;
const bookMatches = content.match(bookCategoryPattern);
const bookCount = bookMatches ? bookMatches.length : 0;
console.log(`📚 Book products (keeping active): ${bookCount}`);

// Update non-book products to inStock: false
let updatedCount = 0;
let bookProductsSkipped = 0;

// Split content into lines for processing
const lines = content.split('\n');
let inBookSection = false;
let currentProductId = '';

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  
  // Check if we're entering a product object
  if (line.includes('"id":')) {
    const idMatch = line.match(/"id": "([^"]+)"/);
    if (idMatch) {
      currentProductId = idMatch[1];
    }
  }
  
  // Check if this is a book category
  if (line.includes('"category": "Serials/Books"')) {
    inBookSection = true;
    bookProductsSkipped++;
    console.log(`📚 Skipping book product: ${currentProductId}`);
  }
  
  // Check if we're leaving the product object
  if (line.includes('},') || line.includes('}]')) {
    inBookSection = false;
  }
  
  // Update inStock for non-book products
  if (line.includes('"inStock": true') && !inBookSection) {
    lines[i] = line.replace('"inStock": true', '"inStock": false, // MOVED TO DRAFT IN SHOPIFY');
    updatedCount++;
    console.log(`📦 Updated to draft: ${currentProductId}`);
  }
}

// Join lines back together
const updatedContent = lines.join('\n');

// Write the updated content
fs.writeFileSync(productsPath, updatedContent, 'utf8');

console.log('\n✅ UPDATE COMPLETE');
console.log('='.repeat(60));
console.log(`📚 Book products kept active: ${bookProductsSkipped}`);
console.log(`📦 Products moved to draft: ${updatedCount}`);
console.log(`📊 Total products processed: ${bookProductsSkipped + updatedCount}`);

// Verify the update
const newInStockMatches = updatedContent.match(/"inStock": true/g);
const newInStock = newInStockMatches ? newInStockMatches.length : 0;
console.log(`\n🔍 Verification:`);
console.log(`   Before: ${currentInStock} inStock products`);
console.log(`   After: ${newInStock} inStock products`);
console.log(`   Expected: ${bookCount} book products`);

if (newInStock === bookCount) {
  console.log('✅ SUCCESS: Only book products remain active!');
} else {
  console.log('⚠️  WARNING: Product count mismatch - please verify manually');
}

console.log('\n🚀 Next steps:');
console.log('1. Test the website to ensure only books are purchasable');
console.log('2. Gradually reactivate products as vendors are configured');
console.log('3. Update inStock status when products are ready for sale');
