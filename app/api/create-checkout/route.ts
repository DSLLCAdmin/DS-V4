import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { items, customer } = await request.json();

    // Validate input
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'Invalid cart items' },
        { status: 400 }
      );
    }

    if (!customer || !customer.email) {
      return NextResponse.json(
        { error: 'Customer information required' },
        { status: 400 }
      );
    }

    // Get Shopify credentials from environment
    const shopName = process.env.NEXT_PUBLIC_SHOPIFY_SHOP_NAME;
    const accessToken = process.env.NEXT_PUBLIC_SHOPIFY_ACCESS_TOKEN;

    if (!shopName || !accessToken) {
      console.error('Missing Shopify credentials');
      return NextResponse.json(
        { error: 'Shopify configuration error' },
        { status: 500 }
      );
    }

    // Create Shopify checkout session
    const shopifyUrl = `https://${shopName}`;
    
    try {
      // Create a checkout session via Shopify's API
      const response = await fetch(`${shopifyUrl}/admin/api/2024-01/checkouts.json`, {
        method: 'POST',
        headers: {
          'X-Shopify-Access-Token': accessToken,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          checkout: {
            line_items: items.map((item: any) => ({
              variant_id: item.id,
              quantity: item.quantity
            })),
            email: customer.email,
            shipping_address: {
              first_name: customer.firstName,
              last_name: customer.lastName,
              address1: customer.address1,
              address2: customer.address2,
              city: customer.city,
              province: customer.state,
              zip: customer.zipCode,
              country: customer.country,
              phone: customer.phone
            }
          }
        })
      });

      if (response.ok) {
        const checkoutData = await response.json();
        const checkoutUrl = checkoutData.checkout.web_url;
        
        return NextResponse.json({
          checkoutUrl,
          message: 'Checkout session created successfully'
        });
      } else {
        // Fallback to cart redirect if checkout creation fails
        console.warn('Checkout creation failed, falling back to cart redirect');
        const cartUrl = `${shopifyUrl}/cart`;
        const cartItems = items.map((item: any) => 
          `${item.id}:${item.quantity}`
        ).join(',');
        
        const finalCartUrl = `${cartUrl}?items=${encodeURIComponent(cartItems)}`;
        
        return NextResponse.json({
          checkoutUrl: finalCartUrl,
          message: 'Redirecting to cart (checkout creation failed)'
        });
      }
    } catch (apiError) {
      console.error('Shopify API error:', apiError);
      
      // Fallback to cart redirect
      const cartUrl = `${shopifyUrl}/cart`;
      const cartItems = items.map((item: any) => 
        `${item.id}:${item.quantity}`
      ).join(',');
      
      const finalCartUrl = `${cartUrl}?items=${encodeURIComponent(cartItems)}`;
      
      return NextResponse.json({
        checkoutUrl: finalCartUrl,
        message: 'Redirecting to cart (API error)'
      });
    }

  } catch (error) {
    console.error('Checkout creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
