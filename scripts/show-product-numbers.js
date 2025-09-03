const fs = require('fs');
const path = require('path');

function showCurrentProductNumbers() {
  console.log('📋 Current Product Numbering System\n');
  
  // Read local products
  const productsPath = path.join(__dirname, '..', 'data', 'products.ts');
  const productsContent = fs.readFileSync(productsPath, 'utf8');
  
  // Extract product information
  const productRegex = /"id":\s*["`]?([^"`,]+)["`]?.*?"Title":\s*["`]([^"`]+)["`]/gs;
  const products = [];
  let match;
  
  while ((match = productRegex.exec(productsContent)) !== null) {
    products.push({
      name: match[2],
      id: match[1]
    });
  }
  
  // Sort by ID (handle both string and numeric IDs)
  products.sort((a, b) => {
    const aNum = parseInt(a.id) || 0;
    const bNum = parseInt(b.id) || 0;
    if (aNum === bNum) {
      return a.id.localeCompare(b.id);
    }
    return aNum - bNum;
  });
  
  console.log('📊 Current Local Product IDs:');
  console.log('─'.repeat(60));
  console.log('ID\t\tProduct Name');
  console.log('─'.repeat(60));
  
  products.forEach(product => {
    console.log(`${product.id}\t\t${product.name}`);
  });
  
  console.log('─'.repeat(60));
  console.log(`Total Products: ${products.length}`);
  
  // Show ID ranges
  if (products.length > 0) {
    const numericIds = products.map(p => parseInt(p.id)).filter(id => !isNaN(id));
    if (numericIds.length > 0) {
      const minId = Math.min(...numericIds);
      const maxId = Math.max(...numericIds);
      console.log(`Numeric ID Range: ${minId} - ${maxId}`);
    }
    console.log(`String IDs: ${products.filter(p => isNaN(parseInt(p.id))).length} products`);
  }
  
  console.log('\n💡 After running the update script, these IDs will be replaced with Shopify IDs');
  console.log('   This will create a unified numbering system across your entire business');
}

showCurrentProductNumbers();
