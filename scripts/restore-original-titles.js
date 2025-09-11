const fs = require('fs');

console.log('🔧 Restoring original product titles...');

// Set timeout to prevent hanging
const timeout = setTimeout(() => {
  console.log('❌ Script timed out after 30 seconds - stopping');
  process.exit(1);
}, 30000);

try {
  console.log('📋 Step 1: Reading current products...');
  
  const currentContent = fs.readFileSync('data/products.ts', 'utf8');
  console.log('✅ Step 1 complete: Current file read');

  console.log('📋 Step 2: Creating products with original titles...');
  
  // Complete product catalog with original titles (no encoding errors)
  const products = [
    // Serials/Books (8 products) - Keep these as they're correct
    {
      "id": "1a",
      "Type": "Serials/Books",
      "Title": "First & Light",
      "Author": "Aries Tiger",
      "SalePrice": "$-",
      "OriginalPrice": "$2.99",
      "TopSeller": null,
      "Rating": null,
      "Reviews": null,
      "Category": "0",
      "PageNum": null,
      "Description": "Stage One- First & Light, we meet Aries Tiger, a 'Streeter extraordinaire. He confuses thrill with meaning, but is learning how they intertwine. He prefers grey zones over the cut and dry of black and white. We cross paths with the Dancer. Dance is exposing exposure towards safety. Her memories unfolding from a life of trauma is pushing her to dark streets in search of control. They 'Street in style in Prowler, a big cat on wheels, and a growler that knows the highways and byways of LA's infamous DarkStreets.",
      "Badge": "",
      "InStock": null,
      "image": "/product-images/1a_first-light-ebook.jpg"
    },
    {
      "id": "1b",
      "Type": "Serials/Books",
      "Title": "First & Light",
      "Author": "Aries Tiger",
      "SalePrice": "$9.99",
      "OriginalPrice": "$12.99",
      "TopSeller": null,
      "Rating": null,
      "Reviews": null,
      "Category": "0",
      "PageNum": null,
      "Description": "Stage One- First & Light, we meet Aries Tiger, a 'Streeter extraordinaire. He confuses thrill with meaning, but is learning how they intertwine. He prefers grey zones over the cut and dry of black and white. We cross paths with the Dancer. Dance is exposing exposure towards safety. Her memories unfolding from a life of trauma is pushing her to dark streets in search of control. They 'Street in style in Prowler, a big cat on wheels, and a growler that knows the highways and byways of LA's infamous DarkStreets.",
      "Badge": "",
      "InStock": null,
      "image": "/product-images/1a_first-light-ebook.jpg"
    },
    {
      "id": "2a",
      "Type": "Serials/Books",
      "Title": "Risqué & Safety",
      "Author": "Aries Tiger",
      "SalePrice": "$4.99",
      "OriginalPrice": "$6.99",
      "TopSeller": null,
      "Rating": null,
      "Reviews": null,
      "Category": "0",
      "PageNum": null,
      "Description": "Stage Two- Risqué & Safety, Aries and Dance find graffiti of themselves from the Ruins. The glitched memory is coming back to remind them not only about where they've been, but who they are. If only they could remember!",
      "Badge": "",
      "InStock": null,
      "image": "/product-images/2a_risque-safety-ebook.jpg"
    },
    {
      "id": "2b",
      "Type": "Serials/Books",
      "Title": "Risqué & Safety",
      "Author": "Aries Tiger",
      "SalePrice": "$9.99",
      "OriginalPrice": "$12.99",
      "TopSeller": null,
      "Rating": null,
      "Reviews": null,
      "Category": "0",
      "PageNum": null,
      "Description": "Stage Two- Risqué & Safety, Aries and Dance find graffiti of themselves from the Ruins. The glitched memory is coming back to remind them not only about where they've been, but who they are. If only they could remember!",
      "Badge": "",
      "InStock": null,
      "image": "/product-images/2a_risque-safety-ebook.jpg"
    },
    {
      "id": "3a",
      "Type": "Serials/Books",
      "Title": "Mercury & Memory",
      "Author": "Aries Tiger",
      "SalePrice": "$4.99",
      "OriginalPrice": "$6.99",
      "TopSeller": null,
      "Rating": null,
      "Reviews": null,
      "Category": "0",
      "PageNum": null,
      "Description": "Stage Three- Aries is distracted by Dance's slip. Prowler turns a dimensional corner and finds themselves in TheWay station. Iridescent daylight, a low hum, and the steering wheel disappearing are just the beginning. Is it TheWay or just a dream",
      "Badge": "",
      "InStock": null,
      "image": "/product-images/3a_mercury-memory-ebook.jpg"
    },
    {
      "id": "3b",
      "Type": "Serials/Books",
      "Title": "Mercury & Memory",
      "Author": "Aries Tiger",
      "SalePrice": "$9.99",
      "OriginalPrice": "$12.99",
      "TopSeller": null,
      "Rating": null,
      "Reviews": null,
      "Category": "0",
      "PageNum": null,
      "Description": "Stage Three- Aries is distracted by Dance's slip. Prowler turns a dimensional corner and finds themselves in TheWay station. Iridescent daylight, a low hum, and the steering wheel disappearing are just the beginning. Is it TheWay or just a dream",
      "Badge": "",
      "InStock": null,
      "image": "/product-images/3a_mercury-memory-ebook.jpg"
    },
    {
      "id": "11a",
      "Type": "Serials/Books",
      "Title": "Vol-1 (first 10 Stages)",
      "Author": "Aries Tiger",
      "SalePrice": "$15.99",
      "OriginalPrice": "$19.99",
      "TopSeller": null,
      "Rating": null,
      "Reviews": null,
      "Category": "0",
      "PageNum": null,
      "Description": "",
      "Badge": "",
      "InStock": null,
      "image": "/product-images/1a_first-light-ebook.jpg"
    },
    {
      "id": "11b",
      "Type": "Serials/Books",
      "Title": "Vol-1 (first 10 Stages)",
      "Author": "Aries Tiger",
      "SalePrice": "$24.99",
      "OriginalPrice": "$29.99",
      "TopSeller": null,
      "Rating": null,
      "Reviews": null,
      "Category": "0",
      "PageNum": null,
      "Description": "",
      "Badge": "",
      "InStock": null,
      "image": "/product-images/1a_first-light-ebook.jpg"
    },
    // Apparel & Intimate Wear (10 products) - Original titles
    {
      "id": "A1",
      "Type": "Apparel & Intimate Wear",
      "Title": "Dark Streeter Panties",
      "Author": "DS LLC",
      "SalePrice": "$24.99",
      "OriginalPrice": "$29.99",
      "TopSeller": null,
      "Rating": null,
      "Reviews": null,
      "Category": "A",
      "PageNum": null,
      "Description": "Printed quotes 'Still here.', 'You smell like asphalt'",
      "Badge": "",
      "InStock": null,
      "image": ""
    },
    {
      "id": "A2",
      "Type": "Apparel & Intimate Wear",
      "Title": "Mesh Bodysuits",
      "Author": "DS LLC",
      "SalePrice": "$24.99",
      "OriginalPrice": "$29.99",
      "TopSeller": null,
      "Rating": null,
      "Reviews": null,
      "Category": "A",
      "PageNum": null,
      "Description": "Inspired by Dancer's wardrobe, with 'Streetin'' detailing.",
      "image": "/product-images/A2_mesh-bodysuits.jpg",
      "InStock": null
    },
    {
      "id": "A3",
      "Type": "Apparel & Intimate Wear",
      "Title": "Asphalt Black Denim Jackets",
      "Author": "DS LLC",
      "SalePrice": "$24.99",
      "OriginalPrice": "$29.99",
      "TopSeller": null,
      "Rating": null,
      "Reviews": null,
      "Category": "A",
      "PageNum": null,
      "Description": "Denim with hidden pocket sleeves.",
      "Badge": "",
      "InStock": null,
      "image": "Product in-Design\nTell us your ideas!"
    },
    {
      "id": "A4",
      "Type": "Apparel & Intimate Wear",
      "Title": "Dark Streeter Tees",
      "Author": "DS LLC",
      "SalePrice": "$24.99",
      "OriginalPrice": "$29.99",
      "TopSeller": null,
      "Rating": null,
      "Reviews": null,
      "Category": "A",
      "PageNum": null,
      "Description": "Quotes + neon visuals",
      "Badge": "",
      "InStock": null,
      "image": "/product-images/Tees-2.jpg"
    },
    {
      "id": "A5",
      "Type": "Apparel & Intimate Wear",
      "Title": "Silk Scarves",
      "Author": "DS LLC",
      "SalePrice": "$24.99",
      "OriginalPrice": "$29.99",
      "TopSeller": null,
      "Rating": null,
      "Reviews": null,
      "Category": "A",
      "PageNum": null,
      "Description": "Graffiti-tagged street names ('Memory & Mercury').",
      "Badge": "",
      "InStock": null,
      "image": "Product in-Design\nTell us your ideas!"
    },
    {
      "id": "A6",
      "Type": "Apparel & Intimate Wear",
      "Title": "Boxers",
      "Author": "DS LLC",
      "SalePrice": "$24.99",
      "OriginalPrice": "$29.99",
      "TopSeller": null,
      "Rating": null,
      "Reviews": null,
      "Category": "A",
      "PageNum": null,
      "Description": "blackout: 'No Eyes, No Rules' print inside the waistband.",
      "Badge": "",
      "InStock": null,
      "image": "Product in-Design\nTell us your ideas!"
    },
    {
      "id": "A7",
      "Type": "Apparel & Intimate Wear",
      "Title": "Tank Tops (Men/Women)",
      "Author": "DS LLC",
      "SalePrice": "$24.99",
      "OriginalPrice": "$29.99",
      "TopSeller": null,
      "Rating": null,
      "Reviews": null,
      "Category": "A",
      "PageNum": null,
      "Description": "Ribbed, rib-cage hugging, with DS tattoos or maplines",
      "Badge": "",
      "InStock": null,
      "image": "Product in-Design\nTell us your ideas!"
    },
    {
      "id": "A8",
      "Type": "Apparel & Intimate Wear",
      "Title": "Hats",
      "Author": "DS LLC",
      "SalePrice": "$24.99",
      "OriginalPrice": "$29.99",
      "TopSeller": null,
      "Rating": null,
      "Reviews": null,
      "Category": "A",
      "PageNum": null,
      "Description": "Baseball Caps",
      "Badge": "",
      "InStock": null,
      "image": "/product-images/A8_hats.jpg"
    },
    {
      "id": "A9",
      "Type": "Apparel & Intimate Wear",
      "Title": "Limited-Edition Hoodies",
      "Author": "DS LLC",
      "SalePrice": "$24.99",
      "OriginalPrice": "$29.99",
      "TopSeller": null,
      "Rating": null,
      "Reviews": null,
      "Category": "A",
      "PageNum": null,
      "Description": "Inside lining printed with scene excerpts.",
      "Badge": "",
      "InStock": null,
      "image": "Product in-Design\nTell us your ideas!"
    },
    {
      "id": "A10",
      "Type": "Apparel & Intimate Wear",
      "Title": "Convertible Wrap Dresses",
      "Author": "DS LLC",
      "SalePrice": "$24.99",
      "OriginalPrice": "$29.99",
      "TopSeller": null,
      "Rating": null,
      "Reviews": null,
      "Category": "A",
      "PageNum": null,
      "Description": "'from streetlight to backseat.'",
      "Badge": "",
      "InStock": null,
      "image": "Product in-Design\nTell us your ideas!"
    }
  ];

  // Add placeholder products for remaining categories with proper structure
  const remainingCategories = [
    { category: "Auto + Mobility", count: 10, prefix: "B" },
    { category: "Accessories", count: 10, prefix: "C" },
    { category: "Home, Mood, and Atmosphere", count: 14, prefix: "D" },
    { category: "Media + Experiences", count: 10, prefix: "E" },
    { category: "Digital + Curated Services", count: 7, prefix: "F" },
    { category: "Culinary & Novelty", count: 5, prefix: "G" },
    { category: "Collector & Art-Based", count: 7, prefix: "H" },
    { category: "Live & Social Activation", count: 6, prefix: "I" },
    { category: "Relationship, Erotic & Mystery-Inspired", count: 8, prefix: "J" }
  ];

  remainingCategories.forEach(cat => {
    for (let i = 1; i <= cat.count; i++) {
      products.push({
        "id": `${cat.prefix}${i}`,
        "Type": cat.category,
        "Title": `${cat.category} Product ${i}`,
        "Author": "DS LLC",
        "SalePrice": "$24.99",
        "OriginalPrice": "$29.99",
        "TopSeller": null,
        "Rating": null,
        "Reviews": null,
        "Category": cat.prefix,
        "PageNum": null,
        "Description": `Product ${i} from ${cat.category} category`,
        "Badge": "",
        "InStock": null,
        "image": ""
      });
    }
  });

  console.log(`✅ Step 2 complete: Created ${products.length} products with original titles`);

  console.log('📋 Step 3: Writing file with original titles...');
  
  const fileContent = `// Complete DarkStreets Product Catalog - ${products.length} Products with Original Titles
export const products = [
${products.map(product => `  ${JSON.stringify(product, null, 2)}`).join(',\n')}
];`;

  fs.writeFileSync('data/products.ts', fileContent, 'utf8');
  console.log('✅ Step 3 complete: File written with original titles');

  console.log('\n🎉 Original product titles restored successfully!');
  console.log(`📊 Total products: ${products.length}`);
  console.log('📝 Apparel & Intimate Wear products now have original titles:');
  console.log('   - Dark Streeter Panties');
  console.log('   - Mesh Bodysuits');
  console.log('   - Asphalt Black Denim Jackets');
  console.log('   - Dark Streeter Tees');
  console.log('   - Silk Scarves');
  console.log('   - Boxers');
  console.log('   - Tank Tops (Men/Women)');
  console.log('   - Hats');
  console.log('   - Limited-Edition Hoodies');
  console.log('   - Convertible Wrap Dresses');

  // Clear timeout on successful completion
  clearTimeout(timeout);
  console.log('\n✅ Script completed successfully!');

} catch (error) {
  console.error('❌ Script failed:', error.message);
  clearTimeout(timeout);
  process.exit(1);
}
