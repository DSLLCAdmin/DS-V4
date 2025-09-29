import { AdminLayout, AdminTabInfo } from '@/components/AdminLayout';
import StripePaymentDashboard from '@/components/StripePaymentDashboard';

export default function StripePaymentsPage() {
  return (
    <AdminLayout currentPage="stripe-payments">
      <AdminTabInfo tabId="stripe-payments" />
      <StripePaymentDashboard />
    </AdminLayout>
  );
}
