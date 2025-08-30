const fs = require('fs');
const path = require('path');

// Comprehensive image linking
async function comprehensiveImageLinking() {
  try {
    console.log('🔗 Comprehensive Image Linking...\n');
    
    // Load current products
    const currentContent = fs.readFileSync('./data/products.ts', 'utf8');
    const currentMatch = currentContent.match(/export const products = (\[[\s\S]*\]);/);
    if (!currentMatch) {
      throw new Error('Could not parse current products.ts');
    }
    const products = JSON.parse(currentMatch[1]);
    
    // Get available images
    const imagesDir = './public/product-images';
    const availableImages = fs.readdirSync(imagesDir)
      .filter(file => file.endsWith('.webp') || file.endsWith('.jpg') || file.endsWith('.png'))
      .map(file => ({
        filename: file,
        path: `/product-images/${file}`,
        productId: file.split('_')[0], // Extract product ID from filename
        cleanName: file.toLowerCase().replace(/[^a-z0-9]/g, '')
      }));
    
    console.log(`📁 Found ${availableImages.length} available images:`);
    availableImages.forEach(img => console.log(`   • ${img.filename}`));
    
    let linkedCount = 0;
    let productsNeedingImages = 0;
    
    // Manual mapping for specific products
    const manualMappings = {
      '1a': '1a_first-light-ebook.webp',
      '1b': '1a_first-light-ebook.webp', // Same image for paperback
      '2a': '2a_risque-safety-ebook.webp',
      '2b': '2a_risque-safety-ebook.webp', // Same image for paperback
      '3a': '3a_mercury-memory-ebook.webp',
      '3b': '3a_mercury-memory-ebook.webp', // Same image for paperback
      'A2': 'A2_mesh-bodysuits.webp',
      'A8': 'A8_hats.webp',
      'B2': 'B2_Dark Streets Scent Diffusers.webp',
      'B3': 'B3_window-shades.webp',
      'B7': 'B7_mirror-charms.webp',
      'D6': 'D6_neon-light-wall-signs.webp',
      'D8': 'D8_Moonlight Noir Projection Lamps.webp',
      'E1': 'E1_Official Dark Streets Driving Playlists.webp',
      'G2': 'G2_dark-street-mug_Front.webp', // Use front view
      'A4': 'Tees-2.webp' // Dark Streeter Tees
    };
    
    // Link images to products
    for (const product of products) {
      if (product.image === "Need Image Here" && product.id) {
        productsNeedingImages++;
        
        // Check manual mapping first
        if (manualMappings[product.id]) {
          const imageFile = manualMappings[product.id];
          const imagePath = `/product-images/${imageFile}`;
          product.image = imagePath;
          console.log(`✅ Manual Link: ${product.Title} (${product.id}) -> ${imageFile}`);
          linkedCount++;
          continue;
        }
        
        // Try automatic matching
        const matchingImage = availableImages.find(img => {
          // Match by product ID
          if (img.productId === product.id) return true;
          
          // Match by product name in filename
          const productName = product.Title?.toLowerCase().replace(/[^a-z0-9]/g, '');
          return img.cleanName.includes(productName) || productName.includes(img.cleanName);
        });
        
        if (matchingImage) {
          product.image = matchingImage.path;
          console.log(`✅ Auto Link: ${product.Title} -> ${matchingImage.filename}`);
          linkedCount++;
        }
      }
    }
    
    console.log(`\n📊 COMPREHENSIVE LINKING REPORT:`);
    console.log(`Products needing images: ${productsNeedingImages}`);
    console.log(`Images linked: ${linkedCount}`);
    
    // Save updated products
    const updatedContent = `export const products = ${JSON.stringify(products, null, 2)};`;
    fs.writeFileSync('./data/products.ts', updatedContent, 'utf8');
    
    console.log('\n🎉 Comprehensive image linking completed!');
    console.log('📝 Refresh your shop page to see all the new images.');
    
  } catch (error) {
    console.error('❌ Comprehensive image linking failed:', error.message);
  }
}

// Run the comprehensive linking
comprehensiveImageLinking();
