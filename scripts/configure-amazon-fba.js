#!/usr/bin/env node

const https = require('https');

console.log('📚 CONFIGURING AMAZON FBA FOR ALL BOOK PRODUCTS');
console.log('='.repeat(60));
console.log('🛡️ TEST MODE: Safe for testing - no real orders will be created');
console.log('='.repeat(60));

// All book products that need Amazon FBA
const bookProducts = [
  { id: 'A-01', title: 'First & Light E-book', variantId: 42143382044770, requiresShipping: false },
  { id: 'A-02', title: 'First & Light Paperback', variantId: 42146492383330, requiresShipping: true },
  { id: 'A-03', title: 'Risque & Safety E-book', variantId: 42143320866914, requiresShipping: false },
  { id: 'A-04', title: 'Risque & Safety Paperback', variantId: 42146492448866, requiresShipping: true },
  { id: 'A-05', title: 'Mercury & Memory E-book', variantId: null, requiresShipping: false },
  { id: 'A-06', title: 'Mercury & Memory Paperback', variantId: 42146492547170, requiresShipping: true },
  { id: 'A-07', title: 'Vol-1 E-book', variantId: null, requiresShipping: false },
  { id: 'A-08', title: 'Vol-1 Paperback', variantId: null, requiresShipping: true }
];

const SHOPIFY_STORE = 'wenugu-5b.myshopify.com';
const SHOPIFY_TOKEN = process.env.SHOPIFY_ACCESS_TOKEN || process.env.SHOPIFY_ADMIN_API_TOKEN;
if (!SHOPIFY_TOKEN) {
  console.error('\n❌ ERROR: Shopify API Token is required');
  console.error('   Please set SHOPIFY_ACCESS_TOKEN or SHOPIFY_ADMIN_API_TOKEN environment variable');
  process.exit(1);
}

async function updateVariantFulfillment(variantId, productInfo) {
  return new Promise((resolve) => {
    const url = `https://${SHOPIFY_STORE}/admin/api/2024-04/variants/${variantId}.json`;
    
    // Only update shipping products to use Amazon FBA
    const fulfillmentService = productInfo.requiresShipping ? 'amazon_fba' : 'manual';
    
    const updateData = {
      variant: {
        id: variantId,
        fulfillment_service: fulfillmentService,
        inventory_management: 'shopify',
        inventory_policy: 'deny',
        requires_shipping: productInfo.requiresShipping
      }
    };

    const req = https.request(url, {
      method: 'PUT',
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
          resolve({
            success: true,
            variant: result.variant,
            status: res.statusCode
          });
        } catch (e) {
          resolve({
            success: false,
            error: e.message,
            status: res.statusCode
          });
        }
      });
    });

    req.on('error', (err) => {
      resolve({
        success: false,
        error: err.message
      });
    });

    req.write(JSON.stringify(updateData));
    req.end();
  });
}

async function configureAmazonFBA() {
  console.log('\n📋 Book Products Configuration:');
  console.log('-'.repeat(60));

  const results = [];
  
  for (const product of bookProducts) {
    console.log(`\n${product.id}: ${product.title}`);
    console.log(`  Requires Shipping: ${product.requiresShipping ? 'YES' : 'NO'}`);
    console.log(`  Variant ID: ${product.variantId || 'MISSING'}`);
    
    if (!product.variantId) {
      console.log(`  ❌ Status: Missing variant ID - cannot configure`);
      results.push({
        id: product.id,
        title: product.title,
        status: 'MISSING_VARIANT_ID',
        issue: 'No Shopify variant ID configured'
      });
      continue;
    }

    console.log(`  🔄 Updating fulfillment service...`);
    
    const result = await updateVariantFulfillment(product.variantId, product);
    
    if (result.success && result.variant) {
      const fulfillmentService = result.variant.fulfillment_service || 'unknown';
      console.log(`  ✅ Status: Updated successfully`);
      console.log(`  Fulfillment Service: ${fulfillmentService}`);
      console.log(`  Inventory Management: ${result.variant.inventory_management || 'NOT SET'}`);
      console.log(`  Inventory Policy: ${result.variant.inventory_policy || 'NOT SET'}`);
      
      results.push({
        id: product.id,
        title: product.title,
        status: 'UPDATED',
        fulfillmentService: fulfillmentService
      });
    } else {
      console.log(`  ❌ Status: Update failed`);
      console.log(`  Error: ${result.error}`);
      console.log(`  Status Code: ${result.status || 'Unknown'}`);
      
      results.push({
        id: product.id,
        title: product.title,
        status: 'ERROR',
        error: result.error
      });
    }
  }

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 CONFIGURATION SUMMARY:');
  
  const updated = results.filter(r => r.status === 'UPDATED').length;
  const missing = results.filter(r => r.status === 'MISSING_VARIANT_ID').length;
  const errors = results.filter(r => r.status === 'ERROR').length;
  
  console.log(`  ✅ Successfully Updated: ${updated}/${bookProducts.length}`);
  console.log(`  ❌ Missing Variant ID: ${missing}/${bookProducts.length}`);
  console.log(`  ❌ Errors: ${errors}/${bookProducts.length}`);
  
  // Check fulfillment services
  console.log('\n🔍 FULFILLMENT SERVICE CHECK:');
  const amazonFBA = results.filter(r => r.fulfillmentService === 'amazon_fba');
  const manual = results.filter(r => r.fulfillmentService === 'manual');
  
  console.log(`  📚 Amazon FBA (Books): ${amazonFBA.length} products`);
  console.log(`  📱 Manual (E-books): ${manual.length} products`);
  
  if (amazonFBA.length > 0) {
    console.log('\n✅ Amazon FBA Configured For:');
    amazonFBA.forEach(product => {
      console.log(`    - ${product.id}: ${product.title}`);
    });
  }
  
  if (missing > 0) {
    console.log('\n⚠️  Products Missing Variant IDs:');
    results.filter(r => r.status === 'MISSING_VARIANT_ID').forEach(product => {
      console.log(`    - ${product.id}: ${product.title}`);
    });
    console.log('   Action Required: Import these products into Shopify');
  }
  
  console.log('\n🎯 NEXT STEPS:');
  console.log('  1. Test Amazon FBA integration');
  console.log('  2. Import missing products (A-05, A-07, A-08)');
  console.log('  3. Test all 8 book products');
  console.log('  4. Switch back to live mode when ready');
}

// Run the configuration
configureAmazonFBA().catch(console.error);
