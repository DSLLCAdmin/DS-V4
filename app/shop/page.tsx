"use client";
import { useState, useEffect, Suspense } from 'react';
import { Search, Filter, Star, Heart, ShoppingCart, Package, Truck, Shield, Award, Book, Users, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Navigation, BackButton } from '@/components/navigation';
import { FloatingElement, ScrollReveal } from '@/components/floating-elements';
import { products } from '@/data/products';
import { useCart } from '@/hooks/use-cart';
import Link from 'next/link';
import { DarkStreetsTextLogo } from '@/components/DarkStreetsTextLogo';
import { StreetStoreTextLogo } from '@/components/StreetStoreTextLogo';
import { withDarkStreetLogo } from '@/lib/logo-utils';
import { isProductInDesign } from '@/lib/product-utils';
import { InDesignModal } from '@/components/InDesignModal';
import { useScrollMemory } from '@/hooks/use-scroll-memory';
import { useSearchParams } from 'next/navigation';

// Filter products to only show actual DS products (exclude empty entries and category headers)
const dsProducts = products.filter(product => 
  product.title && 
  product.title.trim() !== "" && 
  product.title.length > 1 && // Exclude single character titles like "A:", "B:"
  !product.title.endsWith(':') // Exclude category headers
);

const categories = ["All", "Serials/Books", "Apparel & Intimate Wear", "Auto & Mobility", "Accessories", "Home & Mood & Atmosphere", "Media & Experiences", "Digital & Curated Services", "Culinary & Novelty", "Collector & Art-Based", "Live & Social Activation", "Relationship & Erotic & Mystery-Inspired"];

function StreetStoreContent() {
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("images-first"); // Default: images first
  const [favorites, setFavorites] = useState<string[]>([]);
  const [visibleProducts, setVisibleProducts] = useState(24); // Show first 24 products initially
  const [showInDesignModal, setShowInDesignModal] = useState(false);
  const [selectedInDesignProduct, setSelectedInDesignProduct] = useState<any>(null);

  const { addToCart, itemCount } = useCart();
  const { useAutoSave, restoreScrollPosition, saveScrollPosition } = useScrollMemory();

  // Auto-save scroll position as user scrolls (lower threshold for better UX)
  useAutoSave('/shop', 50);

  // Handle category from URL parameter
  useEffect(() => {
    const categoryParam = searchParams.get('category');
    if (categoryParam && categories.includes(categoryParam)) {
      setSelectedCategory(categoryParam);
      // Reset scroll to top when category changes
      window.scrollTo(0, 0);
    }
  }, [searchParams]);

  const filteredProducts = dsProducts.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // Handle category filtering
    let matchesCategory = false;
    if (selectedCategory === "All") {
      matchesCategory = true;
    } else {
      matchesCategory = product.category === selectedCategory;
    }
    
    return matchesSearch && matchesCategory;
  });

  // Sort products: images first, then by selected sort option
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    // First priority: products with images come first
    const aHasImage = a.image && a.image !== "" && a.image !== "Product in-Design\nTell us your ideas!" && !a.image.startsWith('Product in-Design') && !a.image.includes('placeholder') && !a.image.includes('Placeholder') && a.image !== "Need Image Here" && a.image !== "/product-images/placeholder.jpg";
    const bHasImage = b.image && b.image !== "" && b.image !== "Product in-Design\nTell us your ideas!" && !b.image.startsWith('Product in-Design') && !b.image.includes('placeholder') && !b.image.includes('Placeholder') && b.image !== "Need Image Here" && b.image !== "/product-images/placeholder.jpg";
    
    if (aHasImage && !bHasImage) return -1;
    if (!aHasImage && bHasImage) return 1;
    
    // Second priority: apply selected sort
    switch (sortBy) {
      case 'price-low':
        return ((a.price || 0) - (b.price || 0));
      case 'price-high':
        return ((b.price || 0) - (a.price || 0));
      case 'name':
        // Normalize titles by removing quotes and special characters for proper A-Z sorting
        const normalizeTitle = (title: string) => (title || '').replace(/^['"]|['"]$/g, '').replace(/['"]/g, '').trim();
        return normalizeTitle(a.title).localeCompare(normalizeTitle(b.title));
      case 'category':
        return (a.category || '').localeCompare(b.category || '');
      default:
        return 0;
    }
  });

  // Debug logging
  console.log('Total products:', products.length);
  console.log('Filtered dsProducts:', dsProducts.length);
  console.log('Filtered by search/category:', filteredProducts.length);
  console.log('Sorted products:', sortedProducts.length);

  // Debug any image loading issues
  useEffect(() => {
    console.log('Shop page loaded with', sortedProducts.length, 'products');
    
    // Check for any products with problematic image paths
    const problematicImages = sortedProducts.filter(p => 
      p.image && p.image !== "" && p.image !== "Product in-Design\nTell us your ideas!" && !p.image.startsWith('Product in-Design') && !p.image.includes('placeholder') && !p.image.includes('Placeholder') && p.image !== "Need Image Here" && !p.image.startsWith('/')
    );
    
    if (problematicImages.length > 0) {
      console.warn('Products with potentially problematic image paths:', problematicImages);
    }


  }, [filteredProducts]);

  // Restore scroll position when component mounts and products are loaded
  useEffect(() => {
    // Only restore scroll if no category is selected (coming from homepage)
    const categoryParam = searchParams.get('category');
    if (sortedProducts.length > 0 && !categoryParam) {
      console.log(`🔄 Shop page loaded with ${sortedProducts.length} products, attempting scroll restoration...`);
      restoreScrollPosition('/shop', 300);
    }
  }, [sortedProducts.length, searchParams]);

  // Additional restoration trigger when page becomes visible (handles back navigation)
  useEffect(() => {
    const handleVisibilityChange = () => {
      const categoryParam = searchParams.get('category');
      if (!document.hidden && sortedProducts.length > 0 && !categoryParam) {
        console.log(`🔄 Page became visible, attempting scroll restoration...`);
        restoreScrollPosition('/shop', 100);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [sortedProducts.length]);

  const toggleFavorite = (productId: string) => {
    setFavorites(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const handleAddToCart = async (productId: string) => {
    const product = products.find(p => p.id === productId);
    if (product && isProductInDesign(product)) {
      setSelectedInDesignProduct(product);
      setShowInDesignModal(true);
      return;
    }
    
    // Save current scroll position before adding to cart
    if (typeof window !== 'undefined') {
      const currentScroll = window.scrollY;
      saveScrollPosition('/shop', currentScroll);
      console.log(`🛒 Shop: Saved scroll position before adding to cart: ${currentScroll}px`);
    }
    
    const success = await addToCart(productId);
    if (success) {
      // Cart updated successfully - scroll position already saved
      console.log(`🛒 Shop: Item added to cart, scroll position preserved`);
    }
  };

  const getBadgeColor = (badge: string | null) => {
    if (!badge) return "";
    switch (badge.toLowerCase()) {
      case "best seller": return "bg-swatch103/20 text-swatch103 border-swatch103/30";
      case "limited edition": return "bg-swatch104/20 text-swatch104 border-swatch104/30";
      case "eco-friendly": return "bg-swatch201/20 text-swatch203 border-swatch201/30";
      case "new arrival": return "bg-swatch102/20 text-swatch105 border-swatch102/30";
      case "staff pick": return "bg-swatch101/20 text-swatch105 border-swatch101/30";
      default: return "bg-swatch201/20 text-swatch204 border-swatch201/30";
    }
  };

  const formatPrice = (salePrice: string, originalPrice?: string) => {
    if (!salePrice || salePrice === "$-") return "Contact for Price";
    return salePrice;
  };

  const hasDiscount = (salePrice: string, originalPrice?: string) => {
    if (!salePrice || salePrice === "$-" || !originalPrice) return false;
    const sale = parseFloat(salePrice.replace('$', ''));
    const original = parseFloat(originalPrice.replace('$', ''));
    return !isNaN(sale) && !isNaN(original) && sale < original;
  };

  const getDiscountPercentage = (salePrice: string, originalPrice?: string) => {
    if (!hasDiscount(salePrice, originalPrice) || !originalPrice) return null;
    const sale = parseFloat(salePrice.replace('$', ''));
    const original = parseFloat(originalPrice.replace('$', ''));
    const discount = Math.round(((original - sale) / original) * 100);
    return discount;
  };

  return (
    		<div className="min-h-screen bg-gradient-to-b from-[#1A0F0A] via-[#8B4513] to-[#D2691E] overflow-hidden">
      <Navigation />
      

      {/* In-Design Modal */}
      {selectedInDesignProduct && (
        <InDesignModal
          product={selectedInDesignProduct}
          isOpen={showInDesignModal}
          onClose={() => {
            setShowInDesignModal(false);
            setSelectedInDesignProduct(null);
          }}
        />
      )}

      {/* Floating Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        <FloatingElement speed={0.2} className="absolute top-48 left-12 opacity-5">
          <Package className="h-40 w-40 text-swatch103" />
        </FloatingElement>
        <FloatingElement speed={0.15} direction="down" className="absolute top-96 right-20 opacity-5">
          <ShoppingCart className="h-32 w-32 text-swatch104" />
        </FloatingElement>
      </div>

      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-swatch105 via-swatch104 to-swatch103 text-swatch101">
        <div className="absolute inset-0 bg-swatch205 opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-swatch205/10 to-transparent"></div>
        <FloatingElement speed={0.1}>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
            <div className="text-center">
              <ScrollReveal>
                <div className="mb-8">
                  <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-swatch101/20 to-swatch101/10 rounded-full border-2 border-swatch101/30 backdrop-blur-sm">
                    <ShoppingCart className="h-12 w-12 text-swatch101" />
                  </div>
                </div>
              </ScrollReveal>
              <ScrollReveal delay={200}>
                <h1 className="text-6xl md:text-8xl font-black mb-8 leading-tight">
                  <StreetStoreTextLogo />
                </h1>
              </ScrollReveal>
              <ScrollReveal delay={400}>
                <p className="text-2xl md:text-3xl mb-10 text-swatch101/95 max-w-4xl mx-auto font-medium leading-relaxed">
                  Discover the complete <DarkStreetsTextLogo /> collection - from books to street culture apparel
                </p>
              </ScrollReveal>
              <ScrollReveal delay={600}>
                <Button size="lg" className="bg-gradient-to-r from-swatch101 to-swatch102 hover:from-swatch102 hover:to-swatch101 text-swatch103 px-10 py-4 text-xl font-bold rounded-full transition-all duration-500 transform hover:scale-110 hover:shadow-2xl border-2 border-swatch103/30 hover:border-swatch103/50">
                  Explore Collection
                </Button>
              </ScrollReveal>
            </div>
          </div>
        </FloatingElement>
      </div>



      {/* Search Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <ScrollReveal>
            <FloatingElement speed={0.03}>
              <div className="bg-gradient-to-br from-swatch101/95 to-swatch101/85 backdrop-blur-md rounded-2xl shadow-xl p-8 mb-8 border border-swatch103/30">
                <div className="space-y-6">
                  {/* Search Bar */}
                  <div className="relative max-w-2xl mx-auto">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-swatch203 h-6 w-6" />
                    <Input
                      type="text"
                      placeholder="Search products..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-12 h-14 text-lg border-2 border-swatch103/30 focus:border-swatch103 focus:ring-2 focus:ring-swatch103/20 rounded-xl transition-all duration-300"
                    />
                  </div>

                  {/* Sort Options */}
                  <div className="text-center mt-6">
                    <h3 className="text-lg font-semibold text-swatch204 mb-4">Sort Products</h3>
                    <div className="flex flex-wrap justify-center gap-3">
                      {[
                        { value: 'images-first', label: '🖼️ Images First', desc: 'Show products with images first' },
                        { value: 'price-low', label: '💰 Price: Low to High', desc: 'Sort by lowest price first' },
                        { value: 'price-high', label: '💰 Price: High to Low', desc: 'Sort by highest price first' },
                        { value: 'name', label: '📝 Name A-Z', desc: 'Sort alphabetically' },
                        { value: 'category', label: '🏷️ By Category', desc: 'Group by product type' }
                      ].map((option) => (
                        <Button
                          key={option.value}
                          variant={sortBy === option.value ? "default" : "outline"}
                          onClick={() => setSortBy(option.value)}
                          className={`transition-all duration-300 hover:scale-105 font-medium ${
                            sortBy === option.value
                              ? "bg-gradient-to-r from-swatch103 to-swatch104 hover:from-swatch104 hover:to-swatch103 text-swatch101 shadow-lg"
                              : "border-2 border-swatch103/30 text-swatch103 hover:bg-swatch103/10 hover:border-swatch103/50"
                          }`}
                          title={option.desc}
                        >
                          {option.label}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </FloatingElement>
          </ScrollReveal>

        {/* Category Selection Band - Moved back to beginning */}
        <div className="bg-gradient-to-br from-swatch101/95 to-swatch101/85 backdrop-blur-md rounded-2xl shadow-xl p-8 my-8 border border-swatch103/30">
          <ScrollReveal>
            <div className="text-center">
              <h3 className="text-2xl font-bold text-swatch204 mb-6">Explore Categories</h3>
              <div className="flex flex-wrap justify-center gap-3">
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    onClick={() => setSelectedCategory(category)}
                    className={`transition-all duration-300 hover:scale-105 font-medium ${
                      selectedCategory === category
                        ? "bg-gradient-to-r from-swatch103 to-swatch104 hover:from-swatch104 hover:to-swatch103 text-swatch101 shadow-lg"
                        : "border-2 border-swatch103/30 text-swatch103 hover:bg-swatch103/10 hover:border-swatch103/50"
                    }`}
                  >
                    <Filter className="h-4 w-4 mr-2" />
                    {category}
                  </Button>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </div>

        {/* Products Grid */}
        <div className="mb-6 text-center">
          <p className="text-white text-lg font-semibold">
            Showing <span className="font-bold text-yellow-300">{Math.min(visibleProducts, sortedProducts.length)}</span> of <span className="font-bold text-yellow-300">{sortedProducts.length}</span> products
            {sortBy === 'images-first' && (
              <span className="text-green-300 ml-2">(🖼️ Images first)</span>
            )}
            {visibleProducts < sortedProducts.length && (
              <span className="text-blue-300 ml-2">(Load more to see all)</span>
            )}
          </p>
        </div>
        <div className="space-y-16">
          {(() => {
            // Group products by category when sorting by category
            if (sortBy === 'category') {
              const grouped = sortedProducts.slice(0, visibleProducts).reduce((acc, product) => {
                const category = product.category || 'Uncategorized';
                if (!acc[category]) acc[category] = [];
                acc[category].push(product);
                return acc;
              }, {} as Record<string, typeof sortedProducts>);

              return Object.entries(grouped).map(([category, products], index) => (
                <div key={category} className="relative" style={{ marginTop: index === 0 ? '40px' : '120px', marginBottom: '120px' }}>
                  {/* Category Header - Absolutely Positioned */}
                  <div 
                    className="absolute top-0 left-0 right-0 z-20 text-center" 
                    style={{ 
                      backgroundColor: 'rgba(139, 69, 19, 0.9)',
                      padding: '20px',
                      borderRadius: '12px',
                      marginBottom: '40px'
                    }}
                  >
                    <h2 className="text-2xl font-bold text-yellow-300 bg-gradient-to-r from-swatch101/20 to-swatch102/20 px-6 py-4 rounded-xl border-2 border-swatch103/30 backdrop-blur-sm shadow-lg">
                      🏷️ {category}
                    </h2>
                  </div>
                  
                  {/* Products Grid for this Category - Positioned Below Header */}
                  <div className="relative top-32 flex flex-wrap gap-8 justify-center">
                    {products.map((product, index) => (
                      <div key={product.id} className="w-full md:w-80 lg:w-96">
              <ScrollReveal delay={Math.min(index * 50, 500)}>
                <FloatingElement speed={0.01}>
                <Link href={`/shop/product/${product.id}`}>
                <Card className="group overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-[1.01] bg-gradient-to-br from-swatch101/95 to-swatch101/85 backdrop-blur-sm border border-swatch103/30 hover:border-swatch103/50 h-full flex flex-col min-h-0 cursor-pointer">
                  {/* Product Image Section */}
                  <div className="relative overflow-hidden bg-gradient-to-br from-swatch205/10 to-swatch205/5">
                    <div className="relative w-full h-80 bg-gradient-to-br from-swatch205/10 to-swatch205/5 rounded-t-2xl overflow-hidden flex-shrink-0">
                      {(!product.image || product.image === "" || product.image.startsWith('Product in-Design') || product.image === "Need Image Here" || product.image.includes('placeholder') || product.image.includes('Placeholder')) ? (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-swatch101/40 to-swatch102/30 border-2 border-swatch101/20 hover:bg-gradient-to-br hover:from-swatch101/50 hover:to-swatch102/40 transition-all duration-300">
                          <div className="text-center p-6">
                            <div className="mb-4 transform hover:scale-110 transition-transform duration-300">
                              <img 
                                src="/Icons/palette-colorful.svg" 
                                alt="Design Palette" 
                                className="h-32 w-32 mx-auto drop-shadow-lg"
                                onError={(e) => {
                                  // Fallback to emoji if SVG fails to load
                                  e.currentTarget.style.display = 'none';
                                  const fallback = document.createElement('div');
                                  fallback.className = 'text-6xl text-swatch103';
                                  fallback.textContent = '🎨';
                                  e.currentTarget.parentNode?.appendChild(fallback);
                                  // Prevent the error from bubbling up
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
                          className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
                          loading="lazy"
                          onLoad={() => {
                            console.log(`✅ Successfully loaded: ${product.image}`);
                          }}
                          onError={(e) => {
                            // Log error but don't change display
                            console.warn(`Failed to load image: ${product.image}`);
                            // Prevent the error from bubbling up
                            e.preventDefault();
                          }}
                        />
                      )}
                    </div>
                    
                    {/* Overlay Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-swatch205/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    
                    {/* Top Badge */}
                    {product.badge && (
                      <Badge className={`absolute top-4 left-4 ${getBadgeColor(product.badge)} border-2 font-semibold text-xs px-3 py-1 shadow-lg z-10`}>
                        {product.badge}
                      </Badge>
                    )}

                    {/* Featured Product Badge for First & Light E-Book */}
                    {product.id === "1a" && (
                      <Badge className="absolute top-4 left-4 bg-gradient-to-r from-swatch102 to-swatch103 text-swatch101 border-2 border-swatch101 font-bold text-xs px-3 py-1 shadow-lg animate-pulse z-10">
                        ⭐ FEATURED
                      </Badge>
                    )}

                    {/* Discount Badge */}
                    {false && (
                      <Badge className="absolute top-4 right-20 bg-gradient-to-r from-swatch103 to-swatch104 text-swatch101 border-2 border-swatch101 font-bold text-xs px-3 py-1 shadow-lg z-10">
                        -{0}%
                      </Badge>
                    )}

                    {/* Favorite Button */}
                    <Button
                      size="sm"
                      variant="secondary"
                      className="absolute top-4 right-4 rounded-full p-2.5 bg-swatch101/95 hover:bg-swatch101 border border-swatch103/30 transition-all duration-150 hover:scale-105 hover:shadow-md z-10"
                      onClick={() => toggleFavorite(String(product.id))}
                    >
                      <Heart
                        className={`h-4 w-4 transition-all duration-200 ${
                          favorites.includes(String(product.id)) ? "fill-swatch103 text-swatch103 scale-110" : "text-swatch203 hover:text-swatch103"
                        }`}
                      />
                    </Button>

                    {/* Out of Stock Overlay */}
                    {!product.inStock && (
                      <div className="absolute inset-0 bg-swatch205/80 backdrop-blur-sm flex items-center justify-center">
                        <Badge variant="secondary" className="bg-swatch101 text-swatch204 font-bold text-lg px-6 py-3 border-2 border-swatch103">
                          Out of Stock
                        </Badge>
                      </div>
                    )}
                  </div>

                  {/* Product Content */}
                  <CardContent className="p-6 space-y-4 flex-1">
                    {/* Title and Author */}
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="text-2xl font-black text-swatch204 group-hover:font-extrabold transition-all duration-300 leading-tight drop-shadow-sm flex-1">
                          {withDarkStreetLogo(product.title)}
                        </h3>
                        {(!product.image || product.image === "" || product.image.startsWith('Product in-Design') || product.image === "Need Image Here" || product.image.includes('placeholder') || product.image.includes('Placeholder')) && (
                          <Badge className="bg-swatch102/90 text-swatch101 border-swatch102 font-bold text-xs px-3 py-1.5 flex-shrink-0 shadow-lg">
                            🎨 IN-DESIGN
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center justify-between">
                        {product.author && (
                          <p className="text-base text-swatch203 font-semibold italic group-hover:font-bold transition-all duration-300 drop-shadow-sm">
                            by {product.author}
                          </p>
                        )}
                        <p className="text-xs transition-all duration-300 drop-shadow-sm" style={{ color: '#FBF193' }}>
                          ID: {product.id}
                        </p>
                      </div>
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                      <p className="text-base text-swatch204 font-medium leading-relaxed line-clamp-3 group-hover:font-semibold transition-all duration-300 drop-shadow-sm">
                        {product.description || (
                          <>
                            <DarkStreetsTextLogo /> exclusive product
                          </>
                        )}
                      </p>
                      
                      {/* Special First & Light E-Book Description */}
                      {product.id === "1a" && (
                        <div className="p-3 bg-gradient-to-br from-swatch102/10 to-swatch103/10 rounded-lg border border-swatch102/20">
                          <p className="text-xs text-swatch102 font-semibold mb-1">🎭 STAGE ONE - THE BEGINNING</p>
                          <p className="text-xs text-swatch203/90 leading-relaxed">
                            Meet Aries Tiger and Dance in this electrifying first chapter. Experience the thrill of LA's <DarkStreetsTextLogo /> through their eyes.
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Price and Rating Section */}
                    <div className="flex items-start justify-between pt-3 gap-4">
                      {/* Price Display */}
                      <div className="space-y-2 flex-1">
                        {formatPrice(product.price?.toString() || "0", product.price?.toString() || "0") === "Contact for Price" ? (
                          <div className="text-center p-3 bg-gradient-to-br from-swatch103/10 to-swatch104/10 rounded-lg border border-swatch103/20">
                            <p className="text-xl font-black text-swatch103 mb-1 drop-shadow-sm">Contact for Price</p>
                            {false && (
                              <p className="text-base text-swatch203 font-semibold drop-shadow-sm">MSRP: {product.price}</p>
                            )}
                            <p className="text-sm text-swatch103 font-medium mt-1 drop-shadow-sm">Special pricing available</p>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <div className="flex items-center space-x-3">
                              <span className="text-3xl font-black text-swatch103 drop-shadow-sm">
                                {formatPrice(product.price?.toString() || "0", product.price?.toString() || "0")}
                              </span>
                              {false && (
                                <span className="text-xl text-swatch203 line-through opacity-75 font-semibold drop-shadow-sm">
                                  {product.price}
                                </span>
                              )}
                            </div>
                            {false && (
                              <p className="text-sm text-swatch103 font-bold drop-shadow-sm">
                                Save $0.00
                              </p>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Rating Display */}
                      <div className="flex flex-col items-end space-y-1 flex-shrink-0">
                        <div className="flex items-center space-x-1">
                          <Star className="h-5 w-5 fill-swatch103 text-swatch103" />
                          <span className="text-base font-black text-swatch204 drop-shadow-sm">{"N/A"}</span>
                        </div></div>
                    </div></CardContent>

                  {/* Action Button - Temporarily Disabled */}
                  <CardFooter className="p-6 pt-3 mt-auto">
                    <Button
                      className="w-full font-bold py-4 rounded-xl transition-all duration-200 transform hover:scale-102 hover:shadow-lg border-2 bg-gradient-to-r from-swatch103 to-swatch104 hover:from-swatch104 hover:to-swatch103 text-swatch101 border-transparent hover:border-swatch101/20"
                      disabled={true}
                    >
                      <ShoppingCart className="h-5 w-5 mr-2" />
                      View Details
                    </Button>
                  </CardFooter>
                </Card>
                </Link>
              </FloatingElement>
            </ScrollReveal>
                      </div>
                    ))}
                  </div>
                </div>
              ));
            } else {
              // Regular grid for non-category sorts
              return (
                <div className="flex flex-wrap gap-8 justify-center">
                  {sortedProducts.slice(0, visibleProducts).map((product, index) => (
                    <div key={product.id} className="w-full md:w-80 lg:w-96">
                      <ScrollReveal delay={Math.min(index * 50, 500)}>
                        <FloatingElement speed={0.01}>
                        <Link href={`/shop/product/${product.id}`}>
                        <Card className="group overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-[1.01] bg-gradient-to-br from-swatch101/95 to-swatch101/85 backdrop-blur-sm border border-swatch103/30 hover:border-swatch103/50 h-full flex flex-col min-h-0 cursor-pointer">
                          {/* Product Image Section */}
                          <div className="relative overflow-hidden bg-gradient-to-br from-swatch205/10 to-swatch205/5">
                            <div className="relative w-full h-80 bg-gradient-to-br from-swatch205/10 to-swatch205/5 rounded-t-2xl overflow-hidden flex-shrink-0">
                              {(!product.image || product.image === "" || product.image.startsWith('Product in-Design') || product.image === "Need Image Here" || product.image.includes('placeholder') || product.image.includes('Placeholder')) ? (
                                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-swatch101/40 to-swatch102/30 border-2 border-swatch101/20 hover:bg-gradient-to-br hover:from-swatch101/50 hover:to-swatch102/40 transition-all duration-300">
                                  <div className="text-center p-6">
                                    <div className="mb-4 transform hover:scale-110 transition-transform duration-300">
                                      <img 
                                        src="/Icons/palette-colorful.svg" 
                                        alt="Design Palette" 
                                        className="h-32 w-32 mx-auto drop-shadow-lg"
                                        onError={(e) => {
                                          // Fallback to emoji if SVG fails to load
                                          e.currentTarget.style.display = 'none';
                                          const fallback = document.createElement('div');
                                          fallback.className = 'text-6xl text-swatch103';
                                          fallback.textContent = '🎨';
                                          e.currentTarget.parentNode?.appendChild(fallback);
                                          // Prevent the error from bubbling up
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
                                  className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
                                  loading="lazy"
                                  onLoad={() => {
                                    console.log(`✅ Successfully loaded: ${product.image}`);
                                  }}
                                  onError={(e) => {
                                    // Log error but don't change display
                                    console.warn(`Failed to load image: ${product.image}`);
                                    // Prevent the error from bubbling up
                                    e.preventDefault();
                                  }}
                                />
                              )}
                            </div>
                            
                            {/* Overlay Gradient */}
                            <div className="absolute inset-0 bg-gradient-to-t from-swatch205/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            
                            {/* Top Badge */}
                            {product.badge && (
                              <Badge className={`absolute top-4 left-4 ${getBadgeColor(product.badge)} border-2 font-semibold text-xs px-3 py-1 shadow-lg z-10`}>
                                {product.badge}
                              </Badge>
                            )}

                            {/* Featured Product Badge for First & Light E-Book */}
                            {product.id === "1a" && (
                              <Badge className="absolute top-4 left-4 bg-gradient-to-r from-swatch102 to-swatch103 text-swatch101 border-2 border-swatch101 font-bold text-xs px-3 py-1 shadow-lg animate-pulse z-10">
                                ⭐ FEATURED
                              </Badge>
                            )}

                            {/* Discount Badge */}
                            {false && (
                              <Badge className="absolute top-4 right-20 bg-gradient-to-r from-swatch103 to-swatch104 text-swatch101 border-2 border-swatch101 font-bold text-xs px-3 py-1 shadow-lg z-10">
                                -{0}%
                              </Badge>
                            )}

                            {/* Favorite Button */}
                            <Button
                              size="sm"
                              variant="secondary"
                              className="absolute top-4 right-4 rounded-full p-2.5 bg-swatch101/95 hover:bg-swatch101 border border-swatch103/30 transition-all duration-150 hover:scale-105 hover:shadow-md z-10"
                              onClick={() => toggleFavorite(String(product.id))}
                            >
                              <Heart
                                className={`h-4 w-4 transition-all duration-200 ${
                                  favorites.includes(String(product.id)) ? "fill-swatch103 text-swatch103 scale-110" : "text-swatch203 hover:text-swatch103"
                                }`}
                              />
                            </Button>

                            {/* Out of Stock Overlay */}
                            {!product.inStock && (
                              <div className="absolute inset-0 bg-swatch205/80 backdrop-blur-sm flex items-center justify-center">
                                <Badge variant="secondary" className="bg-swatch101 text-swatch204 font-bold text-lg px-6 py-3 border-2 border-swatch103">
                                  Out of Stock
                                </Badge>
                              </div>
                            )}
                          </div>

                          {/* Product Content */}
                          <CardContent className="p-6 space-y-4 flex-1">
                            {/* Title and Author */}
                            <div className="space-y-3">
                              <div className="flex items-start justify-between gap-3">
                                <h3 className="text-2xl font-black text-swatch204 group-hover:font-extrabold transition-all duration-300 leading-tight drop-shadow-sm flex-1">
                                  {withDarkStreetLogo(product.title)}
                                </h3>
                                {(!product.image || product.image === "" || product.image.startsWith('Product in-Design') || product.image === "Need Image Here" || product.image.includes('placeholder') || product.image.includes('Placeholder')) && (
                                  <Badge className="bg-swatch102/90 text-swatch101 border-swatch102 font-bold text-xs px-3 py-1.5 flex-shrink-0 shadow-lg">
                                    🎨 IN-DESIGN
                                  </Badge>
                                )}
                              </div>
                              <div className="flex items-center justify-between">
                                {product.author && (
                                  <p className="text-base text-swatch203 font-semibold italic group-hover:font-bold transition-all duration-300 drop-shadow-sm">
                                    by {product.author}
                                  </p>
                                )}
                                <p className="text-xs transition-all duration-300 drop-shadow-sm" style={{ color: '#FBF193' }}>
                                  ID: {product.id}
                                </p>
                              </div>
                            </div>

                            {/* Description */}
                            <div className="space-y-2">
                              <p className="text-base text-swatch204 font-medium leading-relaxed line-clamp-3 group-hover:font-semibold transition-all duration-300 drop-shadow-sm">
                                {product.description || (
                          <>
                            <DarkStreetsTextLogo /> exclusive product
                          </>
                        )}
                              </p>
                              
                              {/* Special First & Light E-Book Description */}
                              {product.id === "1a" && (
                                <div className="p-3 bg-gradient-to-br from-swatch102/10 to-swatch103/10 rounded-lg border border-swatch102/20">
                                  <p className="text-xs text-swatch102 font-semibold mb-1">🎭 STAGE ONE - THE BEGINNING</p>
                                  <p className="text-xs text-swatch203/90 leading-relaxed">
                                    Meet Aries Tiger and Dance in this electrifying first chapter. Experience the thrill of LA's <DarkStreetsTextLogo /> through their eyes.
                                  </p>
                                </div>
                              )}
                            </div>

                            {/* Price and Rating Section */}
                            <div className="flex items-start justify-between pt-3 gap-4">
                              {/* Price Display */}
                              <div className="space-y-2 flex-1">
                                {formatPrice(product.price?.toString() || "0", product.price?.toString() || "0") === "Contact for Price" ? (
                                  <div className="text-center p-3 bg-gradient-to-br from-swatch103/10 to-swatch104/10 rounded-lg border border-swatch103/20">
                                    <p className="text-xl font-black text-swatch103 mb-1 drop-shadow-sm">Contact for Price</p>
                                    {false && (
                                      <p className="text-base text-swatch203 font-semibold drop-shadow-sm">MSRP: {product.price}</p>
                                    )}
                                    <p className="text-sm text-swatch103 font-medium mt-1 drop-shadow-sm">Special pricing available</p>
                        </div>
                                ) : (
                                  <div className="space-y-2">
                                    <div className="flex items-center space-x-3">
                                      <span className="text-3xl font-black text-swatch103 drop-shadow-sm">
                                        {formatPrice(product.price?.toString() || "0", product.price?.toString() || "0")}
                                      </span>
                                      {false && (
                                        <span className="text-xl text-swatch203 line-through opacity-75 font-semibold drop-shadow-sm">
                                          {product.price}
                          </span>
                        )}
                      </div>
                                    {false && (
                                      <p className="text-sm text-swatch103 font-bold drop-shadow-sm">
                                        Save $0.00
                                      </p>
                        )}
                      </div>
                    )}
                              </div>

                              {/* Rating Display */}
                              <div className="flex flex-col items-end space-y-1 flex-shrink-0">
                                <div className="flex items-center space-x-1">
                                  <Star className="h-5 w-5 fill-swatch103 text-swatch103" />
                                  <span className="text-base font-black text-swatch204 drop-shadow-sm">{"N/A"}</span>
                                </div></div>
                            </div></CardContent>

                          {/* Action Button - Temporarily Disabled */}
                  <CardFooter className="p-6 pt-3 mt-auto">
                    <Button
                              className="w-full font-bold py-4 rounded-xl transition-all duration-200 transform hover:scale-102 hover:shadow-lg border-2 bg-gradient-to-r from-swatch103 to-swatch104 hover:from-swatch104 hover:to-swatch103 text-swatch101 border-transparent hover:border-swatch101/20"
                              disabled={true}
                            >
                          <ShoppingCart className="h-5 w-5 mr-2" />
                              View Details
                    </Button>
                  </CardFooter>
                </Card>
                        </Link>
              </FloatingElement>
            </ScrollReveal>
            </div>
          ))}
                </div>
              );
            }
          })()}
        </div>

        {/* Load More Button */}
        {visibleProducts < sortedProducts.length && (
          <div className="text-center mt-8">
            <Button
              onClick={() => setVisibleProducts(prev => Math.min(prev + 24, sortedProducts.length))}
              className="bg-gradient-to-r from-swatch103 to-swatch104 hover:from-swatch104 hover:to-swatch103 text-swatch101 px-8 py-3 text-lg font-bold rounded-full transition-all duration-200 hover:scale-105 hover:shadow-lg"
            >
              Load More Products ({sortedProducts.length - visibleProducts} remaining)
            </Button>
          </div>
        )}

      {/* Features Banner */}
      <div className="bg-gradient-to-r from-swatch101/95 to-swatch101/85 backdrop-blur-md border-b border-swatch103/30 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <ScrollReveal>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div className="group flex items-center justify-center space-x-4 transition-all duration-300 p-4 rounded-xl hover:bg-swatch103/10 overflow-hidden">
                <div className="p-3 bg-gradient-to-br from-swatch103 to-swatch104 rounded-full group-hover:shadow-lg transition-all duration-300 flex-shrink-0">
                  <Truck className="h-7 w-7 text-swatch101" />
                </div>
                <div className="text-left flex-1 min-w-0">
                  <p className="text-swatch204 font-bold text-lg truncate">Free Shipping</p>
                  <p className="text-swatch203/80 text-sm truncate">Over $50</p>
                </div>
              </div>
              <div className="group flex items-center justify-center space-x-4 transition-all duration-300 p-4 rounded-xl hover:bg-swatch103/10 overflow-hidden">
                <div className="p-3 bg-gradient-to-br from-swatch103 to-swatch104 rounded-full group-hover:shadow-lg transition-all duration-300 flex-shrink-0">
                  <Shield className="h-7 w-7 text-swatch101" />
                </div>
                <div className="text-left flex-1 min-w-0">
                  <p className="text-swatch204 font-bold text-lg truncate">Secure Payment</p>
                  <p className="text-swatch203/80 text-sm truncate">100% Guaranteed</p>
                </div>
              </div>
              <div className="group flex items-center justify-center space-x-4 transition-all duration-300 p-4 rounded-xl hover:bg-swatch103/10 overflow-hidden">
                <div className="p-3 bg-gradient-to-br from-swatch103 to-swatch104 rounded-full group-hover:shadow-lg transition-all duration-300 flex-shrink-0">
                  <Award className="h-7 w-7 text-swatch101" />
                </div>
                <div className="text-left flex-1 min-w-0">
                  <p className="text-swatch204 font-bold text-lg truncate">30-Day Returns</p>
                  <p className="text-swatch203/80 text-sm truncate">No Questions Asked</p>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>


        {filteredProducts.length === 0 && (
          <ScrollReveal>
            <div className="text-center py-16">
              <Package className="mx-auto h-16 w-16 text-blue-400 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No products found</h3>
              <p className="text-gray-300">Try adjusting your search or filter criteria</p>
            </div>
          </ScrollReveal>
        )}
      </div>

      {/* Call to Action */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="bg-gradient-to-r from-swatch103 to-swatch104 rounded-2xl p-8 text-center text-swatch101">
          <h2 className="text-3xl font-bold mb-4">Join the <DarkStreetsTextLogo /></h2>
          <p className="text-lg mb-6 text-swatch101/90">
            Connect with Streeters, discover local dives, and explore our complete collection
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/book-club">
              <Button className="bg-swatch101 text-swatch103 hover:bg-swatch102 px-6 py-3">
                <Users className="h-5 w-5 mr-2" />
                                    Join StreetCircle
              </Button>
            </Link>
            <Link href="/ds-map">
              <Button className="bg-swatch101 text-swatch103 hover:bg-swatch102 px-6 py-3">
                <MapPin className="h-5 w-5 mr-2" />
                Explore DS Map
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <Navigation variant="footer" />
    </div>
  );
}

// Error boundary wrapper
export default function StreetStore() {
  return (
    <ErrorBoundary fallback={<div className="text-center p-8">Something went wrong loading the shop. Please refresh the page.</div>}>
      <Suspense fallback={<div className="text-center p-8">Loading StreetStore...</div>}>
        <StreetStoreContent />
      </Suspense>
    </ErrorBoundary>
  );
}

// Simple error boundary component
function ErrorBoundary({ children, fallback }: { children: React.ReactNode; fallback: React.ReactNode }) {
  try {
    return children;
  } catch (error) {
    console.error('Shop page error:', error);
    return fallback;
  }
}
