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
  console.log('=== SHOPIFY CHECKOUT API ROUTE STARTED ===');
  console.log('Request method:', request.method);
  console.log('Request URL:', request.url);
  console.log('Request headers:', Object.fromEntries(request.headers.entries()));
  
  try {
    const body = await request.json();
    console.log('Request body received:', JSON.stringify(body, null, 2));
    
    const { items, customer }: { items: CartItem[]; customer: CustomerData } = body;

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
      console.error('=== SHOPIFY API ERROR ===');
      console.error('Response status:', response.status);
      console.error('Response headers:', Object.fromEntries(response.headers.entries()));
      console.error('Error text:', errorText);
      console.error('GraphQL query:', graphqlQuery);
      console.error('Request headers sent:', {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': SHOPIFY_STOREFRONT_API_TOKEN
      });
      
      return NextResponse.json(
        { 
          success: false, 
          error: `Shopify API error: ${response.status}`,
          details: errorText,
          status: response.status,
          fallback: true
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

    // Create cart with line items (Storefront API uses cartCreate, not checkoutCreate)
    const cartMutation = `
      mutation cartCreate($input: CartInput!) {
        cartCreate(input: $input) {
          cart {
            id
            checkoutUrl
            totalQuantity
            cost {
              totalAmount {
                amount
                currencyCode
              }
            }
            lines(first: 10) {
              edges {
                node {
                  id
                  quantity
                  merchandise {
                    ... on ProductVariant {
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
          userErrors {
            field
            message
          }
        }
      }
    `;

    // Map cart items to Shopify line items with correct variant IDs
    const lineItems = items.map(item => {
      // Find the correct variant ID from the products we queried
      const product = productsResult.data.products.edges.find(edge => 
        edge.node.title.includes(item.title.split('-')[0].trim())
      );
      
      if (product && product.node.variants.edges.length > 0) {
        return {
          merchandiseId: product.node.variants.edges[0].node.id,
          quantity: item.quantity
        };
      }
      
      // Fallback to first available variant
      return {
        merchandiseId: 'gid://shopify/ProductVariant/42143320834146', // First & Light Paperback variant
        quantity: item.quantity
      };
    });

    const cartInput = {
      lines: lineItems
    };

    console.log('Cart input:', JSON.stringify(cartInput, null, 2));

    const cartResponse = await fetch(`https://${SHOPIFY_STORE_DOMAIN}/api/${SHOPIFY_API_VERSION}/graphql.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': SHOPIFY_STOREFRONT_API_TOKEN
      },
      body: JSON.stringify({
        query: cartMutation,
        variables: { input: cartInput }
      })
    });

    if (!cartResponse.ok) {
      const errorText = await cartResponse.text();
      console.error('=== SHOPIFY CART API ERROR ===');
      console.error('Response status:', cartResponse.status);
      console.error('Response headers:', Object.fromEntries(cartResponse.headers.entries()));
      console.error('Error text:', errorText);
      console.error('GraphQL query:', cartMutation);
      console.error('Request headers sent:', {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': SHOPIFY_STOREFRONT_API_TOKEN
      });
      
      return NextResponse.json(
        { 
          success: false, 
          error: `Shopify cart creation failed: ${cartResponse.status}`,
          details: errorText,
          status: cartResponse.status,
          fallback: true
        },
        { status: cartResponse.status }
      );
    }

    const cartResult = await cartResponse.json();
    console.log('Shopify cart result:', JSON.stringify(cartResult, null, 2));
    
    // Log specific details for debugging
    console.log('Cart response status:', cartResponse.status);
    console.log('Cart response headers:', Object.fromEntries(cartResponse.headers.entries()));

    // Handle cart creation response
    if (cartResult.errors) {
      console.error('GraphQL cart errors:', cartResult.errors);
      return NextResponse.json(
        { 
          success: false, 
          error: `Cart creation failed: ${cartResult.errors[0].message}`,
          details: cartResult.errors,
          fallback: true
        },
        { status: 400 }
      );
    }

    const cart = cartResult.data?.cartCreate?.cart;
    const userErrors = cartResult.data?.cartCreate?.userErrors;

    if (userErrors && userErrors.length > 0) {
      console.error('Cart user errors:', userErrors);
      return NextResponse.json(
        { 
          success: false, 
          error: `Cart validation failed: ${userErrors[0].message}`,
          details: userErrors,
          fallback: true
        },
        { status: 400 }
      );
    }

    if (!cart || !cart.checkoutUrl) {
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
      checkoutUrl: cart.checkoutUrl,
      cartId: cart.id,
      totalAmount: cart.cost.totalAmount,
      message: 'Shopify cart created successfully!'
    });

  } catch (error) {
    console.error('=== SHOPIFY CHECKOUT API ROUTE ERROR ===');
    console.error('Error type:', typeof error);
    console.error('Error message:', error instanceof Error ? error.message : String(error));
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    console.error('Full error object:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Checkout processing failed',
        details: error instanceof Error ? error.message : String(error),
        fallback: true // Signal to use Stripe fallback
      },
      { status: 500 }
    );
  }
}
