/**
 * ADD TAGS TO PRODUCTS
 * Adds tags to tee/cap products to match book products (which work in Storefront API)
 */

const SHOPIFY_STORE_DOMAIN = process.env.SHOPIFY_STORE_DOMAIN || 'wenugu-5b.myshopify.com';
const SHOPIFY_ADMIN_API_TOKEN = process.env.SHOPIFY_ACCESS_TOKEN || process.env.SHOPIFY_ADMIN_API_TOKEN;
if (!SHOPIFY_ADMIN_API_TOKEN) {
  console.error('\n❌ ERROR: Shopify Admin API Token is required');
  console.error('   Please set SHOPIFY_ACCESS_TOKEN or SHOPIFY_ADMIN_API_TOKEN environment variable');
  process.exit(1);
}
const SHOPIFY_API_VERSION = '2024-10';

async function addTagsToProduct(productId, tags) {
  const query = `
    mutation productUpdate($input: ProductInput!) {
      productUpdate(input: $input) {
        product {
          id
          title
          tags
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  try {
    // First get current product data
    const getQuery = `
      query getProduct($id: ID!) {
        product(id: $id) {
          id
          title
          tags
        }
      }
    `;

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
    const currentProduct = getData.data.product;
    const currentTags = currentProduct.tags || [];
    
    // Merge tags (avoid duplicates)
    const mergedTags = [...new Set([...currentTags, ...tags])];

    // Update product with tags
    const updateResponse = await fetch(`https://${SHOPIFY_STORE_DOMAIN}/admin/api/${SHOPIFY_API_VERSION}/graphql.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': SHOPIFY_ADMIN_API_TOKEN
      },
      body: JSON.stringify({
        query,
        variables: {
          input: {
            id: `gid://shopify/Product/${productId}`,
            tags: mergedTags
          }
        }
      })
    });

    const updateData = await updateResponse.json();
    
    if (updateData.errors) {
      throw new Error(`GraphQL errors: ${JSON.stringify(updateData.errors, null, 2)}`);
    }
    
    if (updateData.data.productUpdate.userErrors?.length > 0) {
      throw new Error(`User errors: ${JSON.stringify(updateData.data.productUpdate.userErrors, null, 2)}`);
    }
    
    return updateData.data.productUpdate.product;
  } catch (error) {
    console.error('Error:', error.message);
    throw error;
  }
}

async function main() {
  console.log('\n🔧 Adding Tags to Products (to match working book products)\n');
  console.log('='.repeat(70));

  const products = [
    { 
      id: '7425246101602', 
      name: 'DarkStreets Tee - V-Neck',
      tags: ['DarkStreets', 'DSLLC', 'Apparel', 'Tee', 'Printful']
    },
    { 
      id: '7448102666338', 
      name: "DarkStreets' Otto Cap",
      tags: ['DarkStreets', 'DSLLC', 'Apparel', 'Cap', 'Printful']
    }
  ];

  for (const productInfo of products) {
    try {
      console.log(`\n📦 Product: "${productInfo.name}"`);
      console.log(`   Product ID: ${productInfo.id}`);
      console.log(`   Adding tags: ${productInfo.tags.join(', ')}`);
      
      const updatedProduct = await addTagsToProduct(productInfo.id, productInfo.tags);
      
      console.log(`   ✅ Tags updated successfully!`);
      console.log(`   Current tags: ${updatedProduct.tags.join(', ')}`);
      
      // Wait between requests
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error(`\n❌ Failed to update product ${productInfo.id}:`, error.message);
    }
  }

  console.log('\n' + '='.repeat(70));
  console.log('\n✅ Tags added!');
  console.log('\n💡 NEXT STEPS:');
  console.log('   1. Wait 2-3 minutes for Shopify to sync');
  console.log('   2. Test checkout again');
  console.log('   3. If still failing, check Storefront API token permissions\n');
}

main();

