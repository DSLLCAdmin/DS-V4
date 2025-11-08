"use client";

import { useState } from 'react';
import { ShoppingCart, Heart, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/hooks/use-cart';
import { Product, ProductVariant } from '@/data/products';
import { DarkStreetsTextLogo } from '@/components/DarkStreetsTextLogo';
import { isProductInDesign } from '@/lib/product-utils';
import { InDesignModal } from '@/components/InDesignModal';
import { ProductImageGallery, useProductImages } from '@/components/ProductImageGallery';
import { SizeGuide } from '@/components/SizeGuide';

interface ProductPageClientProps {
  product: Product;
}

export function ProductPageClient({ product }: ProductPageClientProps) {
  const { addToCart, itemCount } = useCart();
  const [isAdding, setIsAdding] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const [showInDesignModal, setShowInDesignModal] = useState(false);
  
  // Variant selection state
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    product.variants && product.variants.length > 0 ? product.variants[0] : null
  );
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [showSizeError, setShowSizeError] = useState(false);
  
  // Get images based on selected variant or default product ID
  const variantImageSetKey = selectedVariant?.imageSetKey;
  const { images, loading } = useProductImages(product.id, variantImageSetKey);
  
  const isInDesign = isProductInDesign(product);
  
  // Get current price from selected variant or product default
  const currentPrice = selectedVariant?.price ?? product.price;
  // Get current Shopify variant ID from selected variant or product default
  const currentShopifyVariantId = selectedVariant?.shopifyVariantId ?? product.shopifyVariantId;

  const handleAddToCart = async () => {
    // Check if product is In-Design first
    if (isInDesign) {
      setShowInDesignModal(true);
      return;
    }
    
    // Validate size selection for apparel products
    if (product.category === 'Apparel' && !selectedSize) {
      setShowSizeError(true);
      setTimeout(() => setShowSizeError(false), 1000); // Wiggle for 1 second
      return;
    }
    
    // Validate variant selection for products with variants (like mugs)
    if (product.variants && product.variants.length > 0 && !selectedVariant) {
      setShowSizeError(true);
      setTimeout(() => setShowSizeError(false), 1000);
      return;
    }
    
    if (!product.inStock) return;
    if (selectedVariant && !selectedVariant.inStock) return;
    
    setIsAdding(true);
    try {
      // Use selected variant's Shopify ID if available, otherwise use product's default
      const shopifyVariantId = currentShopifyVariantId;
      
      // Create cart item with variant information
      const attributes: Record<string, string> = {};
      if (product.category === 'Apparel' && selectedSize) {
        attributes.size = selectedSize;
      }
      if (selectedVariant?.size) {
        attributes.variant = selectedVariant.size;
      }
      
      // Add variant ID to attributes for checkout
      if (shopifyVariantId) {
        attributes.shopifyVariantId = shopifyVariantId.toString();
      }
      
      const success = await addToCart(product.id, 1, Object.keys(attributes).length > 0 ? attributes : undefined);
      if (success) {
        setIsAdded(true);
        setTimeout(() => setIsAdded(false), 2000);
      }
    } catch (error) {
      console.error('Failed to add to cart:', error);
    } finally {
      setIsAdding(false);
    }
  };
  
  // Handle variant selection (for products with variants like mugs)
  const handleVariantSelect = (variant: ProductVariant) => {
    setSelectedVariant(variant);
  };

  const formatPrice = (price: number) => {
    if (price === 0) return "Contact for Price";
    return `$${price.toFixed(2)}`;
  };

  const getBadgeColor = (badge: string | null) => {
    if (!badge) return "";
    switch (badge.toLowerCase()) {
      case "best seller": return "bg-swatch103/20 text-swatch103 border-swatch103/30";
      case "limited edition": return "bg-swatch104/20 text-swatch104 border-swatch104/30";
      case "eco-friendly": return "bg-swatch201/20 text-swatch203 border-swatch201/30";
      case "new arrival": return "bg-swatch102/20 text-swatch105 border-swatch102/30";
      case "staff pick": return "bg-swatch101/20 text-swatch105 border-swatch101/30";
      case "new": return "bg-swatch102/20 text-swatch105 border-swatch102/30";
      default: return "bg-swatch201/20 text-swatch204 border-swatch201/30";
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Product Image Gallery */}
      <div className="lg:w-1/2">
        <div className="relative bg-gradient-to-br from-swatch101/20 to-swatch101/10 rounded-2xl p-8 border border-swatch103/20">
          {loading ? (
            <div className="w-full h-96 bg-gradient-to-br from-swatch201/30 to-swatch202/20 rounded-lg flex items-center justify-center">
              <div className="text-center text-swatch204">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-swatch103 mx-auto mb-4"></div>
                <p className="text-lg font-medium">Loading Images...</p>
              </div>
            </div>
          ) : images.length > 0 ? (
            <ProductImageGallery
              images={images}
              productTitle={product.title}
              className="w-full"
            />
          ) : product.image && product.image !== "/product-images/placeholder.jpg" ? (
            <div className="relative">
              <img
                src={product.image}
                alt={product.title}
                className="w-full h-auto max-h-96 object-contain rounded-lg"
              />
            </div>
          ) : (
            <div className="w-full h-96 bg-gradient-to-br from-swatch201/30 to-swatch202/20 rounded-lg flex items-center justify-center">
              <div className="text-center text-swatch204">
                <ShoppingCart className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">Image Coming Soon</p>
              </div>
            </div>
          )}
          
          {product.badge && (
            <Badge className={`absolute top-4 right-4 z-10 ${getBadgeColor(product.badge)} font-bold text-sm px-3 py-1`}>
              {product.badge}
            </Badge>
          )}
        </div>
      </div>

      {/* Product Details */}
      <div className="lg:w-1/2 space-y-6">
        {/* Title and Author */}
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-swatch101 mb-2">
            {product.title}
          </h1>
          <div className="flex items-center justify-between mb-4">
            <p className="text-xl text-swatch101/80">by {product.author}</p>
            <p className="text-sm text-swatch101/80">
              ID: {product.id}
            </p>
          </div>
          
          {product.category && (
            <Badge variant="outline" className="bg-swatch103/10 text-swatch101 border-swatch103/30 mb-4">
              {product.category}
            </Badge>
          )}
        </div>

        {/* Price - Show range if variants exist */}
        <div className="space-y-2">
          <div className="text-3xl font-bold text-swatch101">
            {product.variants && product.variants.length > 0 ? (
              (() => {
                const prices = product.variants.map(v => v.price).filter(p => p > 0);
                const minPrice = Math.min(...prices);
                const maxPrice = Math.max(...prices);
                const hasRange = minPrice !== maxPrice;
                return hasRange ? `${formatPrice(minPrice)} - ${formatPrice(maxPrice)}` : formatPrice(currentPrice);
              })()
            ) : (
              formatPrice(currentPrice)
            )}
          </div>
          {product.variants && product.variants.length > 0 && selectedVariant && (
            <p className="text-sm text-swatch101/70">
              Selected: {selectedVariant.size} - {formatPrice(selectedVariant.price)}
            </p>
          )}
        </div>

        {/* Variant selector for products with variants (e.g., Mug sizes) */}
        {product.variants && product.variants.length > 0 && (
          <div className={`space-y-3 mt-4 p-4 bg-swatch101/10 rounded-lg border border-swatch103/30 ${showSizeError ? 'animate-wiggle' : ''}`}>
            <div className="text-base font-bold text-swatch101 mb-3">Select Size:</div>
            <div className="flex flex-wrap gap-3">
              {product.variants.map((variant) => (
                <button
                  key={variant.size || variant.shopifyVariantId}
                  onClick={() => handleVariantSelect(variant)}
                  disabled={!variant.inStock}
                  className={`px-6 py-3 rounded-lg border-2 font-semibold transition-all ${
                    selectedVariant?.size === variant.size
                      ? 'bg-swatch103 text-white border-swatch103 shadow-lg scale-105'
                      : variant.inStock
                        ? 'bg-white text-swatch101 border-swatch103/50 hover:border-swatch103 hover:shadow-md'
                        : 'bg-gray-200 text-gray-400 border-gray-300 cursor-not-allowed'
                  }`}
                >
                  <div className="flex flex-col items-center">
                    <span className="text-lg">{variant.size}</span>
                    <span className={`text-sm ${selectedVariant?.size === variant.size ? 'text-white' : 'text-swatch101/70'}`}>
                      {formatPrice(variant.price)}
                    </span>
                  </div>
                  {!variant.inStock && <span className="text-xs mt-1">(Out of Stock)</span>}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Size selector for Apparel */}
        {product.category === 'Apparel' && product.sizeGuide && (
          <div className={`space-y-3 ${showSizeError ? 'animate-wiggle' : ''}`}>
            <div className="text-sm font-semibold text-swatch101/80">Size</div>
            <div className="flex flex-wrap gap-2">
              {Object.keys(product.sizeGuide.imperial).map((sizeKey) => (
                <button
                  key={sizeKey}
                  onClick={() => setSelectedSize(sizeKey)}
                  className={`px-4 py-2 rounded-full border transition-all ${
                    selectedSize === sizeKey
                      ? 'bg-swatch101 text-white border-swatch103'
                      : 'bg-white text-[#6A8085] border-swatch103/30 hover:border-swatch103'
                  }`}
                >
                  {sizeKey}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Add to Cart Button */}
        <div className="space-y-4">
          <Button
            onClick={handleAddToCart}
            disabled={(!product.inStock && !isInDesign) || isAdding}
            className={`w-full py-4 text-lg font-bold rounded-full transition-all duration-300 ${
              isInDesign
                ? "bg-gradient-to-r from-swatch102 to-swatch103 hover:from-swatch103 hover:to-swatch104 text-white hover:scale-105"
                : product.inStock 
                  ? isAdded
                    ? "bg-green-600 hover:bg-green-700 text-white"
                    : "bg-gradient-to-r from-swatch103 to-swatch104 hover:from-swatch104 hover:to-swatch105 text-white hover:scale-105"
                  : "bg-gray-500 text-gray-300 cursor-not-allowed"
            }`}
          >
            {isAdding ? (
              <>
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                Adding...
              </>
            ) : isAdded ? (
              <>
                <Star className="h-6 w-6 mr-3" />
                Added to Cart!
              </>
            ) : isInDesign ? (
              <>
                <Star className="h-6 w-6 mr-3" />
                Coming Soon - Show Interest
              </>
            ) : (
              <>
                <ShoppingCart className="h-6 w-6 mr-3" />
                {product.inStock ? "Add to Cart" : "Out of Stock"}
              </>
            )}
          </Button>

          {/* Size Guide for Apparel */}
          {product.category === "Apparel" && (
            <div className="flex justify-center">
              <SizeGuide
                sizeGuide={product.sizeGuide}
                sizeGuideImages={product.sizeGuideImages}
              />
            </div>
          )}

          {isInDesign && (
            <div className="text-center">
              <Badge variant="secondary" className="bg-swatch102/20 text-swatch102 border-swatch102/30 font-bold text-lg px-6 py-3">
                In Development
              </Badge>
            </div>
          )}

          {!product.inStock && !isInDesign && (
            <div className="text-center">
              <Badge variant="secondary" className="bg-swatch101 text-white font-bold text-lg px-6 py-3 border-2 border-swatch103">
                Out of Stock
              </Badge>
            </div>
          )}
        </div>

        {/* Product Description */}
        <div className="bg-gradient-to-br from-swatch101/95 to-swatch101/85 backdrop-blur-sm rounded-2xl p-4 border border-swatch103/30">
          <h2 className="text-xl font-bold text-black mb-3">Description</h2>
          <p className="text-base text-black leading-relaxed">
            {product.longDescription || product.description || (
              <>
                <DarkStreetsTextLogo /> exclusive product
              </>
            )}
          </p>
        </div>

        {/* Special Product Descriptions */}
        {product.id === "1a" && (
          <div className="bg-gradient-to-br from-swatch102/20 to-swatch103/20 rounded-2xl p-4 border border-swatch102/30">
            <h3 className="text-lg font-bold text-black mb-3">🎭 STAGE ONE - THE BEGINNING</h3>
            <p className="text-black leading-relaxed text-sm">
              Meet Aries Tiger and Dance in this electrifying first chapter. Experience LA's <DarkStreetsTextLogo /> through their eyes as they cruise complexions in street culture, relationships, and self-discovery.
            </p>
          </div>
        )}

        {/* Universal Product Features */}
        <div className="bg-gradient-to-br from-swatch103/20 to-swatch104/20 rounded-2xl p-4 border border-swatch103/30">
          <h3 className="text-lg font-bold text-black mb-3">✨ Product Features</h3>
          <ul className="space-y-2 text-black">
            <li className="flex items-center space-x-2">
              <span className="text-swatch103">•</span>
              <span>Exclusive D-Street Design</span>
            </li>
            <li className="flex items-center space-x-2">
              <span className="text-swatch103">•</span>
              <span>{product.category === "Serials/Books" ? "Premium Printing" : "Premium quality materials"}</span>
            </li>
            <li className="flex items-center space-x-2">
              <span className="text-swatch103">•</span>
              <span>Raised by <DarkStreetsTextLogo /></span>
            </li>
            {product.category === "Serials/Books" && (
              <li className="flex items-center space-x-2">
                <span className="text-swatch103">•</span>
                <span>We play digitally and physically</span>
              </li>
            )}
          </ul>
        </div>
      </div>

      {/* In-Design Modal */}
      <InDesignModal
        product={product}
        isOpen={showInDesignModal}
        onClose={() => setShowInDesignModal(false)}
      />

      {/* Wiggle Animation CSS */}
      <style jsx global>{`
        @keyframes wiggle {
          0% { transform: translateX(0); }
          20% { transform: translateX(-5px); }
          40% { transform: translateX(5px); }
          60% { transform: translateX(-5px); }
          80% { transform: translateX(5px); }
          100% { transform: translateX(0); }
        }
        .animate-wiggle {
          animation: wiggle 0.3s ease-in-out 3; /* Wiggle 3 times */
        }
      `}</style>
    </div>
  );
}
