const fs = require('fs');
const path = require('path');

// Simple field update - preserves images completely
async function simpleUpdate() {
  try {
    console.log('🚀 Starting Simple Field Update...\n');
    
    // Load current products (with our good image setup)
    const currentContent = fs.readFileSync('./data/products.ts', 'utf8');
    const currentMatch = currentContent.match(/export const products = (\[[\s\S]*\]);/);
    if (!currentMatch) {
      throw new Error('Could not parse current products.ts');
    }
    const currentProducts = JSON.parse(currentMatch[1]);
    
    // Load Excel data
    if (!fs.existsSync('./excel-import.json')) {
      throw new Error('Excel JSON file not found: excel-import.json');
    }
    const excelProducts = JSON.parse(fs.readFileSync('./excel-import.json', 'utf8'));
    
    console.log(`📁 Current products: ${currentProducts.length}`);
    console.log(`📊 Excel products: ${excelProducts.length}\n`);
    
    // Fields to update from Excel (NEVER touch image or Type)
    const fieldsToUpdate = ['Title', 'Author', 'SalePrice', 'OriginalPrice', 'TopSeller', 'Rating', 'Reviews', 'Category', 'PageNum', 'Description', 'Badge', 'InStock'];
    
    let updatedCount = 0;
    
    // Update each product
    for (const currentProduct of currentProducts) {
      // Skip category headers
      if (!currentProduct.Title || currentProduct.Title.trim() === "" || currentProduct.Title.length <= 2) {
        continue;
      }
      
      // Find matching Excel product
      const excelProduct = excelProducts.find(p => 
        p.id === currentProduct.id || 
        p.Title === currentProduct.Title ||
        p.SKU === currentProduct.SKU
      );
      
      if (excelProduct) {
        // Update fields from Excel (preserving image and Type)
        for (const field of fieldsToUpdate) {
          if (excelProduct[field] !== undefined && excelProduct[field] !== "") {
            currentProduct[field] = excelProduct[field];
          }
        }
        updatedCount++;
      }
    }
    
    console.log(`✅ Updated ${updatedCount} products with Excel data`);
    console.log('🖼️  All image paths and placeholders preserved');
    
    // Save updated products
    const updatedContent = `export const products = ${JSON.stringify(currentProducts, null, 2)};`;
    fs.writeFileSync('./data/products.ts', updatedContent, 'utf8');
    
    console.log('\n🎉 Simple update completed!');
    console.log('📝 Your shop page should now show:');
    console.log('   • Products with images (32)');
    console.log('   • Products with "Need Image Here" placeholders (91)');
    console.log('   • Updated prices, descriptions, etc. from Excel');
    
  } catch (error) {
    console.error('❌ Simple update failed:', error.message);
  }
}

// Run the update
simpleUpdate();
