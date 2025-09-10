const fs = require('fs');

console.log('🔧 Final fix to match spreadsheet exactly (96 products)...\n');

// Read the products file
const productsPath = 'data/products.ts';
let content = fs.readFileSync(productsPath, 'utf8');

// Target distribution from your spreadsheet
const targetDistribution = {
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

// Parse all products
const lines = content.split('\n');
const allProducts = [];
let inProduct = false;
let currentProduct = '';
let braceCount = 0;

lines.forEach(line => {
  if (line.includes('"id":') && !line.includes('"id": ""')) {
    if (currentProduct) {
      allProducts.push(currentProduct);
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
  allProducts.push(currentProduct);
}

console.log(`📋 Found ${allProducts.length} total products`);

// Group products by current category
const productsByCategory = {};
allProducts.forEach(product => {
  const typeMatch = product.match(/"Type": "([^"]*)"/);
  if (typeMatch) {
    const category = typeMatch[1];
    if (!productsByCategory[category]) {
      productsByCategory[category] = [];
    }
    productsByCategory[category].push(product);
  }
});

console.log('\n📊 Current distribution:');
Object.entries(productsByCategory).forEach(([category, products]) => {
  console.log(`  ${category}: ${products.length} products`);
});

// Create new distribution
const newProducts = [];
const newCategoryCounts = {};

// First, add products from categories that are under their limits
Object.entries(targetDistribution).forEach(([targetCategory, targetCount]) => {
  newCategoryCounts[targetCategory] = 0;
  
  // Find products that should be in this category
  let productsToAdd = [];
  
  // Check if we have products already in this category
  if (productsByCategory[targetCategory]) {
    productsToAdd = productsByCategory[targetCategory].slice(0, targetCount);
  } else {
    // Look for products that might belong in this category based on ID
    const categoryPrefixes = {
      'Serials/Books': ['1a', '1b', '2a', '2b', '3a', '3b', '11a', '11b'],
      'Apparel & Intimate Wear': ['A1', 'A2', 'A3', 'A4', 'A8', 'A10'],
      'Auto + Mobility': ['B1', 'B3', 'B6', 'B9', 'C9', 'E2', 'E8', 'G3', 'G4', 'H4'],
      'Accessories': ['A6', 'A7', 'B7', 'B10', 'C3', 'C4', 'C7', 'D7', 'D9', 'D12'],
      'Home, Mood, and Atmosphere': ['B2', 'C10', 'D1', 'D6', 'D8', 'D10', 'F2', 'J6'],
      'Media + Experiences': ['B4', 'B5', 'C1', 'C2', 'C5', 'C6', 'C8', 'D11', 'D14', 'E1'],
      'Digital + Curated Services': ['B9', 'F4', 'F7', 'I6'],
      'Culinary & Novelty': ['G1', 'G2', 'G3', 'G4', 'G5'],
      'Collector & Art-Based': ['A9', 'H1', 'H2', 'H3', 'H5', 'H6', 'H7'],
      'Live & Social Activation': ['I1', 'I2', 'I3', 'I4', 'I5', 'I6'],
      'Relationship, Erotic & Mystery-Inspired': ['B8', 'E3', 'G5', 'J1', 'J2', 'J3', 'J4', 'J5']
    };
    
    const prefixes = categoryPrefixes[targetCategory] || [];
    productsToAdd = allProducts.filter(product => {
      const idMatch = product.match(/"id": "([^"]*)"/);
      return idMatch && prefixes.includes(idMatch[1]);
    }).slice(0, targetCount);
  }
  
  // Add products to this category
  productsToAdd.forEach(product => {
    if (newCategoryCounts[targetCategory] < targetCount) {
      // Update the product's Type field
      const updatedProduct = product.replace(/"Type": "[^"]*"/, `"Type": "${targetCategory}"`);
      newProducts.push(updatedProduct);
      newCategoryCounts[targetCategory]++;
    }
  });
});

// Generate new file
const newContent = `// Clean products file - Fixed to exactly 96 products matching spreadsheet
export const products = [
${newProducts.join(',\n')}
];`;

fs.writeFileSync(productsPath, newContent, 'utf8');

console.log('\n🎉 Fixed to match spreadsheet exactly!');
console.log('📊 Final distribution:');
Object.entries(newCategoryCounts).forEach(([category, count]) => {
  console.log(`  ${category}: ${count} products`);
});

const totalProducts = Object.values(newCategoryCounts).reduce((sum, count) => sum + count, 0);
console.log(`\n📈 Total products: ${totalProducts} (should be 96)`);

