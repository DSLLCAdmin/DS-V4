// Shopify Policies Library - Mock implementations for admin dashboard

export interface Policy {
  id: string;
  title: string;
  type: 'privacy' | 'terms' | 'refund' | 'shipping' | 'cookies';
  content: string;
  lastUpdated: Date;
  published: boolean;
  required: boolean;
}

export class ShopifyPoliciesManager {
  constructor() {
    // Mock constructor - no params needed
  }

  getPolicies(): Policy[] {
    return [
      {
        id: 'privacy_1',
        title: 'Privacy Policy',
        type: 'privacy',
        content: 'We collect and use your personal information in accordance with applicable privacy laws...',
        lastUpdated: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        published: true,
        required: true
      },
      {
        id: 'terms_1',
        title: 'Terms of Service',
        type: 'terms',
        content: 'By using our services, you agree to be bound by these terms and conditions...',
        lastUpdated: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
        published: true,
        required: true
      },
      {
        id: 'refund_1',
        title: 'Refund Policy',
        type: 'refund',
        content: 'We offer refunds within 30 days of purchase for unused items...',
        lastUpdated: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        published: true,
        required: false
      },
      {
        id: 'shipping_1',
        title: 'Shipping Policy',
        type: 'shipping',
        content: 'We ship worldwide with standard and express delivery options...',
        lastUpdated: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        published: true,
        required: false
      },
      {
        id: 'cookies_1',
        title: 'Cookie Policy',
        type: 'cookies',
        content: 'We use cookies to enhance your browsing experience and analyze site traffic...',
        lastUpdated: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        published: false,
        required: false
      }
    ];
  }
}
