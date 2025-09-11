const fs = require('fs');

const content = fs.readFileSync('app/shop/page.tsx', 'utf8');
const lines = content.split('\n');

// Find and replace the problematic line
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('parseFloat(product.originalPrice?.replace') && lines[i].includes('parseFloat(product.price.replace')) {
    console.log('Found problematic line at', i+1, ':', lines[i]);
    
    // Replace with the correct calculation using template literal
    lines[i] = '                                Save ${((product.originalPrice || 0) - (product.price || 0)).toFixed(2)}';
    
    console.log('Replaced with:', lines[i]);
    break;
  }
}

const newContent = lines.join('\n');
fs.writeFileSync('app/shop/page.tsx', newContent, 'utf8');
console.log('SUCCESS! Fixed the problematic line');