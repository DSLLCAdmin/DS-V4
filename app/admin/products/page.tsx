import { AdminLayout, AdminTabInfo } from '@/components/AdminLayout';
import ShopifyProductsDashboard from '@/components/ShopifyProductsDashboard';

export default function ProductsPage() {
  return (
    <AdminLayout currentPage="products">
      <AdminTabInfo tabId="products" />
      <ShopifyProductsDashboard />
    </AdminLayout>
  );
}