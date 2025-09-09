const fs = require('fs');
const path = require('path');

console.log('🧹 Creating TRULY clean products file...\n');

// Read the current products file
const productsPath = path.join(__dirname, '..', 'data', 'products.ts');
let productsContent = fs.readFileSync(productsPath, 'utf8');

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

console.log(`📊 Processing ${products.length} products...`);

// Clean each product completely
products.forEach((product, index) => {
  // Clean Title
  if (product.Title) {
    product.Title = product.Title
      .replace(/[?∩┐╜]/g, '')
      .replace(/^[?]+/, '') // Remove leading ? characters
      .trim();
  }
  
  // Clean Description
  if (product.Description) {
    product.Description = product.Description
      .replace(/[?∩┐╜]/g, '')
      .replace(/Risqu & Safety/g, 'Risqué & Safety')
      .replace(/graffitti/g, 'graffiti')
      .replace(/Still Thinking\? &/g, '"Still Thinking?" &')
      .replace(/◆/g, '') // Remove diamond characters
      .trim();
  }
  
  // Fix empty Type fields with proper categories
  if (!product.Type || product.Type.trim() === '') {
    const title = (product.Title || '').toLowerCase();
    const desc = (product.Description || '').toLowerCase();
    
    if (title.includes('book') || title.includes('ebook') || title.includes('paperback') || 
        title.includes('first & light') || title.includes('risqué') || title.includes('mercury') || 
        title.includes('vol-1')) {
      product.Type = 'Serials/Books';
    } else if (title.includes('panties') || title.includes('bodysuit') || title.includes('jacket') || 
               title.includes('tees') || title.includes('hats') || title.includes('dress')) {
      product.Type = 'Apparel & Intimate Wear';
    } else if (title.includes('led') || title.includes('car') || title.includes('auto') || 
               title.includes('vehicle') || title.includes('underlighting')) {
      product.Type = 'Auto + Mobility';
    } else if (title.includes('charm') || title.includes('jewelry') || title.includes('accessory') || 
               title.includes('mirror') || title.includes('bead')) {
      product.Type = 'Accessories';
    } else if (title.includes('candle') || title.includes('diffuser') || title.includes('scent') || 
               title.includes('lamp') || title.includes('wall') || title.includes('neon')) {
      product.Type = 'Home, Mood, and Atmosphere';
    } else if (title.includes('digital') || title.includes('media') || title.includes('audio') || 
               title.includes('video') || title.includes('photo') || title.includes('filter')) {
      product.Type = 'Media + Experiences';
    } else if (title.includes('social') || title.includes('community') || title.includes('activation') || 
               title.includes('meetup') || title.includes('group')) {
      product.Type = 'Live & Social Activation';
    } else if (title.includes('mug') || title.includes('beverage') || title.includes('culinary') || 
               title.includes('food') || title.includes('drink')) {
      product.Type = 'Culinary & Novelty';
    } else if (title.includes('collector') || title.includes('art') || title.includes('limited') || 
               title.includes('edition') || title.includes('rare')) {
      product.Type = 'Collector & Art-Based';
    } else if (title.includes('erotic') || title.includes('mystery') || title.includes('relationship') || 
               title.includes('intimate') || title.includes('romance')) {
      product.Type = 'Relationship, Erotic & Mystery-Inspired';
    } else {
      product.Type = 'Accessories'; // Default fallback
    }
  }
  
  // Log progress for first 10 products
  if (index < 10) {
    console.log(`${index + 1}. "${product.Title}" → ${product.Type}`);
  }
});

// Create completely clean TypeScript file
const cleanContent = `export const products = ${JSON.stringify(products, null, 2)};
`;

// Write the clean file
fs.writeFileSync(productsPath, cleanContent, 'utf8');

console.log(`\n✅ Created TRULY clean products file!`);
console.log(`📊 Products processed: ${products.length}`);
console.log(`📁 File updated: data/products.ts`);

// Verify no encoding issues remain
const finalContent = fs.readFileSync(productsPath, 'utf8');
const remainingIssues = finalContent.match(/[?∩┐╜]/g);
if (remainingIssues) {
  console.log(`⚠️  WARNING: ${remainingIssues.length} encoding issues still remain`);
} else {
  console.log(`✅ ALL encoding issues eliminated!`);
}

// Check category distribution
const categoryCount = {};
products.forEach(p => {
  if (p.Type) {
    categoryCount[p.Type] = (categoryCount[p.Type] || 0) + 1;
  }
});

console.log('\n📊 Category Distribution:');
Object.entries(categoryCount).forEach(([category, count]) => {
  console.log(`  ${category}: ${count} products`);
});
