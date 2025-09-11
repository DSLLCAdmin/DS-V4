const fs = require('fs');

const content = fs.readFileSync('app/shop/page.tsx', 'utf8');
let newContent = content;

// Fix all remaining case sensitivity issues
newContent = newContent.replace(/product\.InStock/g, 'product.inStock');
newContent = newContent.replace(/product\.Title/g, 'product.title');
newContent = newContent.replace(/product\.Description/g, 'product.description');
newContent = newContent.replace(/product\.Type/g, 'product.category');
newContent = newContent.replace(/product\.SalePrice/g, 'product.price');
newContent = newContent.replace(/product\.OriginalPrice/g, 'product.originalPrice');
newContent = newContent.replace(/product\.Badge/g, 'product.badge');

fs.writeFileSync('app/shop/page.tsx', newContent, 'utf8');
console.log('SUCCESS! Fixed all remaining case sensitivity issues');
console.log('Fixed: InStock, Title, Description, Type, SalePrice, OriginalPrice, Badge');