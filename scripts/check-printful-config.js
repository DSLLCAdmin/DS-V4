/**
 * CHECK PRINTFUL PRODUCT CONFIGURATION
 * Checks if Printful products have different settings that might block Storefront API
 */

const SHOPIFY_STORE_DOMAIN = 'wenugu-5b.myshopify.com';
const SHOPIFY_ADMIN_API_TOKEN = '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';
const SHOPIFY_API_VERSION = '2024-10';

async function checkProductDetails(productId, productName) {
  // Use REST API to get more detailed product info including fulfillment service
  try {
    const response = await fetch(`https://${SHOPIFY_STORE_DOMAIN}/admin/api/${SHOPIFY_API_VERSION}/products/${productId}.json`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': SHOPIFY_ADMIN_API_TOKEN
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    return data.product;
  } catch (error) {
    console.error('Error:', error.message);
    throw error;
  }
}

async function main() {
  console.log('\n🔍 Checking Printful Product Configuration\n');
  console.log('='.repeat(70));

  const products = [
    { id: '7425246101602', name: 'DarkStreets Tee - V-Neck' },
    { id: '7448102666338', name: "DarkStreets' Otto Cap" }
  ];

  for (const productInfo of products) {
    try {
      console.log(`\n📦 Product: "${productInfo.name}"`);
      console.log(`   Product ID: ${productInfo.id}`);
      console.log('-'.repeat(70));

      const product = await checkProductDetails(productInfo.id, productInfo.name);
      
      console.log(`\n   Product Details:`);
      console.log(`   Status: ${product.status}`);
      console.log(`   Published: ${product.published_at ? '✅ Yes' : '❌ No'}`);
      console.log(`   Published Scope: ${product.published_scope || 'N/A'}`);
      console.log(`   Vendor: ${product.vendor || 'N/A'}`);
      console.log(`   Product Type: ${product.product_type || 'N/A'}`);
      console.log(`   Tags: ${product.tags || 'None'}`);
      
      if (product.variants && product.variants.length > 0) {
        console.log(`\n   Variants (${product.variants.length}):`);
        product.variants.forEach((variant, index) => {
          console.log(`\n   ${index + 1}. Variant: ${variant.title || 'Default'}`);
          console.log(`      Variant ID: ${variant.id}`);
          console.log(`      SKU: ${variant.sku || 'N/A'}`);
          console.log(`      Price: $${variant.price}`);
          console.log(`      Available: ${variant.inventory_quantity !== null ? '✅ Tracked (' + variant.inventory_quantity + ')' : '❌ Not tracked'}`);
          console.log(`      Fulfillment Service: ${variant.fulfillment_service || 'manual'}`);
          console.log(`      Requires Shipping: ${variant.requires_shipping ? '✅ Yes' : '❌ No'}`);
          console.log(`      Inventory Management: ${variant.inventory_management || 'N/A'}`);
          console.log(`      Inventory Policy: ${variant.inventory_policy || 'N/A'}`);
          
          // Check if fulfillment service might be blocking Storefront API
          if (variant.fulfillment_service && variant.fulfillment_service !== 'manual' && variant.fulfillment_service !== 'shopify') {
            console.log(`      ⚠️  WARNING: Custom fulfillment service "${variant.fulfillment_service}" may block Storefront API`);
            console.log(`      💡 Try changing to "manual" or "shopify"`);
          }
        });
      }
      
      console.log('\n' + '-'.repeat(70));
      
      // Wait between requests
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error(`\n❌ Error checking product ${productInfo.id}:`, error.message);
    }
  }

  console.log('\n' + '='.repeat(70));
  console.log('\n💡 KEY FINDINGS:');
  console.log('   Check fulfillment_service field for each variant');
  console.log('   If it shows "Printful" or custom service, try changing to "manual"');
  console.log('   Custom fulfillment services may block Storefront API access\n');
}

main();

