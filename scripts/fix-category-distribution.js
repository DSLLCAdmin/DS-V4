const fs = require('fs');

console.log('🔧 Fixing category distribution to match spreadsheet (96 total products)...\n');

// Read the products file
const productsPath = 'data/products.ts';
let content = fs.readFileSync(productsPath, 'utf8');

// Parse the products array
const productsMatch = content.match(/export const products = \[([\s\S]*)\];/);
if (!productsMatch) {
  console.error('❌ Could not find products array');
  process.exit(1);
}

// Extract individual product objects
const productsText = productsMatch[1];
const productObjects = [];
let currentProduct = '';
let braceCount = 0;
let inString = false;
let escapeNext = false;

for (let i = 0; i < productsText.length; i++) {
  const char = productsText[i];
  
  if (escapeNext) {
    escapeNext = false;
    currentProduct += char;
    continue;
  }
  
  if (char === '\\') {
    escapeNext = true;
    currentProduct += char;
    continue;
  }
  
  if (char === '"' && !escapeNext) {
    inString = !inString;
  }
  
  if (!inString) {
    if (char === '{') {
      braceCount++;
    } else if (char === '}') {
      braceCount--;
      if (braceCount === 0) {
        // End of product object
        productObjects.push(currentProduct.trim());
        currentProduct = '';
        continue;
      }
    }
  }
  
  if (braceCount > 0) {
    currentProduct += char;
  }
}

console.log(`📋 Found ${productObjects.length} product objects`);

// Map categories to match your spreadsheet
const categoryMapping = {
  '0': 'Serials/Books',           // 9 products
  'A': 'Apparel & Intimate Wear', // 10 products
  'B': 'Auto + Mobility',         // 10 products
  'C': 'Accessories',             // 10 products
  'D': 'Home, Mood, and Atmosphere', // 14 products
  'E': 'Media + Experiences',     // 10 products
  'F': 'Digital + Curated Services', // 7 products
  'G': 'Culinary & Novelty',      // 5 products
  'H': 'Collector & Art-Based',   // 7 products
  'I': 'Live & Social Activation', // 6 products
  'J': 'Relationship, Erotic & Mystery-Inspired' // 8 products
};

// Create new products array with correct distribution
const newProducts = [];
const categoryCounts = {};

// Process each product and assign to correct category
productObjects.forEach((productText, index) => {
  // Extract ID from product
  const idMatch = productText.match(/"id": "([^"]*)"/);
  if (!idMatch) return;
  
  const id = idMatch[1];
  
  // Determine category based on ID prefix
  let categoryKey = '0'; // Default to Serials/Books
  if (id.match(/^[A-J]$/)) {
    categoryKey = id;
  } else if (id.match(/^[A-J]\d/)) {
    categoryKey = id[0];
  } else if (id.match(/^\d/)) {
    categoryKey = '0'; // Numbers go to Serials/Books
  }
  
  const targetCategory = categoryMapping[categoryKey];
  const currentCount = categoryCounts[targetCategory] || 0;
  const maxCount = {
    'Serials/Books': 9,
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
  }[targetCategory];
  
  if (currentCount < maxCount) {
    // Update the product's Type field
    const updatedProduct = productText.replace(/"Type": "[^"]*"/, `"Type": "${targetCategory}"`);
    newProducts.push(updatedProduct);
    categoryCounts[targetCategory] = (categoryCounts[targetCategory] || 0) + 1;
    console.log(`✅ ${id} → ${targetCategory} (${categoryCounts[targetCategory]}/${maxCount})`);
  } else {
    console.log(`⚠️  Skipping ${id} - ${targetCategory} is full (${currentCount}/${maxCount})`);
  }
});

// Generate new products.ts file
const newContent = `// Clean products file - Fixed category distribution to match spreadsheet (96 products)
export const products = [
${newProducts.map(product => `  {${product}}`).join(',\n')}
];`;

// Write the new file
fs.writeFileSync(productsPath, newContent, 'utf8');

console.log(`\n🎉 Fixed category distribution!`);
console.log(`📊 Final counts:`);
Object.entries(categoryCounts).forEach(([category, count]) => {
  console.log(`  ${category}: ${count} products`);
});

const totalProducts = Object.values(categoryCounts).reduce((sum, count) => sum + count, 0);
console.log(`\n📈 Total products: ${totalProducts} (should be 96)`);
