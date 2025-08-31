require('dotenv').config({ path: '.env.local' });

// Import product data
const { products } = require('../data/products.ts');

async function syncProductsToShopify() {
  console.log('🔄 Starting product sync to Shopify...\n');
  
  try {
    const shopUrl = `https://${process.env.SHOPIFY_SHOP_NAME}`;
    console.log(`🏪 Connecting to: ${shopUrl}`);
    
    // Filter out empty/placeholder products
    const validProducts = products.filter(product => 
      product.Title && 
      product.Title.trim() !== '' && 
      product.id !== 0 && 
      product.id !== 'A' && 
      product.id !== 'B' && 
      product.id !== 'C' && 
      product.id !== 'D' && 
      product.id !== 'E' && 
      product.id !== 'F' && 
      product.id !== 'G' && 
      product.id !== 'H' && 
      product.id !== 'I' && 
      product.id !== 'J'
    );
    
    console.log(`📦 Found ${validProducts.length} valid products to sync`);
    
    let successCount = 0;
    let errorCount = 0;
    
    // Process products in batches to avoid rate limits
    for (let i = 0; i < validProducts.length; i++) {
      const product = validProducts[i];
      
      try {
        // Convert local product format to Shopify format
        const shopifyProduct = {
          product: {
            title: product.Title,
            body_html: product.Description || '',
            vendor: product.Author || 'DS LLC',
            product_type: product.Type || 'General',
            tags: ['DarkStreets', 'DSLLC'],
            variants: [{
              option1: 'Default Title',
              price: product.SalePrice ? product.SalePrice.replace('$', '') : '24.99',
              compare_at_price: product.OriginalPrice ? product.OriginalPrice.replace('$', '') : '29.99',
              inventory_quantity: product.InStock ? parseInt(product.InStock) : 10,
              inventory_management: 'shopify'
            }],
            options: [{
              name: 'Title',
              values: ['Default Title']
            }]
          }
        };
        
        // Create product in Shopify
        const response = await fetch(`${shopUrl}/admin/api/2024-01/products.json`, {
          method: 'POST',
          headers: {
            'X-Shopify-Access-Token': process.env.SHOPIFY_ACCESS_TOKEN,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(shopifyProduct)
        });
        
        if (response.ok) {
          const result = await response.json();
          console.log(`✅ Created: ${product.Title} (ID: ${result.product.id})`);
          successCount++;
        } else {
          console.log(`❌ Failed: ${product.Title} - ${response.status} ${response.statusText}`);
          errorCount++;
        }
        
        // Rate limiting - wait 1 second between requests
        await new Promise(resolve => setTimeout(resolve, 1000));
        
      } catch (error) {
        console.log(`❌ Error with ${product.Title}: ${error.message}`);
        errorCount++;
      }
    }
    
    console.log('\n📊 Sync Summary:');
    console.log(`✅ Successfully created: ${successCount} products`);
    console.log(`❌ Failed: ${errorCount} products`);
    console.log(`📦 Total processed: ${validProducts.length} products`);
    
    if (successCount > 0) {
      console.log('\n🎉 Product sync completed!');
      console.log('Your products are now available in your Shopify store.');
    }
    
  } catch (error) {
    console.log('❌ Sync failed:', error.message);
  }
}

syncProductsToShopify();
