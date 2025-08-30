<!-- Updated: 2025-08-30T20:54:08.122Z -->
const fs = require('fs');
const path = require('path');

class SmartMergerV2 {
  constructor() {
    this.productsPath = path.join(__dirname, '../data/products.ts');
    this.backupPath = path.join(__dirname, '../data/products-backup-v2.ts');
    this.excelPath = path.join(__dirname, '../excel-import.json');
  }

  // Backup current products.ts
  backupCurrent() {
    if (fs.existsSync(this.productsPath)) {
      fs.copyFileSync(this.productsPath, this.backupPath);
      console.log('✅ Current products.ts backed up to products-backup-v2.ts');
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

  // Smart merge: update fields but preserve our fixes
  smartMerge(currentProducts, excelProducts) {
    const merged = [];
    
    console.log(`🔄 Merging ${excelProducts.length} products...`);

    for (const excelProduct of excelProducts) {
      // Skip category headers (empty titles or single letters with colons)
      if (!excelProduct.Title || 
          excelProduct.Title.trim() === "" || 
          excelProduct.Title.length <= 2 || 
          excelProduct.Title.endsWith(':')) {
        console.log(`⏭️  Skipping category header: ${excelProduct.Title || 'empty'}`);
        continue;
      }

      // Find matching product in current data
      const currentProduct = currentProducts.find(p => 
        p.id === excelProduct.id || 
        p.Title === excelProduct.Title ||
        p.SKU === excelProduct.SKU
      );

      if (currentProduct) {
        // Merge: keep our critical fixes, update other fields
        const mergedProduct = { ...currentProduct };
        
        // CRITICAL: NEVER overwrite these fields
        const preservedFields = ['image', 'Type'];
        
        // Update fields from Excel EXCEPT preserved ones
        for (const [key, value] of Object.entries(excelProduct)) {
          if (!preservedFields.includes(key)) {
            mergedProduct[key] = value;
          }
        }

        // CRITICAL: Always preserve our image fixes
        if (currentProduct.image === "Need Image Here") {
          mergedProduct.image = "Need Image Here";
          console.log(`🖼️  Preserved placeholder for: ${mergedProduct.Title}`);
        } else if (currentProduct.image && currentProduct.image.startsWith('/')) {
          mergedProduct.image = currentProduct.image;
          console.log(`🖼️  Preserved image path for: ${mergedProduct.Title}`);
        }

        merged.push(mergedProduct);
        console.log(`✅ Merged: ${mergedProduct.Title}`);
      } else {
        // New product from Excel - add with default image placeholder
        const newProduct = { ...excelProduct };
        newProduct.image = "Need Image Here";
        merged.push(newProduct);
        console.log(`🆕 New product added: ${excelProduct.Title} (needs image)`);
      }
    }

    return merged;
  }

  // Save merged products
  saveProducts(products) {
    const content = `export const products = ${JSON.stringify(products, null, 2)};`;
    fs.writeFileSync(this.productsPath, content, 'utf8');
    console.log(`💾 Saved ${products.length} products to products.ts`);
  }

  // Generate merge report
  generateReport(currentProducts, mergedProducts) {
    const report = {
      totalProducts: mergedProducts.length,
      productsWithImages: mergedProducts.filter(p => p.image && p.image !== "Need Image Here").length,
      productsNeedingImages: mergedProducts.filter(p => p.image === "Need Image Here").length,
      productsWithoutImages: mergedProducts.filter(p => !p.image || p.image === "").length,
      criticalIssues: []
    };

    // Check for critical issues
    mergedProducts.forEach(product => {
      if (!product.Title || product.Title.trim() === "") {
        report.criticalIssues.push(`Product ${product.id} has empty title`);
      }
      if (product.image && !product.image.startsWith('/') && product.image !== "Need Image Here") {
        report.criticalIssues.push(`Product ${product.Title} has invalid image path: ${product.image}`);
      }
    });

    console.log('\n📊 MERGE REPORT:');
    console.log(`Total Products: ${report.totalProducts}`);
    console.log(`Products with Images: ${report.productsWithImages}`);
    console.log(`Products Needing Images: ${report.productsNeedingImages}`);
    console.log(`Products without Images: ${report.productsWithoutImages}`);
    
    if (report.criticalIssues.length > 0) {
      console.log('\n⚠️  CRITICAL ISSUES:');
      report.criticalIssues.forEach(issue => console.log(`  - ${issue}`));
    }

    return report;
  }

  // Run the smart merge
  async run() {
    try {
      console.log('🚀 Starting Smart Merge V2...\n');
      
      // Step 1: Backup
      this.backupCurrent();
      
      // Step 2: Load data
      const currentProducts = this.loadCurrentProducts();
      const excelProducts = this.loadExcelData();
      
      console.log(`📁 Current products: ${currentProducts.length}`);
      console.log(`📊 Excel products: ${excelProducts.length}\n`);
      
      // Step 3: Smart merge
      const mergedProducts = this.smartMerge(currentProducts, excelProducts);
      
      // Step 4: Generate report
      const report = this.generateReport(currentProducts, mergedProducts);
      
      // Step 5: Save
      this.saveProducts(mergedProducts);
      
      console.log('\n🎉 Smart merge V2 completed successfully!');
      console.log('📝 Review the report above and check your shop page.');
      
      if (report.criticalIssues.length > 0) {
        console.log('\n⚠️  Please fix critical issues before testing.');
      }
      
    } catch (error) {
      console.error('❌ Smart merge V2 failed:', error.message);
      console.log('\n💡 Make sure you have:');
      console.log('   1. Excel data exported as JSON to excel-import.json');
      console.log('   2. Current products.ts is valid');
      console.log('   3. Run: npm run merge:products:v2');
    }
  }
}

// Run if called directly
if (require.main === module) {
  const merger = new SmartMergerV2();
  merger.run();
}

module.exports = SmartMergerV2;
