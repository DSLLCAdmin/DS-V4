#!/usr/bin/env node

/**
 * Amazon Seller Central Verification Script
 * 
 * This script helps verify that your Amazon Seller Central account
 * is properly configured for FBA integration with Shopify.
 */

console.log('🔍 AMAZON SELLER CENTRAL VERIFICATION');
console.log('='.repeat(50));

console.log('\n📋 CHECKLIST FOR AMAZON SELLER CENTRAL:');
console.log('='.repeat(50));

console.log('\n1. ✅ ACCOUNT TYPE VERIFICATION:');
console.log('   - Go to: https://sellercentral.amazon.com');
console.log('   - Check: You need a PROFESSIONAL seller account');
console.log('   - Look for: "Professional" in your account dashboard');
console.log('   - If you see "Individual", you need to upgrade');

console.log('\n2. ✅ FBA ENABLEMENT:');
console.log('   - Go to: Inventory > Manage FBA Inventory');
console.log('   - Check: You should see FBA options available');
console.log('   - Look for: "Send/Replenish Inventory" button');
console.log('   - If missing, enable FBA in your account settings');

console.log('\n3. ✅ PRODUCT CATALOG:');
console.log('   - Go to: Catalog > Add Products');
console.log('   - Check: Your books should be listed');
console.log('   - Look for: ISBN/ASIN numbers for your books');
console.log('   - If missing, add your book products first');

console.log('\n4. ✅ SHIPPING SETTINGS:');
console.log('   - Go to: Settings > Shipping Settings');
console.log('   - Check: FBA shipping templates are configured');
console.log('   - Look for: "FBA" shipping options');
console.log('   - If missing, set up FBA shipping templates');

console.log('\n5. ✅ PAYMENT METHODS:');
console.log('   - Go to: Settings > Payment Methods');
console.log('   - Check: Valid payment method on file');
console.log('   - Look for: Credit card or bank account');
console.log('   - If missing, add payment method');

console.log('\n6. ✅ TAX INFORMATION:');
console.log('   - Go to: Settings > Tax Information');
console.log('   - Check: Tax settings are configured');
console.log('   - Look for: US tax settings if selling in US');
console.log('   - If missing, complete tax setup');

console.log('\n📝 NEXT STEPS:');
console.log('='.repeat(50));
console.log('1. Complete all checklist items above');
console.log('2. Return to Shopify Amazon MCF app');
console.log('3. Click "Set up" next to "Set up your Buy with Prime account"');
console.log('4. Follow the connection wizard');
console.log('5. Authorize Shopify to access your Amazon account');

console.log('\n⚠️  COMMON ISSUES:');
console.log('='.repeat(50));
console.log('- If you see "Individual" account: Upgrade to Professional');
console.log('- If FBA options missing: Enable FBA in account settings');
console.log('- If products missing: Add your books to Amazon catalog first');
console.log('- If connection fails: Check payment method and tax settings');

console.log('\n🔗 HELPFUL LINKS:');
console.log('='.repeat(50));
console.log('- Amazon Seller Central: https://sellercentral.amazon.com');
console.log('- FBA Setup Guide: https://sellercentral.amazon.com/help/hub/reference/G200625520');
console.log('- Buy with Prime Setup: https://sellercentral.amazon.com/help/hub/reference/G200625520');

console.log('\n✅ READY TO PROCEED?');
console.log('='.repeat(50));
console.log('Once you\'ve completed the checklist above,');
console.log('return to Shopify and continue with the MCF app setup.');
