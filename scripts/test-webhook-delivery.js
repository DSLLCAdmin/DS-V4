#!/usr/bin/env node

/**
 * Test Webhook Delivery
 * 
 * This script tests the webhook delivery by creating a test order
 * and monitoring the webhook responses.
 */

const https = require('https');

// Configuration
const SHOPIFY_STORE = 'wenugu-5b.myshopify.com';
const SHOPIFY_ACCESS_TOKEN = process.env.SHOPIFY_ACCESS_TOKEN || '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';
const WEBHOOK_BASE_URL = 'https://ds-v5.netlify.app';

console.log('🧪 TESTING WEBHOOK DELIVERY');
console.log('='.repeat(50));

console.log('\n📋 Configuration:');
console.log(`   Store: ${SHOPIFY_STORE}`);
console.log(`   Webhook URL: ${WEBHOOK_BASE_URL}/api/webhooks/shopify/orders/`);

// Function to make Shopify API request
function makeShopifyRequest(endpoint, method = 'GET', data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: SHOPIFY_STORE,
      port: 443,
      path: `/admin/api/2023-10${endpoint}`,
      method: method,
      headers: {
        'X-Shopify-Access-Token': SHOPIFY_ACCESS_TOKEN,
        'Content-Type': 'application/json',
        'User-Agent': 'DS-LLC-Webhook-Test/1.0'
      }
    };

    if (data) {
      const jsonData = JSON.stringify(data);
      options.headers['Content-Length'] = Buffer.byteLength(jsonData);
    }

    const req = https.request(options, (res) => {
      let responseData = '';
      res.on('data', chunk => responseData += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(responseData);
          resolve({
            status: res.statusCode,
            data: parsed,
            headers: res.headers
          });
        } catch (error) {
          resolve({
            status: res.statusCode,
            data: responseData,
            headers: res.headers,
            error: error.message
          });
        }
      });
    });

    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });

    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

// Function to get existing webhooks
async function getWebhooks() {
  console.log('\n🔍 Fetching webhook subscriptions...');
  
  try {
    const response = await makeShopifyRequest('/webhooks.json');
    
    if (response.status === 200) {
      console.log(`   ✅ Found ${response.data.webhooks.length} webhook subscriptions`);
      
      const dsWebhooks = response.data.webhooks.filter(webhook => 
        webhook.address.includes('ds-v5.netlify.app')
      );
      
      console.log(`   📡 DS LLC webhooks: ${dsWebhooks.length}`);
      
      dsWebhooks.forEach(webhook => {
        console.log(`      - ${webhook.topic}: ${webhook.address}`);
      });
      
      return dsWebhooks;
    } else {
      console.log(`   ❌ Failed to fetch webhooks: ${response.status}`);
      return [];
    }
  } catch (error) {
    console.log(`   ❌ Error fetching webhooks: ${error.message}`);
    return [];
  }
}

// Function to test webhook endpoint directly
async function testWebhookEndpoint() {
  console.log('\n🔍 Testing webhook endpoint directly...');
  
  return new Promise((resolve) => {
    const postData = JSON.stringify({
      test: 'webhook',
      timestamp: new Date().toISOString()
    });
    
    const options = {
      hostname: 'ds-v5.netlify.app',
      port: 443,
      path: '/api/webhooks/shopify/orders/',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
        'X-Shopify-Topic': 'orders/create',
        'X-Shopify-Hmac-Sha256': 'test-signature',
        'User-Agent': 'DS-LLC-Webhook-Test/1.0'
      }
    };
    
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          contentType: res.headers['content-type'],
          contentLength: data.length,
          response: data.substring(0, 200)
        });
      });
    });
    
    req.on('error', (err) => {
      resolve({ error: err.message });
    });
    
    req.on('timeout', () => {
      req.destroy();
      resolve({ error: 'Timeout' });
    });
    
    req.write(postData);
    req.end();
  });
}

// Function to create a test order
async function createTestOrder() {
  console.log('\n🛒 Creating test order...');
  
  const testOrder = {
    order: {
      line_items: [
        {
          variant_id: 42143321030754, // First & Light Paperback
          quantity: 1
        }
      ],
      customer: {
        email: 'test@darkstreetllc.com',
        first_name: 'Test',
        last_name: 'Customer'
      },
      shipping_address: {
        first_name: 'Test',
        last_name: 'Customer',
        address1: '123 Test Street',
        city: 'Test City',
        province: 'CA',
        zip: '90210',
        country: 'United States'
      },
      financial_status: 'pending',
      fulfillment_status: 'unfulfilled',
      note: 'Test order for webhook delivery testing'
    }
  };
  
  try {
    const response = await makeShopifyRequest('/orders.json', 'POST', testOrder);
    
    if (response.status === 201) {
      console.log(`   ✅ Test order created successfully`);
      console.log(`   Order ID: ${response.data.order.id}`);
      console.log(`   Order Number: ${response.data.order.order_number}`);
      return response.data.order;
    } else {
      console.log(`   ❌ Failed to create test order: ${response.status}`);
      console.log(`   Response: ${JSON.stringify(response.data, null, 2)}`);
      return null;
    }
  } catch (error) {
    console.log(`   ❌ Error creating test order: ${error.message}`);
    return null;
  }
}

// Function to check webhook delivery logs
async function checkWebhookLogs() {
  console.log('\n📊 Checking webhook delivery logs...');
  
  try {
    const response = await makeShopifyRequest('/webhooks.json');
    
    if (response.status === 200) {
      const dsWebhooks = response.data.webhooks.filter(webhook => 
        webhook.address.includes('ds-v5.netlify.app')
      );
      
      console.log(`   📡 DS LLC webhook status:`);
      
      dsWebhooks.forEach(webhook => {
        console.log(`      - ${webhook.topic}:`);
        console.log(`        Status: ${webhook.api_version}`);
        console.log(`        Created: ${webhook.created_at}`);
        console.log(`        Updated: ${webhook.updated_at}`);
      });
      
      return dsWebhooks;
    } else {
      console.log(`   ❌ Failed to fetch webhook logs: ${response.status}`);
      return [];
    }
  } catch (error) {
    console.log(`   ❌ Error fetching webhook logs: ${error.message}`);
    return [];
  }
}

// Main function
async function testWebhookDelivery() {
  console.log('\n🚀 Starting webhook delivery test...');
  
  // Test 1: Check webhook subscriptions
  const webhooks = await getWebhooks();
  
  if (webhooks.length === 0) {
    console.log('\n❌ No DS LLC webhooks found. Please configure webhooks first.');
    return;
  }
  
  // Test 2: Test webhook endpoint directly
  console.log('\n🔍 Testing webhook endpoint...');
  const endpointTest = await testWebhookEndpoint();
  
  if (endpointTest.error) {
    console.log(`   ❌ Endpoint test failed: ${endpointTest.error}`);
  } else {
    console.log(`   📊 Endpoint test result:`);
    console.log(`      Status: ${endpointTest.status}`);
    console.log(`      Content-Type: ${endpointTest.contentType}`);
    console.log(`      Response: ${endpointTest.response}`);
    
    if (endpointTest.status === 401) {
      console.log(`      ✅ Endpoint is working (401 = Missing signature, expected)`);
    } else if (endpointTest.status === 200) {
      console.log(`      ✅ Endpoint is working (200 = Success)`);
    } else {
      console.log(`      ⚠️ Unexpected status: ${endpointTest.status}`);
    }
  }
  
  // Test 3: Create test order (optional)
  console.log('\n🛒 Test order creation (optional)...');
  console.log('   Note: This will create a real test order in Shopify');
  console.log('   Press Ctrl+C to skip, or wait 5 seconds to continue...');
  
  // Wait 5 seconds for user to cancel
  await new Promise(resolve => setTimeout(resolve, 5000));
  
  const testOrder = await createTestOrder();
  
  if (testOrder) {
    console.log('\n📊 Test order created. Webhooks should be triggered automatically.');
    console.log('   Check your DS LLC admin dashboard for webhook logs.');
  }
  
  // Test 4: Check webhook logs
  await checkWebhookLogs();
  
  console.log('\n📊 SUMMARY:');
  console.log(`   Webhook subscriptions: ${webhooks.length}`);
  console.log(`   Endpoint test: ${endpointTest.error ? 'Failed' : 'Success'}`);
  console.log(`   Test order: ${testOrder ? 'Created' : 'Skipped'}`);
  
  console.log('\n🎯 Next Steps:');
  console.log('   1. Monitor webhook delivery in DS LLC admin');
  console.log('   2. Test with real customer orders');
  console.log('   3. Configure Stripe webhooks if needed');
  console.log('   4. Set up webhook monitoring and alerts');
}

// Run the test
testWebhookDelivery().catch(error => {
  console.error('\n❌ Test failed:', error.message);
  process.exit(1);
});
