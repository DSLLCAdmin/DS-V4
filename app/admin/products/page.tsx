'use client';

import React, { useState, useEffect } from 'react';
import { ProductCatalogDashboard } from '@/components/ProductCatalogDashboard';
import { ProductMapping, CatalogSyncStatus, SyncError, productCatalog } from '@/lib/product-catalog';
import { exportSettings } from '@/lib/export-settings';
import { ExportSettingsModal } from '@/components/ExportSettingsModal';

// CSV Export Functions
function generateProductCatalogCSV(mappings: ProductMapping[]): string {
  const headers = [
    'DS Product ID',
    'Amazon ASIN',
    'Shopify ID',
    'Vendor ID',
    'Fulfillment Provider',
    'Sync Status',
    'Last Sync'
  ];

  const rows = mappings.map(mapping => [
    mapping.dsProductId,
    mapping.amazonASIN || '',
    mapping.shopifyId || '',
    mapping.vendorId || '',
    mapping.fulfillmentProvider,
    mapping.syncStatus,
    mapping.lastSync.toISOString()
  ]);

  return [headers, ...rows].map(row => 
    row.map(field => `"${field}"`).join(',')
  ).join('\n');
}

function downloadCSV(content: string, filename: string, type: 'orders' | 'customers' | 'analytics' | 'reports'): void {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  // Use export settings for filename
  const fullPath = exportSettings.getFullFilePath(type);
  const pathParts = fullPath.split('\\');
  const finalFilename = pathParts[pathParts.length - 1];
  
  link.setAttribute('href', url);
  link.setAttribute('download', finalFilename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  console.log(`📁 Export saved: ${finalFilename}`);
  console.log(`📁 Full path: ${fullPath}`);
}

// Simple 4-character PIN security
const ADMIN_PIN = '2024'; // Change this to your preferred PIN

export default function ProductsAdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [mappings, setMappings] = useState<ProductMapping[]>([]);
  const [syncStatus, setSyncStatus] = useState<CatalogSyncStatus>({
    totalProducts: 0,
    syncedProducts: 0,
    pendingSync: 0,
    syncErrors: 0,
    lastFullSync: new Date(),
    nextScheduledSync: new Date()
  });
  const [syncErrors, setSyncErrors] = useState<SyncError[]>([]);
  const [loading, setLoading] = useState(true);
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

  const fetchProductData = async () => {
    try {
      setLoading(true);
      setError('');

      // In a real app, this would be an API call
      const fetchedMappings = productCatalog.getMappings();
      const fetchedSyncStatus = productCatalog.getSyncStatus();
      const fetchedSyncErrors = productCatalog.getSyncErrors();

      setMappings(fetchedMappings);
      setSyncStatus(fetchedSyncStatus);
      setSyncErrors(fetchedSyncErrors);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch product data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchProductData();
    }
  }, [isAuthenticated]);

  // Show PIN entry form if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <div className="text-blue-600 text-6xl mb-4">🔐</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Admin Access</h2>
            <p className="text-gray-600">Enter PIN to access Product Catalog Management</p>
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading product catalog...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Product Catalog</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchProductData}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
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
                className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium"
              >
                📋 Product Catalog
              </button>
            </nav>
          </div>
          
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Product Catalog Management</h1>
              <p className="mt-2 text-gray-600">
                Manage product mappings, sync status, and fulfillment providers
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

        <ProductCatalogDashboard
          mappings={mappings}
          syncStatus={syncStatus}
          syncErrors={syncErrors}
          onRefresh={fetchProductData}
        />

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
            <p><strong>Filename Format:</strong> product-catalog-export-{new Date().toISOString().split('T')[0]}.csv</p>
          </div>
        </div>

        {/* Additional Actions */}
        <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => {
                // Export product catalog to CSV
                const csvContent = generateProductCatalogCSV(mappings);
                downloadCSV(csvContent, 'product-catalog-export.csv', 'reports');
              }}
              className="p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
            >
              <div className="text-green-600 text-2xl mb-2">📊</div>
              <div className="font-medium text-green-900">Export Catalog</div>
              <div className="text-sm text-green-600">CSV download</div>
            </button>
            
            <button
              onClick={() => {
                // TODO: Implement bulk mapping creation
                console.log('Creating bulk mappings...');
              }}
              className="p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <div className="text-blue-600 text-2xl mb-2">➕</div>
              <div className="font-medium text-blue-900">Bulk Mapping</div>
              <div className="text-sm text-blue-600">Create mappings</div>
            </button>
            
            <button
              onClick={() => {
                // TODO: Implement inventory sync
                console.log('Syncing inventory...');
              }}
              className="p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
            >
              <div className="text-purple-600 text-2xl mb-2">📦</div>
              <div className="font-medium text-purple-900">Inventory Sync</div>
              <div className="text-sm text-purple-600">Update stock levels</div>
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
