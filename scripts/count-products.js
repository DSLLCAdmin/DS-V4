const fs = require('fs');

console.log('🔧 Starting safe script: Counting products and categories...');

// Set timeout to prevent hanging
const timeout = setTimeout(() => {
  console.log('❌ Script timed out after 30 seconds - stopping');
  process.exit(1);
}, 30000);

try {
  console.log('📋 Step 1: Reading products file...');
  
  const content = fs.readFileSync('data/products.ts', 'utf8');
  console.log('✅ Step 1 complete: File read successfully');

  console.log('📋 Step 2: Counting products...');
  
  const matches = content.match(/"id":/g);
  const totalProducts = matches ? matches.length : 0;
  console.log(`✅ Step 2 complete: Found ${totalProducts} total products`);

  console.log('📋 Step 3: Analyzing categories...');
  
  // Count by category
  const typeMatches = content.match(/"Type": "([^"]*)"/g);
  const categories = {};
  if (typeMatches) {
    typeMatches.forEach(match => {
      const category = match.match(/"Type": "([^"]*)"/)[1];
      categories[category] = (categories[category] || 0) + 1;
    });
  }
  
  console.log('✅ Step 3 complete: Categories analyzed');

  console.log('\n📊 Final Results:');
  console.log(`Total products: ${totalProducts}`);
  console.log('\nCategory distribution:');
  Object.entries(categories).forEach(([category, count]) => {
    console.log(`  ${category}: ${count} products`);
  });

  // Clear timeout on successful completion
  clearTimeout(timeout);
  console.log('\n✅ Script completed successfully!');

} catch (error) {
  console.error('❌ Script failed:', error.message);
  clearTimeout(timeout);
  process.exit(1);
}
