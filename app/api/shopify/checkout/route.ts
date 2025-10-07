import { NextRequest, NextResponse } from 'next/server';

// Shopify configuration - these should be moved to environment variables
const SHOPIFY_STORE_DOMAIN = 'wenugu-5b.myshopify.com';
const SHOPIFY_STOREFRONT_API_TOKEN = '42ec4a86d00bfb85a44c99bd24a4f5f2';
const SHOPIFY_API_VERSION = '2024-10'; // Use stable version

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
    if (!SHOPIFY_STOREFRONT_API_TOKEN) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Shopify integration not configured. Please set up your Shopify store credentials.',
          fallback: true // Signal to use Stripe fallback
        },
        { status: 503 }
      );
    }

    // TEST: Try a simple query instead of mutation to test API connectivity
    // This will help us determine if the Storefront API token is working at all
    const graphqlQuery = `
      query {
        shop {
          name
          id
        }
      }
    `;

    console.log('Testing Storefront API connectivity with simple query');

    const response = await fetch(`https://${SHOPIFY_STORE_DOMAIN}/api/${SHOPIFY_API_VERSION}/graphql.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': SHOPIFY_STOREFRONT_API_TOKEN
      },
      body: JSON.stringify({
        query: graphqlQuery
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Shopify API error:', response.status, errorText);
      console.error('GraphQL query:', graphqlQuery);
      
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
    
    console.log('Shopify Storefront API response:', JSON.stringify(result, null, 2));
    
    // Handle GraphQL response
    if (result.errors) {
      console.error('GraphQL errors:', result.errors);
      return NextResponse.json(
        { 
          success: false, 
          error: `GraphQL error: ${result.errors[0].message}`,
          details: result.errors,
          fallback: true
        },
        { status: 400 }
      );
    }

    const shop = result.data?.shop;

    if (!shop) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'No shop data returned',
          fallback: true
        },
        { status: 400 }
      );
    }

    // If we get here, the API is working! Now let's try to create a real checkout
    // For now, return success but signal to use fallback until we implement full checkout
    return NextResponse.json({
      success: true,
      message: 'Storefront API is working! Ready for checkout implementation.',
      shop: shop,
      fallback: true // Use fallback until we implement full checkout creation
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
