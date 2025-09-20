'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { 
  ShoppingCart, 
  Users, 
  Package, 
  Search, 
  Upload, 
  Cloud,
  Lock,
  Unlock,
  BarChart3,
  Settings,
  Shield
} from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
  currentPage: string;
}

interface AdminTab {
  id: string;
  name: string;
  icon: React.ReactNode;
  path: string;
  description: string;
  services: string[];
}

const ADMIN_TABS: AdminTab[] = [
  {
    id: 'overview',
    name: 'Overview',
    icon: <BarChart3 className="w-4 h-4" />,
    path: '/admin',
    description: 'Dashboard overview and system status',
    services: ['System Health', 'Quick Stats', 'Recent Activity']
  },
  {
    id: 'orders',
    name: 'Orders',
    icon: <ShoppingCart className="w-4 h-4" />,
    path: '/admin/orders',
    description: 'Order management and fulfillment tracking',
    services: ['Order Processing', 'Fulfillment Status', 'Customer Communication']
  },
  {
    id: 'customers',
    name: 'Customers',
    icon: <Users className="w-4 h-4" />,
    path: '/admin/customers',
    description: 'Customer data and analytics',
    services: ['Customer Profiles', 'Purchase History', 'Analytics']
  },
  {
    id: 'products',
    name: 'Products',
    icon: <Package className="w-4 h-4" />,
    path: '/admin/products',
    description: 'Product catalog and synchronization',
    services: ['Product Catalog', 'Inventory Management', 'Sync Status']
  },
  {
    id: 'lookup',
    name: 'Lookup',
    icon: <Search className="w-4 h-4" />,
    path: '/admin/lookup',
    description: 'Master product lookup and mapping',
    services: ['Product Mapping', 'ID Management', 'Cross-Platform Sync']
  },
  {
    id: 'import',
    name: 'Import',
    icon: <Upload className="w-4 h-4" />,
    path: '/admin/import',
    description: 'Product import and export management',
    services: ['Shopify Import', 'Data Migration', 'Export Tools']
  },
  {
    id: 'shopify',
    name: 'Shopify',
    icon: <Cloud className="w-4 h-4" />,
    path: '/admin/shopify',
    description: 'Shopify integration and management',
    services: ['Shopify Store', 'API Integration', 'Webhook Management']
  },
  {
    id: 'credentials',
    name: 'Credentials',
    icon: <Shield className="w-4 h-4" />,
    path: '/admin/credentials',
    description: 'Secure storage for business credentials and API keys',
    services: ['API Keys', 'Account Numbers', 'Service Credentials']
  }
];

export function AdminLayout({ children, currentPage }: AdminLayoutProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pin, setPin] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Check if user is already authenticated
    const authStatus = localStorage.getItem('admin-authenticated');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple PIN authentication (you can change this PIN)
    if (pin === 'DS24') {
      setIsAuthenticated(true);
      localStorage.setItem('admin-authenticated', 'true');
      setPin('');
    } else {
      alert('Invalid PIN');
      setPin('');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('admin-authenticated');
    router.push('/admin');
  };

  const handleTabClick = (path: string) => {
    router.push(path);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full mx-4">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
              <Lock className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Admin Access</h1>
            <p className="text-gray-600">Enter PIN to access admin dashboard</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="pin" className="block text-sm font-medium text-gray-700 mb-1">
                PIN
              </label>
              <input
                type="password"
                id="pin"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter 4-digit PIN"
                maxLength={4}
                required
              />
            </div>
            
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Access Dashboard
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              DarkStreet LLC Admin Portal
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">DarkStreet Admin</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={handleLogout}
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
              >
                <Unlock className="w-4 h-4 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8 overflow-x-auto">
            {ADMIN_TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.path)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                  pathname === tab.path
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.icon}
                <span>{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </div>
    </div>
  );
}

export function AdminTabInfo({ tabId }: { tabId: string }) {
  const tab = ADMIN_TABS.find(t => t.id === tabId);
  
  if (!tab) return null;

  return (
    <div className="mb-8">
      <div className="flex items-center mb-4">
        {tab.icon}
        <h1 className="text-3xl font-bold text-gray-900 ml-3">{tab.name}</h1>
      </div>
      <p className="text-gray-600 mb-4">{tab.description}</p>
      <div className="flex flex-wrap gap-2">
        {tab.services.map((service, index) => (
          <span
            key={index}
            className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
          >
            {service}
          </span>
        ))}
      </div>
    </div>
  );
}
