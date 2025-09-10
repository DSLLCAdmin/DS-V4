const fs = require('fs');

console.log('🔧 Starting safe script: Fix categories to match Bible EXACTLY...');

// Set timeout to prevent hanging
const timeout = setTimeout(() => {
  console.log('❌ Script timed out after 30 seconds - stopping');
  process.exit(1);
}, 30000);

try {
  console.log('📋 Step 1: Reading products file...');

// Your Bible - Catalog column (the target counts)
const bibleTargets = {
  'Serials/Books': 9,                    // Category 0
  'Apparel & Intimate Wear': 10,         // Category A  
  'Auto + Mobility': 10,                 // Category B
  'Accessories': 10,                     // Category C
  'Home, Mood, and Atmosphere': 14,      // Category D
  'Media + Experiences': 10,             // Category E
  'Digital + Curated Services': 7,       // Category F
  'Culinary & Novelty': 5,               // Category G
  'Collector & Art-Based': 7,            // Category H
  'Live & Social Activation': 6,         // Category I
  'Relationship, Erotic & Mystery-Inspired': 8  // Category J
};

  // Read current products
  const productsPath = 'data/products.ts';
  let content = fs.readFileSync(productsPath, 'utf8');
  console.log('✅ Step 1 complete: File read successfully');

  console.log('📋 Step 2: Parsing products...');

// Parse all products
const products = [];
const lines = content.split('\n');
let inProduct = false;
let currentProduct = '';
let braceCount = 0;

lines.forEach(line => {
  if (line.includes('"id":') && !line.includes('"id": ""')) {
    if (currentProduct) {
      products.push(currentProduct);
    }
    currentProduct = line;
    inProduct = true;
    braceCount = 0;
  } else if (inProduct) {
    currentProduct += '\n' + line;
    if (line.includes('{')) braceCount++;
    if (line.includes('}')) braceCount--;
    if (braceCount === 0) {
      inProduct = false;
    }
  }
});

if (currentProduct) {
  products.push(currentProduct);
}

  console.log(`✅ Step 2 complete: Found ${products.length} total products`);

  console.log('📋 Step 3: Mapping products to categories...');

// Create new distribution matching Bible exactly
const newProducts = [];
const categoryCounts = {};

// Initialize counts
Object.keys(bibleTargets).forEach(category => {
  categoryCounts[category] = 0;
});

// Map products to categories based on ID patterns
const idToCategory = {
  // Serials/Books (9 products) - Category 0
  '1a': 'Serials/Books',
  '1b': 'Serials/Books', 
  '2a': 'Serials/Books',
  '2b': 'Serials/Books',
  '3a': 'Serials/Books',
  '3b': 'Serials/Books',
  '11a': 'Serials/Books',
  '11b': 'Serials/Books',
  '12a': 'Serials/Books',
  '12b': 'Serials/Books',
  
  // Apparel & Intimate Wear (10 products) - Category A
  'A1': 'Apparel & Intimate Wear',
  'A2': 'Apparel & Intimate Wear',
  'A3': 'Apparel & Intimate Wear',
  'A4': 'Apparel & Intimate Wear',
  'A5': 'Apparel & Intimate Wear',
  'A6': 'Apparel & Intimate Wear',
  'A7': 'Apparel & Intimate Wear',
  'A8': 'Apparel & Intimate Wear',
  'A9': 'Apparel & Intimate Wear',
  'A10': 'Apparel & Intimate Wear',
  
  // Auto + Mobility (10 products) - Category B
  'B1': 'Auto + Mobility',
  'B2': 'Auto + Mobility',
  'B3': 'Auto + Mobility',
  'B4': 'Auto + Mobility',
  'B5': 'Auto + Mobility',
  'B6': 'Auto + Mobility',
  'B7': 'Auto + Mobility',
  'B8': 'Auto + Mobility',
  'B9': 'Auto + Mobility',
  'B10': 'Auto + Mobility',
  
  // Accessories (10 products) - Category C
  'C1': 'Accessories',
  'C2': 'Accessories',
  'C3': 'Accessories',
  'C4': 'Accessories',
  'C5': 'Accessories',
  'C6': 'Accessories',
  'C7': 'Accessories',
  'C8': 'Accessories',
  'C9': 'Accessories',
  'C10': 'Accessories',
  
  // Home, Mood, and Atmosphere (14 products) - Category D
  'D1': 'Home, Mood, and Atmosphere',
  'D2': 'Home, Mood, and Atmosphere',
  'D3': 'Home, Mood, and Atmosphere',
  'D4': 'Home, Mood, and Atmosphere',
  'D5': 'Home, Mood, and Atmosphere',
  'D6': 'Home, Mood, and Atmosphere',
  'D7': 'Home, Mood, and Atmosphere',
  'D8': 'Home, Mood, and Atmosphere',
  'D9': 'Home, Mood, and Atmosphere',
  'D10': 'Home, Mood, and Atmosphere',
  'D11': 'Home, Mood, and Atmosphere',
  'D12': 'Home, Mood, and Atmosphere',
  'D13': 'Home, Mood, and Atmosphere',
  'D14': 'Home, Mood, and Atmosphere',
  
  // Media + Experiences (10 products) - Category E
  'E1': 'Media + Experiences',
  'E2': 'Media + Experiences',
  'E3': 'Media + Experiences',
  'E4': 'Media + Experiences',
  'E5': 'Media + Experiences',
  'E6': 'Media + Experiences',
  'E7': 'Media + Experiences',
  'E8': 'Media + Experiences',
  'E9': 'Media + Experiences',
  'E10': 'Media + Experiences',
  
  // Digital + Curated Services (7 products) - Category F
  'F1': 'Digital + Curated Services',
  'F2': 'Digital + Curated Services',
  'F3': 'Digital + Curated Services',
  'F4': 'Digital + Curated Services',
  'F5': 'Digital + Curated Services',
  'F6': 'Digital + Curated Services',
  'F7': 'Digital + Curated Services',
  
  // Culinary & Novelty (5 products) - Category G
  'G1': 'Culinary & Novelty',
  'G2': 'Culinary & Novelty',
  'G3': 'Culinary & Novelty',
  'G4': 'Culinary & Novelty',
  'G5': 'Culinary & Novelty',
  
  // Collector & Art-Based (7 products) - Category H
  'H1': 'Collector & Art-Based',
  'H2': 'Collector & Art-Based',
  'H3': 'Collector & Art-Based',
  'H4': 'Collector & Art-Based',
  'H5': 'Collector & Art-Based',
  'H6': 'Collector & Art-Based',
  'H7': 'Collector & Art-Based',
  
  // Live & Social Activation (6 products) - Category I
  'I1': 'Live & Social Activation',
  'I2': 'Live & Social Activation',
  'I3': 'Live & Social Activation',
  'I4': 'Live & Social Activation',
  'I5': 'Live & Social Activation',
  'I6': 'Live & Social Activation',
  
  // Relationship, Erotic & Mystery-Inspired (8 products) - Category J
  'J1': 'Relationship, Erotic & Mystery-Inspired',
  'J2': 'Relationship, Erotic & Mystery-Inspired',
  'J3': 'Relationship, Erotic & Mystery-Inspired',
  'J4': 'Relationship, Erotic & Mystery-Inspired',
  'J5': 'Relationship, Erotic & Mystery-Inspired',
  'J6': 'Relationship, Erotic & Mystery-Inspired',
  'J7': 'Relationship, Erotic & Mystery-Inspired',
  'J8': 'Relationship, Erotic & Mystery-Inspired'
};

// Process each product
products.forEach(product => {
  const idMatch = product.match(/"id": "([^"]*)"/);
  if (idMatch) {
    const id = idMatch[1];
    const targetCategory = idToCategory[id];
    
    if (targetCategory && categoryCounts[targetCategory] < bibleTargets[targetCategory]) {
      // Update the product's Type field
      const updatedProduct = product.replace(/"Type": "[^"]*"/, `"Type": "${targetCategory}"`);
      newProducts.push(updatedProduct);
      categoryCounts[targetCategory]++;
      console.log(`✅ ${id} → ${targetCategory} (${categoryCounts[targetCategory]}/${bibleTargets[targetCategory]})`);
    } else if (targetCategory) {
      console.log(`⚠️  Skipping ${id} - ${targetCategory} is full (${categoryCounts[targetCategory]}/${bibleTargets[targetCategory]})`);
    } else {
      console.log(`❌ No category mapping for ${id}`);
    }
  }
});

  console.log('✅ Step 3 complete: Products mapped to categories');

  console.log('📋 Step 4: Generating new file...');
  
  // Generate new file
  const newContent = `// Clean products file - Fixed to match Bible EXACTLY (96 products)
export const products = [
${newProducts.join(',\n')}
];`;

  fs.writeFileSync(productsPath, newContent, 'utf8');
  console.log('✅ Step 4 complete: New file written successfully');

console.log('\n🎉 Fixed to match Bible EXACTLY!');
console.log('📊 Final distribution:');
Object.entries(categoryCounts).forEach(([category, count]) => {
  const target = bibleTargets[category];
  const status = count === target ? '✅' : '❌';
  console.log(`  ${status} ${category}: ${count}/${target} products`);
});

  const totalProducts = Object.values(categoryCounts).reduce((sum, count) => sum + count, 0);
  const totalTarget = Object.values(bibleTargets).reduce((sum, count) => sum + count, 0);
  console.log(`\n📈 Total products: ${totalProducts}/${totalTarget} (should be 96)`);

  // Clear timeout on successful completion
  clearTimeout(timeout);
  console.log('\n✅ Script completed successfully!');

} catch (error) {
  console.error('❌ Script failed:', error.message);
  clearTimeout(timeout);
  process.exit(1);
}
