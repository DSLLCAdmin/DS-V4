#!/usr/bin/env node

const https = require('https');

console.log('🧪 TESTING ALL 8 BOOK PRODUCTS FOR FULFILLMENT');
console.log('='.repeat(60));

// All 8 book products that need testing
const bookProducts = [
  { id: 'A-01', title: 'First & Light E-book', price: 0.00, variantId: 42143382044770, requiresShipping: false },
  { id: 'A-02', title: 'First & Light Paperback', price: 9.99, variantId: 42146492383330, requiresShipping: true },
  { id: 'A-03', title: 'Risque & Safety E-book', price: 4.99, variantId: 42143320866914, requiresShipping: false },
  { id: 'A-04', title: 'Risque & Safety Paperback', price: 9.99, variantId: 42146492448866, requiresShipping: true },
  { id: 'A-05', title: 'Mercury & Memory E-book', price: 4.99, variantId: null, requiresShipping: false },
  { id: 'A-06', title: 'Mercury & Memory Paperback', price: 9.99, variantId: 42146492547170, requiresShipping: true },
  { id: 'A-07', title: 'Vol-1 E-book', price: 15.99, variantId: null, requiresShipping: false },
  { id: 'A-08', title: 'Vol-1 Paperback', price: 24.99, variantId: null, requiresShipping: true }
];

async function testProduct(product) {
  return new Promise((resolve) => {
    if (!product.variantId) {
      resolve({
        id: product.id,
        title: product.title,
        status: 'MISSING_VARIANT_ID',
        issue: 'No Shopify variant ID configured'
      });
      return;
    }

    const SHOPIFY_STORE = 'wenugu-5b.myshopify.com';
    const SHOPIFY_TOKEN = process.env.SHOPIFY_ADMIN_API_ACCESS_TOKEN || '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';
    const url = `https://${SHOPIFY_STORE}/admin/api/2024-04/variants/${product.variantId}.json`;

    const req = https.request(url, {
      headers: {
        'X-Shopify-Access-Token': SHOPIFY_TOKEN
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          const variant = result.variant;
          
          resolve({
            id: product.id,
            title: product.title,
            status: 'FOUND',
            variant: {
              id: variant.id,
              price: variant.price,
              sku: variant.sku,
              fulfillment_service: variant.fulfillment_service,
              requires_shipping: variant.requires_shipping,
              inventory_management: variant.inventory_management,
              inventory_policy: variant.inventory_policy
            }
          });
        } catch (e) {
          resolve({
            id: product.id,
            title: product.title,
            status: 'ERROR',
            error: e.message
          });
        }
      });
    });

    req.on('error', (err) => {
      resolve({
        id: product.id,
        title: product.title,
        status: 'ERROR',
        error: err.message
      });
    });

    req.end();
  });
}

async function runTests() {
  console.log('\n📚 Testing Book Products:');
  console.log('-'.repeat(60));

  const results = [];
  
  for (const product of bookProducts) {
    const result = await testProduct(product);
    results.push(result);
    
    console.log(`\n${product.id}: ${product.title}`);
    console.log(`  Price: $${product.price}`);
    console.log(`  Variant ID: ${product.variantId || 'MISSING'}`);
    console.log(`  Requires Shipping: ${product.requiresShipping ? 'YES' : 'NO'}`);
    
    if (result.status === 'FOUND') {
      console.log(`  ✅ Status: Found in Shopify`);
      console.log(`  Fulfillment Service: ${result.variant.fulfillment_service || 'NOT SET'}`);
      console.log(`  Inventory Management: ${result.variant.inventory_management || 'NOT SET'}`);
      console.log(`  Inventory Policy: ${result.variant.inventory_policy || 'NOT SET'}`);
      
      // Check for issues
      const issues = [];
      if (!result.variant.fulfillment_service) {
        issues.push('No fulfillment service configured');
      }
      if (result.variant.fulfillment_service === 'manual' && product.requiresShipping) {
        issues.push('Should use Amazon FBA, not manual');
      }
      if (!result.variant.inventory_management) {
        issues.push('No inventory management configured');
      }
      
      if (issues.length > 0) {
        console.log(`  ⚠️  Issues:`);
        issues.forEach(issue => console.log(`    - ${issue}`));
      }
    } else if (result.status === 'MISSING_VARIANT_ID') {
      console.log(`  ❌ Status: Missing Shopify variant ID`);
      console.log(`  Issue: ${result.issue}`);
    } else {
      console.log(`  ❌ Status: Error`);
      console.log(`  Error: ${result.error}`);
    }
  }

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 SUMMARY:');
  
  const found = results.filter(r => r.status === 'FOUND').length;
  const missing = results.filter(r => r.status === 'MISSING_VARIANT_ID').length;
  const errors = results.filter(r => r.status === 'ERROR').length;
  
  console.log(`  ✅ Found in Shopify: ${found}/8`);
  console.log(`  ❌ Missing Variant ID: ${missing}/8`);
  console.log(`  ❌ Errors: ${errors}/8`);
  
  if (found === 8) {
    console.log('\n🎉 All products found in Shopify!');
    console.log('⚠️  Next: Check fulfillment service configuration');
  } else {
    console.log('\n🚨 CRITICAL: Some products missing from Shopify');
    console.log('⚠️  Action required: Import missing products');
  }
  
  // Check fulfillment services
  console.log('\n🔍 FULFILLMENT SERVICE CHECK:');
  const fulfillmentIssues = results.filter(r => 
    r.status === 'FOUND' && 
    (!r.variant.fulfillment_service || r.variant.fulfillment_service === 'manual')
  );
  
  if (fulfillmentIssues.length > 0) {
    console.log(`  ⚠️  ${fulfillmentIssues.length} products need fulfillment service setup`);
    fulfillmentIssues.forEach(issue => {
      console.log(`    - ${issue.id}: ${issue.title}`);
    });
  } else {
    console.log('  ✅ All products have fulfillment services configured');
  }
}

// Run the tests
runTests().catch(console.error);
