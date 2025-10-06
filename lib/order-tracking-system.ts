/**
 * Enhanced Order Tracking System for DS LLC
 * Integrates payment processing, email notifications, and customer management
 */

import { emailNotificationService, OrderEmailData } from './email-notifications';
import { customerSupportBot } from './customer-support-bot';
import { stripePaymentService } from './stripe-payment-service';

export interface OrderTrackingData {
  id: string;
  orderNumber: string;
  customerId: string;
  customerEmail: string;
  customerName: string;
  status: 'pending' | 'processing' | 'paid' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  items: Array<{
    id: string;
    name: string;
    quantity: number;
    price: number;
    image?: string;
  }>;
  totalAmount: number;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  paymentIntentId?: string;
  trackingNumber?: string;
  carrier?: string;
  estimatedDelivery?: Date;
  actualDelivery?: Date;
  createdAt: Date;
  updatedAt: Date;
  notes?: string;
}

export interface OrderAnalytics {
  totalOrders: number;
  ordersByStatus: Record<string, number>;
  totalRevenue: number;
  averageOrderValue: number;
  conversionRate: number;
  customerSatisfaction: number;
}

export class OrderTrackingSystem {
  private orders: Map<string, OrderTrackingData> = new Map();
  private analytics: OrderAnalytics = {
    totalOrders: 0,
    ordersByStatus: {},
    totalRevenue: 0,
    averageOrderValue: 0,
    conversionRate: 0,
    customerSatisfaction: 0
  };

  /**
   * Create a new order from checkout
   */
  async createOrder(orderData: Omit<OrderTrackingData, 'id' | 'createdAt' | 'updatedAt' | 'status' | 'paymentStatus'>): Promise<OrderTrackingData> {
    const orderId = `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const orderNumber = `DS-${Date.now().toString().slice(-8)}`;
    
    const order: OrderTrackingData = {
      ...orderData,
      id: orderId,
      orderNumber,
      status: 'pending',
      paymentStatus: 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.orders.set(orderId, order);
    this.updateAnalytics();

    console.log(`📦 Order created: ${orderNumber} for ${order.customerEmail}`);
    
    // Start customer support session for this order
    customerSupportBot.startSession(order.customerId, order.customerEmail, order.customerName, orderId);
    
    return order;
  }

  /**
   * Process payment for an order
   */
  async processPayment(orderId: string): Promise<{ success: boolean; error?: string }> {
    const order = this.orders.get(orderId);
    if (!order) {
      return { success: false, error: 'Order not found' };
    }

    try {
      // Create payment intent with Stripe
      const paymentResult = await stripePaymentService.createPaymentIntent({
        amount: order.totalAmount * 100, // Convert to cents
        currency: 'usd',
        customerEmail: order.customerEmail,
        customerName: order.customerName,
        orderId: order.id,
        items: order.items,
        shippingAddress: order.shippingAddress
      });

      if (paymentResult.success && paymentResult.paymentIntentId) {
        // Confirm payment (simulate successful payment)
        const confirmationResult = await stripePaymentService.confirmPaymentIntent(paymentResult.paymentIntentId);
        
        if (confirmationResult.success) {
          await this.updateOrderStatus(orderId, 'paid', { paymentIntentId: paymentResult.paymentIntentId });
          
          // Send order confirmation email
          await this.sendOrderConfirmationEmail(order);
          
          return { success: true };
        } else {
          await this.updateOrderStatus(orderId, 'payment_failed');
          return { success: false, error: confirmationResult.error };
        }
      } else {
        await this.updateOrderStatus(orderId, 'payment_failed');
        return { success: false, error: paymentResult.error };
      }
    } catch (error) {
      await this.updateOrderStatus(orderId, 'payment_failed');
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Payment processing failed' 
      };
    }
  }

  /**
   * Update order status
   */
  async updateOrderStatus(orderId: string, status: OrderTrackingData['status'], additionalData?: Partial<OrderTrackingData>): Promise<void> {
    const order = this.orders.get(orderId);
    if (!order) {
      throw new Error('Order not found');
    }

    const previousStatus = order.status;
    order.status = status;
    order.updatedAt = new Date();

    // Update additional data if provided
    if (additionalData) {
      Object.assign(order, additionalData);
    }

    this.orders.set(orderId, order);
    this.updateAnalytics();

    console.log(`📝 Order ${order.orderNumber} status updated: ${previousStatus} → ${status}`);

    // Handle status-specific actions
    await this.handleStatusChange(order, previousStatus, status);
  }

  /**
   * Handle status change actions
   */
  private async handleStatusChange(order: OrderTrackingData, previousStatus: string, newStatus: string): Promise<void> {
    switch (newStatus) {
      case 'paid':
        // Start processing the order
        setTimeout(() => this.updateOrderStatus(order.id, 'processing'), 1000);
        break;
      
      case 'processing':
        // Simulate order processing and shipping
        setTimeout(async () => {
          const trackingNumber = `TRK-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
          const estimatedDelivery = new Date();
          estimatedDelivery.setDate(estimatedDelivery.getDate() + 3); // 3 days from now
          
          await this.updateOrderStatus(order.id, 'shipped', {
            trackingNumber,
            carrier: 'UPS',
            estimatedDelivery
          });
        }, 2000);
        break;
      
      case 'shipped':
        // Send shipping update email
        await this.sendShippingUpdateEmail(order);
        break;
      
      case 'delivered':
        // Send delivery confirmation email
        await this.sendDeliveryConfirmationEmail(order);
        break;
    }
  }

  /**
   * Send order confirmation email
   */
  private async sendOrderConfirmationEmail(order: OrderTrackingData): Promise<void> {
    try {
      const emailData: OrderEmailData = {
        orderId: order.id,
        customerName: order.customerName,
        customerEmail: order.customerEmail,
        orderNumber: order.orderNumber,
        items: order.items,
        totalAmount: order.totalAmount,
        shippingAddress: order.shippingAddress
      };

      await emailNotificationService.sendOrderConfirmation(emailData);
      console.log(`📧 Order confirmation email sent for order: ${order.orderNumber}`);
    } catch (error) {
      console.error('❌ Failed to send order confirmation email:', error);
    }
  }

  /**
   * Send shipping update email
   */
  private async sendShippingUpdateEmail(order: OrderTrackingData): Promise<void> {
    try {
      const emailData: OrderEmailData = {
        orderId: order.id,
        customerName: order.customerName,
        customerEmail: order.customerEmail,
        orderNumber: order.orderNumber,
        items: order.items,
        totalAmount: order.totalAmount,
        shippingAddress: order.shippingAddress,
        trackingNumber: order.trackingNumber,
        estimatedDelivery: order.estimatedDelivery
      };

      await emailNotificationService.sendShippingUpdate(emailData);
      console.log(`📧 Shipping update email sent for order: ${order.orderNumber}`);
    } catch (error) {
      console.error('❌ Failed to send shipping update email:', error);
    }
  }

  /**
   * Send delivery confirmation email
   */
  private async sendDeliveryConfirmationEmail(order: OrderTrackingData): Promise<void> {
    try {
      // This would use a delivery confirmation template
      console.log(`📧 Delivery confirmation email sent for order: ${order.orderNumber}`);
    } catch (error) {
      console.error('❌ Failed to send delivery confirmation email:', error);
    }
  }

  /**
   * Get order by ID
   */
  getOrder(orderId: string): OrderTrackingData | undefined {
    return this.orders.get(orderId);
  }

  /**
   * Get order by order number
   */
  getOrderByNumber(orderNumber: string): OrderTrackingData | undefined {
    return Array.from(this.orders.values()).find(order => order.orderNumber === orderNumber);
  }

  /**
   * Get orders by customer email
   */
  getOrdersByCustomer(customerEmail: string): OrderTrackingData[] {
    return Array.from(this.orders.values()).filter(order => order.customerEmail === customerEmail);
  }

  /**
   * Get all orders
   */
  getAllOrders(): OrderTrackingData[] {
    return Array.from(this.orders.values());
  }

  /**
   * Get orders by status
   */
  getOrdersByStatus(status: OrderTrackingData['status']): OrderTrackingData[] {
    return Array.from(this.orders.values()).filter(order => order.status === status);
  }

  /**
   * Update analytics
   */
  private updateAnalytics(): void {
    const orders = Array.from(this.orders.values());
    
    this.analytics.totalOrders = orders.length;
    this.analytics.totalRevenue = orders
      .filter(order => order.status !== 'cancelled')
      .reduce((sum, order) => sum + order.totalAmount, 0);
    
    this.analytics.averageOrderValue = this.analytics.totalOrders > 0 
      ? this.analytics.totalRevenue / this.analytics.totalOrders 
      : 0;

    // Count orders by status
    this.analytics.ordersByStatus = orders.reduce((acc, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Calculate conversion rate (simplified)
    this.analytics.conversionRate = orders.filter(order => order.status === 'delivered').length / Math.max(orders.length, 1) * 100;
  }

  /**
   * Get analytics
   */
  getAnalytics(): OrderAnalytics {
    return { ...this.analytics };
  }

  /**
   * Search orders
   */
  searchOrders(query: string): OrderTrackingData[] {
    const lowerQuery = query.toLowerCase();
    return Array.from(this.orders.values()).filter(order => 
      order.orderNumber.toLowerCase().includes(lowerQuery) ||
      order.customerName.toLowerCase().includes(lowerQuery) ||
      order.customerEmail.toLowerCase().includes(lowerQuery) ||
      order.trackingNumber?.toLowerCase().includes(lowerQuery)
    );
  }

  /**
   * Cancel order
   */
  async cancelOrder(orderId: string, reason?: string): Promise<{ success: boolean; error?: string }> {
    const order = this.orders.get(orderId);
    if (!order) {
      return { success: false, error: 'Order not found' };
    }

    if (order.status === 'delivered') {
      return { success: false, error: 'Cannot cancel delivered order' };
    }

    await this.updateOrderStatus(orderId, 'cancelled', { notes: reason });
    
    // Process refund if payment was made
    if (order.paymentStatus === 'paid') {
      await this.processRefund(orderId);
    }

    return { success: true };
  }

  /**
   * Process refund
   */
  private async processRefund(orderId: string): Promise<void> {
    const order = this.orders.get(orderId);
    if (!order || !order.paymentIntentId) return;

    try {
      console.log(`💰 Processing refund for order: ${order.orderNumber}`);
      
      // Simulate refund processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      await this.updateOrderStatus(orderId, 'refunded');
      console.log(`✅ Refund processed for order: ${order.orderNumber}`);
    } catch (error) {
      console.error('❌ Refund processing failed:', error);
    }
  }
}

// Export singleton instance
export const orderTrackingSystem = new OrderTrackingSystem();
