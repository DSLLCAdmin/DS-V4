const fs = require('fs');

console.log('🔧 Adding Live & Social Activation products...\n');

// Read the products file
const productsPath = 'data/products.ts';
let content = fs.readFileSync(productsPath, 'utf8');

// Products that should be in Live & Social Activation based on the CSV
const liveSocialProducts = [
  'I1', // Backseat Theater Box
  'I2', // 'Memory & Mercury' Scavenger Hunt  
  'I3', // Pop-Up Confession Booths
  'I4', // Streetlight Salons
  'I5', // Backseat Photo Booth Pop-Ups
  'I6'  // Custom Drive-In Screenings
];

let fixCount = 0;

// Update these products to Live & Social Activation
liveSocialProducts.forEach(productId => {
  const pattern = new RegExp(`"id": "${productId}"[\\s\\S]*?"Type": "[^"]*"`, 'g');
  const match = content.match(pattern);
  
  if (match) {
    const currentTypeMatch = match[0].match(/"Type": "([^"]*)"/);
    if (currentTypeMatch) {
      const currentType = currentTypeMatch[1];
      const newType = `"Type": "Live & Social Activation"`;
      const oldType = `"Type": "${currentType}"`;
      
      content = content.replace(oldType, newType);
      console.log(`✅ ${productId}: ${currentType} → Live & Social Activation`);
      fixCount++;
    }
  }
});

// Write the updated file
fs.writeFileSync(productsPath, content, 'utf8');

console.log(`\n🎉 Updated ${fixCount} products to Live & Social Activation!`);
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
