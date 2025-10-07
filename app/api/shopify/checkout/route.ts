import { NextRequest, NextResponse } from 'next/server';

// Shopify configuration - these should be moved to environment variables
const SHOPIFY_STORE_DOMAIN = 'wenugu-5b.myshopify.com';
const SHOPIFY_ADMIN_API_TOKEN = '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';
const SHOPIFY_API_VERSION = '2024-10'; // Use stable version instead of 2025-10

interface CartItem {
  id: string;
  title: string;
  price: number;
  quantity: number;
  image?: string;
  shopifyVariantId?: number;
}

interface CustomerData {
  email: string;
  firstName: string;
  lastName: string;
  address1?: string;
  address2?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  phone?: string;
}

export async function POST(request: NextRequest) {
  try {
    const { items, customer }: { items: CartItem[]; customer: CustomerData } = await request.json();

    if (!items || items.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No items in cart' },
        { status: 400 }
      );
    }

    // Check if Shopify is properly configured
    if (!SHOPIFY_ADMIN_API_TOKEN) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Shopify integration not configured. Please set up your Shopify store credentials.',
          fallback: true // Signal to use Stripe fallback
        },
        { status: 503 }
      );
    }

    // Try Admin API REST approach instead of GraphQL
    // This is simpler and more reliable for basic checkout creation
    const checkoutData = {
      checkout: {
        line_items: items.map(item => ({
          variant_id: 1, // Use simple numeric ID instead of GraphQL GID
          quantity: item.quantity
        })),
        email: customer.email
      }
    };

    console.log('Creating checkout with Admin API REST:', JSON.stringify(checkoutData, null, 2));

    const response = await fetch(`https://${SHOPIFY_STORE_DOMAIN}/admin/api/${SHOPIFY_API_VERSION}/checkouts.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': SHOPIFY_ADMIN_API_TOKEN
      },
      body: JSON.stringify(checkoutData)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Shopify API error:', response.status, errorText);
      console.error('Request data:', JSON.stringify(checkoutData, null, 2));
      
      return NextResponse.json(
        { 
          success: false, 
          error: `Shopify checkout failed: ${response.status}`,
          details: errorText,
          fallback: true // Signal to use Stripe fallback
        },
        { status: response.status }
      );
    }

    const result = await response.json();
    
    console.log('Shopify Admin API response:', JSON.stringify(result, null, 2));
    
    // Handle Admin API REST response
    if (result.errors) {
      console.error('Admin API errors:', result.errors);
      return NextResponse.json(
        { 
          success: false, 
          error: `Admin API error: ${result.errors}`,
          fallback: true
        },
        { status: 400 }
      );
    }

    const checkout = result.checkout;

    if (!checkout) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'No checkout created',
          fallback: true
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      checkoutUrl: checkout.web_url,
      checkoutId: checkout.id,
      totalPrice: checkout.total_price
    });

  } catch (error) {
    console.error('Shopify checkout error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Checkout processing failed',
        fallback: true // Signal to use Stripe fallback
      },
      { status: 500 }
    );
  }
}
