const fs = require('fs');
const path = require('path');

// Read the products file
const productsPath = path.join(__dirname, '..', 'data', 'products.ts');
let productsContent = fs.readFileSync(productsPath, 'utf8');

console.log('🔍 Fixing ALL encoding issues in products.ts...\n');

// Comprehensive encoding fixes
const fixes = [
  // Title fixes
  { from: '"Title": "?Asphalt & Aftershave",', to: '"Title": "Asphalt & Aftershave",' },
  { from: '"Title": "?Coconut & Gin",', to: '"Title": "Coconut & Gin",' },
  { from: '"Title": "?Midnight Bleach",', to: '"Title": "Midnight Bleach",' },
  { from: '"Title": "?Prowler Interior: \'69 Edition",', to: '"Title": "Prowler Interior: \'69 Edition",' },
  
  // Description fixes
  { from: 'Risqu & Safety', to: 'Risqué & Safety' },
  { from: 'graffitti', to: 'graffiti' },
  { from: '"Still Thinking? & car outline silhouettes."', to: '"Still Thinking?" & car outline silhouettes.' },
  { from: "'What Are You Seeing?'  poetic prompt cards.", to: "'What Are You Seeing?' poetic prompt cards." }
];

let updatedContent = productsContent;
let fixCount = 0;

console.log('Applying fixes:');
fixes.forEach((fix, index) => {
  if (updatedContent.includes(fix.from)) {
    updatedContent = updatedContent.replace(fix.from, fix.to);
    console.log(`${index + 1}. ✅ Fixed: ${fix.from} → ${fix.to}`);
    fixCount++;
  } else {
    console.log(`${index + 1}. ❌ Not found: ${fix.from}`);
  }
});

// Write back to file
fs.writeFileSync(productsPath, updatedContent, 'utf8');

console.log(`\n🎉 SUCCESS! Fixed ${fixCount} encoding issues!`);
console.log('📁 File updated: data/products.ts');

// Verify no more encoding issues
const remainingIssues = updatedContent.match(/[?∩┐╜]/g);
if (remainingIssues) {
  console.log(`\n⚠️  WARNING: ${remainingIssues.length} encoding issues still remain:`);
  const lines = updatedContent.split('\n');
  lines.forEach((line, i) => {
    if (line.match(/[?∩┐╜]/)) {
      console.log(`Line ${i+1}: ${line.trim()}`);
    }
  });
} else {
  console.log('\n✅ ALL encoding issues have been eliminated!');
}
