<!-- Updated: 2025-08-30T20:54:08.115Z -->
const fs = require('fs');
const path = require('path');

// Auto-link available images to products
async function linkAvailableImages() {
  try {
    console.log('🔗 Linking Available Images to Products...\n');
    
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
        productId: file.split('_')[0] // Extract product ID from filename
      }));
    
    console.log(`📁 Found ${availableImages.length} available images:`);
    availableImages.forEach(img => console.log(`   • ${img.filename} -> ${img.path}`));
    
    let linkedCount = 0;
    let productsNeedingImages = 0;
    
    // Link images to products
    for (const product of products) {
      if (product.image === "Need Image Here") {
        productsNeedingImages++;
        
        // Try to find a matching image
        const matchingImage = availableImages.find(img => {
          // Match by product ID
          if (img.productId === product.id) return true;
          
          // Match by product name in filename
          const productName = product.Title?.toLowerCase().replace(/[^a-z0-9]/g, '');
          const imageName = img.filename.toLowerCase().replace(/[^a-z0-9]/g, '');
          return imageName.includes(productName) || productName.includes(imageName);
        });
        
        if (matchingImage) {
          product.image = matchingImage.path;
          console.log(`✅ Linked: ${product.Title} -> ${matchingImage.filename}`);
          linkedCount++;
          
          // Remove from available images to avoid duplicates
          availableImages.splice(availableImages.indexOf(matchingImage), 1);
        }
      }
    }
    
    console.log(`\n📊 LINKING REPORT:`);
    console.log(`Products needing images: ${productsNeedingImages}`);
    console.log(`Images linked: ${linkedCount}`);
    console.log(`Remaining unlinked images: ${availableImages.length}`);
    
    if (availableImages.length > 0) {
      console.log(`\n🖼️  Unlinked images (consider adding to products):`);
      availableImages.forEach(img => console.log(`   • ${img.filename}`));
    }
    
    // Save updated products
    const updatedContent = `export const products = ${JSON.stringify(products, null, 2)};`;
    fs.writeFileSync('./data/products.ts', updatedContent, 'utf8');
    
    console.log('\n🎉 Image linking completed!');
    console.log('📝 Refresh your shop page to see the new images.');
    
  } catch (error) {
    console.error('❌ Image linking failed:', error.message);
  }
}

// Run the linking
linkAvailableImages();
