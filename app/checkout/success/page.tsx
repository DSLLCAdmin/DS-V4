"use client";
import React from 'react';
import Link from 'next/link';
import { CheckCircle, ShoppingBag, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function CheckoutSuccess() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-200 via-slate-400 to-slate-600 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        {/* Success Icon */}
        <div className="mb-6">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
        </div>

        {/* Success Message */}
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Order Placed Successfully!
        </h1>
        
        <p className="text-gray-600 mb-8">
          Thank you for your purchase! Your order has been received and will be processed shortly.
        </p>

        {/* Action Buttons */}
        <div className="space-y-4">
          <Link href="/shop" className="block">
            <Button className="w-full bg-gradient-to-r from-swatch103 to-swatch104 hover:from-swatch104 hover:to-swatch103 text-white">
              <ShoppingBag className="w-5 h-5 mr-2" />
              Continue Shopping
            </Button>
          </Link>
          
          <Link href="/" className="block">
            <Button variant="outline" className="w-full">
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>

        {/* Additional Info */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            You will receive an email confirmation shortly with your order details.
          </p>
        </div>
      </div>
    </div>
  );
}
