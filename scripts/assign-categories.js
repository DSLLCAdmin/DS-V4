const fs = require('fs');
const path = require('path');

// Read the products file
const productsPath = path.join(__dirname, '..', 'data', 'products.ts');
let productsContent = fs.readFileSync(productsPath, 'utf8');

// Category mapping based on product content
const categoryMapping = {
  // Apparel & Intimate Wear
  'Apparel & Intimate Wear': [
    'Panties', 'Bodysuits', 'Tees', 'Hats', 'Jackets', 'Shirts', 'Pants', 'Shorts', 
    'Dresses', 'Skirts', 'Underwear', 'Lingerie', 'Clothing', 'Wear', 'Apparel'
  ],
  
  // Auto + Mobility
  'Auto + Mobility': [
    'LED', 'Underlighting', 'Car', 'Vehicle', 'Auto', 'Mobility', 'Lighting', 'Kits',
    'Automotive', 'Vehicle', 'Car Accessories', 'Auto Parts'
  ],
  
  // Accessories
  'Accessories': [
    'Charms', 'Mirror', 'Beads', 'Feathers', 'Jewelry', 'Bracelets', 'Necklaces',
    'Rings', 'Earrings', 'Accessories', 'Decorative', 'Ornaments'
  ],
  
  // Home, Mood, and Atmosphere
  'Home, Mood, and Atmosphere': [
    'Diffusers', 'Scent', 'Candles', 'Lamps', 'Lighting', 'Wall Signs', 'Neon',
    'Home Decor', 'Atmosphere', 'Mood', 'Ambiance', 'Interior', 'Decor'
  ],
  
  // Media + Experiences
  'Media + Experiences': [
    'Photo', 'Filters', 'Stickers', 'Digital', 'Media', 'Experiences', 'Virtual',
    'Augmented', 'AR', 'VR', 'Digital Content', 'Online'
  ],
  
  // Digital + Curated Services
  'Digital + Curated Services': [
    'Services', 'Curated', 'Digital', 'Online', 'Subscription', 'Membership',
    'Premium', 'Exclusive', 'VIP', 'Custom'
  ],
  
  // Culinary & Novelty
  'Culinary & Novelty': [
    'Mugs', 'Cups', 'Drinkware', 'Kitchen', 'Culinary', 'Food', 'Beverage',
    'Novelty', 'Gift', 'Kitchenware', 'Dining'
  ],
  
  // Collector & Art-Based
  'Collector & Art-Based': [
    'Collector', 'Art', 'Limited', 'Edition', 'Rare', 'Vintage', 'Antique',
    'Collectible', 'Artwork', 'Gallery', 'Museum'
  ],
  
  // Live & Social Activation
  'Live & Social Activation': [
    'Live', 'Social', 'Activation', 'Event', 'Meetup', 'Gathering', 'Party',
    'Social', 'Community', 'Group', 'Network'
  ],
  
  // Relationship, Erotic & Mystery-Inspired
  'Relationship, Erotic & Mystery-Inspired': [
    'Erotic', 'Mystery', 'Relationship', 'Intimate', 'Romance', 'Love',
    'Passion', 'Desire', 'Mysterious', 'Secret'
  ]
};

// Function to determine category based on title and description
function determineCategory(title, description) {
  const searchText = `${title} ${description}`.toLowerCase();
  
  for (const [category, keywords] of Object.entries(categoryMapping)) {
    for (const keyword of keywords) {
      if (searchText.includes(keyword.toLowerCase())) {
        return category;
      }
    }
  }
  
  // Default fallback
  return 'Accessories';
}

// Parse the products array
const productsMatch = productsContent.match(/export const products = (\[[\s\S]*\]);/);
if (!productsMatch) {
  console.error('Could not find products array');
  process.exit(1);
}

let products;
try {
  // Extract the array content and evaluate it
  const arrayContent = productsMatch[1];
  products = eval(arrayContent);
} catch (error) {
  console.error('Error parsing products array:', error.message);
  process.exit(1);
}

console.log(`Found ${products.length} products`);
console.log('Assigning categories...\n');

let updatedCount = 0;

// Update products with empty Type fields
products.forEach((product, index) => {
  if (!product.Type || product.Type.trim() === '') {
    const category = determineCategory(product.Title || '', product.Description || '');
    product.Type = category;
    updatedCount++;
    console.log(`${index + 1}. "${product.Title}" → ${category}`);
  }
});

console.log(`\nUpdated ${updatedCount} products with categories`);

// Convert back to string
const updatedArrayContent = 'export const products = ' + JSON.stringify(products, null, 2) + ';';

// Write back to file
fs.writeFileSync(productsPath, updatedArrayContent, 'utf8');

console.log('\n✅ Categories assigned successfully!');
console.log('📁 File updated: data/products.ts');
console.log('🚀 Ready to test on live site!');
