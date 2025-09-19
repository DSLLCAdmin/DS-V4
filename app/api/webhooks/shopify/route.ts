/**
 * Shopify Webhook Handler
 * Receives order notifications from Shopify and processes them through Order Management Dashboard
 */

import { NextRequest, NextResponse } from 'next/server';
import { orderDashboard } from '@/lib/order-management';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const webhookTopic = request.headers.get('x-shopify-topic');
    
    console.log(`📨 Shopify webhook received: ${webhookTopic}`);

    // Verify webhook signature (in production, verify HMAC signature)
    const shopifyShop = request.headers.get('x-shopify-shop-domain');
    if (!shopifyShop) {
      console.error('❌ Missing shop domain in webhook headers');
      return NextResponse.json({ error: 'Missing shop domain' }, { status: 400 });
    }

    // Handle different webhook topics
    switch (webhookTopic) {
      case 'orders/create':
        await handleOrderCreate(body);
        break;
      
      case 'orders/updated':
        await handleOrderUpdate(body);
        break;
      
      case 'orders/paid':
        await handleOrderPaid(body);
        break;
      
      case 'orders/cancelled':
        await handleOrderCancelled(body);
        break;
      
      case 'orders/fulfilled':
        await handleOrderFulfilled(body);
        break;
      
      default:
        console.log(`ℹ️ Unhandled webhook topic: ${webhookTopic}`);
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('❌ Error processing Shopify webhook:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}

/**
 * Handle new order creation
 */
async function handleOrderCreate(orderData: any) {
  try {
    console.log(`🛒 New order created: ${orderData.id}`);
    
    // Create order in our dashboard
    const order = await orderDashboard.createOrder(orderData);
    
    // Log order details
    console.log(`📦 Order ${order.id} created for ${order.customerEmail}`);
    console.log(`💰 Total: $${order.totalAmount}`);
    console.log(`📋 Items: ${order.items.length}`);
    
    // TODO: Trigger order processing
    // For now, we'll process orders in batches
    
  } catch (error) {
    console.error(`❌ Error creating order ${orderData.id}:`, error);
    throw error;
  }
}

/**
 * Handle order updates
 */
async function handleOrderUpdate(orderData: any) {
  try {
    console.log(`📝 Order updated: ${orderData.id}`);
    
    // Update order in our dashboard
    const existingOrder = orderDashboard.getOrder(orderData.id.toString());
    if (existingOrder) {
      // Update order details
      await orderDashboard.updateOrderStatus(
        orderData.id.toString(),
        mapShopifyStatusToOrderStatus(orderData.fulfillment_status),
        {
          totalAmount: parseFloat(orderData.total_price),
          shippingCost: parseFloat(orderData.shipping_lines?.[0]?.price || '0'),
          tax: parseFloat(orderData.total_tax || '0'),
          updatedAt: new Date()
        }
      );
    }
    
  } catch (error) {
    console.error(`❌ Error updating order ${orderData.id}:`, error);
    throw error;
  }
}

/**
 * Handle order payment
 */
async function handleOrderPaid(orderData: any) {
  try {
    console.log(`💳 Order paid: ${orderData.id}`);
    
    // Update order status to processing
    await orderDashboard.updateOrderStatus(
      orderData.id.toString(),
      'processing'
    );
    
    // TODO: Trigger Amazon FBA order creation
    
  } catch (error) {
    console.error(`❌ Error processing payment for order ${orderData.id}:`, error);
    throw error;
  }
}

/**
 * Handle order cancellation
 */
async function handleOrderCancelled(orderData: any) {
  try {
    console.log(`❌ Order cancelled: ${orderData.id}`);
    
    await orderDashboard.cancelOrder(
      orderData.id.toString(),
      orderData.cancel_reason || 'Customer requested cancellation'
    );
    
  } catch (error) {
    console.error(`❌ Error cancelling order ${orderData.id}:`, error);
    throw error;
  }
}

/**
 * Handle order fulfillment
 */
async function handleOrderFulfilled(orderData: any) {
  try {
    console.log(`📦 Order fulfilled: ${orderData.id}`);
    
    // Update order status to shipped
    await orderDashboard.updateOrderStatus(
      orderData.id.toString(),
      'shipped',
      {
        trackingNumber: orderData.fulfillments?.[0]?.tracking_number,
        updatedAt: new Date()
      }
    );
    
  } catch (error) {
    console.error(`❌ Error processing fulfillment for order ${orderData.id}:`, error);
    throw error;
  }
}

/**
 * Map Shopify fulfillment status to our order status
 */
function mapShopifyStatusToOrderStatus(shopifyStatus: string | null): 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'error' | 'retry' | 'refunded' {
  switch (shopifyStatus) {
    case 'fulfilled':
      return 'shipped';
    case 'partial':
      return 'processing';
    case 'restocked':
      return 'cancelled';
    case null:
    case undefined:
      return 'pending';
    default:
      return 'processing';
  }
}

/**
 * GET endpoint for webhook verification (Shopify requires this)
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const challenge = searchParams.get('challenge');
  
  if (challenge) {
    console.log(`🔐 Shopify webhook verification challenge: ${challenge}`);
    return new NextResponse(challenge);
  }
  
  return NextResponse.json({ message: 'Shopify webhook endpoint ready' });
}
