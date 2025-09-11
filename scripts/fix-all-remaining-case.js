const fs = require('fs');

const content = fs.readFileSync('app/shop/page.tsx', 'utf8');
let newContent = content;

// Fix all remaining case sensitivity issues
newContent = newContent.replace(/a\.Title/g, 'a.title');
newContent = newContent.replace(/b\.Title/g, 'b.title');
newContent = newContent.replace(/a\.Type/g, 'a.category');
newContent = newContent.replace(/b\.Type/g, 'b.category');

fs.writeFileSync('app/shop/page.tsx', newContent, 'utf8');
console.log('SUCCESS! Fixed all remaining case sensitivity issues');
console.log('Fixed: Title -> title, Type -> category');