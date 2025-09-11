const fs = require('fs');

const content = fs.readFileSync('app/shop/page.tsx', 'utf8');
let newContent = content;

// Fix boolean comparison - inStock is boolean, not string
newContent = newContent.replace(/product\.inStock === "false"/g, '!product.inStock');
newContent = newContent.replace(/product\.inStock === "true"/g, 'product.inStock');

fs.writeFileSync('app/shop/page.tsx', newContent, 'utf8');
console.log('SUCCESS! Fixed boolean comparison for inStock');
console.log('Changed: product.inStock === "false" → !product.inStock');
console.log('Changed: product.inStock === "true" → product.inStock');