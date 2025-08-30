<!-- Updated: 2025-08-30T20:54:08.130Z -->
import fs from 'fs';
import dotenv from 'dotenv';
import { syncAllProductsToShopify } from '../lib/shopify-sync.js';

dotenv.config({ path: '.env.local' });

console.log('🔄 Starting Shopify Product Sync...\n');

// Check if environment variables are set
const requiredEnvVars = ['SHOPIFY_API_KEY', 'SHOPIFY_API_SECRET', 'SHOPIFY_SHOP_NAME', 'SHOPIFY_ACCESS_TOKEN'];
const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  console.error('❌ Missing required environment variables:');
  missingVars.forEach(varName => console.error(`   - ${varName}`));
  console.error('\n📝 Please create a .env.local file with your Shopify credentials.');
  console.error('💡 Copy from shopify-env-example.txt and fill in your actual values.');
  process.exit(1);
}

console.log('✅ Environment variables loaded');
console.log(`🏪 Shop: ${process.env.SHOPIFY_SHOP_NAME}\n`);

try {
  // Read local products
  const content = fs.readFileSync('./data/products.ts', 'utf8');
  const products = JSON.parse(content.match(/export const products = (\[[\s\S]*\]);/)[1]);
  
  console.log(`📦 Found ${products.length} local products`);
  
  // Filter products with actual images (not placeholders)
  const productsWithImages = products.filter(p => 
    p.image && p.image !== '' && !p.image.includes('Product in-Design')
  );
  
  console.log(`🖼️  ${productsWithImages.length} products have images and will be synced`);
  console.log(`⏭️  ${products.length - productsWithImages.length} products will be skipped (no images)\n`);
  
  // Import sync function (you'll need to convert this to CommonJS or use ES modules)
  console.log('📋 Sample products to sync:');
  productsWithImages.slice(0, 5).forEach(p => {
    console.log(`   - ${p.Title} (${p.SalePrice})`);
  });
  
  if (productsWithImages.length > 5) {
    console.log(`   ... and ${productsWithImages.length - 5} more`);
  }
  
  console.log('\n🚀 Starting actual sync to Shopify...');
  

  
  try {
    console.log('🔄 Connecting to Shopify...');
    const results = await syncAllProductsToShopify(
      productsWithImages,
      process.env.SHOPIFY_SHOP_NAME,
      process.env.SHOPIFY_ACCESS_TOKEN
    );
    
    console.log('\n📊 Sync Results:');
    console.log(`✅ Successfully synced: ${results.filter(r => r.status === 'success').length}`);
    console.log(`⏭️  Skipped: ${results.filter(r => r.status === 'skipped').length}`);
    console.log(`❌ Errors: ${results.filter(r => r.status === 'error').length}`);
    
    if (results.filter(r => r.status === 'success').length > 0) {
      console.log('\n🎉 Products are now live on Shopify!');
      console.log('📱 Check your Shopify admin: Products section');
    }
    
  } catch (error) {
    console.error('❌ Sync failed:', error.message);
  }cy of .
  
} catch (error) {
  console.error('❌ Error reading products:', error.message);
}
