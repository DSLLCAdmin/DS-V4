const fs = require('fs');

const content = fs.readFileSync('app/shop/page.tsx', 'utf8');
let newContent = content;

// Fix the hasDiscount function calls to handle number types
newContent = newContent.replace(/hasDiscount\(product\.price, product\.originalPrice\)/g, 'hasDiscount(product.price?.toString() || "0", product.originalPrice?.toString() || "0")');
newContent = newContent.replace(/getDiscountPercentage\(product\.price, product\.originalPrice\)/g, 'getDiscountPercentage(product.price?.toString() || "0", product.originalPrice?.toString() || "0")');

fs.writeFileSync('app/shop/page.tsx', newContent, 'utf8');
console.log('SUCCESS! Fixed hasDiscount function calls to handle number types');