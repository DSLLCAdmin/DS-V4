const fs = require('fs');

console.log('🔧 Fixing categories to match spreadsheet distribution...\n');

// Read the products file
const productsPath = 'data/products.ts';
let content = fs.readFileSync(productsPath, 'utf8');

// Remove category header entries (single letter IDs)
content = content.replace(/\s*{\s*"id": "[A-J]",[\s\S]*?},\s*/g, '');

// Fix the array structure
content = content.replace(/,\s*,\s*/g, ',');

console.log('✅ Removed category header entries');

// Now let's count and fix the distribution
const products = [];
const lines = content.split('\n');

let inProduct = false;
let currentProduct = '';
let braceCount = 0;

lines.forEach(line => {
  if (line.includes('"id":')) {
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

console.log(`📋 Found ${products.length} products after cleanup`);

// Category limits from your spreadsheet
const categoryLimits = {
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
};

// Count current categories
const categoryCounts = {};
products.forEach(product => {
  const typeMatch = product.match(/"Type": "([^"]*)"/);
  if (typeMatch) {
    const category = typeMatch[1];
    categoryCounts[category] = (categoryCounts[category] || 0) + 1;
  }
});

console.log('\n📊 Current distribution:');
Object.entries(categoryCounts).forEach(([category, count]) => {
  const limit = categoryLimits[category] || 0;
  console.log(`  ${category}: ${count} products (limit: ${limit})`);
});

// Create new products array with correct limits
const newProducts = [];
const newCategoryCounts = {};

products.forEach(product => {
  const typeMatch = product.match(/"Type": "([^"]*)"/);
  if (typeMatch) {
    const category = typeMatch[1];
    const currentCount = newCategoryCounts[category] || 0;
    const limit = categoryLimits[category] || 0;
    
    if (currentCount < limit) {
      newProducts.push(product);
      newCategoryCounts[category] = currentCount + 1;
    }
  }
});

// Generate new file
const newContent = `// Clean products file - Fixed category distribution to match spreadsheet (96 products)
export const products = [
${newProducts.join(',\n')}
];`;

fs.writeFileSync(productsPath, newContent, 'utf8');

console.log('\n🎉 Fixed category distribution!');
console.log('📊 Final distribution:');
Object.entries(newCategoryCounts).forEach(([category, count]) => {
  console.log(`  ${category}: ${count} products`);
});

const totalProducts = Object.values(newCategoryCounts).reduce((sum, count) => sum + count, 0);
console.log(`\n📈 Total products: ${totalProducts} (should be 96)`);

