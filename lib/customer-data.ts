/**
 * Customer Data Capture System
 * Manages customer information, behavior tracking, and marketing data
 */

export interface Customer {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  preferences: {
    newsletter: boolean;
    smsUpdates: boolean;
    productAlerts: boolean;
    marketingEmails: boolean;
  };
  behavior: {
    totalOrders: number;
    totalSpent: number;
    averageOrderValue: number;
    lastOrderDate?: Date;
    firstOrderDate?: Date;
    favoriteCategories: string[];
    abandonedCarts: number;
    pageViews: number;
    timeOnSite: number;
  };
  segmentation: {
    customerType: 'new' | 'returning' | 'vip' | 'at-risk';
    lifetimeValue: number;
    engagementScore: number;
    lastActivity: Date;
  };
  createdAt: Date;
  updatedAt: Date;
  source: string; // How they found us (google, social, referral, etc.)
}

export interface CustomerInteraction {
  id: string;
  customerId: string;
  type: 'page_view' | 'product_view' | 'cart_add' | 'cart_abandon' | 'purchase' | 'email_open' | 'email_click' | 'newsletter_signup' | 'contact_form';
  data: Record<string, any>;
  timestamp: Date;
  sessionId: string;
  ipAddress?: string;
  userAgent?: string;
}

export interface CustomerSegment {
  id: string;
  name: string;
  description: string;
  criteria: {
    minOrders?: number;
    maxOrders?: number;
    minSpent?: number;
    maxSpent?: number;
    categories?: string[];
    lastActivityDays?: number;
    customerType?: string[];
  };
  customerCount: number;
  createdAt: Date;
}

export interface MarketingCampaign {
  id: string;
  name: string;
  type: 'email' | 'sms' | 'push' | 'retargeting';
  segmentId: string;
  status: 'draft' | 'scheduled' | 'active' | 'paused' | 'completed';
  subject?: string;
  content: string;
  scheduledDate?: Date;
  sentCount: number;
  openCount: number;
  clickCount: number;
  conversionCount: number;
  createdAt: Date;
}

export class CustomerDataCapture {
  private customers: Map<string, Customer> = new Map();
  private interactions: CustomerInteraction[] = [];
  private segments: Map<string, CustomerSegment> = new Map();
  private campaigns: Map<string, MarketingCampaign> = new Map();

  /**
   * Create or update customer from order data
   */
  async captureCustomerFromOrder(orderData: any): Promise<Customer> {
    const customerId = orderData.customer?.id?.toString() || `guest-${Date.now()}`;
    
    let customer = this.customers.get(customerId);
    
    if (!customer) {
      // Create new customer
      customer = {
        id: customerId,
        email: orderData.email,
        firstName: orderData.shipping_address?.first_name || '',
        lastName: orderData.shipping_address?.last_name || '',
        phone: orderData.shipping_address?.phone || '',
        address: {
          street: orderData.shipping_address?.address1 || '',
          city: orderData.shipping_address?.city || '',
          state: orderData.shipping_address?.province || '',
          zipCode: orderData.shipping_address?.zip || '',
          country: orderData.shipping_address?.country || 'US'
        },
        preferences: {
          newsletter: false,
          smsUpdates: false,
          productAlerts: false,
          marketingEmails: true // Default to true for new customers
        },
        behavior: {
          totalOrders: 0,
          totalSpent: 0,
          averageOrderValue: 0,
          favoriteCategories: [],
          abandonedCarts: 0,
          pageViews: 0,
          timeOnSite: 0
        },
        segmentation: {
          customerType: 'new',
          lifetimeValue: 0,
          engagementScore: 0,
          lastActivity: new Date()
        },
        createdAt: new Date(),
        updatedAt: new Date(),
        source: this.detectCustomerSource(orderData)
      };
    }

    // Update customer data
    customer.behavior.totalOrders += 1;
    customer.behavior.totalSpent += parseFloat(orderData.total_price);
    customer.behavior.averageOrderValue = customer.behavior.totalSpent / customer.behavior.totalOrders;
    customer.behavior.lastOrderDate = new Date();
    
    if (!customer.behavior.firstOrderDate) {
      customer.behavior.firstOrderDate = new Date();
    }

    // Update segmentation
    customer.segmentation.lifetimeValue = customer.behavior.totalSpent;
    customer.segmentation.lastActivity = new Date();
    customer.segmentation.customerType = this.calculateCustomerType(customer);
    customer.segmentation.engagementScore = this.calculateEngagementScore(customer);

    // Update favorite categories
    const orderCategories = orderData.line_items?.map((item: any) => item.product_type) || [];
    customer.behavior.favoriteCategories = this.updateFavoriteCategories(
      customer.behavior.favoriteCategories, 
      orderCategories
    );

    customer.updatedAt = new Date();
    this.customers.set(customerId, customer);

    console.log(`📊 Customer captured: ${customer.email} (${customer.segmentation.customerType})`);
    return customer;
  }

  /**
   * Track customer interaction
   */
  async trackInteraction(customerId: string, type: CustomerInteraction['type'], data: Record<string, any> = {}): Promise<void> {
    const interaction: CustomerInteraction = {
      id: `interaction-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      customerId,
      type,
      data,
      timestamp: new Date(),
      sessionId: data.sessionId || `session-${Date.now()}`,
      ipAddress: data.ipAddress,
      userAgent: data.userAgent
    };

    this.interactions.push(interaction);

    // Update customer behavior based on interaction
    const customer = this.customers.get(customerId);
    if (customer) {
      switch (type) {
        case 'page_view':
          customer.behavior.pageViews += 1;
          break;
        case 'cart_add':
          // Track cart additions
          break;
        case 'cart_abandon':
          customer.behavior.abandonedCarts += 1;
          break;
        case 'newsletter_signup':
          customer.preferences.newsletter = true;
          break;
      }
      customer.segmentation.lastActivity = new Date();
      customer.segmentation.engagementScore = this.calculateEngagementScore(customer);
      customer.updatedAt = new Date();
    }

    console.log(`📈 Interaction tracked: ${type} for customer ${customerId}`);
  }

  /**
   * Create customer segment
   */
  async createSegment(name: string, description: string, criteria: CustomerSegment['criteria']): Promise<CustomerSegment> {
    const segment: CustomerSegment = {
      id: `segment-${Date.now()}`,
      name,
      description,
      criteria,
      customerCount: 0,
      createdAt: new Date()
    };

    // Calculate customer count for this segment
    segment.customerCount = this.calculateSegmentCount(segment);
    
    this.segments.set(segment.id, segment);
    
    console.log(`🎯 Segment created: ${name} (${segment.customerCount} customers)`);
    return segment;
  }

  /**
   * Get customers by segment
   */
  getCustomersBySegment(segmentId: string): Customer[] {
    const segment = this.segments.get(segmentId);
    if (!segment) return [];

    return Array.from(this.customers.values()).filter(customer => 
      this.customerMatchesSegment(customer, segment)
    );
  }

  /**
   * Get customer analytics
   */
  getCustomerAnalytics(): {
    totalCustomers: number;
    newCustomers: number;
    returningCustomers: number;
    vipCustomers: number;
    averageLifetimeValue: number;
    totalRevenue: number;
    topCategories: Array<{category: string, count: number}>;
    customerGrowth: Array<{date: string, count: number}>;
  } {
    const customers = Array.from(this.customers.values());
    
    const analytics = {
      totalCustomers: customers.length,
      newCustomers: customers.filter(c => c.segmentation.customerType === 'new').length,
      returningCustomers: customers.filter(c => c.segmentation.customerType === 'returning').length,
      vipCustomers: customers.filter(c => c.segmentation.customerType === 'vip').length,
      averageLifetimeValue: customers.length > 0 
        ? customers.reduce((sum, c) => sum + c.segmentation.lifetimeValue, 0) / customers.length 
        : 0,
      totalRevenue: customers.reduce((sum, c) => sum + c.behavior.totalSpent, 0),
      topCategories: this.calculateTopCategories(customers),
      customerGrowth: this.calculateCustomerGrowth(customers)
    };

    return analytics;
  }

  /**
   * Detect customer source
   */
  private detectCustomerSource(orderData: any): string {
    // Check for UTM parameters, referrer, etc.
    const referrer = orderData.referrer || '';
    const utmSource = orderData.utm_source || '';
    
    if (utmSource) return utmSource;
    if (referrer.includes('google')) return 'google';
    if (referrer.includes('facebook')) return 'facebook';
    if (referrer.includes('instagram')) return 'instagram';
    if (referrer.includes('twitter')) return 'twitter';
    
    return 'direct';
  }

  /**
   * Calculate customer type
   */
  private calculateCustomerType(customer: Customer): 'new' | 'returning' | 'vip' | 'at-risk' {
    const daysSinceLastOrder = customer.behavior.lastOrderDate 
      ? (Date.now() - customer.behavior.lastOrderDate.getTime()) / (1000 * 60 * 60 * 24)
      : 0;

    if (customer.behavior.totalOrders === 1) return 'new';
    if (customer.segmentation.lifetimeValue > 100) return 'vip';
    if (daysSinceLastOrder > 90) return 'at-risk';
    return 'returning';
  }

  /**
   * Calculate engagement score
   */
  private calculateEngagementScore(customer: Customer): number {
    let score = 0;
    
    // Order frequency
    score += customer.behavior.totalOrders * 10;
    
    // Spending
    score += customer.segmentation.lifetimeValue * 0.1;
    
    // Website engagement
    score += customer.behavior.pageViews * 0.5;
    
    // Newsletter subscription
    if (customer.preferences.newsletter) score += 20;
    
    // Recent activity
    const daysSinceActivity = (Date.now() - customer.segmentation.lastActivity.getTime()) / (1000 * 60 * 60 * 24);
    if (daysSinceActivity < 7) score += 30;
    else if (daysSinceActivity < 30) score += 15;
    
    return Math.min(score, 100); // Cap at 100
  }

  /**
   * Update favorite categories
   */
  private updateFavoriteCategories(current: string[], newCategories: string[]): string[] {
    const categoryCount: Record<string, number> = {};
    
    // Count existing categories
    current.forEach(cat => categoryCount[cat] = (categoryCount[cat] || 0) + 1);
    
    // Add new categories
    newCategories.forEach(cat => categoryCount[cat] = (categoryCount[cat] || 0) + 1);
    
    // Return top 5 categories
    return Object.entries(categoryCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([category]) => category);
  }

  /**
   * Calculate segment count
   */
  private calculateSegmentCount(segment: CustomerSegment): number {
    return Array.from(this.customers.values()).filter(customer => 
      this.customerMatchesSegment(customer, segment)
    ).length;
  }

  /**
   * Check if customer matches segment criteria
   */
  private customerMatchesSegment(customer: Customer, segment: CustomerSegment): boolean {
    const { criteria } = segment;
    
    if (criteria.minOrders && customer.behavior.totalOrders < criteria.minOrders) return false;
    if (criteria.maxOrders && customer.behavior.totalOrders > criteria.maxOrders) return false;
    if (criteria.minSpent && customer.segmentation.lifetimeValue < criteria.minSpent) return false;
    if (criteria.maxSpent && customer.segmentation.lifetimeValue > criteria.maxSpent) return false;
    if (criteria.categories && !criteria.categories.some(cat => customer.behavior.favoriteCategories.includes(cat))) return false;
    if (criteria.customerType && !criteria.customerType.includes(customer.segmentation.customerType)) return false;
    
    if (criteria.lastActivityDays) {
      const daysSinceActivity = (Date.now() - customer.segmentation.lastActivity.getTime()) / (1000 * 60 * 60 * 24);
      if (daysSinceActivity > criteria.lastActivityDays) return false;
    }
    
    return true;
  }

  /**
   * Calculate top categories
   */
  private calculateTopCategories(customers: Customer[]): Array<{category: string, count: number}> {
    const categoryCount: Record<string, number> = {};
    
    customers.forEach(customer => {
      customer.behavior.favoriteCategories.forEach(category => {
        categoryCount[category] = (categoryCount[category] || 0) + 1;
      });
    });
    
    return Object.entries(categoryCount)
      .map(([category, count]) => ({ category, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }

  /**
   * Calculate customer growth over time
   */
  private calculateCustomerGrowth(customers: Customer[]): Array<{date: string, count: number}> {
    const growth: Record<string, number> = {};
    
    customers.forEach(customer => {
      const date = customer.createdAt.toISOString().split('T')[0];
      growth[date] = (growth[date] || 0) + 1;
    });
    
    return Object.entries(growth)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }

  /**
   * Get customer by ID
   */
  getCustomer(customerId: string): Customer | undefined {
    return this.customers.get(customerId);
  }

  /**
   * Get all customers
   */
  getAllCustomers(): Customer[] {
    return Array.from(this.customers.values());
  }

  /**
   * Get customer interactions
   */
  getCustomerInteractions(customerId: string): CustomerInteraction[] {
    return this.interactions.filter(interaction => interaction.customerId === customerId);
  }
}

// Export singleton instance
export const customerDataCapture = new CustomerDataCapture();
