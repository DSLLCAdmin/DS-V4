import { NextRequest, NextResponse } from 'next/server';
import { processKDPFulfillment, isKDPProduct } from '@/lib/kdp-fulfillment';
import { products } from '@/data/products';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { productId, customerEmail, customerName } = body;

    // Find the product
    const product = products.find(p => p.id === productId);
    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Check if it's a KDP product
    if (!isKDPProduct(product)) {
      return NextResponse.json(
        { error: 'Product is not configured for KDP fulfillment' },
        { status: 400 }
      );
    }

    // Process KDP fulfillment
    const result = processKDPFulfillment({
      product,
      customerEmail,
      customerName
    });

    if (result.success) {
      return NextResponse.json({
        success: true,
        redirectUrl: result.redirectUrl,
        downloadUrl: result.downloadUrl,
        product: {
          id: product.id,
          title: product.title,
          kdpType: product.kdpType,
          kdpASIN: product.kdpASIN
        }
      });
    } else {
      return NextResponse.json(
        { error: result.error || 'Failed to process KDP fulfillment' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('KDP fulfillment error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');

    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }

    // Find the product
    const product = products.find(p => p.id === productId);
    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Check if it's a KDP product
    if (!isKDPProduct(product)) {
      return NextResponse.json(
        { error: 'Product is not configured for KDP fulfillment' },
        { status: 400 }
      );
    }

    // Return KDP product info
    return NextResponse.json({
      success: true,
      product: {
        id: product.id,
        title: product.title,
        kdpType: product.kdpType,
        kdpASIN: product.kdpASIN,
        fulfillmentProvider: product.fulfillmentProvider
      }
    });
  } catch (error) {
    console.error('KDP product info error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
