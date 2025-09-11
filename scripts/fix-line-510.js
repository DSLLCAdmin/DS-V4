const fs = require('fs');

const content = fs.readFileSync('app/shop/page.tsx', 'utf8');
const lines = content.split('\n');

console.log('Looking for line 510...');
console.log('Line 510:', lines[509]); // 0-indexed, so line 510 is index 509

// Find and replace the problematic line
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('parseFloat(product.originalPrice?.replace') && lines[i].includes('parseFloat(product.price.replace')) {
    console.log('Found problematic line at', i+1, ':', lines[i]);
    lines[i] = '                                Save $' + ((product.originalPrice || 0) - (product.price || 0)).toFixed(2);
    console.log('Replaced with:', lines[i]);
  }
}

const newContent = lines.join('\n');
fs.writeFileSync('app/shop/page.tsx', newContent, 'utf8');
console.log('SUCCESS! Fixed line 510');