const fs = require('fs');
const path = require('path');

// Test if product images exist and are accessible
const productImagesDir = path.join(__dirname, '../public/product-images');

console.log('🔍 Testing Product Image Accessibility');
console.log('=====================================');

if (!fs.existsSync(productImagesDir)) {
  console.log('❌ Product images directory does not exist!');
  process.exit(1);
}

const files = fs.readdirSync(productImagesDir);
const webpFiles = files.filter(file => file.endsWith('.webp'));

console.log(`📁 Found ${webpFiles.length} .webp files in product-images directory:`);

webpFiles.forEach(file => {
  const filePath = path.join(productImagesDir, file);
  const stats = fs.statSync(filePath);
  const sizeKB = (stats.size / 1024).toFixed(1);
  
  console.log(`✅ ${file} (${sizeKB}KB)`);
});

// Test specific files mentioned in console errors
const problematicFiles = [
  '1a_first-light-ebook.webp',
  '2a_risque-safety-ebook.webp', 
  '3a_mercury-memory-ebook.webp',
  'A2_mesh-bodysuits.webp',
  'A8_hats.webp',
  'B7_mirror-charms.webp',
  'B2_Dark Streets Scent Diffusers.webp',
  'B3_window-shades.webp',
  'D8_Moonlight Noir Projection Lamps.webp',
  'D6_neon-light-wall-signs.webp',
  'G2_dark-street-mug_Front.webp'
];

console.log('\n🔍 Checking problematic files:');
problematicFiles.forEach(file => {
  const filePath = path.join(productImagesDir, file);
  if (fs.existsSync(filePath)) {
    const stats = fs.statSync(filePath);
    const sizeKB = (stats.size / 1024).toFixed(1);
    console.log(`✅ ${file} exists (${sizeKB}KB)`);
  } else {
    console.log(`❌ ${file} MISSING!`);
  }
});
