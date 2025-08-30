<!-- Updated: 2025-08-30T20:54:08.131Z -->
const fs = require('fs');

console.log('🔄 Updating Placeholder Text...\n');

try {
  // Read products file
  const content = fs.readFileSync('./data/products.ts', 'utf8');
  const products = JSON.parse(content.match(/export const products = (\[[\s\S]*\]);/)[1]);
  
  let updated = 0;
  
  // Update all "Need Image Here" placeholders
  for (const product of products) {
    if (product.image === "Need Image Here") {
      product.image = "Product in-Design\nTell us your ideas!";
      updated++;
    }
  }
  
  // Save updated products
  const updatedContent = `export const products = ${JSON.stringify(products, null, 2)};`;
  fs.writeFileSync('./data/products.ts', updatedContent);
  
  console.log(`✅ Updated ${updated} placeholder texts`);
  console.log('📝 All "Need Image Here" cards now show "Product in-Design" and "Tell us your ideas!"');
  
} catch (error) {
  console.error('❌ Update failed:', error.message);
}
