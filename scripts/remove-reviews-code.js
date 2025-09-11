const fs = require('fs');

const content = fs.readFileSync('app/shop/page.tsx', 'utf8');
let newContent = content;

// Remove reviews code since our products don't have reviews
newContent = newContent.replace(/\s*{product\.reviews && \(\s*<span[^>]*>[\s\S]*?<\/span>\s*\)}\s*/g, '');

fs.writeFileSync('app/shop/page.tsx', newContent, 'utf8');
console.log('SUCCESS! Removed reviews code since products don\'t have reviews');