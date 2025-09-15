"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, RefreshCw, TrendingUp, Users, ShoppingCart, Search } from 'lucide-react';
import { analytics } from '@/lib/analytics';

interface ProductInterestData {
  productId: string;
  productTitle: string;
  productCategory: string;
  timestamp: string;
  userAgent: string;
  referrer: string;
}

export function AnalyticsDashboard() {
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const loadAnalytics = () => {
    setLoading(true);
    const data = analytics.getLocalAnalytics();
    setAnalyticsData(data);
    setLoading(false);
  };

  useEffect(() => {
    loadAnalytics();
  }, []);

  const exportData = () => {
    if (!analyticsData) return;
    
    const csvContent = [
      ['Product ID', 'Product Title', 'Category', 'Interest Count', 'Last Interest'],
      ...Object.entries(getProductInterestSummary()).map(([productId, data]: [string, any]) => [
        productId,
        data.title,
        data.category,
        data.count,
        data.lastInterest
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `product-interest-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getProductInterestSummary = () => {
    if (!analyticsData?.productInterest) return {};
    
    const summary: any = {};
    analyticsData.productInterest.forEach((event: ProductInterestData) => {
      if (!summary[event.productId]) {
        summary[event.productId] = {
          title: event.productTitle,
          category: event.productCategory,
          count: 0,
          lastInterest: event.timestamp
        };
      }
      summary[event.productId].count++;
      if (new Date(event.timestamp) > new Date(summary[event.productId].lastInterest)) {
        summary[event.productId].lastInterest = event.timestamp;
      }
    });
    
    return summary;
  };

  const clearData = () => {
    if (confirm('Are you sure you want to clear all analytics data?')) {
      analytics.clearLocalAnalytics();
      loadAnalytics();
    }
  };

  if (!analyticsData) {
    return (
      <div className="p-6">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-swatch103" />
          <p>Loading analytics data...</p>
        </div>
      </div>
    );
  }

  const productSummary = getProductInterestSummary();
  const totalInterest = Object.values(productSummary).reduce((sum: number, data: any) => sum + data.count, 0);
  const uniqueProducts = Object.keys(productSummary).length;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">Analytics Dashboard</h1>
        <div className="flex space-x-2">
          <Button onClick={loadAnalytics} disabled={loading} variant="outline">
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button onClick={exportData} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
          <Button onClick={clearData} variant="outline" className="text-red-400 border-red-400">
            Clear Data
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-swatch101/95 to-swatch101/85 backdrop-blur-sm border border-swatch103/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Total Interest</CardTitle>
            <TrendingUp className="h-4 w-4 text-swatch103" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{totalInterest}</div>
            <p className="text-xs text-white/80">Customer interest events</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-swatch101/95 to-swatch101/85 backdrop-blur-sm border border-swatch103/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Unique Products</CardTitle>
            <Users className="h-4 w-4 text-swatch103" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{uniqueProducts}</div>
            <p className="text-xs text-white/80">Products with interest</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-swatch101/95 to-swatch101/85 backdrop-blur-sm border border-swatch103/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Failed Events</CardTitle>
            <ShoppingCart className="h-4 w-4 text-swatch103" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{analyticsData.failedEvents?.length || 0}</div>
            <p className="text-xs text-white/80">Events needing retry</p>
          </CardContent>
        </Card>
      </div>

      {/* Product Interest Table */}
      <Card className="bg-gradient-to-br from-swatch101/95 to-swatch101/85 backdrop-blur-sm border border-swatch103/30">
        <CardHeader>
          <CardTitle className="text-white">Product Interest Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(productSummary)
              .sort(([,a]: [string, any], [,b]: [string, any]) => b.count - a.count)
              .map(([productId, data]: [string, any]) => (
                <div key={productId} className="flex items-center justify-between p-4 bg-white/10 rounded-lg">
                  <div className="flex-1">
                    <h3 className="font-bold text-white">{data.title}</h3>
                    <p className="text-sm text-white/80">{data.category}</p>
                    <p className="text-xs text-white/60">ID: {productId}</p>
                  </div>
                  <div className="text-right">
                    <Badge className="bg-swatch103/20 text-swatch103 border-swatch103/30 mb-2">
                      {data.count} interest{data.count !== 1 ? 's' : ''}
                    </Badge>
                    <p className="text-xs text-white/60">
                      Last: {new Date(data.lastInterest).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>

      {/* Raw Data */}
      <Card className="bg-gradient-to-br from-swatch101/95 to-swatch101/85 backdrop-blur-sm border border-swatch103/30">
        <CardHeader>
          <CardTitle className="text-white">Raw Analytics Data</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="text-xs text-white/80 bg-black/20 p-4 rounded-lg overflow-auto max-h-96">
            {JSON.stringify(analyticsData, null, 2)}
          </pre>
        </CardContent>
      </Card>
    </div>
  );
}
