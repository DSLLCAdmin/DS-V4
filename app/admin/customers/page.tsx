'use client';

import React, { useState, useEffect } from 'react';
import { AdminLayout, AdminTabInfo } from '@/components/AdminLayout';
import { CustomerAnalyticsDashboard } from '@/components/CustomerAnalyticsDashboard';
import { Customer, CustomerSegment, CustomerInteraction } from '@/lib/customer-data';
import { exportSettings } from '@/lib/export-settings';
import { ExportSettingsModal } from '@/components/ExportSettingsModal';

// CSV Export Functions
function generateCustomersCSV(customers: Customer[]): string {
  const headers = [
    'Customer ID',
    'Email',
    'First Name',
    'Last Name',
    'Phone',
    'Address',
    'Customer Type',
    'Total Orders',
    'Total Spent',
    'Average Order Value',
    'Lifetime Value',
    'Engagement Score',
    'Last Activity',
    'Newsletter',
    'SMS Updates',
    'Product Alerts',
    'Marketing Emails',
    'Source',
    'Created Date'
  ];

  const rows = customers.map(customer => [
    customer.id,
    customer.email,
    customer.firstName,
    customer.lastName,
    customer.phone || '',
    `${customer.address.street}, ${customer.address.city}, ${customer.address.state} ${customer.address.zipCode}`,
    customer.segmentation.customerType,
    customer.behavior.totalOrders.toString(),
    customer.behavior.totalSpent.toString(),
    customer.behavior.averageOrderValue.toString(),
    customer.segmentation.lifetimeValue.toString(),
    customer.segmentation.engagementScore.toString(),
    customer.segmentation.lastActivity.toISOString(),
    customer.preferences.newsletter ? 'Yes' : 'No',
    customer.preferences.smsUpdates ? 'Yes' : 'No',
    customer.preferences.productAlerts ? 'Yes' : 'No',
    customer.preferences.marketingEmails ? 'Yes' : 'No',
    customer.source,
    customer.createdAt.toISOString()
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

export default function CustomersAdminPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [segments, setSegments] = useState<CustomerSegment[]>([]);
  const [interactions, setInteractions] = useState<CustomerInteraction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showExportSettings, setShowExportSettings] = useState(false);

  const fetchCustomerData = async () => {
    try {
      setLoading(true);
      setError('');

      // TODO: Replace with actual API call when backend is ready
      // For now, we'll start with empty data - no dummy customers
      const sampleCustomers: Customer[] = [];

      const sampleSegments: CustomerSegment[] = [
        {
          id: 'segment-1',
          name: 'High Value Customers',
          description: 'Customers with lifetime value over $100',
          criteria: {
            minSpent: 100
          },
          customerCount: 1,
          createdAt: new Date()
        },
        {
          id: 'segment-2',
          name: 'Frequent Buyers',
          description: 'Customers with 3+ orders',
          criteria: {
            minOrders: 3
          },
          customerCount: 2,
          createdAt: new Date()
        },
        {
          id: 'segment-3',
          name: 'At Risk Customers',
          description: 'Customers who haven\'t ordered in 60+ days',
          criteria: {
            lastActivityDays: 60
          },
          customerCount: 1,
          createdAt: new Date()
        }
      ];

      const sampleInteractions: CustomerInteraction[] = [
        {
          id: 'interaction-1',
          customerId: 'customer-1',
          type: 'page_view',
          data: { page: '/shop', sessionId: 'session-1' },
          timestamp: new Date('2024-01-17T14:20:00Z'),
          sessionId: 'session-1'
        },
        {
          id: 'interaction-2',
          customerId: 'customer-1',
          type: 'product_view',
          data: { productId: 'book-1', sessionId: 'session-1' },
          timestamp: new Date('2024-01-17T14:25:00Z'),
          sessionId: 'session-1'
        },
        {
          id: 'interaction-3',
          customerId: 'customer-1',
          type: 'cart_add',
          data: { productId: 'book-1', quantity: 1, sessionId: 'session-1' },
          timestamp: new Date('2024-01-17T14:30:00Z'),
          sessionId: 'session-1'
        },
        {
          id: 'interaction-4',
          customerId: 'customer-1',
          type: 'purchase',
          data: { orderId: '1001', total: 18.99, sessionId: 'session-1' },
          timestamp: new Date('2024-01-17T14:35:00Z'),
          sessionId: 'session-1'
        },
        {
          id: 'interaction-5',
          customerId: 'customer-2',
          type: 'newsletter_signup',
          data: { email: 'jane.smith@example.com' },
          timestamp: new Date('2024-01-16T15:45:00Z'),
          sessionId: 'session-2'
        },
        {
          id: 'interaction-6',
          customerId: 'customer-3',
          type: 'cart_abandon',
          data: { productId: 'book-2', quantity: 1, sessionId: 'session-3' },
          timestamp: new Date('2024-01-10T09:15:00Z'),
          sessionId: 'session-3'
        }
      ];

      setCustomers(sampleCustomers);
      setSegments(sampleSegments);
      setInteractions(sampleInteractions);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch customer data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomerData();
  }, []);

  if (loading) {
    return (
      <AdminLayout currentPage="customers">
        <AdminTabInfo tabId="customers" />
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading customer data...</p>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout currentPage="customers">
        <AdminTabInfo tabId="customers" />
        <div className="text-center">
          <div className="text-red-600 text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Customer Data</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchCustomerData}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout currentPage="customers">
      <AdminTabInfo tabId="customers" />

      <CustomerAnalyticsDashboard
        customers={customers}
        segments={segments}
        interactions={interactions}
        onRefresh={fetchCustomerData}
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
          <p><strong>Current Export Path:</strong> {exportSettings.getExportPath('customers')}</p>
          <p><strong>Filename Format:</strong> {exportSettings.generateFilename('customers')}</p>
        </div>
      </div>

      {/* Additional Actions */}
      <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => {
              // Export customers to CSV
              const csvContent = generateCustomersCSV(customers);
              downloadCSV(csvContent, 'customers-export.csv', 'customers');
            }}
            className="p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
          >
            <div className="text-blue-600 text-2xl mb-2">📊</div>
            <div className="font-medium text-blue-900">Export Customer Data</div>
            <div className="text-sm text-blue-600">CSV download</div>
          </button>
          
          <button
            onClick={() => {
              // TODO: Implement segment creation
              console.log('Creating new segment...');
            }}
            className="p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
          >
            <div className="text-green-600 text-2xl mb-2">🎯</div>
            <div className="font-medium text-green-900">Create Segment</div>
            <div className="text-sm text-green-600">Target customers</div>
          </button>
          
          <button
            onClick={() => {
              // TODO: Implement marketing campaign
              console.log('Creating marketing campaign...');
            }}
            className="p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
          >
            <div className="text-purple-600 text-2xl mb-2">📧</div>
            <div className="font-medium text-purple-900">Marketing Campaign</div>
            <div className="text-sm text-purple-600">Email/SMS campaign</div>
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
