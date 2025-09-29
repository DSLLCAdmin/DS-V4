'use client';

import React, { useState, useEffect } from 'react';
import { 
  Globe,
  Shield,
  CheckCircle,
  AlertCircle,
  Clock,
  RefreshCw,
  Plus,
  Trash2,
  Settings
} from 'lucide-react';
import { ShopifyDomainManager } from '@/lib/shopify-domain';
import type { DomainStatus, ShopifyDomainConfig } from '@/lib/shopify-domain';

export default function ShopifyDomainDashboard() {
  const [domains, setDomains] = useState<DomainStatus[]>([]);
  const [config, setConfig] = useState<ShopifyDomainConfig>({
    primaryDomain: 'darkstreetllc.com',
    sslEnabled: true,
    customDomains: ['shop.darkstreetllc.com', 'www.darkstreetllc.com']
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const manager = new ShopifyDomainManager();
    setDomains(manager.getDomains());
    setIsLoading(false);
  }, []);

  const refreshDomains = async () => {
    setIsLoading(true);
    const manager = new ShopifyDomainManager();
    setDomains(manager.getDomains());
    setIsLoading(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'failed':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Shopify Domain Management</h2>
          <p className="text-gray-600">Manage custom domains and SSL certificates</p>
        </div>
        <button
          onClick={refreshDomains}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <RefreshCw className="h-4 w-4" />
          <span>Refresh</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="bg-blue-100 p-3 rounded-full">
              <Globe className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Domains</p>
              <p className="text-2xl font-bold text-gray-900">{domains.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="bg-green-100 p-3 rounded-full">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active</p>
              <p className="text-2xl font-bold text-gray-900">
                {domains.filter(d => d.status === 'active').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="bg-yellow-100 p-3 rounded-full">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-gray-900">
                {domains.filter(d => d.status === 'pending').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="bg-purple-100 p-3 rounded-full">
              <Shield className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">SSL Active</p>
              <p className="text-2xl font-bold text-gray-900">
                {domains.filter(d => d.sslStatus === 'active').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Domain Configuration */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Domain Configuration</h3>
        </div>
        <div className="px-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Primary Domain
              </label>
              <input
                type="text"
                value={config.primaryDomain}
                onChange={(e) => setConfig(prev => ({ ...prev, primaryDomain: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div className="flex items-center">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={config.sslEnabled}
                  onChange={(e) => setConfig(prev => ({ ...prev, sslEnabled: e.target.checked }))}
                  className="mr-2"
                />
                <span className="text-sm font-medium text-gray-700">Enable SSL</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Domain Status */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Domain Status</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {domains.map((domain) => (
            <div key={domain.domain} className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Globe className="h-5 w-5 text-gray-600" />
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">{domain.domain}</h4>
                    <p className="text-sm text-gray-500">
                      {domain.error ? `Error: ${domain.error}` : 'Domain configured'}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadge(domain.status)}`}>
                    {domain.status}
                  </span>
                  
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadge(domain.sslStatus)}`}>
                    SSL: {domain.sslStatus}
                  </span>
                  
                  {getStatusIcon(domain.status)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Domain Actions</h3>
          <div className="space-y-3">
            <button className="w-full flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <Plus className="h-5 w-5 text-blue-600" />
              <span className="text-sm font-medium">Add Custom Domain</span>
            </button>
            <button className="w-full flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <Settings className="h-5 w-5 text-green-600" />
              <span className="text-sm font-medium">Configure DNS</span>
            </button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">SSL Management</h3>
          <div className="space-y-3">
            <button className="w-full flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <Shield className="h-5 w-5 text-purple-600" />
              <span className="text-sm font-medium">Renew SSL Certificate</span>
            </button>
            <button className="w-full flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <RefreshCw className="h-5 w-5 text-orange-600" />
              <span className="text-sm font-medium">Force SSL Update</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
