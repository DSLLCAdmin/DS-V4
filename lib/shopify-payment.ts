// Shopify Payment Library - Mock implementations for admin dashboard

export interface PaymentGateway {
  id: string;
  name: string;
  type: 'stripe' | 'paypal' | 'shopify_payments' | 'other';
  status: 'active' | 'inactive' | 'pending';
  enabled: boolean;
  testMode: boolean;
  lastUsed?: Date;
}

export class ShopifyPaymentManager {
  constructor() {
    // Mock constructor - no params needed
  }

  getPaymentStatus(): PaymentGateway[] {
    return [
      {
        id: 'stripe_1',
        name: 'Stripe',
        type: 'stripe',
        status: 'active',
        enabled: true,
        testMode: false,
        lastUsed: new Date(Date.now() - 2 * 60 * 60 * 1000)
      },
      {
        id: 'shopify_1',
        name: 'Shopify Payments',
        type: 'shopify_payments',
        status: 'active',
        enabled: true,
        testMode: false,
        lastUsed: new Date(Date.now() - 30 * 60 * 1000)
      },
      {
        id: 'paypal_1',
        name: 'PayPal Express',
        type: 'paypal',
        status: 'inactive',
        enabled: false,
        testMode: true,
        lastUsed: new Date(Date.now() - 24 * 60 * 60 * 1000)
      }
    ];
  }
}