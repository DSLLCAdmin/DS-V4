const fs = require('fs');

const content = fs.readFileSync('app/shop/page.tsx', 'utf8');
let newContent = content;

newContent = newContent.replace(/\/\/ Handle category filtering[\s\S]*?matchesCategory = product\.category === selectedCategory;\n    }/g, `// Handle category filtering
    let matchesCategory = false;
    if (selectedCategory === "All") {
      matchesCategory = true;
    } else if (selectedCategory === "Serials/Books") {
      matchesCategory = product.category === "First & Light" || product.category === "Risque & Safety" || product.category === "Mercury & Memory" || product.category === "Vol-1 (first 10 Stages)";
    } else if (selectedCategory === "Apparel & Intimate Wear") {
      matchesCategory = product.category === "Dark Streeter Panties" || product.category === "Mesh Bodysuits" || product.category === "Asphalt Black Denim Jackets" || product.category === "Dark Streeter Tees" || product.category === "Silk Scarves" || product.category === "Boxers" || product.category === "Tank Tops (Men/Women)" || product.category === "Hats" || product.category === "Limited-Edition Hoodies" || product.category === "Convertible Wrap Dresses";
    } else if (selectedCategory === "Auto + Mobility") {
      matchesCategory = product.category === "Custom LED Underlighting Kits" || product.category === "Dark Streets Branded Scent Diffusers" || product.category === "Window Shades" || product.category === "Prowler Dashboard Confessionals" || product.category === "Seatbelt Harness Covers" || product.category === "Streetin' Survival Kits" || product.category === "Mirror Charms" || product.category === "Custom Vanity Plate Frames" || product.category === "Backseat Throw Blankets" || product.category === "Retro Noir Sunglass Series" || product.category === "Cigarette Case Wallets" || product.category === "Lighter Collabs" || product.category === "Silicone Wristbands" || product.category === "Temporary Tattoos" || product.category === "Embroidered Patches" || product.category === "Knuckle Rings" || product.category === "Graffiti Street Tag Stickers" || product.category === "Leather Keychains" || product.category === "Dashboard Candles";
    } else {
      matchesCategory = product.category === selectedCategory;
    }`);

fs.writeFileSync('app/shop/page.tsx', newContent, 'utf8');
console.log('SUCCESS! Added proper category mapping');