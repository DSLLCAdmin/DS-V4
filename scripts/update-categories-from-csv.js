const fs = require('fs');
const path = require('path');

console.log('🔄 Updating product categories from CSV reference...\n');

// Read the CSV file
const csvPath = path.join(__dirname, '..', 'products.csv');
const csvContent = fs.readFileSync(csvPath, 'utf8');
const lines = csvContent.split('\n');

// Create mapping from CSV
const categoryMap = {};
lines.forEach(line => {
  if (line.trim() && !line.startsWith('0,')) { // Skip header and category headers
    const parts = line.split(',');
    if (parts.length >= 2) {
      const id = parts[0].trim();
      const category = parts[1].trim();
      if (id && category && !category.includes('/') && !category.includes('&')) {
        // This is a product, not a category header
        categoryMap[id] = category;
      }
    }
  }
});

console.log(`📋 Found ${Object.keys(categoryMap).length} products in CSV`);

// Read the current products.ts file
const productsPath = path.join(__dirname, '..', 'data', 'products.ts');
let productsContent = fs.readFileSync(productsPath, 'utf8');

// Update categories based on CSV mapping
let updateCount = 0;
Object.entries(categoryMap).forEach(([id, correctCategory]) => {
  // Find the product in the TypeScript file
  const productRegex = new RegExp(`"id": "${id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"[\\s\\S]*?"Type": "[^"]*"`, 'g');
  const match = productsContent.match(productRegex);
  
  if (match) {
    // Extract the current Type value
    const currentTypeMatch = match[0].match(/"Type": "([^"]*)"/);
    if (currentTypeMatch) {
      const currentType = currentTypeMatch[1];
      if (currentType !== correctCategory) {
        // Update the Type field
        const newType = `"Type": "${correctCategory}"`;
        const oldType = `"Type": "${currentType}"`;
        productsContent = productsContent.replace(oldType, newType);
        console.log(`✅ ${id}: "${currentType}" → "${correctCategory}"`);
        updateCount++;
      }
    }
  } else {
    console.log(`⚠️  Product ${id} not found in products.ts`);
  }
});

// Write the updated file
fs.writeFileSync(productsPath, productsContent, 'utf8');

console.log(`\n🎉 Updated ${updateCount} product categories!`);
console.log('📁 File updated: data/products.ts');

// Show summary of categories
const categoryCounts = {};
Object.values(categoryMap).forEach(category => {
  categoryCounts[category] = (categoryCounts[category] || 0) + 1;
});

console.log('\n📊 Category distribution:');
Object.entries(categoryCounts).forEach(([category, count]) => {
  console.log(`  ${category}: ${count} products`);
});
