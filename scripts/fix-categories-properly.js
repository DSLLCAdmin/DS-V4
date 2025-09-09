const fs = require('fs');
const path = require('path');

console.log('🔄 Fixing product categories with proper mapping...\n');

// Read the CSV file
const csvPath = path.join(__dirname, '..', 'products.csv');
const csvContent = fs.readFileSync(csvPath, 'utf8');
const lines = csvContent.split('\n');

// Create proper category mapping
const categoryMapping = {
  'Serials/Books': 'Serials/Books',
  'Apparel & Intimate Wear': 'Apparel & Intimate Wear',
  'Auto + Mobility': 'Auto + Mobility',
  'Accessories': 'Accessories',
  'Home, Mood, and Atmosphere': 'Home, Mood, and Atmosphere',
  'Media + Experiences': 'Media + Experiences',
  'Digital + Curated Services': 'Digital + Curated Services',
  'Culinary & Novelty': 'Culinary & Novelty',
  'Collector & Art-Based': 'Collector & Art-Based',
  'Live & Social Activation': 'Live & Social Activation',
  'Relationship, Erotic & Mystery-Inspired': 'Relationship, Erotic & Mystery-Inspired'
};

// Create mapping from CSV
const productCategories = {};
lines.forEach(line => {
  if (line.trim() && !line.startsWith('0,')) {
    const parts = line.split(',');
    if (parts.length >= 2) {
      const id = parts[0].trim();
      const category = parts[1].trim();
      
      // Only process actual products (not category headers)
      if (id && category && !category.includes('/') && !category.includes('&') && 
          !id.match(/^[A-Z]$/) && // Not single letter category headers
          id !== '0') {
        
        // Map abbreviated categories to full names
        let fullCategory = categoryMapping[category] || category;
        productCategories[id] = fullCategory;
      }
    }
  }
});

console.log(`📋 Found ${Object.keys(productCategories).length} products to update`);

// Read the current products.ts file
const productsPath = path.join(__dirname, '..', 'data', 'products.ts');
let productsContent = fs.readFileSync(productsPath, 'utf8');

// Update categories based on CSV mapping
let updateCount = 0;
Object.entries(productCategories).forEach(([id, correctCategory]) => {
  // Find the product in the TypeScript file using a more specific pattern
  const productPattern = new RegExp(`"id": "${id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"[\\s\\S]*?"Type": "[^"]*"`, 'g');
  const matches = productsContent.match(productPattern);
  
  if (matches && matches.length > 0) {
    const match = matches[0];
    const currentTypeMatch = match.match(/"Type": "([^"]*)"/);
    if (currentTypeMatch) {
      const currentType = currentTypeMatch[1];
      if (currentType !== correctCategory) {
        // Update the Type field
        const oldTypePattern = new RegExp(`"id": "${id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"[\\s\\S]*?"Type": "${currentType.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"`, 'g');
        const newMatch = productsContent.match(oldTypePattern);
        if (newMatch) {
          const replacement = newMatch[0].replace(`"Type": "${currentType}"`, `"Type": "${correctCategory}"`);
          productsContent = productsContent.replace(oldTypePattern, replacement);
          console.log(`✅ ${id}: "${currentType}" → "${correctCategory}"`);
          updateCount++;
        }
      } else {
        console.log(`✓ ${id}: Already correct (${correctCategory})`);
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
Object.values(productCategories).forEach(category => {
  categoryCounts[category] = (categoryCounts[category] || 0) + 1;
});

console.log('\n📊 Final category distribution:');
Object.entries(categoryCounts).forEach(([category, count]) => {
  console.log(`  ${category}: ${count} products`);
});
