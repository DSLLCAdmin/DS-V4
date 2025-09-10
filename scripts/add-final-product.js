const fs = require('fs');

console.log('🔧 Adding final product to reach 96 total...\n');

// Read the products file
const productsPath = 'data/products.ts';
let content = fs.readFileSync(productsPath, 'utf8');

// Find the first product that's not in Serials/Books and move it there
const lines = content.split('\n');
let foundIndex = -1;

for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('"id": "') && 
      !lines[i].includes('"id": "1a") && !lines[i].includes('"id": "1b") &&
      !lines[i].includes('"id": "2a") && !lines[i].includes('"id": "2b") &&
      !lines[i].includes('"id": "3a") && !lines[i].includes('"id": "3b") &&
      !lines[i].includes('"id": "11a") && !lines[i].includes('"id": "11b")) {
    
    // Found a product that's not in Serials/Books
    const idMatch = lines[i].match(/"id": "([^"]*)"/);
    if (idMatch) {
      console.log(`Found product to move: ${idMatch[1]}`);
      foundIndex = i;
      break;
    }
  }
}

if (foundIndex !== -1) {
  // Find the complete product object
  let productStart = foundIndex;
  let productEnd = foundIndex;
  
  // Go backwards to find the opening brace
  while (productStart > 0 && !lines[productStart].includes('{')) {
    productStart--;
  }
  
  // Go forwards to find the closing brace
  while (productEnd < lines.length && !lines[productEnd].includes('}')) {
    productEnd++;
  }
  
  if (productStart < productEnd) {
    // Update the Type field to Serials/Books
    for (let i = productStart; i <= productEnd; i++) {
      if (lines[i].includes('"Type":')) {
        lines[i] = lines[i].replace(/"Type": "[^"]*"/, `"Type": "Serials/Books"`);
        console.log(`✅ Updated product to Serials/Books`);
        break;
      }
    }
    
    // Write the updated content
    const updatedContent = lines.join('\n');
    fs.writeFileSync(productsPath, updatedContent, 'utf8');
    
    console.log('🎉 Added final product to Serials/Books!');
  }
} else {
  console.log('❌ No suitable product found to move');
}

