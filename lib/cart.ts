// Cart management for Shopify integration
export interface CartItem {
  id: string;
  title: string;
  price: number;
  quantity: number;
  image?: string;
  variant_id?: string;
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
  async addToCart(productId: string, quantity: number = 1) {
    try {
      // For now, we'll use a local cart implementation
      // This can be enhanced later with Shopify Storefront API
      
      // Find existing item in cart
      const existingItemIndex = this.cart.items.findIndex(item => item.id === productId);
      
      if (existingItemIndex >= 0) {
        // Update existing item quantity
        this.cart.items[existingItemIndex].quantity += quantity;
      } else {
        // Add new item to cart
        // We'll need to get product details from our local products data
        const product = await this.getProductDetails(productId);
        if (product) {
          this.cart.items.push({
            id: productId,
            title: product.title,
            price: product.price,
            quantity: quantity,
            image: product.image,
            variant_id: productId // Using product ID as variant ID for now
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
  private async getProductDetails(productId: string) {
    try {
      // Import products data dynamically to avoid circular imports
      const { products } = await import('../data/products');
      const product = products.find(p => String(p.id) === productId);
      
      if (product) {
        return {
          title: product.Title,
          price: parseFloat(product.SalePrice?.replace(/[^0-9.]/g, '') || '0'),
          image: product.image
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
    this.cart.itemCount = this.cart.items.reduce((sum, item) => sum + item.quantity, 0);
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
        }
      } catch (error) {
        console.error('Error loading cart from storage:', error);
        this.cart = { items: [], total: 0, itemCount: 0 };
      }
    }
  }
}

// Export singleton instance
export const cartManager = new CartManager();
