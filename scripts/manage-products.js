const fs = require('fs');
const path = require('path');

class ProductManager {
  constructor() {
    this.productsPath = path.join(__dirname, '..', 'data', 'products.ts');
    this.imagesDir = path.join(__dirname, '..', 'public', 'product-images');
    this.archiveDir = path.join(__dirname, '..', 'public', 'Archive-Images');
  }

  // Get all products from data file
  getProducts() {
    const content = fs.readFileSync(this.productsPath, 'utf8');
    // Extract products array using regex (simplified approach)
    const productsMatch = content.match(/export const products = (\[[\s\S]*\]);/);
    if (productsMatch) {
      try {
        // Remove the export const products = part and evaluate
        const productsStr = productsMatch[1];
        return eval(productsStr);
      } catch (e) {
        console.error('Error parsing products:', e);
        return [];
      }
    }
    return [];
  }

  // Get all available image files
  getAvailableImages() {
    const images = [];
    
    // Check product-images directory
    if (fs.existsSync(this.imagesDir)) {
      const files = fs.readdirSync(this.imagesDir);
      files.forEach(file => {
        if (file.match(/\.(webp|jpg|jpeg|png|gif)$/i)) {
          images.push(`/product-images/${file}`);
        }
      });
    }

    // Check Archive-Images directory
    if (fs.existsSync(this.archiveDir)) {
      const files = fs.readdirSync(this.archiveDir);
      files.forEach(file => {
        if (file.match(/\.(webp|jpg|jpeg|png|gif)$/i)) {
          images.push(`/Archive-Images/${file}`);
        }
      });
    }

    return images;
  }

  // Find products that need images
  findProductsNeedingImages() {
    const products = this.getProducts();
    return products.filter(product => 
      !product.image || 
      product.image === "Need Image Here" || 
      product.image === ""
    );
  }

  // Find products with broken image paths
  findProductsWithBrokenImages() {
    const products = this.getProducts();
    const availableImages = this.getAvailableImages();
    
    return products.filter(product => {
      if (!product.image || product.image === "Need Image Here") return false;
      
      // Check if image file exists
      const imagePath = path.join(__dirname, '..', 'public', product.image.substring(1));
      return !fs.existsSync(imagePath);
    });
  }

  // Generate a report of all image issues
  generateImageReport() {
    console.log('🔍 PRODUCT IMAGE ANALYSIS REPORT');
    console.log('=====================================\n');

    const products = this.getProducts();
    const availableImages = this.getAvailableImages();
    const needsImages = this.findProductsNeedingImages();
    const brokenImages = this.findProductsWithBrokenImages();

    console.log(`📊 Total Products: ${products.length}`);
    console.log(`🖼️  Available Images: ${availableImages.length}`);
    console.log(`❌ Products Needing Images: ${needsImages.length}`);
    console.log(`🔗 Products with Broken Image Links: ${brokenImages.length}\n`);

    if (needsImages.length > 0) {
      console.log('📋 PRODUCTS NEEDING IMAGES:');
      console.log('----------------------------');
      needsImages.forEach(product => {
        console.log(`  • ${product.id}: ${product.Title} (${product.Type || 'No Type'})`);
      });
      console.log('');
    }

    if (brokenImages.length > 0) {
      console.log('🔗 PRODUCTS WITH BROKEN IMAGE LINKS:');
      console.log('-------------------------------------');
      brokenImages.forEach(product => {
        console.log(`  • ${product.id}: ${product.Title} - ${product.image}`);
      });
      console.log('');
    }

    console.log('💡 RECOMMENDATIONS:');
    console.log('-------------------');
    if (needsImages.length > 0) {
      console.log(`  1. Create ${needsImages.length} new product images`);
      console.log('  2. Use consistent naming: [ProductID]_[ProductName].[ext]');
      console.log('  3. Save as .webp for best performance');
    }
    if (brokenImages.length > 0) {
      console.log('  4. Fix broken image paths or replace missing files');
    }
    console.log('  5. Consider using an image optimization pipeline');
  }

  // Auto-assign placeholder images based on product type
  autoAssignPlaceholders() {
    const products = this.getProducts();
    let updated = false;

    const typeImageMap = {
      'Serials/Books': '/Archive-Images/1a_first-light-ebook.jpg',
      'Apparel & Intimate Wear': '/Archive-Images/A2_mesh-bodysuits.png',
      'Auto + Mobility': '/Archive-Images/A8_hats.png',
      'Home, Mood, and Atmosphere': '/Archive-Images/A8_hats.png'
    };

    products.forEach(product => {
      if (!product.image || product.image === "") {
        const type = product.Type || '';
        const placeholder = typeImageMap[type] || 'Need Image Here';
        
        if (placeholder !== 'Need Image Here') {
          product.image = placeholder;
          updated = true;
          console.log(`✅ Assigned placeholder to ${product.id}: ${product.Title}`);
        }
      }
    });

    if (updated) {
      this.saveProducts(products);
      console.log('\n🔄 Products updated with placeholder images');
    } else {
      console.log('✨ All products already have images or placeholders');
    }
  }

  // Save products back to file
  saveProducts(products) {
    const content = `export const products = ${JSON.stringify(products, null, 2)};`;
    fs.writeFileSync(this.productsPath, content, 'utf8');
  }

  // Interactive menu for common operations
  showMenu() {
    console.log('\n🛠️  PRODUCT MANAGEMENT TOOLS');
    console.log('==============================');
    console.log('1. Generate Image Report');
    console.log('2. Auto-assign Placeholder Images');
    console.log('3. Find Products Needing Images');
    console.log('4. Find Broken Image Links');
    console.log('5. List Available Images');
    console.log('6. Exit');
    console.log('\nEnter your choice (1-6):');
  }
}

// CLI interface
if (require.main === module) {
  const manager = new ProductManager();
  
  const choice = process.argv[2];
  
  switch (choice) {
    case 'report':
      manager.generateImageReport();
      break;
    case 'placeholders':
      manager.autoAssignPlaceholders();
      break;
    case 'needs-images':
      const needsImages = manager.findProductsNeedingImages();
      console.log('📋 Products needing images:', needsImages.length);
      needsImages.forEach(p => console.log(`  • ${p.id}: ${p.Title}`));
      break;
    case 'broken':
      const broken = manager.findProductsWithBrokenImages();
      console.log('🔗 Products with broken images:', broken.length);
      broken.forEach(p => console.log(`  • ${p.id}: ${p.Title} - ${p.image}`));
      break;
    case 'images':
      const images = manager.getAvailableImages();
      console.log('🖼️  Available images:', images.length);
      images.forEach(img => console.log(`  • ${img}`));
      break;
    default:
      console.log('Usage: node manage-products.js [command]');
      console.log('Commands: report, placeholders, needs-images, broken, images');
      break;
  }
}

module.exports = ProductManager;
