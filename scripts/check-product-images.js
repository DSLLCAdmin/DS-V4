/**
 * CHECK PRODUCT IMAGES IN SHOPIFY
 * Verifies what images are currently configured in Shopify for products
 */

const SHOPIFY_STORE_DOMAIN = 'wenugu-5b.myshopify.com';
const SHOPIFY_ADMIN_API_TOKEN = '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';
const SHOPIFY_API_VERSION = '2024-10';

async function checkProductImages(productId) {
  const query = `
    query getProduct($id: ID!) {
      product(id: $id) {
        id
        title
        status
        featuredImage {
          url
          altText
        }
        images(first: 10) {
          edges {
            node {
              id
              url
              altText
              width
              height
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
  console.log('\n🔍 Checking Product Images in Shopify\n');
  console.log('='.repeat(70));

  const products = [
    { id: '7425246101602', name: 'DarkStreets Tee - V-Neck', expectedImage: '/product-images/Tees-0.png' },
    { id: '7448102666338', name: "DarkStreets' Otto Cap", expectedImage: '/product-images/A8_hats.jpg' }
  ];

  for (const productInfo of products) {
    try {
      const product = await checkProductImages(productInfo.id);
      
      console.log(`\n📦 Product: "${product.title}"`);
      console.log(`   Product ID: ${product.id}`);
      console.log(`   Status: ${product.status}`);
      
      if (product.featuredImage) {
        console.log(`\n   🖼️  Featured Image:`);
        console.log(`      URL: ${product.featuredImage.url}`);
        console.log(`      Alt Text: ${product.featuredImage.altText || 'N/A'}`);
      } else {
        console.log(`\n   ⚠️  No featured image set`);
      }
      
      console.log(`\n   📸 All Images (${product.images.edges.length}):`);
      product.images.edges.forEach((imgEdge, index) => {
        const img = imgEdge.node;
        console.log(`\n   ${index + 1}. Image:`);
        console.log(`      URL: ${img.url}`);
        console.log(`      Alt Text: ${img.altText || 'N/A'}`);
        console.log(`      Dimensions: ${img.width} x ${img.height}`);
      });
      
      console.log(`\n   📋 Expected in DSLLC website: ${productInfo.expectedImage}`);
      console.log(`\n   💡 To update images in Shopify:`);
      console.log(`      1. Go to Shopify Admin → Products → "${product.title}"`);
      console.log(`      2. In the "Media" section, delete old images`);
      console.log(`      3. Upload new images (${productInfo.expectedImage})`);
      console.log(`      4. Set the first image as featured image`);
      console.log(`      5. Click "Save"`);
      
      console.log('\n' + '-'.repeat(70));
      
      // Wait between requests
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error(`\n❌ Error checking product ${productInfo.id}:`, error.message);
    }
  }

  console.log('\n' + '='.repeat(70));
  console.log('\n💡 NOTE: If images are old in Shopify:');
  console.log('   1. Update images in Shopify Admin');
  console.log('   2. Clear browser cache (Ctrl+Shift+R or Cmd+Shift+R)');
  console.log('   3. Wait 5-10 minutes for Shopify CDN cache to update');
  console.log('   4. Test again\n');
}

main();

