'use client';

import React, { useState, useEffect } from 'react';
import { ProductMapping, CatalogSyncStatus, SyncError } from '@/lib/product-catalog';
import { unifiedProductCatalog } from '@/lib/unified-product-data';

interface ProductCatalogDashboardProps {
  mappings: ProductMapping[];
  syncStatus: CatalogSyncStatus;
  syncErrors: SyncError[];
  onRefresh: () => void;
}

export function ProductCatalogDashboard({ 
  mappings, 
  syncStatus, 
  syncErrors, 
  onRefresh 
}: ProductCatalogDashboardProps) {
  const [selectedProvider, setSelectedProvider] = useState<string>('all');
  const [selectedMapping, setSelectedMapping] = useState<ProductMapping | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  const filteredMappings = selectedProvider === 'all'
    ? mappings
    : mappings.filter(mapping => mapping.fulfillmentProvider === selectedProvider);

  const getProviderColor = (provider: string) => {
    switch (provider) {
      case 'amazon_fba': return 'bg-orange-100 text-orange-800';
      case 'apparel_vendor': return 'bg-blue-100 text-blue-800';
      case 'manual': return 'bg-gray-100 text-gray-800';
      case 'digital': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'synced': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'error': return 'bg-red-100 text-red-800';
      case 'not_mapped': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const openModal = (mapping: ProductMapping) => {
    setSelectedMapping(mapping);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedMapping(null);
  };

  const handleFullSync = async () => {
    setIsSyncing(true);
    try {
      // Validate data consistency
      const validation = unifiedProductCatalog.validateConsistency();
      if (!validation.isValid) {
        console.warn('Data consistency issues:', validation.issues);
      }
      
      // Simulate sync process
      console.log(`Sync completed: ${validation.isValid ? 'success' : 'with warnings'}`);
      onRefresh();
    } catch (error) {
      console.error('Sync failed:', error);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleRetryError = async (productId: string) => {
    const mapping = mappings.find(m => m.dsProductId === productId);
    if (!mapping) return;

    try {
      // Simulate retry process
      console.log(`Retrying sync for product ${productId} with provider ${mapping.fulfillmentProvider}`);
      onRefresh();
    } catch (error) {
      console.error('Retry failed:', error);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Product Catalog Management</h2>
        <div className="flex space-x-3">
          <button
            onClick={handleFullSync}
            disabled={isSyncing}
            className={`px-4 py-2 rounded-lg transition-colors ${
              isSyncing 
                ? 'bg-gray-400 text-white cursor-not-allowed' 
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {isSyncing ? '🔄 Syncing...' : '🔄 Full Sync'}
          </button>
          <button
            onClick={onRefresh}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
          >
            🔄 Refresh
          </button>
        </div>
      </div>

      {/* Sync Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="text-sm font-medium text-blue-600">Total Products</div>
          <div className="text-2xl font-bold text-blue-800">{syncStatus.totalProducts}</div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="text-sm font-medium text-green-600">Synced</div>
          <div className="text-2xl font-bold text-green-800">{syncStatus.syncedProducts}</div>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg">
          <div className="text-sm font-medium text-yellow-600">Pending</div>
          <div className="text-2xl font-bold text-yellow-800">{syncStatus.pendingSync}</div>
        </div>
        <div className="bg-red-50 p-4 rounded-lg">
          <div className="text-sm font-medium text-red-600">Errors</div>
          <div className="text-2xl font-bold text-red-800">{syncStatus.syncErrors}</div>
        </div>
      </div>

      {/* Provider Filter */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Product Mappings</h3>
        <select
          value={selectedProvider}
          onChange={(e) => setSelectedProvider(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="all">All Providers</option>
          <option value="amazon_fba">Amazon FBA</option>
          <option value="apparel_vendor">Apparel Vendor</option>
          <option value="manual">Manual</option>
          <option value="digital">Digital</option>
        </select>
      </div>

      {/* Sync Errors */}
      {syncErrors.length > 0 && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <h4 className="font-semibold text-red-800 mb-2">Sync Errors</h4>
          <div className="space-y-2">
            {syncErrors.map((error, index) => (
              <div key={index} className="flex justify-between items-center bg-white p-3 rounded border">
                <div>
                  <span className="font-medium text-gray-900">{error.productId}</span>
                  <span className="text-gray-600 ml-2">{error.error}</span>
                  <span className="text-xs text-gray-500 ml-2">
                    Retry #{error.retryCount} - {error.timestamp.toLocaleString()}
                  </span>
                </div>
                <button
                  onClick={() => handleRetryError(error.productId)}
                  className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
                >
                  Retry
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Product Mappings Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg">
          <thead>
            <tr className="bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              <th className="py-3 px-4 border-b">DS Product ID</th>
              <th className="py-3 px-4 border-b">Amazon ASIN</th>
              <th className="py-3 px-4 border-b">Shopify ID</th>
              <th className="py-3 px-4 border-b">Provider</th>
              <th className="py-3 px-4 border-b">Status</th>
              <th className="py-3 px-4 border-b">Last Sync</th>
              <th className="py-3 px-4 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredMappings.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-4 text-gray-500">
                  No product mappings found for this provider.
                </td>
              </tr>
            ) : (
              filteredMappings.map(mapping => (
                <tr key={mapping.dsProductId} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm text-gray-900">{mapping.dsProductId}</td>
                  <td className="py-3 px-4 text-sm text-gray-900">{mapping.amazonASIN || '-'}</td>
                  <td className="py-3 px-4 text-sm text-gray-900">{mapping.shopifyId || '-'}</td>
                  <td className="py-3 px-4 text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getProviderColor(mapping.fulfillmentProvider)}`}>
                      {mapping.fulfillmentProvider.replace('_', ' ').toUpperCase()}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(mapping.syncStatus)}`}>
                      {mapping.syncStatus.charAt(0).toUpperCase() + mapping.syncStatus.slice(1)}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-900">
                    {mapping.lastSync.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-sm">
                    <button
                      onClick={() => openModal(mapping)}
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Product Mapping Details Modal */}
      {isModalOpen && selectedMapping && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex justify-center items-center">
          <div className="relative p-8 bg-white w-full max-w-2xl mx-auto rounded-lg shadow-lg">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Product Mapping: {selectedMapping.dsProductId}
            </h3>
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-xl"
              onClick={closeModal}
            >
              &times;
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-6">
              <div>
                <p className="font-semibold text-gray-700">DS Product ID:</p>
                <p>{selectedMapping.dsProductId}</p>
              </div>
              <div>
                <p className="font-semibold text-gray-700">Fulfillment Provider:</p>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getProviderColor(selectedMapping.fulfillmentProvider)}`}>
                  {selectedMapping.fulfillmentProvider.replace('_', ' ').toUpperCase()}
                </span>
              </div>
              <div>
                <p className="font-semibold text-gray-700">Amazon ASIN:</p>
                <p>{selectedMapping.amazonASIN || 'Not mapped'}</p>
              </div>
              <div>
                <p className="font-semibold text-gray-700">Shopify ID:</p>
                <p>{selectedMapping.shopifyId || 'Not mapped'}</p>
              </div>
              <div>
                <p className="font-semibold text-gray-700">Vendor ID:</p>
                <p>{selectedMapping.vendorId || 'Not mapped'}</p>
              </div>
              <div>
                <p className="font-semibold text-gray-700">Sync Status:</p>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedMapping.syncStatus)}`}>
                  {selectedMapping.syncStatus.charAt(0).toUpperCase() + selectedMapping.syncStatus.slice(1)}
                </span>
              </div>
              <div>
                <p className="font-semibold text-gray-700">Last Sync:</p>
                <p>{selectedMapping.lastSync.toLocaleString()}</p>
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => {
                  handleRetryError(selectedMapping.dsProductId);
                  closeModal();
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Retry Sync
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
