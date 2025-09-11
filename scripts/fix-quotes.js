const fs = require('fs');

const content = fs.readFileSync('data/products.ts', 'utf8');

// Fix double quotes inside strings
let newContent = content.replace(/""/g, '"');

// Fix unescaped quotes in descriptions
newContent = newContent.replace(/"([^"]*)"([^"]*)"([^"]*)"/g, '"$1\\"$2\\"$3"');

// Fix specific problematic patterns
newContent = newContent.replace(/"Inspired by Dancer's wardrobe with ""Streetin"" detailing."/g, '"Inspired by Dancer\'s wardrobe with \\"Streetin\\" detailing."');

fs.writeFileSync('data/products.ts', newContent, 'utf8');
console.log('Fixed quote escaping in products.ts');