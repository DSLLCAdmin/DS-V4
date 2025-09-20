'use client';

import React from 'react';
import { ProductImportDashboard } from '@/components/ProductImportDashboard';

export default function ProductImportPage() {
  const handleRefresh = () => {
    // Refresh logic can be added here if needed
    console.log('Refreshing product import data...');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Product Import Management</h1>
          <p className="text-gray-600">
            Import DarkStreet products to Shopify with proper categorization and pricing
          </p>
        </div>
        
        <ProductImportDashboard onRefresh={handleRefresh} />
        
        {/* Navigation to other admin pages */}
        <div className="mt-8 flex flex-wrap gap-4">
          <a
            href="/admin/shopify"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            ← Shopify Integration
          </a>
          <a
            href="/admin/products"
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Product Catalog →
          </a>
          <a
            href="/admin/orders"
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Order Management →
          </a>
        </div>
      </div>
    </div>
  );
}
