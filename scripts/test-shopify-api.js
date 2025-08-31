require('dotenv').config({ path: '.env.local' });

async function testShopifyAPI() {
  console.log('🔍 Testing Shopify API Connection...\n');
  
  try {
    // Test basic connection
    const shopUrl = `https://${process.env.SHOPIFY_SHOP_NAME}`;
    console.log(`🏪 Connecting to: ${shopUrl}`);
    
    // Simple test - try to access the shop's basic info
    const response = await fetch(`${shopUrl}/admin/api/2024-01/shop.json`, {
      headers: {
        'X-Shopify-Access-Token': process.env.SHOPIFY_ACCESS_TOKEN,
        'Content-Type': 'application/json'
      }
    });
    
    if (response.ok) {
      const shopData = await response.json();
      console.log('✅ Successfully connected to Shopify!');
      console.log(`🏪 Shop Name: ${shopData.shop.name}`);
      console.log(`📧 Email: ${shopData.shop.email}`);
      console.log(`🌐 Domain: ${shopData.shop.domain}`);
      console.log(`💰 Currency: ${shopData.shop.currency}`);
      
      console.log('\n🎉 Shopify API is working perfectly!');
      console.log('Ready for product sync and e-commerce features.');
    } else {
      console.log(`❌ API Error: ${response.status} ${response.statusText}`);
    }
    
  } catch (error) {
    console.log('❌ Connection failed:', error.message);
    console.log('Please check your credentials and internet connection.');
  }
}

testShopifyAPI();
