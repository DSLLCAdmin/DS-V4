// Shopify Products Library - Real product data integration

import { PRODUCT_LOOKUP } from '@/data/product-lookup';

export interface ShopifyProduct {
  id: string;
  title: string;
  handle: string;
  status: 'active' | 'draft' | 'archived';
  productType?: string;
  vendor?: string;
  createdAt: Date;
  updatedAt: Date;
  variants: ShopifyVariant[];
  images: ShopifyImage[];
}

export interface ShopifyVariant {
  id: string;
  productId: string;
  title: string;
  sku?: string;
  price: number;
  compareAtPrice?: number;
  inventoryQuantity: number;
  weight?: number;
}

export interface ShopifyImage {
  id: string;
  productId: string;
  src: string;
  alt?: string;
  position?: number;
}

export class ShopifyProductManager {
  constructor() {
    // Real constructor - loads from PRODUCT_LOOKUP
  }

  getProducts(): ShopifyProduct[] {
    // Convert PRODUCT_LOOKUP to ShopifyProduct format
    return Object.entries(PRODUCT_LOOKUP).map(([id, product]) => ({
      id: product.dsProductId,
      title: product.title,
      handle: product.dsProductId.toLowerCase().replace(/[^a-z0-9-]/g, '-'),
      status: product.status === 'active' ? 'active' : 'draft',
      productType: product.category.toLowerCase().replace(/\s+/g, '-'),
      vendor: 'DarkStreet LLC',
      createdAt: product.lastSync,
      updatedAt: product.lastSync,
      variants: [{
        id: `${product.dsProductId}-variant-1`,
        productId: product.dsProductId,
        title: 'Default',
        sku: product.dsProductId,
        price: product.price,
        compareAtPrice: product.price > 0 ? product.price * 1.2 : undefined,
        inventoryQuantity: product.inventory?.amazonFBA || 0,
        weight: 0.5
      }],
      images: [{
        id: `${product.dsProductId}-image-1`,
        productId: product.dsProductId,
        src: product.image,
        alt: product.title,
        position: 1
      }]
    }));
  }

  getProductById(id: string): ShopifyProduct | undefined {
    return this.getProducts().find(p => p.id === id);
  }

  getProductsByCategory(category: string): ShopifyProduct[] {
    return this.getProducts().filter(p => p.productType === category.toLowerCase().replace(/\s+/g, '-'));
  }

  getActiveProducts(): ShopifyProduct[] {
    return this.getProducts().filter(p => p.status === 'active');
  }

  getDraftProducts(): ShopifyProduct[] {
    return this.getProducts().filter(p => p.status === 'draft');
  }
}