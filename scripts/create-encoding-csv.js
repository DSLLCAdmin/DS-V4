const fs = require('fs');
const path = require('path');

// Read the products file
const productsPath = path.join(__dirname, '..', 'data', 'products.ts');
let productsContent = fs.readFileSync(productsPath, 'utf8');

console.log('📋 Creating CSV with encoding issues highlighted...\n');

// Find all lines with encoding issues
const lines = productsContent.split('\n');
const problematicLines = [];

lines.forEach((line, i) => {
  if (line.match(/[?∩┐╜]/)) {
    problematicLines.push({
      lineNumber: i + 1,
      content: line.trim(),
      issues: line.match(/[?∩┐╜]/g) || []
    });
  }
});

// Create CSV content
let csvContent = 'Line Number,Field,Current Content,Issues Found,Recommended Fix\n';

problematicLines.forEach(item => {
  const field = item.content.includes('"Title"') ? 'Title' : 'Description';
  const issues = item.issues.join(', ');
  
  let recommendedFix = item.content;
  // Apply common fixes
  recommendedFix = recommendedFix.replace(/[?∩┐╜]/g, '');
  recommendedFix = recommendedFix.replace('Risqu & Safety', 'Risqué & Safety');
  recommendedFix = recommendedFix.replace('graffitti', 'graffiti');
  recommendedFix = recommendedFix.replace('Still Thinking? &', '"Still Thinking?" &');
  
  csvContent += `${item.lineNumber},"${field}","${item.content}","${issues}","${recommendedFix}"\n`;
});

// Write CSV file
const csvPath = path.join(__dirname, '..', 'encoding-issues.csv');
fs.writeFileSync(csvPath, csvContent, 'utf8');

console.log(`✅ Created encoding-issues.csv with ${problematicLines.length} problematic lines`);
console.log('📁 File location: encoding-issues.csv');
console.log('\n🔍 Issues found:');
problematicLines.forEach(item => {
  console.log(`Line ${item.lineNumber}: ${item.content.substring(0, 80)}...`);
});

console.log('\n💡 Open encoding-issues.csv in Excel to see all issues and fixes!');
