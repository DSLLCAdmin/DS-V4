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
export const useProductImages = (productId: string, variantImageSetKey?: string) => {
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProductImages = async () => {
      try {
        // Import product data to get all available images
        const { products } = await import('@/data/products');
        const product = products.find(p => p.id === productId);
        
        if (product) {
          // If variant-specific image set key is provided, use it; otherwise use product ID
          const imageSetKey = variantImageSetKey || productId;
          const productImages = await getProductImageSet(imageSetKey);
          setImages(productImages);
        }
      } catch (error) {
        console.error('Error loading product images:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProductImages();
  }, [productId, variantImageSetKey]);

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
    ],
    'T-02': [ // Dancer's Tee - Unisex V-Neck T-Shirt with ballerina graphic
      '/product-images/unisex-v-neck-tee-dark-grey-heather-front-69091886bda87.jpg', // Front view 1 (HOME IMAGE)
      '/product-images/unisex-v-neck-tee-dark-grey-heather-front-69091886be6f8.jpg', // Front view 2
      '/product-images/unisex-v-neck-tee-dark-grey-heather-front-69091886bfafe.jpg', // Front view 3
      '/product-images/unisex-v-neck-tee-dark-grey-heather-front-69091886c0fbb.jpg', // Front view 4
      '/product-images/unisex-v-neck-tee-dark-grey-heather-front-69091886c28ed.jpg', // Front view 5
      '/product-images/unisex-v-neck-tee-dark-grey-heather-front-69091886c3298.jpg', // Front view 6
      '/product-images/unisex-v-neck-tee-dark-grey-heather-back-69091886be1b2.jpg', // Back view 1
      '/product-images/unisex-v-neck-tee-dark-grey-heather-back-69091886bec1a.jpg', // Back view 2
      '/product-images/unisex-v-neck-tee-dark-grey-heather-back-69091886c00b3.jpg', // Back view 3
      '/product-images/unisex-v-neck-tee-dark-grey-heather-back-69091886c14d6.jpg', // Back view 4
      '/product-images/unisex-v-neck-tee-dark-grey-heather-back-69091886c240f.jpg', // Back view 5
      '/product-images/unisex-v-neck-tee-dark-grey-heather-back-69091886c3777.jpg', // Back view 6
      '/product-images/unisex-v-neck-tee-dark-grey-heather-left-69091886c3c5f.jpg', // Left side view
      '/product-images/unisex-v-neck-tee-dark-grey-heather-left-front-69091886bf103.jpg', // Left-front view 1
      '/product-images/unisex-v-neck-tee-dark-grey-heather-left-front-69091886c05af.jpg', // Left-front view 2
      '/product-images/unisex-v-neck-tee-dark-grey-heather-left-front-69091886c1a06.jpg', // Left-front view 3
      '/product-images/unisex-v-neck-tee-dark-grey-heather-right-69091886c413c.jpg', // Right side view
      '/product-images/unisex-v-neck-tee-dark-grey-heather-right-front-69091886bf5bf.jpg', // Right-front view 1
      '/product-images/unisex-v-neck-tee-dark-grey-heather-right-front-69091886c0ad9.jpg', // Right-front view 2
      '/product-images/unisex-v-neck-tee-dark-grey-heather-right-front-69091886c1ee8.jpg', // Right-front view 3
      '/product-images/unisex-v-neck-tee-dark-grey-heather-product-details-69091886c2db2.jpg' // Product details view
    ],
    'B-08': [ // DarkStreets' Otto Cap - New Printful mock-ups
      '/product-images/otto-cap-18-772-black-front-690e44034c5ed.jpg', // Front view (HOME IMAGE)
      '/product-images/otto-cap-18-772-black-left-front-690e44034cbd6.jpg', // Left-front view
      '/product-images/otto-cap-18-772-black-right-front-690e44034ce78.jpg', // Right-front view
      '/product-images/otto-cap-18-772-black-back-690e44034c966.jpg' // Back view
    ],
    'H-06': [ // Streeter Mug - Legacy: Default images (11 oz)
      '/product-images/black-glossy-mug-black-11-oz-front-690e36e668bb4.jpg', // Front view 1
      '/product-images/black-glossy-mug-black-11-oz-front-690e36e669b4a.jpg', // Front view 2
      '/product-images/black-glossy-mug-black-11-oz-handle-on-left-690e36e668fe4.jpg', // Handle left 1
      '/product-images/black-glossy-mug-black-11-oz-handle-on-left-690e36e66975a.jpg', // Handle left 2
      '/product-images/black-glossy-mug-black-11-oz-handle-on-left-690e36e669f27.jpg', // Handle left 3
      '/product-images/black-glossy-mug-black-11-oz-handle-on-right-690e36e668717.jpg', // Handle right 1
      '/product-images/black-glossy-mug-black-11-oz-handle-on-right-690e36e6693ad.jpg', // Handle right 2
      '/product-images/black-glossy-mug-black-11-oz-handle-on-right-690e36e66a2f0.jpg' // Handle right 3
    ],
    'H-06-11oz': [ // Streeter Mug 11 oz - New Printful mock-ups
      '/product-images/black-glossy-mug-black-11-oz-front-690e36e668bb4.jpg', // Front view 1 (HOME IMAGE)
      '/product-images/black-glossy-mug-black-11-oz-front-690e36e669b4a.jpg', // Front view 2
      '/product-images/black-glossy-mug-black-11-oz-handle-on-left-690e36e668fe4.jpg', // Handle left 1
      '/product-images/black-glossy-mug-black-11-oz-handle-on-left-690e36e66975a.jpg', // Handle left 2
      '/product-images/black-glossy-mug-black-11-oz-handle-on-left-690e36e669f27.jpg', // Handle left 3
      '/product-images/black-glossy-mug-black-11-oz-handle-on-right-690e36e668717.jpg', // Handle right 1
      '/product-images/black-glossy-mug-black-11-oz-handle-on-right-690e36e6693ad.jpg', // Handle right 2
      '/product-images/black-glossy-mug-black-11-oz-handle-on-right-690e36e66a2f0.jpg' // Handle right 3
    ],
    'H-06-15oz': [ // Streeter Mug 15 oz - New Printful mock-ups
      '/product-images/black-glossy-mug-black-15-oz-front-690e36e668dd7.jpg', // Front view 1 (HOME IMAGE)
      '/product-images/black-glossy-mug-black-15-oz-front-690e36e669d56.jpg', // Front view 2
      '/product-images/black-glossy-mug-black-15-oz-handle-on-left-690e36e6691c3.jpg', // Handle left 1
      '/product-images/black-glossy-mug-black-15-oz-handle-on-left-690e36e669967.jpg', // Handle left 2
      '/product-images/black-glossy-mug-black-15-oz-handle-on-left-690e36e66a10e.jpg', // Handle left 3
      '/product-images/black-glossy-mug-black-15-oz-handle-on-right-690e36e66893d.jpg', // Handle right 1
      '/product-images/black-glossy-mug-black-15-oz-handle-on-right-690e36e66957d.jpg', // Handle right 2
      '/product-images/black-glossy-mug-black-15-oz-handle-on-right-690e36e66a4bc.jpg' // Handle right 3
    ],
    'M-01': [ // StreeterMagnet - 5 views (4 front views + product details)
      '/product-images/car-magnets-white-10x3-front-690e315a31d57.png', // Primary front view (HOME IMAGE)
      '/product-images/car-magnets-white-10x3-front-690e315a31f21.png', // Front view 2
      '/product-images/car-magnets-white-10x3-front-690e315a31f8e.png', // Front view 3
      '/product-images/car-magnets-white-10x3-front-690e315a32009.png', // Front view 4
      '/product-images/car-magnets-white-10x3-product-details-690e315a31e07.png' // Product details view
    ],
    'T-03': [ // Streeter Tee - Crew-neck t-shirt with Dark Streets design
      '/product-images/unisex-v-neck-tee-dark-grey-heather-front-69091886bda87.jpg', // Front view 1 (HOME IMAGE - placeholder, update with actual Streeter Tee images)
      '/product-images/unisex-v-neck-tee-dark-grey-heather-front-69091886be6f8.jpg', // Front view 2
      '/product-images/unisex-v-neck-tee-dark-grey-heather-front-69091886bfafe.jpg', // Front view 3
      '/product-images/unisex-v-neck-tee-dark-grey-heather-front-69091886c0fbb.jpg', // Front view 4
      '/product-images/unisex-v-neck-tee-dark-grey-heather-front-69091886c28ed.jpg', // Front view 5
      '/product-images/unisex-v-neck-tee-dark-grey-heather-front-69091886c3298.jpg', // Front view 6
      '/product-images/unisex-v-neck-tee-dark-grey-heather-back-69091886be1b2.jpg', // Back view 1
      '/product-images/unisex-v-neck-tee-dark-grey-heather-back-69091886bec1a.jpg', // Back view 2
      '/product-images/unisex-v-neck-tee-dark-grey-heather-back-69091886c00b3.jpg', // Back view 3
      '/product-images/unisex-v-neck-tee-dark-grey-heather-back-69091886c14d6.jpg', // Back view 4
      '/product-images/unisex-v-neck-tee-dark-grey-heather-back-69091886c240f.jpg', // Back view 5
      '/product-images/unisex-v-neck-tee-dark-grey-heather-back-69091886c3777.jpg', // Back view 6
      '/product-images/unisex-v-neck-tee-dark-grey-heather-left-69091886c3c5f.jpg', // Left side view
      '/product-images/unisex-v-neck-tee-dark-grey-heather-left-front-69091886bf103.jpg', // Left-front view 1
      '/product-images/unisex-v-neck-tee-dark-grey-heather-left-front-69091886c05af.jpg', // Left-front view 2
      '/product-images/unisex-v-neck-tee-dark-grey-heather-left-front-69091886c1a06.jpg', // Left-front view 3
      '/product-images/unisex-v-neck-tee-dark-grey-heather-right-69091886c413c.jpg', // Right side view
      '/product-images/unisex-v-neck-tee-dark-grey-heather-right-front-69091886bf5bf.jpg', // Right-front view 1
      '/product-images/unisex-v-neck-tee-dark-grey-heather-right-front-69091886c0ad9.jpg', // Right-front view 2
      '/product-images/unisex-v-neck-tee-dark-grey-heather-right-front-69091886c1ee8.jpg', // Right-front view 3
      '/product-images/unisex-v-neck-tee-dark-grey-heather-product-details-69091886c2db2.jpg' // Product details view
    ]
  };

  return imageSets[productId] || [];
};
