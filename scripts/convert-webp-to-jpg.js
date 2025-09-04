const fs = require('fs');
const path = require('path');

// This script will update the product data to use JPG versions instead of WebP
// Since we can't convert WebP to JPG without additional libraries, we'll update the paths
// and provide instructions for manual conversion

const productsFile = path.join(__dirname, '../data/products.ts');

console.log('🔄 Converting WebP references to JPG for better browser compatibility');
console.log('=====================================================================');

// Read the products file
let productsContent = fs.readFileSync(productsFile, 'utf8');

// Define the WebP to JPG mappings
const webpToJpgMappings = {
  '1a_first-light-ebook.webp': '1a_first-light-ebook.jpg',
  '2a_risque-safety-ebook.webp': '2a_risque-safety-ebook.jpg',
  '3a_mercury-memory-ebook.webp': '3a_mercury-memory-ebook.jpg',
  'A2_mesh-bodysuits.webp': 'A2_mesh-bodysuits.jpg',
  'A8_hats.webp': 'A8_hats.jpg',
  'B2_Dark Streets Scent Diffusers.webp': 'B2_Dark Streets Scent Diffusers.jpg',
  'B3_window-shades.webp': 'B3_window-shades.jpg',
  'B7_mirror-charms.webp': 'B7_mirror-charms.jpg',
  'D6_neon-light-wall-signs.webp': 'D6_neon-light-wall-signs.jpg',
  'D8_Moonlight Noir Projection Lamps.webp': 'D8_Moonlight Noir Projection Lamps.jpg',
  'G2_dark-street-mug_Front.webp': 'G2_dark-street-mug_Front.jpg',
  'G2_dark-street-mug_Back.webp': 'G2_dark-street-mug_Back.jpg',
  'E1_Official Dark Streets Driving Playlists.webp': 'E1_Official Dark Streets Driving Playlists.jpg'
};

// Replace all WebP references with JPG
let updatedContent = productsContent;
let replacementCount = 0;

Object.entries(webpToJpgMappings).forEach(([webpFile, jpgFile]) => {
  const webpPath = `/product-images/${webpFile}`;
  const jpgPath = `/product-images/${jpgFile}`;
  
  if (updatedContent.includes(webpPath)) {
    updatedContent = updatedContent.replace(new RegExp(webpPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), jpgPath);
    replacementCount++;
    console.log(`✅ Replaced: ${webpFile} → ${jpgFile}`);
  }
});

// Write the updated content back
if (replacementCount > 0) {
  fs.writeFileSync(productsFile, updatedContent);
  console.log(`\n📝 Updated ${replacementCount} image references in products.ts`);
  
  console.log('\n📋 NEXT STEPS REQUIRED:');
  console.log('1. Convert the WebP files to JPG format');
  console.log('2. Place the JPG files in the public/product-images/ directory');
  console.log('3. You can use online converters or image editing software');
  console.log('4. Ensure the JPG files have the same names as listed above');
} else {
  console.log('ℹ️ No WebP references found to convert');
}

console.log('\n🔍 Current WebP files in product-images directory:');
const productImagesDir = path.join(__dirname, '../public/product-images');
if (fs.existsSync(productImagesDir)) {
  const files = fs.readdirSync(productImagesDir);
  const webpFiles = files.filter(file => file.endsWith('.webp'));
  webpFiles.forEach(file => {
    console.log(`   📄 ${file}`);
  });
}
