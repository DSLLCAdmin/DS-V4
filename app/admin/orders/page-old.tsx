'use client';

import React, { useState, useEffect } from 'react';
import { AdminLayout, AdminTabInfo } from '@/components/AdminLayout';
import { OrderManagementDashboard } from '@/components/OrderManagementDashboard';
import { Order, OrderAnalytics } from '@/lib/order-management';
import { exportSettings } from '@/lib/export-settings';
import { ExportSettingsModal } from '@/components/ExportSettingsModal';

// CSV Export Functions
function generateOrdersCSV(orders: Order[]): string {
  const headers = [
    'Order ID',
    'Customer Name',
    'Customer Email',
    'Status',
    'Total Amount',
    'Shipping Cost',
    'Tax',
    'Created Date',
    'Updated Date',
    'Amazon Order ID',
    'Tracking Number',
    'Items Count'
  ];

  const rows = orders.map(order => [
    order.id,
    order.customerName,
    order.customerEmail,
    order.status,
    order.totalAmount.toString(),
    order.shippingCost.toString(),
    order.tax.toString(),
    order.createdAt.toISOString(),
    order.updatedAt.toISOString(),
    order.amazonOrderId || '',
    order.trackingNumber || '',
    order.items.length.toString()
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

export default function OrdersAdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [orders, setOrders] = useState<Order[]>([]);
  const [analytics, setAnalytics] = useState<OrderAnalytics>({
    totalOrders: 0,
    ordersByStatus: {
      pending: 0,
      processing: 0,
      shipped: 0,
      delivered: 0,
      cancelled: 0,
      error: 0,
      retry: 0,
      refunded: 0
    },
    averageOrderValue: 0,
    totalRevenue: 0,
    errorRate: 0,
    fulfillmentTime: 0
  });
  const [loading, setLoading] = useState(true);
  const [dataError, setDataError] = useState<string | null>(null);
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

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setDataError(null);

      // TODO: Replace with actual API call when backend is ready
      // For now, we'll simulate some sample data
      const sampleOrders: Order[] = [
        {
          id: '1001',
          customerId: 'customer-1',
          customerEmail: 'john.doe@example.com',
          customerName: 'John Doe',
          customerAddress: {
            street: '123 Main St',
            city: 'Anytown',
            state: 'CA',
            zipCode: '12345',
            country: 'US'
          },
          items: [
            {
              productId: 'book-1',
              title: 'First & Light - Paperback',
              quantity: 1,
              price: 15.99,
              image: '/product-images/1b_first-light-paperback.jpg'
            }
          ],
          status: 'delivered',
          totalAmount: 18.99,
          shippingCost: 2.50,
          tax: 0.50,
          createdAt: new Date('2024-01-15T10:30:00Z'),
          updatedAt: new Date('2024-01-17T14:20:00Z'),
          amazonOrderId: 'AMZ-123456789',
          trackingNumber: 'TRK-ABC123XYZ',
          retryCount: 0
        },
        {
          id: '1002',
          customerId: 'customer-2',
          customerEmail: 'jane.smith@example.com',
          customerName: 'Jane Smith',
          customerAddress: {
            street: '456 Oak Ave',
            city: 'Somewhere',
            state: 'NY',
            zipCode: '67890',
            country: 'US'
          },
          items: [
            {
              productId: 'book-2',
              title: 'Risque & Safety - Paperback',
              quantity: 2,
              price: 15.99,
              image: '/product-images/2b_risque-safety-paperback.jpg'
            },
            {
              productId: 'book-3',
              title: 'Mercury & Memory - Paperback',
              quantity: 1,
              price: 15.99,
              image: '/product-images/3b_mercury-memory-paperback.jpg'
            }
          ],
          status: 'processing',
          totalAmount: 52.47,
          shippingCost: 4.50,
          tax: 1.50,
          createdAt: new Date('2024-01-16T15:45:00Z'),
          updatedAt: new Date('2024-01-16T15:45:00Z'),
          amazonOrderId: 'AMZ-987654321',
          retryCount: 0
        },
        {
          id: '1003',
          customerId: 'customer-3',
          customerEmail: 'bob.wilson@example.com',
          customerName: 'Bob Wilson',
          customerAddress: {
            street: '789 Pine St',
            city: 'Elsewhere',
            state: 'TX',
            zipCode: '54321',
            country: 'US'
          },
          items: [
            {
              productId: 'book-1',
              title: 'First & Light - Paperback',
              quantity: 1,
              price: 15.99,
              image: '/product-images/1b_first-light-paperback.jpg'
            }
          ],
          status: 'error',
          totalAmount: 18.99,
          shippingCost: 2.50,
          tax: 0.50,
          createdAt: new Date('2024-01-17T09:15:00Z'),
          updatedAt: new Date('2024-01-17T09:20:00Z'),
          errorMessage: 'Amazon FBA API timeout',
          retryCount: 2
        }
      ];

      setOrders(sampleOrders);

      // Calculate analytics
      const totalOrders = sampleOrders.length;
      const totalRevenue = sampleOrders.reduce((sum, order) => sum + order.totalAmount, 0);
      const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
      
      const ordersByStatus = {
        pending: 0,
        processing: 0,
        shipped: 0,
        delivered: 0,
        cancelled: 0,
        error: 0,
        retry: 0,
        refunded: 0
      };
      
      sampleOrders.forEach(order => {
        ordersByStatus[order.status]++;
      });
      
      const errorOrders = sampleOrders.filter(order => order.status === 'error').length;
      const errorRate = totalOrders > 0 ? (errorOrders / totalOrders) * 100 : 0;
      
      const shippedOrders = sampleOrders.filter(order => order.status === 'shipped' || order.status === 'delivered');
      let fulfillmentTime = 0;
      if (shippedOrders.length > 0) {
        const totalFulfillmentTime = shippedOrders.reduce((sum, order) => {
          const fulfillmentTime = order.updatedAt.getTime() - order.createdAt.getTime();
          return sum + fulfillmentTime;
        }, 0);
        fulfillmentTime = totalFulfillmentTime / shippedOrders.length / (1000 * 60 * 60); // Convert to hours
      }

      setAnalytics({
        totalOrders,
        ordersByStatus,
        averageOrderValue,
        totalRevenue,
        errorRate,
        fulfillmentTime
      });

    } catch (err) {
      setDataError(err instanceof Error ? err.message : 'Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchOrders();
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
            <p className="text-gray-600">Enter PIN to access Order Management Dashboard</p>
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
          <p className="text-gray-600">Loading orders...</p>
        </div>
      </div>
    );
  }

  if (dataError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Orders</h2>
          <p className="text-gray-600 mb-4">{dataError}</p>
          <button
            onClick={fetchOrders}
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
                className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium"
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
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
              >
                🔍 Product Lookup
              </button>
            </nav>
          </div>
          
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Order Management</h1>
              <p className="mt-2 text-gray-600">
                Monitor and manage all orders from your DarkStreet website
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

        <OrderManagementDashboard
          orders={orders}
          analytics={analytics}
          onRefresh={fetchOrders}
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
            <p><strong>Current Export Path:</strong> {exportSettings.getExportPath('orders')}</p>
            <p><strong>Filename Format:</strong> {exportSettings.generateFilename('orders')}</p>
          </div>
        </div>

        {/* Additional Actions */}
        <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => {
                // TODO: Implement bulk order processing
                console.log('Processing pending orders...');
              }}
              className="p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <div className="text-blue-600 text-2xl mb-2">🔄</div>
              <div className="font-medium text-blue-900">Process Pending Orders</div>
              <div className="text-sm text-blue-600">{analytics.ordersByStatus.pending} pending</div>
            </button>
            
            <button
              onClick={() => {
                // TODO: Implement error retry
                console.log('Retrying failed orders...');
              }}
              className="p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors"
            >
              <div className="text-orange-600 text-2xl mb-2">🔄</div>
              <div className="font-medium text-orange-900">Retry Failed Orders</div>
              <div className="text-sm text-orange-600">{analytics.ordersByStatus.error} failed</div>
            </button>
            
            <button
              onClick={() => {
                // Export orders to CSV
                const csvContent = generateOrdersCSV(orders);
                downloadCSV(csvContent, 'orders-export.csv', 'orders');
              }}
              className="p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
            >
              <div className="text-green-600 text-2xl mb-2">📊</div>
              <div className="font-medium text-green-900">Export Analytics</div>
              <div className="text-sm text-green-600">CSV download</div>
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
