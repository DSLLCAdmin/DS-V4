import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

// Shopify webhook secret - using environment variables for security
const SHOPIFY_WEBHOOK_SECRET = process.env.SHOPIFY_WEBHOOK_SECRET || '';

// Verify Shopify webhook signature
function verifyShopifyWebhook(data: string, signature: string, secret: string): boolean {
  const hmac = crypto.createHmac('sha256', secret);
  hmac.update(data, 'utf8');
  const hash = hmac.digest('base64');
  
  return hash === signature;
}

// Handle order creation webhook
export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('x-shopify-hmac-sha256');
    
    if (!signature) {
      return NextResponse.json(
        { error: 'Missing webhook signature' },
        { status: 401 }
      );
    }

    // Verify webhook signature
    if (!verifyShopifyWebhook(body, signature, SHOPIFY_WEBHOOK_SECRET)) {
      return NextResponse.json(
        { error: 'Invalid webhook signature' },
        { status: 401 }
      );
    }

    const order = JSON.parse(body);

    // Process the order
    console.log('📦 Shopify Order Created:', {
      id: order.id,
      orderNumber: order.order_number,
      email: order.email,
      totalPrice: order.total_price,
      currency: order.currency,
      lineItems: order.line_items?.length || 0,
      customer: {
        id: order.customer?.id,
        email: order.customer?.email,
        firstName: order.customer?.first_name,
        lastName: order.customer?.last_name
      },
      shippingAddress: {
        firstName: order.shipping_address?.first_name,
        lastName: order.shipping_address?.last_name,
        address1: order.shipping_address?.address1,
        city: order.shipping_address?.city,
        province: order.shipping_address?.province,
        zip: order.shipping_address?.zip,
        country: order.shipping_address?.country
      }
    });

    // TODO: Sync order to DSLLC admin dashboard
    // This could involve:
    // 1. Creating order in local database
    // 2. Sending notification to admin
    // 3. Updating inventory
    // 4. Triggering fulfillment process

    // For now, just log the order
    console.log('✅ Order processed successfully');

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('❌ Webhook processing error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

// Handle order update webhook
export async function PUT(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('x-shopify-hmac-sha256');
    
    if (!signature) {
      return NextResponse.json(
        { error: 'Missing webhook signature' },
        { status: 401 }
      );
    }

    // Verify webhook signature
    if (!verifyShopifyWebhook(body, signature, SHOPIFY_WEBHOOK_SECRET)) {
      return NextResponse.json(
        { error: 'Invalid webhook signature' },
        { status: 401 }
      );
    }

    const order = JSON.parse(body);

    console.log('📦 Shopify Order Updated:', {
      id: order.id,
      orderNumber: order.order_number,
      fulfillmentStatus: order.fulfillment_status,
      financialStatus: order.financial_status
    });

    // TODO: Update order status in DSLLC admin dashboard
    // This could involve:
    // 1. Updating order status in local database
    // 2. Sending status update notifications
    // 3. Triggering fulfillment actions

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('❌ Webhook processing error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}
