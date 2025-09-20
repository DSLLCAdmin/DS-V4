/**
 * Shopify Integration Configuration
 * Handles API credentials, store settings, and integration setup
 */

export interface ShopifyConfig {
  storeDomain: string;
  apiVersion: string;
  accessToken: string;
  webhookSecret: string;
  storeName: string;
  currency: string;
  timezone: string;
}

export interface ShopifyProduct {
  id: string;
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
  id: string;
  product_id: string;
  title: string;
  price: string;
  sku: string;
  position: number;
  inventory_policy: string;
  compare_at_price: string;
  fulfillment_service: string;
  inventory_management: string;
  option1: string;
  option2: string;
  option3: string;
  created_at: string;
  updated_at: string;
  taxable: boolean;
  barcode: string;
  grams: number;
  image_id: string;
  weight: number;
  weight_unit: string;
  inventory_item_id: string;
  inventory_quantity: number;
  old_inventory_quantity: number;
  requires_shipping: boolean;
  admin_graphql_api_id: string;
}

export interface ShopifyOption {
  id: string;
  product_id: string;
  name: string;
  position: number;
  values: string[];
}

export interface ShopifyImage {
  id: string;
  product_id: string;
  position: number;
  created_at: string;
  updated_at: string;
  alt: string;
  width: number;
  height: number;
  src: string;
  variant_ids: string[];
  admin_graphql_api_id: string;
}

export interface ShopifyOrder {
  id: string;
  email: string;
  created_at: string;
  updated_at: string;
  number: number;
  note: string;
  token: string;
  gateway: string;
  test: boolean;
  total_price: string;
  subtotal_price: string;
  total_weight: number;
  total_tax: string;
  taxes_included: boolean;
  currency: string;
  financial_status: string;
  confirmed: boolean;
  total_discounts: string;
  buyer_accepts_marketing: boolean;
  name: string;
  referring_site: string;
  landing_site: string;
  cancelled_at: string;
  cancel_reason: string;
  total_line_items_price: string;
  total_tip_received: string;
  cart_token: string;
  reference: string;
  user_id: string;
  location_id: string;
  source_identifier: string;
  source_url: string;
  processed_at: string;
  device_id: string;
  phone: string;
  customer_locale: string;
  app_id: string;
  browser_ip: string;
  landing_site_ref: string;
  order_number: number;
  discount_applications: any[];
  discount_codes: any[];
  note_attributes: any[];
  payment_gateway_names: string[];
  processing_method: string;
  checkout_id: string;
  source_name: string;
  fulfillment_status: string;
  order_status_url: string;
  presentment_currency: string;
  total_line_items_price_set: any;
  total_discounts_set: any;
  total_shipping_price_set: any;
  subtotal_price_set: any;
  total_price_set: any;
  total_tax_set: any;
  line_items: ShopifyLineItem[];
  shipping_address: ShopifyAddress;
  billing_address: ShopifyAddress;
  customer: ShopifyCustomer;
  fulfillments: any[];
  refunds: any[];
  shipping_lines: any[];
  tax_lines: any[];
}

export interface ShopifyLineItem {
  id: string;
  variant_id: string;
  title: string;
  quantity: number;
  sku: string;
  variant_title: string;
  vendor: string;
  fulfillment_service: string;
  product_id: string;
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
  fulfillment_status: string;
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
  id: string;
  email: string;
  accepts_marketing: boolean;
  created_at: string;
  updated_at: string;
  first_name: string;
  last_name: string;
  orders_count: number;
  state: string;
  total_spent: string;
  last_order_id: string;
  note: string;
  verified_email: boolean;
  multipass_identifier: string;
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

// Default configuration (will be updated with actual credentials)
export const defaultShopifyConfig: ShopifyConfig = {
  storeDomain: 'darkstreet-llc.myshopify.com', // Will be updated
  apiVersion: '2024-01',
  accessToken: '', // Will be set during setup
  webhookSecret: '', // Will be set during setup
  storeName: 'DarkStreet LLC',
  currency: 'USD',
  timezone: 'America/Los_Angeles'
};

// Environment variables for Shopify credentials
export const getShopifyConfig = (): ShopifyConfig => {
  return {
    storeDomain: process.env.SHOPIFY_STORE_DOMAIN || defaultShopifyConfig.storeDomain,
    apiVersion: process.env.SHOPIFY_API_VERSION || defaultShopifyConfig.apiVersion,
    accessToken: process.env.SHOPIFY_ACCESS_TOKEN || defaultShopifyConfig.accessToken,
    webhookSecret: process.env.SHOPIFY_WEBHOOK_SECRET || defaultShopifyConfig.webhookSecret,
    storeName: process.env.SHOPIFY_STORE_NAME || defaultShopifyConfig.storeName,
    currency: process.env.SHOPIFY_CURRENCY || defaultShopifyConfig.currency,
    timezone: process.env.SHOPIFY_TIMEZONE || defaultShopifyConfig.timezone
  };
};

// Shopify API endpoints
export const getShopifyEndpoints = (config: ShopifyConfig) => {
  const baseUrl = `https://${config.storeDomain}/admin/api/${config.apiVersion}`;
  
  return {
    products: `${baseUrl}/products.json`,
    product: (id: string) => `${baseUrl}/products/${id}.json`,
    orders: `${baseUrl}/orders.json`,
    order: (id: string) => `${baseUrl}/orders/${id}.json`,
    customers: `${baseUrl}/customers.json`,
    customer: (id: string) => `${baseUrl}/customers/${id}.json`,
    webhooks: `${baseUrl}/webhooks.json`,
    webhook: (id: string) => `${baseUrl}/webhooks/${id}.json`
  };
};

// Product mapping utilities
export const mapDsProductToShopify = (dsProduct: any): Partial<ShopifyProduct> => {
  return {
    title: dsProduct.title,
    body_html: `<p>${dsProduct.description}</p>${dsProduct.longDescription ? `<p>${dsProduct.longDescription}</p>` : ''}`,
    vendor: 'DarkStreet LLC',
    product_type: dsProduct.category,
    status: 'active',
    published_scope: 'web',
    tags: `ds-product,${dsProduct.category.toLowerCase().replace(/\s+/g, '-')},${dsProduct.id}`,
    variants: [{
      id: '',
      product_id: '',
      title: 'Default Title',
      price: dsProduct.price.toString(),
      sku: dsProduct.id,
      position: 1,
      inventory_policy: 'deny',
      compare_at_price: '',
      fulfillment_service: 'manual',
      inventory_management: 'shopify',
      option1: 'Default Title',
      option2: '',
      option3: '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      taxable: true,
      barcode: '',
      grams: 0,
      image_id: '',
      weight: 0,
      weight_unit: 'kg',
      inventory_item_id: '',
      inventory_quantity: dsProduct.inStock ? 100 : 0,
      old_inventory_quantity: 0,
      requires_shipping: true,
      admin_graphql_api_id: ''
    }],
    options: [{
      id: '',
      product_id: '',
      name: 'Title',
      position: 1,
      values: ['Default Title']
    }],
    images: dsProduct.image ? [{
      id: '',
      product_id: '',
      position: 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      alt: dsProduct.title,
      width: 800,
      height: 600,
      src: dsProduct.image,
      variant_ids: [],
      admin_graphql_api_id: ''
    }] : [],
    image: dsProduct.image ? {
      id: '',
      product_id: '',
      position: 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      alt: dsProduct.title,
      width: 800,
      height: 600,
      src: dsProduct.image,
      variant_ids: [],
      admin_graphql_api_id: ''
    } : undefined
  };
};

// Validation utilities
export const validateShopifyConfig = (config: ShopifyConfig): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (!config.storeDomain) {
    errors.push('Store domain is required');
  }
  
  if (!config.accessToken) {
    errors.push('Access token is required');
  }
  
  if (!config.apiVersion) {
    errors.push('API version is required');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};
