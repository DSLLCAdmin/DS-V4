import { useParams, useRouter } from 'next/navigation';
import { ShoppingCart, Heart, Star, ArrowLeft, Users, MapPin, Book, Award, Shield, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Navigation, BackButton } from '@/components/navigation';
import { FloatingElement, ScrollReveal } from '@/components/floating-elements';
import { products } from '@/data/products';
import { useCart } from '@/hooks/use-cart';
import Link from 'next/link';

// Generate static params for all products
export async function generateStaticParams() {
  return products.map((product) => ({
    id: product.id,
  }));
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = products.find(p => p.id === id);

  // Client-side functionality will be handled by separate components

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

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#1A0F0A] via-[#8B4513] to-[#D2691E] flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-3xl font-bold mb-4">Product Not Found</h1>
          <p className="text-lg mb-6">The product you're looking for doesn't exist.</p>
          <Link href="/shop">
            <Button className="bg-gradient-to-r from-swatch103 to-swatch104 hover:from-swatch104 hover:to-swatch103 text-swatch101 px-6 py-3">
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Shop
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1A0F0A] via-[#8B4513] to-[#D2691E] overflow-hidden">
      <Navigation />
      
      {/* Cart Icon - Will be handled by client component */}
      <div className="fixed top-4 right-4 z-50">
        <Button
          variant="ghost"
          size="lg"
          className="bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 text-white"
        >
          <ShoppingCart className="h-6 w-6" />
        </Button>
      </div>

      {/* Floating Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        <FloatingElement speed={0.2} className="absolute top-48 left-12 opacity-5">
          <Book className="h-40 w-40 text-swatch103" />
        </FloatingElement>
        <FloatingElement speed={0.15} direction="down" className="absolute top-96 right-20 opacity-5">
          <Award className="h-32 w-32 text-swatch104" />
        </FloatingElement>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Back Button */}
        <div className="mb-8">
          <Link href="/shop">
            <Button variant="outline" className="border-swatch103/30 text-swatch103 hover:bg-swatch103/10">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to StreetStore
            </Button>
          </Link>
        </div>

        {/* Product Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Product Image */}
          <div className="space-y-6">
            <ScrollReveal>
              <div className="relative overflow-hidden rounded-2xl shadow-2xl bg-gradient-to-br from-swatch101/95 to-swatch101/85 backdrop-blur-sm border border-swatch103/30">
                <div className="relative w-full h-96 bg-gradient-to-br from-swatch205/10 to-swatch205/5 rounded-2xl overflow-hidden">
                  {(!product.image || product.image === "" || product.image.startsWith('Product in-Design') || product.image === "Need Image Here" || product.image.includes('placeholder') || product.image.includes('Placeholder')) ? (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-swatch101/40 to-swatch102/30 border-2 border-swatch101/20">
                      <div className="text-center p-6">
                        <div className="mb-4 transform hover:scale-110 transition-transform duration-300">
                          <img 
                            src="/Icons/palette-colorful.svg" 
                            alt="Design Palette" 
                            className="h-32 w-32 mx-auto drop-shadow-lg"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                              const fallback = document.createElement('div');
                              fallback.className = 'text-6xl text-swatch103';
                              fallback.textContent = '🎨';
                              e.currentTarget.parentNode?.appendChild(fallback);
                              e.preventDefault();
                            }}
                          />
                        </div>
                        <p className="text-xl font-bold text-swatch101 mb-1 drop-shadow-lg font-extrabold underline decoration-2 underline-offset-4">Product in-Design</p>
                        <p className="text-base text-green-800 font-bold drop-shadow-md">Tell us your ideas!</p>
                      </div>
                    </div>
                  ) : (
                    <img
                      src={product.image}
                      alt={product.title}
                      className="w-full h-full object-contain transition-transform duration-300 hover:scale-105"
                      loading="lazy"
                    />
                  )}
                </div>
                
                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-swatch205/30 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500"></div>
                
                {/* Badges */}
                {product.badge && (
                  <Badge className={`absolute top-4 left-4 ${getBadgeColor(product.badge)} border-2 font-semibold text-xs px-3 py-1 shadow-lg z-10`}>
                    {product.badge}
                  </Badge>
                )}

                {/* Featured Badge for First Light E-Book */}
                {product.id === "1a" && (
                  <Badge className="absolute top-4 right-4 bg-gradient-to-r from-swatch102 to-swatch103 text-swatch101 border-2 border-swatch101 font-bold text-xs px-3 py-1 shadow-lg animate-pulse z-10">
                    ⭐ FEATURED
                  </Badge>
                )}
              </div>
            </ScrollReveal>
          </div>

          {/* Product Information */}
          <div className="space-y-8">
            <ScrollReveal delay={200}>
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <h1 className="text-4xl md:text-5xl font-black text-swatch204 leading-tight drop-shadow-sm">
                    {product.title}
                  </h1>
                  {(!product.image || product.image === "" || product.image.startsWith('Product in-Design') || product.image === "Need Image Here" || product.image.includes('placeholder') || product.image.includes('Placeholder')) && (
                    <Badge className="bg-swatch102/90 text-swatch101 border-swatch102 font-bold text-xs px-3 py-1.5 flex-shrink-0 shadow-lg">
                      🎨 IN-DESIGN
                    </Badge>
                  )}
                </div>
                
                {product.author && (
                  <p className="text-xl text-swatch203 font-semibold italic drop-shadow-sm">
                    by {product.author}
                  </p>
                )}

                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1">
                    <Star className="h-6 w-6 fill-swatch103 text-swatch103" />
                    <span className="text-lg font-bold text-swatch204 drop-shadow-sm">N/A</span>
                  </div>
                  <Badge className="bg-swatch103/20 text-swatch103 border-swatch103/30 px-3 py-1">
                    {product.category}
                  </Badge>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={400}>
              <div className="space-y-6">
                <div className="bg-gradient-to-br from-swatch101/95 to-swatch101/85 backdrop-blur-sm rounded-2xl p-6 border border-swatch103/30">
                  <h2 className="text-2xl font-bold text-swatch204 mb-4">Description</h2>
                  <p className="text-lg text-swatch204 leading-relaxed">
                    {product.longDescription || product.description || "DarkStreets exclusive product"}
                  </p>
                </div>

                {/* Special First Light E-Book Description */}
                {product.id === "1a" && (
                  <div className="bg-gradient-to-br from-swatch102/20 to-swatch103/20 rounded-2xl p-6 border border-swatch102/30">
                    <h3 className="text-xl font-bold text-swatch102 mb-3">🎭 STAGE ONE - THE BEGINNING</h3>
                    <p className="text-swatch203 leading-relaxed">
                      Meet Aries Tiger and Dance in this electrifying first chapter. Experience the thrill of LA's DarkStreets through their eyes as they navigate the complex world of street culture, relationships, and self-discovery.
                    </p>
                  </div>
                )}
              </div>
            </ScrollReveal>

            <ScrollReveal delay={600}>
              <div className="space-y-6">
                {/* Price Display */}
                <div className="bg-gradient-to-br from-swatch103/20 to-swatch104/20 rounded-2xl p-6 border border-swatch103/30">
                  <div className="text-center">
                    <h3 className="text-2xl font-bold text-swatch204 mb-2">Price</h3>
                    {formatPrice(product.price) === "Contact for Price" ? (
                      <div className="space-y-3">
                        <p className="text-3xl font-black text-swatch103 mb-2">Contact for Price</p>
                        <p className="text-swatch203 font-medium">Special pricing available</p>
                      </div>
                    ) : (
                      <p className="text-4xl font-black text-swatch103">{formatPrice(product.price)}</p>
                    )}
                  </div>
                </div>

                {/* Add to Cart Button */}
                <div className="space-y-4">
                  <Button
                    className={`w-full font-bold py-6 text-xl rounded-xl transition-all duration-200 transform hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none border-2 ${
                      formatPrice(product.price) === "Contact for Price"
                        ? "bg-gradient-to-r from-swatch102 to-swatch103 hover:from-swatch103 hover:to-swatch102 text-swatch101 border-swatch102/30 hover:border-swatch102/50"
                        : "bg-gradient-to-r from-swatch103 to-swatch104 hover:from-swatch104 hover:to-swatch103 text-swatch101 border-transparent hover:border-swatch101/20"
                    }`}
                    disabled={!product.inStock}
                  >
                    {formatPrice(product.price) === "Contact for Price" ? (
                      <>
                        <Users className="h-6 w-6 mr-3" />
                        Contact for Pricing
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
                      <Badge variant="secondary" className="bg-swatch101 text-swatch204 font-bold text-lg px-6 py-3 border-2 border-swatch103">
                        Out of Stock
                      </Badge>
                    </div>
                  )}
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>

        {/* Features Section */}
        <ScrollReveal delay={800}>
          <div className="mt-16 bg-gradient-to-r from-swatch101/95 to-swatch101/85 backdrop-blur-md rounded-2xl p-8 border border-swatch103/30">
            <h2 className="text-3xl font-bold text-center text-swatch204 mb-8">Why Choose DarkStreets?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <FloatingElement speed={0.02}>
                <div className="group flex items-center justify-center space-x-4 hover:scale-105 transition-all duration-300 p-4 rounded-xl hover:bg-swatch103/10">
                  <div className="p-3 bg-gradient-to-br from-swatch103 to-swatch104 rounded-full group-hover:shadow-lg transition-all duration-300">
                    <Truck className="h-7 w-7 text-swatch101" />
                  </div>
                  <div className="text-left">
                    <p className="text-swatch204 font-bold text-lg">Free Shipping</p>
                    <p className="text-swatch203/80 text-sm">Over $50</p>
                  </div>
                </div>
              </FloatingElement>
              <FloatingElement speed={0.025}>
                <div className="group flex items-center justify-center space-x-4 hover:scale-105 transition-all duration-300 p-4 rounded-xl hover:bg-swatch103/10">
                  <div className="p-3 bg-gradient-to-br from-swatch103 to-swatch104 rounded-full group-hover:shadow-lg transition-all duration-300">
                    <Shield className="h-7 w-7 text-swatch101" />
                  </div>
                  <div className="text-left">
                    <p className="text-swatch204 font-bold text-lg">Secure Payment</p>
                    <p className="text-swatch203/80 text-sm">100% Guaranteed</p>
                  </div>
                </div>
              </FloatingElement>
              <FloatingElement speed={0.03}>
                <div className="group flex items-center justify-center space-x-4 hover:scale-105 transition-all duration-300 p-4 rounded-xl hover:bg-swatch103/10">
                  <div className="p-3 bg-gradient-to-br from-swatch103 to-swatch104 rounded-full group-hover:shadow-lg transition-all duration-300">
                    <Award className="h-7 w-7 text-swatch101" />
                  </div>
                  <div className="text-left">
                    <p className="text-swatch204 font-bold text-lg">30-Day Returns</p>
                    <p className="text-swatch203/80 text-sm">No Questions Asked</p>
                  </div>
                </div>
              </FloatingElement>
            </div>
          </div>
        </ScrollReveal>
      </div>

      <Navigation variant="footer" />
    </div>
  );
}
