'use client';

import { useState } from 'react';
import { Product } from '@/data/products';
import { processKDPFulfillment, isKDPProduct } from '@/lib/kdp-fulfillment';

interface KDPCheckoutProps {
  product: Product;
  onComplete?: () => void;
}

export default function KDPCheckout({ product, onComplete }: KDPCheckoutProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleKDPFulfillment = async () => {
    if (!isKDPProduct(product)) {
      setError('This product is not configured for KDP fulfillment');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const result = processKDPFulfillment({
        product,
        customerEmail: '', // Will be filled from checkout form
        customerName: ''   // Will be filled from checkout form
      });

      if (result.success && result.redirectUrl) {
        // Redirect to KDP/Amazon
        window.location.href = result.redirectUrl;
      } else {
        setError(result.error || 'Failed to process KDP fulfillment');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isKDPProduct(product)) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-orange-500 to-red-600 rounded-lg p-6 text-white">
      <div className="flex items-center mb-4">
        <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center mr-3">
          <span className="text-orange-600 font-bold text-sm">K</span>
        </div>
        <div>
          <h3 className="text-lg font-bold">Kindle Direct Publishing</h3>
          <p className="text-orange-100 text-sm">
            {product.kdpType === 'ebook' ? 'E-book Download' : 'Paperback Purchase'}
          </p>
        </div>
      </div>

      <div className="mb-4">
        <p className="text-sm mb-2">
          {product.kdpType === 'ebook' 
            ? 'This e-book will be delivered through Amazon Kindle. You can read it on any device with the Kindle app.'
            : 'This paperback will be fulfilled by Amazon with Prime shipping benefits. You\'ll be redirected to Amazon to complete your purchase.'
          }
        </p>
        
        <div className="bg-white/20 rounded p-3 text-sm">
          <p className="font-semibold mb-1">Benefits:</p>
          <ul className="list-disc list-inside space-y-1 text-orange-100">
            <li>Amazon Prime shipping (paperbacks)</li>
            <li>Read on any device (e-books)</li>
            <li>Amazon customer service</li>
            <li>Easy returns and exchanges</li>
          </ul>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/20 border border-red-400 rounded p-3 mb-4">
          <p className="text-red-100 text-sm">{error}</p>
        </div>
      )}

      <button
        onClick={handleKDPFulfillment}
        disabled={isProcessing}
        className="w-full bg-white text-orange-600 font-bold py-3 px-6 rounded-lg hover:bg-orange-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isProcessing ? (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-orange-600 mr-2"></div>
            Processing...
          </div>
        ) : (
          product.kdpType === 'ebook' ? 'Download from Amazon Kindle' : 'Purchase from Amazon'
        )}
      </button>

      <p className="text-xs text-orange-200 mt-3 text-center">
        You'll be redirected to Amazon to complete your purchase
      </p>
    </div>
  );
}
