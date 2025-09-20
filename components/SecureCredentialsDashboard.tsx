'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Shield, 
  Eye, 
  EyeOff, 
  Plus, 
  Edit, 
  Trash2, 
  Download,
  Search,
  Lock,
  Unlock,
  AlertTriangle,
  CheckCircle,
  Clock,
  User,
  Tag,
  FileText
} from 'lucide-react';
import { 
  SecureCredentialsManager, 
  BusinessCredential, 
  CredentialCategory,
  secureCredentialsManager 
} from '@/lib/secure-credentials';

interface SecureCredentialsDashboardProps {
  onRefresh: () => void;
}

export const SecureCredentialsDashboard: React.FC<SecureCredentialsDashboardProps> = ({ onRefresh }) => {
  const [credentials, setCredentials] = useState<BusinessCredential[]>([]);
  const [categories, setCategories] = useState<CredentialCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedCredential, setSelectedCredential] = useState<BusinessCredential | null>(null);
  const [showValues, setShowValues] = useState(false);
  const [newCredential, setNewCredential] = useState({
    categoryId: '',
    name: '',
    description: '',
    value: '',
    isSensitive: false,
    tags: '',
    notes: ''
  });

  useEffect(() => {
    loadCredentials();
  }, []);

  const loadCredentials = () => {
    setCredentials(secureCredentialsManager.getAllCredentials());
    setCategories(secureCredentialsManager.getCategories());
  };

  const handleAddCredential = () => {
    if (!newCredential.categoryId || !newCredential.name || !newCredential.value) return;

    const tags = newCredential.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
    
    secureCredentialsManager.addCredential({
      categoryId: newCredential.categoryId,
      name: newCredential.name,
      description: newCredential.description,
      value: newCredential.value,
      isSensitive: newCredential.isSensitive,
      tags,
      notes: newCredential.notes
    });

    loadCredentials();
    setNewCredential({
      categoryId: '',
      name: '',
      description: '',
      value: '',
      isSensitive: false,
      tags: '',
      notes: ''
    });
    setShowAddModal(false);
  };

  const handleEditCredential = () => {
    if (!selectedCredential || !newCredential.name || !newCredential.value) return;

    const tags = newCredential.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
    
    secureCredentialsManager.updateCredential(selectedCredential.id, {
      categoryId: newCredential.categoryId,
      name: newCredential.name,
      description: newCredential.description,
      value: newCredential.value,
      isSensitive: newCredential.isSensitive,
      tags,
      notes: newCredential.notes
    });

    loadCredentials();
    setShowEditModal(false);
    setSelectedCredential(null);
  };

  const handleDeleteCredential = (id: string) => {
    if (confirm('Are you sure you want to delete this credential? This action cannot be undone.')) {
      secureCredentialsManager.deleteCredential(id);
      loadCredentials();
    }
  };

  const handleViewValue = (credential: BusinessCredential) => {
    const value = secureCredentialsManager.getCredentialValue(credential.id);
    alert(`Credential Value:\n\n${value}`);
  };

  const handleExportCredentials = () => {
    const csvContent = secureCredentialsManager.exportCredentials();
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `secure-credentials-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredCredentials = credentials.filter(cred => {
    const matchesCategory = selectedCategory === 'all' || cred.categoryId === selectedCategory;
    const matchesSearch = searchQuery === '' || 
      cred.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cred.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cred.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesCategory && matchesSearch;
  });

  const getCategoryIcon = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category?.icon || '🔧';
  };

  const getCategoryColor = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category?.color || 'gray';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center">
          <Shield className="w-6 h-6 mr-3 text-red-600" />
          Secure Credentials Management
        </h2>
        <div className="flex gap-2">
          <Button
            onClick={() => setShowValues(!showValues)}
            variant="outline"
            className={showValues ? 'bg-green-50 border-green-200' : ''}
          >
            {showValues ? <Eye className="w-4 h-4 mr-2" /> : <EyeOff className="w-4 h-4 mr-2" />}
            {showValues ? 'Hide Values' : 'Show Values'}
          </Button>
          <Button
            onClick={handleExportCredentials}
            variant="outline"
          >
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
          <Button
            onClick={() => setShowAddModal(true)}
            className="bg-red-600 hover:bg-red-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Credential
          </Button>
        </div>
      </div>

      {/* Security Warning */}
      <Card className="border-red-200 bg-red-50">
        <CardContent className="pt-6">
          <div className="flex items-center">
            <AlertTriangle className="w-5 h-5 text-red-600 mr-3" />
            <div>
              <h4 className="font-medium text-red-800">Security Notice</h4>
              <p className="text-sm text-red-700">
                This page contains sensitive business credentials. Access is logged and monitored. 
                Never share these credentials with unauthorized personnel.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search credentials..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                />
              </div>
            </div>
            <div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
              >
                <option value="all">All Categories</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.icon} {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Credentials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCredentials.map((credential) => (
          <Card key={credential.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex items-center">
                  <span className="text-2xl mr-2">{getCategoryIcon(credential.categoryId)}</span>
                  <div>
                    <CardTitle className="text-lg">{credential.name}</CardTitle>
                    <p className="text-sm text-gray-600">{credential.description}</p>
                  </div>
                </div>
                <div className="flex gap-1">
                  {credential.isSensitive && (
                    <Badge variant="destructive" className="text-xs">
                      <Lock className="w-3 h-3 mr-1" />
                      Sensitive
                    </Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Category:</span>
                  <Badge variant="outline" className={`text-xs bg-${getCategoryColor(credential.categoryId)}-50`}>
                    {categories.find(cat => cat.id === credential.categoryId)?.name}
                  </Badge>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span>Value:</span>
                  <div className="flex items-center">
                    {showValues ? (
                      <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded max-w-32 truncate">
                        {credential.isEncrypted ? '[ENCRYPTED]' : credential.value}
                      </span>
                    ) : (
                      <span className="text-gray-500">••••••••</span>
                    )}
                    <Button
                      onClick={() => handleViewValue(credential)}
                      variant="ghost"
                      size="sm"
                      className="ml-2 p-1"
                    >
                      <Eye className="w-3 h-3" />
                    </Button>
                  </div>
                </div>

                <div className="flex justify-between text-sm">
                  <span>Updated:</span>
                  <span className="text-gray-600">{credential.lastUpdated.toLocaleDateString()}</span>
                </div>

                {credential.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {credential.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        <Tag className="w-3 h-3 mr-1" />
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}

                <div className="flex gap-2 pt-2">
                  <Button
                    onClick={() => {
                      setSelectedCredential(credential);
                      setNewCredential({
                        categoryId: credential.categoryId,
                        name: credential.name,
                        description: credential.description,
                        value: credential.isEncrypted ? '[ENCRYPTED]' : credential.value,
                        isSensitive: credential.isSensitive,
                        tags: credential.tags.join(', '),
                        notes: credential.notes || ''
                      });
                      setShowEditModal(true);
                    }}
                    variant="outline"
                    size="sm"
                  >
                    <Edit className="w-3 h-3 mr-1" />
                    Edit
                  </Button>
                  <Button
                    onClick={() => handleDeleteCredential(credential.id)}
                    variant="outline"
                    size="sm"
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-3 h-3 mr-1" />
                    Delete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add Credential Modal */}
      {showAddModal && (
        <Card className="fixed inset-4 z-50 bg-white shadow-2xl overflow-y-auto">
          <CardHeader>
            <CardTitle>Add New Credential</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category *
                </label>
                <select
                  value={newCredential.categoryId}
                  onChange={(e) => setNewCredential({...newCredential, categoryId: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                >
                  <option value="">Select Category</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.icon} {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name *
                </label>
                <input
                  type="text"
                  value={newCredential.name}
                  onChange={(e) => setNewCredential({...newCredential, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="e.g., Shopify API Key"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <input
                  type="text"
                  value={newCredential.description}
                  onChange={(e) => setNewCredential({...newCredential, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="Brief description of this credential"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Value *
                </label>
                <textarea
                  value={newCredential.value}
                  onChange={(e) => setNewCredential({...newCredential, value: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  rows={3}
                  placeholder="Enter the credential value..."
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isSensitive"
                  checked={newCredential.isSensitive}
                  onChange={(e) => setNewCredential({...newCredential, isSensitive: e.target.checked})}
                  className="mr-2"
                />
                <label htmlFor="isSensitive" className="text-sm font-medium text-gray-700">
                  Mark as Sensitive (will be encrypted)
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tags (comma-separated)
                </label>
                <input
                  type="text"
                  value={newCredential.tags}
                  onChange={(e) => setNewCredential({...newCredential, tags: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="api, production, shopify"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes
                </label>
                <textarea
                  value={newCredential.notes}
                  onChange={(e) => setNewCredential({...newCredential, notes: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  rows={2}
                  placeholder="Additional notes or instructions..."
                />
              </div>

              <div className="flex gap-2 pt-4">
                <Button
                  onClick={handleAddCredential}
                  disabled={!newCredential.categoryId || !newCredential.name || !newCredential.value}
                  className="bg-red-600 hover:bg-red-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Credential
                </Button>
                <Button
                  onClick={() => setShowAddModal(false)}
                  variant="outline"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Edit Credential Modal */}
      {showEditModal && selectedCredential && (
        <Card className="fixed inset-4 z-50 bg-white shadow-2xl overflow-y-auto">
          <CardHeader>
            <CardTitle>Edit Credential: {selectedCredential.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category *
                </label>
                <select
                  value={newCredential.categoryId}
                  onChange={(e) => setNewCredential({...newCredential, categoryId: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                >
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.icon} {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name *
                </label>
                <input
                  type="text"
                  value={newCredential.name}
                  onChange={(e) => setNewCredential({...newCredential, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <input
                  type="text"
                  value={newCredential.description}
                  onChange={(e) => setNewCredential({...newCredential, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Value *
                </label>
                <textarea
                  value={newCredential.value}
                  onChange={(e) => setNewCredential({...newCredential, value: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  rows={3}
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="editIsSensitive"
                  checked={newCredential.isSensitive}
                  onChange={(e) => setNewCredential({...newCredential, isSensitive: e.target.checked})}
                  className="mr-2"
                />
                <label htmlFor="editIsSensitive" className="text-sm font-medium text-gray-700">
                  Mark as Sensitive (will be encrypted)
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tags (comma-separated)
                </label>
                <input
                  type="text"
                  value={newCredential.tags}
                  onChange={(e) => setNewCredential({...newCredential, tags: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes
                </label>
                <textarea
                  value={newCredential.notes}
                  onChange={(e) => setNewCredential({...newCredential, notes: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  rows={2}
                />
              </div>

              <div className="flex gap-2 pt-4">
                <Button
                  onClick={handleEditCredential}
                  disabled={!newCredential.name || !newCredential.value}
                  className="bg-red-600 hover:bg-red-700"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
                <Button
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedCredential(null);
                  }}
                  variant="outline"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {filteredCredentials.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Shield className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Credentials Found</h3>
            <p className="text-gray-600 mb-4">
              {searchQuery || selectedCategory !== 'all' 
                ? 'No credentials match your search criteria'
                : 'Start by adding your first business credential'
              }
            </p>
            <Button
              onClick={() => setShowAddModal(true)}
              className="bg-red-600 hover:bg-red-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add First Credential
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
