const fs = require('fs');

const content = fs.readFileSync('data/products.ts', 'utf8');
const lines = content.split('\n');

let badgeCount = 0;
let inStockCount = 0;

lines.forEach((line, i) => {
  if (line.includes('badge:')) {
    badgeCount++;
    if (badgeCount <= 3) {
      console.log('Badge found at line', i+1, ':', line.trim());
    }
  }
  if (line.includes('inStock:')) {
    inStockCount++;
    if (inStockCount <= 3) {
      console.log('inStock found at line', i+1, ':', line.trim());
    }
  }
});

console.log('Total badge fields:', badgeCount);
console.log('Total inStock fields:', inStockCount);