'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { FileText, Shield, AlertCircle, CheckCircle, Clock, Edit } from 'lucide-react';
import { ShopifyPoliciesManager, Policy } from '@/lib/shopify-policies';

export default function ShopifyPoliciesDashboard() {
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPoliciesData = async () => {
      try {
        const policiesManager = new ShopifyPoliciesManager();
        const policiesData = policiesManager.getPolicies();
        setPolicies(policiesData);
      } catch (error) {
        console.error('Error loading policies data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPoliciesData();
  }, []);

  const getPolicyIcon = (type: string) => {
    switch (type) {
      case 'privacy':
        return <Shield className="h-5 w-5 text-blue-500" />;
      case 'terms':
        return <FileText className="h-5 w-5 text-green-500" />;
      case 'refund':
        return <FileText className="h-5 w-5 text-orange-500" />;
      case 'shipping':
        return <FileText className="h-5 w-5 text-purple-500" />;
      case 'cookies':
        return <FileText className="h-5 w-5 text-yellow-500" />;
      default:
        return <FileText className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusBadge = (published: boolean, required: boolean) => {
    if (published) {
      return <Badge variant="default" className="bg-green-500">Published</Badge>;
    } else if (required) {
      return <Badge variant="destructive">Required</Badge>;
    } else {
      return <Badge variant="secondary">Draft</Badge>;
    }
  };

  const getTypeBadge = (type: string) => {
    const colors = {
      privacy: 'bg-blue-100 text-blue-800',
      terms: 'bg-green-100 text-green-800',
      refund: 'bg-orange-100 text-orange-800',
      shipping: 'bg-purple-100 text-purple-800',
      cookies: 'bg-yellow-100 text-yellow-800'
    };
    
    return (
      <Badge variant="outline" className={colors[type as keyof typeof colors]}>
        {type.charAt(0).toUpperCase() + type.slice(1)}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Legal Policies</h1>
        </div>
        <div className="grid gap-6">
          {[1, 2, 3, 4, 5].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Legal Policies</h1>
          <p className="text-muted-foreground">Manage your store's legal documents and policies</p>
        </div>
      </div>

      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Legal policies are managed through your Shopify admin panel. 
          This dashboard shows current status and basic information.
        </AlertDescription>
      </Alert>

      <div className="grid gap-6">
        {policies.map((policy) => (
          <Card key={policy.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {getPolicyIcon(policy.type)}
                  <div>
                    <CardTitle className="text-lg">{policy.title}</CardTitle>
                    <CardDescription>
                      Last updated: {policy.lastUpdated.toLocaleDateString()}
                    </CardDescription>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {getTypeBadge(policy.type)}
                  {getStatusBadge(policy.published, policy.required)}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-700 line-clamp-3">
                    {policy.content}
                  </p>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-4">
                    <span className="text-muted-foreground">
                      Required: {policy.required ? 'Yes' : 'No'}
                    </span>
                    <span className="text-muted-foreground">
                      Status: {policy.published ? 'Published' : 'Draft'}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      {policy.lastUpdated.toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="pt-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    disabled
                    className="w-full"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit in Shopify Admin
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5" />
            <span>Legal Compliance</span>
          </CardTitle>
          <CardDescription>
            Ensure your store meets legal requirements for your region
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <h3 className="font-semibold">GDPR Compliant</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Privacy policy includes GDPR requirements
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <h3 className="font-semibold">CCPA Compliant</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                California Consumer Privacy Act compliant
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
