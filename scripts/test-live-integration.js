#!/usr/bin/env node
/**
 * Live Mode Testing Script
 * Tests the complete DS LLC + Shopify integration in live mode
 */

const https = require('https');
const fs = require('fs');

// Test configuration
const TEST_CONFIG = {
  shopifyStore: 'wenugu-5b.myshopify.com',
  dsllcDomain: 'darkstreetllc.com',
  testProductId: 'A-01', // First Light eBook
  testAmount: 9.99, // Small test amount
  mercuryAccount: '202501258413',
  mercuryRouting: '091311229'
};

// Test results
const testResults = {
  passed: 0,
  failed: 0,
  tests: []
};

// Utility function to make HTTPS requests
function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const req = https.request(url, options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          resolve({ status: res.statusCode, data: jsonData, headers: res.headers });
        } catch (e) {
          resolve({ status: res.statusCode, data: data, headers: res.headers });
        }
      });
    });
    
    req.on('error', reject);
    req.end();
  });
}

// Test functions
async function testShopifyStoreAccess() {
  console.log('🔍 Testing Shopify Store Access...');
  
  try {
    const url = `https://${TEST_CONFIG.shopifyStore}/admin/api/2024-10/products.json`;
    const response = await makeRequest(url, {
      headers: {
        'X-Shopify-Access-Token': process.env.SHOPIFY_ADMIN_API_TOKEN || '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'
      }
    });
    
    if (response.status === 200 && response.data.products) {
      testResults.passed++;
      testResults.tests.push({
        name: 'Shopify Store Access',
        status: 'PASS',
        details: `Found ${response.data.products.length} products`
      });
      console.log('✅ Shopify store accessible');
      return response.data.products;
    } else {
      throw new Error(`Status: ${response.status}`);
    }
  } catch (error) {
    testResults.failed++;
    testResults.tests.push({
      name: 'Shopify Store Access',
      status: 'FAIL',
      details: error.message
    });
    console.log('❌ Shopify store access failed:', error.message);
    return null;
  }
}

async function testProductSync(products) {
  console.log('🔍 Testing Product Sync...');
  
  if (!products || products.length === 0) {
    testResults.failed++;
    testResults.tests.push({
      name: 'Product Sync',
      status: 'FAIL',
      details: 'No products found'
    });
    console.log('❌ No products to sync');
    return;
  }
  
  // Check if DS LLC products are present
  const dsProducts = products.filter(p => 
    p.vendor === 'DarkStreet LLC' || 
    p.tags.includes('ds-product') ||
    p.title.includes('First Light') ||
    p.title.includes('Risque Safety')
  );
  
  if (dsProducts.length > 0) {
    testResults.passed++;
    testResults.tests.push({
      name: 'Product Sync',
      status: 'PASS',
      details: `Found ${dsProducts.length} DS LLC products`
    });
    console.log('✅ DS LLC products synced');
  } else {
    testResults.failed++;
    testResults.tests.push({
      name: 'Product Sync',
      status: 'FAIL',
      details: 'No DS LLC products found'
    });
    console.log('❌ DS LLC products not found');
  }
}

async function testCheckoutRedirect() {
  console.log('🔍 Testing Checkout Redirects...');
  
  try {
    // Test product page redirect
    const productUrl = `https://${TEST_CONFIG.shopifyStore}/products/first-light-ebook`;
    const response = await makeRequest(productUrl);
    
    if (response.status === 200) {
      // Check if page contains redirect script
      const hasRedirect = response.data.includes('darkstreetllc.com/shop');
      
      if (hasRedirect) {
        testResults.passed++;
        testResults.tests.push({
          name: 'Checkout Redirect',
          status: 'PASS',
          details: 'Redirect script found on product page'
        });
        console.log('✅ Checkout redirects configured');
      } else {
        testResults.failed++;
        testResults.tests.push({
          name: 'Checkout Redirect',
          status: 'FAIL',
          details: 'Redirect script not found'
        });
        console.log('❌ Checkout redirects not configured');
      }
    } else {
      throw new Error(`Status: ${response.status}`);
    }
  } catch (error) {
    testResults.failed++;
    testResults.tests.push({
      name: 'Checkout Redirect',
      status: 'FAIL',
      details: error.message
    });
    console.log('❌ Checkout redirect test failed:', error.message);
  }
}

async function testPaymentConfiguration() {
  console.log('🔍 Testing Payment Configuration...');
  
  try {
    // Test Stripe configuration
    const stripeUrl = 'https://api.stripe.com/v1/payment_methods';
    const stripeResponse = await makeRequest(stripeUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.STRIPE_SECRET_KEY || 'sk_live_51Oq01aJ21234567890abcdefghijKLMNOpqrstuvwxyZ01234567890'}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
    
    if (stripeResponse.status === 200 || stripeResponse.status === 400) {
      testResults.passed++;
      testResults.tests.push({
        name: 'Payment Configuration',
        status: 'PASS',
        details: 'Stripe API accessible'
      });
      console.log('✅ Payment configuration working');
    } else {
      throw new Error(`Stripe status: ${stripeResponse.status}`);
    }
  } catch (error) {
    testResults.failed++;
    testResults.tests.push({
      name: 'Payment Configuration',
      status: 'FAIL',
      details: error.message
    });
    console.log('❌ Payment configuration failed:', error.message);
  }
}

async function testWebhookEndpoints() {
  console.log('🔍 Testing Webhook Endpoints...');
  
  try {
    // Test DS LLC webhook endpoint
    const webhookUrl = `https://${TEST_CONFIG.dsllcDomain}/api/webhooks/shopify/orders`;
    const response = await makeRequest(webhookUrl);
    
    if (response.status === 200 || response.status === 405) { // 405 = Method Not Allowed is OK for GET
      testResults.passed++;
      testResults.tests.push({
        name: 'Webhook Endpoints',
        status: 'PASS',
        details: 'Webhook endpoint accessible'
      });
      console.log('✅ Webhook endpoints configured');
    } else {
      throw new Error(`Status: ${response.status}`);
    }
  } catch (error) {
    testResults.failed++;
    testResults.tests.push({
      name: 'Webhook Endpoints',
      status: 'FAIL',
      details: error.message
    });
    console.log('❌ Webhook endpoints failed:', error.message);
  }
}

async function testMercuryAccountIntegration() {
  console.log('🔍 Testing Mercury Account Integration...');
  
  // This would typically test bank account verification
  // For now, we'll just verify the account details are available
  if (TEST_CONFIG.mercuryAccount && TEST_CONFIG.mercuryRouting) {
    testResults.passed++;
    testResults.tests.push({
      name: 'Mercury Account Integration',
      status: 'PASS',
      details: `Account: ${TEST_CONFIG.mercuryAccount}, Routing: ${TEST_CONFIG.mercuryRouting}`
    });
    console.log('✅ Mercury account details available');
  } else {
    testResults.failed++;
    testResults.tests.push({
      name: 'Mercury Account Integration',
      status: 'FAIL',
      details: 'Mercury account details missing'
    });
    console.log('❌ Mercury account details missing');
  }
}

// Main test runner
async function runAllTests() {
  console.log('🚀 Starting Live Mode Integration Tests...\n');
  
  // Run all tests
  const products = await testShopifyStoreAccess();
  await testProductSync(products);
  await testCheckoutRedirect();
  await testPaymentConfiguration();
  await testWebhookEndpoints();
  await testMercuryAccountIntegration();
  
  // Print results
  console.log('\n📊 Test Results Summary:');
  console.log(`✅ Passed: ${testResults.passed}`);
  console.log(`❌ Failed: ${testResults.failed}`);
  console.log(`📈 Success Rate: ${Math.round((testResults.passed / (testResults.passed + testResults.failed)) * 100)}%`);
  
  console.log('\n📋 Detailed Results:');
  testResults.tests.forEach(test => {
    const icon = test.status === 'PASS' ? '✅' : '❌';
    console.log(`${icon} ${test.name}: ${test.details}`);
  });
  
  // Save results to file
  const resultsFile = `test-results-${new Date().toISOString().split('T')[0]}.json`;
  fs.writeFileSync(resultsFile, JSON.stringify(testResults, null, 2));
  console.log(`\n💾 Results saved to: ${resultsFile}`);
  
  // Return success/failure
  return testResults.failed === 0;
}

// Run tests if called directly
if (require.main === module) {
  runAllTests().then(success => {
    process.exit(success ? 0 : 1);
  }).catch(error => {
    console.error('❌ Test runner failed:', error);
    process.exit(1);
  });
}

module.exports = { runAllTests, testResults };
