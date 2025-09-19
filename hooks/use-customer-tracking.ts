/**
 * Customer Tracking Hook
 * Tracks customer interactions and behavior for analytics
 */

import { useEffect, useCallback } from 'react';
import { customerDataCapture } from '@/lib/customer-data';

interface TrackingData {
  sessionId?: string;
  ipAddress?: string;
  userAgent?: string;
  [key: string]: any;
}

export function useCustomerTracking() {
  // Generate session ID
  const sessionId = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  // Track page view
  const trackPageView = useCallback((page: string, additionalData: TrackingData = {}) => {
    if (typeof window === 'undefined') return;

    const data = {
      page,
      sessionId,
      ipAddress: additionalData.ipAddress,
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString(),
      ...additionalData
    };

    // For now, we'll store in localStorage (in production, send to API)
    const pageViews = JSON.parse(localStorage.getItem('customer_page_views') || '[]');
    pageViews.push(data);
    localStorage.setItem('customer_page_views', JSON.stringify(pageViews));

    console.log(`📊 Page view tracked: ${page}`);
  }, [sessionId]);

  // Track product view
  const trackProductView = useCallback((productId: string, productTitle: string, additionalData: TrackingData = {}) => {
    if (typeof window === 'undefined') return;

    const data = {
      productId,
      productTitle,
      sessionId,
      timestamp: new Date().toISOString(),
      ...additionalData
    };

    const productViews = JSON.parse(localStorage.getItem('customer_product_views') || '[]');
    productViews.push(data);
    localStorage.setItem('customer_product_views', JSON.stringify(productViews));

    console.log(`📊 Product view tracked: ${productTitle}`);
  }, [sessionId]);

  // Track cart add
  const trackCartAdd = useCallback((productId: string, productTitle: string, quantity: number, price: number, additionalData: TrackingData = {}) => {
    if (typeof window === 'undefined') return;

    const data = {
      productId,
      productTitle,
      quantity,
      price,
      total: quantity * price,
      sessionId,
      timestamp: new Date().toISOString(),
      ...additionalData
    };

    const cartAdds = JSON.parse(localStorage.getItem('customer_cart_adds') || '[]');
    cartAdds.push(data);
    localStorage.setItem('customer_cart_adds', JSON.stringify(cartAdds));

    console.log(`📊 Cart add tracked: ${productTitle} (${quantity}x)`);
  }, [sessionId]);

  // Track cart abandon
  const trackCartAbandon = useCallback((cartItems: any[], additionalData: TrackingData = {}) => {
    if (typeof window === 'undefined') return;

    const data = {
      cartItems,
      itemCount: cartItems.length,
      totalValue: cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
      sessionId,
      timestamp: new Date().toISOString(),
      ...additionalData
    };

    const cartAbandons = JSON.parse(localStorage.getItem('customer_cart_abandons') || '[]');
    cartAbandons.push(data);
    localStorage.setItem('customer_cart_abandons', JSON.stringify(cartAbandons));

    console.log(`📊 Cart abandon tracked: ${cartItems.length} items`);
  }, [sessionId]);

  // Track purchase
  const trackPurchase = useCallback((orderId: string, total: number, items: any[], additionalData: TrackingData = {}) => {
    if (typeof window === 'undefined') return;

    const data = {
      orderId,
      total,
      items,
      itemCount: items.length,
      sessionId,
      timestamp: new Date().toISOString(),
      ...additionalData
    };

    const purchases = JSON.parse(localStorage.getItem('customer_purchases') || '[]');
    purchases.push(data);
    localStorage.setItem('customer_purchases', JSON.stringify(purchases));

    console.log(`📊 Purchase tracked: Order ${orderId} - $${total}`);
  }, [sessionId]);

  // Track newsletter signup
  const trackNewsletterSignup = useCallback((email: string, source: string = 'website', additionalData: TrackingData = {}) => {
    if (typeof window === 'undefined') return;

    const data = {
      email,
      source,
      sessionId,
      timestamp: new Date().toISOString(),
      ...additionalData
    };

    const signups = JSON.parse(localStorage.getItem('customer_newsletter_signups') || '[]');
    signups.push(data);
    localStorage.setItem('customer_newsletter_signups', JSON.stringify(signups));

    console.log(`📊 Newsletter signup tracked: ${email}`);
  }, [sessionId]);

  // Track contact form submission
  const trackContactForm = useCallback((formData: any, additionalData: TrackingData = {}) => {
    if (typeof window === 'undefined') return;

    const data = {
      formData,
      sessionId,
      timestamp: new Date().toISOString(),
      ...additionalData
    };

    const contactForms = JSON.parse(localStorage.getItem('customer_contact_forms') || '[]');
    contactForms.push(data);
    localStorage.setItem('customer_contact_forms', JSON.stringify(contactForms));

    console.log(`📊 Contact form tracked: ${formData.subject || 'General inquiry'}`);
  }, [sessionId]);

  // Track email open (for email campaigns)
  const trackEmailOpen = useCallback((campaignId: string, email: string, additionalData: TrackingData = {}) => {
    if (typeof window === 'undefined') return;

    const data = {
      campaignId,
      email,
      sessionId,
      timestamp: new Date().toISOString(),
      ...additionalData
    };

    const emailOpens = JSON.parse(localStorage.getItem('customer_email_opens') || '[]');
    emailOpens.push(data);
    localStorage.setItem('customer_email_opens', JSON.stringify(emailOpens));

    console.log(`📊 Email open tracked: Campaign ${campaignId}`);
  }, [sessionId]);

  // Track email click (for email campaigns)
  const trackEmailClick = useCallback((campaignId: string, email: string, linkUrl: string, additionalData: TrackingData = {}) => {
    if (typeof window === 'undefined') return;

    const data = {
      campaignId,
      email,
      linkUrl,
      sessionId,
      timestamp: new Date().toISOString(),
      ...additionalData
    };

    const emailClicks = JSON.parse(localStorage.getItem('customer_email_clicks') || '[]');
    emailClicks.push(data);
    localStorage.setItem('customer_email_clicks', JSON.stringify(emailClicks));

    console.log(`📊 Email click tracked: Campaign ${campaignId} - ${linkUrl}`);
  }, [sessionId]);

  // Get customer ID from localStorage or generate one
  const getCustomerId = useCallback(() => {
    if (typeof window === 'undefined') return null;

    let customerId = localStorage.getItem('customer_id');
    if (!customerId) {
      customerId = `customer-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('customer_id', customerId);
    }
    return customerId;
  }, []);

  // Track time on site
  const trackTimeOnSite = useCallback(() => {
    if (typeof window === 'undefined') return;

    const startTime = Date.now();
    
    const updateTimeOnSite = () => {
      const timeSpent = Date.now() - startTime;
      localStorage.setItem('customer_time_on_site', timeSpent.toString());
    };

    // Update time on site every 30 seconds
    const interval = setInterval(updateTimeOnSite, 30000);

    // Update on page unload
    const handleBeforeUnload = () => {
      updateTimeOnSite();
      clearInterval(interval);
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      clearInterval(interval);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  // Initialize tracking
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Track initial page view
    trackPageView(window.location.pathname);

    // Start time tracking
    const cleanup = trackTimeOnSite();

    return cleanup;
  }, [trackPageView, trackTimeOnSite]);

  return {
    sessionId,
    trackPageView,
    trackProductView,
    trackCartAdd,
    trackCartAbandon,
    trackPurchase,
    trackNewsletterSignup,
    trackContactForm,
    trackEmailOpen,
    trackEmailClick,
    getCustomerId
  };
}
