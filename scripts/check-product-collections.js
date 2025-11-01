/**
 * CHECK PRODUCT COLLECTIONS
 * Verifies if products are in any collections (required for Storefront API visibility)
 */

const SHOPIFY_STORE_DOMAIN = 'wenugu-5b.myshopify.com';
const SHOPIFY_ADMIN_API_TOKEN = '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';
const SHOPIFY_API_VERSION = '2024-10';

async function checkProductCollections(productId) {
  const query = `
    query getProduct($id: ID!) {
      product(id: $id) {
        id
        title
        status
        publishedAt
        collections(first: 10) {
          edges {
            node {
              id
              title
              updatedAt
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
        variables: {
          id: `gid://shopify/Product/${productId}`
        }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    
    if (data.errors) {
      throw new Error(`GraphQL errors: ${JSON.stringify(data.errors, null, 2)}`);
    }
    
    return data.data.product;
  } catch (error) {
    console.error('Error:', error.message);
    throw error;
  }
}

async function main() {
  console.log('\n🔍 Checking Product Collections\n');
  console.log('='.repeat(70));
  console.log('💡 Products MUST be in at least one PUBLISHED collection for Storefront API visibility!\n');

  const products = [
    { id: '7425246101602', name: 'DarkStreets Tee - V-Neck' },
    { id: '7448102666338', name: "DarkStreets' Otto Cap" }
  ];

  for (const productInfo of products) {
    try {
      const product = await checkProductCollections(productInfo.id);
      
      console.log(`\n📦 Product: "${product.title}"`);
      console.log(`   Product ID: ${product.id}`);
      console.log(`   Status: ${product.status}`);
      console.log(`   Published At: ${product.publishedAt || 'NOT PUBLISHED'}`);
      
      const collections = product.collections.edges;
      console.log(`\n   📚 Collections (${collections.length}):`);
      
      if (collections.length === 0) {
        console.log(`   ⚠️  ⚠️  ⚠️  NO COLLECTIONS!`);
        console.log(`   ❌ This product is NOT in any collection`);
        console.log(`   💡 SOLUTION: Add this product to at least one PUBLISHED collection`);
        console.log(`   💡 Go to: Products → "${product.title}" → Collections section → Add to collection`);
      } else {
        collections.forEach((colEdge, index) => {
          const collection = colEdge.node;
          console.log(`\n   ${index + 1}. "${collection.title}"`);
          console.log(`      Collection ID: ${collection.id}`);
        });
        
        console.log(`\n   ✅ Product is in ${collections.length} collection(s)`);
        console.log(`   💡 NOTE: Collections must be PUBLISHED in Shopify Admin for Storefront API visibility`);
        console.log(`   💡 Verify in Shopify Admin: Products → Collections → Check collection status`);
      }
      
      console.log('\n' + '-'.repeat(70));
      
      // Wait between requests
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error(`\n❌ Error checking product ${productInfo.id}:`, error.message);
    }
  }

  console.log('\n' + '='.repeat(70));
  console.log('\n💡 NEXT STEPS:');
  console.log('   1. If products have NO collections → Add them to a published collection');
  console.log('   2. If collections are NOT published → Publish the collections');
  console.log('   3. Wait 2-3 minutes for Shopify to sync');
  console.log('   4. Test checkout again\n');
}

main();

