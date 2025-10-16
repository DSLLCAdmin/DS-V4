#!/usr/bin/env node
/**
 * Test Order Creation Script
 * Creates a small test order to verify live payment processing
 */

const https = require('https');

// Test order configuration
const TEST_ORDER = {
  amount: 9.99, // Small test amount
  currency: 'usd',
  productId: 'A-01', // First Light eBook
  customerEmail: 'test@dsllc.com',
  description: 'Test Order - First Light eBook'
};

// Create test payment intent
async function createTestPaymentIntent() {
  console.log('💳 Creating test payment intent...');
  
  const stripeUrl = 'https://api.stripe.com/v1/payment_intents';
  const postData = JSON.stringify({
    amount: Math.round(TEST_ORDER.amount * 100), // Convert to cents
    currency: TEST_ORDER.currency,
    metadata: {
      product_id: TEST_ORDER.productId,
      test_order: 'true',
      mercury_account: '202501258413'
    }
  });
  
  return new Promise((resolve, reject) => {
    const req = https.request(stripeUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.STRIPE_SECRET_KEY || 'sk_live_51Oq01aJ21234567890abcdefghijKLMNOpqrstuvwxyZ01234567890'}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          resolve({ status: res.statusCode, data: jsonData });
        } catch (e) {
          resolve({ status: res.statusCode, data: data });
        }
      });
    });
    
    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

// Test Shopify checkout
async function testShopifyCheckout() {
  console.log('🛒 Testing Shopify checkout...');
  
  const checkoutUrl = `https://wenugu-5b.myshopify.com/cart/add`;
  const postData = JSON.stringify({
    items: [{
      id: 'A-01', // Product variant ID
      quantity: 1
    }]
  });
  
  return new Promise((resolve, reject) => {
    const req = https.request(checkoutUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({ status: res.statusCode, data: data });
      });
    });
    
    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

// Main test function
async function runTestOrder() {
  console.log('🧪 Starting Test Order Creation...\n');
  
  try {
    // Test Stripe payment intent
    const paymentResult = await createTestPaymentIntent();
    
    if (paymentResult.status === 200) {
      console.log('✅ Payment intent created successfully');
      console.log(`   Payment ID: ${paymentResult.data.id}`);
      console.log(`   Amount: $${TEST_ORDER.amount}`);
      console.log(`   Status: ${paymentResult.data.status}`);
    } else {
      console.log('❌ Payment intent creation failed');
      console.log(`   Status: ${paymentResult.status}`);
      console.log(`   Error: ${paymentResult.data}`);
    }
    
    // Test Shopify checkout
    const checkoutResult = await testShopifyCheckout();
    
    if (checkoutResult.status === 200 || checkoutResult.status === 302) {
      console.log('✅ Shopify checkout test successful');
    } else {
      console.log('❌ Shopify checkout test failed');
      console.log(`   Status: ${checkoutResult.status}`);
    }
    
  } catch (error) {
    console.error('❌ Test order failed:', error.message);
  }
}

// Run test if called directly
if (require.main === module) {
  runTestOrder();
}

module.exports = { runTestOrder, TEST_ORDER };
