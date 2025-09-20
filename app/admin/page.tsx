'use client';

import React from 'react';
import { AdminLayout, AdminTabInfo } from '@/components/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  ShoppingCart, 
  Users, 
  Package, 
  Search, 
  Upload, 
  Cloud,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react';

export default function AdminOverviewPage() {
  return (
    <AdminLayout currentPage="overview">
      <AdminTabInfo tabId="overview" />
      
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">No orders yet</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">No customers yet</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">95</div>
            <p className="text-xs text-muted-foreground">All DS LLC products</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Shopify Status</CardTitle>
            <Cloud className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">OFF</div>
            <p className="text-xs text-muted-foreground">All products on DS LLC</p>
          </CardContent>
        </Card>
      </div>

      {/* System Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
              System Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Website</span>
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Online</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Product Catalog</span>
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Active</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Checkout System</span>
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Ready</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Shopify Integration</span>
                <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">Disabled</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-blue-600" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center text-sm text-gray-600">
                <Clock className="w-4 h-4 mr-2" />
                <span>Admin dashboard unified</span>
                <span className="ml-auto text-xs">Just now</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Clock className="w-4 h-4 mr-2" />
                <span>Shopify toggle implemented</span>
                <span className="ml-auto text-xs">Recently</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Clock className="w-4 h-4 mr-2" />
                <span>Product import system created</span>
                <span className="ml-auto text-xs">Recently</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Admin Pages Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Admin Dashboard Pages</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-center mb-2">
                <ShoppingCart className="w-5 h-5 mr-2 text-blue-600" />
                <h3 className="font-semibold">Orders</h3>
              </div>
              <p className="text-sm text-gray-600 mb-2">Order management and fulfillment tracking</p>
              <div className="flex flex-wrap gap-1">
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">Order Processing</span>
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">Fulfillment</span>
              </div>
            </div>

            <div className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-center mb-2">
                <Users className="w-5 h-5 mr-2 text-green-600" />
                <h3 className="font-semibold">Customers</h3>
              </div>
              <p className="text-sm text-gray-600 mb-2">Customer data and analytics</p>
              <div className="flex flex-wrap gap-1">
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">Profiles</span>
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">Analytics</span>
              </div>
            </div>

            <div className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-center mb-2">
                <Package className="w-5 h-5 mr-2 text-purple-600" />
                <h3 className="font-semibold">Products</h3>
              </div>
              <p className="text-sm text-gray-600 mb-2">Product catalog and synchronization</p>
              <div className="flex flex-wrap gap-1">
                <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded">Catalog</span>
                <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded">Inventory</span>
              </div>
            </div>

            <div className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-center mb-2">
                <Search className="w-5 h-5 mr-2 text-orange-600" />
                <h3 className="font-semibold">Lookup</h3>
              </div>
              <p className="text-sm text-gray-600 mb-2">Master product lookup and mapping</p>
              <div className="flex flex-wrap gap-1">
                <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded">Mapping</span>
                <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded">ID Management</span>
              </div>
            </div>

            <div className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-center mb-2">
                <Upload className="w-5 h-5 mr-2 text-indigo-600" />
                <h3 className="font-semibold">Import</h3>
              </div>
              <p className="text-sm text-gray-600 mb-2">Product import and export management</p>
              <div className="flex flex-wrap gap-1">
                <span className="px-2 py-1 bg-indigo-100 text-indigo-800 text-xs rounded">Shopify Import</span>
                <span className="px-2 py-1 bg-indigo-100 text-indigo-800 text-xs rounded">Export Tools</span>
              </div>
            </div>

            <div className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-center mb-2">
                <Cloud className="w-5 h-5 mr-2 text-cyan-600" />
                <h3 className="font-semibold">Shopify</h3>
              </div>
              <p className="text-sm text-gray-600 mb-2">Shopify integration and management</p>
              <div className="flex flex-wrap gap-1">
                <span className="px-2 py-1 bg-cyan-100 text-cyan-800 text-xs rounded">Store</span>
                <span className="px-2 py-1 bg-cyan-100 text-cyan-800 text-xs rounded">API Integration</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </AdminLayout>
  );
}
