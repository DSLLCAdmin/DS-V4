const fs = require('fs');

console.log('🔧 Fixing category names to match expected full names...\n');

// Read the products file
const productsPath = 'data/products.ts';
let content = fs.readFileSync(productsPath, 'utf8');

// Category mapping from abbreviated to full names
const categoryMapping = {
  'Home': 'Home, Mood, and Atmosphere',
  'Relationship': 'Relationship, Erotic & Mystery-Inspired',
  'Media + Experiences': 'Media + Experiences',
  'Serials/Books': 'Serials/Books',
  'Apparel & Intimate Wear': 'Apparel & Intimate Wear',
  'Auto + Mobility': 'Auto + Mobility',
  'Accessories': 'Accessories',
  'Collector & Art-Based': 'Collector & Art-Based',
  'Digital + Curated Services': 'Digital + Curated Services',
  'Culinary & Novelty': 'Culinary & Novelty'
};

let fixCount = 0;

// Apply category mappings
Object.entries(categoryMapping).forEach(([oldCategory, newCategory]) => {
  const oldPattern = `"Type": "${oldCategory}"`;
  const newPattern = `"Type": "${newCategory}"`;
  
  if (content.includes(oldPattern)) {
    const matches = (content.match(new RegExp(oldPattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length;
    content = content.replace(new RegExp(oldPattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), newPattern);
    console.log(`✅ ${oldCategory} → ${newCategory} (${matches} products)`);
    fixCount += matches;
  }
});

// Write the updated file
fs.writeFileSync(productsPath, content, 'utf8');

console.log(`\n🎉 Updated ${fixCount} product categories!`);
console.log('📁 File updated: data/products.ts');

// Show final category distribution
const categoryCounts = {};
const typeMatches = content.match(/"Type": "([^"]*)"/g);
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
