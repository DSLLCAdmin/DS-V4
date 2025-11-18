'use client';

import { useState } from 'react';
import { AdminLayout, AdminTabInfo } from '@/components/AdminLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SocialHubDashboard } from '@/components/SocialHubDashboard';
import { SocialHubTasks } from '@/components/SocialHubTasks';
import { SocialHubContentLibrary } from '@/components/SocialHubContentLibrary';
import { SocialHubMetrics } from '@/components/SocialHubMetrics';
import { SocialHubTrends } from '@/components/SocialHubTrends';
import { SocialHubCrosslinkChecklist } from '@/components/SocialHubCrosslinkChecklist';

export default function SocialHubPage() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <AdminLayout currentPage="social-hub">
      <AdminTabInfo tabId="social-hub" />
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger 
            value="dashboard"
            className="data-[state=active]:bg-[#C0C0C0] data-[state=active]:text-gray-900 font-semibold"
          >
            Dashboard
          </TabsTrigger>
          <TabsTrigger 
            value="tasks"
            className="data-[state=active]:bg-[#7EC8E3] data-[state=active]:text-gray-900 font-semibold"
          >
            Tasks
          </TabsTrigger>
          <TabsTrigger 
            value="content"
            className="data-[state=active]:bg-[#4ECDC4] data-[state=active]:text-gray-900 font-semibold"
          >
            Content Library
          </TabsTrigger>
          <TabsTrigger 
            value="metrics"
            className="data-[state=active]:bg-[#B87333] data-[state=active]:text-white font-semibold"
          >
            Metrics
          </TabsTrigger>
          <TabsTrigger 
            value="trends"
            className="data-[state=active]:bg-[#FFD700] data-[state=active]:text-gray-900 font-semibold"
          >
            Trends
          </TabsTrigger>
          <TabsTrigger 
            value="checklist"
            className="data-[state=active]:bg-[#DC143C] data-[state=active]:text-white font-semibold"
          >
            Crosslink
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="mt-6">
          <SocialHubDashboard onNavigateToTab={setActiveTab} />
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

