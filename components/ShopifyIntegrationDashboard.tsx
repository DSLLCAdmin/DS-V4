'use client';

import React, { useState, useEffect } from 'react';
import { ShopifyApiService, ShopifySyncResult } from '@/lib/shopify-api';
import { ShopifyConfig, validateShopifyConfig } from '@/lib/shopify-config';
import { unifiedProductCatalog } from '@/lib/unified-product-data';

interface ShopifyIntegrationDashboardProps {
  onRefresh: () => void;
}

export const ShopifyIntegrationDashboard: React.FC<ShopifyIntegrationDashboardProps> = ({ onRefresh }) => {
  const [config, setConfig] = useState<ShopifyConfig>({
    storeDomain: 'darkstreet-llc.myshopify.com',
    apiVersion: '2024-01',
    accessToken: '',
    webhookSecret: '',
    storeName: 'DarkStreet LLC',
    currency: 'USD',
    timezone: 'America/Los_Angeles'
  });
  
  const [isConnected, setIsConnected] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<string>('');
  const [syncResult, setSyncResult] = useState<ShopifySyncResult | null>(null);
  const [shopifyProducts, setShopifyProducts] = useState<any[]>([]);
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);

  // Load config from localStorage on mount
  useEffect(() => {
    const savedConfig = localStorage.getItem('shopify-config');
    if (savedConfig) {
      try {
        const parsedConfig = JSON.parse(savedConfig);
        setConfig(parsedConfig);
      } catch (error) {
        console.error('Failed to parse saved Shopify config:', error);
      }
    }
  }, []);

  // Save config to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('shopify-config', JSON.stringify(config));
  }, [config]);

  const handleConfigChange = (field: keyof ShopifyConfig, value: string) => {
    setConfig(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const testConnection = async () => {
    setIsTesting(true);
    setConnectionStatus('Testing connection...');
    
    try {
      const apiService = new ShopifyApiService(config);
      const result = await apiService.testConnection();
      
      if (result.success) {
        setIsConnected(true);
        setConnectionStatus('✅ Connected successfully!');
        
        // Fetch existing products
        const productsResult = await apiService.getProducts();
        if (productsResult.success) {
          setShopifyProducts(productsResult.data || []);
        }
      } else {
        setIsConnected(false);
        setConnectionStatus(`❌ Connection failed: ${result.error}`);
      }
    } catch (error) {
      setIsConnected(false);
      setConnectionStatus(`❌ Connection error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsTesting(false);
    }
  };

  const syncProducts = async () => {
    setIsSyncing(true);
    setSyncResult(null);
    
    try {
      const apiService = new ShopifyApiService(config);
      const dsProducts = unifiedProductCatalog.getUnifiedProducts();
      const result = await apiService.syncAllProducts(dsProducts);
      
      setSyncResult(result);
      
      if (result.success) {
        setConnectionStatus(`✅ Sync completed: ${result.syncedProducts} products synced`);
        // Refresh Shopify products
        const productsResult = await apiService.getProducts();
        if (productsResult.success) {
          setShopifyProducts(productsResult.data || []);
        }
      } else {
        setConnectionStatus(`❌ Sync failed: ${result.errors.length} errors`);
      }
    } catch (error) {
      setSyncResult({
        success: false,
        syncedProducts: 0,
        failedProducts: [],
        errors: [`Sync error: ${error instanceof Error ? error.message : 'Unknown error'}`]
      });
      setConnectionStatus(`❌ Sync error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsSyncing(false);
    }
  };

  const configValidation = validateShopifyConfig(config);

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Shopify Integration</h2>
        <button
          onClick={() => setIsConfigModalOpen(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Configure
        </button>
      </div>

      {/* Connection Status */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Connection Status</h3>
        <div className="flex items-center gap-4">
          <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
          <span className="text-sm">{connectionStatus || 'Not connected'}</span>
        </div>
        
        {configValidation.isValid ? (
          <button
            onClick={testConnection}
            disabled={isTesting}
            className="mt-3 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
          >
            {isTesting ? 'Testing...' : 'Test Connection'}
          </button>
        ) : (
          <div className="mt-3 text-sm text-red-600">
            Configuration incomplete: {configValidation.errors.join(', ')}
          </div>
        )}
      </div>

      {/* Sync Section */}
      {isConnected && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Product Synchronization</h3>
          <p className="text-sm text-gray-600 mb-4">
            Sync {unifiedProductCatalog.getUnifiedProducts().length} DS products to Shopify
          </p>
          
          <button
            onClick={syncProducts}
            disabled={isSyncing}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {isSyncing ? 'Syncing...' : 'Sync Products'}
          </button>
        </div>
      )}

      {/* Sync Results */}
      {syncResult && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Sync Results</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{syncResult.syncedProducts}</div>
              <div className="text-sm text-gray-600">Products Synced</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{syncResult.failedProducts.length}</div>
              <div className="text-sm text-gray-600">Failed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{syncResult.errors.length}</div>
              <div className="text-sm text-gray-600">Errors</div>
            </div>
          </div>
          
          {syncResult.failedProducts.length > 0 && (
            <div className="mt-4">
              <h4 className="font-semibold text-red-600">Failed Products:</h4>
              <ul className="text-sm text-red-600">
                {syncResult.failedProducts.map(productId => (
                  <li key={productId}>• {productId}</li>
                ))}
              </ul>
            </div>
          )}
          
          {syncResult.errors.length > 0 && (
            <div className="mt-4">
              <h4 className="font-semibold text-red-600">Errors:</h4>
              <ul className="text-sm text-red-600">
                {syncResult.errors.map((error, index) => (
                  <li key={index}>• {error}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Shopify Products */}
      {shopifyProducts.length > 0 && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Shopify Products ({shopifyProducts.length})</h3>
          <div className="max-h-60 overflow-y-auto">
            <div className="space-y-2">
              {shopifyProducts.slice(0, 10).map(product => (
                <div key={product.id} className="flex justify-between items-center p-2 bg-white rounded border">
                  <div>
                    <div className="font-medium">{product.title}</div>
                    <div className="text-sm text-gray-600">SKU: {product.variants[0]?.sku || 'N/A'}</div>
                  </div>
                  <div className="text-sm text-gray-600">
                    ${product.variants[0]?.price || '0.00'}
                  </div>
                </div>
              ))}
              {shopifyProducts.length > 10 && (
                <div className="text-sm text-gray-600 text-center">
                  ... and {shopifyProducts.length - 10} more products
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Configuration Modal */}
      {isConfigModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Shopify Configuration</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Store Domain
                </label>
                <input
                  type="text"
                  value={config.storeDomain}
                  onChange={(e) => handleConfigChange('storeDomain', e.target.value)}
                  placeholder="your-store.myshopify.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Access Token
                </label>
                <input
                  type="password"
                  value={config.accessToken}
                  onChange={(e) => handleConfigChange('accessToken', e.target.value)}
                  placeholder="shpat_..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Webhook Secret
                </label>
                <input
                  type="password"
                  value={config.webhookSecret}
                  onChange={(e) => handleConfigChange('webhookSecret', e.target.value)}
                  placeholder="Webhook secret for verification"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Store Name
                </label>
                <input
                  type="text"
                  value={config.storeName}
                  onChange={(e) => handleConfigChange('storeName', e.target.value)}
                  placeholder="DarkStreet LLC"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setIsConfigModalOpen(false)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => setIsConfigModalOpen(false)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
