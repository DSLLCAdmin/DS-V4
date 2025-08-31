import { getAdminClient } from './shopify';

// Convert local product format to Shopify format
export function convertToShopifyProduct(localProduct: any) {
  return {
    title: localProduct.Title,
    body_html: localProduct.Description || '',
    vendor: localProduct.Author || 'DS LLC',
    product_type: localProduct.Type || 'General',
    tags: localProduct.Category ? [localProduct.Category] : [],
    variants: [
      {
        price: localProduct.SalePrice?.replace('$', '') || '0',
        compare_at_price: localProduct.OriginalPrice?.replace('$', '') || null,
        inventory_quantity: localProduct.InStock ? 100 : 0,
        inventory_management: 'shopify',
        requires_shipping: true,
        taxable: true,
      }
    ],
    status: 'active',
    published: true,
  };
}

// Sync all local products to Shopify
export async function syncAllProductsToShopify(products: any[], shop: string, accessToken: string) {
  const client = await getAdminClient(shop, accessToken);
  const results = [];
  
  for (const product of products) {
    try {
      if (product.image && product.image !== '' && !product.image.includes('Product in-Design')) {
        // Only sync products with actual images
        const shopifyProduct = convertToShopifyProduct(product);
        const response = await client.post({
          path: 'products',
          data: { product: shopifyProduct }
        });
        
        results.push({
          title: product.Title,
          status: 'success',
          shopifyId: response.body.product.id
        });
        
        console.log(`✅ Synced: ${product.Title}`);
      } else {
        results.push({
          title: product.Title,
          status: 'skipped',
          reason: 'No image or placeholder product'
        });
        
        console.log(`⏭️  Skipped: ${product.Title} (no image)`);
      }
    } catch (error) {
      results.push({
        title: product.Title,
        status: 'error',
        error: error instanceof Error ? error.message : String(error)
      });
      
      console.error(`❌ Failed: ${product.Title}`, error instanceof Error ? error.message : String(error));
    }
  }
  
  return results;
}

// Get all products from Shopify
export async function getAllShopifyProducts(shop: string, accessToken: string) {
  const client = await getAdminClient(shop, accessToken);
  
  try {
    const response = await client.get({
      path: 'products',
      query: { limit: 250 } // Shopify's max per request
    });
    
    return response.body.products;
  } catch (error) {
    console.error('Failed to fetch Shopify products:', error);
    return [];
  }
}
