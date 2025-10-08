import React from 'react';
import { Package, Truck, Clock, CheckCircle, MapPin } from 'lucide-react';

export default function ShippingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-swatch101 via-swatch102 to-swatch103">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-white mb-6">
            Shipping & Delivery
          </h1>
          <p className="text-xl text-white/80 max-w-3xl mx-auto">
            Clear, transparent shipping rates and delivery options for all DS LLC products
          </p>
        </div>

        {/* Shipping Rates */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {/* Free Shipping */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
            <div className="flex items-center mb-6">
              <CheckCircle className="w-8 h-8 text-green-400 mr-4" />
              <h2 className="text-3xl font-bold text-white">Free Shipping</h2>
            </div>
            <div className="space-y-4">
              <div className="text-2xl font-bold text-green-400">Orders $50+</div>
              <p className="text-white/80 text-lg">
                Enjoy free standard shipping on all orders of $50 or more. 
                No hidden fees, no minimums beyond the threshold.
              </p>
              <ul className="space-y-2 text-white/70">
                <li>• Standard delivery (5-8 business days)</li>
                <li>• Tracking included</li>
                <li>• Applies to all product categories</li>
              </ul>
            </div>
          </div>

          {/* Standard Shipping */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
            <div className="flex items-center mb-6">
              <Truck className="w-8 h-8 text-blue-400 mr-4" />
              <h2 className="text-3xl font-bold text-white">Standard Shipping</h2>
            </div>
            <div className="space-y-4">
              <div className="text-2xl font-bold text-blue-400">$4.99</div>
              <p className="text-white/80 text-lg">
                Flat rate shipping for orders under $50. 
                Reliable delivery with full tracking.
              </p>
              <ul className="space-y-2 text-white/70">
                <li>• 5-8 business days delivery</li>
                <li>• Tracking included</li>
                <li>• Signature confirmation available</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Product-Specific Shipping */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 mb-16">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">
            Product-Specific Shipping Details
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            {/* Digital Books */}
            <div className="text-center">
              <Package className="w-12 h-12 text-purple-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Digital Books</h3>
              <p className="text-white/70">
                Instant download after purchase. No shipping required.
              </p>
            </div>

            {/* Physical Books */}
            <div className="text-center">
              <MapPin className="w-12 h-12 text-orange-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Physical Books</h3>
              <p className="text-white/70">
                Printed on-demand and shipped directly from our publishing partner.
              </p>
            </div>

            {/* Apparel */}
            <div className="text-center">
              <Truck className="w-12 h-12 text-pink-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Apparel</h3>
              <p className="text-white/70">
                Made-to-order and shipped directly from our fulfillment partner.
              </p>
            </div>
          </div>
        </div>

        {/* Express Shipping */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 mb-16">
          <div className="flex items-center mb-6">
            <Clock className="w-8 h-8 text-yellow-400 mr-4" />
            <h2 className="text-3xl font-bold text-white">Express Shipping</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <div className="text-2xl font-bold text-yellow-400 mb-4">$9.99</div>
              <p className="text-white/80 text-lg mb-4">
                Need it faster? Express shipping delivers in 2-3 business days.
              </p>
              <ul className="space-y-2 text-white/70">
                <li>• 2-3 business days delivery</li>
                <li>• Priority handling</li>
                <li>• Tracking included</li>
                <li>• Available for most products</li>
              </ul>
            </div>
            <div className="bg-yellow-400/20 rounded-lg p-6">
              <h3 className="text-xl font-bold text-white mb-3">Express Shipping Rules</h3>
              <ul className="space-y-2 text-white/80">
                <li>• Orders placed before 2 PM PST ship same day</li>
                <li>• Weekend orders ship Monday</li>
                <li>• Not available for digital products</li>
                <li>• Additional $5 for remote areas</li>
              </ul>
            </div>
          </div>
        </div>

        {/* International Shipping */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 mb-16">
          <h2 className="text-3xl font-bold text-white mb-6 text-center">
            International Shipping
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-bold text-white mb-4">Canada & Mexico</h3>
              <ul className="space-y-2 text-white/70">
                <li>• Standard: $12.99 (7-10 business days)</li>
                <li>• Express: $19.99 (3-5 business days)</li>
                <li>• Customs fees may apply</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-4">Other Countries</h3>
              <ul className="space-y-2 text-white/70">
                <li>• Standard: $15.99 (10-14 business days)</li>
                <li>• Express: $24.99 (5-7 business days)</li>
                <li>• Customs and duties customer responsibility</li>
              </ul>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">
            Shipping FAQ
          </h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold text-white mb-2">
                How is shipping calculated?
              </h3>
              <p className="text-white/70">
                Shipping is calculated based on order total and selected delivery method. 
                Orders $50+ get free standard shipping. Orders under $50 pay $4.99 standard or $9.99 express.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-2">
                Can I track my order?
              </h3>
              <p className="text-white/70">
                Yes! All orders include tracking information. You'll receive tracking details 
                via email once your order ships.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-2">
                What if my order is damaged?
              </h3>
              <p className="text-white/70">
                We'll replace any damaged items at no cost to you. Contact our support team 
                with photos of the damage and we'll process a replacement immediately.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-2">
                Do you ship to PO Boxes?
              </h3>
              <p className="text-white/70">
                Yes, we ship to PO Boxes for standard shipping. Express shipping requires 
                a physical address for delivery confirmation.
              </p>
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="text-center mt-16">
          <p className="text-white/80 text-lg mb-4">
            Questions about shipping? We're here to help!
          </p>
          <a 
            href="/contact" 
            className="inline-block bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 rounded-full font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300"
          >
            Contact Support
          </a>
        </div>
      </div>
    </div>
  );
}
