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
  items: CartItem[];
  total: number;
  itemCount: number;
}

// Cart state management
class CartManager {
  private cart: Cart = {
    items: [],
    total: 0,
    itemCount: 0
  };

  // Add item to cart
  async addToCart(productId: string, quantity: number = 1) {
    try {
      const shopUrl = `https://${process.env.NEXT_PUBLIC_SHOPIFY_SHOP_NAME}`;
      
      // Create cart if it doesn't exist
      if (!this.cart.items.length) {
        const createResponse = await fetch(`${shopUrl}/admin/api/2024-01/carts.json`, {
          method: 'POST',
          headers: {
            'X-Shopify-Access-Token': process.env.NEXT_PUBLIC_SHOPIFY_ACCESS_TOKEN!,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            cart: {
              line_items: [{
                variant_id: productId,
                quantity: quantity
              }]
            }
          })
        });

        if (createResponse.ok) {
          const cartData = await createResponse.json();
          this.updateCartFromShopify(cartData.cart);
          return true;
        }
      } else {
        // Add to existing cart
        const addResponse = await fetch(`${shopUrl}/admin/api/2024-01/carts/${this.cart.id}/line_items.json`, {
          method: 'POST',
          headers: {
            'X-Shopify-Access-Token': process.env.NEXT_PUBLIC_SHOPIFY_ACCESS_TOKEN!,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            line_item: {
              variant_id: productId,
              quantity: quantity
            }
          })
        });

        if (addResponse.ok) {
          const cartData = await addResponse.json();
          this.updateCartFromShopify(cartData.cart);
          return true;
        }
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      return false;
    }
  }

  // Update item quantity
  async updateQuantity(itemId: string, quantity: number) {
    try {
      const shopUrl = `https://${process.env.NEXT_PUBLIC_SHOPIFY_SHOP_NAME}`;
      
      const response = await fetch(`${shopUrl}/admin/api/2024-01/carts/${this.cart.id}/line_items/${itemId}.json`, {
        method: 'PUT',
        headers: {
          'X-Shopify-Access-Token': process.env.NEXT_PUBLIC_SHOPIFY_ACCESS_TOKEN!,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          line_item: {
            id: itemId,
            quantity: quantity
          }
        })
      });

      if (response.ok) {
        const cartData = await response.json();
        this.updateCartFromShopify(cartData.cart);
        return true;
      }
    } catch (error) {
      console.error('Error updating quantity:', error);
      return false;
    }
  }

  // Remove item from cart
  async removeFromCart(itemId: string) {
    try {
      const shopUrl = `https://${process.env.NEXT_PUBLIC_SHOPIFY_SHOP_NAME}`;
      
      const response = await fetch(`${shopUrl}/admin/api/2024-01/carts/${this.cart.id}/line_items/${itemId}.json`, {
        method: 'DELETE',
        headers: {
          'X-Shopify-Access-Token': process.env.NEXT_PUBLIC_SHOPIFY_ACCESS_TOKEN!
        }
      });

      if (response.ok) {
        const cartData = await response.json();
        this.updateCartFromShopify(cartData.cart);
        return true;
      }
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
  }

  // Update cart from Shopify response
  private updateCartFromShopify(shopifyCart: any) {
    this.cart = {
      id: shopifyCart.id,
      items: shopifyCart.line_items?.map((item: any) => ({
        id: item.id,
        title: item.title,
        price: parseFloat(item.price),
        quantity: item.quantity,
        image: item.image,
        variant_id: item.variant_id
      })) || [],
      total: parseFloat(shopifyCart.total_price || 0),
      itemCount: shopifyCart.item_count || 0
    };
  }
}

// Export singleton instance
export const cartManager = new CartManager();
