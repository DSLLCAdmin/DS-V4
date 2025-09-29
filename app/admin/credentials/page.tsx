import { AdminLayout, AdminTabInfo } from '@/components/AdminLayout';
import SecureCredentialsDashboard from '@/components/SecureCredentialsDashboard';

export default function CredentialsPage() {
  return (
    <AdminLayout currentPage="credentials">
      <AdminTabInfo tabId="credentials" />
      <SecureCredentialsDashboard />
    </AdminLayout>
  );
}