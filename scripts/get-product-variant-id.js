/**
 * GET PRODUCT VARIANT ID
 * Queries Shopify to get variant IDs for a specific product
 */

const SHOPIFY_STORE_DOMAIN = process.env.SHOPIFY_STORE_DOMAIN || 'wenugu-5b.myshopify.com';
const SHOPIFY_ADMIN_API_TOKEN = process.env.SHOPIFY_ACCESS_TOKEN || process.env.SHOPIFY_ADMIN_API_TOKEN;
const SHOPIFY_API_VERSION = process.env.SHOPIFY_API_VERSION || '2024-10';

if (!SHOPIFY_ADMIN_API_TOKEN) {
  console.error('\n❌ ERROR: Shopify Admin API Token is required');
  console.error('   Please set SHOPIFY_ACCESS_TOKEN or SHOPIFY_ADMIN_API_TOKEN environment variable');
  process.exit(1);
}

async function getProductVariantId(productId) {
  const query = `
    query getProduct($id: ID!) {
      product(id: $id) {
        id
        title
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
  const productId = process.argv[2] || '7448102666338'; // Default to cap product ID
  
  console.log(`\n🔍 Getting variant IDs for product: ${productId}\n`);
  console.log('='.repeat(70));
  
  try {
    const product = await getProductVariantId(productId);
    
    console.log(`\n✅ Product: "${product.title}"`);
    console.log(`   Product ID: ${product.id}`);
    console.log(`   Status: ${product.status}`);
    console.log(`   Published At: ${product.publishedAt || 'NOT PUBLISHED'}`);
    console.log(`   Online Store URL: ${product.onlineStoreUrl || 'NOT AVAILABLE'}`);
    console.log(`   Available For Sale: ${product.availableForSale ? '✅ Yes' : '❌ No'}`);
    console.log(`\n   Variants:`);
    console.log('   '.repeat(35));
    
    if (product.variants.edges.length === 0) {
      console.log('   ⚠️  No variants found');
    } else {
      product.variants.edges.forEach((vEdge, index) => {
        const variant = vEdge.node;
        const numericId = variant.id.split('/').pop();
        console.log(`\n   ${index + 1}. Variant: ${variant.title || 'Default Title'}`);
        console.log(`      GraphQL ID: ${variant.id}`);
        console.log(`      Numeric ID: ${numericId} ← USE THIS IN data/products.ts`);
        console.log(`      Price: $${variant.price}`);
        console.log(`      SKU: ${variant.sku || 'N/A'}`);
        console.log(`      Available: ${variant.availableForSale ? '✅ Yes' : '❌ No'}`);
      });
    }
    
    console.log('\n' + '='.repeat(70));
    console.log('\n💡 Update data/products.ts with:');
    if (product.variants.edges.length > 0) {
      const primaryVariant = product.variants.edges[0].node;
      const numericId = primaryVariant.id.split('/').pop();
      console.log(`   "shopifyVariantId": ${numericId},`);
    }
    console.log('');
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  }
}

main();

