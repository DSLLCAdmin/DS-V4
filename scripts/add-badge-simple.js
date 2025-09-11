const fs = require('fs');

const content = fs.readFileSync('data/products.ts', 'utf8');
const lines = content.split('\n');

for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('inStock: true,') || lines[i].includes('inStock: false,')) {
    lines[i] = lines[i] + '\n    badge: "New",';
    console.log('Added badge to line', i+1);
  }
}

const newContent = lines.join('\n');
fs.writeFileSync('data/products.ts', newContent, 'utf8');
console.log('SUCCESS! Added badge field to all products');