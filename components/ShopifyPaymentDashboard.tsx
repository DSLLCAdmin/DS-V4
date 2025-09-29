'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CreditCard, Shield, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { ShopifyPaymentManager, PaymentGateway } from '@/lib/shopify-payment';

export default function ShopifyPaymentDashboard() {
  const [paymentGateways, setPaymentGateways] = useState<PaymentGateway[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPaymentData = async () => {
      try {
        const paymentManager = new ShopifyPaymentManager();
        const gateways = paymentManager.getPaymentStatus();
        setPaymentGateways(gateways);
      } catch (error) {
        console.error('Error loading payment data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPaymentData();
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'inactive':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="default" className="bg-green-500">Active</Badge>;
      case 'inactive':
        return <Badge variant="destructive">Inactive</Badge>;
      case 'pending':
        return <Badge variant="secondary" className="bg-yellow-500">Pending</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getGatewayIcon = (type: string) => {
    switch (type) {
      case 'stripe':
        return <CreditCard className="h-5 w-5 text-blue-500" />;
      case 'paypal':
        return <CreditCard className="h-5 w-5 text-yellow-500" />;
      case 'shopify_payments':
        return <Shield className="h-5 w-5 text-green-500" />;
      default:
        return <CreditCard className="h-5 w-5 text-gray-500" />;
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Payment Gateways</h1>
        </div>
        <div className="grid gap-6">
          {[1, 2, 3].map((i) => (
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
          <h1 className="text-3xl font-bold">Payment Gateways</h1>
          <p className="text-muted-foreground">Manage your payment processing options</p>
        </div>
      </div>

      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Payment gateway configurations are managed through your Shopify admin panel. 
          This dashboard shows current status and basic information.
        </AlertDescription>
      </Alert>

      <div className="grid gap-6">
        {paymentGateways.map((gateway) => (
          <Card key={gateway.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {getGatewayIcon(gateway.type)}
                  <div>
                    <CardTitle className="text-lg">{gateway.name}</CardTitle>
                    <CardDescription className="capitalize">
                      {gateway.type.replace('_', ' ')} Gateway
                    </CardDescription>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {getStatusIcon(gateway.status)}
                  {getStatusBadge(gateway.status)}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Enabled</span>
                  <Switch 
                    checked={gateway.enabled} 
                    disabled
                    className="opacity-50"
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Test Mode</span>
                  <Badge variant={gateway.testMode ? "secondary" : "outline"}>
                    {gateway.testMode ? 'Enabled' : 'Disabled'}
                  </Badge>
                </div>

                {gateway.lastUsed && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Last Used</span>
                    <span className="text-sm text-muted-foreground">
                      {gateway.lastUsed.toLocaleString()}
                    </span>
                  </div>
                )}

                <div className="pt-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    disabled
                    className="w-full"
                  >
                    Configure in Shopify Admin
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
            <span>Payment Security</span>
          </CardTitle>
          <CardDescription>
            Your payment processing is secured by Shopify's PCI-compliant infrastructure
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <h3 className="font-semibold">PCI Compliant</h3>
              <p className="text-sm text-muted-foreground">Level 1 certified</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <Shield className="h-8 w-8 text-blue-500 mx-auto mb-2" />
              <h3 className="font-semibold">SSL Encrypted</h3>
              <p className="text-sm text-muted-foreground">256-bit encryption</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <h3 className="font-semibold">Fraud Protection</h3>
              <p className="text-sm text-muted-foreground">Advanced detection</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
