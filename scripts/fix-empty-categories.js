const fs = require('fs');
const path = require('path');

// Read the products file
const productsPath = path.join(__dirname, '..', 'data', 'products.ts');
let productsContent = fs.readFileSync(productsPath, 'utf8');

console.log('🔧 Fixing empty categories...\n');

// Assign products to empty categories
const categoryAssignments = [
  // Serials/Books - assign book products
  { id: '1a', category: 'Serials/Books' },
  { id: '1b', category: 'Serials/Books' },
  { id: '2a', category: 'Serials/Books' },
  { id: '2b', category: 'Serials/Books' },
  { id: '3a', category: 'Serials/Books' },
  { id: '3b', category: 'Serials/Books' },
  { id: '11a', category: 'Serials/Books' },
  { id: '11b', category: 'Serials/Books' },
  
  // Live & Social Activation - assign social/community products
  { id: 'A1', category: 'Live & Social Activation' }, // Dark Streeter Panties
  { id: 'A2', category: 'Live & Social Activation' }, // Mesh Bodysuits
  { id: 'A3', category: 'Live & Social Activation' }, // Asphalt Black Denim Jackets
];

let updatedContent = productsContent;
let fixCount = 0;

categoryAssignments.forEach(assignment => {
  const pattern = new RegExp(`"id": "${assignment.id}"[\\s\\S]*?"Type": "[^"]*"`, 'g');
  const replacement = `"id": "${assignment.id}"$&`.replace('$&', '').replace(/[^}]*$/, `"Type": "${assignment.category}"`);
  
  // Find the product and update its Type
  const productPattern = new RegExp(`("id": "${assignment.id}"[\\s\\S]*?"Type": ")[^"]*(")`, 'g');
  if (productPattern.test(updatedContent)) {
    updatedContent = updatedContent.replace(productPattern, `$1${assignment.category}$2`);
    console.log(`✅ ${assignment.id} → ${assignment.category}`);
    fixCount++;
  }
});

// Write back to file
fs.writeFileSync(productsPath, updatedContent, 'utf8');

console.log(`\n🎉 Fixed ${fixCount} category assignments!`);
console.log('📁 File updated: data/products.ts');
