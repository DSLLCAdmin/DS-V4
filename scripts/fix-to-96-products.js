const fs = require('fs');

console.log('🔧 Fixing to exactly 96 products matching spreadsheet...\n');

// Read the products file
const productsPath = 'data/products.ts';
let content = fs.readFileSync(productsPath, 'utf8');

// Remove only the category header entries (single letter IDs like "A", "B", "C", etc.)
// These are the entries that have single letter IDs and empty titles
content = content.replace(/\s*{\s*"id": "[A-J]",[\s\S]*?"Title": "",[\s\S]*?},\s*/g, '');

// Clean up any double commas
content = content.replace(/,\s*,/g, ',');

console.log('✅ Removed category header entries');

// Count products
const productMatches = content.match(/"id": "[^"]*"/g);
const productCount = productMatches ? productMatches.length : 0;

console.log(`📋 Found ${productCount} products after cleanup`);

// If we have more than 96, we need to trim some categories
if (productCount > 96) {
  console.log('⚠️  Need to trim products to reach exactly 96');
  
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
  
  // Parse products and limit each category
  const lines = content.split('\n');
  const newProducts = [];
  const categoryCounts = {};
  
  let inProduct = false;
  let currentProduct = '';
  let braceCount = 0;
  
  lines.forEach(line => {
    if (line.includes('"id":') && !line.includes('"id": ""')) {
      if (currentProduct) {
        // Process the previous product
        const typeMatch = currentProduct.match(/"Type": "([^"]*)"/);
        if (typeMatch) {
          const category = typeMatch[1];
          const currentCount = categoryCounts[category] || 0;
          const limit = categoryLimits[category] || 0;
          
          if (currentCount < limit) {
            newProducts.push(currentProduct);
            categoryCounts[category] = currentCount + 1;
          }
        }
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
  
  // Process the last product
  if (currentProduct) {
    const typeMatch = currentProduct.match(/"Type": "([^"]*)"/);
    if (typeMatch) {
      const category = typeMatch[1];
      const currentCount = categoryCounts[category] || 0;
      const limit = categoryLimits[category] || 0;
      
      if (currentCount < limit) {
        newProducts.push(currentProduct);
        categoryCounts[category] = currentCount + 1;
      }
    }
  }
  
  // Generate new file
  const newContent = `// Clean products file - Fixed to exactly 96 products matching spreadsheet
export const products = [
${newProducts.join(',\n')}
];`;
  
  fs.writeFileSync(productsPath, newContent, 'utf8');
  
  console.log('\n🎉 Fixed to exactly 96 products!');
  console.log('📊 Final distribution:');
  Object.entries(categoryCounts).forEach(([category, count]) => {
    console.log(`  ${category}: ${count} products`);
  });
  
  const totalProducts = Object.values(categoryCounts).reduce((sum, count) => sum + count, 0);
  console.log(`\n📈 Total products: ${totalProducts} (should be 96)`);
} else {
  console.log('✅ Already at correct product count');
}

