'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Upload, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Download,
  RefreshCw,
  Package,
  BookOpen,
  Shirt,
  Coffee
} from 'lucide-react';
import { 
  importFirst10Products, 
  validateProductsForImport, 
  generateImportReport,
  ImportResult,
  ImportProduct,
  FIRST_10_PRODUCTS 
} from '@/lib/shopify-product-import';
import { unifiedProductCatalog } from '@/lib/unified-product-data';
import { getShopifyStatusMessage, filterProductsForShopify } from '@/lib/shopify-product-filter';

interface ProductImportDashboardProps {
  onRefresh: () => void;
}

export const ProductImportDashboard: React.FC<ProductImportDashboardProps> = ({ onRefresh }) => {
  const [isImporting, setIsImporting] = useState(false);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [validationResult, setValidationResult] = useState<{
    valid: any[];
    invalid: { product: any; reason: string }[];
  } | null>(null);

  useEffect(() => {
    // Validate products on component mount
    const dsProducts = unifiedProductCatalog.getUnifiedProducts();
    const validation = validateProductsForImport(dsProducts);
    setValidationResult(validation);
  }, []);

  const handleImport = async () => {
    setIsImporting(true);
    setImportResult(null);

    try {
      const dsProducts = unifiedProductCatalog.getUnifiedProducts();
      const result = await importFirst10Products(dsProducts);
      setImportResult(result);
    } catch (error) {
      console.error('Import failed:', error);
      setImportResult({
        totalProducts: 0,
        successfulImports: 0,
        failedImports: 0,
        skippedImports: 0,
        products: [],
        errors: [`Import failed: ${error instanceof Error ? error.message : 'Unknown error'}`]
      });
    } finally {
      setIsImporting(false);
    }
  };

  const handleDownloadReport = () => {
    if (!importResult) return;

    const report = generateImportReport(importResult);
    const blob = new Blob([report], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `shopify-import-report-${new Date().toISOString().split('T')[0]}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const getProductIcon = (category: string) => {
    switch (category) {
      case 'Serials/Books':
        return <BookOpen className="w-4 h-4" />;
      case 'Apparel & Intimate Wear':
        return <Shirt className="w-4 h-4" />;
      case 'Culinary & Novelty':
        return <Coffee className="w-4 h-4" />;
      default:
        return <Package className="w-4 h-4" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-600" />;
      case 'pending':
        return <RefreshCw className="w-4 h-4 text-blue-600 animate-spin" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-600" />;
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center">
          <Upload className="w-6 h-6 mr-3 text-blue-600" />
          Product Import to Shopify
        </h2>
        <div className="flex gap-2">
          {importResult && (
            <Button
              onClick={handleDownloadReport}
              variant="outline"
              className="flex items-center"
            >
              <Download className="w-4 h-4 mr-2" />
              Download Report
            </Button>
          )}
          <Button
            onClick={handleImport}
            disabled={isImporting}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isImporting ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Importing...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                Import First 10 Products
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Shopify Status Banner */}
      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-center">
          <AlertCircle className="w-5 h-5 text-blue-600 mr-3" />
          <div>
            <h3 className="font-semibold text-blue-900">Shopify Product Status</h3>
            <p className="text-sm text-blue-700">{getShopifyStatusMessage()}</p>
          </div>
        </div>
      </div>

      {/* Import Summary */}
      {importResult && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Package className="w-5 h-5 mr-2" />
              Import Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{importResult.totalProducts}</div>
                <div className="text-sm text-gray-600">Total Products</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{importResult.successfulImports}</div>
                <div className="text-sm text-gray-600">Successful</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{importResult.failedImports}</div>
                <div className="text-sm text-gray-600">Failed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-600">{importResult.skippedImports}</div>
                <div className="text-sm text-gray-600">Skipped</div>
              </div>
            </div>

            {importResult.errors.length > 0 && (
              <div className="mt-4 p-4 bg-red-50 rounded-lg">
                <h4 className="font-semibold text-red-800 mb-2">Errors:</h4>
                <ul className="text-sm text-red-700">
                  {importResult.errors.map((error, index) => (
                    <li key={index}>• {error}</li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Product List */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>First 10 Products to Import</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {validationResult?.valid.map((product, index) => (
              <div key={product.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  {getProductIcon(product.category)}
                  <div>
                    <div className="font-medium">{product.title}</div>
                    <div className="text-sm text-gray-600">
                      {product.category} • ${product.price} • ID: {product.id}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {importResult ? (
                    <>
                      {getStatusIcon(importResult.products[index]?.importStatus || 'pending')}
                      <Badge variant={
                        importResult.products[index]?.importStatus === 'success' ? 'default' :
                        importResult.products[index]?.importStatus === 'failed' ? 'destructive' :
                        'secondary'
                      }>
                        {importResult.products[index]?.importStatus || 'pending'}
                      </Badge>
                    </>
                  ) : (
                    <Badge variant="outline">Ready</Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Validation Issues */}
      {validationResult?.invalid && validationResult.invalid.length > 0 && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center text-red-600">
              <AlertCircle className="w-5 h-5 mr-2" />
              Validation Issues
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {validationResult.invalid.map((item, index) => (
                <div key={index} className="p-3 bg-red-50 rounded-lg">
                  <div className="font-medium text-red-800">{item.product.title}</div>
                  <div className="text-sm text-red-600">Reason: {item.reason}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Import Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>Import Instructions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm text-gray-600">
            <p><strong>Before importing:</strong></p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Ensure Shopify store is set up and connected</li>
              <li>Verify all product information is complete</li>
              <li>Check that prices and categories are correct</li>
              <li>Confirm inventory levels are accurate</li>
            </ul>
            
            <p><strong>What gets imported:</strong></p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Product titles and descriptions</li>
              <li>Pricing and inventory information</li>
              <li>Product categories and tags</li>
              <li>SKU mapping (DS Product ID → Shopify SKU)</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
