require('dotenv').config({ path: '.env.local' });
const fs = require('fs');
const path = require('path');

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

function updateLocalProducts(shopifyProducts) {
  console.log('\n📝 Updating local product data...\n');
  
  // Read local products
  const productsPath = path.join(__dirname, '..', 'data', 'products.ts');
  let productsContent = fs.readFileSync(productsPath, 'utf8');
  
  // Create mapping of product names to Shopify IDs
  const productMap = {};
  shopifyProducts.forEach(shopifyProduct => {
    productMap[shopifyProduct.title] = {
      id: shopifyProduct.id,
      handle: shopifyProduct.handle,
      variants: shopifyProduct.variants
    };
  });
  
  console.log('📋 Product mapping created:');
  Object.keys(productMap).forEach(name => {
    console.log(`  ${name} → Shopify ID: ${productMap[name].id}`);
  });
  
  // Update the products.ts file with Shopify IDs
  let updatedContent = productsContent;
  
  // Find and replace product IDs
  const productRegex = /"id":\s*["`]?([^"`,]+)["`]?/g;
  let match;
  let updatedCount = 0;
  
  while ((match = productRegex.exec(productsContent)) !== null) {
    const fullMatch = match[0];
    const oldId = match[1];
    
    // Find the product title (look for the Title field near this id)
    const beforeMatch = productsContent.substring(0, match.index);
    const titleMatch = beforeMatch.match(/"Title":\s*["`]([^"`]+)["`]/);
    
    if (titleMatch) {
      const productTitle = titleMatch[1];
      const shopifyData = productMap[productTitle];
      
      if (shopifyData) {
        const newId = shopifyData.id;
        updatedContent = updatedContent.replace(fullMatch, `"id": ${newId}`);
        console.log(`✅ Updated ${productTitle}: ${oldId} → ${newId}`);
        updatedCount++;
      }
    }
  }
  
  // Add Shopify metadata to the file
  const shopifyMetadata = `
// Shopify Integration Metadata
// Last updated: ${new Date().toISOString()}
// Total products synced: ${shopifyProducts.length}
// Shopify shop: ${process.env.SHOPIFY_SHOP_NAME}
`;

  updatedContent = shopifyMetadata + updatedContent;
  
  // Write updated content
  fs.writeFileSync(productsPath, updatedContent);
  
  console.log(`\n✅ Successfully updated ${updatedCount} products with Shopify IDs`);
  console.log(`📁 Updated file: ${productsPath}`);
  
  return updatedCount;
}

async function main() {
  console.log('🔄 Shopify Product ID Update Script\n');
  
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
  
  // Update local products
  const updatedCount = updateLocalProducts(shopifyProducts);
  
  console.log('\n🎉 Product ID Update Complete!');
  console.log(`📊 Summary:`);
  console.log(`  - Shopify products found: ${shopifyProducts.length}`);
  console.log(`  - Local products updated: ${updatedCount}`);
  console.log(`  - Unified numbering system: ✅ Active`);
  
  console.log('\n💡 Benefits of unified numbering:');
  console.log(`  - Single source of truth for product IDs`);
  console.log(`  - Eliminates duplication and confusion`);
  console.log(`  - Direct mapping between local and Shopify data`);
  console.log(`  - Easier inventory management`);
}

main().catch(console.error);
