'use client';

import React, { useState, useEffect } from 'react';
import { Order, OrderStatus, OrderAnalytics } from '@/lib/order-management';

interface OrderManagementDashboardProps {
  orders: Order[];
  analytics: OrderAnalytics;
  onRefresh: () => void;
}

export function OrderManagementDashboard({ orders, analytics, onRefresh }: OrderManagementDashboardProps) {
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus | 'all'>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const filteredOrders = selectedStatus === 'all' 
    ? orders 
    : orders.filter(order => order.status === selectedStatus);

  const statusColors: Record<OrderStatus, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    processing: 'bg-blue-100 text-blue-800',
    shipped: 'bg-purple-100 text-purple-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
    error: 'bg-red-100 text-red-800',
    retry: 'bg-orange-100 text-orange-800',
    refunded: 'bg-gray-100 text-gray-800'
  };

  const statusIcons: Record<OrderStatus, string> = {
    pending: '⏳',
    processing: '🔄',
    shipped: '📦',
    delivered: '✅',
    cancelled: '❌',
    error: '⚠️',
    retry: '🔄',
    refunded: '💰'
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Order Management Dashboard</h2>
        <button
          onClick={onRefresh}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          🔄 Refresh
        </button>
      </div>

      {/* Analytics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="text-sm font-medium text-blue-600">Total Orders</div>
          <div className="text-2xl font-bold text-blue-900">{analytics.totalOrders}</div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="text-sm font-medium text-green-600">Total Revenue</div>
          <div className="text-2xl font-bold text-green-900">${analytics.totalRevenue.toFixed(2)}</div>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="text-sm font-medium text-purple-600">Avg Order Value</div>
          <div className="text-2xl font-bold text-purple-900">${analytics.averageOrderValue.toFixed(2)}</div>
        </div>
        <div className="bg-red-50 p-4 rounded-lg">
          <div className="text-sm font-medium text-red-600">Error Rate</div>
          <div className="text-2xl font-bold text-red-900">{analytics.errorRate.toFixed(1)}%</div>
        </div>
      </div>

      {/* Status Filter */}
      <div className="mb-4">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedStatus('all')}
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              selectedStatus === 'all' 
                ? 'bg-gray-900 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All ({orders.length})
          </button>
          {Object.entries(analytics.ordersByStatus).map(([status, count]) => (
            <button
              key={status}
              onClick={() => setSelectedStatus(status as OrderStatus)}
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                selectedStatus === status 
                  ? 'bg-gray-900 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {statusIcons[status as OrderStatus]} {status} ({count})
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Order ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Customer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredOrders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  #{order.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div>
                    <div className="font-medium">{order.customerName}</div>
                    <div className="text-gray-400">{order.customerEmail}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusColors[order.status]}`}>
                    {statusIcons[order.status]} {order.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  ${order.totalAmount.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => setSelectedOrder(order)}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">Order #{selectedOrder.id}</h3>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              {/* Customer Info */}
              <div>
                <h4 className="font-semibold text-gray-900">Customer Information</h4>
                <div className="mt-2 text-sm text-gray-600">
                  <div><strong>Name:</strong> {selectedOrder.customerName}</div>
                  <div><strong>Email:</strong> {selectedOrder.customerEmail}</div>
                  <div><strong>Address:</strong> {selectedOrder.customerAddress.street}, {selectedOrder.customerAddress.city}, {selectedOrder.customerAddress.state} {selectedOrder.customerAddress.zipCode}</div>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h4 className="font-semibold text-gray-900">Order Items</h4>
                <div className="mt-2 space-y-2">
                  {selectedOrder.items.map((item, index) => (
                    <div key={index} className="flex items-center space-x-3 p-2 bg-gray-50 rounded">
                      <img src={item.image} alt={item.title} className="w-12 h-12 object-cover rounded" />
                      <div className="flex-1">
                        <div className="font-medium">{item.title}</div>
                        <div className="text-sm text-gray-500">Qty: {item.quantity} × ${item.price.toFixed(2)}</div>
                      </div>
                      <div className="font-semibold">${(item.quantity * item.price).toFixed(2)}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Summary */}
              <div>
                <h4 className="font-semibold text-gray-900">Order Summary</h4>
                <div className="mt-2 space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>${(selectedOrder.totalAmount - selectedOrder.shippingCost - selectedOrder.tax).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping:</span>
                    <span>${selectedOrder.shippingCost.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax:</span>
                    <span>${selectedOrder.tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-semibold border-t pt-1">
                    <span>Total:</span>
                    <span>${selectedOrder.totalAmount.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Order Status */}
              <div>
                <h4 className="font-semibold text-gray-900">Order Status</h4>
                <div className="mt-2">
                  <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${statusColors[selectedOrder.status]}`}>
                    {statusIcons[selectedOrder.status]} {selectedOrder.status}
                  </span>
                  {selectedOrder.trackingNumber && (
                    <div className="mt-2 text-sm text-gray-600">
                      <strong>Tracking:</strong> {selectedOrder.trackingNumber}
                    </div>
                  )}
                  {selectedOrder.errorMessage && (
                    <div className="mt-2 text-sm text-red-600">
                      <strong>Error:</strong> {selectedOrder.errorMessage}
                    </div>
                  )}
                </div>
              </div>

              {/* Timestamps */}
              <div>
                <h4 className="font-semibold text-gray-900">Timestamps</h4>
                <div className="mt-2 text-sm text-gray-600">
                  <div><strong>Created:</strong> {new Date(selectedOrder.createdAt).toLocaleString()}</div>
                  <div><strong>Updated:</strong> {new Date(selectedOrder.updatedAt).toLocaleString()}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
