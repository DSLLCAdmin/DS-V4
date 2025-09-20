'use client';

import React, { useState } from 'react';
import { AdminLayout, AdminTabInfo } from '@/components/AdminLayout';
import { ProductLookupDashboard } from '@/components/ProductLookupDashboard';
import { exportSettings } from '@/lib/export-settings';
import { ExportSettingsModal } from '@/components/ExportSettingsModal';

export default function ProductLookupAdminPage() {
  const [showExportSettings, setShowExportSettings] = useState(false);

  return (
    <AdminLayout currentPage="lookup">
      <AdminTabInfo tabId="lookup" />

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
