'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/hooks/use-cart';
import { CartItem } from '@/lib/cart';

const formatPrice = (price: number) => {
  return `$${price.toFixed(2)}`;
};

interface ShippingMethod {
  id: string;
  name: string;
  price: number;
  estimatedDays: string;
  description: string;
}

const SHIPPING_METHODS: ShippingMethod[] = [
  {
    id: 'standard',
    name: 'Standard Shipping',
    price: 4.99,
    estimatedDays: '5-7 business days',
    description: 'USPS Ground shipping'
  },
  {
    id: 'express',
    name: 'Express Shipping',
    price: 9.99,
    estimatedDays: '2-3 business days',
    description: 'USPS Priority Mail'
  },
  {
    id: 'overnight',
    name: 'Overnight Shipping',
    price: 19.99,
    estimatedDays: '1 business day',
    description: 'FedEx Overnight'
  }
];

export default function OrderConfirmationPage() {
  const router = useRouter();
  const { cart, clearCart } = useCart();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [selectedShipping, setSelectedShipping] = useState<ShippingMethod>(SHIPPING_METHODS[0]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    phone: ''
  });

  useEffect(() => {
    setCartItems(cart.items);
    
    if (cart.items.length === 0) {
      router.push('/cart');
    }
  }, [cart.items, router]);

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal >= 50 ? 0 : selectedShipping.price;
  const tax = Math.round((subtotal + shipping) * 0.085 * 100) / 100; // 8.5% CA tax
  const total = subtotal + shipping + tax;

  const handleProceedToPayment = async () => {
    setIsProcessing(true);
    
    try {
      // Create checkout with shipping method
      const checkoutData = {
        items: cartItems.map(item => ({
          id: item.id,
          quantity: item.quantity,
          price: item.price,
          shopifyVariantId: item.shopifyVariantId
        })),
        shipping: {
          method: selectedShipping.id,
          cost: shipping,
          estimatedDays: selectedShipping.estimatedDays
        },
        customer: customerInfo,
        totals: {
          subtotal,
          shipping,
          tax,
          total
        }
      };

      // Store checkout data for payment page
      localStorage.setItem('checkoutData', JSON.stringify(checkoutData));
      
      // Redirect to payment
      router.push('/checkout/payment');
      
    } catch (error) {
      console.error('Error proceeding to payment:', error);
      setIsProcessing(false);
    }
  };

  const handleBackToCart = () => {
    router.push('/cart');
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">No Items in Cart</h1>
          <p className="text-gray-600 mb-8">Please add items to your cart before proceeding.</p>
          <button
            onClick={() => router.push('/shop')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Review Your Order</h1>
          <p className="text-gray-600">Please review your order details and shipping information</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Summary */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Summary</h2>
            
            {/* Items */}
            <div className="space-y-4 mb-6">
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-center space-x-4">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{item.title}</h3>
                    <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">{formatPrice(item.price * item.quantity)}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Shipping Methods */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Shipping Method</h3>
              <div className="space-y-3">
                {SHIPPING_METHODS.map((method) => (
                  <label key={method.id} className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      name="shipping"
                      value={method.id}
                      checked={selectedShipping.id === method.id}
                      onChange={() => setSelectedShipping(method)}
                      className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <div className="flex-1">
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-gray-900">{method.name}</span>
                        <span className="font-medium text-gray-900">
                          {method.price === 0 ? 'FREE' : formatPrice(method.price)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{method.description}</p>
                      <div className="mt-1 p-2 bg-blue-50 border border-blue-200 rounded-md">
                        <p className="text-sm font-semibold text-blue-900">
                          Estimated Delivery: <span className="text-blue-700">{method.estimatedDays}</span>
                        </p>
                        <p className="text-xs text-blue-700 mt-0.5">
                          Your package will arrive within this timeframe after order processing
                        </p>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Order Totals */}
            <div className="border-t pt-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-gray-900">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="text-gray-900">
                    {shipping === 0 ? 'FREE' : formatPrice(shipping)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span className="text-gray-900">{formatPrice(tax)}</span>
                </div>
                <div className="flex justify-between text-lg font-semibold border-t pt-2">
                  <span className="text-gray-900">Total</span>
                  <span className="text-gray-900">{formatPrice(total)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Customer Information */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Shipping Information</h2>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={customerInfo.firstName}
                    onChange={(e) => setCustomerInfo({...customerInfo, firstName: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={customerInfo.lastName}
                    onChange={(e) => setCustomerInfo({...customerInfo, lastName: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={customerInfo.email}
                  onChange={(e) => setCustomerInfo({...customerInfo, email: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Street Address *
                </label>
                <input
                  type="text"
                  required
                  value={customerInfo.address}
                  onChange={(e) => setCustomerInfo({...customerInfo, address: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    required
                    value={customerInfo.city}
                    onChange={(e) => setCustomerInfo({...customerInfo, city: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    State *
                  </label>
                  <input
                    type="text"
                    required
                    value={customerInfo.state}
                    onChange={(e) => setCustomerInfo({...customerInfo, state: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ZIP Code *
                  </label>
                  <input
                    type="text"
                    required
                    value={customerInfo.zip}
                    onChange={(e) => setCustomerInfo({...customerInfo, zip: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={customerInfo.phone}
                  onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 space-y-4">
              <button
                onClick={handleProceedToPayment}
                disabled={isProcessing || !customerInfo.firstName || !customerInfo.lastName || !customerInfo.email || !customerInfo.address || !customerInfo.city || !customerInfo.state || !customerInfo.zip}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {isProcessing ? 'Processing...' : `Proceed to Payment - ${formatPrice(total)}`}
              </button>
              
              <button
                onClick={handleBackToCart}
                className="w-full bg-gray-200 text-gray-800 py-3 px-4 rounded-lg font-medium hover:bg-gray-300 transition-colors"
              >
                Back to Cart
              </button>
            </div>

            {/* Important Notice */}
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Important:</strong> By proceeding to payment, you agree to our 
                <a href="/return-policy" className="underline hover:no-underline"> Return Policy</a> and 
                <a href="/shipping-policy" className="underline hover:no-underline"> Shipping Policy</a>.
                Tax and shipping calculated and total shown before Shopify checkout.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
