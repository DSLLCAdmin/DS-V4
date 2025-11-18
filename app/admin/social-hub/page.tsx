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
        <TabsList className="grid w-full grid-cols-6 gap-1 bg-transparent">
          <TabsTrigger 
            value="dashboard"
            className="bg-gradient-to-b from-[#E8E8E8] to-[#A8A8A8] text-gray-900 font-semibold shadow-md border border-gray-300 data-[state=active]:from-[#F0F0F0] data-[state=active]:to-[#C0C0C0] data-[state=active]:shadow-lg data-[state=active]:scale-[1.02] transition-all"
            style={{
              background: activeTab === 'dashboard' 
                ? 'linear-gradient(to bottom, #F0F0F0, #C0C0C0)' 
                : 'linear-gradient(to bottom, #E8E8E8, #A8A8A8)'
            }}
          >
            Dashboard
          </TabsTrigger>
          <TabsTrigger 
            value="tasks"
            className="bg-gradient-to-b from-[#A8D8EA] to-[#6BB6D6] text-gray-900 font-semibold shadow-md border border-blue-300 data-[state=active]:from-[#B8E8FA] data-[state=active]:to-[#7EC8E3] data-[state=active]:shadow-lg data-[state=active]:scale-[1.02] transition-all"
            style={{
              background: activeTab === 'tasks' 
                ? 'linear-gradient(to bottom, #B8E8FA, #7EC8E3)' 
                : 'linear-gradient(to bottom, #A8D8EA, #6BB6D6)'
            }}
          >
            Tasks
          </TabsTrigger>
          <TabsTrigger 
            value="content"
            className="bg-gradient-to-b from-[#6ED4CD] to-[#3EB5AD] text-gray-900 font-semibold shadow-md border border-teal-300 data-[state=active]:from-[#7EE4DD] data-[state=active]:to-[#4ECDC4] data-[state=active]:shadow-lg data-[state=active]:scale-[1.02] transition-all"
            style={{
              background: activeTab === 'content' 
                ? 'linear-gradient(to bottom, #7EE4DD, #4ECDC4)' 
                : 'linear-gradient(to bottom, #6ED4CD, #3EB5AD)'
            }}
          >
            Content Library
          </TabsTrigger>
          <TabsTrigger 
            value="metrics"
            className="bg-gradient-to-b from-[#CD853F] to-[#8B4513] text-white font-semibold shadow-md border border-amber-600 data-[state=active]:from-[#D8854F] data-[state=active]:to-[#B87333] data-[state=active]:shadow-lg data-[state=active]:scale-[1.02] transition-all"
            style={{
              background: activeTab === 'metrics' 
                ? 'linear-gradient(to bottom, #D8854F, #B87333)' 
                : 'linear-gradient(to bottom, #CD853F, #8B4513)'
            }}
          >
            Metrics
          </TabsTrigger>
          <TabsTrigger 
            value="trends"
            className="bg-gradient-to-b from-[#FFE44D] to-[#FFD700] text-gray-900 font-semibold shadow-md border border-yellow-400 data-[state=active]:from-[#FFEE5D] data-[state=active]:to-[#FFE020] data-[state=active]:shadow-lg data-[state=active]:scale-[1.02] transition-all"
            style={{
              background: activeTab === 'trends' 
                ? 'linear-gradient(to bottom, #FFEE5D, #FFE020)' 
                : 'linear-gradient(to bottom, #FFE44D, #FFD700)'
            }}
          >
            Trends
          </TabsTrigger>
          <TabsTrigger 
            value="checklist"
            className="bg-gradient-to-b from-[#E63946] to-[#B71C1C] text-white font-semibold shadow-md border border-red-600 data-[state=active]:from-[#F63956] data-[state=active]:to-[#DC143C] data-[state=active]:shadow-lg data-[state=active]:scale-[1.02] transition-all"
            style={{
              background: activeTab === 'checklist' 
                ? 'linear-gradient(to bottom, #F63956, #DC143C)' 
                : 'linear-gradient(to bottom, #E63946, #B71C1C)'
            }}
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

