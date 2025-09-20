'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Package, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Download,
  RefreshCw,
  BookOpen,
  Shirt,
  Coffee,
  Plus,
  FileText,
  Zap
} from 'lucide-react';
import { 
  GTINAssignmentManager, 
  GTINBatch, 
  GTINAssignment,
  gtinManager 
} from '@/lib/gtin-assignment';
import { unifiedProductCatalog } from '@/lib/unified-product-data';

interface GTINAssignmentDashboardProps {
  onRefresh: () => void;
}

export const GTINAssignmentDashboard: React.FC<GTINAssignmentDashboardProps> = ({ onRefresh }) => {
  const [batches, setBatches] = useState<GTINBatch[]>([]);
  const [selectedBatch, setSelectedBatch] = useState<GTINBatch | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCreatingBatch, setIsCreatingBatch] = useState(false);
  const [newBatchName, setNewBatchName] = useState('');
  const [newBatchDescription, setNewBatchDescription] = useState('');

  useEffect(() => {
    // Load existing batches
    setBatches(gtinManager.getBatches());
  }, []);

  const handleCreateBatch = async () => {
    if (!newBatchName.trim()) return;

    setIsCreatingBatch(true);
    try {
      // Get products that need GTIN assignment (Amazon FBA products)
      const allProducts = unifiedProductCatalog.getUnifiedProducts();
      const amazonProducts = allProducts.filter(product => 
        product.fulfillmentProvider === 'amazon_fba' && !product.gtin
      );

      const batch = gtinManager.createBatch(
        newBatchName,
        newBatchDescription,
        amazonProducts
      );

      setBatches(gtinManager.getBatches());
      setSelectedBatch(batch);
      setNewBatchName('');
      setNewBatchDescription('');
    } catch (error) {
      console.error('Failed to create batch:', error);
    } finally {
      setIsCreatingBatch(false);
    }
  };

  const handleProcessBatch = async (batchId: string) => {
    setIsProcessing(true);
    try {
      const updatedBatch = await gtinManager.processBatch(batchId);
      setBatches(gtinManager.getBatches());
      setSelectedBatch(updatedBatch);
    } catch (error) {
      console.error('Failed to process batch:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleExportBatch = (batchId: string) => {
    try {
      const csvContent = gtinManager.exportBatchToCSV(batchId);
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      
      link.setAttribute('href', url);
      link.setAttribute('download', `gtin-assignment-${batchId}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Failed to export batch:', error);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-600" />;
      case 'processing':
        return <RefreshCw className="w-4 h-4 text-blue-600 animate-spin" />;
      case 'draft':
        return <FileText className="w-4 h-4 text-gray-600" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-600" />;
    }
  };

  const getGTINTypeIcon = (type: string) => {
    switch (type) {
      case 'ISBN':
        return <BookOpen className="w-4 h-4 text-blue-600" />;
      case 'UPC':
        return <Package className="w-4 h-4 text-green-600" />;
      case 'EAN':
        return <Shirt className="w-4 h-4 text-purple-600" />;
      case 'GTIN-14':
        return <Coffee className="w-4 h-4 text-orange-600" />;
      default:
        return <Package className="w-4 h-4 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center">
          <Zap className="w-6 h-6 mr-3 text-orange-600" />
          GTIN Assignment for Amazon Compliance
        </h2>
        <Button
          onClick={() => setIsCreatingBatch(true)}
          className="bg-orange-600 hover:bg-orange-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create New Batch
        </Button>
      </div>

      {/* Create Batch Modal */}
      {isCreatingBatch && (
        <Card>
          <CardHeader>
            <CardTitle>Create GTIN Assignment Batch</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Batch Name
                </label>
                <input
                  type="text"
                  value={newBatchName}
                  onChange={(e) => setNewBatchName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="e.g., Amazon FBA Books Batch 1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={newBatchDescription}
                  onChange={(e) => setNewBatchDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  rows={3}
                  placeholder="Description of this GTIN assignment batch..."
                />
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={handleCreateBatch}
                  disabled={!newBatchName.trim() || isCreatingBatch}
                  className="bg-orange-600 hover:bg-orange-700"
                >
                  {isCreatingBatch ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4 mr-2" />
                      Create Batch
                    </>
                  )}
                </Button>
                <Button
                  onClick={() => setIsCreatingBatch(false)}
                  variant="outline"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Batches List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {batches.map((batch) => (
          <Card key={batch.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center">
                    {getStatusIcon(batch.status)}
                    <span className="ml-2">{batch.name}</span>
                  </CardTitle>
                  <p className="text-sm text-gray-600 mt-1">{batch.description}</p>
                </div>
                <Badge 
                  variant={batch.status === 'completed' ? 'default' : 
                          batch.status === 'failed' ? 'destructive' : 
                          batch.status === 'processing' ? 'secondary' : 'outline'}
                >
                  {batch.status.toUpperCase()}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Total Products:</span>
                  <span className="font-medium">{batch.totalProducts}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Successful:</span>
                  <span className="font-medium text-green-600">{batch.successfulAssignments}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Failed:</span>
                  <span className="font-medium text-red-600">{batch.failedAssignments}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Created:</span>
                  <span className="font-medium">{batch.createdAt.toLocaleDateString()}</span>
                </div>
                
                <div className="flex gap-2 pt-2">
                  <Button
                    onClick={() => setSelectedBatch(batch)}
                    variant="outline"
                    size="sm"
                  >
                    View Details
                  </Button>
                  {batch.status === 'draft' && (
                    <Button
                      onClick={() => handleProcessBatch(batch.id)}
                      disabled={isProcessing}
                      size="sm"
                      className="bg-orange-600 hover:bg-orange-700"
                    >
                      {isProcessing ? (
                        <RefreshCw className="w-4 h-4 animate-spin" />
                      ) : (
                        'Process Batch'
                      )}
                    </Button>
                  )}
                  {batch.status === 'completed' && (
                    <Button
                      onClick={() => handleExportBatch(batch.id)}
                      variant="outline"
                      size="sm"
                    >
                      <Download className="w-4 h-4 mr-1" />
                      Export CSV
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Batch Details Modal */}
      {selectedBatch && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Batch Details: {selectedBatch.name}</CardTitle>
              <Button
                onClick={() => setSelectedBatch(null)}
                variant="outline"
                size="sm"
              >
                Close
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900">{selectedBatch.totalProducts}</div>
                  <div className="text-sm text-gray-600">Total Products</div>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{selectedBatch.successfulAssignments}</div>
                  <div className="text-sm text-green-600">Successful</div>
                </div>
                <div className="text-center p-3 bg-red-50 rounded-lg">
                  <div className="text-2xl font-bold text-red-600">{selectedBatch.failedAssignments}</div>
                  <div className="text-sm text-red-600">Failed</div>
                </div>
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {selectedBatch.totalProducts > 0 ? 
                      Math.round((selectedBatch.successfulAssignments / selectedBatch.totalProducts) * 100) : 0}%
                  </div>
                  <div className="text-sm text-blue-600">Success Rate</div>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium text-gray-900">Product Assignments:</h4>
                <div className="max-h-96 overflow-y-auto">
                  {selectedBatch.assignments.map((assignment, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        {getGTINTypeIcon(assignment.gtinType)}
                        <div>
                          <div className="font-medium">{assignment.productTitle}</div>
                          <div className="text-sm text-gray-600">
                            {assignment.productId} • {assignment.category}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        {assignment.assignedGTIN && (
                          <div className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                            {assignment.assignedGTIN}
                          </div>
                        )}
                        <Badge 
                          variant={assignment.status === 'assigned' ? 'default' : 
                                  assignment.status === 'error' ? 'destructive' : 'outline'}
                          className="mt-1"
                        >
                          {assignment.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {batches.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No GTIN Assignment Batches</h3>
            <p className="text-gray-600 mb-4">
              Create your first batch to assign GTINs for Amazon FBA compliance
            </p>
            <Button
              onClick={() => setIsCreatingBatch(true)}
              className="bg-orange-600 hover:bg-orange-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create First Batch
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
