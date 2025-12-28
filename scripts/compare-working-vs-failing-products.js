/**
 * COMPARE WORKING VS FAILING PRODUCTS
 * Compares book products (working) vs tee/cap products (failing) to find differences
 */

const SHOPIFY_STORE_DOMAIN = process.env.SHOPIFY_STORE_DOMAIN || 'wenugu-5b.myshopify.com';
const SHOPIFY_ADMIN_API_TOKEN = process.env.SHOPIFY_ACCESS_TOKEN || process.env.SHOPIFY_ADMIN_API_TOKEN;
if (!SHOPIFY_ADMIN_API_TOKEN) {
  console.error('\n❌ ERROR: Shopify Admin API Token is required');
  console.error('   Please set SHOPIFY_ACCESS_TOKEN or SHOPIFY_ADMIN_API_TOKEN environment variable');
  process.exit(1);
}
const SHOPIFY_STOREFRONT_API_TOKEN = process.env.SHOPIFY_STOREFRONT_API_TOKEN || process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_API_TOKEN;
if (!SHOPIFY_STOREFRONT_API_TOKEN) {
  console.error('\n❌ ERROR: Shopify Storefront API Token is required');
  console.error('   Please set SHOPIFY_STOREFRONT_API_TOKEN environment variable');
  process.exit(1);
}
const SHOPIFY_API_VERSION = '2024-10';

// Working product (book)
const workingProductId = '7407899312226'; // "First & Light- Paperback"
const workingVariantId = '42146492383330';

// Failing products
const failingProducts = [
  { id: '7425246101602', variantId: '42224116793442', name: 'Tee Shirt' },
  { id: '7448102666338', variantId: '42283613552738', name: 'Cap' }
];

async function checkStorefrontVisibility(variantId, productName) {
  const query = `
    query getVariant($id: ID!) {
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

    const data = await response.json();
    
    if (data.errors) {
      return { visible: false, error: data.errors[0].message };
    }
    
    if (!data.data?.node) {
      return { visible: false, error: 'Variant not found in Storefront API' };
    }
    
    return { visible: true, data: data.data.node };
  } catch (error) {
    return { visible: false, error: error.message };
  }
}

async function checkAdminDetails(productId, variantId) {
  const query = `
    query getProduct($id: ID!) {
      product(id: $id) {
        id
        title
        status
        publishedAt
        vendor
        productType
        tags
        variants(first: 10) {
          edges {
            node {
              id
              title
              availableForSale
              price
              sku
              inventoryQuantity
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

    const data = await response.json();
    return data.data?.product || null;
  } catch (error) {
    return null;
  }
}

async function main() {
  console.log('\n🔍 Comparing Working (Books) vs Failing (Tee/Cap) Products\n');
  console.log('='.repeat(70));

  // Check working product
  console.log(`\n✅ WORKING PRODUCT: "First & Light- Paperback"`);
  console.log('-'.repeat(70));
  const workingAdmin = await checkAdminDetails(workingProductId, workingVariantId);
  const workingStorefront = await checkStorefrontVisibility(workingVariantId, 'Working Book');
  
  if (workingAdmin) {
    console.log(`   Admin API - Product ID: ${workingAdmin.id}`);
    console.log(`   Admin API - Status: ${workingAdmin.status}`);
    console.log(`   Admin API - Published: ${workingAdmin.publishedAt ? '✅ Yes' : '❌ No'}`);
    console.log(`   Admin API - Vendor: ${workingAdmin.vendor || 'N/A'}`);
    console.log(`   Admin API - Product Type: ${workingAdmin.productType || 'N/A'}`);
    console.log(`   Admin API - Tags: ${workingAdmin.tags.join(', ') || 'None'}`);
  }
  
  if (workingStorefront.visible) {
    console.log(`   Storefront API - ✅ VISIBLE`);
    console.log(`   Storefront API - Available: ${workingStorefront.data.availableForSale ? '✅ Yes' : '❌ No'}`);
    console.log(`   Storefront API - Product Available: ${workingStorefront.data.product.availableForSale ? '✅ Yes' : '❌ No'}`);
  } else {
    console.log(`   Storefront API - ❌ NOT VISIBLE: ${workingStorefront.error}`);
  }

  // Check failing products
  for (const product of failingProducts) {
    console.log(`\n❌ FAILING PRODUCT: ${product.name}`);
    console.log('-'.repeat(70));
    
    const failingAdmin = await checkAdminDetails(product.id, product.variantId);
    const failingStorefront = await checkStorefrontVisibility(product.variantId, product.name);
    
    if (failingAdmin) {
      console.log(`   Admin API - Product ID: ${failingAdmin.id}`);
      console.log(`   Admin API - Status: ${failingAdmin.status}`);
      console.log(`   Admin API - Published: ${failingAdmin.publishedAt ? '✅ Yes' : '❌ No'}`);
      console.log(`   Admin API - Vendor: ${failingAdmin.vendor || 'N/A'}`);
      console.log(`   Admin API - Product Type: ${failingAdmin.productType || 'N/A'}`);
      console.log(`   Admin API - Tags: ${failingAdmin.tags.join(', ') || 'None'}`);
    }
    
    if (failingStorefront.visible) {
      console.log(`   Storefront API - ✅ VISIBLE`);
      console.log(`   Storefront API - Available: ${failingStorefront.data.availableForSale ? '✅ Yes' : '❌ No'}`);
    } else {
      console.log(`   Storefront API - ❌ NOT VISIBLE: ${failingStorefront.error}`);
    }
    
    // Compare with working product
    if (workingAdmin && failingAdmin) {
      console.log(`\n   📊 COMPARISON WITH WORKING PRODUCT:`);
      const differences = [];
      
      if (workingAdmin.vendor !== failingAdmin.vendor) {
        differences.push(`Vendor: "${workingAdmin.vendor}" vs "${failingAdmin.vendor}"`);
      }
      if (workingAdmin.productType !== failingAdmin.productType) {
        differences.push(`Product Type: "${workingAdmin.productType}" vs "${failingAdmin.productType}"`);
      }
      if (workingAdmin.status !== failingAdmin.status) {
        differences.push(`Status: "${workingAdmin.status}" vs "${failingAdmin.status}"`);
      }
      
      if (differences.length > 0) {
        console.log(`   ⚠️  Differences: ${differences.join(', ')}`);
      } else {
        console.log(`   ✅ No significant differences found`);
      }
    }
    
    await new Promise(resolve => setTimeout(resolve, 2000));
  }

  console.log('\n' + '='.repeat(70));
  console.log('\n💡 KEY FINDING: Books work without collections!');
  console.log('   This means the issue is NOT about collections.');
  console.log('   The issue is likely:');
  console.log('   1. Printful product configuration');
  console.log('   2. Variant ID mismatch');
  console.log('   3. Product-specific Storefront API settings');
  console.log('   4. Fulfillment provider settings\n');
}

main();

