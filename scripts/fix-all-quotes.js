const fs = require('fs');

console.log('🔧 Fixing all quote issues in products.ts...\n');

// Read the products file
const productsPath = 'data/products.ts';
let content = fs.readFileSync(productsPath, 'utf8');

let fixCount = 0;

// Fix unescaped quotes in descriptions
const lines = content.split('\n');
const fixedLines = lines.map((line, index) => {
  if (line.includes('"Description":')) {
    // Find the description content between the quotes
    const match = line.match(/"Description": "(.+)"/);
    if (match) {
      const description = match[1];
      // Escape any unescaped quotes inside the description
      const fixedDescription = description.replace(/(?<!\\)"/g, '\\"');
      if (description !== fixedDescription) {
        const newLine = line.replace(/"Description": "(.+)"/, `"Description": "${fixedDescription}"`);
        console.log(`✅ Fixed line ${index + 1}: ${description.substring(0, 50)}...`);
        fixCount++;
        return newLine;
      }
    }
  }
  return line;
});

// Write the fixed content
fs.writeFileSync(productsPath, fixedLines.join('\n'), 'utf8');

console.log(`\n🎉 Fixed ${fixCount} quote issues!`);
console.log('📁 File updated: data/products.ts');
