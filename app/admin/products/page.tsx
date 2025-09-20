'use client';

import React, { useState, useEffect } from 'react';
import { AdminLayout, AdminTabInfo } from '@/components/AdminLayout';
import { ProductCatalogDashboard } from '@/components/ProductCatalogDashboard';
import { ProductMapping, CatalogSyncStatus, SyncError } from '@/lib/product-catalog';
import { unifiedProductCatalog } from '@/lib/unified-product-data';
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

export default function ProductsAdminPage() {
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
  const [error, setError] = useState('');
  const [showExportSettings, setShowExportSettings] = useState(false);

  const fetchProductData = async () => {
    try {
      setLoading(true);
      setError('');

      // Use unified data source (single source of truth)
      const fetchedMappings = unifiedProductCatalog.getMappings();
      const fetchedSyncStatus = unifiedProductCatalog.getSyncStatus();
      const fetchedSyncErrors = unifiedProductCatalog.getSyncErrors();

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
    fetchProductData();
  }, []);

  if (loading) {
    return (
      <AdminLayout currentPage="products">
        <AdminTabInfo tabId="products" />
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading product catalog...</p>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout currentPage="products">
        <AdminTabInfo tabId="products" />
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
      </AdminLayout>
    );
  }

  return (
    <AdminLayout currentPage="products">
      <AdminTabInfo tabId="products" />

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

      {/* Export Settings Modal */}
      <ExportSettingsModal
        isOpen={showExportSettings}
        onClose={() => setShowExportSettings(false)}
        onSave={() => {
          // Refresh the page to show updated settings
          window.location.reload();
        }}
      />
    </AdminLayout>
  );
}
