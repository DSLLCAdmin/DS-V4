'use client';

import React, { useState, useEffect } from 'react';
import { Customer, CustomerSegment, CustomerInteraction } from '@/lib/customer-data';

interface CustomerAnalyticsDashboardProps {
  customers: Customer[];
  segments: CustomerSegment[];
  interactions: CustomerInteraction[];
  onRefresh: () => void;
}

export function CustomerAnalyticsDashboard({ 
  customers, 
  segments, 
  interactions, 
  onRefresh 
}: CustomerAnalyticsDashboardProps) {
  const [selectedSegment, setSelectedSegment] = useState<string>('all');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | 'all'>('30d');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Calculate analytics
  const analytics = {
    totalCustomers: customers.length,
    newCustomers: customers.filter(c => c.segmentation.customerType === 'new').length,
    returningCustomers: customers.filter(c => c.segmentation.customerType === 'returning').length,
    vipCustomers: customers.filter(c => c.segmentation.customerType === 'vip').length,
    atRiskCustomers: customers.filter(c => c.segmentation.customerType === 'at-risk').length,
    averageLifetimeValue: customers.length > 0 
      ? customers.reduce((sum, c) => sum + c.segmentation.lifetimeValue, 0) / customers.length 
      : 0,
    totalRevenue: customers.reduce((sum, c) => sum + c.behavior.totalSpent, 0),
    averageEngagementScore: customers.length > 0
      ? customers.reduce((sum, c) => sum + c.segmentation.engagementScore, 0) / customers.length
      : 0
  };

  // Filter customers by segment
  const filteredCustomers = selectedSegment === 'all' 
    ? customers 
    : customers.filter(customer => {
        const segment = segments.find(s => s.id === selectedSegment);
        return segment && customerMatchesSegment(customer, segment);
      });

  // Filter interactions by time range
  const filteredInteractions = interactions.filter(interaction => {
    const daysAgo = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : timeRange === '90d' ? 90 : Infinity;
    const cutoffDate = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);
    return interaction.timestamp >= cutoffDate;
  });

  // Calculate top categories
  const topCategories = customers.reduce((acc, customer) => {
    customer.behavior.favoriteCategories.forEach(category => {
      acc[category] = (acc[category] || 0) + 1;
    });
    return acc;
  }, {} as Record<string, number>);

  const topCategoriesArray = Object.entries(topCategories)
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  // Calculate interaction types
  const interactionTypes = filteredInteractions.reduce((acc, interaction) => {
    acc[interaction.type] = (acc[interaction.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const customerTypeColors = {
    new: 'bg-blue-100 text-blue-800',
    returning: 'bg-green-100 text-green-800',
    vip: 'bg-purple-100 text-purple-800',
    'at-risk': 'bg-red-100 text-red-800'
  };

  const interactionTypeColors = {
    page_view: 'bg-blue-100 text-blue-800',
    product_view: 'bg-indigo-100 text-indigo-800',
    cart_add: 'bg-green-100 text-green-800',
    cart_abandon: 'bg-yellow-100 text-yellow-800',
    purchase: 'bg-purple-100 text-purple-800',
    email_open: 'bg-pink-100 text-pink-800',
    email_click: 'bg-red-100 text-red-800',
    newsletter_signup: 'bg-teal-100 text-teal-800',
    contact_form: 'bg-gray-100 text-gray-800'
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Customer Analytics Dashboard</h2>
        <button
          onClick={() => {
            setIsRefreshing(true);
            onRefresh();
            setTimeout(() => setIsRefreshing(false), 1000);
          }}
          disabled={isRefreshing}
          className={`px-4 py-2 rounded-lg transition-colors ${
            isRefreshing 
              ? 'bg-gray-400 text-white cursor-not-allowed' 
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {isRefreshing ? '🔄 Refreshing...' : '🔄 Refresh'}
        </button>
      </div>

      {/* Analytics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="text-sm font-medium text-blue-600">Total Customers</div>
          <div className="text-2xl font-bold text-blue-900">{analytics.totalCustomers}</div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="text-sm font-medium text-green-600">Total Revenue</div>
          <div className="text-2xl font-bold text-green-900">${analytics.totalRevenue.toFixed(2)}</div>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="text-sm font-medium text-purple-600">Avg Lifetime Value</div>
          <div className="text-2xl font-bold text-purple-900">${analytics.averageLifetimeValue.toFixed(2)}</div>
        </div>
        <div className="bg-orange-50 p-4 rounded-lg">
          <div className="text-sm font-medium text-orange-600">Avg Engagement</div>
          <div className="text-2xl font-bold text-orange-900">{analytics.averageEngagementScore.toFixed(1)}</div>
        </div>
      </div>

      {/* Customer Type Breakdown */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 p-3 rounded-lg text-center">
          <div className="text-lg font-bold text-blue-900">{analytics.newCustomers}</div>
          <div className="text-sm text-blue-600">New Customers</div>
        </div>
        <div className="bg-green-50 p-3 rounded-lg text-center">
          <div className="text-lg font-bold text-green-900">{analytics.returningCustomers}</div>
          <div className="text-sm text-green-600">Returning</div>
        </div>
        <div className="bg-purple-50 p-3 rounded-lg text-center">
          <div className="text-lg font-bold text-purple-900">{analytics.vipCustomers}</div>
          <div className="text-sm text-purple-600">VIP Customers</div>
        </div>
        <div className="bg-red-50 p-3 rounded-lg text-center">
          <div className="text-lg font-bold text-red-900">{analytics.atRiskCustomers}</div>
          <div className="text-sm text-red-600">At Risk</div>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-wrap gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Segment Filter</label>
          <select
            value={selectedSegment}
            onChange={(e) => setSelectedSegment(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Customers ({customers.length})</option>
            {segments.map(segment => (
              <option key={segment.id} value={segment.id}>
                {segment.name} ({segment.customerCount})
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Time Range</label>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="all">All time</option>
          </select>
        </div>
      </div>

      {/* Top Categories */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Categories</h3>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {topCategoriesArray.map(({ category, count }) => (
            <div key={category} className="bg-gray-50 p-3 rounded-lg text-center">
              <div className="text-lg font-bold text-gray-900">{count}</div>
              <div className="text-sm text-gray-600">{category}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Interaction Types */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Interactions ({filteredInteractions.length})</h3>
        <div className="flex flex-wrap gap-2">
          {Object.entries(interactionTypes).map(([type, count]) => (
            <span
              key={type}
              className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${interactionTypeColors[type as keyof typeof interactionTypeColors] || 'bg-gray-100 text-gray-800'}`}
            >
              {type.replace('_', ' ')} ({count})
            </span>
          ))}
        </div>
      </div>

      {/* Customers Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Customer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Orders
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Lifetime Value
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Engagement
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Last Activity
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredCustomers.map((customer) => (
              <tr key={customer.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="font-medium text-gray-900">{customer.firstName} {customer.lastName}</div>
                    <div className="text-gray-400">{customer.email}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${customerTypeColors[customer.segmentation.customerType]}`}>
                    {customer.segmentation.customerType}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {customer.behavior.totalOrders}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  ${customer.segmentation.lifetimeValue.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {customer.segmentation.engagementScore.toFixed(1)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(customer.segmentation.lastActivity).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => setSelectedCustomer(customer)}
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

      {/* Customer Details Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">Customer Details: {selectedCustomer.firstName} {selectedCustomer.lastName}</h3>
              <button
                onClick={() => setSelectedCustomer(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              {/* Basic Info */}
              <div>
                <h4 className="font-semibold text-gray-900">Contact Information</h4>
                <div className="mt-2 text-sm text-gray-600">
                  <div><strong>Email:</strong> {selectedCustomer.email}</div>
                  <div><strong>Phone:</strong> {selectedCustomer.phone || 'Not provided'}</div>
                  <div><strong>Address:</strong> {selectedCustomer.address.street}, {selectedCustomer.address.city}, {selectedCustomer.address.state} {selectedCustomer.address.zipCode}</div>
                </div>
              </div>

              {/* Behavior */}
              <div>
                <h4 className="font-semibold text-gray-900">Behavior</h4>
                <div className="mt-2 grid grid-cols-2 gap-4 text-sm">
                  <div><strong>Total Orders:</strong> {selectedCustomer.behavior.totalOrders}</div>
                  <div><strong>Total Spent:</strong> ${selectedCustomer.behavior.totalSpent.toFixed(2)}</div>
                  <div><strong>Avg Order Value:</strong> ${selectedCustomer.behavior.averageOrderValue.toFixed(2)}</div>
                  <div><strong>Page Views:</strong> {selectedCustomer.behavior.pageViews}</div>
                  <div><strong>Abandoned Carts:</strong> {selectedCustomer.behavior.abandonedCarts}</div>
                  <div><strong>Favorite Categories:</strong> {selectedCustomer.behavior.favoriteCategories.join(', ')}</div>
                </div>
              </div>

              {/* Segmentation */}
              <div>
                <h4 className="font-semibold text-gray-900">Segmentation</h4>
                <div className="mt-2 text-sm text-gray-600">
                  <div><strong>Customer Type:</strong> {selectedCustomer.segmentation.customerType}</div>
                  <div><strong>Lifetime Value:</strong> ${selectedCustomer.segmentation.lifetimeValue.toFixed(2)}</div>
                  <div><strong>Engagement Score:</strong> {selectedCustomer.segmentation.engagementScore.toFixed(1)}</div>
                  <div><strong>Last Activity:</strong> {new Date(selectedCustomer.segmentation.lastActivity).toLocaleString()}</div>
                </div>
              </div>

              {/* Preferences */}
              <div>
                <h4 className="font-semibold text-gray-900">Preferences</h4>
                <div className="mt-2 text-sm text-gray-600">
                  <div><strong>Newsletter:</strong> {selectedCustomer.preferences.newsletter ? 'Yes' : 'No'}</div>
                  <div><strong>SMS Updates:</strong> {selectedCustomer.preferences.smsUpdates ? 'Yes' : 'No'}</div>
                  <div><strong>Product Alerts:</strong> {selectedCustomer.preferences.productAlerts ? 'Yes' : 'No'}</div>
                  <div><strong>Marketing Emails:</strong> {selectedCustomer.preferences.marketingEmails ? 'Yes' : 'No'}</div>
                </div>
              </div>

              {/* Source */}
              <div>
                <h4 className="font-semibold text-gray-900">Source</h4>
                <div className="mt-2 text-sm text-gray-600">
                  <div><strong>How they found us:</strong> {selectedCustomer.source}</div>
                  <div><strong>Customer since:</strong> {new Date(selectedCustomer.createdAt).toLocaleDateString()}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Helper function to check if customer matches segment
function customerMatchesSegment(customer: Customer, segment: CustomerSegment): boolean {
  const { criteria } = segment;
  
  if (criteria.minOrders && customer.behavior.totalOrders < criteria.minOrders) return false;
  if (criteria.maxOrders && customer.behavior.totalOrders > criteria.maxOrders) return false;
  if (criteria.minSpent && customer.segmentation.lifetimeValue < criteria.minSpent) return false;
  if (criteria.maxSpent && customer.segmentation.lifetimeValue > criteria.maxSpent) return false;
  if (criteria.categories && !criteria.categories.some(cat => customer.behavior.favoriteCategories.includes(cat))) return false;
  if (criteria.customerType && !criteria.customerType.includes(customer.segmentation.customerType)) return false;
  
  if (criteria.lastActivityDays) {
    const daysSinceActivity = (Date.now() - customer.segmentation.lastActivity.getTime()) / (1000 * 60 * 60 * 24);
    if (daysSinceActivity > criteria.lastActivityDays) return false;
  }
  
  return true;
}
