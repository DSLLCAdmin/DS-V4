import { Navigation } from '@/components/navigation';
import { AnalyticsDashboard } from '@/components/AnalyticsDashboard';

export default function AnalyticsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1A0F0A] via-[#8B4513] to-[#D2691E] overflow-hidden">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <AnalyticsDashboard />
      </div>
      
      <Navigation variant="footer" />
    </div>
  );
}
