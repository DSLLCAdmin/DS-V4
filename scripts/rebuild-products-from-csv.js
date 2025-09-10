const fs = require('fs');
const path = require('path');

console.log('🔄 Rebuilding products.ts from CSV source of truth...\n');

// Read the CSV file
const csvPath = path.join(__dirname, '..', 'products.csv');
const csvContent = fs.readFileSync(csvPath, 'utf8');
const lines = csvContent.split('\n');

// Parse CSV data
const products = [];
const categoryHeaders = new Set();

lines.forEach((line, index) => {
  if (line.trim()) {
    const parts = line.split(',');
    if (parts.length >= 6) {
      const id = parts[0].trim();
      const category = parts[1].trim();
      const title = parts[2].trim();
      const author = parts[3].trim();
      const price = parts[4].trim();
      const description = parts[5].trim();
      
      // Skip category headers (single letters or numbers)
      if (id.match(/^[A-Z]$/) || id === '0') {
        categoryHeaders.add(category);
        return;
      }
      
      // Skip empty entries
      if (!id || !title) {
        return;
      }
      
      // Clean up the data
      const cleanTitle = title.replace(/[∩┐╜]/g, '').trim();
      const cleanDescription = description.replace(/[∩┐╜]/g, '').trim();
      const cleanAuthor = author.replace(/[∩┐╜]/g, '').trim();
      const cleanCategory = category.replace(/[∩┐╜]/g, '').trim();
      
      // Generate a clean ID if needed
      let cleanId = id;
      if (!cleanId || cleanId === '0') {
        cleanId = `product_${products.length + 1}`;
      }
      
      // Create product object
      const product = {
        id: cleanId,
        Type: cleanCategory,
        Title: cleanTitle,
        Author: cleanAuthor || "DS LLC",
        SalePrice: price || "$24.99",
        OriginalPrice: price ? `$${(parseFloat(price.replace('$', '')) + 5).toFixed(2)}` : "$29.99",
        TopSeller: null,
        Rating: null,
        Reviews: null,
        Category: "0",
        PageNum: null,
        Description: cleanDescription,
        Badge: "",
        InStock: null,
        image: ""
      };
      
      products.push(product);
    }
  }
});

console.log(`📋 Parsed ${products.length} products from CSV`);
console.log(`📂 Found ${categoryHeaders.size} category headers`);

// Generate the TypeScript file content
const tsContent = `// Clean products file - Rebuilt from DS_Product-List.csv
export const products = [
${products.map(product => `  {
    "id": "${product.id}",
    "Type": "${product.Type}",
    "Title": "${product.Title}",
    "Author": "${product.Author}",
    "SalePrice": "${product.SalePrice}",
    "OriginalPrice": "${product.OriginalPrice}",
    "TopSeller": ${product.TopSeller},
    "Rating": ${product.Rating},
    "Reviews": ${product.Reviews},
    "Category": "${product.Category}",
    "PageNum": ${product.PageNum},
    "Description": "${product.Description}",
    "Badge": "${product.Badge}",
    "InStock": ${product.InStock},
    "image": "${product.image}"
  }`).join(',\n')}
];`;

// Write the new products.ts file
const productsPath = path.join(__dirname, '..', 'data', 'products.ts');
fs.writeFileSync(productsPath, tsContent, 'utf8');

console.log('✅ products.ts rebuilt successfully!');

// Show category distribution
const categoryCounts = {};
products.forEach(product => {
  categoryCounts[product.Type] = (categoryCounts[product.Type] || 0) + 1;
});

console.log('\n📊 Category distribution:');
Object.entries(categoryCounts).forEach(([category, count]) => {
  console.log(`  ${category}: ${count} products`);
});

console.log('\n🎉 All products restored from CSV source of truth!');
