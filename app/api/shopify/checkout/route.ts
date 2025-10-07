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

    // Use Storefront API for checkout (customer-facing)
    const checkoutData = {
      checkoutCreateInput: {
        lineItems: items.map(item => ({
          variantId: `gid://shopify/ProductVariant/${item.shopifyVariantId || 1}`,
          quantity: item.quantity
        })),
        email: customer.email,
        shippingAddress: {
          firstName: customer.firstName,
          lastName: customer.lastName,
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

    // GraphQL query for Storefront API
    const graphqlQuery = `
      mutation checkoutCreate($input: CheckoutCreateInput!) {
        checkoutCreate(input: $input) {
          checkout {
            id
            webUrl
            totalPrice {
              amount
              currencyCode
            }
          }
          checkoutUserErrors {
            field
            message
          }
        }
      }
    `;

    const response = await fetch(`https://${SHOPIFY_STORE_DOMAIN}/api/${SHOPIFY_API_VERSION}/graphql.json`, {
      method: 'POST',
      headers: {
        'X-Shopify-Storefront-Access-Token': SHOPIFY_ADMIN_API_TOKEN, // Using Admin token as fallback
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        query: graphqlQuery,
        variables: { input: checkoutData.checkoutCreateInput }
      })
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
    
    // Handle GraphQL response
    if (result.errors) {
      console.error('GraphQL errors:', result.errors);
      return NextResponse.json(
        { 
          success: false, 
          error: `GraphQL error: ${result.errors[0].message}`,
          fallback: true
        },
        { status: 400 }
      );
    }

    const checkout = result.data?.checkoutCreate?.checkout;
    const errors = result.data?.checkoutCreate?.checkoutUserErrors;

    if (errors && errors.length > 0) {
      console.error('Checkout user errors:', errors);
      return NextResponse.json(
        { 
          success: false, 
          error: `Checkout error: ${errors[0].message}`,
          fallback: true
        },
        { status: 400 }
      );
    }

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
      checkoutUrl: checkout.webUrl,
      checkoutId: checkout.id,
      totalPrice: checkout.totalPrice
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
