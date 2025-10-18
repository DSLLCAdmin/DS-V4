#!/usr/bin/env node

const https = require('https');

console.log('🏗️ CREATING AMAZON FBA FULFILLMENT SERVICE');
console.log('='.repeat(50));
console.log('🛡️ TEST MODE: Safe for testing - no real orders will be created');
console.log('='.repeat(50));

const SHOPIFY_STORE = 'wenugu-5b.myshopify.com';
const SHOPIFY_TOKEN = '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';

async function createFulfillmentService() {
  return new Promise((resolve) => {
    const url = `https://${SHOPIFY_STORE}/admin/api/2024-04/fulfillment_services.json`;
    
    const fulfillmentServiceData = {
      fulfillment_service: {
        name: 'Amazon FBA',
        type: 'amazon_fba',
        active: true,
        service_name: 'Amazon FBA',
        tracking_support: true,
        inventory_management: true,
        requires_shipping_method: false,
        format: 'json'
      }
    };

    const req = https.request(url, {
      method: 'POST',
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
            service: result.fulfillment_service,
            status: res.statusCode
          });
        } catch (e) {
          resolve({
            success: false,
            error: e.message,
            status: res.statusCode,
            response: data.substring(0, 200)
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

    req.write(JSON.stringify(fulfillmentServiceData));
    req.end();
  });
}

async function createManualFulfillmentService() {
  return new Promise((resolve) => {
    const url = `https://${SHOPIFY_STORE}/admin/api/2024-04/fulfillment_services.json`;
    
    const fulfillmentServiceData = {
      fulfillment_service: {
        name: 'Manual Fulfillment',
        type: 'manual',
        active: true,
        service_name: 'Manual Fulfillment',
        tracking_support: false,
        inventory_management: true,
        requires_shipping_method: true,
        format: 'json'
      }
    };

    const req = https.request(url, {
      method: 'POST',
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
            service: result.fulfillment_service,
            status: res.statusCode
          });
        } catch (e) {
          resolve({
            success: false,
            error: e.message,
            status: res.statusCode,
            response: data.substring(0, 200)
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

    req.write(JSON.stringify(fulfillmentServiceData));
    req.end();
  });
}

async function createFulfillmentServices() {
  console.log('\n📋 Creating Fulfillment Services:');
  console.log('-'.repeat(50));

  // Create Amazon FBA service
  console.log('\n🔄 Creating Amazon FBA service...');
  const amazonResult = await createFulfillmentService();
  
  if (amazonResult.success) {
    console.log('  ✅ Amazon FBA service created successfully');
    console.log('  Service ID:', amazonResult.service.id);
    console.log('  Service Name:', amazonResult.service.name);
    console.log('  Service Type:', amazonResult.service.type);
    console.log('  Active:', amazonResult.service.active);
  } else {
    console.log('  ❌ Amazon FBA service creation failed');
    console.log('  Error:', amazonResult.error);
    console.log('  Status Code:', amazonResult.status);
    if (amazonResult.response) {
      console.log('  Response:', amazonResult.response);
    }
  }

  // Create Manual Fulfillment service
  console.log('\n🔄 Creating Manual Fulfillment service...');
  const manualResult = await createManualFulfillmentService();
  
  if (manualResult.success) {
    console.log('  ✅ Manual Fulfillment service created successfully');
    console.log('  Service ID:', manualResult.service.id);
    console.log('  Service Name:', manualResult.service.name);
    console.log('  Service Type:', manualResult.service.type);
    console.log('  Active:', manualResult.service.active);
  } else {
    console.log('  ❌ Manual Fulfillment service creation failed');
    console.log('  Error:', manualResult.error);
    console.log('  Status Code:', manualResult.status);
    if (manualResult.response) {
      console.log('  Response:', manualResult.response);
    }
  }

  // Summary
  console.log('\n' + '='.repeat(50));
  console.log('📊 FULFILLMENT SERVICES SUMMARY:');
  
  const amazonSuccess = amazonResult.success;
  const manualSuccess = manualResult.success;
  
  console.log(`  ✅ Amazon FBA: ${amazonSuccess ? 'Created' : 'Failed'}`);
  console.log(`  ✅ Manual Fulfillment: ${manualSuccess ? 'Created' : 'Failed'}`);
  
  if (amazonSuccess && manualSuccess) {
    console.log('\n🎉 All fulfillment services created successfully!');
    console.log('🎯 Next Steps:');
    console.log('  1. Re-run Amazon FBA configuration script');
    console.log('  2. Test all book products');
    console.log('  3. Import missing products (A-05, A-07, A-08)');
  } else {
    console.log('\n⚠️  Some services failed to create');
    console.log('🎯 Next Steps:');
    console.log('  1. Check Shopify admin for manual creation');
    console.log('  2. Verify API permissions');
    console.log('  3. Retry service creation');
  }
}

// Run the creation
createFulfillmentServices().catch(console.error);
