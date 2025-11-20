/**
 * PUBLISH PRODUCTS TO ONLINE STORE
 * Publishes products to the Online Store channel via Shopify Admin API
 */

const SHOPIFY_STORE_DOMAIN = 'wenugu-5b.myshopify.com';
const SHOPIFY_ADMIN_API_TOKEN = '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';
const SHOPIFY_API_VERSION = '2024-10';

async function publishProductToOnlineStore(productId) {
  // First, get current product data
  const getQuery = `
    query getProduct($id: ID!) {
      product(id: $id) {
        id
        title
        status
        publishedAt
      }
    }
  `;

  try {
    // Get product info
    const getResponse = await fetch(`https://${SHOPIFY_STORE_DOMAIN}/admin/api/${SHOPIFY_API_VERSION}/graphql.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': SHOPIFY_ADMIN_API_TOKEN
      },
      body: JSON.stringify({
        query: getQuery,
        variables: {
          id: `gid://shopify/Product/${productId}`
        }
      })
    });

    const getData = await getResponse.json();
    if (getData.errors) {
      throw new Error(`GraphQL errors: ${JSON.stringify(getData.errors, null, 2)}`);
    }

    const product = getData.data.product;
    console.log(`\n📦 Product: "${product.title}"`);
    console.log(`   Status: ${product.status}`);
    console.log(`   Published At: ${product.publishedAt || 'NOT PUBLISHED'}`);

    // Publish using REST API (more reliable for publishing)
    const restUrl = `https://${SHOPIFY_STORE_DOMAIN}/admin/api/${SHOPIFY_API_VERSION}/products/${productId}.json`;
    
    const publishResponse = await fetch(restUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': SHOPIFY_ADMIN_API_TOKEN
      },
      body: JSON.stringify({
        product: {
          id: parseInt(productId),
          status: 'active',
          published: true,
          published_scope: 'web'
        }
      })
    });

    if (!publishResponse.ok) {
      const errorText = await publishResponse.text();
      throw new Error(`Publish API error: ${publishResponse.status} - ${errorText}`);
    }

    const publishData = await publishResponse.json();
    console.log(`   ✅ Published successfully!`);
    console.log(`   Published At: ${publishData.product.published_at || 'N/A'}`);
    
    return publishData.product;
  } catch (error) {
    console.error('❌ Error:', error.message);
    throw error;
  }
}

async function main() {
  const productIds = process.argv.slice(2);
  
  if (productIds.length === 0) {
    console.log('\n📦 Publishing products to Online Store\n');
    console.log('='.repeat(70));
    console.log('Usage: node scripts/publish-products-to-online-store.js <product-id-1> [product-id-2] ...');
    console.log('\nExample:');
    console.log('  node scripts/publish-products-to-online-store.js 7425246101602 7448102666338');
    console.log('');
    process.exit(1);
  }

  console.log('\n📦 Publishing products to Online Store\n');
  console.log('='.repeat(70));

  for (const productId of productIds) {
    try {
      await publishProductToOnlineStore(productId);
      // Wait 1 second between requests
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error(`\n❌ Failed to publish product ${productId}:`, error.message);
    }
  }

  console.log('\n' + '='.repeat(70));
  console.log('\n✅ Publishing complete!');
  console.log('\n💡 Wait 30-60 seconds for Shopify to sync, then test checkout again.\n');
}

main();

