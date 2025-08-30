<!-- Updated: 2025-08-30T20:54:08.120Z -->
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

console.log('🔄 Starting Shopify Product Sync...\n');

// Check environment variables
const requiredEnvVars = ['SHOPIFY_API_KEY', 'SHOPIFY_API_SECRET', 'SHOPIFY_SHOP_NAME', 'SHOPIFY_ACCESS_TOKEN'];
const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  console.error('❌ Missing required environment variables:');
  missingVars.forEach(varName => console.error(`   - ${varName}`));
  process.exit(1);
}

console.log('✅ Environment variables loaded');
console.log(`🏪 Shop: ${process.env.SHOPIFY_SHOP_NAME}\n`);

// Convert local product format to Shopify format
function convertToShopifyProduct(localProduct) {
  return {
    title: localProduct.Title,
    body_html: localProduct.Description || '',
    vendor: localProduct.Author || 'DS LLC',
    product_type: localProduct.Type || 'General',
    tags: localProduct.Category ? [localProduct.Category] : [],
    variants: [
      {
        price: localProduct.SalePrice?.replace(/[^0-9.]/g, '') || '0',
        compare_at_price: localProduct.OriginalPrice?.replace(/[^0-9.]/g, '') || null,
        inventory_quantity: localProduct.InStock ? 100 : 0,
        inventory_management: 'shopify',
        requires_shipping: true,
        taxable: true,
      }
    ],
    status: 'active',
    published: true,
  };
}

// Sync products to Shopify
async function syncProductsToShopify(products, shop, accessToken) {
  const results = [];
  
  for (const product of products) {
    try {
      console.log(`🔄 Syncing: ${product.Title}`);
      
      const shopifyProduct = convertToShopifyProduct(product);
      
      // Make API call to Shopify
      const response = await fetch(`https://${shop}/admin/api/2024-01/products.json`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Access-Token': accessToken,
        },
        body: JSON.stringify({ product: shopifyProduct })
      });
      
      if (response.ok) {
        const result = await response.json();
        results.push({
          title: product.Title,
          status: 'success',
          shopifyId: result.product.id
        });
        console.log(`✅ Success: ${product.Title} (ID: ${result.product.id})`);
      } else {
        const error = await response.text();
        results.push({
          title: product.Title,
          status: 'error',
          error: `HTTP ${response.status}: ${error}`
        });
        console.error(`❌ Failed: ${product.Title} - ${error}`);
      }
      
      // Rate limiting - Shopify allows 2 requests per second
      await new Promise(resolve => setTimeout(resolve, 500));
      
    } catch (error) {
      results.push({
        title: product.Title,
        status: 'error',
        error: error.message
      });
      console.error(`❌ Error: ${product.Title} - ${error.message}`);
    }
  }
  
  return results;
}

// Main execution
try {
  // Read local products
  const content = fs.readFileSync('./data/products.ts', 'utf8');
  const products = JSON.parse(content.match(/export const products = (\[[\s\S]*\]);/)[1]);
  
  console.log(`📦 Found ${products.length} local products`);
  
  // Filter products with actual images
  const productsWithImages = products.filter(p => 
    p.image && p.image !== '' && !p.image.includes('Product in-Design')
  );
  
  console.log(`🖼️  ${productsWithImages.length} products have images and will be synced`);
  console.log(`⏭️  ${products.length - productsWithImages.length} products will be skipped (no images)\n`);
  
  if (productsWithImages.length === 0) {
    console.log('⚠️  No products to sync. Add images to products first.');
    process.exit(0);
  }
  
  console.log('📋 Products to sync:');
  productsWithImages.slice(0, 5).forEach(p => {
    console.log(`   - ${p.Title} (${p.SalePrice})`);
  });
  
  if (productsWithImages.length > 5) {
    console.log(`   ... and ${productsWithImages.length - 5} more`);
  }
  
  console.log('\n🚀 Starting actual sync to Shopify...');
  console.log('⏱️  This may take a few minutes due to rate limiting...\n');
  
  const results = await syncProductsToShopify(
    productsWithImages,
    process.env.SHOPIFY_SHOP_NAME,
    process.env.SHOPIFY_ACCESS_TOKEN
  );
  
  console.log('\n📊 Sync Results:');
  console.log(`✅ Successfully synced: ${results.filter(r => r.status === 'success').length}`);
  console.log(`❌ Errors: ${results.filter(r => r.status === 'error').length}`);
  
  if (results.filter(r => r.status === 'success').length > 0) {
    console.log('\n🎉 Products are now live on Shopify!');
    console.log('📱 Check your Shopify admin: Products section');
    console.log(`🔗 Admin URL: https://${process.env.SHOPIFY_SHOP_NAME}/admin`);
  }
  
} catch (error) {
  console.error('❌ Sync failed:', error.message);
}
