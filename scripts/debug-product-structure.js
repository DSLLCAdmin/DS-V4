const fs = require('fs');

const content = fs.readFileSync('data/products.ts', 'utf8');
const lines = content.split('\n');

console.log('Looking for product structure patterns...');

for (let i = 0; i < Math.min(50, lines.length); i++) {
  const line = lines[i];
  if (line.includes('inStock') || line.includes('featured') || line.includes('tags') || line.includes('createdAt')) {
    console.log('Line', i+1, ':', line.trim());
  }
}

console.log('\nTotal lines in file:', lines.length);