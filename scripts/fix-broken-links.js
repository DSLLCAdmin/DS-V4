const fs = require('fs');

console.log('🔧 Fixing Broken Image Links...\n');

try {
  // Read products file
  const content = fs.readFileSync('./data/products.ts', 'utf8');
  const products = JSON.parse(content.match(/export const products = (\[[\s\S]*\]);/)[1]);
  
  // Fix broken image links
  const brokenLinkFixes = {
    '/product-images/D6_neon-light-wall-signs.png': '/product-images/D6_neon-light-wall-signs.webp',
    '/product-images/G2_dark-street-mugs.webp': '/product-images/G2_dark-street-mug_Front.webp'
  };
  
  let fixed = 0;
  
  // Apply fixes
  for (const product of products) {
    if (product.image && brokenLinkFixes[product.image]) {
      const oldPath = product.image;
      product.image = brokenLinkFixes[product.image];
      console.log(`✅ Fixed: ${product.Title} -> ${oldPath} -> ${product.image}`);
      fixed++;
    }
  }
  
  // Save quickly
  const updated = `export const products = ${JSON.stringify(products, null, 2)};`;
  fs.writeFileSync('./data/products.ts', updated);
  
  console.log(`\n🎉 Fixed ${fixed} broken image links.`);
  console.log('📝 Refresh your shop page to see the fixed images.');
  
} catch (error) {
  console.error('❌ Fix failed:', error.message);
}
