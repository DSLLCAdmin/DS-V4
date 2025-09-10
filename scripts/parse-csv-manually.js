const fs = require('fs');

console.log('🔍 Analyzing CSV structure manually...\n');

const csvContent = fs.readFileSync('products.csv', 'utf8');
const lines = csvContent.split('\n');

// Let's look at a few specific lines to understand the structure
console.log('Line 23 (B2):', lines[22]);
console.log('Line 24 (B3):', lines[23]);
console.log('Line 25 (B4):', lines[24]);

// Try to parse B2 manually
const line23 = lines[22];
console.log('\nParsing B2 manually:');
console.log('Full line:', line23);

// Split by comma and see what we get
const parts = line23.split(',');
console.log('Parts after split:');
parts.forEach((part, index) => {
  console.log(`  ${index}: "${part}"`);
});

// The issue is that "Home, Mood, and Atmosphere" contains commas
// So we need to be smarter about parsing
console.log('\nLooking for the pattern: ID,Category,Title,Author,Price,Description');

// Let's try a different approach - look for the pattern
const id = line23.substring(0, line23.indexOf(','));
console.log('ID:', id);

// Find the next comma after the ID
const afterId = line23.substring(line23.indexOf(',') + 1);
console.log('After ID:', afterId);

// The category ends where we have a pattern like: ,Title,Author,$Price,
// Let's look for this pattern
const categoryEndPattern = /,\w+.*,DS LLC,\$[\d.]+/;
const match = afterId.match(categoryEndPattern);
if (match) {
  const categoryEnd = match.index;
  const category = afterId.substring(0, categoryEnd);
  console.log('Category:', category);
  
  const afterCategory = afterId.substring(categoryEnd + 1);
  const titleEnd = afterCategory.indexOf(',');
  const title = afterCategory.substring(0, titleEnd);
  console.log('Title:', title);
}
