'use client';

import React, { useState, useEffect } from 'react';
import { ProductLookupDashboard } from '@/components/ProductLookupDashboard';
import { exportSettings } from '@/lib/export-settings';
import { ExportSettingsModal } from '@/components/ExportSettingsModal';

// Simple 4-character PIN security
const ADMIN_PIN = '2024'; // Change this to your preferred PIN

export default function ProductLookupAdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [showExportSettings, setShowExportSettings] = useState(false);

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === ADMIN_PIN) {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Invalid PIN. Please try again.');
      setPin('');
    }
  };

  // Show PIN entry form if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <div className="text-blue-600 text-6xl mb-4">🔐</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Admin Access</h2>
            <p className="text-gray-600">Enter PIN to access Product Lookup Table</p>
          </div>

          <form onSubmit={handlePinSubmit} className="space-y-6">
            <div>
              <label htmlFor="pin" className="block text-sm font-medium text-gray-700 mb-2">
                Admin PIN
              </label>
              <input
                type="password"
                id="pin"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-lg tracking-widest"
                placeholder="••••"
                maxLength={4}
                autoComplete="off"
              />
            </div>

            {error && (
              <div className="text-red-600 text-sm text-center bg-red-50 p-3 rounded-lg">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Access Dashboard
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-gray-500">
            <p>🔒 Secure admin access for DS LLC management</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          {/* Navigation */}
          <div className="mb-4">
            <nav className="flex space-x-4">
              <button
                onClick={() => window.location.href = '/admin/orders'}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
              >
                📦 Order Management
              </button>
              <button
                onClick={() => window.location.href = '/admin/customers'}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
              >
                👥 Customer Analytics
              </button>
              <button
                onClick={() => window.location.href = '/admin/products'}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
              >
                📋 Product Catalog
              </button>
              <button
                onClick={() => window.location.href = '/admin/lookup'}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium"
              >
                🔍 Product Lookup
              </button>
            </nav>
          </div>
          
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Product Lookup Table</h1>
              <p className="mt-2 text-gray-600">
                Master lookup table for all product identifiers across platforms
              </p>
            </div>
            <button
              onClick={() => {
                setIsAuthenticated(false);
                setPin('');
                setError('');
              }}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
            >
              🔒 Logout
            </button>
          </div>
        </div>

        <ProductLookupDashboard onRefresh={() => {}} />

        {/* Export Settings Button */}
        <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Export Settings</h3>
            <button
              onClick={() => setShowExportSettings(true)}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
            >
              ⚙️ Configure Export Paths
            </button>
          </div>
          <div className="text-sm text-gray-600">
            <p><strong>Current Export Path:</strong> {exportSettings.getExportPath('reports')}</p>
            <p><strong>Filename Format:</strong> product-lookup-export-{new Date().toISOString().split('T')[0]}.csv</p>
          </div>
        </div>

        {/* Additional Actions */}
        <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => {
                // TODO: Implement bulk GTIN assignment
                console.log('Assigning GTINs to products...');
              }}
              className="p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <div className="text-blue-600 text-2xl mb-2">🏷️</div>
              <div className="font-medium text-blue-900">Assign GTINs</div>
              <div className="text-sm text-blue-600">Bulk UPC/EAN assignment</div>
            </button>
            
            <button
              onClick={() => {
                // TODO: Implement Amazon listing preparation
                console.log('Preparing Amazon listings...');
              }}
              className="p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors"
            >
              <div className="text-orange-600 text-2xl mb-2">📦</div>
              <div className="font-medium text-orange-900">Amazon Prep</div>
              <div className="text-sm text-orange-600">Prepare FBA listings</div>
            </button>
            
            <button
              onClick={() => {
                // TODO: Implement Shopify sync
                console.log('Syncing with Shopify...');
              }}
              className="p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
            >
              <div className="text-green-600 text-2xl mb-2">🔄</div>
              <div className="font-medium text-green-900">Sync Platforms</div>
              <div className="text-sm text-green-600">Update all platforms</div>
            </button>
          </div>
        </div>
      </div>

      {/* Export Settings Modal */}
      <ExportSettingsModal
        isOpen={showExportSettings}
        onClose={() => setShowExportSettings(false)}
        onSave={() => {
          // Refresh the page to show updated settings
          window.location.reload();
        }}
      />
    </div>
  );
}
