'use client';

import { AdminLayout, AdminTabInfo } from '@/components/AdminLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SocialHubDashboard } from '@/components/SocialHubDashboard';
import { SocialHubTasks } from '@/components/SocialHubTasks';
import { SocialHubContentLibrary } from '@/components/SocialHubContentLibrary';
import { SocialHubMetrics } from '@/components/SocialHubMetrics';
import { SocialHubTrends } from '@/components/SocialHubTrends';
import { SocialHubCrosslinkChecklist } from '@/components/SocialHubCrosslinkChecklist';

export default function SocialHubPage() {
  return (
    <AdminLayout currentPage="social-hub">
      <AdminTabInfo tabId="social-hub" />
      
      <Tabs defaultValue="dashboard" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="content">Content Library</TabsTrigger>
          <TabsTrigger value="metrics">Metrics</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="checklist">Crosslink</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="mt-6">
          <SocialHubDashboard />
        </TabsContent>

        <TabsContent value="tasks" className="mt-6">
          <SocialHubTasks />
        </TabsContent>

        <TabsContent value="content" className="mt-6">
          <SocialHubContentLibrary />
        </TabsContent>

        <TabsContent value="metrics" className="mt-6">
          <SocialHubMetrics />
        </TabsContent>

        <TabsContent value="trends" className="mt-6">
          <SocialHubTrends />
        </TabsContent>

        <TabsContent value="checklist" className="mt-6">
          <SocialHubCrosslinkChecklist />
        </TabsContent>
      </Tabs>
    </AdminLayout>
  );
}

