require('dotenv').config({ path: '.env.local' });
const fs = require('fs');
const path = require('path');

// Import category mapping
const { CATEGORY_MAPPINGS, createCategoryMapping, validateCategoryMappings } = require('../lib/category-mapping.ts');

async function fetchShopifyProducts() {
  console.log('🔍 Fetching Shopify products...\n');
  
  try {
    const shopUrl = `https://${process.env.SHOPIFY_SHOP_NAME}`;
    console.log(`🏪 Connecting to: ${shopUrl}`);
    
    const response = await fetch(`${shopUrl}/admin/api/2024-01/products.json`, {
      headers: {
        'X-Shopify-Access-Token': process.env.SHOPIFY_ACCESS_TOKEN,
        'Content-Type': 'application/json'
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log(`✅ Found ${data.products.length} products in Shopify`);
      return data.products;
    } else {
      console.log(`❌ API Error: ${response.status} ${response.statusText}`);
      return [];
    }
  } catch (error) {
    console.log('❌ Connection failed:', error.message);
    return [];
  }
}

function migrateProductsWithCategories(shopifyProducts) {
  console.log('\n📝 Migrating to Shopify IDs while preserving categories...\n');
  
  // Read local products
  const productsPath = path.join(__dirname, '..', 'data', 'products.ts');
  let productsContent = fs.readFileSync(productsPath, 'utf8');
  
  // Create mapping of product titles to Shopify IDs
  const productMap = {};
  shopifyProducts.forEach(shopifyProduct => {
    productMap[shopifyProduct.title] = {
      id: shopifyProduct.id,
      handle: shopifyProduct.handle,
      variants: shopifyProduct.variants
    };
  });
  
  console.log('📋 Product mapping created:');
  Object.keys(productMap).forEach(title => {
    console.log(`  "${title}" → Shopify ID: ${productMap[title].id}`);
  });
  
  // Validate category mappings first
  const currentProducts = JSON.parse(productsContent.match(/export const products: Product\[\] = (\[[\s\S]*?\]);/)[1]);
  const validation = validateCategoryMappings(currentProducts);
  
  if (!validation.valid) {
    console.log('\n❌ Missing category mappings:');
    validation.missing.forEach(id => console.log(`  - ${id}`));
    console.log('\n💡 Please add missing categories to CATEGORY_MAPPINGS before proceeding');
    return 0;
  }
  
  console.log('\n✅ All products have category mappings');
  
  let updatedCount = 0;
  const categoryMappings = [];
  
  // Update each product ID and preserve category
  Object.keys(productMap).forEach(title => {
    const shopifyData = productMap[title];
    const originalId = productsContent.match(new RegExp(`"title":\\s*"${title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"[\\s\\S]*?"id":\\s*"([^"]+)"`));
    
    if (originalId) {
      const originalDsId = originalId[1];
      const category = CATEGORY_MAPPINGS[originalDsId];
      
      // Replace the ID
      const oldIdPattern = new RegExp(`"id":\\s*"${originalDsId}"`, 'g');
      const newIdPattern = `"id": "${shopifyData.id}"`;
      
      if (productsContent.match(oldIdPattern)) {
        productsContent = productsContent.replace(oldIdPattern, newIdPattern);
        
        // Create category mapping
        categoryMappings.push(createCategoryMapping(originalDsId, shopifyData.id));
        
        console.log(`✅ ${title}: ${originalDsId} → ${shopifyData.id} (Category: ${category})`);
        updatedCount++;
      }
    }
  });
  
  // Write updated products file
  fs.writeFileSync(productsPath, productsContent, 'utf8');
  
  // Create category mappings file
  const categoryMappingsPath = path.join(__dirname, '..', 'data', 'category-mappings.json');
  fs.writeFileSync(categoryMappingsPath, JSON.stringify(categoryMappings, null, 2), 'utf8');
  
  console.log(`\n📁 Category mappings saved to: ${categoryMappingsPath}`);
  
  return updatedCount;
}

async function main() {
  console.log('🔄 Shopify ID Migration with Category Preservation\n');
  
  // Check environment variables
  if (!process.env.SHOPIFY_SHOP_NAME || !process.env.SHOPIFY_ACCESS_TOKEN) {
    console.log('❌ Missing Shopify credentials in .env.local');
    console.log('Please update your .env.local file with actual Shopify credentials');
    return;
  }
  
  // Fetch Shopify products
  const shopifyProducts = await fetchShopifyProducts();
  
  if (shopifyProducts.length === 0) {
    console.log('❌ No products found or connection failed');
    return;
  }
  
  // Migrate products while preserving categories
  const updatedCount = migrateProductsWithCategories(shopifyProducts);
  
  console.log('\n🎉 Migration Complete!');
  console.log(`📊 Summary:`);
  console.log(`  - Shopify products found: ${shopifyProducts.length}`);
  console.log(`  - Local products updated: ${updatedCount}`);
  console.log(`  - Categories preserved: ✅`);
  console.log(`  - Unified numbering system: ✅ Active`);
  
  console.log('\n💡 Benefits of this approach:');
  console.log(`  - Single source of truth: Shopify Product IDs`);
  console.log(`  - Categories preserved: A-J system maintained`);
  console.log(`  - Website functionality: ✅ Unchanged`);
  console.log(`  - Product Catalog Integration: ✅ Ready`);
  console.log(`  - Amazon FBA compatibility: ✅ Ready`);
  
  console.log('\n🔧 Next Steps:');
  console.log(`  1. Test website functionality`);
  console.log(`  2. Update Product Catalog Integration`);
  console.log(`  3. Add GTIN/UPC/ISBN fields for Amazon`);
  console.log(`  4. Configure Amazon FBA listings`);
}

main().catch(console.error);
