/**
 * TEST SHOPIFY CHECKOUT DIRECTLY
 * Tests if we can create a checkout cart via Storefront API
 */

const SHOPIFY_STORE_DOMAIN = 'wenugu-5b.myshopify.com';
const SHOPIFY_STOREFRONT_API_TOKEN = '42ec4a86d00bfb85a44c99bd24a4f5f2';
const SHOPIFY_API_VERSION = '2024-10';

async function testCheckout(variantId) {
  const mutation = `
    mutation cartCreate($input: CartInput!) {
      cartCreate(input: $input) {
        cart {
          id
          checkoutUrl
          totalQuantity
          cost {
            totalAmount {
              amount
              currencyCode
            }
          }
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  const variables = {
    input: {
      lines: [
        {
          merchandiseId: `gid://shopify/ProductVariant/${variantId}`,
          quantity: 1
        }
      ]
    }
  };

  try {
    const response = await fetch(`https://${SHOPIFY_STORE_DOMAIN}/api/${SHOPIFY_API_VERSION}/graphql.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': SHOPIFY_STOREFRONT_API_TOKEN
      },
      body: JSON.stringify({
        query: mutation,
        variables
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    
    return {
      success: !data.errors && !data.data?.cartCreate?.userErrors?.length,
      data: data.data?.cartCreate,
      errors: data.errors || data.data?.cartCreate?.userErrors || [],
      rawResponse: data
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      errors: [error.message]
    };
  }
}

async function main() {
  console.log('\n🔍 Testing Shopify Checkout Directly\n');
  console.log('='.repeat(70));

  const variants = [
    { id: '42224116793442', name: 'Tee Shirt (M)' },
    { id: '42283613552738', name: "Cap" }
  ];

  for (const variant of variants) {
    console.log(`\n📦 Testing: ${variant.name}`);
    console.log(`   Variant ID: ${variant.id}`);
    console.log('-'.repeat(70));

    const result = await testCheckout(variant.id);

    if (result.success && result.data?.cart) {
      console.log(`✅ Checkout SUCCESS!`);
      console.log(`   Cart ID: ${result.data.cart.id}`);
      console.log(`   Checkout URL: ${result.data.cart.checkoutUrl}`);
      console.log(`   Total Quantity: ${result.data.cart.totalQuantity}`);
      console.log(`   Total Amount: ${result.data.cart.cost.totalAmount.amount} ${result.data.cart.cost.totalAmount.currencyCode}`);
    } else {
      console.log(`❌ Checkout FAILED!`);
      
      if (result.errors && result.errors.length > 0) {
        console.log(`\n   Errors:`);
        result.errors.forEach((error, index) => {
          const message = typeof error === 'string' ? error : error.message || JSON.stringify(error);
          const field = error.field ? ` [Field: ${error.field}]` : '';
          console.log(`   ${index + 1}. ${message}${field}`);
        });
      }
      
      if (result.error) {
        console.log(`\n   Error: ${result.error}`);
      }
      
      if (result.rawResponse) {
        console.log(`\n   Raw Response:`, JSON.stringify(result.rawResponse, null, 2));
      }
    }

    // Wait between requests
    await new Promise(resolve => setTimeout(resolve, 2000));
  }

  console.log('\n' + '='.repeat(70));
  console.log('\n💡 If checkout fails even with Storefront API:');
  console.log('   1. Check Shopify Admin → Settings → Checkout');
  console.log('   2. Verify payment provider is configured');
  console.log('   3. Verify shipping zones are set up');
  console.log('   4. Check product availability settings');
  console.log('   5. Verify store is on active plan\n');
}

main();

