const fs = require('fs');

console.log('🔧 Fixing unescaped quotes in products.ts...\n');

// Read the products file
const productsPath = 'data/products.ts';
let content = fs.readFileSync(productsPath, 'utf8');

// Fix unescaped quotes in descriptions
let fixCount = 0;

// Find all description fields and fix quotes
const descriptionRegex = /"Description": "([^"]*(?:"[^"]*)*)"/g;
const matches = content.match(descriptionRegex);

if (matches) {
  matches.forEach(match => {
    const original = match;
    const fixed = match.replace(/"([^"]*)"/g, (m, p1) => {
      // Escape quotes inside the description
      return `"${p1.replace(/"/g, '\\"')}"`;
    });
    
    if (original !== fixed) {
      content = content.replace(original, fixed);
      fixCount++;
      console.log(`✅ Fixed: ${original.substring(0, 50)}...`);
    }
  });
}

// Write the fixed file
fs.writeFileSync(productsPath, content, 'utf8');

console.log(`\n🎉 Fixed ${fixCount} quote issues!`);
console.log('📁 File updated: data/products.ts');
