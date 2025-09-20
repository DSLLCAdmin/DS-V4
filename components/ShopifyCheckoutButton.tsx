'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { CreditCard, ExternalLink, Loader2 } from 'lucide-react';
import { createShopifyCheckout } from '@/lib/shopify-integration';

interface ShopifyCheckoutButtonProps {
  cartItems: any[];
  className?: string;
  disabled?: boolean;
}

export function ShopifyCheckoutButton({ cartItems, className, disabled }: ShopifyCheckoutButtonProps) {
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
      // Check if Shopify is configured
      const storeName = process.env.NEXT_PUBLIC_SHOPIFY_STORE_NAME || 'darkstreetllc';
      const accessToken = process.env.NEXT_PUBLIC_SHOPIFY_ACCESS_TOKEN;
      
      if (!accessToken) {
        throw new Error('Shopify not configured. Please set up your Shopify store first.');
      }

      // Create Shopify checkout session
      const checkout = await createShopifyCheckout(cartItems);
      
      if (checkout && checkout.web_url) {
        // Redirect to Shopify checkout
        window.location.href = checkout.web_url;
      } else {
        throw new Error('Failed to create checkout session');
      }
    } catch (error) {
      console.error('Shopify checkout error:', error);
      setError(error instanceof Error ? error.message : 'Checkout failed');
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-2">
      <Button
        onClick={handleShopifyCheckout}
        disabled={disabled || isProcessing || cartItems.length === 0}
        className={`w-full bg-gradient-to-r from-swatch103 to-swatch104 hover:from-swatch104 hover:to-swatch105 text-white text-lg font-bold py-4 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 ${className}`}
      >
        {isProcessing ? (
          <>
            <Loader2 className="w-6 h-6 mr-3 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <CreditCard className="w-6 h-6 mr-3" />
            Checkout with Shopify
            <ExternalLink className="w-4 h-4 ml-2" />
          </>
        )}
      </Button>
      
      {error && (
        <div className="text-red-600 text-sm text-center">
          ⚠️ {error}
        </div>
      )}
      
      <div className="text-xs text-gray-500 text-center">
        Secure checkout powered by Shopify
      </div>
    </div>
  );
}
