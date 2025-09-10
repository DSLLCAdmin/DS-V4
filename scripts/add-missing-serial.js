const fs = require('fs');

console.log('🔧 Adding missing product to Serials/Books...\n');

// Read the products file
const productsPath = 'data/products.ts';
let content = fs.readFileSync(productsPath, 'utf8');

// Find a product that's not being used and assign it to Serials/Books
// Let me look for any product with ID that starts with a number
const lines = content.split('\n');
let foundProduct = null;

for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('"id": "') && !lines[i].includes('"id": "A') && 
      !lines[i].includes('"id": "B") && !lines[i].includes('"id": "C") &&
      !lines[i].includes('"id": "D") && !lines[i].includes('"id": "E") &&
      !lines[i].includes('"id": "F") && !lines[i].includes('"id": "G") &&
      !lines[i].includes('"id": "H") && !lines[i].includes('"id": "I") &&
      !lines[i].includes('"id": "J") && !lines[i].includes('"id": "1a") &&
      !lines[i].includes('"id": "1b") && !lines[i].includes('"id": "2a") &&
      !lines[i].includes('"id": "2b") && !lines[i].includes('"id": "3a") &&
      !lines[i].includes('"id": "3b") && !lines[i].includes('"id": "11a") &&
      !lines[i].includes('"id": "11b")) {
    
    // Found a product that's not in our mapping
    const idMatch = lines[i].match(/"id": "([^"]*)"/);
    if (idMatch) {
      console.log(`Found unused product: ${idMatch[1]}`);
      foundProduct = idMatch[1];
      break;
    }
  }
}

if (foundProduct) {
  // Update this product to be Serials/Books
  content = content.replace(
    new RegExp(`"id": "${foundProduct}"[\\s\\S]*?"Type": "[^"]*"`),
    `"id": "${foundProduct}"$&`.replace(/"Type": "[^"]*"/, `"Type": "Serials/Books"`)
  );
  
  // Actually, let me do this more carefully
  const productMatch = content.match(new RegExp(`{[\\s\\S]*?"id": "${foundProduct}"[\\s\\S]*?}`));
  if (productMatch) {
    const updatedProduct = productMatch[0].replace(/"Type": "[^"]*"/, `"Type": "Serials/Books"`);
    content = content.replace(productMatch[0], updatedProduct);
    console.log(`✅ Updated ${foundProduct} to Serials/Books`);
  }
} else {
  console.log('❌ No unused products found');
}

// Write the updated file
fs.writeFileSync(productsPath, content, 'utf8');

console.log('\n🎉 Updated products file!');

