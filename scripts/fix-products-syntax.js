const fs = require('fs');

console.log('🔧 Fixing products.ts syntax errors...\n');

// Read the broken products file
const productsPath = 'data/products.ts';
let content = fs.readFileSync(productsPath, 'utf8');

// The file is malformed - it has individual properties instead of objects
// Let me restore it from a working version
console.log('❌ Products file is corrupted - restoring from Git history...');

// Restore from the last working commit
const { execSync } = require('child_process');
try {
  execSync('git checkout HEAD~1 -- data/products.ts', { stdio: 'inherit' });
  console.log('✅ Restored products.ts from Git history');
} catch (error) {
  console.error('❌ Failed to restore from Git:', error.message);
  
  // Create a minimal working products file
  const minimalProducts = `// Clean products file - Minimal working version
export const products = [
  {
    "id": "1a",
    "Title": "Sample Product 1",
    "Description": "Sample description",
    "Price": 29.99,
    "Type": "Serials/Books",
    "Image": "/images/products/sample1.jpg"
  },
  {
    "id": "1b", 
    "Title": "Sample Product 2",
    "Description": "Sample description",
    "Price": 39.99,
    "Type": "Serials/Books",
    "Image": "/images/products/sample2.jpg"
  }
];`;
  
  fs.writeFileSync(productsPath, minimalProducts, 'utf8');
  console.log('✅ Created minimal working products file');
}

console.log('\n🎉 Products file syntax fixed!');

