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
      // For now, show a helpful message about Shopify setup
      // This will be replaced with actual Shopify integration once store is set up
      throw new Error('Shopify integration coming soon! Please use "Proceed to Checkout" for now.');
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
        className={`w-full bg-gradient-to-r from-gray-400 to-gray-500 hover:from-gray-500 hover:to-gray-600 text-white text-lg font-bold py-4 rounded-full shadow-lg transition-all duration-300 ${className}`}
      >
        {isProcessing ? (
          <>
            <Loader2 className="w-6 h-6 mr-3 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <CreditCard className="w-6 h-6 mr-3" />
            Shopify Checkout (Coming Soon)
            <ExternalLink className="w-4 h-4 ml-2" />
          </>
        )}
      </Button>
      
      {error && (
        <div className="text-blue-600 text-sm text-center bg-blue-50 p-3 rounded-lg">
          ℹ️ {error}
        </div>
      )}
      
      <div className="text-xs text-gray-500 text-center">
        Shopify integration will be available after store setup
      </div>
    </div>
  );
}
