/**
 * Shopify API Service
 * Handles all Shopify API interactions including product sync, order management, and webhooks
 */

import { 
  ShopifyConfig, 
  ShopifyProduct, 
  ShopifyOrder, 
  ShopifyCustomer,
  getShopifyConfig,
  getShopifyEndpoints,
  mapDsProductToShopify,
  validateShopifyConfig
} from './shopify-config';

export interface ShopifyApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  status?: number;
}

export interface ShopifySyncResult {
  success: boolean;
  syncedProducts: number;
  failedProducts: string[];
  errors: string[];
}

export class ShopifyApiService {
  private config: ShopifyConfig;
  private endpoints: ReturnType<typeof getShopifyEndpoints>;

  constructor(config?: ShopifyConfig) {
    this.config = config || getShopifyConfig();
    this.endpoints = getShopifyEndpoints(this.config);
  }

  /**
   * Test Shopify API connection
   */
  async testConnection(): Promise<ShopifyApiResponse<boolean>> {
    try {
      const validation = validateShopifyConfig(this.config);
      if (!validation.isValid) {
        return {
          success: false,
          error: `Configuration invalid: ${validation.errors.join(', ')}`
        };
      }

      const response = await fetch(this.endpoints.products, {
        method: 'GET',
        headers: {
          'X-Shopify-Access-Token': this.config.accessToken,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        return {
          success: false,
          error: `API connection failed: ${response.status} ${response.statusText}`,
          status: response.status
        };
      }

      return {
        success: true,
          data: true
      };
    } catch (error) {
      return {
        success: false,
        error: `Connection test failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  /**
   * Get all products from Shopify
   */
  async getProducts(): Promise<ShopifyApiResponse<ShopifyProduct[]>> {
    try {
      const response = await fetch(this.endpoints.products, {
        method: 'GET',
        headers: {
          'X-Shopify-Access-Token': this.config.accessToken,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        return {
          success: false,
          error: `Failed to fetch products: ${response.status} ${response.statusText}`,
          status: response.status
        };
      }

      const data = await response.json();
      return {
        success: true,
        data: data.products || []
      };
    } catch (error) {
      return {
        success: false,
        error: `Failed to fetch products: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  /**
   * Get a specific product by ID
   */
  async getProduct(id: string): Promise<ShopifyApiResponse<ShopifyProduct>> {
    try {
      const response = await fetch(this.endpoints.product(id), {
        method: 'GET',
        headers: {
          'X-Shopify-Access-Token': this.config.accessToken,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        return {
          success: false,
          error: `Failed to fetch product: ${response.status} ${response.statusText}`,
          status: response.status
        };
      }

      const data = await response.json();
      return {
        success: true,
        data: data.product
      };
    } catch (error) {
      return {
        success: false,
        error: `Failed to fetch product: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  /**
   * Create a new product in Shopify
   */
  async createProduct(dsProduct: any): Promise<ShopifyApiResponse<ShopifyProduct>> {
    try {
      const shopifyProduct = mapDsProductToShopify(dsProduct);
      
      const response = await fetch(this.endpoints.products, {
        method: 'POST',
        headers: {
          'X-Shopify-Access-Token': this.config.accessToken,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          product: shopifyProduct
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return {
          success: false,
          error: `Failed to create product: ${response.status} ${response.statusText}. ${errorData.errors ? JSON.stringify(errorData.errors) : ''}`,
          status: response.status
        };
      }

      const data = await response.json();
      return {
        success: true,
        data: data.product
      };
    } catch (error) {
      return {
        success: false,
        error: `Failed to create product: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  /**
   * Update an existing product in Shopify
   */
  async updateProduct(id: string, dsProduct: any): Promise<ShopifyApiResponse<ShopifyProduct>> {
    try {
      const shopifyProduct = mapDsProductToShopify(dsProduct);
      
      const response = await fetch(this.endpoints.product(id), {
        method: 'PUT',
        headers: {
          'X-Shopify-Access-Token': this.config.accessToken,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          product: shopifyProduct
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return {
          success: false,
          error: `Failed to update product: ${response.status} ${response.statusText}. ${errorData.errors ? JSON.stringify(errorData.errors) : ''}`,
          status: response.status
        };
      }

      const data = await response.json();
      return {
        success: true,
        data: data.product
      };
    } catch (error) {
      return {
        success: false,
        error: `Failed to update product: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  /**
   * Delete a product from Shopify
   */
  async deleteProduct(id: string): Promise<ShopifyApiResponse<boolean>> {
    try {
      const response = await fetch(this.endpoints.product(id), {
        method: 'DELETE',
        headers: {
          'X-Shopify-Access-Token': this.config.accessToken,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        return {
          success: false,
          error: `Failed to delete product: ${response.status} ${response.statusText}`,
          status: response.status
        };
      }

      return {
        success: true,
        data: true
      };
    } catch (error) {
      return {
        success: false,
        error: `Failed to delete product: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  /**
   * Sync all DS products to Shopify
   */
  async syncAllProducts(dsProducts: any[]): Promise<ShopifySyncResult> {
    const result: ShopifySyncResult = {
      success: true,
      syncedProducts: 0,
      failedProducts: [],
      errors: []
    };

    // First, get existing Shopify products to check for updates
    const existingProductsResponse = await this.getProducts();
    if (!existingProductsResponse.success) {
      result.success = false;
      result.errors.push(`Failed to fetch existing products: ${existingProductsResponse.error}`);
      return result;
    }

    const existingProducts = existingProductsResponse.data || [];
    const existingProductMap = new Map(
      existingProducts.map(p => [p.variants[0]?.sku || '', p])
    );

    // Process each DS product
    for (const dsProduct of dsProducts) {
      try {
        const existingProduct = existingProductMap.get(dsProduct.id);
        
        if (existingProduct) {
          // Update existing product
          const updateResponse = await this.updateProduct(existingProduct.id, dsProduct);
          if (updateResponse.success) {
            result.syncedProducts++;
          } else {
            result.failedProducts.push(dsProduct.id);
            result.errors.push(`Failed to update ${dsProduct.id}: ${updateResponse.error}`);
          }
        } else {
          // Create new product
          const createResponse = await this.createProduct(dsProduct);
          if (createResponse.success) {
            result.syncedProducts++;
          } else {
            result.failedProducts.push(dsProduct.id);
            result.errors.push(`Failed to create ${dsProduct.id}: ${createResponse.error}`);
          }
        }
      } catch (error) {
        result.failedProducts.push(dsProduct.id);
        result.errors.push(`Error processing ${dsProduct.id}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }

    result.success = result.failedProducts.length === 0;
    return result;
  }

  /**
   * Get orders from Shopify
   */
  async getOrders(): Promise<ShopifyApiResponse<ShopifyOrder[]>> {
    try {
      const response = await fetch(this.endpoints.orders, {
        method: 'GET',
        headers: {
          'X-Shopify-Access-Token': this.config.accessToken,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        return {
          success: false,
          error: `Failed to fetch orders: ${response.status} ${response.statusText}`,
          status: response.status
        };
      }

      const data = await response.json();
      return {
        success: true,
        data: data.orders || []
      };
    } catch (error) {
      return {
        success: false,
        error: `Failed to fetch orders: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  /**
   * Get customers from Shopify
   */
  async getCustomers(): Promise<ShopifyApiResponse<ShopifyCustomer[]>> {
    try {
      const response = await fetch(this.endpoints.customers, {
        method: 'GET',
        headers: {
          'X-Shopify-Access-Token': this.config.accessToken,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        return {
          success: false,
          error: `Failed to fetch customers: ${response.status} ${response.statusText}`,
          status: response.status
        };
      }

      const data = await response.json();
      return {
        success: true,
        data: data.customers || []
      };
    } catch (error) {
      return {
        success: false,
        error: `Failed to fetch customers: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  /**
   * Create webhook for order updates
   */
  async createOrderWebhook(webhookUrl: string): Promise<ShopifyApiResponse<any>> {
    try {
      const response = await fetch(this.endpoints.webhooks, {
        method: 'POST',
        headers: {
          'X-Shopify-Access-Token': this.config.accessToken,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          webhook: {
            topic: 'orders/create',
            address: webhookUrl,
            format: 'json'
          }
        })
      });

      if (!response.ok) {
        return {
          success: false,
          error: `Failed to create webhook: ${response.status} ${response.statusText}`,
          status: response.status
        };
      }

      const data = await response.json();
      return {
        success: true,
        data: data.webhook
      };
    } catch (error) {
      return {
        success: false,
        error: `Failed to create webhook: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }
}

// Export singleton instance
export const shopifyApi = new ShopifyApiService();
