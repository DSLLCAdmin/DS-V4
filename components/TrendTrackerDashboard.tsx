'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import Image from 'next/image';
import { computeSortedAgents, heatToColor } from '@/lib/trend-tracker-engine';
import type { TrendTracker, Agent, TrendTask, AgentID } from '@/lib/trend-tracker-types';
import { AVATAR_METADATA } from '@/lib/trend-tracker-types';
import { TrendTrackerManagement } from './TrendTrackerManagement';

interface AgentColumnProps {
  agent: Agent;
  tasks: TrendTask[];
  projectCode?: string;
}

function AgentColumn({ agent, tasks, projectCode }: AgentColumnProps) {
  const metadata = AVATAR_METADATA[agent.AGENT_ID];
  const avatarPath = `/avatars/${agent.AGENT_ID}.png`;
  const [avatarError, setAvatarError] = useState(false);

  return (
    <div className="flex flex-col items-center min-w-[200px] max-w-[220px] border rounded-lg p-4 bg-card shadow-sm">
      {/* Avatar */}
      <div className="relative mb-3">
        <div 
          className="w-16 h-16 rounded-full border-4 flex items-center justify-center overflow-hidden bg-muted"
          style={{ borderColor: metadata.ringColor }}
        >
          {avatarError ? (
            <div 
              className="w-full h-full flex items-center justify-center text-white font-bold text-lg"
              style={{ background: metadata.ringColor }}
            >
              {agent.display_name[0]}
            </div>
          ) : (
            <Image
              src={avatarPath}
              alt={agent.display_name}
              width={64}
              height={64}
              className="object-cover"
              onError={() => setAvatarError(true)}
            />
          )}
        </div>
      </div>

      {/* Agent Name */}
      <div className="text-center mb-2">
        <div className="font-semibold text-sm">{agent.display_name}</div>
        {projectCode && (
          <Badge variant="outline" className="text-xs mt-1">
            {projectCode}
          </Badge>
        )}
      </div>

      {/* Task Stack */}
      <div className="w-full space-y-2 mt-2">
        {tasks.length === 0 ? (
          <div className="text-xs text-muted-foreground text-center py-4">
            No tasks
          </div>
        ) : (
          tasks.map((task) => (
            <div
              key={task.TASK_ID}
              className="p-2 rounded border text-xs cursor-pointer hover:shadow-md transition-shadow"
              style={{ 
                backgroundColor: heatToColor(task.state.heat),
                borderColor: metadata.barColor
              }}
              title={`Heat: ${(task.state.heat * 100).toFixed(0)}% | Progress: ${(task.progress * 100).toFixed(0)}%`}
            >
              <div className="font-medium mb-1">{task.description_short}</div>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span className="capitalize">{task.status.replace('_', ' ')}</span>
                <span>{Math.round(task.progress * 100)}%</span>
              </div>
              {task.collab_agents && task.collab_agents.length > 0 && (
                <div className="text-xs text-muted-foreground mt-1">
                  +{task.collab_agents.length} collab
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

interface NarrativeFeedProps {
  events: TrendTracker['events'];
}

function NarrativeFeed({ events }: NarrativeFeedProps) {
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      hour: 'numeric', 
      minute: '2-digit' 
    });
  };

  const getEventLabel = (type: string) => {
    return type.replace('EV_', '').replace(/_/g, ' ').toLowerCase();
  };

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="text-lg">Narrative Feed</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px]">
          <div className="space-y-2">
            {events.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                No events yet
              </div>
            ) : (
              events.map((event, i) => (
                <div
                  key={i}
                  className="p-3 rounded border bg-muted/50 text-sm"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <div className="font-medium capitalize">
                        {getEventLabel(event.type)}
                      </div>
                      {event.payload && (
                        <div className="text-xs text-muted-foreground mt-1">
                          {JSON.stringify(event.payload)}
                        </div>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground whitespace-nowrap">
                      {formatTimestamp(event.timestamp)}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

export function TrendTrackerDashboard() {
  const [state, setState] = useState<TrendTracker | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchState();
  }, []);

  const fetchState = async () => {
    try {
      const response = await fetch('/api/social-hub/trend-tracker');
      if (response.ok) {
        const data = await response.json();
        setState(data.state);
      }
    } catch (error) {
      console.error('Error fetching TrendTracker state:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading TrendTracker...</div>;
  }

  if (!state) {
    return <div className="text-center py-8 text-muted-foreground">Failed to load TrendTracker</div>;
  }

  const sortedAgents = computeSortedAgents(state);

  // Group tasks by agent and project
  const agentTasksMap = new Map<AgentID, Map<string, TrendTask[]>>();
  
  sortedAgents.forEach(agentId => {
    const agentTasks = state.tasks.filter(t => t.primary_agent === agentId);
    const byProject = new Map<string, TrendTask[]>();
    
    agentTasks.forEach(task => {
      const existing = byProject.get(task.PROJ_CODE) || [];
      existing.push(task);
      byProject.set(task.PROJ_CODE, existing);
    });
    
    agentTasksMap.set(agentId, byProject);
  });

  return (
    <div className="space-y-6">
      {/* Management Panel */}
      <TrendTrackerManagement onRefresh={fetchState} />

      {/* Agent Columns */}
      <Card>
        <CardHeader>
          <CardTitle>Agent Task Board</CardTitle>
          <p className="text-sm text-muted-foreground">
            Agents ranked by task heat and urgency
          </p>
        </CardHeader>
        <CardContent>
          <ScrollArea className="w-full">
            <div className="flex gap-4 pb-4">
              {sortedAgents.map((agentId) => {
                const agent = state.agents.find(a => a.AGENT_ID === agentId);
                if (!agent) return null;

                const projectMap = agentTasksMap.get(agentId);
                if (!projectMap || projectMap.size === 0) {
                  return (
                    <AgentColumn
                      key={agentId}
                      agent={agent}
                      tasks={[]}
                    />
                  );
                }

                // Render agent column for each project they're working on
                return Array.from(projectMap.entries()).map(([projCode, tasks]) => (
                  <AgentColumn
                    key={`${agentId}-${projCode}`}
                    agent={agent}
                    tasks={tasks}
                    projectCode={projCode}
                  />
                ));
              })}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Narrative Feed */}
      <NarrativeFeed events={state.events} />
    </div>
  );
}

