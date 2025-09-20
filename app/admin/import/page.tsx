'use client';

import React from 'react';
import { AdminLayout, AdminTabInfo } from '@/components/AdminLayout';
import { ProductImportDashboard } from '@/components/ProductImportDashboard';

export default function ProductImportPage() {
  const handleRefresh = () => {
    // Refresh logic can be added here if needed
    console.log('Refreshing product import data...');
  };

  return (
    <AdminLayout currentPage="import">
      <AdminTabInfo tabId="import" />
      
      <ProductImportDashboard onRefresh={handleRefresh} />
    </AdminLayout>
  );
}
