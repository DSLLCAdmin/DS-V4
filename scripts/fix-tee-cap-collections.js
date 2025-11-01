/**
 * FIX TEE AND CAP - ADD COLLECTIONS AND VERIFY CHANNEL
 * Script to guide fixing existing tee and cap products
 */

console.log('\n🔧 Fixing Tee and Cap Products\n');
console.log('='.repeat(70));

console.log('\n📋 MANUAL STEPS REQUIRED:\n');

console.log('1️⃣  Add "Home page" Collection to Products:');
console.log('   a. Shopify Admin → Products → "DarkStreets Tee - V-Neck"');
console.log('   b. Scroll to "Product organization" section (right sidebar)');
console.log('   c. Click "Collections" field');
console.log('   d. Search for and select "Home page"');
console.log('   e. Click "Save" (top right)');
console.log('   f. Repeat for "DarkStreets\' Otto Cap"\n');

console.log('2️⃣  Enable "DS Website Integration" Publishing Channel:');
console.log('   a. Shopify Admin → Products → [Product]');
console.log('   b. Scroll to "Publishing" section (right sidebar)');
console.log('   c. Click "Manage" (or pencil icon)');
console.log('   d. Enable "DS Website Integration" toggle');
console.log('   e. Click "Done"');
console.log('   f. Repeat for both tee and cap\n');

console.log('3️⃣  Wait 2-3 Minutes for Sync\n');

console.log('4️⃣  Test Storefront API Visibility:');
console.log('   Run: node scripts/query-products-via-storefront-api.js\n');

console.log('5️⃣  Test Checkout:');
console.log('   Run: node scripts/test-shopify-checkout.js\n');

console.log('='.repeat(70));
console.log('\n💡 ALTERNATIVE: Create NEW Products\n');
console.log('If the above doesn\'t work, create NEW products instead:');
console.log('   - Create new tee product (use T-02 or new ID)');
console.log('   - Create new cap product (use B-09 or new ID)');
console.log('   - Follow fresh product workflow');
console.log('   - Document in PRODUCT-LAUNCH-GUIDE.md\n');

