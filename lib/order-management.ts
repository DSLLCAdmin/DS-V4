/**
 * Order Management Dashboard
 * Centralized order processing, status tracking, and error handling
 */

export interface Order {
  id: string;
  customerId: string;
  customerEmail: string;
  customerName: string;
  customerAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  items: OrderItem[];
  status: OrderStatus;
  totalAmount: number;
  shippingCost: number;
  tax: number;
  createdAt: Date;
  updatedAt: Date;
  amazonOrderId?: string;
  trackingNumber?: string;
  errorMessage?: string;
  retryCount: number;
}

export interface OrderItem {
  productId: string;
  amazonAsin?: string;
  title: string;
  quantity: number;
  price: number;
  image: string;
}

export type OrderStatus = 
  | 'pending'           // Order received, awaiting processing
  | 'processing'        // Being processed by Amazon FBA
  | 'shipped'           // Shipped by Amazon
  | 'delivered'         // Delivered to customer
  | 'cancelled'         // Order cancelled
  | 'error'             // Processing error occurred
  | 'retry'             // Retrying after error
  | 'refunded';         // Order refunded

export interface OrderAnalytics {
  totalOrders: number;
  ordersByStatus: Record<OrderStatus, number>;
  averageOrderValue: number;
  totalRevenue: number;
  errorRate: number;
  fulfillmentTime: number; // Average hours from order to shipment
}

export class OrderManagementDashboard {
  private orders: Map<string, Order> = new Map();
  private analytics: OrderAnalytics = {
    totalOrders: 0,
    ordersByStatus: {
      pending: 0,
      processing: 0,
      shipped: 0,
      delivered: 0,
      cancelled: 0,
      error: 0,
      retry: 0,
      refunded: 0
    },
    averageOrderValue: 0,
    totalRevenue: 0,
    errorRate: 0,
    fulfillmentTime: 0
  };

  /**
   * Create a new order from Shopify webhook
   */
  async createOrder(shopifyOrder: any): Promise<Order> {
    const order: Order = {
      id: shopifyOrder.id.toString(),
      customerId: shopifyOrder.customer?.id?.toString() || 'guest',
      customerEmail: shopifyOrder.email,
      customerName: `${shopifyOrder.shipping_address?.first_name || ''} ${shopifyOrder.shipping_address?.last_name || ''}`.trim(),
      customerAddress: {
        street: shopifyOrder.shipping_address?.address1 || '',
        city: shopifyOrder.shipping_address?.city || '',
        state: shopifyOrder.shipping_address?.province || '',
        zipCode: shopifyOrder.shipping_address?.zip || '',
        country: shopifyOrder.shipping_address?.country || 'US'
      },
      items: shopifyOrder.line_items.map((item: any) => ({
        productId: item.product_id.toString(),
        title: item.title,
        quantity: item.quantity,
        price: parseFloat(item.price),
        image: item.image?.src || ''
      })),
      status: 'pending',
      totalAmount: parseFloat(shopifyOrder.total_price),
      shippingCost: parseFloat(shopifyOrder.shipping_lines?.[0]?.price || '0'),
      tax: parseFloat(shopifyOrder.total_tax || '0'),
      createdAt: new Date(shopifyOrder.created_at),
      updatedAt: new Date(),
      retryCount: 0
    };

    this.orders.set(order.id, order);
    this.updateAnalytics();
    
    console.log(`📦 Order created: ${order.id} for ${order.customerEmail}`);
    return order;
  }

  /**
   * Update order status
   */
  async updateOrderStatus(orderId: string, status: OrderStatus, additionalData?: Partial<Order>): Promise<void> {
    const order = this.orders.get(orderId);
    if (!order) {
      throw new Error(`Order ${orderId} not found`);
    }

    const previousStatus = order.status;
    order.status = status;
    order.updatedAt = new Date();
    
    if (additionalData) {
      Object.assign(order, additionalData);
    }

    this.orders.set(orderId, order);
    this.updateAnalytics();

    console.log(`📊 Order ${orderId} status: ${previousStatus} → ${status}`);
  }

  /**
   * Process pending orders (send to Amazon FBA)
   */
  async processPendingOrders(): Promise<void> {
    const pendingOrders = Array.from(this.orders.values())
      .filter(order => order.status === 'pending');

    console.log(`🔄 Processing ${pendingOrders.length} pending orders...`);

    for (const order of pendingOrders) {
      try {
        await this.processOrder(order);
      } catch (error) {
        console.error(`❌ Error processing order ${order.id}:`, error);
        await this.handleOrderError(order, error as Error);
      }
    }
  }

  /**
   * Process individual order
   */
  private async processOrder(order: Order): Promise<void> {
    // Update status to processing
    await this.updateOrderStatus(order.id, 'processing');

    // TODO: Integrate with Amazon FBA API
    // For now, simulate processing
    console.log(`🚀 Processing order ${order.id} for Amazon FBA...`);
    
    // Simulate Amazon order creation
    const amazonOrderId = `AMZ-${Date.now()}`;
    await this.updateOrderStatus(order.id, 'processing', { amazonOrderId });

    // Simulate shipping after processing delay
    setTimeout(async () => {
      const trackingNumber = `TRK-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
      await this.updateOrderStatus(order.id, 'shipped', { trackingNumber });
      
      // Simulate delivery
      setTimeout(async () => {
        await this.updateOrderStatus(order.id, 'delivered');
      }, 2000);
    }, 1000);
  }

  /**
   * Handle order processing errors
   */
  private async handleOrderError(order: Order, error: Error): Promise<void> {
    order.errorMessage = error.message;
    order.retryCount++;

    if (order.retryCount < 3) {
      await this.updateOrderStatus(order.id, 'retry');
      console.log(`🔄 Retrying order ${order.id} (attempt ${order.retryCount})`);
      
      // Retry after delay
      setTimeout(() => {
        this.processOrder(order);
      }, 5000 * order.retryCount); // Exponential backoff
    } else {
      await this.updateOrderStatus(order.id, 'error');
      console.error(`❌ Order ${order.id} failed after ${order.retryCount} attempts`);
    }
  }

  /**
   * Get order by ID
   */
  getOrder(orderId: string): Order | undefined {
    return this.orders.get(orderId);
  }

  /**
   * Get all orders with optional filtering
   */
  getOrders(status?: OrderStatus, limit?: number): Order[] {
    let orders = Array.from(this.orders.values());
    
    if (status) {
      orders = orders.filter(order => order.status === status);
    }
    
    // Sort by creation date (newest first)
    orders.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    
    if (limit) {
      orders = orders.slice(0, limit);
    }
    
    return orders;
  }

  /**
   * Get order analytics
   */
  getAnalytics(): OrderAnalytics {
    return { ...this.analytics };
  }

  /**
   * Update analytics calculations
   */
  private updateAnalytics(): void {
    const orders = Array.from(this.orders.values());
    
    this.analytics.totalOrders = orders.length;
    this.analytics.totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
    this.analytics.averageOrderValue = orders.length > 0 ? this.analytics.totalRevenue / orders.length : 0;
    
    // Count orders by status
    this.analytics.ordersByStatus = {
      pending: 0,
      processing: 0,
      shipped: 0,
      delivered: 0,
      cancelled: 0,
      error: 0,
      retry: 0,
      refunded: 0
    };
    
    orders.forEach(order => {
      this.analytics.ordersByStatus[order.status]++;
    });
    
    // Calculate error rate
    const errorOrders = orders.filter(order => order.status === 'error').length;
    this.analytics.errorRate = orders.length > 0 ? (errorOrders / orders.length) * 100 : 0;
    
    // Calculate average fulfillment time
    const shippedOrders = orders.filter(order => order.status === 'shipped' || order.status === 'delivered');
    if (shippedOrders.length > 0) {
      const totalFulfillmentTime = shippedOrders.reduce((sum, order) => {
        const fulfillmentTime = order.updatedAt.getTime() - order.createdAt.getTime();
        return sum + fulfillmentTime;
      }, 0);
      this.analytics.fulfillmentTime = totalFulfillmentTime / shippedOrders.length / (1000 * 60 * 60); // Convert to hours
    }
  }

  /**
   * Cancel order
   */
  async cancelOrder(orderId: string, reason?: string): Promise<void> {
    const order = this.orders.get(orderId);
    if (!order) {
      throw new Error(`Order ${orderId} not found`);
    }

    if (order.status === 'delivered') {
      throw new Error('Cannot cancel delivered order');
    }

    await this.updateOrderStatus(orderId, 'cancelled');
    console.log(`❌ Order ${orderId} cancelled${reason ? `: ${reason}` : ''}`);
  }

  /**
   * Refund order
   */
  async refundOrder(orderId: string, amount?: number): Promise<void> {
    const order = this.orders.get(orderId);
    if (!order) {
      throw new Error(`Order ${orderId} not found`);
    }

    const refundAmount = amount || order.totalAmount;
    await this.updateOrderStatus(orderId, 'refunded');
    console.log(`💰 Order ${orderId} refunded: $${refundAmount}`);
  }
}

// Export singleton instance
export const orderDashboard = new OrderManagementDashboard();
