/**
 * CHECK PRODUCT INVENTORY
 * Checks if products have inventory that might prevent Storefront API visibility
 */

const SHOPIFY_STORE_DOMAIN = process.env.SHOPIFY_STORE_DOMAIN || 'wenugu-5b.myshopify.com';
const SHOPIFY_ADMIN_API_TOKEN = process.env.SHOPIFY_ACCESS_TOKEN || process.env.SHOPIFY_ADMIN_API_TOKEN;
if (!SHOPIFY_ADMIN_API_TOKEN) {
  console.error('\n❌ ERROR: Shopify Admin API Token is required');
  console.error('   Please set SHOPIFY_ACCESS_TOKEN or SHOPIFY_ADMIN_API_TOKEN environment variable');
  process.exit(1);
}
const SHOPIFY_API_VERSION = '2024-10';

async function checkProductInventory(productId) {
  const query = `
    query getProduct($id: ID!) {
      product(id: $id) {
        id
        title
        status
        publishedAt
        variants(first: 10) {
          edges {
            node {
              id
              title
              availableForSale
              inventoryQuantity
              price
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
  console.log('\n🔍 Checking Product Inventory\n');
  console.log('='.repeat(70));

  const productIds = ['7425246101602', '7448102666338'];

  for (const productId of productIds) {
    try {
      const product = await checkProductInventory(productId);
      
      console.log(`\n📦 Product: "${product.title}"`);
      console.log(`   Status: ${product.status}`);
      console.log(`   Published At: ${product.publishedAt || 'NOT PUBLISHED'}`);
      console.log(`\n   Variants:`);
      
      product.variants.edges.forEach((vEdge, index) => {
        const variant = vEdge.node;
        const numericId = variant.id.split('/').pop();
        console.log(`\n   ${index + 1}. Variant: ${variant.title || 'Default'}`);
        console.log(`      Variant ID: ${numericId}`);
        console.log(`      Available For Sale: ${variant.availableForSale ? '✅ Yes' : '❌ No'}`);
        console.log(`      Inventory Quantity: ${variant.inventoryQuantity !== null ? variant.inventoryQuantity : 'Not tracked'}`);
        console.log(`      Price: $${variant.price}`);
        
        // Check if inventory might be blocking
        if (variant.inventoryQuantity !== null && variant.inventoryQuantity <= 0) {
          console.log(`      ⚠️  WARNING: Inventory quantity is ${variant.inventoryQuantity} - this may prevent Storefront API visibility`);
        }
        if (!variant.availableForSale) {
          console.log(`      ⚠️  WARNING: availableForSale is false - this prevents Storefront API visibility`);
        }
      });
      
      console.log('\n' + '-'.repeat(70));
      
      // Wait between requests
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error(`\n❌ Error checking product ${productId}:`, error.message);
    }
  }

  console.log('\n' + '='.repeat(70));
  console.log('\n💡 Products must have:');
  console.log('   1. status = ACTIVE');
  console.log('   2. publishedAt set (published to Online Store)');
  console.log('   3. availableForSale = true for variants');
  console.log('   4. If inventory is tracked, inventoryQuantity > 0\n');
}

main();

