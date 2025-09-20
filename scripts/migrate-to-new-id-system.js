const fs = require('fs');
const path = require('path');

// New ID System Mapping
const ID_MIGRATION_MAP = {
  // Category A: Serials/Books (was scattered 1a, 1b, 2a, 2b, 3a, 3b, 11a, 11b)
  '1a': 'A-01',   // First & Light- E-book
  '1b': 'A-02',   // First & Light- Paperback
  '2a': 'A-03',   // Risque & Safety- E-book
  '2b': 'A-04',   // Risque & Safety- Paperback
  '3a': 'A-05',   // Mercury & Memory- E-book
  '3b': 'A-06',   // Mercury & Memory- Paperback
  '11a': 'A-07',  // Vol-1 - E-book
  '11b': 'A-08',  // Vol-1 - Paperback

  // Category B: Apparel & Intimate Wear (was A1-A10)
  'A1': 'B-01',   // DarkStreet Panties
  'A2': 'B-02',   // Mesh Bodysuits
  'A3': 'B-03',   // Asphalt Black Denim Jackets
  'A4': 'B-04',   // DarkStreet Tees
  'A5': 'B-05',   // Silk Scarves
  'A6': 'B-06',   // Boxers
  'A7': 'B-07',   // Tank Tops (Men/Women)
  'A8': 'B-08',   // Hats
  'A9': 'B-09',   // Hats (duplicate - need to check)
  'A10': 'B-10',  // Convertible Wrap Dresses

  // Category C: Auto & Mobility (was B1-B10)
  'B1': 'C-01',   // Custom LED Underlighting Kits
  'B2': 'C-02',   // DarkStreet Branded Scent Diffusers
  'B3': 'C-03',   // Window Shades
  'B4': 'C-04',   // Prowler Dashboard Confessionals
  'B5': 'C-05',   // Seatbelt Harness Covers
  'B6': 'C-06',   // Streetin' Survival Kits
  'B7': 'C-07',   // Mirror Charms
  'B8': 'C-08',   // Custom Vanity Plate Frames
  'B9': 'C-09',   // Backseat Throw Blankets
  'B10': 'C-10',  // (Need to check what this was)

  // Category D: Accessories (was C1-C10)
  'C1': 'D-01',   // Retro Noir Sunglass Series
  'C2': 'D-02',   // Cigarette Case Wallets
  'C3': 'D-03',   // Lighter Collabs
  'C4': 'D-04',   // Silicone Wristbands
  'C5': 'D-05',   // Temporary Tattoos
  'C6': 'D-06',   // Embroidered Patches
  'C7': 'D-07',   // Knuckle Rings
  'C8': 'D-08',   // Graffiti Street Tag Stickers
  'C9': 'D-09',   // Leather Keychains
  'C10': 'D-10',  // Dashboard Candles

  // Category E: Home & Mood & Atmosphere (was D1-D14)
  'D1': 'E-01',   // DS Scented Candle Collection
  'D2': 'E-02',   // Asphalt & Aftershave
  'D3': 'E-03',   // Coconut & Gin
  'D4': 'E-04',   // Midnight Bleach
  'D5': 'E-05',   // Prowler Interior: '69 Edition
  'D6': 'E-06',   // Neon Light Wall Signs
  'D7': 'E-07',   // Backseat Room Fragrance
  'D8': 'E-08',   // Moonlight Noir Projection Lamps
  'D9': 'E-09',   // Soundscape Machines
  'D10': 'E-10',  // Secret-Safe Lamps
  'D11': 'E-11',  // Erotic Tarot Decks
  'D12': 'E-12',  // Streetlight Bath Bombs
  'D13': 'E-13',  // Art Prints
  'D14': 'E-14',  // Tabletop Graffiti Sets

  // Category F: Media & Experiences (was E1-E10)
  'E1': 'F-01',   // Official DarkStreet Driving Playlists
  'E2': 'F-02',   // Interactive Audio Zines
  'E3': 'F-03',   // Midnight Poetry Readings
  'E4': 'F-04',   // DS Short Film Anthology
  'E5': 'F-05',   // Voice Memos from Aries or Dancer
  'E6': 'F-06',   // Car Sex Safety Course
  'E7': 'F-07',   // Digital 'Rehearse in the Ruins'
  'E8': 'F-08',   // DSA: DarkStreeters Anonymous Newsletter
  'E9': 'F-09',   // (Need to check)
  'E10': 'F-10',  // (Need to check)

  // Category G: Digital & Curated Services (was F1-F7)
  'F1': 'G-01',   // 'DS Route Generator' App
  'F2': 'G-02',   // 'Streetin' Score' AI Tool
  'F3': 'G-03',   // Digital Streetlight Flash Fiction Pack
  'F4': 'G-04',   // Text Message Confessional Subscription
  'F5': 'G-05',   // Augmented Reality Scene Overlays
  'F6': 'G-06',   // Chatbot Roleplay with Aries or Dancer
  'F7': 'G-07',   // Custom Memory Erasure Generator

  // Category H: Culinary & Novelty (was G1-G5)
  'G1': 'H-01',   // 'Noir-ade' Beverages
  'G2': 'H-02',   // DarkStreet Mugs
  'G3': 'H-03',   // Streetlight Ice Cubes
  'G4': 'H-04',   // Prowler Flask Kit
  'G5': 'H-05',   // (Need to check)

  // Category I: Collector & Art-Based (was H1-H7)
  'H1': 'I-01',   // Limited-Edition Zines
  'H2': 'I-02',   // Graphic Novella Box Sets
  'H3': 'I-03',   // Hand-Numbered Prints of DS Street Maps
  'H4': 'I-04',   // Collectible Character Cards
  'H5': 'I-05',   // DS Polaroid Sets
  'H6': 'I-06',   // Tactile Memory Packs
  'H7': 'I-07',   // Backseat Diorama Kits

  // Category J: Live & Social Activation (was I1-I6)
  'I1': 'J-01',   // Backseat Theater Box
  'I2': 'J-02',   // 'Memory & Mercury' Scavenger Hunt
  'I3': 'J-03',   // Pop-Up Confession Booths
  'I4': 'J-04',   // Streetlight Salons
  'I5': 'J-05',   // Backseat Photo Booth Pop-Ups
  'I6': 'J-06',   // Custom Drive-In Screenings

  // Category K: Relationship & Erotic & Mystery-Inspired (was J1-J8)
  'J1': 'K-01',   // DS Bedroom Dice
  'J2': 'K-02',   // Lovers Game
  'J3': 'K-03',   // Anonymous Drop Letters
  'J4': 'K-04',   // Stolen Glance Mirrors
  'J5': 'K-05',   // Aries' Burner Phone Prop Replica
  'J6': 'K-06',   // DS Mood Ring Keychains
  'J7': 'K-07',   // Journals
  'J8': 'K-08',   // Customizable Digital Memory Vaults
};

// Category mapping for the new system
const NEW_CATEGORY_MAP = {
  'A': 'Serials/Books',
  'B': 'Apparel & Intimate Wear',
  'C': 'Auto & Mobility',
  'D': 'Accessories',
  'E': 'Home & Mood & Atmosphere',
  'F': 'Media & Experiences',
  'G': 'Digital & Curated Services',
  'H': 'Culinary & Novelty',
  'I': 'Collector & Art-Based',
  'J': 'Live & Social Activation',
  'K': 'Relationship & Erotic & Mystery-Inspired'
};

function createBackup() {
  console.log('📁 Creating backup of current files...');
  const filesToBackup = [
    'data/products.ts',
    'data/product-lookup.ts',
    'lib/category-mapping.ts'
  ];
  
  const backups = [];
  filesToBackup.forEach(file => {
    const filePath = path.join(__dirname, '..', file);
    const backupPath = path.join(__dirname, '..', file.replace('.ts', '.backup.ts'));
    
    if (fs.existsSync(filePath)) {
      fs.copyFileSync(filePath, backupPath);
      backups.push(backupPath);
      console.log(`✅ Backup created: ${backupPath}`);
    }
  });
  
  return backups.length > 0;
}

function migrateProductsFile() {
  console.log('\n📝 Migrating products.ts to new ID system...\n');
  
  const productsPath = path.join(__dirname, '..', 'data', 'products.ts');
  let productsContent = fs.readFileSync(productsPath, 'utf8');
  
  let updatedCount = 0;
  const migrationLog = [];
  
  // Update each product ID
  Object.keys(ID_MIGRATION_MAP).forEach(oldId => {
    const newId = ID_MIGRATION_MAP[oldId];
    
    // Replace the ID in the products array
    const oldIdPattern = new RegExp(`"id":\\s*"${oldId}"`, 'g');
    const newIdPattern = `"id": "${newId}"`;
    
    if (productsContent.match(oldIdPattern)) {
      productsContent = productsContent.replace(oldIdPattern, newIdPattern);
      
      migrationLog.push({
        oldId: oldId,
        newId: newId,
        category: NEW_CATEGORY_MAP[newId.split('-')[0]]
      });
      
      console.log(`✅ ${oldId} → ${newId}`);
      updatedCount++;
    }
  });
  
  // Write updated products file
  fs.writeFileSync(productsPath, productsContent, 'utf8');
  
  // Create migration log
  const migrationLogPath = path.join(__dirname, '..', 'data', 'id-migration-log.json');
  fs.writeFileSync(migrationLogPath, JSON.stringify(migrationLog, null, 2), 'utf8');
  
  console.log(`\n📁 Migration log saved to: ${migrationLogPath}`);
  
  return updatedCount;
}

function migrateProductLookupFile() {
  console.log('\n📝 Migrating product-lookup.ts to new ID system...\n');
  
  const lookupPath = path.join(__dirname, '..', 'data', 'product-lookup.ts');
  let lookupContent = fs.readFileSync(lookupPath, 'utf8');
  
  let updatedCount = 0;
  
  // Update object keys and dsProductId fields
  Object.keys(ID_MIGRATION_MAP).forEach(oldId => {
    const newId = ID_MIGRATION_MAP[oldId];
    
    // Replace object key
    const oldKeyPattern = new RegExp(`'${oldId}':\\s*{`, 'g');
    const newKeyPattern = `'${newId}': {`;
    
    if (lookupContent.match(oldKeyPattern)) {
      lookupContent = lookupContent.replace(oldKeyPattern, newKeyPattern);
      
      // Replace dsProductId field
      const oldDsIdPattern = new RegExp(`dsProductId:\\s*'${oldId}'`, 'g');
      const newDsIdPattern = `dsProductId: '${newId}'`;
      lookupContent = lookupContent.replace(oldDsIdPattern, newDsIdPattern);
      
      console.log(`✅ Lookup: ${oldId} → ${newId}`);
      updatedCount++;
    }
  });
  
  // Write updated lookup file
  fs.writeFileSync(lookupPath, lookupContent, 'utf8');
  
  return updatedCount;
}

function migrateCategoryMappingFile() {
  console.log('\n📝 Migrating category-mapping.ts to new ID system...\n');
  
  const mappingPath = path.join(__dirname, '..', 'lib', 'category-mapping.ts');
  let mappingContent = fs.readFileSync(mappingPath, 'utf8');
  
  let updatedCount = 0;
  
  // Update category mappings
  Object.keys(ID_MIGRATION_MAP).forEach(oldId => {
    const newId = ID_MIGRATION_MAP[oldId];
    const category = NEW_CATEGORY_MAP[newId.split('-')[0]];
    
    // Replace old mapping
    const oldMappingPattern = new RegExp(`'${oldId}':\\s*'[^']+'`, 'g');
    const newMappingPattern = `'${newId}': '${category}'`;
    
    if (mappingContent.match(oldMappingPattern)) {
      mappingContent = mappingContent.replace(oldMappingPattern, newMappingPattern);
      
      console.log(`✅ Category: ${oldId} → ${newId} (${category})`);
      updatedCount++;
    }
  });
  
  // Write updated mapping file
  fs.writeFileSync(mappingPath, mappingContent, 'utf8');
  
  return updatedCount;
}

function testPlatformFunctionality() {
  console.log('\n🧪 Testing platform functionality...\n');
  
  try {
    // Test 1: Check if products.ts can be parsed
    const productsPath = path.join(__dirname, '..', 'data', 'products.ts');
    const productsContent = fs.readFileSync(productsPath, 'utf8');
    
    const productsMatch = productsContent.match(/export const products: Product\[\] = (\[[\s\S]*?\]);/);
    if (productsMatch) {
      const products = JSON.parse(productsMatch[1]);
      console.log(`✅ Products file readable: ${products.length} products found`);
      
      // Test 2: Check for new ID format
      const newFormatIds = products.filter(p => /^[A-Z]-\d{2}$/.test(p.id));
      console.log(`✅ New format IDs detected: ${newFormatIds.length} products`);
      
      // Test 3: Check for remaining old format IDs
      const oldFormatIds = products.filter(p => /^[A-Z]?\d+[a-z]?$/.test(p.id));
      console.log(`⚠️  Old format IDs remaining: ${oldFormatIds.length} products`);
      
      if (oldFormatIds.length > 0) {
        console.log('   Remaining old IDs:', oldFormatIds.slice(0, 10).map(p => `${p.id} (${p.title})`).join(', '));
        if (oldFormatIds.length > 10) {
          console.log(`   ... and ${oldFormatIds.length - 10} more`);
        }
      }
      
      // Test 4: Check URL compatibility
      const urlIncompatible = products.filter(p => p.id.includes('/') || p.id.includes(':'));
      if (urlIncompatible.length === 0) {
        console.log(`✅ URL compatibility: All IDs are URL-safe`);
      } else {
        console.log(`❌ URL compatibility: ${urlIncompatible.length} IDs contain invalid characters`);
      }
      
      // Test 5: Check category consistency
      const categoryIssues = products.filter(p => {
        const expectedCategory = NEW_CATEGORY_MAP[p.id.split('-')[0]];
        return expectedCategory && p.category !== expectedCategory;
      });
      
      if (categoryIssues.length === 0) {
        console.log(`✅ Category consistency: All products have correct categories`);
      } else {
        console.log(`⚠️  Category issues: ${categoryIssues.length} products have mismatched categories`);
        categoryIssues.slice(0, 5).forEach(p => {
          const expected = NEW_CATEGORY_MAP[p.id.split('-')[0]];
          console.log(`   - ${p.id}: "${p.category}" (expected: "${expected}")`);
        });
      }
      
      return { success: true, products, newFormatIds, oldFormatIds, urlIncompatible, categoryIssues };
    }
  } catch (error) {
    console.log(`❌ Error reading products: ${error.message}`);
    return { success: false, error };
  }
}

function restoreBackup() {
  console.log('\n🔄 Restoring backup...');
  const filesToRestore = [
    'data/products.ts',
    'data/product-lookup.ts',
    'lib/category-mapping.ts'
  ];
  
  let restoredCount = 0;
  filesToRestore.forEach(file => {
    const filePath = path.join(__dirname, '..', file);
    const backupPath = path.join(__dirname, '..', file.replace('.ts', '.backup.ts'));
    
    if (fs.existsSync(backupPath)) {
      fs.copyFileSync(backupPath, filePath);
      fs.unlinkSync(backupPath);
      restoredCount++;
    }
  });
  
  console.log(`✅ Restored ${restoredCount} files from backup`);
  return restoredCount > 0;
}

async function main() {
  console.log('🔄 NEW ID SYSTEM MIGRATION: A-01, B-01 Format\n');
  
  // Step 1: Create backup
  const backupCreated = createBackup();
  if (!backupCreated) {
    console.log('❌ Could not create backup. Aborting.');
    return;
  }
  
  // Step 2: Run migrations
  const productsUpdated = migrateProductsFile();
  const lookupUpdated = migrateProductLookupFile();
  const mappingUpdated = migrateCategoryMappingFile();
  
  console.log('\n🎉 Migration Complete!');
  console.log(`📊 Summary:`);
  console.log(`  - Products updated: ${productsUpdated}`);
  console.log(`  - Lookup entries updated: ${lookupUpdated}`);
  console.log(`  - Category mappings updated: ${mappingUpdated}`);
  
  // Step 3: Test platform functionality
  const testResults = testPlatformFunctionality();
  
  if (testResults.success && testResults.oldFormatIds.length === 0 && testResults.categoryIssues.length === 0) {
    console.log('\n✅ Platform functionality test PASSED');
    console.log('\n💡 Next steps:');
    console.log('  1. Test website build');
    console.log('  2. Test product pages load correctly');
    console.log('  3. Verify cart functionality');
    console.log('  4. Test admin dashboards');
    console.log('  5. If all tests pass, keep migration');
    console.log('  6. If issues found, restore backup');
    
    console.log('\n🔄 To restore backup if needed:');
    console.log('   node scripts/migrate-to-new-id-system.js --restore');
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
