const fs = require('fs');

const csv = fs.readFileSync('products.csv', 'utf8');
const lines = csv.split('\n');
let products = [];
let count = 0;

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
      const product = {
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
      };
      
      products.push(product);
      count++;
      console.log('Added:', id, '-', title, '->', category);
    }
  }
}

let tsContent = 'export const products = [\n';
products.forEach(product => {
  tsContent += '  {\n';
  tsContent += '    id: "' + product.id + '",\n';
  tsContent += '    title: "' + product.title + '",\n';
  tsContent += '    description: "' + product.description + '",\n';
  tsContent += '    price: ' + product.price + ',\n';
  tsContent += '    originalPrice: ' + product.originalPrice + ',\n';
  tsContent += '    image: "' + product.image + '",\n';
  tsContent += '    category: "' + product.category + '",\n';
  tsContent += '    brand: "' + product.brand + '",\n';
  tsContent += '    rating: "' + product.rating + '",\n';
  tsContent += '    inStock: ' + product.inStock + ',\n';
  tsContent += '    featured: ' + product.featured + ',\n';
  tsContent += '    tags: ["' + product.tags.join('", "') + '"],\n';
  tsContent += '    createdAt: "' + product.createdAt + '",\n';
  tsContent += '    updatedAt: "' + product.updatedAt + '"\n';
  tsContent += '  },\n';
});
tsContent += '];\n';
tsContent += '\n// Total products: ' + count + '\n';

fs.writeFileSync('data/products.ts', tsContent, 'utf8');
console.log('SUCCESS! Converted CSV to TypeScript with', count, 'products');
