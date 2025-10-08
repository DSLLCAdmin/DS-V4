'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ProductImageGalleryProps {
  images: string[];
  productTitle: string;
  className?: string;
}

export const ProductImageGallery: React.FC<ProductImageGalleryProps> = ({
  images,
  productTitle,
  className = ''
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Auto-advance carousel every 5 seconds (optional)
  useEffect(() => {
    if (images.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [images.length]);

  const goToPrevious = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    setTimeout(() => setIsTransitioning(false), 300);
  };

  const goToNext = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev + 1) % images.length);
    setTimeout(() => setIsTransitioning(false), 300);
  };

  const goToImage = (index: number) => {
    if (isTransitioning || index === currentIndex) return;
    setIsTransitioning(true);
    setCurrentIndex(index);
    setTimeout(() => setIsTransitioning(false), 300);
  };

  if (!images || images.length === 0) {
    return (
      <div className={`w-full h-96 bg-gray-200 rounded-lg flex items-center justify-center ${className}`}>
        <span className="text-gray-500">No images available</span>
      </div>
    );
  }

  if (images.length === 1) {
    return (
      <div className={`relative w-full ${className}`}>
        <div className="aspect-square relative overflow-hidden rounded-lg bg-gray-100">
          <Image
            src={images[0]}
            alt={`${productTitle} - Main view`}
            fill
            className="object-cover transition-transform duration-300 hover:scale-105"
            priority
          />
        </div>
      </div>
    );
  }

  return (
    <div className={`relative w-full ${className}`}>
      {/* Main Image Display */}
      <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100 mb-4">
        {/* Current Image */}
        <div className="relative w-full h-full">
          <Image
            src={images[currentIndex]}
            alt={`${productTitle} - Image ${currentIndex + 1}`}
            fill
            className={`object-cover transition-all duration-300 ${
              isTransitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
            }`}
            priority={currentIndex === 0}
          />
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={goToPrevious}
          disabled={isTransitioning}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 rounded-full p-2 shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed group"
          aria-label="Previous image"
        >
          <ChevronLeft className="w-6 h-6 group-hover:scale-110 transition-transform" />
        </button>

        <button
          onClick={goToNext}
          disabled={isTransitioning}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 rounded-full p-2 shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed group"
          aria-label="Next image"
        >
          <ChevronRight className="w-6 h-6 group-hover:scale-110 transition-transform" />
        </button>

        {/* Image Counter */}
        <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
          {currentIndex + 1} / {images.length}
        </div>

        {/* Fade Indicators */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => goToImage(index)}
              className={`w-2 h-2 rounded-full transition-all duration-200 ${
                index === currentIndex
                  ? 'bg-white scale-125'
                  : 'bg-white/50 hover:bg-white/75'
              }`}
              aria-label={`Go to image ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Thumbnail Strip */}
      <div className="flex space-x-2 overflow-x-auto pb-2">
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => goToImage(index)}
            disabled={isTransitioning}
            className={`relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden transition-all duration-200 ${
              index === currentIndex
                ? 'ring-2 ring-blue-500 ring-offset-2 scale-105'
                : 'opacity-60 hover:opacity-80 hover:scale-105'
            } disabled:cursor-not-allowed`}
            aria-label={`View ${productTitle} - Image ${index + 1}`}
          >
            <Image
              src={image}
              alt={`${productTitle} - Thumbnail ${index + 1}`}
              fill
              className="object-cover"
            />
            {/* Active indicator overlay */}
            {index === currentIndex && (
              <div className="absolute inset-0 bg-blue-500/20" />
            )}
          </button>
        ))}
      </div>

      {/* Image Descriptions (if needed) */}
      <div className="mt-2 text-center">
        <p className="text-sm text-gray-600">
          Click thumbnails to view different angles
        </p>
      </div>
    </div>
  );
};

// Hook for managing product images
export const useProductImages = (productId: string) => {
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProductImages = async () => {
      try {
        // Import product data to get all available images
        const { products } = await import('@/data/products');
        const product = products.find(p => p.id === productId);
        
        if (product) {
          // Get all images for this product
          const productImages = await getProductImageSet(productId);
          setImages(productImages);
        }
      } catch (error) {
        console.error('Error loading product images:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProductImages();
  }, [productId]);

  return { images, loading };
};

// Helper function to get all images for a product
const getProductImageSet = async (productId: string): Promise<string[]> => {
  // This would typically come from your product data or API
  // For now, we'll generate image sets based on product ID
  
  const imageSets: { [key: string]: string[] } = {
    'T-01': [ // DarkStreets Tee
      '/product-images/Tees-0.png',
      '/product-images/Tees-0b.png',
      '/product-images/Tees-0c.png',
      '/product-images/Tees-0d.png',
      '/product-images/Tees-1.png',
      '/product-images/Tees-1b.png',
      '/product-images/Tees-1c.png',
      '/product-images/Tees-1d.png',
      '/product-images/Tees-2.png',
      '/product-images/Tees-2b.png',
      '/product-images/Tees-2c.png',
      '/product-images/Tees-2d.png',
      '/product-images/Tees-3.png',
      '/product-images/Tees-3b.png',
      '/product-images/Tees-3c.png',
      '/product-images/Tees-3d.png'
    ]
  };

  return imageSets[productId] || [];
};
