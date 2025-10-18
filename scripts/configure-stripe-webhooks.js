#!/usr/bin/env node

/**
 * Configure Stripe Webhook Subscriptions
 * 
 * This script configures Stripe to send webhooks to our deployed DS LLC endpoints.
 * It sets up webhook subscriptions for payment events.
 */

const https = require('https');

// Configuration
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || 'your-secret-key';
const WEBHOOK_BASE_URL = 'https://ds-v5.netlify.app';

// Webhook events to configure
const WEBHOOK_EVENTS = [
  'payment_intent.succeeded',
  'payment_intent.payment_failed',
  'payment_intent.canceled',
  'charge.succeeded',
  'charge.failed',
  'charge.dispute.created',
  'customer.created',
  'customer.updated',
  'invoice.payment_succeeded',
  'invoice.payment_failed'
];

console.log('🔔 CONFIGURING STRIPE WEBHOOK SUBSCRIPTIONS');
console.log('='.repeat(60));

console.log('\n📋 Configuration:');
console.log(`   Stripe Secret Key: ${STRIPE_SECRET_KEY.substring(0, 20)}...`);
console.log(`   Webhook Base URL: ${WEBHOOK_BASE_URL}`);
console.log(`   Events: ${WEBHOOK_EVENTS.length}`);

// Function to make Stripe API request
function makeStripeRequest(endpoint, method = 'GET', data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.stripe.com',
      port: 443,
      path: `/v1${endpoint}`,
      method: method,
      headers: {
        'Authorization': `Bearer ${STRIPE_SECRET_KEY}`,
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'DS-LLC-Webhook-Config/1.0'
      }
    };

    if (data) {
      let formData;
      if (data.enabled_events && Array.isArray(data.enabled_events)) {
        // Handle array parameters for Stripe API
        formData = Object.keys(data)
          .map(key => {
            if (key === 'enabled_events' && Array.isArray(data[key])) {
              return data[key].map(event => `${encodeURIComponent(key)}[]=${encodeURIComponent(event)}`).join('&');
            }
            return `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`;
          })
          .join('&');
      } else {
        formData = Object.keys(data)
          .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`)
          .join('&');
      }
      options.headers['Content-Length'] = Buffer.byteLength(formData);
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
      let formData;
      if (data.enabled_events && Array.isArray(data.enabled_events)) {
        // Handle array parameters for Stripe API
        formData = Object.keys(data)
          .map(key => {
            if (key === 'enabled_events' && Array.isArray(data[key])) {
              return data[key].map(event => `${encodeURIComponent(key)}[]=${encodeURIComponent(event)}`).join('&');
            }
            return `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`;
          })
          .join('&');
      } else {
        formData = Object.keys(data)
          .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`)
          .join('&');
      }
      req.write(formData);
    }
    req.end();
  });
}

// Function to get existing webhooks
async function getExistingWebhooks() {
  console.log('\n🔍 Fetching existing Stripe webhook subscriptions...');
  
  try {
    const response = await makeStripeRequest('/webhook_endpoints');
    
    if (response.status === 200) {
      console.log(`   ✅ Found ${response.data.data.length} existing webhook endpoints`);
      
      const dsWebhooks = response.data.data.filter(webhook => 
        webhook.url.includes('ds-v5.netlify.app') || 
        webhook.url.includes('darkstreetllc.com')
      );
      
      console.log(`   📡 DS LLC webhooks: ${dsWebhooks.length}`);
      
      dsWebhooks.forEach(webhook => {
        console.log(`      - ${webhook.id}: ${webhook.url}`);
        console.log(`        Events: ${webhook.enabled_events.length}`);
        console.log(`        Status: ${webhook.status}`);
      });
      
      return dsWebhooks;
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

// Function to create webhook endpoint
async function createWebhookEndpoint() {
  console.log('\n🔔 Creating Stripe webhook endpoint...');
  
  const webhookData = {
    url: `${WEBHOOK_BASE_URL}/api/webhooks/stripe/`,
    enabled_events: WEBHOOK_EVENTS,
    description: 'DS LLC Payment Webhooks'
  };
  
  try {
    const response = await makeStripeRequest('/webhook_endpoints', 'POST', webhookData);
    
    if (response.status === 200) {
      console.log(`   ✅ Webhook endpoint created successfully`);
      console.log(`   ID: ${response.data.id}`);
      console.log(`   URL: ${response.data.url}`);
      console.log(`   Events: ${response.data.enabled_events.length}`);
      console.log(`   Secret: ${response.data.secret.substring(0, 20)}...`);
      return response.data;
    } else {
      console.log(`   ❌ Failed to create webhook endpoint: ${response.status}`);
      console.log(`   Response: ${JSON.stringify(response.data, null, 2)}`);
      return null;
    }
  } catch (error) {
    console.log(`   ❌ Error creating webhook endpoint: ${error.message}`);
    return null;
  }
}

// Function to delete webhook endpoint
async function deleteWebhookEndpoint(webhookId) {
  console.log(`\n🗑️ Deleting webhook endpoint: ${webhookId}`);
  
  try {
    const response = await makeStripeRequest(`/webhook_endpoints/${webhookId}`, 'DELETE');
    
    if (response.status === 200) {
      console.log(`   ✅ Webhook endpoint deleted successfully`);
      return true;
    } else {
      console.log(`   ❌ Failed to delete webhook endpoint: ${response.status}`);
      return false;
    }
  } catch (error) {
    console.log(`   ❌ Error deleting webhook endpoint: ${error.message}`);
    return false;
  }
}

// Function to test webhook endpoint
async function testWebhookEndpoint() {
  console.log('\n🔍 Testing Stripe webhook endpoint...');
  
  return new Promise((resolve) => {
    const postData = JSON.stringify({
      id: 'evt_test_webhook',
      object: 'event',
      type: 'payment_intent.succeeded',
      data: {
        object: {
          id: 'pi_test_webhook',
          amount: 1000,
          currency: 'usd',
          status: 'succeeded'
        }
      },
      created: Math.floor(Date.now() / 1000)
    });
    
    const options = {
      hostname: 'ds-v5.netlify.app',
      port: 443,
      path: '/api/webhooks/stripe/',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
        'Stripe-Signature': 't=1234567890,v1=test_signature',
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

// Main function
async function configureStripeWebhooks() {
  console.log('\n🚀 Starting Stripe webhook configuration...');
  
  // Check if we have secret key
  if (!STRIPE_SECRET_KEY || STRIPE_SECRET_KEY === 'your-secret-key') {
    console.log('\n❌ ERROR: Stripe secret key not configured');
    console.log('   Please set STRIPE_SECRET_KEY environment variable');
    console.log('   or update the script with your secret key');
    return;
  }
  
  // Test webhook endpoint first
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
      console.log(`      ✅ Endpoint is working (401 = Invalid signature, expected)`);
    } else if (endpointTest.status === 200) {
      console.log(`      ✅ Endpoint is working (200 = Success)`);
    } else {
      console.log(`      ⚠️ Unexpected status: ${endpointTest.status}`);
    }
  }
  
  // Get existing webhooks
  const existingWebhooks = await getExistingWebhooks();
  
  // Delete old webhooks if they exist
  if (existingWebhooks.length > 0) {
    console.log(`\n🔄 Found ${existingWebhooks.length} existing DS LLC webhooks to update`);
    
    for (const webhook of existingWebhooks) {
      await deleteWebhookEndpoint(webhook.id);
    }
  }
  
  // Create new webhook endpoint
  const newWebhook = await createWebhookEndpoint();
  
  console.log('\n📊 SUMMARY:');
  
  if (newWebhook) {
    console.log('   ✅ Stripe webhook endpoint created successfully!');
    console.log(`   Webhook ID: ${newWebhook.id}`);
    console.log(`   Webhook URL: ${newWebhook.url}`);
    console.log(`   Events: ${newWebhook.enabled_events.length}`);
    console.log(`   Secret: ${newWebhook.secret.substring(0, 20)}...`);
    
    console.log('\n🎯 Next Steps:');
    console.log('   1. Update STRIPE_WEBHOOK_SECRET in DS LLC environment');
    console.log('   2. Test webhook delivery with a test payment');
    console.log('   3. Monitor webhook logs in DS LLC admin');
    console.log('   4. Set up webhook monitoring and alerts');
    
    console.log('\n🔑 IMPORTANT: Save this webhook secret:');
    console.log(`   ${newWebhook.secret}`);
    console.log('   This is needed for webhook signature verification');
    
  } else {
    console.log('   ❌ Failed to create Stripe webhook endpoint');
    console.log('   Check the error messages above for details');
  }
}

// Run the configuration
configureStripeWebhooks().catch(error => {
  console.error('\n❌ Configuration failed:', error.message);
  process.exit(1);
});
