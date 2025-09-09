const fs = require('fs');
const path = require('path');

// Read the products file
const productsPath = path.join(__dirname, '..', 'data', 'products.ts');
let productsContent = fs.readFileSync(productsPath, 'utf8');

console.log('Fixing title encoding issues...');

// Fix the specific title encoding issues
const fixes = [
  { from: '"Title": "?Asphalt & Aftershave",', to: '"Title": "Asphalt & Aftershave",' },
  { from: '"Title": "?Coconut & Gin",', to: '"Title": "Coconut & Gin",' },
  { from: '"Title": "?Midnight Bleach",', to: '"Title": "Midnight Bleach",' },
  { from: '"Title": "?Prowler Interior: \'69 Edition",', to: '"Title": "Prowler Interior: \'69 Edition",' }
];

let updatedContent = productsContent;
let fixCount = 0;

fixes.forEach(fix => {
  if (updatedContent.includes(fix.from)) {
    updatedContent = updatedContent.replace(fix.from, fix.to);
    console.log(`✅ Fixed: ${fix.from} → ${fix.to}`);
    fixCount++;
  } else {
    console.log(`❌ Not found: ${fix.from}`);
  }
});

// Write back to file
fs.writeFileSync(productsPath, updatedContent, 'utf8');

console.log(`\n✅ Fixed ${fixCount} title encoding issues!`);
console.log('📁 File updated: data/products.ts');
