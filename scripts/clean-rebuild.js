const fs = require('fs');

const csv = fs.readFileSync('products.csv', 'utf8');
const lines = csv.split('\n');
let products = [];

for (let i = 0; i < lines.length; i++) {
  const line = lines[i].trim();
  if (!line) continue;
  
  const parts = line.split(',');
  if (parts.length >= 3) {
    const id = parts[0];
    const title = parts[1];
    const category = parts[2];
    const author = parts[3] || 'DS LLC';
    const price = parts[4] || '24.99';
    const description = parts[5] || 'Premium product from ' + category + ' collection.';
    
    if (id && title && category && category !== '') {
      products.push({
        id,
        title,
        description,
        price: parseFloat(price.replace('$', '')),
        originalPrice: parseFloat(price.replace('$', '')) + 5,
        image: '/images/products/' + id.toLowerCase() + '.jpg',
        category,
        brand: author,
        rating: 'N/A',
        inStock: true,
        featured: false,
        tags: [category.toLowerCase()],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    }
  }
}

const tsContent = 'export const products = ' + JSON.stringify(products, null, 2) + ';';
fs.writeFileSync('data/products.ts', tsContent, 'utf8');
console.log('SUCCESS! Rebuilt products.ts with', products.length, 'products');