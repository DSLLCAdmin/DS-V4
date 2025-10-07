'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CheckoutForm } from '@/components/CheckoutForm';
import { OrderItem } from '@/lib/checkout';

export default function CheckoutPage() {
  const router = useRouter();
  const [items, setItems] = useState<OrderItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Load cart items from localStorage
    const cartData = localStorage.getItem('ds-cart');
    if (cartData) {
      try {
        const cart = JSON.parse(cartData);
        // Handle both old format (direct array) and new format (Cart object)
        const cartItems = cart.items ? cart.items : cart;
        
        if (!Array.isArray(cartItems)) {
          setError('Invalid cart data format');
          setIsLoading(false);
          return;
        }
        
        const orderItems: OrderItem[] = cartItems.map((item: any) => ({
          id: item.id,
          title: item.title,
          author: item.author || 'DS LLC', // Default author if not present
          price: item.price,
          quantity: item.quantity,
          image: item.image,
          category: item.category || 'General' // Default category if not present
        }));
        
        if (orderItems.length === 0) {
          setError('No items in cart');
        } else {
          setItems(orderItems);
        }
      } catch (error) {
        console.error('Error loading cart:', error);
        setError('Failed to load cart items');
      }
    } else {
      setError('No items in cart');
    }
    setIsLoading(false);
  }, []);

  const handleCheckoutSuccess = (orderId: string) => {
    // Redirect to success page with order ID
    router.push(`/checkout/success?orderId=${orderId}`);
  };

  const handleCheckoutError = (error: string) => {
    setError(error);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-checkout-gradient flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading checkout...</p>
        </div>
      </div>
    );
  }

  if (error && items.length === 0) {
    return (
      <div className="min-h-screen bg-checkout-gradient flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-xl mb-4">⚠️ {error}</div>
          <button
            onClick={() => router.push('/shop')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-checkout-gradient">
      <div className="container mx-auto py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            <span className="text-gray-600">Dark</span><span className="text-yellow-500">Street</span> Checkout
          </h1>
          <p className="text-gray-600">
            Complete your purchase securely
          </p>
        </div>
        
        <CheckoutForm
          items={items}
          onSuccess={handleCheckoutSuccess}
          onError={handleCheckoutError}
          error={error}
        />
      </div>
    </div>
  );
}
