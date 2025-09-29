'use client';

import React, { useState, useEffect } from 'react';
import { 
  CreditCard,
  DollarSign,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  RefreshCw,
  Shield,
  Link,
  Settings
} from 'lucide-react';

interface PaymentTransaction {
  id: string;
  amount: number;
  currency: string;
  status: 'succeeded' | 'pending' | 'failed' | 'canceled';
  description: string;
  created: Date;
  customer?: string;
}

interface StripeConfig {
  secretKey: string;
  publishableKey: string;
  webhookSecret: string;
  accountId: string;
  environment: 'test' | 'live';
  currency: string;
  country: string;
}

export default function StripePaymentDashboard() {
  const [config, setConfig] = useState<StripeConfig>({
    secretKey: process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY || '',
    publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '',
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || '',
    accountId: process.env.STRIPE_ACCOUNT_ID || '',
    environment: 'test',
    currency: 'USD',
    country: 'US'
  });

  const [transactions, setTransactions] = useState<PaymentTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [balance, setBalance] = useState({ available: 0, pending: 0 });

  useEffect(() => {
    // Mock data initialization
    const mockTransactions: PaymentTransaction[] = [
      {
        id: 'pi_123456789',
        amount: 29.99,
        currency: 'usd',
        status: 'succeeded',
        description: 'Dark Street eBook Purchase',
        created: new Date(Date.now() - 2 * 60 * 60 * 1000),
        customer: 'customer_123'
      },
      {
        id: 'pi_987654321',
        amount: 15.99,
        currency: 'usd',
        status: 'succeeded',
        description: 'Shipping & Handling',
        created: new Date(Date.now() - 5 * 60 * 60 * 1000),
        customer: 'customer_456'
      },
      {
        id: 'pi_456789123',
        amount: 19.99,
        currency: 'usd',
        status: 'pending',
        description: 'New eBook Release',
        created: new Date(Date.now() - 30 * 60 * 1000),
        customer: 'customer_789'
      }
    ];

    setTransactions(mockTransactions);
    setBalance({ available: 1250.75, pending: 89.32 });
    setIsLoading(false);
  }, []);

  const updateConfig = (newConfig: Partial<StripeConfig>) => {
    setConfig(prev => ({ ...prev, ...newConfig }));
  };

  const refreshTransactions = async () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'succeeded':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'failed':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'canceled':
        return <AlertCircle className="h-5 w-5 text-gray-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const formatAmount = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(amount);
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
          <h2 className="text-2xl font-bold text-gray-900">Stripe Payment Management</h2>
          <p className="text-gray-600">Process payments and manage Stripe integration</p>
        </div>
        <button
          onClick={refreshTransactions}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <RefreshCw className="h-4 w-4" />
          <span>Refresh</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="bg-green-100 p-3 rounded-full">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Available Balance</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatAmount(balance.available, config.currency)}
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
              <p className="text-sm font-medium text-gray-600">Pending Balance</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatAmount(balance.pending, config.currency)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="bg-blue-100 p-3 rounded-full">
              <TrendingUp className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Transactions</p>
              <p className="text-2xl font-bold text-gray-900">{transactions.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Configuration */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Stripe Configuration</h3>
        </div>
        <div className="px-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Environment
              </label>
              <select
                value={config.environment}
                onChange={(e) => updateConfig({ environment: e.target.value as 'test' | 'live' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="test">Test</option>
                <option value="live">Live</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Currency
              </label>
              <select
                value={config.currency}
                onChange={(e) => updateConfig({ currency: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="USD">USD</option>
                <option value="CAD">CAD</option>
                <option value="EUR">EUR</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Account ID
              </label>
              <input
                type="text"
                value={config.accountId}
                onChange={(e) => updateConfig({ accountId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="acct_..."
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Country
              </label>
              <select
                value={config.country}
                onChange={(e) => updateConfig({ country: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="US">United States</option>
                <option value="CA">Canada</option>
                <option value="GB">United Kingdom</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Recent Transactions</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {transactions.map((transaction) => (
            <div key={transaction.id} className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="bg-gray-100 p-2 rounded-lg">
                    <CreditCard className="h-5 w-5 text-gray-600" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">{transaction.description}</h4>
                    <p className="text-sm text-gray-500">
                      {transaction.id} • {transaction.created.toLocaleDateString()}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <span className="text-sm font-medium text-gray-900">
                    {formatAmount(transaction.amount, transaction.currency)}
                  </span>
                  {getStatusIcon(transaction.status)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Account Management</h3>
          <div className="space-y-3">
            <button className="w-full flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <Shield className="h-5 w-5 text-blue-600" />
              <span className="text-sm font-medium">Security Settings</span>
            </button>
            <button className="w-full flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <Settings className="h-5 w-5 text-green-600" />
              <span className="text-sm font-medium">Payment Methods</span>
            </button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Webhooks & Integration</h3>
          <div className="space-y-3">
            <button className="w-full flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <Link className="h-5 w-5 text-purple-600" />
              <span className="text-sm font-medium">Configure Webhooks</span>
            </button>
            <button className="w-full flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <CreditCard className="h-5 w-5 text-orange-600" />
              <span className="text-sm font-medium">Test Payments</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
