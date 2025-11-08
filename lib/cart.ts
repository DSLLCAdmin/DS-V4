// Cart management for Shopify integration
export interface CartItem {
  id: string;
  title: string;
  price: number;
  quantity: number;
  image?: string;
  variant_id?: string;
  shopifyVariantId?: number; // Add Shopify variant ID
  attributes?: Record<string, string>; // e.g., { size: 'M' }
}

export interface Cart {
  id?: string; // Shopify cart ID
  items: CartItem[];
  total: number;
  itemCount: number;
}

// Cart state management using localStorage for client-side cart
class CartManager {
  private cart: Cart = {
    id: undefined,
    items: [],
    total: 0,
    itemCount: 0
  };

  constructor() {
    this.loadCartFromStorage();
  }

  // Add item to cart
  async addToCart(productId: string, quantity: number = 1, attributes?: Record<string, string>) {
    try {
      // For now, we'll use a local cart implementation
      // This can be enhanced later with Shopify Storefront API
      
      // Extract variant-specific information from attributes
      const variantShopifyId = attributes?.shopifyVariantId ? parseInt(attributes.shopifyVariantId) : undefined;
      const variantSize = attributes?.variant;
      
      // Find existing item in cart
      // Consider attributes when finding an existing line (e.g., different sizes are different lines)
      // Use shopifyVariantId for matching if available, otherwise use attributes
      const existingItemIndex = this.cart.items.findIndex(item => {
        if (variantShopifyId && item.shopifyVariantId) {
          // Match by Shopify variant ID if both have it
          return item.id === productId && item.shopifyVariantId === variantShopifyId;
        }
        // Fallback to attribute matching
        return item.id === productId && JSON.stringify(item.attributes || {}) === JSON.stringify(attributes || {});
      });
      
      if (existingItemIndex >= 0) {
        // Update existing item quantity
        this.cart.items[existingItemIndex].quantity += quantity;
      } else {
        // Add new item to cart
        // We'll need to get product details from our local products data
        const product = await this.getProductDetails(productId, variantSize, variantShopifyId);
        if (product) {
          // Create unique cart item ID that includes variant info
          const cartItemId = variantShopifyId 
            ? `${productId}-${variantShopifyId}` 
            : variantSize 
              ? `${productId}-${variantSize}` 
              : productId;
          
          this.cart.items.push({
            id: cartItemId,
            title: product.title,
            price: product.price, // Use variant-specific price if available
            quantity: quantity,
            image: product.image,
            variant_id: productId, // Keep for compatibility
            shopifyVariantId: product.shopifyVariantId, // Use variant-specific Shopify variant ID
            attributes
          });
        } else {
          console.error('Product not found:', productId);
          return false;
        }
      }
      
      this.updateCartTotals();
      this.saveCartToStorage();
      return true;
    } catch (error) {
      console.error('Error adding to cart:', error);
      return false;
    }
  }

  // Update item quantity
  async updateQuantity(itemId: string, quantity: number) {
    try {
      const itemIndex = this.cart.items.findIndex(item => item.id === itemId);
      
      if (itemIndex >= 0) {
        if (quantity <= 0) {
          // Remove item if quantity is 0 or negative
          this.cart.items.splice(itemIndex, 1);
        } else {
          this.cart.items[itemIndex].quantity = quantity;
        }
        
        this.updateCartTotals();
        this.saveCartToStorage();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error updating quantity:', error);
      return false;
    }
  }

  // Remove item from cart
  async removeFromCart(itemId: string) {
    try {
      const itemIndex = this.cart.items.findIndex(item => item.id === itemId);
      
      if (itemIndex >= 0) {
        this.cart.items.splice(itemIndex, 1);
        this.updateCartTotals();
        this.saveCartToStorage();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error removing from cart:', error);
      return false;
    }
  }

  // Get current cart
  getCart(): Cart {
    return this.cart;
  }

  // Clear cart
  async clearCart() {
    this.cart = {
      items: [],
      total: 0,
      itemCount: 0
    };
    this.saveCartToStorage();
  }

  // Get product details from local products data
  private async getProductDetails(productId: string, variantSize?: string, variantShopifyId?: number) {
    try {
      // Import products data dynamically to avoid circular imports
      const { products } = await import('../data/products');
      const product = products.find(p => String(p.id) === productId);
      
      if (product) {
        // If variant information is provided, use variant-specific data
        if (variantSize && product.variants && product.variants.length > 0) {
          const variant = product.variants.find(v => v.size === variantSize);
          if (variant) {
            return {
              title: `${product.title} - ${variant.size}`,
              price: variant.price,
              image: product.image, // Could be variant-specific image in future
              shopifyVariantId: variant.shopifyVariantId
            };
          }
        }
        
        // If variantShopifyId is provided, find matching variant
        if (variantShopifyId && product.variants && product.variants.length > 0) {
          const variant = product.variants.find(v => v.shopifyVariantId === variantShopifyId);
          if (variant) {
            return {
              title: `${product.title} - ${variant.size}`,
              price: variant.price,
              image: product.image,
              shopifyVariantId: variant.shopifyVariantId
            };
          }
        }
        
        // Default to product's base data
        return {
          title: product.title,
          price: product.price || 0,
          image: product.image,
          shopifyVariantId: product.shopifyVariantId
        };
      }
      return null;
    } catch (error) {
      console.error('Error getting product details:', error);
      return null;
    }
  }

  // Update cart totals
  private updateCartTotals() {
    this.cart.total = this.cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    // Count total quantities instead of unique products
    this.cart.itemCount = this.cart.items.reduce((sum, item) => sum + item.quantity, 0);
    console.log(`🛒 Cart totals updated: ${this.cart.itemCount} total items, $${this.cart.total.toFixed(2)}`);
    console.log(`🛒 Cart items:`, this.cart.items.map(item => `${item.title} x${item.quantity}`));
  }

  // Save cart to localStorage
  private saveCartToStorage() {
    if (typeof window !== 'undefined') {
      localStorage.setItem('ds-cart', JSON.stringify(this.cart));
    }
  }

  // Load cart from localStorage
  private loadCartFromStorage() {
    if (typeof window !== 'undefined') {
      try {
        const savedCart = localStorage.getItem('ds-cart');
        if (savedCart) {
          this.cart = JSON.parse(savedCart);
          // Ensure all cart items have shopifyVariantId - do this synchronously
          this.enrichCartItemsWithShopifyDataSync();
        }
      } catch (error) {
        console.error('Error loading cart from storage:', error);
        this.cart = { items: [], total: 0, itemCount: 0 };
      }
    }
  }

  // Enrich existing cart items with Shopify variant IDs (synchronous version)
  private enrichCartItemsWithShopifyDataSync() {
    try {
      // Import products data synchronously
      const { products } = require('../data/products');
      
      let enriched = false;
      for (const item of this.cart.items) {
        if (!item.shopifyVariantId) {
          const product = products.find((p: any) => String(p.id) === item.id);
          if (product && product.shopifyVariantId) {
            item.shopifyVariantId = product.shopifyVariantId;
            enriched = true;
            console.log(`🔄 Enriched cart item ${item.title} with shopifyVariantId: ${product.shopifyVariantId}`);
          }
        }
      }
      
      // Save the enriched cart back to storage if any items were enriched
      if (enriched) {
        this.saveCartToStorage();
      }
    } catch (error) {
      console.error('Error enriching cart items:', error);
    }
  }
}

// Export singleton instance
export const cartManager = new CartManager();
