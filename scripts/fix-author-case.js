const fs = require('fs');

const content = fs.readFileSync('app/shop/page.tsx', 'utf8');
let newContent = content;

// Fix Author case sensitivity - should be brand
newContent = newContent.replace(/product\.Author/g, 'product.brand');

fs.writeFileSync('app/shop/page.tsx', newContent, 'utf8');
console.log('SUCCESS! Fixed Author case sensitivity');
console.log('Changed: product.Author → product.brand');