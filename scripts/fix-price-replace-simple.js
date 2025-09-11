const fs = require('fs');

const content = fs.readFileSync('app/shop/page.tsx', 'utf8');
const lines = content.split('\n');

for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('parseFloat(product.originalPrice?.replace') && lines[i].includes('parseFloat(product.price.replace')) {
    lines[i] = '                                Save $' + ((product.originalPrice || 0) - (product.price || 0)).toFixed(2);
    console.log('Fixed line', i+1, ':', lines[i]);
  }
}

const newContent = lines.join('\n');
fs.writeFileSync('app/shop/page.tsx', newContent, 'utf8');
console.log('SUCCESS! Fixed price replace operations');