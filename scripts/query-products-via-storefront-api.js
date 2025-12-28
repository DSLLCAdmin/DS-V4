/**
 * QUERY PRODUCTS VIA STOREFRONT API
 * Checks if products are visible via Storefront API products query
 */

const SHOPIFY_STORE_DOMAIN = process.env.SHOPIFY_STORE_DOMAIN || 'wenugu-5b.myshopify.com';
const SHOPIFY_STOREFRONT_API_TOKEN = process.env.SHOPIFY_STOREFRONT_API_TOKEN || process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_API_TOKEN;
if (!SHOPIFY_STOREFRONT_API_TOKEN) {
  console.error('\n❌ ERROR: Shopify Storefront API Token is required');
  console.error('   Please set SHOPIFY_STOREFRONT_API_TOKEN environment variable');
  process.exit(1);
}
const SHOPIFY_API_VERSION = '2024-10';

async function queryProducts() {
  const query = `
    query getProducts($first: Int!) {
      products(first: $first) {
        edges {
          node {
            id
            title
            availableForSale
            publishedAt
            onlineStoreUrl
            variants(first: 10) {
              edges {
                node {
                  id
                  title
                  availableForSale
                  price {
                    amount
                    currencyCode
                  }
                }
              }
            }
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
          first: 20
        }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    
    if (data.errors) {
      return { success: false, errors: data.errors, products: null };
    }
    
    return { success: true, products: data.data.products.edges, errors: null };
  } catch (error) {
    return { success: false, error: error.message, products: null };
  }
}

async function main() {
  console.log('\n🔍 Querying Products via Storefront API\n');
  console.log('='.repeat(70));
  console.log('💡 This shows what products the Storefront API can ACTUALLY see\n');

  const result = await queryProducts();

  if (!result.success) {
    console.error('❌ Query FAILED!');
    if (result.errors) {
      console.error('Errors:', JSON.stringify(result.errors, null, 2));
    }
    if (result.error) {
      console.error('Error:', result.error);
    }
    return;
  }

  const products = result.products || [];
  console.log(`\n✅ Found ${products.length} products visible via Storefront API\n`);

  // Look for tee and cap
  const teeProduct = products.find(p => 
    p.node.title.toLowerCase().includes('tee') || 
    p.node.title.toLowerCase().includes('t-shirt') ||
    p.node.title.toLowerCase().includes('v-neck')
  );
  
  const capProduct = products.find(p => 
    p.node.title.toLowerCase().includes('cap') || 
    p.node.title.toLowerCase().includes('hat') ||
    p.node.title.toLowerCase().includes('otto')
  );

  console.log('📦 Checking for Tee Shirt and Cap:\n');
  console.log('-'.repeat(70));

  if (teeProduct) {
    console.log(`✅ TEE SHIRT FOUND in Storefront API!`);
    console.log(`   Product: "${teeProduct.node.title}"`);
    console.log(`   Product ID: ${teeProduct.node.id}`);
    console.log(`   Available For Sale: ${teeProduct.node.availableForSale ? '✅ Yes' : '❌ No'}`);
    console.log(`   Published At: ${teeProduct.node.publishedAt || 'NOT PUBLISHED'}`);
    console.log(`   Variants (${teeProduct.node.variants.edges.length}):`);
    teeProduct.node.variants.edges.forEach((vEdge, index) => {
      const variant = vEdge.node;
      const numericId = variant.id.split('/').pop();
      console.log(`     ${index + 1}. ${variant.title || 'Default'} - ID: ${numericId} - Available: ${variant.availableForSale ? '✅' : '❌'}`);
    });
  } else {
    console.log(`❌ TEE SHIRT NOT FOUND in Storefront API`);
    console.log(`   The Storefront API cannot see the tee shirt product`);
  }

  console.log('\n' + '-'.repeat(70));

  if (capProduct) {
    console.log(`✅ CAP FOUND in Storefront API!`);
    console.log(`   Product: "${capProduct.node.title}"`);
    console.log(`   Product ID: ${capProduct.node.id}`);
    console.log(`   Available For Sale: ${capProduct.node.availableForSale ? '✅ Yes' : '❌ No'}`);
    console.log(`   Published At: ${capProduct.node.publishedAt || 'NOT PUBLISHED'}`);
    console.log(`   Variants (${capProduct.node.variants.edges.length}):`);
    capProduct.node.variants.edges.forEach((vEdge, index) => {
      const variant = vEdge.node;
      const numericId = variant.id.split('/').pop();
      console.log(`     ${index + 1}. ${variant.title || 'Default'} - ID: ${numericId} - Available: ${variant.availableForSale ? '✅' : '❌'}`);
    });
  } else {
    console.log(`❌ CAP NOT FOUND in Storefront API`);
    console.log(`   The Storefront API cannot see the cap product`);
  }

  // Show all products found
  console.log('\n' + '='.repeat(70));
  console.log(`\n📋 All Products Visible via Storefront API (${products.length}):\n`);
  products.forEach((pEdge, index) => {
    const product = pEdge.node;
    console.log(`${index + 1}. "${product.title}"`);
    console.log(`   Available: ${product.availableForSale ? '✅' : '❌'} | Variants: ${product.variants.edges.length}`);
  });

  console.log('\n' + '='.repeat(70));
  console.log('\n💡 If tee/cap are NOT in this list:');
  console.log('   1. Products are not truly published to Storefront API');
  console.log('   2. May need to be in published collections');
  console.log('   3. May have availability restrictions');
  console.log('   4. Storefront API sync may be delayed');
  console.log('   5. Contact Shopify Support - this may be a platform issue\n');
}

main();

