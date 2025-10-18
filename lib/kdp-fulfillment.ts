/**
 * KDP Fulfillment System
 * Handles KDP (Kindle Direct Publishing) fulfillment for books
 * Implements Option 1: Direct KDP Links
 */

import { Product } from '@/data/products';

export interface KDPFulfillmentOptions {
  product: Product;
  customerEmail: string;
  customerName: string;
}

export interface KDPRedirectResult {
  success: boolean;
  redirectUrl?: string;
  downloadUrl?: string;
  error?: string;
}

/**
 * Generate KDP redirect URL for paperback books
 */
export function generateKDPRedirectUrl(product: Product): string {
  if (!product.kdpASIN) {
    throw new Error(`No KDP ASIN found for product ${product.id}`);
  }

  // Generate Amazon purchase URL
  const amazonUrl = `https://amazon.com/dp/${product.kdpASIN}`;
  
  // Add tracking parameters for DS LLC
  const trackingParams = new URLSearchParams({
    utm_source: 'dsllc',
    utm_medium: 'shopify',
    utm_campaign: 'book_redirect',
    ref: 'dsllc_redirect'
  });

  return `${amazonUrl}?${trackingParams.toString()}`;
}

/**
 * Generate KDP download URL for e-books
 */
export function generateKDPDownloadUrl(product: Product): string {
  if (!product.kdpASIN) {
    throw new Error(`No KDP ASIN found for product ${product.id}`);
  }

  // For e-books, redirect to Amazon Kindle page
  const kindleUrl = `https://amazon.com/dp/${product.kdpASIN}`;
  
  // Add tracking parameters
  const trackingParams = new URLSearchParams({
    utm_source: 'dsllc',
    utm_medium: 'shopify',
    utm_campaign: 'ebook_redirect',
    ref: 'dsllc_ebook'
  });

  return `${kindleUrl}?${trackingParams.toString()}`;
}

/**
 * Process KDP fulfillment based on product type
 */
export function processKDPFulfillment(options: KDPFulfillmentOptions): KDPRedirectResult {
  const { product } = options;

  try {
    if (product.kdpType === 'ebook') {
      // E-books: Redirect to Amazon Kindle page
      const downloadUrl = generateKDPDownloadUrl(product);
      return {
        success: true,
        downloadUrl,
        redirectUrl: downloadUrl
      };
    } else if (product.kdpType === 'paperback') {
      // Paperbacks: Redirect to Amazon purchase page
      const redirectUrl = generateKDPRedirectUrl(product);
      return {
        success: true,
        redirectUrl
      };
    } else {
      return {
        success: false,
        error: `Unknown KDP type: ${product.kdpType}`
      };
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Check if a product uses KDP fulfillment
 */
export function isKDPProduct(product: Product): boolean {
  return product.fulfillmentProvider === 'kdp' && !!product.kdpASIN;
}

/**
 * Get KDP product info for display
 */
export function getKDPProductInfo(product: Product) {
  if (!isKDPProduct(product)) {
    return null;
  }

  return {
    asin: product.kdpASIN,
    type: product.kdpType,
    amazonUrl: product.kdpType === 'ebook' 
      ? generateKDPDownloadUrl(product)
      : generateKDPRedirectUrl(product),
    fulfillmentNote: product.kdpType === 'ebook' 
      ? 'Download from Amazon Kindle'
      : 'Purchase from Amazon (Prime eligible)'
  };
}
