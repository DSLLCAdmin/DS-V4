import { AdminLayout, AdminTabInfo } from '@/components/AdminLayout';
import CloudBackupDashboard from '@/components/CloudBackupDashboard';

export default function CloudBackupPage() {
  return (
    <AdminLayout currentPage="cloud-backup">
      <AdminTabInfo tabId="cloud-backup" />
      <CloudBackupDashboard />
    </AdminLayout>
  );
}
