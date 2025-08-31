require('dotenv').config({ path: '.env.local' });

async function testShopifyConnection() {
  console.log('🔍 Testing Shopify API Connection...\n');
  
  // Check environment variables
  console.log('📋 Environment Variables Check:');
  console.log(`API Key: ${process.env.SHOPIFY_API_KEY ? '✅ Set' : '❌ Missing'}`);
  console.log(`API Secret: ${process.env.SHOPIFY_API_SECRET ? '✅ Set' : '❌ Missing'}`);
  console.log(`Shop Name: ${process.env.SHOPIFY_SHOP_NAME ? '✅ Set' : '❌ Missing'}`);
  console.log(`Access Token: ${process.env.SHOPIFY_ACCESS_TOKEN ? '✅ Set' : '❌ Missing'}`);
  
  if (!process.env.SHOPIFY_API_KEY || !process.env.SHOPIFY_API_SECRET || 
      !process.env.SHOPIFY_SHOP_NAME || !process.env.SHOPIFY_ACCESS_TOKEN) {
    console.log('\n❌ Missing required environment variables. Please check your .env.local file.');
    return;
  }
  
  console.log('\n✅ All environment variables are set!');
  console.log(`🏪 Shop: ${process.env.SHOPIFY_SHOP_NAME}`);
  console.log(`🔑 API Key: ${process.env.SHOPIFY_API_KEY.substring(0, 8)}...`);
  console.log(`🎫 Access Token: ${process.env.SHOPIFY_ACCESS_TOKEN.substring(0, 8)}...`);
  
  console.log('\n🎉 Shopify API connection setup is ready!');
  console.log('Next step: Test actual API calls to Shopify...');
}

testShopifyConnection().catch(console.error);
