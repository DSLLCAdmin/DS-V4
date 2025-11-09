"use client";

import { useState } from 'react';
import { X, Bell, Clock, Users, Mail, User, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { DarkStreetsTextLogo } from '@/components/DarkStreetsTextLogo';
import { useProductInterest } from '@/hooks/use-product-interest';
import { useCart } from '@/hooks/use-cart';
import { Product } from '@/data/products';

interface InDesignModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}

export function InDesignModal({ product, isOpen, onClose }: InDesignModalProps) {
  const { trackInterest, getInterestCount, sendProductInterestEmail } = useProductInterest();
  const { cart } = useCart();
  const [hasTrackedInterest, setHasTrackedInterest] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    customerMessage: ''
  });
  
  const interestCount = getInterestCount(product.id);

  const handleTrackInterest = async () => {
    // Show contact form first
    setShowContactForm(true);
  };

  const handleSubmitInterest = async () => {
    if (!formData.customerEmail) {
      alert('Please provide your email address');
      return;
    }

    setIsSubmitting(true);
    try {
      // Track interest locally
      await trackInterest(product.id, product.title, product.category);
      
      // Get customer browsing history
      const productsVisited = JSON.parse(localStorage.getItem('customer_product_views') || '[]')
        .map((p: any) => p.productTitle || p.productId)
        .slice(-10); // Last 10 products viewed
      
      const productsPurchased = JSON.parse(localStorage.getItem('customer_purchases') || '[]')
        .map((p: any) => p.items?.map((i: any) => i.productTitle || i.productId).join(', ') || '')
        .filter(Boolean)
        .slice(-10); // Last 10 purchases

      // Send email to ProductInterest@zoho
      const emailSent = await sendProductInterestEmail({
        productId: product.id,
        productTitle: product.title,
        productCategory: product.category || '',
        customerEmail: formData.customerEmail,
        customerName: formData.customerName,
        customerPhone: formData.customerPhone,
        customerMessage: formData.customerMessage,
        productsVisited,
        productsPurchased,
        referrer: document.referrer || 'direct',
        userAgent: navigator.userAgent
      });

      if (emailSent) {
        setHasTrackedInterest(true);
        setShowContactForm(false);
      } else {
        alert('There was an error sending your interest. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting interest:', error);
      alert('There was an error submitting your interest. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-swatch101/95 to-swatch101/85 backdrop-blur-sm rounded-2xl border border-swatch103/30 max-w-md w-full p-6 relative">
        {/* Close Button */}
        <Button
          onClick={onClose}
          variant="ghost"
          size="sm"
          className="absolute top-4 right-4 text-white hover:text-swatch103 hover:bg-white/10"
        >
          <X className="h-4 w-4" />
        </Button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="mb-4">
            <Clock className="h-12 w-12 text-swatch103 mx-auto mb-3" />
            <h2 className="text-2xl font-bold text-white mb-2">
              Coming Soon!
            </h2>
            <p className="text-white/80">
              This <DarkStreetsTextLogo /> product is currently in development
            </p>
          </div>
        </div>

        {/* Product Info */}
        <div className="bg-white/10 rounded-lg p-4 mb-6">
          <h3 className="text-lg font-bold text-white mb-2">
            {product.title}
          </h3>
          <p className="text-white/80 text-sm mb-3">
            by {product.author}
          </p>
          <div className="flex items-center justify-between">
            <span className="text-swatch103 font-bold">
              {product.price === 0 ? "Contact for Price" : `$${product.price.toFixed(2)}`}
            </span>
            <Badge className="bg-swatch102/20 text-swatch102 border-swatch102/30">
              In Development
            </Badge>
          </div>
        </div>

        {/* Interest Tracking */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center space-x-2 mb-3">
            <Users className="h-5 w-5 text-swatch103" />
            <span className="text-white font-medium">
              {interestCount} {interestCount === 1 ? 'person' : 'people'} interested
            </span>
          </div>
          
          {!hasTrackedInterest && !showContactForm ? (
            <Button
              onClick={handleTrackInterest}
              className="bg-gradient-to-r from-swatch103 to-swatch104 hover:from-swatch104 hover:to-swatch105 text-white font-bold py-3 px-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 w-full"
            >
              <Bell className="w-5 h-5 mr-2" />
              Notify Me When Available
            </Button>
          ) : showContactForm ? (
            <div className="space-y-4">
              <p className="text-white/80 text-sm mb-4">
                We'd love to hear from you! Share your contact info and we'll notify you when this product is ready.
              </p>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-white/80 text-sm mb-1">Name (Optional)</label>
                  <Input
                    type="text"
                    placeholder="Your name"
                    value={formData.customerName}
                    onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                  />
                </div>
                
                <div>
                  <label className="block text-white/80 text-sm mb-1">Email <span className="text-red-400">*</span></label>
                  <Input
                    type="email"
                    placeholder="your@email.com"
                    value={formData.customerEmail}
                    onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                    required
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                  />
                </div>
                
                <div>
                  <label className="block text-white/80 text-sm mb-1">Phone (Optional)</label>
                  <Input
                    type="tel"
                    placeholder="(555) 123-4567"
                    value={formData.customerPhone}
                    onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                  />
                </div>
                
                <div>
                  <label className="block text-white/80 text-sm mb-1">Message (Optional)</label>
                  <Textarea
                    placeholder="Tell us what you're looking for..."
                    value={formData.customerMessage}
                    onChange={(e) => setFormData({ ...formData, customerMessage: e.target.value })}
                    rows={3}
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                  />
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button
                  onClick={() => setShowContactForm(false)}
                  variant="outline"
                  className="flex-1 border-white/20 text-white hover:bg-white/10"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmitInterest}
                  disabled={!formData.customerEmail || isSubmitting}
                  className="flex-1 bg-gradient-to-r from-swatch103 to-swatch104 hover:from-swatch104 hover:to-swatch105 text-white font-bold"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <Bell className="w-4 h-4 mr-2" />
                      Submit Interest
                    </>
                  )}
                </Button>
              </div>
            </div>
          ) : (
            <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-3">
              <p className="text-green-400 font-medium flex items-center justify-center">
                <Bell className="w-4 h-4 mr-2" />
                We'll notify you when this product is ready!
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-white/60 text-sm">
            Stay tuned for updates on this exciting new <DarkStreetsTextLogo /> product!
          </p>
        </div>
      </div>
    </div>
  );
}
