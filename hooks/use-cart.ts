import { useState, useEffect } from 'react';
import { cartManager, Cart, CartItem } from '../lib/cart';

export function useCart() {
  const [cart, setCart] = useState<Cart>({
    items: [],
    total: 0,
    itemCount: 0
  });
  const [loading, setLoading] = useState(false);

  // Update cart state
  const updateCart = () => {
    setCart(cartManager.getCart());
  };

  // Add item to cart (supports attributes like size)
  const addToCart = async (productId: string, quantity: number = 1, attributes?: Record<string, string>) => {
    setLoading(true);
    try {
      const success = await cartManager.addToCart(productId, quantity, attributes);
      if (success) {
        updateCart();
      }
      return success;
    } catch (error) {
      console.error('Error adding to cart:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Update item quantity
  const updateQuantity = async (itemId: string, quantity: number) => {
    setLoading(true);
    try {
      const success = await cartManager.updateQuantity(itemId, quantity);
      if (success) {
        updateCart();
      }
      return success;
    } catch (error) {
      console.error('Error updating quantity:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Remove item from cart
  const removeFromCart = async (itemId: string) => {
    setLoading(true);
    try {
      const success = await cartManager.removeFromCart(itemId);
      if (success) {
        updateCart();
      }
      return success;
    } catch (error) {
      console.error('Error removing from cart:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Clear cart
  const clearCart = async () => {
    setLoading(true);
    try {
      await cartManager.clearCart();
      // Force immediate state update
      setCart({
        items: [],
        total: 0,
        itemCount: 0
      });
      updateCart();
    } catch (error) {
      console.error('Error clearing cart:', error);
    } finally {
      setLoading(false);
    }
  };

  // Initialize cart on mount
  useEffect(() => {
    updateCart();
  }, []);

  return {
    cart,
    loading,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    itemCount: cart.itemCount,
    total: cart.total
  };
}
