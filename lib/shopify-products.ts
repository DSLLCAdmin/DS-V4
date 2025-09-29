// Shopify Products Library - Mock implementations for admin dashboard

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
    // Mock constructor - no params needed
  }

  getProducts(): ShopifyProduct[] {
    return [
      {
        id: '1',
        title: 'Dark Streets: First Light',
        handle: 'dark-streets-first-light',
        status: 'active',
        productType: 'ebook',
        vendor: 'DarkStreet LLC',
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-09-20'),
        variants: [
          { id: 'v1', productId: '1', title: 'PDF', price: 9.99, inventoryQuantity: 999 },
          { id: 'v2', productId: '1', title: 'EPUB', price: 9.99, inventoryQuantity: 999 }
        ],
        images: [
          { id: 'i1', productId: '1', src: '/images/first-light-cover.jpg', position: 0 }
        ]
      },
      {
        id: '2',
        title: 'Risque Safety',
        handle: 'risque-safety',
        status: 'draft',
        productType: 'ebook',
        vendor: 'DarkStreet LLC',
        createdAt: new Date('2028-01-15'),
        updatedAt: new Date('2028-09-20'),
        variants: [
          { id: 'v3', productId: '2', title: 'PDF', price: 12.99, inventoryQuantity: 500 },
          { id: 'v4', productId: '2', title: 'EPUB', price: 12.99, inventoryQuantity: 500 }
        ],
        images: [
          { id: 'i2', productId: '2', src: '/images/risque-safety-cover.jpg', position: 0 }
        ]
      }
    ];
  }
}
