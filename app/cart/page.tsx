"use client";

import { useState } from 'react';
import { ShoppingCart, Plus, Minus, Trash2, ArrowLeft, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Navigation } from '@/components/navigation';
import { FloatingElement, ScrollReveal } from '@/components/floating-elements';
import { useCart } from '@/hooks/use-cart';
import { products } from '@/data/products';
import Link from 'next/link';
import { DarkStreetsTextLogo } from '@/components/DarkStreetsTextLogo';
import { useScrollMemory } from '@/hooks/use-scroll-memory';
import { useRouter } from 'next/navigation';
import { ShopifyCheckoutButton } from '@/components/ShopifyCheckoutButton';

export default function CartPage() {
  const { cart, loading, updateQuantity, removeFromCart, clearCart } = useCart();
  const [isUpdating, setIsUpdating] = useState<string | null>(null);
  const { saveScrollPosition } = useScrollMemory();
  const router = useRouter();

  const handleUpdateQuantity = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      await removeFromCart(itemId);
      return;
    }
    
    setIsUpdating(itemId);
    try {
      await updateQuantity(itemId, newQuantity);
    } catch (error) {
      console.error('Failed to update quantity:', error);
    } finally {
      setIsUpdating(null);
    }
  };

  const handleRemoveItem = async (itemId: string) => {
    setIsUpdating(itemId);
    try {
      await removeFromCart(itemId);
    } catch (error) {
      console.error('Failed to remove item:', error);
    } finally {
      setIsUpdating(null);
    }
  };

  const handleClearCart = async () => {
    if (confirm('Are you sure you want to clear your cart?')) {
      await clearCart();
    }
  };

  const handleBackToShop = (e: React.MouseEvent) => {
    e.preventDefault();
    
    // Save current scroll position before navigating
    if (typeof window !== 'undefined') {
      const currentScroll = window.scrollY;
      saveScrollPosition('/shop', currentScroll);
      console.log(`💾 Cart: Saved scroll position before navigation: ${currentScroll}px`);
    }
    
    // Use router.push for client-side navigation
    router.push('/shop');
  };

  const formatPrice = (price: number) => {
    if (price === 0) return "Contact for Price";
    return `$${price.toFixed(2)}`;
  };

  const getProductById = (id: string) => {
    return products.find(p => p.id === id);
  };

  if (cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#1A0F0A] via-[#8B4513] to-[#D2691E] overflow-hidden">
        <Navigation />
        
        {/* Floating Background Elements */}
        <div className="fixed inset-0 pointer-events-none">
          <FloatingElement speed={0.2} className="absolute top-48 left-12 opacity-5">
            <ShoppingCart className="h-40 w-40 text-swatch103" />
          </FloatingElement>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <ScrollReveal>
              <div className="bg-gradient-to-br from-swatch101/95 to-swatch101/85 backdrop-blur-sm rounded-2xl p-12 border border-swatch103/30">
                <ShoppingCart className="h-24 w-24 text-swatch103 mx-auto mb-6 opacity-50" />
                <h1 className="text-4xl font-bold text-white mb-4">Your Cart is Empty</h1>
                <p className="text-xl text-white/80 mb-8">
                  Start shopping to add items to your cart
                </p>
                <Link href="/shop">
                  <Button className="bg-gradient-to-r from-swatch103 to-swatch104 hover:from-swatch104 hover:to-swatch105 text-white text-lg font-bold py-4 px-8 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105">
                    <ShoppingCart className="w-6 h-6 mr-3" />
                    Start Shopping
                  </Button>
                </Link>
              </div>
            </ScrollReveal>
          </div>
        </div>

        <Navigation variant="footer" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1A0F0A] via-[#8B4513] to-[#D2691E] overflow-hidden">
      <Navigation />
      
      {/* Floating Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        <FloatingElement speed={0.2} className="absolute top-48 left-12 opacity-5">
          <ShoppingCart className="h-40 w-40 text-swatch103" />
        </FloatingElement>
        <FloatingElement speed={0.15} direction="down" className="absolute top-96 right-20 opacity-5">
          <CreditCard className="h-32 w-32 text-swatch104" />
        </FloatingElement>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="mb-8">
          {/* Mobile Header */}
          <div className="sm:hidden">
            <div className="text-center mb-4">
              <h1 className="text-2xl font-bold text-white mb-2">
                Your <DarkStreetsTextLogo /> Cart
              </h1>
              <p className="text-white/80 text-sm">
                {cart.itemCount} {cart.itemCount === 1 ? 'item' : 'items'} in your cart
              </p>
            </div>
            
            <div className="flex justify-between items-center">
              <Button 
                onClick={handleBackToShop}
                variant="outline" 
                size="sm"
                className="border-swatch103/30 text-swatch103 hover:bg-swatch103/10"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                <span className="hidden xs:inline">Continue Shopping</span>
                <span className="xs:hidden">Back</span>
              </Button>

              <Button
                onClick={handleClearCart}
                variant="outline"
                size="sm"
                className="border-red-500/30 text-red-400 hover:bg-red-500/10"
              >
                <Trash2 className="h-4 w-4 mr-1" />
                <span className="hidden xs:inline">Clear Cart</span>
                <span className="xs:hidden">Clear</span>
              </Button>
            </div>
          </div>

          {/* Desktop Header */}
          <div className="hidden sm:flex justify-between items-center">
            <Button 
              onClick={handleBackToShop}
              variant="outline" 
              className="border-swatch103/30 text-swatch103 hover:bg-swatch103/10"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Continue Shopping
            </Button>
            
            <div className="text-center">
              <h1 className="text-3xl font-bold text-white mb-2">
                Your <DarkStreetsTextLogo /> Cart
              </h1>
              <p className="text-white/80">
                {cart.itemCount} {cart.itemCount === 1 ? 'item' : 'items'} in your cart
              </p>
            </div>

            <Button
              onClick={handleClearCart}
              variant="outline"
              className="border-red-500/30 text-red-400 hover:bg-red-500/10"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Clear Cart
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {cart.items.map((item) => {
              const product = getProductById(item.id);
              if (!product) return null;

              return (
                <ScrollReveal key={item.id}>
                  <Card className="bg-gradient-to-br from-swatch101/95 to-swatch101/85 backdrop-blur-sm border border-swatch103/30">
                    <CardContent className="p-4 sm:p-6">
                      {/* Mobile Layout */}
                      <div className="flex flex-col space-y-4 sm:hidden">
                        {/* Product Image and Details */}
                        <div className="flex items-start space-x-4">
                          <div className="flex-shrink-0">
                            {product.image && product.image !== "/product-images/placeholder.jpg" ? (
                              <img
                                src={product.image}
                                alt={product.title}
                                className="w-16 h-16 object-cover rounded-lg"
                              />
                            ) : (
                              <div className="w-16 h-16 bg-gradient-to-br from-swatch201/30 to-swatch202/20 rounded-lg flex items-center justify-center">
                                <ShoppingCart className="h-6 w-6 text-swatch204 opacity-50" />
                              </div>
                            )}
                          </div>
                          <div className="flex-grow min-w-0">
                            <h3 className="text-lg font-bold text-white mb-1 truncate">
                              {product.title}
                            </h3>
                            <p className="text-white/80 text-sm mb-1">by {product.author}</p>
                            <p className="text-lg font-bold text-swatch103">
                              {formatPrice(product.price)}
                            </p>
                          </div>
                        </div>
                        
                        {/* Mobile Controls */}
                        <div className="flex items-center justify-between">
                          {/* Quantity Controls */}
                          <div className="flex items-center space-x-3">
                            <Button
                              onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                              disabled={isUpdating === item.id}
                              variant="outline"
                              size="sm"
                              className="border-swatch103/30 text-swatch103 hover:bg-swatch103/10 h-8 w-8 p-0"
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            
                            <span className="text-white font-bold text-base min-w-[2rem] text-center">
                              {item.quantity}
                            </span>
                            
                            <Button
                              onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                              disabled={isUpdating === item.id}
                              variant="outline"
                              size="sm"
                              className="border-swatch103/30 text-swatch103 hover:bg-swatch103/10 h-8 w-8 p-0"
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>

                          {/* Remove Button */}
                          <Button
                            onClick={() => handleRemoveItem(item.id)}
                            disabled={isUpdating === item.id}
                            variant="outline"
                            size="sm"
                            className="border-red-500/30 text-red-400 hover:bg-red-500/10 h-8 w-8 p-0"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>

                      {/* Desktop Layout */}
                      <div className="hidden sm:flex items-center space-x-6">
                        {/* Product Image */}
                        <div className="flex-shrink-0">
                          {product.image && product.image !== "/product-images/placeholder.jpg" ? (
                            <img
                              src={product.image}
                              alt={product.title}
                              className="w-20 h-20 object-cover rounded-lg"
                            />
                          ) : (
                            <div className="w-20 h-20 bg-gradient-to-br from-swatch201/30 to-swatch202/20 rounded-lg flex items-center justify-center">
                              <ShoppingCart className="h-8 w-8 text-swatch204 opacity-50" />
                            </div>
                          )}
                        </div>

                        {/* Product Details */}
                        <div className="flex-grow">
                          <h3 className="text-xl font-bold text-white mb-2">
                            {product.title}
                          </h3>
                          <p className="text-white/80 mb-2">by {product.author}</p>
                          <p className="text-lg font-bold text-swatch103">
                            {formatPrice(product.price)}
                          </p>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center space-x-3">
                          <Button
                            onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                            disabled={isUpdating === item.id}
                            variant="outline"
                            size="sm"
                            className="border-swatch103/30 text-swatch103 hover:bg-swatch103/10"
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          
                          <span className="text-white font-bold text-lg min-w-[2rem] text-center">
                            {item.quantity}
                          </span>
                          
                          <Button
                            onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                            disabled={isUpdating === item.id}
                            variant="outline"
                            size="sm"
                            className="border-swatch103/30 text-swatch103 hover:bg-swatch103/10"
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>

                        {/* Remove Button */}
                        <Button
                          onClick={() => handleRemoveItem(item.id)}
                          disabled={isUpdating === item.id}
                          variant="outline"
                          size="sm"
                          className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </ScrollReveal>
              );
            })}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <ScrollReveal>
              <Card className="bg-gradient-to-br from-swatch101/95 to-swatch101/85 backdrop-blur-sm border border-swatch103/30 sticky top-8">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-white text-center">
                    Order Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    <div className="flex justify-between text-white">
                      <span>Items ({cart.itemCount})</span>
                      <span>${cart.total.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-white">
                      <span>Shipping</span>
                      <span className="text-green-400">FREE</span>
                    </div>
                    <div className="border-t border-swatch103/30 pt-3">
                      <div className="flex justify-between text-xl font-bold text-white">
                        <span>Total</span>
                        <span>${cart.total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={() => router.push('/checkout')}
                    className="w-full bg-gradient-to-r from-swatch103 to-swatch104 hover:from-swatch104 hover:to-swatch105 text-white text-lg font-bold py-4 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105"
                    disabled={loading}
                  >
                    <CreditCard className="w-6 h-6 mr-3" />
                    {loading ? 'Processing...' : 'Proceed to Checkout'}
                  </Button>

                  <div className="my-4 text-center text-white/60 text-sm">
                    OR
                  </div>

                  <ShopifyCheckoutButton 
                    cartItems={cart.items}
                    disabled={loading}
                  />

                  <p className="text-center text-white/60 text-sm mt-4">
                    Secure checkout powered by <DarkStreetsTextLogo />
                  </p>
                </CardContent>
              </Card>
            </ScrollReveal>
          </div>
        </div>
      </div>

      <Navigation variant="footer" />
    </div>
  );
}
