const fs = require('fs');

const content = fs.readFileSync('app/shop/page.tsx', 'utf8');
let newContent = content;

// Fix price replace operations - prices are numbers, not strings
newContent = newContent.replace(/parseFloat\(product\.originalPrice\?\.replace\('\\$', ''\) \|\| '0'\)/g, 'product.originalPrice || 0');
newContent = newContent.replace(/parseFloat\(product\.price\.replace\('\\$', ''\)\)/g, 'product.price || 0');

fs.writeFileSync('app/shop/page.tsx', newContent, 'utf8');
console.log('SUCCESS! Fixed price replace operations');
console.log('Changed: parseFloat(product.originalPrice?.replace(...)) → product.originalPrice || 0');
console.log('Changed: parseFloat(product.price.replace(...)) → product.price || 0');