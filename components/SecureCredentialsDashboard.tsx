'use client';

import React, { useState, useEffect } from 'react';
import { 
  Shield,
  Plus,
  Edit3,
  Trash2,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  Lock,
  Key,
  Database,
  Copy,
  CreditCard,
  Cloud,
  Mail
} from 'lucide-react';

interface Credential {
  id: string;
  name: string;
  type: 'stripe' | 'shopify' | 'email' | 'database' | 'other';
  environment: 'test' | 'live';
  encrypted: boolean;
  lastUsed?: Date;
}

export default function SecureCredentialsDashboard() {
  const [credentials, setCredentials] = useState<Credential[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCredential, setEditingCredential] = useState<Credential | null>(null);

  useEffect(() => {
    // Mock credentials data
    const mockCredentials: Credential[] = [
      {
        id: '1',
        name: 'Stripe Live Secret Key',
        type: 'stripe',
        environment: 'live',
        encrypted: true,
        lastUsed: new Date(Date.now() - 24 * 60 * 60 * 1000)
      },
      {
        id: '2', 
        name: 'Shopify Admin API Access',
        type: 'shopify',
        environment: 'live',
        encrypted: true,
        lastUsed: new Date(Date.now() - 2 * 60 * 60 * 1000)
      },
      {
        id: '3',
        name: 'Email Setup',
        type: 'email',
        environment: 'live',
        encrypted: false,
        lastUsed: new Date(Date.now() - 15 * 60 * 1000)
      },
      {
        id: '4',
        name: 'Database Connection',
        type: 'database',
        environment: 'live',
        encrypted: true,
        lastUsed: new Date(Date.now() - 5 * 60 * 1000)
      }
    ];

    setCredentials(mockCredentials);
    setIsLoading(false);
  }, []);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'stripe':
        return <CreditCard className="h-4 w-4 text-blue-600" />;
      case 'shopify':
        return <Cloud className="h-4 w-4 text-green-600" />;
      case 'email':
        return <Mail className="h-4 w-4 text-orange-600" />;
      case 'database':
        return <Database className="h-4 w-4 text-purple-600" />;
      default:
        return <Key className="h-4 w-4 text-gray-600" />;
    }
  };

  const getEnvironmentBadge = (env: string) => {
    return env === 'live' 
      ? 'bg-red-100 text-red-800'
      : 'bg-yellow-100 text-yellow-800';
  };

  const copyCredentialValue = (credential: Credential) => {
    // Mock copy functionality
    console.log(`Copying ${credential.name}`);
    alert(`Copied ${credential.name} value`);
  };

  const addCredential = () => {
    const newCredential: Credential = {
      id: (credentials.length + 1).toString(),
      name: 'New Credential',
      type: 'other',
      environment: 'test',
      encrypted: false
    };
    setCredentials(prev => [...prev, newCredential]);
    setShowAddModal(false);
  };

  const deleteCredential = (id: string) => {
    setCredentials(prev =>
      prev
        .filter(c => c.id !== id)
        .map((c, index) => ({
          ...c,
          id: (index + 1).toString()
        }))
    );
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
          <h2 className="text-2xl font-bold text-gray-900">Secure Credentials Management</h2>
          <p className="text-gray-600">Manage encrypted API keys and service credentials</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Add Credential</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="bg-blue-100 p-3 rounded-full">
              <Shield className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Credentials</p>
              <p className="text-2xl font-bold text-gray-900">{credentials.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="bg-green-100 p-3 rounded-full">
              <Lock className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Encrypted</p>
              <p className="text-2xl font-bold text-gray-900">
                {credentials.filter(c => c.encrypted).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="bg-red-100 p-3 rounded-full">
              <AlertCircle className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Live Environment</p>
              <p className="text-2xl font-bold text-gray-900">
                {credentials.filter(c => c.environment === 'live').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="bg-orange-100 p-3 rounded-full">
              <CheckCircle className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Recently Used</p>
              <p className="text-2xl font-bold text-gray-900">
                {credentials.filter(c => c.lastUsed && new Date().getTime() - c.lastUsed.getTime() < 24 * 60 * 60 * 1000).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Credentials List */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Stored Credentials</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {credentials.map((cred) => (
            <div key={cred.id} className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {getTypeIcon(cred.type)}
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">{cred.name}</h4>
                    <p className="text-sm text-gray-500">
                      {cred.type.charAt(0).toUpperCase() + cred.type.slice(1)} Credential
                      {cred.lastUsed && ` • Last used ${cred.lastUsed.toLocaleDateString()}`}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getEnvironmentBadge(cred.environment)}`}>
                    {cred.environment}
                  </span>
                  
                  {cred.encrypted && (
                    <span className="flex items-center text-green-600">
                      <Lock className="h-4 w-4 mr-1" />
                      Encrypted
                    </span>
                  )}
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => copyCredentialValue(cred)}
                      className="text-gray-400 hover:text-gray-600"
                      title="Copy Value"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setEditingCredential(cred)}
                      className="text-gray-400 hover:text-blue-600"
                      title="Edit"
                    >
                      <Edit3 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => deleteCredential(cred.id)}
                      className="text-gray-400 hover:text-red-600"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Modal Placeholder */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Credential</h3>
            <p className="text-gray-600 mb-4">Add credential functionality would be implemented here.</p>
            <div className="flex space-x-3">
              <button
                onClick={addCredential}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
              >
                Add Credential
              </button>
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}