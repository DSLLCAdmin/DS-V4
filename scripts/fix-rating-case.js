const fs = require('fs');

const content = fs.readFileSync('app/shop/page.tsx', 'utf8');
let newContent = content;

// Fix Rating case sensitivity - should be rating
newContent = newContent.replace(/product\.Rating/g, 'product.rating');
newContent = newContent.replace(/product\.Reviews/g, 'product.reviews');

fs.writeFileSync('app/shop/page.tsx', newContent, 'utf8');
console.log('SUCCESS! Fixed Rating and Reviews case sensitivity');
console.log('Changed: product.Rating → product.rating');
console.log('Changed: product.Reviews → product.reviews');