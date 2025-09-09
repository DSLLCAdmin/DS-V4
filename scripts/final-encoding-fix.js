const fs = require('fs');
const path = require('path');

// Read the products file
const productsPath = path.join(__dirname, '..', 'data', 'products.ts');
let productsContent = fs.readFileSync(productsPath, 'utf8');

console.log('🔧 Final encoding fix - Eliminating ALL encoding issues...\n');

// Apply fixes one by one
let updatedContent = productsContent;
let fixCount = 0;

// Remove all problematic characters
updatedContent = updatedContent.replace(/[?∩┐╜]/g, '');
updatedContent = updatedContent.replace(/◆/g, '');
updatedContent = updatedContent.replace(//g, '');
fixCount += 3;

// Fix specific text issues
updatedContent = updatedContent.replace(/Risqu & Safety/g, 'Risqué & Safety');
updatedContent = updatedContent.replace(/graffitti/g, 'graffiti');
updatedContent = updatedContent.replace(/Still Thinking\? &/g, '"Still Thinking?" &');
updatedContent = updatedContent.replace(/Youre Art/g, "You're Art");
fixCount += 4;

// Clean up extra spaces
updatedContent = updatedContent.replace(/\s+/g, ' ');
updatedContent = updatedContent.replace(/^\s+|\s+$/gm, '');
fixCount += 2;

// Write back to file
fs.writeFileSync(productsPath, updatedContent, 'utf8');

console.log(`🎉 Applied ${fixCount} encoding fixes!`);
console.log('📁 File updated: data/products.ts');

// Verify no encoding issues remain
const finalContent = fs.readFileSync(productsPath, 'utf8');
const remainingIssues = finalContent.match(/[?∩┐╜◆]/g);
if (remainingIssues) {
  console.log(`⚠️  WARNING: ${remainingIssues.length} encoding issues still remain`);
} else {
  console.log(`✅ ALL encoding issues eliminated!`);
}