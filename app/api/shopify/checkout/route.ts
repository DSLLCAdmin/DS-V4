import { NextRequest, NextResponse } from 'next/server';

// Shopify configuration - these should be moved to environment variables
const SHOPIFY_STORE_DOMAIN = 'wenugu-5b.myshopify.com';
const SHOPIFY_ADMIN_API_TOKEN = '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';
const SHOPIFY_API_VERSION = '2024-04';

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

    // Create Shopify checkout session
    const checkoutData = {
      checkout: {
        line_items: items.map(item => {
          // For testing, we'll use a placeholder variant ID
          // In production, each product should have a shopifyVariantId
          const variantId = item.shopifyVariantId || 1; // Fallback to first variant
          return {
            variant_id: variantId,
            quantity: item.quantity
          };
        }),
        email: customer.email,
        shipping_address: {
          first_name: customer.firstName,
          last_name: customer.lastName,
          address1: customer.address1 || '',
          address2: customer.address2 || '',
          city: customer.city || '',
          province: customer.state || '',
          zip: customer.zipCode || '',
          country: customer.country || 'US',
          phone: customer.phone || ''
        },
        billing_address: {
          first_name: customer.firstName,
          last_name: customer.lastName,
          address1: customer.address1 || '',
          address2: customer.address2 || '',
          city: customer.city || '',
          province: customer.state || '',
          zip: customer.zipCode || '',
          country: customer.country || 'US',
          phone: customer.phone || ''
        }
      }
    };

    const response = await fetch(`https://${SHOPIFY_STORE_DOMAIN}/admin/api/${SHOPIFY_API_VERSION}/checkouts.json`, {
      method: 'POST',
      headers: {
        'X-Shopify-Access-Token': SHOPIFY_ADMIN_API_TOKEN,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(checkoutData)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Shopify API error:', response.status, errorText);
      
      return NextResponse.json(
        { 
          success: false, 
          error: `Shopify checkout failed: ${response.status}`,
          fallback: true // Signal to use Stripe fallback
        },
        { status: response.status }
      );
    }

    const result = await response.json();
    const checkout = result.checkout;

    return NextResponse.json({
      success: true,
      checkoutUrl: checkout.web_url,
      checkoutId: checkout.id,
      token: checkout.token
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
