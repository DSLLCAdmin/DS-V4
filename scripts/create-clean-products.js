const fs = require('fs');
const path = require('path');

// Read the products file
const productsPath = path.join(__dirname, '..', 'data', 'products.ts');
let productsContent = fs.readFileSync(productsPath, 'utf8');

console.log('🧹 Creating clean, syntax-safe products file...\n');

// Extract the products array
const productsMatch = productsContent.match(/export const products = (\[[\s\S]*\]);/);
if (!productsMatch) {
  console.error('Could not find products array');
  process.exit(1);
}

let products;
try {
  products = eval(productsMatch[1]);
} catch (error) {
  console.error('Error parsing products:', error.message);
  process.exit(1);
}

// Clean up common syntax issues
products.forEach((product, index) => {
  // Fix common quote issues
  if (product.Title) {
    product.Title = product.Title.replace(/[?∩┐╜]/g, '').trim();
  }
  if (product.Description) {
    product.Description = product.Description
      .replace(/[?∩┐╜]/g, '')
      .replace(/Risqu & Safety/g, 'Risqué & Safety')
      .replace(/graffitti/g, 'graffiti')
      .replace(/Still Thinking\? &/g, '"Still Thinking?" &')
      .trim();
  }
  
  // Ensure proper category assignments
  if (!product.Type || product.Type.trim() === '') {
    // Assign default categories based on content
    const title = (product.Title || '').toLowerCase();
    const desc = (product.Description || '').toLowerCase();
    
    if (title.includes('book') || title.includes('ebook') || title.includes('paperback')) {
      product.Type = 'Serials/Books';
    } else if (title.includes('panties') || title.includes('bodysuit') || title.includes('jacket')) {
      product.Type = 'Apparel & Intimate Wear';
    } else if (title.includes('social') || title.includes('community') || title.includes('activation')) {
      product.Type = 'Live & Social Activation';
    } else {
      product.Type = 'Accessories'; // Default fallback
    }
  }
});

// Create clean TypeScript file
const cleanContent = `export const products = ${JSON.stringify(products, null, 2)};
`;

// Write clean file
const cleanPath = path.join(__dirname, '..', 'data', 'products-clean.ts');
fs.writeFileSync(cleanPath, cleanContent, 'utf8');

console.log('✅ Created clean products file: data/products-clean.ts');
console.log('📊 Products processed:', products.length);
console.log('🔧 All syntax issues fixed');
console.log('📁 Ready for safe editing!');
