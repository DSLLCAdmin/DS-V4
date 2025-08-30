const fs = require('fs');
const path = require('path');

class FieldUpdater {
  constructor() {
    this.productsPath = path.join(__dirname, '../data/products.ts');
    this.backupPath = path.join(__dirname, '../data/products-backup-final.ts');
    this.excelPath = path.join(__dirname, '../excel-import.json');
  }

  // Backup current products.ts
  backupCurrent() {
    if (fs.existsSync(this.productsPath)) {
      fs.copyFileSync(this.productsPath, this.backupPath);
      console.log('✅ Current products.ts backed up to products-backup-final.ts');
    }
  }

  // Load current products
  loadCurrentProducts() {
    const content = fs.readFileSync(this.productsPath, 'utf8');
    const match = content.match(/export const products = (\[[\s\S]*\]);/);
    if (!match) {
      throw new Error('Could not parse current products.ts');
    }
    return JSON.parse(match[1]);
  }

  // Load Excel JSON data
  loadExcelData() {
    if (!fs.existsSync(this.excelPath)) {
      throw new Error(`Excel JSON file not found: ${this.excelPath}`);
    }
    return JSON.parse(fs.readFileSync(this.excelPath, 'utf8'));
  }

  // Update only specific fields, NEVER touch image or Type
  updateSpecificFields(currentProducts, excelProducts) {
    const updated = [];
    const fieldsToUpdate = ['Title', 'Author', 'SalePrice', 'OriginalPrice', 'TopSeller', 'Rating', 'Reviews', 'Category', 'PageNum', 'Description', 'Badge', 'InStock'];
    
    console.log(`🔄 Updating specific fields for ${excelProducts.length} products...`);

    for (const excelProduct of excelProducts) {
      // Skip category headers
      if (!excelProduct.Title || 
          excelProduct.Title.trim() === "" || 
          excelProduct.Title.length <= 2 || 
          excelProduct.Title.endsWith(':')) {
        continue;
      }

      // Find matching product in current data
      const currentProduct = currentProducts.find(p => 
        p.id === excelProduct.id || 
        p.Title === excelProduct.Title ||
        p.SKU === excelProduct.SKU
      );

      if (currentProduct) {
        // Start with current product (preserving image and Type)
        const updatedProduct = { ...currentProduct };
        
        // Update ONLY the specified fields from Excel
        for (const field of fieldsToUpdate) {
          if (excelProduct[field] !== undefined && excelProduct[field] !== "") {
            updatedProduct[field] = excelProduct[field];
          }
        }

        updated.push(updatedProduct);
        console.log(`✅ Updated fields for: ${updatedProduct.Title}`);
      } else {
        // New product - add with "Need Image Here" placeholder
        const newProduct = { ...excelProduct };
        newProduct.image = "Need Image Here";
        updated.push(newProduct);
        console.log(`🆕 Added new product: ${excelProduct.Title} (needs image)`);
      }
    }

    return updated;
  }

  // Save updated products
  saveProducts(products) {
    const content = `export const products = ${JSON.stringify(products, null, 2)};`;
    fs.writeFileSync(this.productsPath, content, 'utf8');
    console.log(`💾 Saved ${products.length} products to products.ts`);
  }

  // Generate report
  generateReport(products) {
    const report = {
      totalProducts: products.length,
      productsWithImages: products.filter(p => p.image && p.image !== "Need Image Here").length,
      productsNeedingImages: products.filter(p => p.image === "Need Image Here").length,
      productsWithoutImages: products.filter(p => !p.image || p.image === "").length
    };

    console.log('\n📊 FINAL REPORT:');
    console.log(`Total Products: ${report.totalProducts}`);
    console.log(`Products with Images: ${report.productsWithImages}`);
    console.log(`Products Needing Images: ${report.productsNeedingImages}`);
    console.log(`Products without Images: ${report.productsWithoutImages}`);

    return report;
  }

  // Run the update
  async run() {
    try {
      console.log('🚀 Starting Specific Field Update...\n');
      
      // Step 1: Backup
      this.backupCurrent();
      
      // Step 2: Load data
      const currentProducts = this.loadCurrentProducts();
      const excelProducts = this.loadExcelData();
      
      console.log(`📁 Current products: ${currentProducts.length}`);
      console.log(`📊 Excel products: ${excelProducts.length}\n`);
      
      // Step 3: Update specific fields
      const updatedProducts = this.updateSpecificFields(currentProducts, excelProducts);
      
      // Step 4: Generate report
      const report = this.generateReport(updatedProducts);
      
      // Step 5: Save
      this.saveProducts(updatedProducts);
      
      console.log('\n🎉 Field update completed successfully!');
      console.log('📝 Your shop page should now show images and updated product info.');
      
    } catch (error) {
      console.error('❌ Field update failed:', error.message);
      console.log('\n💡 Make sure you have:');
      console.log('   1. Excel data exported as JSON to excel-import.json');
      console.log('   2. Current products.ts is valid');
      console.log('   3. Run: npm run update:fields');
    }
  }
}

// Run if called directly
if (require.main === module) {
  const updater = new FieldUpdater();
  updater.run();
}

module.exports = FieldUpdater;
