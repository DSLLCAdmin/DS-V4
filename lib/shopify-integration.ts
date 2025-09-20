/**
 * Shopify Integration Service
 * Handles all Shopify API interactions for DarkStreet LLC
 */

import { UnifiedProduct } from './unified-product-data';

// Shopify configuration from environment variables
const SHOPIFY_STORE_NAME = process.env.SHOPIFY_STORE_NAME || 'darkstreetllc';
const SHOPIFY_ADMIN_API_ACCESS_TOKEN = process.env.SHOPIFY_ADMIN_API_ACCESS_TOKEN || '';
const SHOPIFY_API_VERSION = process.env.SHOPIFY_API_VERSION || '2024-04';

const SHOPIFY_ADMIN_API_URL = `https://${SHOPIFY_STORE_NAME}.myshopify.com/admin/api/${SHOPIFY_API_VERSION}`;

export interface ShopifyProduct {
  id: number;
  title: string;
  body_html: string;
  vendor: string;
  product_type: string;
  created_at: string;
  updated_at: string;
  published_at: string;
  template_suffix: string;
  status: string;
  published_scope: string;
  tags: string;
  admin_graphql_api_id: string;
  variants: ShopifyVariant[];
  options: ShopifyOption[];
  images: ShopifyImage[];
  image: ShopifyImage;
}

export interface ShopifyVariant {
  id: number;
  product_id: number;
  title: string;
  price: string;
  sku: string;
  position: number;
  inventory_policy: string;
  compare_at_price: string | null;
  fulfillment_service: string;
  inventory_management: string;
  option1: string;
  option2: string | null;
  option3: string | null;
  created_at: string;
  updated_at: string;
  taxable: boolean;
  barcode: string;
  grams: number;
  image_id: number | null;
  weight: number;
  weight_unit: string;
  inventory_item_id: number;
  inventory_quantity: number;
  old_inventory_quantity: number;
  requires_shipping: boolean;
  admin_graphql_api_id: string;
}

export interface ShopifyOption {
  id: number;
  product_id: number;
  name: string;
  position: number;
  values: string[];
}

export interface ShopifyImage {
  id: number;
  product_id: number;
  position: number;
  created_at: string;
  updated_at: string;
  alt: string | null;
  width: number;
  height: number;
  src: string;
  variant_ids: number[];
  admin_graphql_api_id: string;
}

export interface ShopifyCheckout {
  id: number;
  token: string;
  cart_token: string;
  email: string;
  gateway: string;
  buyer_accepts_marketing: boolean;
  created_at: string;
  updated_at: string;
  source_identifier: string;
  source_url: string;
  line_items: ShopifyLineItem[];
  name: string;
  note: string;
  note_attributes: any[];
  referring_site: string;
  landing_site: string;
  closed_at: string | null;
  currency: string;
  total_price: string;
  subtotal_price: string;
  total_tax: string;
  taxes_included: boolean;
  total_weight: number;
  country_code: string;
  completed_at: string | null;
  phone: string;
  customer_locale: string;
  app_id: number;
  browser_ip: string;
  original_total_prices_set: any;
  presentment_currency: string;
  total_line_items_price_set: any;
  total_discounts_set: any;
  total_shipping_price_set: any;
  subtotal_price_set: any;
  total_tax_set: any;
  total_discounts: string;
  total_price_set: any;
  total_outstanding: string;
  user_id: number;
  order_id: number;
  shipping_address: ShopifyAddress;
  billing_address: ShopifyAddress;
  customer: ShopifyCustomer;
  discount_codes: any[];
  web_url: string;
  order_status_url: string;
  tax_lines: any[];
  tax_names: string[];
  total_duties_set: any;
  admin_graphql_api_id: string;
  shipping_line: any;
}

export interface ShopifyLineItem {
  id: number;
  variant_id: number;
  title: string;
  quantity: number;
  sku: string;
  variant_title: string;
  vendor: string;
  fulfillment_service: string;
  product_id: number;
  requires_shipping: boolean;
  taxable: boolean;
  gift_card: boolean;
  name: string;
  variant_inventory_management: string;
  properties: any[];
  product_exists: boolean;
  fulfillable_quantity: number;
  grams: number;
  price: string;
  total_discount: string;
  fulfillment_status: string | null;
  price_set: any;
  total_discount_set: any;
  discount_allocations: any[];
  duties: any[];
  admin_graphql_api_id: string;
  tax_lines: any[];
}

export interface ShopifyAddress {
  first_name: string;
  address1: string;
  phone: string;
  city: string;
  zip: string;
  province: string;
  country: string;
  last_name: string;
  address2: string;
  company: string;
  latitude: number;
  longitude: number;
  name: string;
  country_code: string;
  province_code: string;
}

export interface ShopifyCustomer {
  id: number;
  email: string;
  accepts_marketing: boolean;
  created_at: string;
  updated_at: string;
  first_name: string;
  last_name: string;
  orders_count: number;
  state: string;
  total_spent: string;
  last_order_id: number;
  note: string;
  verified_email: boolean;
  multipass_identifier: string | null;
  tax_exempt: boolean;
  phone: string;
  tags: string;
  last_order_name: string;
  currency: string;
  accepts_marketing_updated_at: string;
  marketing_opt_in_level: string;
  tax_exemptions: any[];
  admin_graphql_api_id: string;
  default_address: ShopifyAddress;
}

/**
 * Create a Shopify product from a DarkStreet product
 */
export async function createShopifyProduct(product: UnifiedProduct): Promise<ShopifyProduct | null> {
  try {
    const productData = {
      product: {
        title: product.title,
        body_html: `<p>${product.description}</p>`,
        vendor: 'DarkStreet LLC',
        product_type: product.category,
        tags: `${product.category.toLowerCase()}, darkstreet, ${product.id}`,
        status: 'active',
        variants: [{
          price: product.price.toString(),
          sku: product.id,
          inventory_quantity: product.inStock ? 999 : 0,
          inventory_policy: 'deny',
          fulfillment_service: 'manual',
          requires_shipping: product.category !== 'Digital & Curated Services',
          taxable: true,
          weight: 0.5,
          weight_unit: 'kg'
        }]
      }
    };

    const response = await fetch(`${SHOPIFY_ADMIN_API_URL}/products.json`, {
      method: 'POST',
      headers: {
        'X-Shopify-Access-Token': SHOPIFY_ADMIN_API_ACCESS_TOKEN,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(productData)
    });

    if (!response.ok) {
      throw new Error(`Shopify API error: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();
    return result.product;
  } catch (error) {
    console.error('Error creating Shopify product:', error);
    return null;
  }
}

/**
 * Get all products from Shopify
 */
export async function getShopifyProducts(): Promise<ShopifyProduct[]> {
  try {
    const response = await fetch(`${SHOPIFY_ADMIN_API_URL}/products.json`, {
      headers: {
        'X-Shopify-Access-Token': SHOPIFY_ADMIN_API_ACCESS_TOKEN
      }
    });

    if (!response.ok) {
      throw new Error(`Shopify API error: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();
    return result.products;
  } catch (error) {
    console.error('Error fetching Shopify products:', error);
    return [];
  }
}

/**
 * Create a Shopify checkout session
 */
export async function createShopifyCheckout(cartItems: any[]): Promise<ShopifyCheckout | null> {
  try {
    // Check if Shopify is properly configured
    if (!SHOPIFY_ADMIN_API_ACCESS_TOKEN || SHOPIFY_ADMIN_API_ACCESS_TOKEN === '') {
      throw new Error('Shopify access token not configured. Please set up your Shopify store first.');
    }

    const checkoutData = {
      checkout: {
        line_items: cartItems.map(item => ({
          variant_id: item.shopifyVariantId || 1, // Fallback to first variant
          quantity: item.quantity
        })),
        email: cartItems[0]?.email || '',
        shipping_address: cartItems[0]?.shippingAddress || {},
        billing_address: cartItems[0]?.billingAddress || {}
      }
    };

    const response = await fetch(`${SHOPIFY_ADMIN_API_URL}/checkouts.json`, {
      method: 'POST',
      headers: {
        'X-Shopify-Access-Token': SHOPIFY_ADMIN_API_ACCESS_TOKEN,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(checkoutData)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Shopify API error: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const result = await response.json();
    return result.checkout;
  } catch (error) {
    console.error('Error creating Shopify checkout:', error);
    throw error; // Re-throw to let the component handle the error message
  }
}

/**
 * Sync DarkStreet products to Shopify
 */
export async function syncProductsToShopify(products: UnifiedProduct[]): Promise<{
  success: number;
  failed: number;
  errors: string[];
}> {
  const results = {
    success: 0,
    failed: 0,
    errors: [] as string[]
  };

  for (const product of products) {
    try {
      const shopifyProduct = await createShopifyProduct(product);
      if (shopifyProduct) {
        results.success++;
        console.log(`✅ Synced product: ${product.title} (${product.id})`);
      } else {
        results.failed++;
        results.errors.push(`Failed to sync ${product.title} (${product.id})`);
      }
    } catch (error) {
      results.failed++;
      results.errors.push(`Error syncing ${product.title} (${product.id}): ${error}`);
    }
  }

  return results;
}

/**
 * Test Shopify connection
 */
export async function testShopifyConnection(): Promise<{
  success: boolean;
  message: string;
  storeInfo?: any;
}> {
  try {
    const response = await fetch(`${SHOPIFY_ADMIN_API_URL}/shop.json`, {
      headers: {
        'X-Shopify-Access-Token': SHOPIFY_ADMIN_API_ACCESS_TOKEN
      }
    });

    if (!response.ok) {
      return {
        success: false,
        message: `Connection failed: ${response.status} ${response.statusText}`
      };
    }

    const shopInfo = await response.json();
    return {
      success: true,
      message: `Connected to ${shopInfo.shop.name}`,
      storeInfo: shopInfo.shop
    };
  } catch (error) {
    return {
      success: false,
      message: `Connection error: ${error}`
    };
  }
}
