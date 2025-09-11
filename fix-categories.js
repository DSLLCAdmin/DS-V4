const fs = require('fs');

const content = fs.readFileSync('app/shop/page.tsx', 'utf8');
let newContent = content;

newContent = newContent.replace(/\/\/ Handle category filtering[\s\S]*?matchesCategory = product\.category === selectedCategory;/g, `// Handle category filtering
    let matchesCategory = false;
    if (selectedCategory === "All") {
      matchesCategory = true;
    } else if (selectedCategory === "Serials/Books") {
      matchesCategory = product.category.includes("First & Light") || product.category.includes("Risque & Safety") || product.category.includes("Mercury & Memory") || product.category.includes("Vol-1");
    } else if (selectedCategory === "Apparel & Intimate Wear") {
      matchesCategory = product.category.includes("Panties") || product.category.includes("Bodysuits") || product.category.includes("Denim") || product.category.includes("Tees") || product.category.includes("Scarves") || product.category.includes("Boxers") || product.category.includes("Tank Tops") || product.category.includes("Hats") || product.category.includes("Hoodies") || product.category.includes("Dresses");
    } else {
      matchesCategory = product.category === selectedCategory;
    }`);

fs.writeFileSync('app/shop/page.tsx', newContent, 'utf8');
console.log('SUCCESS! Fixed category filtering');