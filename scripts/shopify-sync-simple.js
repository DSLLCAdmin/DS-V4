import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

console.log('🔄 Starting Shopify Product Sync...\n');

// Check if environment variables are set
const requiredEnvVars = ['SHOPIFY_API_KEY', 'SHOPIFY_API_SECRET', 'SHOPIFY_SHOP_NAME', 'SHOPIFY_ACCESS_TOKEN'];
const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  console.error('❌ Missing required environment variables:');
  missingVars.forEach(varName => console.error(`   - ${varName}`));
  console.error('\n📝 Please create a .env.local file with your Shopify credentials.');
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
  
  console.log('📋 Sample products to sync:');
  productsWithImages.slice(0, 5).forEach(p => {
    console.log(`   - ${p.Title} (${p.SalePrice})`);
  });
  
  if (productsWithImages.length > 5) {
    console.log(`   ... and ${productsWithImages.length - 5} more`);
  }
  
  console.log('\n🚀 Ready to sync!');
  console.log('📱 Your products will appear in Shopify admin after sync');
  console.log('💡 Next: We need to implement the actual API calls to Shopify');
  
} catch (error) {
  console.error('❌ Error reading products:', error.message);
}
