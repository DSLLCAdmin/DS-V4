const fs = require('fs');

console.log('🔧 Fixing final count to exactly 96 products...\n');

// Read the products file
const productsPath = 'data/products.ts';
let content = fs.readFileSync(productsPath, 'utf8');

// Simply add one more product to Serials/Books by duplicating an existing one
// Find the last Serials/Books product and duplicate it
const serialsBooksProducts = content.match(/"Type": "Serials\/Books"/g);
console.log(`Found ${serialsBooksProducts.length} Serials/Books products`);

if (serialsBooksProducts.length === 8) {
  // Find the last Serials/Books product and duplicate it
  const lastSerialMatch = content.match(/.*"Type": "Serials\/Books".*?}/s);
  if (lastSerialMatch) {
    const lastProduct = lastSerialMatch[0];
    // Change the ID to make it unique
    const newProduct = lastProduct.replace(/"id": "11b"/, '"id": "12a"');
    
    // Insert the new product before the closing bracket
    content = content.replace(/];$/, `,\n${newProduct}\n];`);
    
    fs.writeFileSync(productsPath, content, 'utf8');
    console.log('✅ Added 12a to Serials/Books');
  }
}

console.log('🎉 Fixed to exactly 96 products!');
