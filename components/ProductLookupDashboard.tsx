'use client';

import React, { useState, useEffect } from 'react';
import { ProductLookup, productLookup } from '@/data/product-lookup';

interface ProductLookupDashboardProps {
  onRefresh: () => void;
}

export function ProductLookupDashboard({ onRefresh }: ProductLookupDashboardProps) {
  const [products, setProducts] = useState<ProductLookup[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedProvider, setSelectedProvider] = useState<string>('all');
  const [selectedProduct, setSelectedProduct] = useState<ProductLookup | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = () => {
    const allProducts = productLookup.getAllProducts();
    setProducts(allProducts);
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.dsProductId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.shopifyId && product.shopifyId.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (product.amazonASIN && product.amazonASIN.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesProvider = selectedProvider === 'all' || product.fulfillmentProvider === selectedProvider;
    
    return matchesSearch && matchesCategory && matchesProvider;
  });

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
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'discontinued': return 'bg-red-100 text-red-800';
      case 'in_design': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSyncStatusColor = (status: string) => {
    switch (status) {
      case 'synced': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'error': return 'bg-red-100 text-red-800';
      case 'not_mapped': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const openModal = (product: ProductLookup) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  const categories = ['all', ...Array.from(new Set(products.map(p => p.category)))];
  const providers = ['all', ...Array.from(new Set(products.map(p => p.fulfillmentProvider)))];

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Product Lookup Table</h2>
        <button
          onClick={() => {
            const csvContent = productLookup.exportToCSV();
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', 'product-lookup-export.csv');
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          }}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          📊 Export CSV
        </button>
      </div>

      {/* Search and Filters */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search products, IDs, ASINs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category === 'all' ? 'All Categories' : category}
              </option>
            ))}
          </select>
          <select
            value={selectedProvider}
            onChange={(e) => setSelectedProvider(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {providers.map(provider => (
              <option key={provider} value={provider}>
                {provider === 'all' ? 'All Providers' : provider.replace('_', ' ').toUpperCase()}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="text-sm font-medium text-blue-600">Total Products</div>
          <div className="text-2xl font-bold text-blue-800">{products.length}</div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="text-sm font-medium text-green-600">Active Products</div>
          <div className="text-2xl font-bold text-green-800">
            {products.filter(p => p.status === 'active').length}
          </div>
        </div>
        <div className="bg-orange-50 p-4 rounded-lg">
          <div className="text-sm font-medium text-orange-600">Amazon FBA</div>
          <div className="text-2xl font-bold text-orange-800">
            {products.filter(p => p.fulfillmentProvider === 'amazon_fba').length}
          </div>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="text-sm font-medium text-purple-600">Vendor Fulfillment</div>
          <div className="text-2xl font-bold text-purple-800">
            {products.filter(p => p.fulfillmentProvider === 'apparel_vendor').length}
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg">
          <thead>
            <tr className="bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              <th className="py-3 px-4 border-b">DS ID</th>
              <th className="py-3 px-4 border-b">Title</th>
              <th className="py-3 px-4 border-b">Category</th>
              <th className="py-3 px-4 border-b">Shopify ID</th>
              <th className="py-3 px-4 border-b">Amazon ASIN</th>
              <th className="py-3 px-4 border-b">Provider</th>
              <th className="py-3 px-4 border-b">Status</th>
              <th className="py-3 px-4 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-4 text-gray-500">
                  No products found matching your criteria.
                </td>
              </tr>
            ) : (
              filteredProducts.map(product => (
                <tr key={product.dsProductId} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm text-gray-900 font-medium">{product.dsProductId}</td>
                  <td className="py-3 px-4 text-sm text-gray-900">{product.title}</td>
                  <td className="py-3 px-4 text-sm text-gray-900">{product.category}</td>
                  <td className="py-3 px-4 text-sm text-gray-900">{product.shopifyId || '-'}</td>
                  <td className="py-3 px-4 text-sm text-gray-900">{product.amazonASIN || '-'}</td>
                  <td className="py-3 px-4 text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getProviderColor(product.fulfillmentProvider)}`}>
                      {product.fulfillmentProvider.replace('_', ' ').toUpperCase()}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(product.status)}`}>
                      {product.status.charAt(0).toUpperCase() + product.status.slice(1)}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm">
                    <button
                      onClick={() => openModal(product)}
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

      {/* Product Details Modal */}
      {isModalOpen && selectedProduct && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex justify-center items-center">
          <div className="relative p-8 bg-white w-full max-w-4xl mx-auto rounded-lg shadow-lg max-h-[90vh] overflow-y-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Product Details: {selectedProduct.title}
            </h3>
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-xl"
              onClick={closeModal}
            >
              &times;
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Basic Info */}
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-gray-800">Basic Information</h4>
                <div className="space-y-2 text-sm">
                  <div><strong>DS Product ID:</strong> {selectedProduct.dsProductId}</div>
                  <div><strong>Original DS ID:</strong> {selectedProduct.originalDsId || 'N/A'}</div>
                  <div><strong>Title:</strong> {selectedProduct.title}</div>
                  <div><strong>Category:</strong> {selectedProduct.category}</div>
                  <div><strong>Author:</strong> {selectedProduct.author || 'N/A'}</div>
                  <div><strong>Price:</strong> ${selectedProduct.price}</div>
                  <div><strong>Status:</strong> 
                    <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedProduct.status)}`}>
                      {selectedProduct.status.charAt(0).toUpperCase() + selectedProduct.status.slice(1)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Platform IDs */}
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-gray-800">Platform Identifiers</h4>
                <div className="space-y-2 text-sm">
                  <div><strong>Shopify ID:</strong> {selectedProduct.shopifyId || 'Not mapped'}</div>
                  <div><strong>Shopify Handle:</strong> {selectedProduct.shopifyHandle || 'Not mapped'}</div>
                  <div><strong>Amazon ASIN:</strong> {selectedProduct.amazonASIN || 'Not mapped'}</div>
                  <div><strong>Amazon SKU:</strong> {selectedProduct.amazonSKU || 'Not mapped'}</div>
                  <div><strong>Vendor ID:</strong> {selectedProduct.vendorId || 'Not mapped'}</div>
                </div>
              </div>

              {/* GTIN Identifiers */}
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-gray-800">GTIN Identifiers</h4>
                <div className="space-y-2 text-sm">
                  <div><strong>UPC:</strong> {selectedProduct.upc || 'Not assigned'}</div>
                  <div><strong>EAN:</strong> {selectedProduct.ean || 'Not assigned'}</div>
                  <div><strong>ISBN:</strong> {selectedProduct.isbn || 'Not assigned'}</div>
                  <div><strong>GTIN:</strong> {selectedProduct.gtin || 'Not assigned'}</div>
                </div>
              </div>

              {/* Fulfillment */}
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-gray-800">Fulfillment</h4>
                <div className="space-y-2 text-sm">
                  <div><strong>Provider:</strong> 
                    <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getProviderColor(selectedProduct.fulfillmentProvider)}`}>
                      {selectedProduct.fulfillmentProvider.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                  <div><strong>Sync Status:</strong> 
                    <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getSyncStatusColor(selectedProduct.syncStatus)}`}>
                      {selectedProduct.syncStatus.charAt(0).toUpperCase() + selectedProduct.syncStatus.slice(1)}
                    </span>
                  </div>
                  <div><strong>Last Sync:</strong> {selectedProduct.lastSync.toLocaleString()}</div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => {
                  // TODO: Implement edit functionality
                  console.log('Edit product:', selectedProduct.dsProductId);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Edit Product
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
