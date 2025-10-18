'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CreditCard, Lock, ArrowLeft, CheckCircle } from 'lucide-react';

interface CheckoutData {
  items: Array<{
    id: string;
    quantity: number;
    price: number;
    shopifyVariantId?: number;
  }>;
  shipping: {
    method: string;
    cost: number;
    estimatedDays: string;
  };
  customer: {
    email: string;
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    state: string;
    zip: string;
    phone: string;
  };
  totals: {
    subtotal: number;
    shipping: number;
    tax: number;
    total: number;
  };
}

export default function PaymentPage() {
  const router = useRouter();
  const [checkoutData, setCheckoutData] = useState<CheckoutData | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardInfo, setCardInfo] = useState({
    number: '',
    expiry: '',
    cvv: '',
    name: ''
  });

  useEffect(() => {
    const storedData = localStorage.getItem('checkoutData');
    if (!storedData) {
      router.push('/cart');
      return;
    }
    
    try {
      setCheckoutData(JSON.parse(storedData));
    } catch (error) {
      console.error('Error parsing checkout data:', error);
      router.push('/cart');
    }
  }, [router]);

  const handlePayment = async () => {
    if (!checkoutData) return;
    
    setIsProcessing(true);
    
    try {
      // Create Shopify checkout with all the data
      const response = await fetch('/api/shopify/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: checkoutData.items,
          customer: checkoutData.customer,
          shipping: checkoutData.shipping,
          totals: checkoutData.totals
        }),
      });

      if (!response.ok) {
        throw new Error('Checkout failed');
      }

      const result = await response.json();
      
      if (result.checkoutUrl) {
        // Clear checkout data and redirect to Shopify
        localStorage.removeItem('checkoutData');
        window.location.href = result.checkoutUrl;
      } else {
        throw new Error('No checkout URL received');
      }
      
    } catch (error) {
      console.error('Payment processing error:', error);
      setIsProcessing(false);
      alert('Payment processing failed. Please try again.');
    }
  };

  const handleBackToConfirmation = () => {
    router.push('/checkout/confirmation');
  };

  if (!checkoutData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Loading...</h1>
          <p className="text-gray-600">Please wait while we prepare your payment.</p>
        </div>
      </div>
    );
  }

  const formatPrice = (price: number) => {
    return `$${price.toFixed(2)}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Complete Your Payment</h1>
          <p className="text-gray-600">Secure payment processing powered by Shopify</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Summary */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Summary</h2>
            
            {/* Customer Info */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-2">Shipping To:</h3>
              <p className="text-gray-700">
                {checkoutData.customer.firstName} {checkoutData.customer.lastName}
              </p>
              <p className="text-gray-700">{checkoutData.customer.address}</p>
              <p className="text-gray-700">
                {checkoutData.customer.city}, {checkoutData.customer.state} {checkoutData.customer.zip}
              </p>
              <p className="text-gray-700">{checkoutData.customer.email}</p>
            </div>

            {/* Shipping Method */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-2">Shipping Method:</h3>
              <p className="text-gray-700">
                {checkoutData.shipping.method === 'standard' && 'Standard Shipping'}
                {checkoutData.shipping.method === 'express' && 'Express Shipping'}
                {checkoutData.shipping.method === 'overnight' && 'Overnight Shipping'}
              </p>
              <p className="text-sm text-gray-600">
                Estimated delivery: {checkoutData.shipping.estimatedDays}
              </p>
            </div>

            {/* Order Totals */}
            <div className="border-t pt-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-gray-900">{formatPrice(checkoutData.totals.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="text-gray-900">
                    {checkoutData.totals.shipping === 0 ? 'FREE' : formatPrice(checkoutData.totals.shipping)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span className="text-gray-900">{formatPrice(checkoutData.totals.tax)}</span>
                </div>
                <div className="flex justify-between text-lg font-semibold border-t pt-2">
                  <span className="text-gray-900">Total</span>
                  <span className="text-gray-900">{formatPrice(checkoutData.totals.total)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Information */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Payment Information</h2>
            
            {/* Payment Method Selection */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">Payment Method</h3>
              <div className="space-y-3">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="card"
                    checked={paymentMethod === 'card'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <CreditCard className="w-5 h-5 text-gray-600" />
                  <span className="font-medium text-gray-900">Credit/Debit Card</span>
                </label>
                
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="paypal"
                    checked={paymentMethod === 'paypal'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <div className="w-5 h-5 bg-blue-600 rounded text-white text-xs flex items-center justify-center font-bold">
                    P
                  </div>
                  <span className="font-medium text-gray-900">PayPal</span>
                </label>
              </div>
            </div>

            {/* Security Notice */}
            <div className="mb-6 p-4 bg-green-50 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Lock className="w-5 h-5 text-green-600" />
                <span className="font-semibold text-green-800">Secure Payment</span>
              </div>
              <p className="text-sm text-green-700">
                Your payment information is encrypted and processed securely by Shopify. 
                We never store your payment details.
              </p>
            </div>

            {/* Payment Processing Notice */}
            <div className="mb-6 p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <CheckCircle className="w-5 h-5 text-blue-600" />
                <span className="font-semibold text-blue-800">Payment Processing</span>
              </div>
              <p className="text-sm text-blue-700">
                You will be redirected to Shopify's secure checkout to complete your payment. 
                This ensures maximum security for your transaction.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              <button
                onClick={handlePayment}
                disabled={isProcessing}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
              >
                {isProcessing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Complete Payment - {formatPrice(checkoutData.totals.total)}</span>
                  </>
                )}
              </button>
              
              <button
                onClick={handleBackToConfirmation}
                disabled={isProcessing}
                className="w-full bg-gray-200 text-gray-800 py-3 px-4 rounded-lg font-medium hover:bg-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Order Review</span>
              </button>
            </div>

            {/* Trust Badges */}
            <div className="mt-6 pt-6 border-t">
              <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
                <div className="flex items-center space-x-1">
                  <Lock className="w-4 h-4" />
                  <span>SSL Secured</span>
                </div>
                <div className="flex items-center space-x-1">
                  <CheckCircle className="w-4 h-4" />
                  <span>Shopify Verified</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
