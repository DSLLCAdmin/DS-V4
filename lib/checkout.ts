/**
 * Checkout System
 * Handles order creation, processing, and management
 */

export interface CustomerInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
}

export interface ShippingAddress {
  firstName: string;
  lastName: string;
  company?: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface BillingAddress {
  firstName: string;
  lastName: string;
  company?: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  sameAsShipping: boolean;
}

export interface PaymentInfo {
  method: 'credit_card' | 'paypal' | 'apple_pay' | 'google_pay';
  cardNumber?: string;
  expiryMonth?: string;
  expiryYear?: string;
  cvv?: string;
  cardholderName?: string;
}

export interface OrderItem {
  id: string;
  title: string;
  author?: string;
  price: number;
  quantity: number;
  image?: string;
  category: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customer: CustomerInfo;
  shippingAddress: ShippingAddress;
  billingAddress: BillingAddress;
  paymentInfo: PaymentInfo;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
  notes?: string;
}

export interface CheckoutData {
  customer: CustomerInfo;
  shippingAddress: ShippingAddress;
  billingAddress: BillingAddress;
  paymentInfo: PaymentInfo;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
}

// Generate unique order ID
function generateOrderId(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substr(2, 5);
  return `DS-${timestamp}-${random}`.toUpperCase();
}

// Generate order number
function generateOrderNumber(): string {
  const now = new Date();
  const year = now.getFullYear().toString().slice(-2);
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  const day = now.getDate().toString().padStart(2, '0');
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `${year}${month}${day}-${random}`;
}

// Calculate shipping cost
function calculateShipping(items: OrderItem[]): number {
  // Free shipping for orders over $50
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  if (subtotal >= 50) {
    return 0;
  }
  
  // $5.99 flat rate shipping
  return 5.99;
}

// Calculate tax (simplified - 8.5% for CA)
function calculateTax(subtotal: number, shipping: number): number {
  return Math.round((subtotal + shipping) * 0.085 * 100) / 100;
}

// Validate checkout data
export function validateCheckoutData(data: CheckoutData): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Customer validation
  if (!data.customer.firstName.trim()) errors.push('First name is required');
  if (!data.customer.lastName.trim()) errors.push('Last name is required');
  if (!data.customer.email.trim()) errors.push('Email is required');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.customer.email)) errors.push('Valid email is required');

  // Shipping address validation
  if (!data.shippingAddress.firstName.trim()) errors.push('Shipping first name is required');
  if (!data.shippingAddress.lastName.trim()) errors.push('Shipping last name is required');
  if (!data.shippingAddress.address1.trim()) errors.push('Shipping address is required');
  if (!data.shippingAddress.city.trim()) errors.push('Shipping city is required');
  if (!data.shippingAddress.state.trim()) errors.push('Shipping state is required');
  if (!data.shippingAddress.zipCode.trim()) errors.push('Shipping ZIP code is required');
  if (!data.shippingAddress.country.trim()) errors.push('Shipping country is required');

  // Billing address validation (if not same as shipping)
  if (!data.billingAddress.sameAsShipping) {
    if (!data.billingAddress.firstName.trim()) errors.push('Billing first name is required');
    if (!data.billingAddress.lastName.trim()) errors.push('Billing last name is required');
    if (!data.billingAddress.address1.trim()) errors.push('Billing address is required');
    if (!data.billingAddress.city.trim()) errors.push('Billing city is required');
    if (!data.billingAddress.state.trim()) errors.push('Billing state is required');
    if (!data.billingAddress.zipCode.trim()) errors.push('Billing ZIP code is required');
    if (!data.billingAddress.country.trim()) errors.push('Billing country is required');
  }

  // Payment validation
  if (!data.paymentInfo.method) errors.push('Payment method is required');
  
  if (data.paymentInfo.method === 'credit_card') {
    if (!data.paymentInfo.cardNumber?.trim()) errors.push('Card number is required');
    if (!data.paymentInfo.expiryMonth?.trim()) errors.push('Expiry month is required');
    if (!data.paymentInfo.expiryYear?.trim()) errors.push('Expiry year is required');
    if (!data.paymentInfo.cvv?.trim()) errors.push('CVV is required');
    if (!data.paymentInfo.cardholderName?.trim()) errors.push('Cardholder name is required');
  }

  // Items validation
  if (!data.items || data.items.length === 0) errors.push('At least one item is required');

  return {
    isValid: errors.length === 0,
    errors
  };
}

// Create order from checkout data
export function createOrder(checkoutData: CheckoutData): Order {
  const orderId = generateOrderId();
  const orderNumber = generateOrderNumber();
  const now = new Date();

  return {
    id: orderId,
    orderNumber,
    customer: checkoutData.customer,
    shippingAddress: checkoutData.shippingAddress,
    billingAddress: checkoutData.billingAddress.sameAsShipping 
      ? { ...checkoutData.shippingAddress, sameAsShipping: true }
      : checkoutData.billingAddress,
    paymentInfo: checkoutData.paymentInfo,
    items: checkoutData.items,
    subtotal: checkoutData.subtotal,
    shipping: checkoutData.shipping,
    tax: checkoutData.tax,
    total: checkoutData.total,
    status: 'pending',
    createdAt: now,
    updatedAt: now
  };
}

// Process checkout (simulate payment processing)
export async function processCheckout(checkoutData: CheckoutData): Promise<{ success: boolean; order?: Order; error?: string }> {
  try {
    // Validate checkout data
    const validation = validateCheckoutData(checkoutData);
    if (!validation.isValid) {
      return {
        success: false,
        error: `Validation failed: ${validation.errors.join(', ')}`
      };
    }

    // Simulate payment processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Simulate payment processing (90% success rate)
    const paymentSuccess = Math.random() > 0.1;
    if (!paymentSuccess) {
      return {
        success: false,
        error: 'Payment processing failed. Please try again or use a different payment method.'
      };
    }

    // Create order
    const order = createOrder(checkoutData);
    
    // Save order to localStorage (in a real app, this would go to a database)
    const existingOrders = JSON.parse(localStorage.getItem('ds-orders') || '[]');
    existingOrders.push(order);
    localStorage.setItem('ds-orders', JSON.stringify(existingOrders));

    // Clear cart
    localStorage.removeItem('ds-cart');

    return {
      success: true,
      order
    };

  } catch (error) {
    return {
      success: false,
      error: `Checkout processing failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
}

// Get order by ID
export function getOrder(orderId: string): Order | null {
  try {
    const orders = JSON.parse(localStorage.getItem('ds-orders') || '[]');
    return orders.find((order: Order) => order.id === orderId) || null;
  } catch (error) {
    console.error('Error retrieving order:', error);
    return null;
  }
}

// Get all orders
export function getAllOrders(): Order[] {
  try {
    return JSON.parse(localStorage.getItem('ds-orders') || '[]');
  } catch (error) {
    console.error('Error retrieving orders:', error);
    return [];
  }
}

// Update order status
export function updateOrderStatus(orderId: string, status: Order['status']): boolean {
  try {
    const orders = JSON.parse(localStorage.getItem('ds-orders') || '[]');
    const orderIndex = orders.findIndex((order: Order) => order.id === orderId);
    
    if (orderIndex === -1) return false;
    
    orders[orderIndex].status = status;
    orders[orderIndex].updatedAt = new Date();
    localStorage.setItem('ds-orders', JSON.stringify(orders));
    
    return true;
  } catch (error) {
    console.error('Error updating order status:', error);
    return false;
  }
}

// Calculate checkout totals
export function calculateCheckoutTotals(items: OrderItem[]): { subtotal: number; shipping: number; tax: number; total: number } {
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = calculateShipping(items);
  const tax = calculateTax(subtotal, shipping);
  const total = subtotal + shipping + tax;

  return {
    subtotal: Math.round(subtotal * 100) / 100,
    shipping: Math.round(shipping * 100) / 100,
    tax: Math.round(tax * 100) / 100,
    total: Math.round(total * 100) / 100
  };
}
