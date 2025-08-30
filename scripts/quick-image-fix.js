const fs = require('fs');

console.log('🔗 Quick Image Fix - Fast & Simple...\n');

try {
  // Read products file
  const content = fs.readFileSync('./data/products.ts', 'utf8');
  const products = JSON.parse(content.match(/export const products = (\[[\s\S]*\]);/)[1]);
  
  // Quick manual fixes for the main images you mentioned
  const quickFixes = {
    'D6': '/product-images/D6_neon-light-wall-signs.webp',  // Neon Light Wall Signs
    'A4': '/product-images/Tees-2.webp',                    // Dark Streeter Tees
    'A2': '/product-images/A2_mesh-bodysuits.webp',         // Mesh Bodysuits
    'B3': '/product-images/B3_window-shades.webp',          // Window Shades
    'B7': '/product-images/B7_mirror-charms.webp'           // Mirror Charms
  };
  
  let fixed = 0;
  
  // Apply quick fixes
  for (const product of products) {
    if (product.image === "Need Image Here" && quickFixes[product.id]) {
      product.image = quickFixes[product.id];
      console.log(`✅ Fixed: ${product.Title} -> ${quickFixes[product.id]}`);
      fixed++;
    }
  }
  
  // Save quickly
  const updated = `export const products = ${JSON.stringify(products, null, 2)};`;
  fs.writeFileSync('./data/products.ts', updated);
  
  console.log(`\n🎉 Quick fix completed! Fixed ${fixed} images.`);
  console.log('📝 Refresh your shop page to see the changes.');
  
} catch (error) {
  console.error('❌ Quick fix failed:', error.message);
}
