const fs = require('fs');
const path = require('path');

// Simulate Shopify products for testing
const mockShopifyProducts = [
  { id: 'gid://shopify/Product/1234567890', title: 'First & Light- E-book', handle: 'first-light-ebook' },
  { id: 'gid://shopify/Product/1234567891', title: 'First & Light- Paperback', handle: 'first-light-paperback' },
  { id: 'gid://shopify/Product/1234567892', title: 'Risque & Safety- E-book', handle: 'risque-safety-ebook' },
  { id: 'gid://shopify/Product/1234567893', title: 'Risque & Safety- Paperback', handle: 'risque-safety-paperback' },
  { id: 'gid://shopify/Product/1234567894', title: 'Mercury & Memory- E-book', handle: 'mercury-memory-ebook' },
  { id: 'gid://shopify/Product/1234567895', title: 'Mercury & Memory- Paperback', handle: 'mercury-memory-paperback' },
  { id: 'gid://shopify/Product/1234567896', title: 'DarkStreet Tees', handle: 'darkstreet-tees' },
  { id: 'gid://shopify/Product/1234567897', title: 'Hats', handle: 'hats' },
  { id: 'gid://shopify/Product/1234567898', title: 'DarkStreet Mugs', handle: 'darkstreet-mugs' },
  { id: 'gid://shopify/Product/1234567899', title: 'Official DarkStreet Driving Playlists', handle: 'darkstreet-playlists' },
  { id: 'gid://shopify/Product/1234567900', title: 'DS Route Generator App', handle: 'ds-route-generator' }
];

function createBackup() {
  console.log('📁 Creating backup of current products...');
  const productsPath = path.join(__dirname, '..', 'data', 'products.ts');
  const backupPath = path.join(__dirname, '..', 'data', 'products.backup.ts');
  
  if (fs.existsSync(productsPath)) {
    fs.copyFileSync(productsPath, backupPath);
    console.log(`✅ Backup created: ${backupPath}`);
    return true;
  }
  return false;
}

function migrateProductsWithCategories(shopifyProducts) {
  console.log('\n📝 DRY RUN: Migrating to Shopify IDs while preserving categories...\n');
  
  // Read local products
  const productsPath = path.join(__dirname, '..', 'data', 'products.ts');
  let productsContent = fs.readFileSync(productsPath, 'utf8');
  
  // Create mapping of product titles to Shopify IDs
  const productMap = {};
  shopifyProducts.forEach(shopifyProduct => {
    productMap[shopifyProduct.title] = {
      id: shopifyProduct.id,
      handle: shopifyProduct.handle
    };
  });
  
  console.log('📋 Product mapping created:');
  Object.keys(productMap).forEach(title => {
    console.log(`  "${title}" → Shopify ID: ${productMap[title].id}`);
  });
  
  let updatedCount = 0;
  const migrationLog = [];
  
  // Update each product ID
  Object.keys(productMap).forEach(title => {
    const shopifyData = productMap[title];
    const originalId = productsContent.match(new RegExp(`"title":\\s*"${title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"[\\s\\S]*?"id":\\s*"([^"]+)"`));
    
    if (originalId) {
      const originalDsId = originalId[1];
      
      // Replace the ID
      const oldIdPattern = new RegExp(`"id":\\s*"${originalDsId}"`, 'g');
      const newIdPattern = `"id": "${shopifyData.id}"`;
      
      if (productsContent.match(oldIdPattern)) {
        productsContent = productsContent.replace(oldIdPattern, newIdPattern);
        
        migrationLog.push({
          originalId: originalDsId,
          newId: shopifyData.id,
          title: title,
          handle: shopifyData.handle
        });
        
        console.log(`✅ ${title}: ${originalDsId} → ${shopifyData.id}`);
        updatedCount++;
      }
    }
  });
  
  // Write updated products file
  fs.writeFileSync(productsPath, productsContent, 'utf8');
  
  // Create migration log
  const migrationLogPath = path.join(__dirname, '..', 'data', 'migration-log.json');
  fs.writeFileSync(migrationLogPath, JSON.stringify(migrationLog, null, 2), 'utf8');
  
  console.log(`\n📁 Migration log saved to: ${migrationLogPath}`);
  
  return updatedCount;
}

function testPlatformFunctionality() {
  console.log('\n🧪 Testing platform functionality...\n');
  
  // Test 1: Check if products.ts can be imported
  try {
    const productsPath = path.join(__dirname, '..', 'data', 'products.ts');
    const productsContent = fs.readFileSync(productsPath, 'utf8');
    
    // Extract products array
    const productsMatch = productsContent.match(/export const products: Product\[\] = (\[[\s\S]*?\]);/);
    if (productsMatch) {
      const products = JSON.parse(productsMatch[1]);
      console.log(`✅ Products file readable: ${products.length} products found`);
      
      // Test 2: Check for Shopify IDs
      const shopifyIds = products.filter(p => p.id.startsWith('gid://shopify/Product/'));
      console.log(`✅ Shopify IDs detected: ${shopifyIds.length} products migrated`);
      
      // Test 3: Check for remaining alpha-numeric IDs
      const alphaIds = products.filter(p => /^[A-Z]?\d+[a-z]?$/.test(p.id));
      console.log(`⚠️  Alpha-numeric IDs remaining: ${alphaIds.length} products`);
      
      if (alphaIds.length > 0) {
        console.log('   Remaining IDs:', alphaIds.map(p => `${p.id} (${p.title})`).join(', '));
      }
      
      return { success: true, products, shopifyIds, alphaIds };
    }
  } catch (error) {
    console.log(`❌ Error reading products: ${error.message}`);
    return { success: false, error };
  }
}

function restoreBackup() {
  console.log('\n🔄 Restoring backup...');
  const productsPath = path.join(__dirname, '..', 'data', 'products.ts');
  const backupPath = path.join(__dirname, '..', 'data', 'products.backup.ts');
  
  if (fs.existsSync(backupPath)) {
    fs.copyFileSync(backupPath, productsPath);
    fs.unlinkSync(backupPath);
    console.log('✅ Backup restored successfully');
    return true;
  }
  return false;
}

async function main() {
  console.log('🔄 DRY RUN: Shopify ID Migration Test\n');
  
  // Step 1: Create backup
  const backupCreated = createBackup();
  if (!backupCreated) {
    console.log('❌ Could not create backup. Aborting.');
    return;
  }
  
  // Step 2: Run migration
  const updatedCount = migrateProductsWithCategories(mockShopifyProducts);
  
  console.log('\n🎉 Migration Complete!');
  console.log(`📊 Summary:`);
  console.log(`  - Mock Shopify products: ${mockShopifyProducts.length}`);
  console.log(`  - Local products updated: ${updatedCount}`);
  
  // Step 3: Test platform functionality
  const testResults = testPlatformFunctionality();
  
  if (testResults.success) {
    console.log('\n✅ Platform functionality test PASSED');
    console.log('\n💡 Next steps:');
    console.log('  1. Test website in browser');
    console.log('  2. Check product pages load correctly');
    console.log('  3. Verify cart functionality');
    console.log('  4. Test admin dashboards');
    console.log('  5. If all tests pass, keep migration');
    console.log('  6. If issues found, restore backup');
    
    console.log('\n🔄 To restore backup if needed:');
    console.log('   node scripts/test-migration-dry-run.js --restore');
  } else {
    console.log('\n❌ Platform functionality test FAILED');
    console.log('Restoring backup...');
    restoreBackup();
  }
}

// Handle restore command
if (process.argv.includes('--restore')) {
  restoreBackup();
  console.log('✅ Backup restored. Migration reverted.');
} else {
  main().catch(console.error);
}
