#!/usr/bin/env node

/**
 * Configure Shopify Webhook Subscriptions
 * 
 * This script configures Shopify to send webhooks to our deployed DS LLC endpoints.
 * It sets up webhook subscriptions for order creation and updates.
 */

const https = require('https');

// Configuration
const SHOPIFY_STORE = 'wenugu-5b.myshopify.com';
const SHOPIFY_ACCESS_TOKEN = process.env.SHOPIFY_ACCESS_TOKEN || 'your-access-token';
const WEBHOOK_BASE_URL = 'https://ds-v5.netlify.app'; // Using Netlify subdomain for now

// Webhook endpoints to configure
const WEBHOOK_SUBSCRIPTIONS = [
  {
    topic: 'orders/create',
    address: `${WEBHOOK_BASE_URL}/api/webhooks/shopify/orders/`,
    format: 'json'
  },
  {
    topic: 'orders/updated',
    address: `${WEBHOOK_BASE_URL}/api/webhooks/shopify/orders/`,
    format: 'json'
  },
  {
    topic: 'orders/paid',
    address: `${WEBHOOK_BASE_URL}/api/webhooks/shopify/orders/`,
    format: 'json'
  },
  {
    topic: 'orders/cancelled',
    address: `${WEBHOOK_BASE_URL}/api/webhooks/shopify/orders/`,
    format: 'json'
  },
  {
    topic: 'orders/fulfilled',
    address: `${WEBHOOK_BASE_URL}/api/webhooks/shopify/orders/`,
    format: 'json'
  }
];

console.log('🔔 CONFIGURING SHOPIFY WEBHOOK SUBSCRIPTIONS');
console.log('='.repeat(60));

console.log('\n📋 Configuration:');
console.log(`   Store: ${SHOPIFY_STORE}`);
console.log(`   Webhook Base URL: ${WEBHOOK_BASE_URL}`);
console.log(`   Subscriptions: ${WEBHOOK_SUBSCRIPTIONS.length}`);

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
        'User-Agent': 'DS-LLC-Webhook-Config/1.0'
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
async function getExistingWebhooks() {
  console.log('\n🔍 Fetching existing webhook subscriptions...');
  
  try {
    const response = await makeShopifyRequest('/webhooks.json');
    
    if (response.status === 200) {
      console.log(`   ✅ Found ${response.data.webhooks.length} existing webhooks`);
      return response.data.webhooks;
    } else {
      console.log(`   ❌ Failed to fetch webhooks: ${response.status}`);
      console.log(`   Response: ${JSON.stringify(response.data, null, 2)}`);
      return [];
    }
  } catch (error) {
    console.log(`   ❌ Error fetching webhooks: ${error.message}`);
    return [];
  }
}

// Function to create webhook subscription
async function createWebhookSubscription(webhook) {
  console.log(`\n🔔 Creating webhook subscription: ${webhook.topic}`);
  
  try {
    const response = await makeShopifyRequest('/webhooks.json', 'POST', {
      webhook: webhook
    });
    
    if (response.status === 201) {
      console.log(`   ✅ Webhook created successfully`);
      console.log(`   ID: ${response.data.webhook.id}`);
      console.log(`   Address: ${response.data.webhook.address}`);
      return response.data.webhook;
    } else {
      console.log(`   ❌ Failed to create webhook: ${response.status}`);
      console.log(`   Response: ${JSON.stringify(response.data, null, 2)}`);
      return null;
    }
  } catch (error) {
    console.log(`   ❌ Error creating webhook: ${error.message}`);
    return null;
  }
}

// Function to delete webhook subscription
async function deleteWebhookSubscription(webhookId) {
  console.log(`\n🗑️ Deleting webhook subscription: ${webhookId}`);
  
  try {
    const response = await makeShopifyRequest(`/webhooks/${webhookId}.json`, 'DELETE');
    
    if (response.status === 200) {
      console.log(`   ✅ Webhook deleted successfully`);
      return true;
    } else {
      console.log(`   ❌ Failed to delete webhook: ${response.status}`);
      return false;
    }
  } catch (error) {
    console.log(`   ❌ Error deleting webhook: ${error.message}`);
    return false;
  }
}

// Main function
async function configureWebhooks() {
  console.log('\n🚀 Starting webhook configuration...');
  
  // Check if we have access token
  if (!SHOPIFY_ACCESS_TOKEN || SHOPIFY_ACCESS_TOKEN === 'your-access-token') {
    console.log('\n❌ ERROR: Shopify access token not configured');
    console.log('   Please set SHOPIFY_ACCESS_TOKEN environment variable');
    console.log('   or update the script with your access token');
    return;
  }
  
  // Get existing webhooks
  const existingWebhooks = await getExistingWebhooks();
  
  // Find webhooks that need to be updated
  const webhooksToUpdate = existingWebhooks.filter(webhook => 
    webhook.address.includes('darkstreetllc.com') || 
    webhook.address.includes('ds-v5.netlify.app')
  );
  
  if (webhooksToUpdate.length > 0) {
    console.log(`\n🔄 Found ${webhooksToUpdate.length} webhooks to update`);
    
    // Delete old webhooks
    for (const webhook of webhooksToUpdate) {
      await deleteWebhookSubscription(webhook.id);
    }
  }
  
  // Create new webhook subscriptions
  console.log(`\n🔔 Creating ${WEBHOOK_SUBSCRIPTIONS.length} new webhook subscriptions...`);
  
  let successCount = 0;
  for (const webhook of WEBHOOK_SUBSCRIPTIONS) {
    const result = await createWebhookSubscription(webhook);
    if (result) {
      successCount++;
    }
  }
  
  console.log('\n📊 SUMMARY:');
  console.log(`   Webhooks created: ${successCount}/${WEBHOOK_SUBSCRIPTIONS.length}`);
  
  if (successCount === WEBHOOK_SUBSCRIPTIONS.length) {
    console.log('   ✅ All webhook subscriptions configured successfully!');
    console.log('\n🎯 Next Steps:');
    console.log('   1. Test webhook delivery with a test order');
    console.log('   2. Monitor webhook logs in DS LLC admin');
    console.log('   3. Configure Stripe webhooks if needed');
  } else {
    console.log('   ⚠️ Some webhook subscriptions failed to create');
    console.log('   Check the error messages above for details');
  }
}

// Run the configuration
configureWebhooks().catch(error => {
  console.error('\n❌ Configuration failed:', error.message);
  process.exit(1);
});
