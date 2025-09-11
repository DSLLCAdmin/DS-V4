const fs = require('fs');

const content = fs.readFileSync('data/products.ts', 'utf8');
let newContent = content;

// Add badge field to all products with a default value
newContent = newContent.replace(/(\s+)(\w+): (\w+),/g, (match, indent, key, value) => {
  if (key === 'inStock') {
    return match + '\n' + indent + 'badge: "New",';
  }
  return match;
});

fs.writeFileSync('data/products.ts', newContent, 'utf8');
console.log('SUCCESS! Added badge field to all products with default "New" value');