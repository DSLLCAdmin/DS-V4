const fs = require('fs');

const content = fs.readFileSync('app/shop/page.tsx', 'utf8');
let newContent = content;

// Fix formatPrice function calls to handle number types
newContent = newContent.replace(/formatPrice\(product\.price, product\.originalPrice\)/g, 'formatPrice(product.price?.toString() || "0", product.originalPrice?.toString() || "0")');

fs.writeFileSync('app/shop/page.tsx', newContent, 'utf8');
console.log('SUCCESS! Fixed formatPrice function calls to handle number types');
console.log('Changed: formatPrice(product.price, product.originalPrice) → formatPrice(product.price?.toString() || "0", product.originalPrice?.toString() || "0")');