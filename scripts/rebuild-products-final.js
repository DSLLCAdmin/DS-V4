const fs = require('fs');
const path = require('path');

console.log('🔄 Rebuilding products.ts with proper CSV parsing...\n');

// Read the CSV file
const csvPath = path.join(__dirname, '..', 'products.csv');
const csvContent = fs.readFileSync(csvPath, 'utf8');
const lines = csvContent.split('\n');

// Parse CSV data with proper handling of commas in category names
const products = [];
const categoryHeaders = new Set();

lines.forEach((line, index) => {
  if (line.trim()) {
    // Split by comma but be careful with commas inside quotes
    const parts = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        parts.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    parts.push(current.trim());
    
    if (parts.length >= 6) {
      const id = parts[0];
      const category = parts[1];
      const title = parts[2];
      const author = parts[3];
      const price = parts[4];
      const description = parts[5];
      
      // EXCLUDE category headers (single letters, "0", or empty titles)
      if (id.match(/^[A-Z]$/) || id === '0' || !title) {
        if (category) {
          categoryHeaders.add(category);
        }
        console.log(`🚫 Excluding category header: ${id} - ${category}`);
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
      
      // Map abbreviated categories to full names
      const categoryMapping = {
        'First & Light- E-book': 'Serials/Books',
        'First & Light- Paperback': 'Serials/Books',
        'Risque & Safety- E-book': 'Serials/Books',
        'Risque & Safety- Paperback': 'Serials/Books',
        'Mercury & Memory- E-book': 'Serials/Books',
        'Mercury & Memory- Paperback': 'Serials/Books',
        'Vol-1 - E-book': 'Serials/Books',
        'Vol-1 - Paperback': 'Serials/Books',
        'Apparel & Intimate Wear': 'Apparel & Intimate Wear',
        'Auto + Mobility': 'Auto + Mobility',
        'Accessories': 'Accessories',
        'Collector & Art-Based': 'Collector & Art-Based',
        'Home, Mood, and Atmosphere': 'Home, Mood, and Atmosphere',
        'Media + Experiences': 'Media + Experiences',
        'Relationship, Erotic & Mystery-Inspired': 'Relationship, Erotic & Mystery-Inspired',
        'Digital + Curated Services': 'Digital + Curated Services',
        'Culinary & Novelty': 'Culinary & Novelty',
        'Live & Social Activation': 'Live & Social Activation'
      };
      
      const finalCategory = categoryMapping[cleanCategory] || cleanCategory;
      
      // Create product object
      const product = {
        id: id,
        Type: finalCategory,
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
      console.log(`✅ Added product: ${id} - ${cleanTitle} (${finalCategory})`);
    }
  }
});

console.log(`\n📋 Parsed ${products.length} actual products from CSV`);
console.log(`📂 Found ${categoryHeaders.size} category headers (excluded)`);

// Generate the TypeScript file content
const tsContent = `// Clean products file - Rebuilt from DS_Product-List.csv (excluding category headers)
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

console.log(`\n🎉 Total: ${products.length} products`);
