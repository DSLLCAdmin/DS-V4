#!/usr/bin/env node

/**
 * Amazon FBA Integration Test Script
 * 
 * This script tests the Amazon FBA integration after setup
 * to ensure orders are properly routed to Amazon for fulfillment.
 */

const https = require('https');

console.log('🔍 AMAZON FBA INTEGRATION TEST');
console.log('='.repeat(50));

// Configuration
const SHOPIFY_STORE = 'wenugu-5b.myshopify.com';
const SHOPIFY_TOKEN = process.env.SHOPIFY_ADMIN_API_ACCESS_TOKEN || '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';

// Test products (books that should use Amazon FBA)
const testProducts = [
  { id: 'A-01', name: 'First & Light - Paperback', variantId: '42146492448866' },
  { id: 'A-02', name: 'Risque & Safety - Paperback', variantId: '42146492547170' },
  { id: 'A-03', name: 'Mercury & Memory - Paperback', variantId: '42146492612706' },
  { id: 'A-04', name: 'DarkStreets - Paperback', variantId: '42146492710950' },
  { id: 'A-05', name: 'The Fall - Paperback', variantId: '42146492809194' },
  { id: 'A-06', name: 'The Rise - Paperback', variantId: '42146492907438' },
  { id: 'A-07', name: 'The End - Paperback', variantId: '42146493005682' },
  { id: 'A-08', name: 'The Beginning - Paperback', variantId: '42146493103926' }
];

async function testProductFulfillment(product) {
  return new Promise((resolve) => {
    const url = `https://${SHOPIFY_STORE}/admin/api/2024-04/variants/${product.variantId}.json`;
    
    const req = https.request(url, {
      headers: {
        'X-Shopify-Access-Token': SHOPIFY_TOKEN,
        'Content-Type': 'application/json'
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          if (result.variant) {
            const variant = result.variant;
            const fulfillmentService = variant.fulfillment_service || 'manual';
            const inventoryManagement = variant.inventory_management || 'shopify';
            
            resolve({
              success: true,
              product: product.name,
              fulfillmentService: fulfillmentService,
              inventoryManagement: inventoryManagement,
              requiresShipping: variant.requires_shipping,
              status: fulfillmentService === 'amazon_fba' ? '✅ AMAZON FBA' : '❌ MANUAL'
            });
          } else {
            resolve({
              success: false,
              product: product.name,
              error: 'Variant not found'
            });
          }
        } catch (e) {
          resolve({
            success: false,
            product: product.name,
            error: e.message
          });
        }
      });
    });
    
    req.on('error', (err) => {
      resolve({
        success: false,
        product: product.name,
        error: err.message
      });
    });
    
    req.end();
  });
}

async function testAllProducts() {
  console.log('\n📚 TESTING ALL BOOK PRODUCTS:');
  console.log('='.repeat(50));
  
  const results = [];
  
  for (const product of testProducts) {
    console.log(`\n🔍 Testing ${product.name}...`);
    const result = await testProductFulfillment(product);
    results.push(result);
    
    if (result.success) {
      console.log(`  ✅ Status: ${result.status}`);
      console.log(`  📦 Fulfillment Service: ${result.fulfillmentService}`);
      console.log(`  📊 Inventory Management: ${result.inventoryManagement}`);
      console.log(`  🚚 Requires Shipping: ${result.requiresShipping}`);
    } else {
      console.log(`  ❌ Error: ${result.error}`);
    }
  }
  
  // Summary
  console.log('\n📊 SUMMARY:');
  console.log('='.repeat(50));
  
  const amazonFbaCount = results.filter(r => r.success && r.fulfillmentService === 'amazon_fba').length;
  const manualCount = results.filter(r => r.success && r.fulfillmentService === 'manual').length;
  const errorCount = results.filter(r => !r.success).length;
  
  console.log(`✅ Amazon FBA: ${amazonFbaCount}/${testProducts.length} products`);
  console.log(`❌ Manual Fulfillment: ${manualCount}/${testProducts.length} products`);
  console.log(`⚠️  Errors: ${errorCount}/${testProducts.length} products`);
  
  if (amazonFbaCount === testProducts.length) {
    console.log('\n🎉 SUCCESS: All products are configured for Amazon FBA!');
    console.log('Orders will be automatically routed to Amazon for fulfillment.');
  } else if (manualCount > 0) {
    console.log('\n⚠️  WARNING: Some products are still set to manual fulfillment.');
    console.log('These orders will NOT be sent to Amazon automatically.');
    console.log('\n🔧 TO FIX:');
    console.log('1. Go to Shopify Admin > Products');
    console.log('2. Edit each product that shows "MANUAL"');
    console.log('3. Set Fulfillment Service to "Amazon FBA"');
    console.log('4. Save changes');
  }
  
  if (errorCount > 0) {
    console.log('\n❌ ERRORS FOUND:');
    results.filter(r => !r.success).forEach(r => {
      console.log(`  - ${r.product}: ${r.error}`);
    });
  }
}

// Run the test
testAllProducts().catch(console.error);
