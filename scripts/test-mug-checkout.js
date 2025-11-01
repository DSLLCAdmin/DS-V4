/**
 * TEST MUG CHECKOUT
 * Tests checkout for the new mug product (published with collection)
 */

const SHOPIFY_STORE_DOMAIN = 'wenugu-5b.myshopify.com';
const SHOPIFY_STOREFRONT_API_TOKEN = '42ec4a86d00bfb85a44c99bd24a4f5f2';
const SHOPIFY_API_VERSION = '2024-10';

async function testCheckout(variantId, productName) {
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
  console.log('\n🔍 Testing Mug Checkout (Published WITH Collection)\n');
  console.log('='.repeat(70));

  const mugVariantId = '42284001329250'; // 11 oz variant
  
  console.log(`\n📦 Testing: Streeter Mug (11 oz)`);
  console.log(`   Variant ID: ${mugVariantId}`);
  console.log('-'.repeat(70));

  const result = await testCheckout(mugVariantId, 'Streeter Mug');

  if (result.success && result.data?.cart) {
    console.log(`✅ Checkout SUCCESS!`);
    console.log(`   Cart ID: ${result.data.cart.id}`);
    console.log(`   Checkout URL: ${result.data.cart.checkoutUrl}`);
    console.log(`   Total Quantity: ${result.data.cart.totalQuantity}`);
    console.log(`   Total Amount: ${result.data.cart.cost.totalAmount.amount} ${result.data.cart.cost.totalAmount.currencyCode}`);
    console.log(`\n🎉 COLLECTIONS WORK! The mug (published WITH collection) can checkout!`);
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
  }

  console.log('\n' + '='.repeat(70));
  console.log('\n💡 CONCLUSION:');
  console.log('   If mug checkout works → Collections ARE the solution!');
  console.log('   Add tee/cap to "Home page" collection and test again.\n');
}

main();

