const fs = require('fs');
const path = require('path');

console.log('🔄 Fixing category names to match expected format...\n');

// Read the current products.ts file
const productsPath = path.join(__dirname, '..', 'data', 'products.ts');
let productsContent = fs.readFileSync(productsPath, 'utf8');

// Category mapping from CSV abbreviations to full names
const categoryMapping = {
  'First & Light- E-book': 'Serials/Books',
  'First & Light- Paperback': 'Serials/Books',
  'Risque & Safety- E-book': 'Serials/Books',
  'Risque & Safety- Paperback': 'Serials/Books',
  'Mercury & Memory- E-book': 'Serials/Books',
  'Mercury & Memory- Paperback': 'Serials/Books',
  'Vol-1 - E-book': 'Serials/Books',
  'Vol-1 - Paperback': 'Serials/Books',
  'Apparel & Intimate Wear': 'Apparel & Intimate Wear',
  'Auto + Mobility': 'Auto + Mobility',
  'Accessories': 'Accessories',
  'Collector & Art-Based': 'Collector & Art-Based',
  'Home': 'Home, Mood, and Atmosphere',
  'Media + Experiences': 'Media + Experiences',
  'Relationship': 'Relationship, Erotic & Mystery-Inspired',
  'Digital + Curated Services': 'Digital + Curated Services',
  'Culinary & Novelty': 'Culinary & Novelty'
};

let updateCount = 0;

// Apply category mappings
Object.entries(categoryMapping).forEach(([oldCategory, newCategory]) => {
  const oldPattern = `"Type": "${oldCategory}"`;
  const newPattern = `"Type": "${newCategory}"`;
  
  if (productsContent.includes(oldPattern)) {
    productsContent = productsContent.replace(new RegExp(oldPattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), newPattern);
    const matches = (productsContent.match(new RegExp(oldPattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length;
    console.log(`✅ ${oldCategory} → ${newCategory} (${matches} products)`);
    updateCount += matches;
  }
});

// Write the updated file
fs.writeFileSync(productsPath, productsContent, 'utf8');

console.log(`\n🎉 Updated ${updateCount} product categories!`);
console.log('📁 File updated: data/products.ts');

// Show final category distribution
const categoryCounts = {};
const typeMatches = productsContent.match(/"Type": "([^"]*)"/g);
if (typeMatches) {
  typeMatches.forEach(match => {
    const category = match.match(/"Type": "([^"]*)"/)[1];
    categoryCounts[category] = (categoryCounts[category] || 0) + 1;
  });
}

console.log('\n📊 Final category distribution:');
Object.entries(categoryCounts).forEach(([category, count]) => {
  console.log(`  ${category}: ${count} products`);
});
