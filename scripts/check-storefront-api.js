/**
 * CHECK STOREFRONT API VISIBILITY
 * Verifies if products are visible via Shopify Storefront API
 */

const SHOPIFY_STORE_DOMAIN = 'wenugu-5b.myshopify.com';
const SHOPIFY_STOREFRONT_API_TOKEN = '42ec4a86d00bfb85a44c99bd24a4f5f2';
const SHOPIFY_API_VERSION = '2024-10';

async function checkStorefrontVisibility(variantId) {
  const query = `
    query getProductVariant($id: ID!) {
      node(id: $id) {
        ... on ProductVariant {
          id
          title
          availableForSale
          price {
            amount
            currencyCode
          }
          product {
            id
            title
            availableForSale
            publishedAt
            onlineStoreUrl
          }
        }
      }
    }
  `;

  try {
    const response = await fetch(`https://${SHOPIFY_STORE_DOMAIN}/api/${SHOPIFY_API_VERSION}/graphql.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': SHOPIFY_STOREFRONT_API_TOKEN
      },
      body: JSON.stringify({
        query,
        variables: {
          id: `gid://shopify/ProductVariant/${variantId}`
        }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    
    if (data.errors) {
      console.error('❌ GraphQL errors:', JSON.stringify(data.errors, null, 2));
      return null;
    }
    
    const variant = data.data.node;
    if (!variant) {
      console.error('❌ Variant not found in Storefront API');
      return null;
    }
    
    return variant;
  } catch (error) {
    console.error('Error:', error.message);
    throw error;
  }
}

async function main() {
  console.log('\n🔍 Checking Storefront API Visibility\n');
  console.log('='.repeat(70));
  
  // Check tee shirt (M size)
  const teeVariantId = '42224116793442';
  console.log(`\n📦 Checking Tee Shirt Variant: ${teeVariantId}`);
  console.log('-'.repeat(70));
  
  try {
    const teeVariant = await checkStorefrontVisibility(teeVariantId);
    
    if (teeVariant) {
      console.log(`✅ Variant Found in Storefront API!`);
      console.log(`   Variant ID: ${teeVariant.id}`);
      console.log(`   Variant Title: ${teeVariant.title}`);
      console.log(`   Variant Available: ${teeVariant.availableForSale ? '✅ Yes' : '❌ No'}`);
      console.log(`   Product: ${teeVariant.product.title}`);
      console.log(`   Product Available: ${teeVariant.product.availableForSale ? '✅ Yes' : '❌ No'}`);
      console.log(`   Product Published At: ${teeVariant.product.publishedAt || 'NOT PUBLISHED'}`);
      console.log(`   Online Store URL: ${teeVariant.product.onlineStoreUrl || 'NOT AVAILABLE'}`);
      console.log(`   Price: $${teeVariant.price.amount} ${teeVariant.price.currencyCode}`);
    } else {
      console.log(`❌ Variant NOT found in Storefront API`);
      console.log(`   This variant is not accessible via Storefront API`);
      console.log(`   Product may not be published to Online Store`);
    }
  } catch (error) {
    console.error(`❌ Error checking tee shirt:`, error.message);
  }
  
  // Check cap
  const capVariantId = '42283613552738';
  console.log(`\n📦 Checking Cap Variant: ${capVariantId}`);
  console.log('-'.repeat(70));
  
  try {
    const capVariant = await checkStorefrontVisibility(capVariantId);
    
    if (capVariant) {
      console.log(`✅ Variant Found in Storefront API!`);
      console.log(`   Variant ID: ${capVariant.id}`);
      console.log(`   Variant Title: ${capVariant.title}`);
      console.log(`   Variant Available: ${capVariant.availableForSale ? '✅ Yes' : '❌ No'}`);
      console.log(`   Product: ${capVariant.product.title}`);
      console.log(`   Product Available: ${capVariant.product.availableForSale ? '✅ Yes' : '❌ No'}`);
      console.log(`   Product Published At: ${capVariant.product.publishedAt || 'NOT PUBLISHED'}`);
      console.log(`   Online Store URL: ${capVariant.product.onlineStoreUrl || 'NOT AVAILABLE'}`);
      console.log(`   Price: $${capVariant.price.amount} ${capVariant.price.currencyCode}`);
    } else {
      console.log(`❌ Variant NOT found in Storefront API`);
      console.log(`   This variant is not accessible via Storefront API`);
      console.log(`   Product may not be published to Online Store`);
    }
  } catch (error) {
    console.error(`❌ Error checking cap:`, error.message);
  }
  
  console.log('\n' + '='.repeat(70));
  console.log('\n💡 NOTE: Storefront API requires products to be:');
  console.log('   1. Published to "Online Store" channel');
  console.log('   2. availableForSale = true');
  console.log('   3. NOT in "Draft" status');
  console.log('\n   "DS Website Integration" channel is separate and does NOT');
  console.log('   affect Storefront API visibility.\n');
}

main();

