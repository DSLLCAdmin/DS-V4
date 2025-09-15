"use client";

import { useState } from 'react';
import { X, Bell, Clock, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DarkStreetsTextLogo } from '@/components/DarkStreetsTextLogo';
import { useProductInterest } from '@/hooks/use-product-interest';
import { Product } from '@/data/products';

interface InDesignModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}

export function InDesignModal({ product, isOpen, onClose }: InDesignModalProps) {
  const { trackInterest, getInterestCount } = useProductInterest();
  const [hasTrackedInterest, setHasTrackedInterest] = useState(false);
  
  const interestCount = getInterestCount(product.id);

  const handleTrackInterest = () => {
    trackInterest(product.id);
    setHasTrackedInterest(true);
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
          
          {!hasTrackedInterest ? (
            <Button
              onClick={handleTrackInterest}
              className="bg-gradient-to-r from-swatch103 to-swatch104 hover:from-swatch104 hover:to-swatch105 text-white font-bold py-3 px-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 w-full"
            >
              <Bell className="w-5 h-5 mr-2" />
              Notify Me When Available
            </Button>
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
