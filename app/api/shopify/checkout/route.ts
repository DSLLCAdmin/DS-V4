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

    // If we get here, the API is working! Now create a real checkout
    console.log('Creating Shopify checkout with items:', items);
    
    // First, let's query available products to see what variants exist
    const productsQuery = `
      query {
        products(first: 10) {
          edges {
            node {
              id
              title
              variants(first: 10) {
                edges {
                  node {
                    id
                    title
                    price {
                      amount
                      currencyCode
                    }
                  }
                }
              }
            }
          }
        }
      }
    `;
    
    console.log('Querying available products and variants...');
    
    const productsResponse = await fetch(`https://${SHOPIFY_STORE_DOMAIN}/api/${SHOPIFY_API_VERSION}/graphql.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': SHOPIFY_STOREFRONT_API_TOKEN
      },
      body: JSON.stringify({
        query: productsQuery
      })
    });
    
    if (productsResponse.ok) {
      const productsResult = await productsResponse.json();
      console.log('Available products and variants:', JSON.stringify(productsResult, null, 2));
    } else {
      console.log('Failed to query products:', productsResponse.status);
    }

    // Create checkout with line items
    const checkoutMutation = `
      mutation checkoutCreate($input: CheckoutCreateInput!) {
        checkoutCreate(input: $input) {
          checkout {
            id
            webUrl
            totalPrice {
              amount
              currencyCode
            }
            lineItems(first: 10) {
              edges {
                node {
                  id
                  title
                  quantity
                  variant {
                    id
                    title
                    price {
                      amount
                      currencyCode
                    }
                  }
                }
              }
            }
          }
          checkoutUserErrors {
            field
            message
          }
        }
      }
    `;

    // Map cart items to Shopify line items
    const lineItems = items.map(item => ({
      variantId: item.shopifyVariantId ? `gid://shopify/ProductVariant/${item.shopifyVariantId}` : 'gid://shopify/ProductVariant/1', // Fallback to variant 1
      quantity: item.quantity
    }));

    const checkoutInput = {
      email: customer.email,
      lineItems: lineItems
    };

    console.log('Checkout input:', JSON.stringify(checkoutInput, null, 2));

    const checkoutResponse = await fetch(`https://${SHOPIFY_STORE_DOMAIN}/api/${SHOPIFY_API_VERSION}/graphql.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': SHOPIFY_STOREFRONT_API_TOKEN
      },
      body: JSON.stringify({
        query: checkoutMutation,
        variables: { input: checkoutInput }
      })
    });

    if (!checkoutResponse.ok) {
      const errorText = await checkoutResponse.text();
      console.error('Shopify checkout creation error:', checkoutResponse.status, errorText);
      
      return NextResponse.json(
        { 
          success: false, 
          error: `Checkout creation failed: ${checkoutResponse.status}`,
          details: errorText,
          fallback: true
        },
        { status: checkoutResponse.status }
      );
    }

    const checkoutResult = await checkoutResponse.json();
    console.log('Shopify checkout result:', JSON.stringify(checkoutResult, null, 2));
    
    // Log specific details for debugging
    console.log('Checkout response status:', checkoutResponse.status);
    console.log('Checkout response headers:', Object.fromEntries(checkoutResponse.headers.entries()));

    // Handle checkout creation response
    if (checkoutResult.errors) {
      console.error('GraphQL checkout errors:', checkoutResult.errors);
      return NextResponse.json(
        { 
          success: false, 
          error: `Checkout creation failed: ${checkoutResult.errors[0].message}`,
          details: checkoutResult.errors,
          fallback: true
        },
        { status: 400 }
      );
    }

    const checkout = checkoutResult.data?.checkoutCreate?.checkout;
    const userErrors = checkoutResult.data?.checkoutCreate?.checkoutUserErrors;

    if (userErrors && userErrors.length > 0) {
      console.error('Checkout user errors:', userErrors);
      return NextResponse.json(
        { 
          success: false, 
          error: `Checkout validation failed: ${userErrors[0].message}`,
          details: userErrors,
          fallback: true
        },
        { status: 400 }
      );
    }

    if (!checkout || !checkout.webUrl) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'No checkout URL returned from Shopify',
          fallback: true
        },
        { status: 400 }
      );
    }

    // Success! Return the checkout URL
    return NextResponse.json({
      success: true,
      checkoutUrl: checkout.webUrl,
      checkoutId: checkout.id,
      totalPrice: checkout.totalPrice,
      message: 'Shopify checkout created successfully!'
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
