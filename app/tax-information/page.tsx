import React from 'react';
import { Calculator, MapPin, Info, AlertCircle } from 'lucide-react';
import { Navigation } from '@/components/navigation';
import { FloatingElement, ScrollReveal } from '@/components/floating-elements';
import { DarkStreetsTextLogo } from '@/components/DarkStreetsTextLogo';

export default function TaxInformationPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-swatch101 via-swatch102 to-swatch103">
      <Navigation />
      
      {/* Floating Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        <FloatingElement speed={0.2} className="absolute top-48 left-12 opacity-5">
          <Calculator className="h-40 w-40 text-swatch103" />
        </FloatingElement>
        <FloatingElement speed={0.15} direction="down" className="absolute top-96 right-20 opacity-5">
          <MapPin className="h-32 w-32 text-swatch104" />
        </FloatingElement>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <ScrollReveal>
            <h1 className="text-5xl font-bold text-white mb-6">
              Tax Information
            </h1>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              Understanding how taxes are calculated for your <DarkStreetsTextLogo /> orders
            </p>
          </ScrollReveal>
        </div>

        {/* Current Status */}
        <div className="bg-yellow-400/20 backdrop-blur-lg rounded-2xl p-8 border border-yellow-400/30 mb-16">
          <div className="flex items-start space-x-4">
            <AlertCircle className="w-8 h-8 text-yellow-400 flex-shrink-0 mt-1" />
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">Current Tax Status</h2>
              <p className="text-white/80 text-lg mb-4">
                We're currently experiencing a technical issue with automatic tax calculation in our checkout system. 
                Shopify is investigating this issue.
              </p>
              <p className="text-white/80 text-lg">
                <strong>What this means:</strong> Tax will be calculated manually based on your shipping address 
                during order processing. You'll see the final tax amount in your order confirmation.
              </p>
            </div>
          </div>
        </div>

        {/* How Taxes Work */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 mb-16">
          <div className="flex items-center mb-6">
            <Info className="w-8 h-8 text-blue-400 mr-4" />
            <h2 className="text-3xl font-bold text-white">How Taxes Are Calculated</h2>
          </div>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold text-white mb-3">Sales Tax Basics</h3>
              <p className="text-white/80 text-lg">
                Sales tax is calculated based on your shipping address and the products you're purchasing. 
                Different states have different tax rates, and some products may be tax-exempt.
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-bold text-white mb-3">DS LLC Tax Rates</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-white/5 rounded-lg p-4">
                  <h4 className="font-bold text-white mb-2">California (Primary)</h4>
                  <p className="text-white/70">8.5% sales tax</p>
                </div>
                <div className="bg-white/5 rounded-lg p-4">
                  <h4 className="font-bold text-white mb-2">Other States</h4>
                  <p className="text-white/70">Varies by state (0% - 10%)</p>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-xl font-bold text-white mb-3">Product Categories</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-white/80">Physical Books</span>
                  <span className="text-green-400 font-semibold">Taxable</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/80">Digital Books (eBooks)</span>
                  <span className="text-yellow-400 font-semibold">Varies by State</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/80">Apparel (Tees, Caps)</span>
                  <span className="text-green-400 font-semibold">Taxable</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/80">Shipping</span>
                  <span className="text-green-400 font-semibold">Taxable</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tax Examples */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 mb-16">
          <div className="flex items-center mb-6">
            <Calculator className="w-8 h-8 text-green-400 mr-4" />
            <h2 className="text-3xl font-bold text-white">Tax Calculation Examples</h2>
          </div>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold text-white mb-4">Example Order: $19.98 + $4.90 Shipping</h3>
              
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-white/5 rounded-lg p-4">
                  <h4 className="font-bold text-white mb-2">Wyoming (6%)</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-white/70">Subtotal:</span>
                      <span className="text-white">$19.98</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/70">Shipping:</span>
                      <span className="text-white">$4.90</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/70">Tax:</span>
                      <span className="text-white">$1.49</span>
                    </div>
                    <div className="flex justify-between border-t border-white/20 pt-1">
                      <span className="text-white font-bold">Total:</span>
                      <span className="text-white font-bold">$26.37</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white/5 rounded-lg p-4">
                  <h4 className="font-bold text-white mb-2">California (8.5%)</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-white/70">Subtotal:</span>
                      <span className="text-white">$19.98</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/70">Shipping:</span>
                      <span className="text-white">$4.90</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/70">Tax:</span>
                      <span className="text-white">$2.11</span>
                    </div>
                    <div className="flex justify-between border-t border-white/20 pt-1">
                      <span className="text-white font-bold">Total:</span>
                      <span className="text-white font-bold">$26.99</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white/5 rounded-lg p-4">
                  <h4 className="font-bold text-white mb-2">Oregon (0%)</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-white/70">Subtotal:</span>
                      <span className="text-white">$19.98</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/70">Shipping:</span>
                      <span className="text-white">$4.90</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/70">Tax:</span>
                      <span className="text-white">$0.00</span>
                    </div>
                    <div className="flex justify-between border-t border-white/20 pt-1">
                      <span className="text-white font-bold">Total:</span>
                      <span className="text-white font-bold">$24.88</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 mb-16">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">
            Tax FAQ
          </h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold text-white mb-2">
                Why don't I see tax in my cart?
              </h3>
              <p className="text-white/70">
                We're currently experiencing a technical issue with automatic tax calculation. 
                Tax will be calculated during order processing based on your shipping address.
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-bold text-white mb-2">
                When will I see the final tax amount?
              </h3>
              <p className="text-white/70">
                You'll see the final tax amount in your order confirmation email and on your receipt. 
                The tax will be calculated based on your shipping address.
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-bold text-white mb-2">
                Are digital products taxable?
              </h3>
              <p className="text-white/70">
                Digital product taxability varies by state. Some states tax digital products, 
                others don't. We'll calculate the appropriate tax based on your location.
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-bold text-white mb-2">
                What if I'm tax-exempt?
              </h3>
              <p className="text-white/70">
                If you have a valid tax exemption certificate, please contact us before placing 
                your order so we can process it correctly.
              </p>
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="text-center">
          <p className="text-white/80 text-lg mb-4">
            Questions about taxes? We're here to help!
          </p>
          <a 
            href="/contact" 
            className="inline-block bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 rounded-full font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300"
          >
            Contact Support
          </a>
        </div>
      </div>

      <Navigation variant="footer" />
    </div>
  );
}
