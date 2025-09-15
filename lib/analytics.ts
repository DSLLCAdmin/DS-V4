// Analytics system for DS website
// This handles both product interest tracking and general website analytics

interface ProductInterestEvent {
  event: 'product_interest';
  productId: string;
  productTitle: string;
  productCategory: string;
  timestamp: string;
  userAgent: string;
  referrer: string;
}

interface PageViewEvent {
  event: 'page_view';
  page: string;
  timestamp: string;
  userAgent: string;
  referrer: string;
}

interface CartEvent {
  event: 'cart_action';
  action: 'add' | 'remove' | 'update' | 'clear';
  productId?: string;
  productTitle?: string;
  quantity?: number;
  timestamp: string;
}

interface SearchEvent {
  event: 'search';
  query: string;
  resultsCount: number;
  timestamp: string;
}

interface FilterEvent {
  event: 'filter';
  filterType: 'category' | 'sort';
  value: string;
  timestamp: string;
}

type AnalyticsEvent = ProductInterestEvent | PageViewEvent | CartEvent | SearchEvent | FilterEvent;

class AnalyticsManager {
  private apiEndpoint: string;
  private isDevelopment: boolean;

  constructor() {
    // Set your analytics endpoint here
    this.apiEndpoint = process.env.NEXT_PUBLIC_ANALYTICS_ENDPOINT || '/api/analytics';
    this.isDevelopment = process.env.NODE_ENV === 'development';
  }

  // Track product interest
  async trackProductInterest(productId: string, productTitle: string, productCategory: string) {
    const event: ProductInterestEvent = {
      event: 'product_interest',
      productId,
      productTitle,
      productCategory,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      referrer: document.referrer || 'direct'
    };

    await this.sendEvent(event);
    
    // Also store locally for offline capability
    this.storeLocally('product_interest', event);
  }

  // Track page views
  async trackPageView(page: string) {
    const event: PageViewEvent = {
      event: 'page_view',
      page,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      referrer: document.referrer || 'direct'
    };

    await this.sendEvent(event);
  }

  // Track cart actions
  async trackCartAction(action: 'add' | 'remove' | 'update' | 'clear', productId?: string, productTitle?: string, quantity?: number) {
    const event: CartEvent = {
      event: 'cart_action',
      action,
      productId,
      productTitle,
      quantity,
      timestamp: new Date().toISOString()
    };

    await this.sendEvent(event);
  }

  // Track search queries
  async trackSearch(query: string, resultsCount: number) {
    const event: SearchEvent = {
      event: 'search',
      query,
      resultsCount,
      timestamp: new Date().toISOString()
    };

    await this.sendEvent(event);
  }

  // Track filter usage
  async trackFilter(filterType: 'category' | 'sort', value: string) {
    const event: FilterEvent = {
      event: 'filter',
      filterType,
      value,
      timestamp: new Date().toISOString()
    };

    await this.sendEvent(event);
  }

  // Send event to analytics endpoint
  private async sendEvent(event: AnalyticsEvent) {
    try {
      if (this.isDevelopment) {
        console.log('Analytics Event:', event);
        return;
      }

      // Send to your analytics service
      const response = await fetch(this.apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(event)
      });

      if (!response.ok) {
        console.error('Analytics tracking failed:', response.statusText);
      }
    } catch (error) {
      console.error('Analytics error:', error);
      // Store for retry later
      this.storeLocally('failed_events', event);
    }
  }

  // Store events locally for offline capability
  private storeLocally(key: string, event: any) {
    try {
      const existing = JSON.parse(localStorage.getItem(key) || '[]');
      existing.push(event);
      localStorage.setItem(key, JSON.stringify(existing));
    } catch (error) {
      console.error('Failed to store analytics locally:', error);
    }
  }

  // Get local analytics data (for admin dashboard)
  getLocalAnalytics() {
    try {
      return {
        productInterest: JSON.parse(localStorage.getItem('product_interest') || '[]'),
        failedEvents: JSON.parse(localStorage.getItem('failed_events') || '[]')
      };
    } catch (error) {
      console.error('Failed to get local analytics:', error);
      return { productInterest: [], failedEvents: [] };
    }
  }

  // Clear local analytics data
  clearLocalAnalytics() {
    localStorage.removeItem('product_interest');
    localStorage.removeItem('failed_events');
  }
}

// Export singleton instance
export const analytics = new AnalyticsManager();

// Export types for use in components
export type { AnalyticsEvent, ProductInterestEvent, PageViewEvent, CartEvent, SearchEvent, FilterEvent };
