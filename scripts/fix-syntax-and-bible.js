const fs = require('fs');

console.log('🔧 Starting BULLETPROOF Bible Alignment...');

// Set timeout to prevent hanging
const timeout = setTimeout(() => {
  console.log('❌ Script timed out after 30 seconds - stopping');
  process.exit(1);
}, 30000);

try {
  console.log('📋 Step 1: Reading current products...');
  
  const productsPath = 'data/products.ts';
  let content = fs.readFileSync(productsPath, 'utf8');
  console.log('✅ Step 1 complete: File read successfully');

  console.log('📋 Step 2: Parsing products with bulletproof method...');
  
  // Extract products using regex - more reliable
  const productMatches = content.match(/\{[^}]*"id":\s*"[^"]*"[^}]*\}/g);
  
  if (!productMatches) {
    throw new Error('No products found in file');
  }
  
  console.log(`✅ Step 2 complete: Found ${productMatches.length} products`);

  console.log('📋 Step 3: Creating perfect Bible alignment...');
  
  // Bible targets (corrected)
  const bibleTargets = {
    'Serials/Books': 8,
    'Apparel & Intimate Wear': 10,
    'Auto + Mobility': 10,
    'Accessories': 10,
    'Home, Mood, and Atmosphere': 14,
    'Media + Experiences': 10,
    'Digital + Curated Services': 7,
    'Culinary & Novelty': 5,
    'Collector & Art-Based': 7,
    'Live & Social Activation': 6,
    'Relationship, Erotic & Mystery-Inspired': 8
  };

  // Running tally
  const runningTally = {};
  Object.keys(bibleTargets).forEach(category => {
    runningTally[category] = 0;
  });

  // Perfect mapping
  const perfectProducts = [];
  
  // Serials/Books (8 products)
  const serialsBooks = ['1a', '1b', '2a', '2b', '3a', '3b', '11a', '11b'];
  serialsBooks.forEach(id => {
    const product = productMatches.find(p => p.includes(`"id": "${id}"`));
    if (product) {
      const updatedProduct = product.replace(/"Type":\s*"[^"]*"/, `"Type": "Serials/Books"`);
      perfectProducts.push(updatedProduct);
      runningTally['Serials/Books']++;
      console.log(`✅ ${id} → Serials/Books (${runningTally['Serials/Books']}/8)`);
    }
  });

  // Apparel & Intimate Wear (10 products)
  const apparel = ['A1', 'A2', 'A3', 'A4', 'A5', 'A6', 'A7', 'A8', 'A9', 'A10'];
  apparel.forEach(id => {
    const product = productMatches.find(p => p.includes(`"id": "${id}"`));
    if (product) {
      const updatedProduct = product.replace(/"Type":\s*"[^"]*"/, `"Type": "Apparel & Intimate Wear"`);
      perfectProducts.push(updatedProduct);
      runningTally['Apparel & Intimate Wear']++;
      console.log(`✅ ${id} → Apparel & Intimate Wear (${runningTally['Apparel & Intimate Wear']}/10)`);
    }
  });

  // Auto + Mobility (10 products)
  const autoMobility = ['B1', 'B2', 'B3', 'B4', 'B5', 'B6', 'B7', 'B8', 'B9', 'B10'];
  autoMobility.forEach(id => {
    const product = productMatches.find(p => p.includes(`"id": "${id}"`));
    if (product) {
      const updatedProduct = product.replace(/"Type":\s*"[^"]*"/, `"Type": "Auto + Mobility"`);
      perfectProducts.push(updatedProduct);
      runningTally['Auto + Mobility']++;
      console.log(`✅ ${id} → Auto + Mobility (${runningTally['Auto + Mobility']}/10)`);
    }
  });

  // Accessories (10 products)
  const accessories = ['C1', 'C2', 'C3', 'C4', 'C5', 'C6', 'C7', 'C8', 'C9', 'C10'];
  accessories.forEach(id => {
    const product = productMatches.find(p => p.includes(`"id": "${id}"`));
    if (product) {
      const updatedProduct = product.replace(/"Type":\s*"[^"]*"/, `"Type": "Accessories"`);
      perfectProducts.push(updatedProduct);
      runningTally['Accessories']++;
      console.log(`✅ ${id} → Accessories (${runningTally['Accessories']}/10)`);
    }
  });

  // Home, Mood, and Atmosphere (14 products)
  const homeMood = ['D1', 'D2', 'D3', 'D4', 'D5', 'D6', 'D7', 'D8', 'D9', 'D10', 'D11', 'D12', 'D13', 'D14'];
  homeMood.forEach(id => {
    const product = productMatches.find(p => p.includes(`"id": "${id}"`));
    if (product) {
      const updatedProduct = product.replace(/"Type":\s*"[^"]*"/, `"Type": "Home, Mood, and Atmosphere"`);
      perfectProducts.push(updatedProduct);
      runningTally['Home, Mood, and Atmosphere']++;
      console.log(`✅ ${id} → Home, Mood, and Atmosphere (${runningTally['Home, Mood, and Atmosphere']}/14)`);
    }
  });

  // Media + Experiences (10 products)
  const mediaExp = ['E1', 'E2', 'E3', 'E4', 'E5', 'E6', 'E7', 'E8', 'E9', 'E10'];
  mediaExp.forEach(id => {
    const product = productMatches.find(p => p.includes(`"id": "${id}"`));
    if (product) {
      const updatedProduct = product.replace(/"Type":\s*"[^"]*"/, `"Type": "Media + Experiences"`);
      perfectProducts.push(updatedProduct);
      runningTally['Media + Experiences']++;
      console.log(`✅ ${id} → Media + Experiences (${runningTally['Media + Experiences']}/10)`);
    }
  });

  // Digital + Curated Services (7 products)
  const digitalServices = ['F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7'];
  digitalServices.forEach(id => {
    const product = productMatches.find(p => p.includes(`"id": "${id}"`));
    if (product) {
      const updatedProduct = product.replace(/"Type":\s*"[^"]*"/, `"Type": "Digital + Curated Services"`);
      perfectProducts.push(updatedProduct);
      runningTally['Digital + Curated Services']++;
      console.log(`✅ ${id} → Digital + Curated Services (${runningTally['Digital + Curated Services']}/7)`);
    }
  });

  // Culinary & Novelty (5 products)
  const culinary = ['G1', 'G2', 'G3', 'G4', 'G5'];
  culinary.forEach(id => {
    const product = productMatches.find(p => p.includes(`"id": "${id}"`));
    if (product) {
      const updatedProduct = product.replace(/"Type":\s*"[^"]*"/, `"Type": "Culinary & Novelty"`);
      perfectProducts.push(updatedProduct);
      runningTally['Culinary & Novelty']++;
      console.log(`✅ ${id} → Culinary & Novelty (${runningTally['Culinary & Novelty']}/5)`);
    }
  });

  // Collector & Art-Based (7 products)
  const collector = ['H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'H7'];
  collector.forEach(id => {
    const product = productMatches.find(p => p.includes(`"id": "${id}"`));
    if (product) {
      const updatedProduct = product.replace(/"Type":\s*"[^"]*"/, `"Type": "Collector & Art-Based"`);
      perfectProducts.push(updatedProduct);
      runningTally['Collector & Art-Based']++;
      console.log(`✅ ${id} → Collector & Art-Based (${runningTally['Collector & Art-Based']}/7)`);
    }
  });

  // Live & Social Activation (6 products)
  const liveSocial = ['I1', 'I2', 'I3', 'I4', 'I5', 'I6'];
  liveSocial.forEach(id => {
    const product = productMatches.find(p => p.includes(`"id": "${id}"`));
    if (product) {
      const updatedProduct = product.replace(/"Type":\s*"[^"]*"/, `"Type": "Live & Social Activation"`);
      perfectProducts.push(updatedProduct);
      runningTally['Live & Social Activation']++;
      console.log(`✅ ${id} → Live & Social Activation (${runningTally['Live & Social Activation']}/6)`);
    }
  });

  // Relationship, Erotic & Mystery-Inspired (8 products)
  const relationship = ['J1', 'J2', 'J3', 'J4', 'J5', 'J6', 'J7', 'J8'];
  relationship.forEach(id => {
    const product = productMatches.find(p => p.includes(`"id": "${id}"`));
    if (product) {
      const updatedProduct = product.replace(/"Type":\s*"[^"]*"/, `"Type": "Relationship, Erotic & Mystery-Inspired"`);
      perfectProducts.push(updatedProduct);
      runningTally['Relationship, Erotic & Mystery-Inspired']++;
      console.log(`✅ ${id} → Relationship, Erotic & Mystery-Inspired (${runningTally['Relationship, Erotic & Mystery-Inspired']}/8)`);
    }
  });

  console.log('✅ Step 3 complete: Perfect alignment created');

  console.log('📋 Step 4: Writing bulletproof file...');
  
  // Generate PERFECT syntax
  const perfectContent = `// Perfect Bible Alignment - EXACTLY 95 products
export const products = [
${perfectProducts.join(',\n')}
];`;

  fs.writeFileSync(productsPath, perfectContent, 'utf8');
  console.log('✅ Step 4 complete: Bulletproof file written');

  console.log('\n🎉 BULLETPROOF BIBLE ALIGNMENT COMPLETE!');
  console.log('📊 Running Tally (Back-Check):');
  Object.entries(runningTally).forEach(([category, count]) => {
    const target = bibleTargets[category];
    const status = count === target ? '✅' : '❌';
    console.log(`  ${status} ${category}: ${count}/${target} products`);
  });

  const totalProducts = Object.values(runningTally).reduce((sum, count) => sum + count, 0);
  const totalTarget = Object.values(bibleTargets).reduce((sum, count) => sum + count, 0);
  console.log(`\n📈 Total products: ${totalProducts}/${totalTarget} (should be exactly 95)`);

  // Clear timeout on successful completion
  clearTimeout(timeout);
  console.log('\n✅ Script completed successfully!');

} catch (error) {
  console.error('❌ Script failed:', error.message);
  clearTimeout(timeout);
  process.exit(1);
}
