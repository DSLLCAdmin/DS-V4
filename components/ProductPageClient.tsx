"use client";

import { useState } from 'react';
import { ShoppingCart, Heart, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/hooks/use-cart';
import { Product } from '@/data/products';
import { DarkStreetsTextLogo } from '@/components/DarkStreetsTextLogo';

interface ProductPageClientProps {
  product: Product;
}

export function ProductPageClient({ product }: ProductPageClientProps) {
  const { addToCart, itemCount } = useCart();
  const [isAdding, setIsAdding] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = async () => {
    if (!product.inStock) return;
    
    setIsAdding(true);
    try {
      const success = await addToCart(product.id);
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
      {/* Product Image */}
      <div className="lg:w-1/2">
        <div className="relative bg-gradient-to-br from-swatch101/20 to-swatch101/10 rounded-2xl p-8 border border-swatch103/20">
          {product.image && product.image !== "/product-images/placeholder.jpg" ? (
            <img
              src={product.image}
              alt={product.title}
              className="w-full h-auto max-h-96 object-contain rounded-lg"
            />
          ) : (
            <div className="w-full h-96 bg-gradient-to-br from-swatch201/30 to-swatch202/20 rounded-lg flex items-center justify-center">
              <div className="text-center text-swatch204">
                <ShoppingCart className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">Image Coming Soon</p>
              </div>
            </div>
          )}
          
          {product.badge && (
            <Badge className={`absolute top-4 right-4 ${getBadgeColor(product.badge)} font-bold text-sm px-3 py-1`}>
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
          <p className="text-xl text-swatch101/80 mb-4">by {product.author}</p>
          
          {product.category && (
            <Badge variant="outline" className="bg-swatch103/10 text-swatch101 border-swatch103/30 mb-4">
              {product.category}
            </Badge>
          )}
        </div>

        {/* Price */}
        <div className="text-3xl font-bold text-swatch101">
          {formatPrice(product.price)}
        </div>

        {/* Add to Cart Button */}
        <div className="space-y-4">
          <Button
            onClick={handleAddToCart}
            disabled={!product.inStock || isAdding}
            className={`w-full py-4 text-lg font-bold rounded-full transition-all duration-300 ${
              product.inStock 
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
            ) : (
              <>
                <ShoppingCart className="h-6 w-6 mr-3" />
                {product.inStock ? "Add to Cart" : "Out of Stock"}
              </>
            )}
          </Button>

          {!product.inStock && (
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
    </div>
  );
}
