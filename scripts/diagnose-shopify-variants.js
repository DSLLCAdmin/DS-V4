/**
 * DIAGNOSE SHOPIFY VARIANTS
 * 
 * This script queries Shopify Storefront API to find actual variant IDs
 * for products, helping diagnose checkout failures.
 * 
 * Usage: node scripts/diagnose-shopify-variants.js
 */

const SHOPIFY_STORE_DOMAIN = 'wenugu-5b.myshopify.com';
const SHOPIFY_STOREFRONT_API_TOKEN = '42ec4a86d00bfb85a44c99bd24a4f5f2';
const SHOPIFY_ADMIN_API_TOKEN = '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';
const SHOPIFY_API_VERSION = '2024-10';

async function fetchShopifyProducts() {
  // Use Admin API to get ALL products (including unpublished)
  const query = `
    query getProducts($first: Int!) {
      products(first: $first) {
        edges {
          node {
            id
            title
            handle
            status
            variants(first: 10) {
              edges {
                node {
                  id
                  title
                  price
                  sku
                  availableForSale
                }
              }
            }
          }
        }
      }
    }
  `;

  try {
    const response = await fetch(`https://${SHOPIFY_STORE_DOMAIN}/admin/api/${SHOPIFY_API_VERSION}/graphql.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': SHOPIFY_ADMIN_API_TOKEN
      },
      body: JSON.stringify({ 
        query,
        variables: { first: 50 }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Shopify API error: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    
    if (result.errors) {
      throw new Error(`GraphQL errors: ${JSON.stringify(result.errors, null, 2)}`);
    }

    return result.data.products.edges.map(edge => edge.node);
  } catch (error) {
    console.error('Error fetching Shopify products:', error);
    throw error;
  }
}

/**
 * Extract numeric variant ID from GraphQL ID
 * GraphQL ID format: "gid://shopify/ProductVariant/42224116793442"
 */
function extractVariantId(graphqlId) {
  const parts = graphqlId.split('/');
  return parts[parts.length - 1];
}

async function diagnoseVariants() {
  console.log('🔍 Diagnosing Shopify Variants...\n');
  console.log('Store:', SHOPIFY_STORE_DOMAIN);
  console.log('API Version:', SHOPIFY_API_VERSION);
  console.log('');

  try {
    const products = await fetchShopifyProducts();
    console.log(`✅ Found ${products.length} products in Shopify\n`);

    // Products we're checking
    const targetProducts = [
      { dsId: 'T-01', title: "DarkStreets Tee - V-Neck", searchTerms: ['tee', 'v-neck', 'darkstreets tee'], currentVariantId: 42224116793442 },
      { dsId: 'B-08', title: "DarkStreets' Otto Cap", searchTerms: ['otto cap', "darkstreets' otto", 'cap'], currentVariantId: 42283613552738 }
    ];

    console.log('📦 Checking products:');
    console.log('');

    for (const target of targetProducts) {
      console.log(`\n${'='.repeat(60)}`);
      console.log(`Product: ${target.title} (${target.dsId})`);
      console.log(`Current Variant ID in data/products.ts: ${target.currentVariantId}`);
      console.log(`${'='.repeat(60)}`);

      // Try to find matching product using search terms
      const pTitleLower = (p) => p.title.toLowerCase();
      const matches = products.filter(p => {
        const title = pTitleLower(p);
        return target.searchTerms.some(term => title.includes(term.toLowerCase()));
      });
      
      // Prefer ACTIVE products
      const activeMatches = matches.filter(p => p.status === 'ACTIVE');
      const finalMatches = activeMatches.length > 0 ? activeMatches : matches;

      if (finalMatches.length === 0) {
        console.log(`❌ No matching product found in Shopify`);
        console.log(`   Searching for products containing: "${target.title.split(' ')[0]}"`);
        console.log(`   Available product titles:`);
        products.slice(0, 10).forEach(p => {
          console.log(`     - ${p.title}`);
        });
        continue;
      }

      for (const match of finalMatches) {
        console.log(`\n✅ Found product: "${match.title}"`);
        console.log(`   Product ID: ${match.id}`);
        if (match.status) {
          console.log(`   Status: ${match.status}`);
        }
        console.log(`   Variants:`);

        if (match.variants.edges.length === 0) {
          console.log(`     ⚠️  No variants found for this product`);
          continue;
        }

        let foundMatch = false;
        for (const variantEdge of match.variants.edges) {
          const variant = variantEdge.node;
          const numericId = extractVariantId(variant.id);
          const matchesCurrent = numericId === target.currentVariantId.toString();

          console.log(`     - Variant: ${variant.title || 'Default'}`);
          console.log(`       GraphQL ID: ${variant.id}`);
          console.log(`       Numeric ID: ${numericId}`);
          // Handle both price formats (Storefront API has price.amount, Admin API has price as string)
          const priceDisplay = typeof variant.price === 'object' && variant.price.amount 
            ? `$${variant.price.amount} ${variant.price.currencyCode || 'USD'}`
            : `$${variant.price || 'N/A'}`;
          console.log(`       Price: ${priceDisplay}`);
          console.log(`       SKU: ${variant.sku || 'N/A'}`);
          const availableDisplay = variant.availableForSale !== undefined 
            ? (variant.availableForSale ? '✅ Yes' : '❌ No')
            : 'N/A';
          console.log(`       Available: ${availableDisplay}`);
          
          if (matchesCurrent) {
            console.log(`       ✅ MATCHES current ID in data/products.ts`);
            foundMatch = true;
          } else {
            console.log(`       ${matchesCurrent ? '✅' : '❌'} Does NOT match current ID`);
          }
          console.log('');
        }

        if (!foundMatch) {
          console.log(`   ⚠️  WARNING: Current variant ID (${target.currentVariantId}) not found in this product!`);
          console.log(`   💡 Solution: Update data/products.ts with one of the variant IDs above`);
        }
      }
    }

    console.log('\n' + '='.repeat(60));
    console.log('📊 ALL ACTIVE PRODUCTS IN SHOPIFY:');
    console.log('='.repeat(60));
    const activeProducts = products.filter(p => p.status === 'ACTIVE');
    console.log(`Total ACTIVE products: ${activeProducts.length}\n`);
    
    activeProducts.forEach(p => {
      console.log(`\n✅ "${p.title}"`);
      console.log(`   Product ID: ${p.id}`);
      if (p.variants.edges.length > 0) {
        p.variants.edges.forEach(vEdge => {
          const variant = vEdge.node;
          const numericId = extractVariantId(variant.id);
          const priceDisplay = typeof variant.price === 'object' && variant.price.amount 
            ? `$${variant.price.amount}`
            : `$${variant.price || 'N/A'}`;
          console.log(`   Variant: ${variant.title || 'Default'} - ID: ${numericId} - Price: ${priceDisplay} - SKU: ${variant.sku || 'N/A'}`);
        });
      } else {
        console.log(`   ⚠️  No variants`);
      }
    });

    console.log('\n' + '='.repeat(60));
    console.log('📊 SUMMARY');
    console.log('='.repeat(60));
    console.log(`Total products in Shopify: ${products.length}`);
    console.log(`ACTIVE products: ${activeProducts.length}`);
    console.log(`DRAFT products: ${products.filter(p => p.status === 'DRAFT').length}`);

    console.log('\n💡 Next Steps:');
    console.log('   1. Check if products exist in Shopify');
    console.log('   2. Verify product status is "ACTIVE"');
    console.log('   3. Update shopifyVariantId in data/products.ts with correct numeric ID');
    console.log('   4. Test checkout again');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    if (error.stack) {
      console.error('\nStack trace:', error.stack);
    }
    process.exit(1);
  }
}

// Run diagnosis
diagnoseVariants().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});

