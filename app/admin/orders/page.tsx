'use client';

import React, { useState, useEffect } from 'react';
import { AdminLayout, AdminTabInfo } from '@/components/AdminLayout';
import { OrderManagementDashboard } from '@/components/OrderManagementDashboard';
import { Order, OrderAnalytics } from '@/lib/order-management';
import { exportSettings } from '@/lib/export-settings';
import { ExportSettingsModal } from '@/components/ExportSettingsModal';

export default function OrdersPage() {
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
  const [dataError, setDataError] = useState<string>('');
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setDataError('');
      
      // Simulate API call - replace with actual API
      const mockOrders: Order[] = [
        {
          id: 'ORD-001',
          orderNumber: 'DS-2025-001',
          customerEmail: 'customer@example.com',
          customerName: 'First Customer',
          status: 'delivered',
          totalAmount: 24.99,
          currency: 'USD',
          items: [
            {
              productId: 'A-02',
              title: 'First & Light - Paperback',
              quantity: 1,
              price: 6.99,
              image: '/product-images/1a_first-light-PaperBack.jpg'
            }
          ],
          shippingAddress: {
            name: 'First Customer',
            address1: '123 Main Street',
            city: 'Anytown',
            state: 'CA',
            zip: '90210',
            country: 'United States'
          },
          paymentMethod: 'Credit Card',
          paymentStatus: 'paid',
          fulfillmentStatus: 'fulfilled',
          createdAt: new Date(),
          updatedAt: new Date(),
          notes: 'First successful sale!',
          trackingNumber: 'TRK123456789',
          estimatedDelivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString()
        }
      ];
      
      setOrders(mockOrders);
      
      // Calculate analytics
      const analytics: OrderAnalytics = {
        totalOrders: mockOrders.length,
        ordersByStatus: {
          pending: 0,
          processing: 0,
          shipped: 0,
          delivered: 1,
          cancelled: 0,
          error: 0,
          retry: 0,
          refunded: 0
        },
        averageOrderValue: mockOrders.length > 0 ? mockOrders.reduce((sum, order) => sum + order.totalAmount, 0) / mockOrders.length : 0,
        totalRevenue: mockOrders.reduce((sum, order) => sum + order.totalAmount, 0),
        errorRate: 0,
        fulfillmentTime: 2 // 2 days average
      };
      
      setAnalytics(analytics);
    } catch (error) {
      setDataError(error instanceof Error ? error.message : 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleRefresh = () => {
    fetchOrders();
  };

  if (loading) {
    return (
      <AdminLayout currentPage="orders">
        <AdminTabInfo tabId="orders" />
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading orders...</p>
        </div>
      </AdminLayout>
    );
  }

  if (dataError) {
    return (
      <AdminLayout currentPage="orders">
        <AdminTabInfo tabId="orders" />
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
      </AdminLayout>
    );
  }

  return (
    <AdminLayout currentPage="orders">
      <AdminTabInfo tabId="orders" />
      
      <OrderManagementDashboard 
        orders={orders}
        analytics={analytics}
        onRefresh={handleRefresh}
      />
      
      <ExportSettingsModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        onSave={() => {
          setIsExportModalOpen(false);
          // Refresh the page to show updated settings
          window.location.reload();
        }}
      />
    </AdminLayout>
  );
}
