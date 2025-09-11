const fs = require('fs');

const content = fs.readFileSync('data/products.ts', 'utf8');
const lines = content.split('\n');

let changes = 0;

for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('"featured": false,')) {
    lines[i] = lines[i] + '\n    "badge": "New",';
    changes++;
    console.log('Added badge to product', changes);
  }
}

const newContent = lines.join('\n');
fs.writeFileSync('data/products.ts', newContent, 'utf8');
console.log('SUCCESS! Added badge field to', changes, 'products');