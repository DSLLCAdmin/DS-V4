'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { CreditCard, ExternalLink, Loader2, AlertCircle } from 'lucide-react';

interface ShopifyCheckoutButtonProps {
  cartItems: any[];
  className?: string;
  disabled?: boolean;
  onFallback?: () => void; // Callback for Stripe fallback
}

export function ShopifyCheckoutButton({ cartItems, className, disabled, onFallback }: ShopifyCheckoutButtonProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');

  const handleShopifyCheckout = async () => {
    if (cartItems.length === 0) {
      setError('No items in cart');
      return;
    }

    setIsProcessing(true);
    setError('');

    try {
      // Create checkout session with Shopify
      const response = await fetch('/api/shopify/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: cartItems,
          customer: {
            email: 'customer@example.com', // This should come from a form
            firstName: 'Customer',
            lastName: 'Name'
          }
        })
      });

      const result = await response.json();
      
      console.log('Shopify checkout response:', result);

      if (result.success && result.checkoutUrl) {
        // Redirect to Shopify checkout
        window.location.href = result.checkoutUrl;
      } else if (result.fallback && onFallback) {
        // COMMENTED OUT: Use fallback to Stripe - testing Shopify only
        // setError('Shopify checkout unavailable. Redirecting to alternative payment...');
        // setTimeout(() => {
        //   onFallback();
        // }, 2000);
        
        // Instead, show error and don't fallback
        setError('Shopify checkout failed. Please check console logs for details.');
      } else {
        setError(result.error || 'Checkout failed');
      }
    } catch (error) {
      console.error('Shopify checkout error:', error);
      setError('Checkout failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-2">
      <Button
        onClick={handleShopifyCheckout}
        disabled={disabled || isProcessing || cartItems.length === 0}
        className={`w-full bg-gradient-to-r from-swatch103 to-swatch104 hover:from-swatch104 hover:to-swatch105 text-white text-lg font-bold py-4 rounded-full shadow-lg transition-all duration-300 hover:scale-105 ${className}`}
      >
        {isProcessing ? (
          <>
            <Loader2 className="w-6 h-6 mr-3 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <CreditCard className="w-6 h-6 mr-3" />
            Shopify Checkout
            <ExternalLink className="w-4 h-4 ml-2" />
          </>
        )}
      </Button>
      
      {error && (
        <div className={`text-sm text-center p-3 rounded-lg ${
          error.includes('unavailable') || error.includes('alternative') 
            ? 'text-blue-600 bg-blue-50' 
            : 'text-red-600 bg-red-50'
        }`}>
          {error.includes('unavailable') || error.includes('alternative') ? (
            <>
              <AlertCircle className="w-4 h-4 inline mr-1" />
              {error}
            </>
          ) : (
            <>
              <AlertCircle className="w-4 h-4 inline mr-1" />
              {error}
            </>
          )}
        </div>
      )}
      
      <div className="text-xs text-gray-500 text-center">
        Secure checkout powered by Shopify
      </div>
    </div>
  );
}
