#!/usr/bin/env node

/**
 * DS LLC Product SKU Reference
 * Single source of truth for all book product SKUs
 */

console.log('🔍 DS LLC PRODUCT SKUs - SINGLE SOURCE OF TRUTH');
console.log('='.repeat(60));
console.log('');

console.log('📚 BOOK PRODUCTS - COMPLETE REFERENCE:');
console.log('='.repeat(60));
console.log('');

console.log('📖 EBOOKS (Digital - NOT for Amazon FBA):');
console.log('─'.repeat(40));
console.log('A-01: First & Light - E-book');
console.log('     Price: $0.00 (FREE giveaway)');
console.log('     Shopify Variant ID: 42143382044770');
console.log('     Fulfillment: Digital (KDP)');
console.log('     Requires Shipping: NO');
console.log('');

console.log('A-03: Risque & Safety - E-book');
console.log('     Price: $4.99');
console.log('     Shopify Variant ID: 42143320866914');
console.log('     Fulfillment: Digital (KDP)');
console.log('     Requires Shipping: NO');
console.log('');

console.log('A-05: Mercury & Memory - E-book');
console.log('     Price: $4.99');
console.log('     Shopify Variant ID: [MISSING - needs to be added]');
console.log('     Fulfillment: Digital (KDP)');
console.log('     Requires Shipping: NO');
console.log('');

console.log('A-07: Vol-1 - E-book');
console.log('     Price: $15.99');
console.log('     Shopify Variant ID: [MISSING - needs to be added]');
console.log('     Fulfillment: Digital (KDP)');
console.log('     Requires Shipping: NO');
console.log('');

console.log('📚 PAPERBACKS (Physical - FOR Amazon FBA):');
console.log('─'.repeat(40));
console.log('A-02: First & Light - Paperback');
console.log('     Price: $9.99');
console.log('     Shopify Variant ID: 42146492383330');
console.log('     Fulfillment: Amazon FBA');
console.log('     Requires Shipping: YES');
console.log('     Amazon ASIN: [Find on Amazon.com]');
console.log('');

console.log('A-04: Risque & Safety - Paperback');
console.log('     Price: $9.99');
console.log('     Shopify Variant ID: 42146492448866');
console.log('     Fulfillment: Amazon FBA');
console.log('     Requires Shipping: YES');
console.log('     Amazon ASIN: [Find on Amazon.com]');
console.log('');

console.log('A-06: Mercury & Memory - Paperback');
console.log('     Price: $9.99');
console.log('     Shopify Variant ID: 42146492547170');
console.log('     Fulfillment: Amazon FBA');
console.log('     Requires Shipping: YES');
console.log('     Amazon ASIN: B0FTXBJBVR (CURRENT - you found this one!)');
console.log('');

console.log('A-08: Vol-1 - Paperback');
console.log('     Price: $24.99');
console.log('     Shopify Variant ID: [MISSING - needs to be added]');
console.log('     Fulfillment: Amazon FBA');
console.log('     Requires Shipping: YES');
console.log('     Amazon ASIN: [Find on Amazon.com]');
console.log('');

console.log('🎯 AMAZON SELLER CENTRAL SKUs TO USE:');
console.log('='.repeat(60));
console.log('');
console.log('For Amazon Seller Central offers, use these SKUs:');
console.log('');
console.log('✅ A-02: First & Light - Paperback');
console.log('✅ A-04: Risque & Safety - Paperback');
console.log('✅ A-06: Mercury & Memory - Paperback (CURRENT)');
console.log('✅ A-08: Vol-1 - Paperback');
console.log('');

console.log('📋 NEXT STEPS:');
console.log('='.repeat(60));
console.log('');
console.log('1. Complete current offer for A-06 (Mercury & Memory)');
console.log('2. Find Amazon ASINs for A-02, A-04, A-08 paperbacks');
console.log('3. Add all 4 paperback books to Amazon Seller Central');
console.log('4. Configure all for Amazon FBA fulfillment');
console.log('5. Test integration with Shopify');
console.log('');

console.log('🔗 HELPFUL LINKS:');
console.log('='.repeat(60));
console.log('- Amazon.com search: https://amazon.com');
console.log('- Seller Central: https://sellercentral.amazon.com');
console.log('- DS LLC Products: data/products.ts');
console.log('');

console.log('⚠️  IMPORTANT NOTES:');
console.log('='.repeat(60));
console.log('- Use PAPERBACK ASINs (not e-book ASINs)');
console.log('- E-books are managed through KDP (not Seller Central)');
console.log('- Only physical books can use Amazon FBA');
console.log('- SKUs must match across DS LLC, Shopify, and Amazon');
