'use client';

import React, { useState, useEffect } from 'react';
import { AdminLayout, AdminTabInfo } from '@/components/AdminLayout';
import { ShopifyIntegrationDashboard } from '@/components/ShopifyIntegrationDashboard';

export default function ShopifyAdminPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  if (isLoading) {
    return (
      <AdminLayout currentPage="shopify">
        <AdminTabInfo tabId="shopify" />
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Shopify Integration...</p>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout currentPage="shopify">
        <AdminTabInfo tabId="shopify" />
        <div className="text-center">
          <div className="text-red-600 text-xl mb-4">⚠️ Error</div>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout currentPage="shopify">
      <AdminTabInfo tabId="shopify" />
      
      <ShopifyIntegrationDashboard onRefresh={handleRefresh} />
      
      {/* Additional Information */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">Getting Started with Shopify</h3>
        <div className="text-blue-800 space-y-2">
          <p>1. <strong>Create Shopify Store:</strong> Sign up at shopify.com and create your store</p>
          <p>2. <strong>Generate API Credentials:</strong> Create a private app in your Shopify admin</p>
          <p>3. <strong>Configure Integration:</strong> Enter your store domain and access token above</p>
          <p>4. <strong>Test Connection:</strong> Verify the connection is working</p>
          <p>5. <strong>Sync Products:</strong> Upload your DS products to Shopify</p>
        </div>
      </div>
      
      {/* API Documentation */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">API Documentation</h3>
        <div className="text-gray-700 space-y-2">
          <p><strong>Store Domain:</strong> Your Shopify store URL (e.g., darkstreet-llc.myshopify.com)</p>
          <p><strong>Access Token:</strong> Private app access token from Shopify admin</p>
          <p><strong>Webhook Secret:</strong> Secret key for webhook verification</p>
          <p><strong>API Version:</strong> Shopify API version (currently 2024-01)</p>
        </div>
      </div>
    </AdminLayout>
  );
}
