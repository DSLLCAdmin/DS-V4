import { ShoppingCart, Heart, Star, ArrowLeft, Users, MapPin, Book, Award, Shield, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Navigation } from '@/components/navigation';
import { FloatingElement, ScrollReveal } from '@/components/floating-elements';
import { products } from '@/data/products';
import Link from 'next/link';
import { ProductPageClient } from '@/components/ProductPageClient';
import { BackToShopButton } from '@/components/BackToShopButton';

// Generate static params for all products
export async function generateStaticParams() {
  return products.map((product) => ({
    id: product.id,
  }));
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = products.find(p => p.id === id);

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#1A0F0A] via-[#8B4513] to-[#D2691E] flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-3xl font-bold mb-4">Product Not Found</h1>
          <p className="text-lg mb-6">The product you're looking for doesn't exist.</p>
          <Link href="/shop">
            <Button className="bg-swatch103 hover:bg-swatch104 text-white">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to StreetStore
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1A0F0A] via-[#8B4513] to-[#D2691E] overflow-hidden">
      <Navigation />
      
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
          <BackToShopButton />
        </div>

        {/* Product Details */}
        <ScrollReveal>
          <ProductPageClient product={product} />
        </ScrollReveal>

        {/* Additional Features Section */}
        <div className="mt-16">
          <ScrollReveal>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Free Shipping */}
              <FloatingElement speed={0.1} className="bg-gradient-to-br from-swatch101/95 to-swatch101/85 backdrop-blur-sm rounded-2xl p-6 border border-swatch103/30">
                <div className="flex items-center space-x-4">
                  <div className="bg-swatch103/20 p-3 rounded-full">
                    <Truck className="h-8 w-8 text-swatch103" />
                  </div>
                  <div className="text-left">
                    <p className="text-white font-bold text-lg">Free Shipping</p>
                    <p className="text-white/80 text-sm">Orders $50+</p>
                  </div>
                </div>
              </FloatingElement>

              {/* Secure Payment */}
              <FloatingElement speed={0.1} className="bg-gradient-to-br from-swatch101/95 to-swatch101/85 backdrop-blur-sm rounded-2xl p-6 border border-swatch103/30">
                <div className="flex items-center space-x-4">
                  <div className="bg-swatch103/20 p-3 rounded-full">
                    <Shield className="h-8 w-8 text-swatch103" />
                  </div>
                  <div className="text-left">
                    <p className="text-white font-bold text-lg">Secure Payment</p>
                    <p className="text-white/80 text-sm">SSL Encrypted</p>
                  </div>
                </div>
              </FloatingElement>

              {/* Returns */}
              <FloatingElement speed={0.1} className="bg-gradient-to-br from-swatch101/95 to-swatch101/85 backdrop-blur-sm rounded-2xl p-6 border border-swatch103/30">
                <div className="flex items-center space-x-4">
                  <div className="bg-swatch103/20 p-3 rounded-full">
                    <Star className="h-8 w-8 text-swatch103" />
                  </div>
                  <div className="text-left">
                    <p className="text-white font-bold text-lg">30-Day Returns</p>
                    <p className="text-white/80 text-sm">No Questions Asked</p>
                  </div>
                </div>
              </FloatingElement>
            </div>
          </ScrollReveal>
        </div>
      </div>

      <Navigation variant="footer" />
    </div>
  );
}