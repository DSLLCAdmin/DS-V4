/**
 * PRODUCT UPLOAD ASSISTANT
 * Helps add new products to DSLLC website
 * Follows DSLLC Operations SOP Guide standards
 */

const fs = require('fs');
const path = require('path');

const PRODUCTS_FILE = path.join(__dirname, '..', 'data', 'products.ts');

// Product ID conventions
const CATEGORY_PREFIXES = {
  'A': 'Serials/Books',
  'T': 'Apparel (T-Shirts)',
  'B': 'Accessories (Caps, etc.)',
  'H': 'Home/Culinary items',
  'M': 'Vehicle Accessories (Magnets)',
  'C': 'Accessories',
  'D': 'Accessories',
  'E': 'Accessories',
  'F': 'Accessories',
  'G': 'Accessories',
  'I': 'Accessories',
  'J': 'Accessories',
  'K': 'Accessories'
};

function getCurrentProductIds() {
  const content = fs.readFileSync(PRODUCTS_FILE, 'utf8');
  const idMatches = content.match(/"id":\s*"([A-Z]-\d+)"/g);
  
  if (!idMatches) return {};
  
  const categories = {};
  idMatches.forEach(match => {
    const id = match.match(/"([A-Z]-\d+)"/)[1];
    const [prefix, number] = id.split('-');
    const num = parseInt(number);
    if (!categories[prefix] || categories[prefix] < num) {
      categories[prefix] = num;
    }
  });
  
  return categories;
}

function getNextProductId(categoryPrefix) {
  const currentIds = getCurrentProductIds();
  const currentMax = currentIds[categoryPrefix] || 0;
  const nextNum = currentMax + 1;
  return `${categoryPrefix}-${String(nextNum).padStart(2, '0')}`;
}

function showCurrentStatus() {
  console.log('\n📊 CURRENT PRODUCT ID STATUS\n');
  console.log('='.repeat(70));
  
  const currentIds = getCurrentProductIds();
  const sortedCategories = Object.keys(currentIds).sort();
  
  sortedCategories.forEach(prefix => {
    const maxId = currentIds[prefix];
    const nextId = getNextProductId(prefix);
    const categoryName = CATEGORY_PREFIXES[prefix] || 'Unknown';
    console.log(`  ${prefix}-XX: ${categoryName}`);
    console.log(`    Last used: ${prefix}-${String(maxId).padStart(2, '0')}`);
    console.log(`    Next available: ${nextId}`);
    console.log('');
  });
  
  console.log('='.repeat(70));
}

function generateProductTemplate(productData) {
  const {
    id,
    category,
    title,
    author = 'DS LLC',
    price,
    description,
    longDescription = '',
    image,
    inStock = true,
    badge,
    shopifyVariantId,
    printfulVariantId,
    fulfillmentProvider = 'printful',
    requiresShipping = true,
    kdpASIN,
    kdpType,
    variants
  } = productData;

  let template = `  {
    "id": "${id}",
    "category": "${category}",
    "title": "${title}",
    "author": "${author}",
    "price": ${price}`;

  if (description) {
    template += `,
    "description": "${description.replace(/"/g, '\\"')}"`;
  }

  if (longDescription) {
    template += `,
    "longDescription": "${longDescription.replace(/"/g, '\\"').replace(/\r?\n/g, '\\r')}"`;
  }

  template += `,
    "image": "${image}",
    "inStock": ${inStock}`;

  if (badge) {
    template += `,
    "badge": "${badge}"`;
  }

  if (variants && variants.length > 0) {
    template += `,
    "variants": [`;
    variants.forEach((variant, index) => {
      if (index > 0) template += ',';
      template += `
      {
        "size": "${variant.size || 'Default'}",
        "price": ${variant.price},
        "shopifyVariantId": ${variant.shopifyVariantId}`;
      if (variant.printfulVariantId) {
        template += `,
        "printfulVariantId": "${variant.printfulVariantId}"`;
      }
      template += `,
        "inStock": ${variant.inStock !== undefined ? variant.inStock : true}`;
      if (variant.imageSetKey) {
        template += `,
        "imageSetKey": "${variant.imageSetKey}"`;
      }
      template += `
      }`;
    });
    template += `
    ]`;
  } else if (shopifyVariantId) {
    template += `,
    "shopifyVariantId": ${shopifyVariantId}`;
  }

  if (printfulVariantId) {
    template += `,
    "printfulVariantId": "${printfulVariantId}"`;
  }

  template += `,
    "fulfillmentProvider": "${fulfillmentProvider}",
    "requiresShipping": ${requiresShipping}`;

  if (kdpASIN) {
    template += `,
    "kdpASIN": "${kdpASIN}",
    "kdpType": "${kdpType}"`;
  }

  template += `
  }`;

  return template;
}

function addProductToFile(productData) {
  const content = fs.readFileSync(PRODUCTS_FILE, 'utf8');
  
  // Find the closing bracket of the products array
  const lastBracketIndex = content.lastIndexOf(']');
  if (lastBracketIndex === -1) {
    throw new Error('Could not find products array closing bracket');
  }
  
  // Insert new product before the closing bracket
  const beforeBracket = content.substring(0, lastBracketIndex);
  const afterBracket = content.substring(lastBracketIndex);
  
  // Add comma if there are existing products
  const needsComma = beforeBracket.trim().endsWith('}');
  const productTemplate = generateProductTemplate(productData);
  const newContent = beforeBracket + (needsComma ? ',\n' : '') + productTemplate + '\n' + afterBracket;
  
  // Write back to file
  fs.writeFileSync(PRODUCTS_FILE, newContent, 'utf8');
  console.log(`\n✅ Product ${productData.id} added successfully to ${PRODUCTS_FILE}`);
}

function showUsage() {
  console.log('\n📦 DSLLC PRODUCT UPLOAD ASSISTANT\n');
  console.log('Usage:');
  console.log('  node scripts/add-new-product.js status          - Show current product ID status');
  console.log('  node scripts/add-new-product.js template        - Generate product template');
  console.log('  node scripts/add-new-product.js add <json>      - Add product from JSON');
  console.log('\nExample JSON format:');
  console.log(JSON.stringify({
    category: 'Apparel',
    title: 'DarkStreets Tee - V-Neck',
    author: 'DS LLC',
    price: 35.00,
    description: 'Unisex Short Sleeve V-Neck T-Shirt',
    image: '/product-images/tee-example.png',
    shopifyVariantId: 123456789,
    fulfillmentProvider: 'printful',
    requiresShipping: true
  }, null, 2));
}

// Main execution
const command = process.argv[2];

if (!command || command === 'status') {
  showCurrentStatus();
  console.log('\n💡 Next steps:');
  console.log('  1. Determine product category and get next available ID');
  console.log('  2. Set up product in Shopify/Printful/KDP');
  console.log('  3. Get Shopify Variant ID');
  console.log('  4. Prepare product images');
  console.log('  5. Use "template" command to generate product entry');
  console.log('  6. Use "add" command to add product to data/products.ts');
  console.log('\n📖 See docs/PRODUCT-LAUNCH-GUIDE.md for complete instructions\n');
} else if (command === 'template') {
  showCurrentStatus();
  console.log('\n📝 PRODUCT TEMPLATE GENERATOR\n');
  console.log('Enter product details (or press Enter to use defaults):\n');
  
  // This would be interactive - for now, show example
  const exampleProduct = {
    id: getNextProductId('T'),
    category: 'Apparel',
    title: 'DarkStreets Tee - V-Neck',
    author: 'DS LLC',
    price: 35.00,
    description: 'Unisex Short Sleeve V-Neck T-Shirt',
    longDescription: 'Full product description here...',
    image: '/product-images/tee-example.png',
    inStock: true,
    badge: 'New',
    shopifyVariantId: 123456789,
    fulfillmentProvider: 'printful',
    requiresShipping: true
  };
  
  console.log('Example product entry:\n');
  console.log(generateProductTemplate(exampleProduct));
  console.log('\n💡 Copy this template and modify with your product details\n');
} else if (command === 'add') {
  const jsonData = process.argv[3];
  if (!jsonData) {
    console.error('❌ Error: Please provide product data as JSON');
    console.log('\nExample:');
    console.log('node scripts/add-new-product.js add \'{"category":"Apparel","title":"New Tee","price":35}\'');
    process.exit(1);
  }
  
  try {
    const productData = JSON.parse(jsonData);
    
    // Auto-generate ID if not provided
    if (!productData.id) {
      // Determine category prefix from category name
      let prefix = 'M'; // default
      const categoryLower = (productData.category || '').toLowerCase();
      if (categoryLower.includes('book') || categoryLower.includes('serial')) prefix = 'A';
      else if (categoryLower.includes('apparel') || categoryLower.includes('tee') || categoryLower.includes('shirt')) prefix = 'T';
      else if (categoryLower.includes('accessor') || categoryLower.includes('cap') || categoryLower.includes('hat')) prefix = 'B';
      else if (categoryLower.includes('home') || categoryLower.includes('culinary')) prefix = 'H';
      else if (categoryLower.includes('magnet') || categoryLower.includes('vehicle')) prefix = 'M';
      
      productData.id = getNextProductId(prefix);
      console.log(`\n📌 Auto-assigned Product ID: ${productData.id}`);
    }
    
    addProductToFile(productData);
    console.log(`\n✅ Product ${productData.id} has been added successfully!`);
    console.log('\n⚠️  IMPORTANT: Verify the product entry in data/products.ts');
    console.log('   - Check all fields are correct');
    console.log('   - Verify shopifyVariantId matches Shopify');
    console.log('   - Ensure image path is correct');
    console.log('   - Test product on website\n');
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
} else {
  showUsage();
}

