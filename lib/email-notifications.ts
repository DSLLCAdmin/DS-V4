/**
 * Email Notification System for DS LLC
 * Handles order confirmations, shipping updates, and customer communications
 */

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  htmlContent: string;
  textContent: string;
  variables: string[];
}

export interface EmailNotification {
  id: string;
  type: 'order_confirmation' | 'shipping_update' | 'delivery_confirmation' | 'support_response' | 'marketing';
  recipient: string;
  subject: string;
  content: string;
  status: 'pending' | 'sent' | 'failed' | 'delivered';
  sentAt?: Date;
  errorMessage?: string;
  orderId?: string;
  customerId?: string;
}

export interface OrderEmailData {
  orderId: string;
  customerName: string;
  customerEmail: string;
  orderNumber: string;
  items: Array<{
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
  trackingNumber?: string;
  estimatedDelivery?: Date;
}

export class EmailNotificationService {
  private templates: Map<string, EmailTemplate> = new Map();
  private notifications: EmailNotification[] = [];

  constructor() {
    this.initializeTemplates();
  }

  private initializeTemplates() {
    // Order Confirmation Template
    this.templates.set('order_confirmation', {
      id: 'order_confirmation',
      name: 'Order Confirmation',
      subject: 'Order Confirmation - DS LLC Order #{{orderNumber}}',
      htmlContent: '<!DOCTYPE html>' +
'<html>' +
'<head>' +
'  <meta charset="utf-8">' +
'  <title>Order Confirmation</title>' +
'  <style>' +
'    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }' +
'    .container { max-width: 600px; margin: 0 auto; padding: 20px; }' +
'    .header { background: #1a1a1a; color: white; padding: 20px; text-align: center; }' +
'    .content { padding: 20px; background: #f9f9f9; }' +
'    .order-details { background: white; padding: 15px; margin: 15px 0; border-radius: 5px; }' +
'    .item { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }' +
'    .total { font-weight: bold; font-size: 18px; }' +
'    .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }' +
'  </style>' +
'</head>' +
'<body>' +
'  <div class="container">' +
'    <div class="header">' +
'      <h1>DS LLC - Order Confirmation</h1>' +
'    </div>' +
'    <div class="content">' +
'      <h2>Thank you for your order, {{customerName}}!</h2>' +
'      <p>Your order has been confirmed and is being processed.</p>' +
'      ' +
'      <div class="order-details">' +
'        <h3>Order Details</h3>' +
'        <p><strong>Order Number:</strong> {{orderNumber}}</p>' +
'        <p><strong>Order Date:</strong> {{orderDate}}</p>' +
'        ' +
'        <h4>Items Ordered:</h4>' +
'        <div id="items-list">' +
'          <!-- Items will be inserted here -->' +
'        </div>' +
'        ' +
'        <div class="total">' +
'          <p>Total: ${{totalAmount}}</p>' +
'        </div>' +
'      </div>' +
'      ' +
'      <div class="order-details">' +
'        <h3>Shipping Address</h3>' +
'        <p>{{shippingAddress.street}}<br>' +
'        {{shippingAddress.city}}, {{shippingAddress.state}} {{shippingAddress.zipCode}}<br>' +
'        {{shippingAddress.country}}</p>' +
'      </div>' +
'      ' +
'      <p>We\'ll send you another email when your order ships with tracking information.</p>' +
'      <p>If you have any questions, please contact us at support@dsllc.com</p>' +
'    </div>' +
'    <div class="footer">' +
'      <p>DS LLC - Dark Streets Publishing<br>' +
'      <a href="https://dsllc.com">www.dsllc.com</a></p>' +
'    </div>' +
'  </div>' +
'</body>' +
'</html>',
      textContent: 'DS LLC - Order Confirmation\n\n' +
        'Thank you for your order, {{customerName}}!\n\n' +
        'Order Details:\n' +
        'Order Number: {{orderNumber}}\n' +
        'Order Date: {{orderDate}}\n\n' +
        'Items Ordered:\n' +
        '{{itemsList}}\n\n' +
        'Total: ${{totalAmount}}\n\n' +
        'Shipping Address:\n' +
        '{{shippingAddress.street}}\n' +
        '{{shippingAddress.city}}, {{shippingAddress.state}} {{shippingAddress.zipCode}}\n' +
        '{{shippingAddress.country}}\n\n' +
        'We\'ll send you another email when your order ships with tracking information.\n' +
        'If you have any questions, please contact us at support@dsllc.com\n\n' +
        'DS LLC - Dark Streets Publishing\n' +
        'www.dsllc.com',
      variables: ['customerName', 'orderNumber', 'orderDate', 'items', 'totalAmount', 'shippingAddress']
    });

    // Shipping Update Template
    this.templates.set('shipping_update', {
      id: 'shipping_update',
      name: 'Shipping Update',
      subject: 'Your DS LLC Order #{{orderNumber}} Has Shipped!',
      htmlContent: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Shipping Update</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #1a1a1a; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background: #f9f9f9; }
            .tracking { background: #e8f4fd; padding: 15px; margin: 15px 0; border-radius: 5px; text-align: center; }
            .tracking-number { font-size: 24px; font-weight: bold; color: #0066cc; }
            .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>DS LLC - Shipping Update</h1>
            </div>
            <div class="content">
              <h2>Great news, {{customerName}}!</h2>
              <p>Your order #{{orderNumber}} has shipped and is on its way to you.</p>
              
              <div class="tracking">
                <h3>Tracking Information</h3>
                <div class="tracking-number">{{trackingNumber}}</div>
                <p>Estimated Delivery: {{estimatedDelivery}}</p>
                <p><a href="{{trackingUrl}}" style="color: #0066cc;">Track Your Package</a></p>
              </div>
              
              <p>You can track your package using the tracking number above or by clicking the tracking link.</p>
              <p>If you have any questions about your shipment, please contact us at support@dsllc.com</p>
            </div>
            <div class="footer">
              <p>DS LLC - Dark Streets Publishing<br>
              <a href="https://dsllc.com">www.dsllc.com</a></p>
            </div>
          </div>
        </body>
        </html>
      `,
      textContent: `
        DS LLC - Shipping Update
        
        Great news, {{customerName}}!
        Your order #{{orderNumber}} has shipped and is on its way to you.
        
        Tracking Information:
        Tracking Number: {{trackingNumber}}
        Estimated Delivery: {{estimatedDelivery}}
        Track Your Package: {{trackingUrl}}
        
        You can track your package using the tracking number above or by visiting the tracking URL.
        If you have any questions about your shipment, please contact us at support@dsllc.com
        
        DS LLC - Dark Streets Publishing
        www.dsllc.com
      `,
      variables: ['customerName', 'orderNumber', 'trackingNumber', 'estimatedDelivery', 'trackingUrl']
    });
  }

  /**
   * Send order confirmation email
   */
  async sendOrderConfirmation(orderData: OrderEmailData): Promise<EmailNotification> {
    const template = this.templates.get('order_confirmation');
    if (!template) {
      throw new Error('Order confirmation template not found');
    }

    const notification: EmailNotification = {
      id: `email_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: 'order_confirmation',
      recipient: orderData.customerEmail,
      subject: template.subject.replace('{{orderNumber}}', orderData.orderNumber),
      content: this.processTemplate(template.htmlContent, {
        customerName: orderData.customerName,
        orderNumber: orderData.orderNumber,
        orderDate: new Date().toLocaleDateString(),
        items: orderData.items,
        totalAmount: orderData.totalAmount.toFixed(2),
        shippingAddress: orderData.shippingAddress
      }),
      status: 'pending',
      orderId: orderData.orderId,
      customerId: orderData.customerEmail
    };

    this.notifications.push(notification);
    
    // Simulate sending email
    await this.sendEmail(notification);
    
    return notification;
  }

  /**
   * Send shipping update email
   */
  async sendShippingUpdate(orderData: OrderEmailData): Promise<EmailNotification> {
    const template = this.templates.get('shipping_update');
    if (!template) {
      throw new Error('Shipping update template not found');
    }

    const notification: EmailNotification = {
      id: `email_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: 'shipping_update',
      recipient: orderData.customerEmail,
      subject: template.subject.replace('{{orderNumber}}', orderData.orderNumber),
      content: this.processTemplate(template.htmlContent, {
        customerName: orderData.customerName,
        orderNumber: orderData.orderNumber,
        trackingNumber: orderData.trackingNumber || 'TRACKING_PENDING',
        estimatedDelivery: orderData.estimatedDelivery?.toLocaleDateString() || 'TBD',
        trackingUrl: `https://tracking.dsllc.com/${orderData.trackingNumber || 'pending'}`
      }),
      status: 'pending',
      orderId: orderData.orderId,
      customerId: orderData.customerEmail
    };

    this.notifications.push(notification);
    
    // Simulate sending email
    await this.sendEmail(notification);
    
    return notification;
  }

  /**
   * Process email template with variables
   */
  private processTemplate(template: string, variables: Record<string, any>): string {
    let processed = template;
    
    // Replace simple variables
    Object.entries(variables).forEach(([key, value]) => {
      const regex = new RegExp(`{{${key}}}`, 'g');
      processed = processed.replace(regex, String(value));
    });

    // Handle array variables (items) - replace the items placeholder
    if (variables.items && Array.isArray(variables.items)) {
      const itemsHtml = variables.items.map((item: any) => 
        `<div class="item">
          <span>${item.name} (Qty: ${item.quantity})</span>
          <span>$${item.price}</span>
        </div>`
      ).join('');
      
      const itemsText = variables.items.map((item: any) => 
        `- ${item.name} (Qty: ${item.quantity}) - $${item.price}`
      ).join('\n');
      
      // Replace the items placeholder in HTML
      processed = processed.replace('<div id="items-list">\n          <!-- Items will be inserted here -->\n        </div>', itemsHtml);
      
      // Replace the items placeholder in text
      processed = processed.replace('{{itemsList}}', itemsText);
    }

    return processed;
  }

  /**
   * Simulate sending email (replace with actual email service)
   */
  private async sendEmail(notification: EmailNotification): Promise<void> {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulate 95% success rate
      const success = Math.random() > 0.05;
      
      if (success) {
        notification.status = 'sent';
        notification.sentAt = new Date();
        console.log(`📧 Email sent to ${notification.recipient}: ${notification.subject}`);
      } else {
        notification.status = 'failed';
        notification.errorMessage = 'Email service temporarily unavailable';
        console.error(`❌ Failed to send email to ${notification.recipient}`);
      }
    } catch (error) {
      notification.status = 'failed';
      notification.errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error(`❌ Email sending error:`, error);
    }
  }

  /**
   * Get all notifications
   */
  getNotifications(): EmailNotification[] {
    return this.notifications;
  }

  /**
   * Get notifications by type
   */
  getNotificationsByType(type: EmailNotification['type']): EmailNotification[] {
    return this.notifications.filter(n => n.type === type);
  }

  /**
   * Get notifications by order ID
   */
  getNotificationsByOrder(orderId: string): EmailNotification[] {
    return this.notifications.filter(n => n.orderId === orderId);
  }
}

// Export singleton instance
export const emailNotificationService = new EmailNotificationService();
