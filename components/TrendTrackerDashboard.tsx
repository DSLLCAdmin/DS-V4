'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import Image from 'next/image';
import { rankAgentsAndTasks, heatColorToHex, type RankedAgent, type RankedTask } from '@/lib/trend-tracker-rank-engine';
import type { TrendTracker, Agent, TrendTask, AgentID, Project as TrendProject } from '@/lib/trend-tracker-types';
import { AVATAR_METADATA } from '@/lib/trend-tracker-types';
import { TrendTrackerManagement } from './TrendTrackerManagement';

// -------------------------------------------------------------------------
// AVATAR MAP: agent display name → public image path
// -------------------------------------------------------------------------
const AVATAR_MAP: Record<string, string> = {
  "Trend Tiger": "/trend-tiger.png",
  "Copy Cat": "/copy-cat.png",
  "Shot Caller": "/shot-caller.png",
  "Time Tuner": "/time-tuner.png",
  "Karma Kid": "/karma-kid.png",
  "Metric Monk": "/metric-monk.png",
  "Link Lion": "/link-lion.png"
};

// -------------------------------------------------------------------------
// Helper: render avatar for an agent (with fallback)
// -------------------------------------------------------------------------
function renderAgentAvatar(agent: { display_name?: string }, hasRedTask: boolean, metadata: { ringColor: string }) {
  const name = agent.display_name ?? "";
  const src = AVATAR_MAP[name];

  // If we have a mapped avatar, show it.
  if (src) {
    return (
      <div className="relative mb-3">
        <div 
          className={`avatar-wrapper ${hasRedTask ? 'pulse-ring' : ''}`}
          style={{ 
            borderColor: metadata.ringColor,
            borderWidth: '4px',
            borderStyle: 'solid'
          }}
        >
          <Image
            src={src}
            alt={name}
            width={80}
            height={80}
            className="avatar-img"
          />
        </div>
      </div>
    );
  }

  // Fallback: original circle with initial if no avatar found.
  const initial = name ? name.charAt(0) : "?";

  return (
    <div className="relative mb-3">
      <div 
        className={`avatar-wrapper ${hasRedTask ? 'pulse-ring' : ''}`}
        style={{ 
          borderColor: metadata.ringColor,
          borderWidth: '4px',
          borderStyle: 'solid'
        }}
      >
        <div 
          className="avatar-circle-fallback"
          style={{ background: metadata.ringColor }}
        >
          {initial}
        </div>
      </div>
    </div>
  );
}

interface AgentColumnProps {
  agent: Agent;
  rankedTasks: RankedTask[];
  projectCode?: string;
  agentScore?: number; // Score from rank engine
  laneIndex: number; // For smooth animation
  primaryProjectCode?: string; // Primary project code for this agent
  maxHeat: number; // Max heat for pulse animation and heat bar
}

function AgentColumn({ agent, rankedTasks, projectCode, agentScore, laneIndex, primaryProjectCode, maxHeat }: AgentColumnProps) {
  const metadata = AVATAR_METADATA[agent.AGENT_ID];
  
  // Check if agent has any red tasks (heat >= 0.66) for pulse animation
  const hasRedTask = maxHeat >= 0.66;
  
  // Heat bar width (0-100%)
  const heatBarWidth = Math.max(10, maxHeat * 100);

  return (
    <div 
      className="flex flex-col items-center min-w-[200px] max-w-[220px] border rounded-lg p-4 bg-card shadow-sm transition-all duration-[400ms] ease-in-out"
      style={{ 
        order: laneIndex,
        transform: `translateX(0)`
      }}
    >
      {/* Project Code above avatar */}
      {primaryProjectCode && (
        <div className="text-xs font-mono text-muted-foreground mb-2">
          {primaryProjectCode}
        </div>
      )}

      {/* Avatar with pulse ring */}
      {renderAgentAvatar(agent, hasRedTask, metadata)}

      {/* Heat Bar */}
      <div className="w-full h-2 bg-muted rounded-full mb-2 overflow-hidden">
        <div 
          className="h-full transition-all duration-300 ease-out"
          style={{
            width: `${heatBarWidth}%`,
            background: maxHeat < 0.33 
              ? 'linear-gradient(to right, #d8f3dc, #95d5b2)'
              : maxHeat < 0.66
              ? 'linear-gradient(to right, #fff3b0, #ffd93d)'
              : 'linear-gradient(to right, #ffadad, #ff6b6b)'
          }}
        />
      </div>

      {/* Agent Name */}
      <div className="text-center mb-2">
        <div className="font-semibold text-sm">{agent.display_name}</div>
        {projectCode && (
          <Badge variant="outline" className="text-xs mt-1">
            {projectCode}
          </Badge>
        )}
        {/* Agent Score (from rank engine) */}
        {agentScore !== undefined && (
          <div className="text-xs text-muted-foreground mt-1">
            Score: {agentScore.toFixed(2)}
          </div>
        )}
      </div>

      {/* Task Stack */}
      <div className="w-full space-y-2 mt-2">
        {rankedTasks.length === 0 ? (
          <div className="text-xs text-muted-foreground text-center py-4">
            No tasks
          </div>
        ) : (
          rankedTasks.map((rankedTask) => (
            <div
              key={rankedTask.taskId}
              className="p-2 rounded border text-xs cursor-pointer hover:shadow-md transition-shadow"
              style={{ 
                backgroundColor: heatColorToHex(rankedTask.color),
                borderColor: metadata.barColor
              }}
              title={`Heat: ${(rankedTask.heat * 100).toFixed(0)}% | Priority: ${rankedTask.priority.toFixed(2)} | Progress: ${(rankedTask.task.progress * 100).toFixed(0)}%`}
            >
              <div className="font-medium mb-1">{rankedTask.task.description_short}</div>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span className="capitalize">{rankedTask.task.status.replace('_', ' ')}</span>
                <span>{Math.round(rankedTask.task.progress * 100)}%</span>
              </div>
              {rankedTask.task.collab_agents && rankedTask.task.collab_agents.length > 0 && (
                <div className="text-xs text-muted-foreground mt-1">
                  +{rankedTask.task.collab_agents.length} collab
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
  const [showKeyPanel, setShowKeyPanel] = useState(false);

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

  // Helper function to compute project importance from status
  const computeProjectImportance = (project: TrendProject): number => {
    // Map project status to importance (0-1)
    const statusMap: Record<string, number> = {
      "Planning": 0.3,
      "Production": 0.7,
      "InProgress": 0.8,
      "Live": 0.9,
      "Cooling": 0.4,
      "Complete": 0.2
    };
    return statusMap[project.status] ?? 0.5;
  };

  if (loading) {
    return <div className="text-center py-8">Loading TrendTracker...</div>;
  }

  if (!state) {
    return <div className="text-center py-8 text-muted-foreground">Failed to load TrendTracker</div>;
  }

  // Convert TrendTracker types to Rank Engine types and compute rankings
  const rankedAgents = rankAgentsAndTasks({
    agents: state.agents.map(a => ({
      AGENT_ID: a.AGENT_ID,
      display_name: a.display_name,
      role_capacity: a.role_capacity
    })),
    tasks: state.tasks.map(t => ({
      TASK_ID: t.TASK_ID,
      PROJ_CODE: t.PROJ_CODE,
      primary_agent: t.primary_agent,
      collab_agents: t.collab_agents,
      description_short: t.description_short,
      progress: t.progress,
      state: {
        heat: t.state.heat,
        urgency: t.state.urgency,
        alignment: t.state.alignment,
        maintenance: t.state.maintenance,
        dependencyPressure: t.state.dependency_pressure
      },
      status: t.status as "todo" | "in_progress" | "blocked" | "complete"
    })),
    projects: state.projects.map(p => ({
      PROJ_CODE: p.PROJ_CODE,
      // Compute importance from project status
      importance: computeProjectImportance(p)
    })),
    weights: {
      wU: state.weights.wU,
      wA: state.weights.wA,
      wM: state.weights.wM,
      wD: state.weights.wD,
      wProg: 0.5, // default progress penalty
      wLead: 1.0,
      wCollab: state.weights.wCollab,
      wLoad: state.weights.wL
    }
  });

  // Helper: Get primary project code for an agent (hottest task's project)
  const getPrimaryProjectCode = (rankedAgent: RankedAgent): { code: string; count: number } | null => {
    if (rankedAgent.tasks.length === 0) return null;
    
    // Find task with max heat
    const hottestTask = rankedAgent.tasks.reduce((max, task) => 
      task.heat > max.heat ? task : max
    );
    
    // Count unique projects
    const projectCodes = new Set(rankedAgent.tasks.map(t => t.task.PROJ_CODE));
    
    return {
      code: hottestTask.task.PROJ_CODE,
      count: projectCodes.size
    };
  };

  // Helper: Get max heat for an agent
  const getMaxHeat = (rankedAgent: RankedAgent): number => {
    if (rankedAgent.tasks.length === 0) return 0;
    return Math.max(...rankedAgent.tasks.map(t => t.heat));
  };

  // Group ranked tasks by project for display
  // Note: rankedAgents already has tasks sorted by priority (top→bottom)
  const agentProjectMap = new Map<AgentID, Map<string, RankedTask[]>>();
  
  rankedAgents.forEach(rankedAgent => {
    const byProject = new Map<string, RankedTask[]>();
    
    // Tasks are already sorted by priority in rankedAgent.tasks
    rankedAgent.tasks.forEach(rankedTask => {
      const existing = byProject.get(rankedTask.task.PROJ_CODE) || [];
      existing.push(rankedTask);
      byProject.set(rankedTask.task.PROJ_CODE, existing);
    });
    
    agentProjectMap.set(rankedAgent.agentId, byProject);
  });

  return (
    <div className="space-y-6 relative">
      {/* Management Panel */}
      <TrendTrackerManagement onRefresh={fetchState} />

      {/* Projects Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Projects</CardTitle>
          <p className="text-sm text-muted-foreground">
            Active projects and their status
          </p>
        </CardHeader>
        <CardContent>
          {state.projects.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">No projects yet</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {state.projects.map((project) => {
                const projectTasks = state.tasks.filter(t => t.PROJ_CODE === project.PROJ_CODE);
                const completedTasks = projectTasks.filter(t => t.status === 'complete').length;
                const totalTasks = projectTasks.length;
                
                return (
                  <div
                    key={project.PROJ_CODE}
                    className="p-4 border rounded-lg hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="font-semibold">{project.PROJ_CODE}</div>
                        <div className="text-sm text-muted-foreground">{project.title || project.PROJ_CODE}</div>
                      </div>
                      <Badge variant="outline" className="capitalize">
                        {project.status}
                      </Badge>
                    </div>
                    {project.description && (
                      <p className="text-sm text-muted-foreground mb-2">{project.description}</p>
                    )}
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>{totalTasks} tasks</span>
                      {totalTasks > 0 && (
                        <span>{completedTasks}/{totalTasks} complete</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

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
            <div className="flex gap-4 pb-4 relative" style={{ transition: 'all 0.4s ease' }}>
              {rankedAgents.map((rankedAgent) => {
                const agent = state.agents.find(a => a.AGENT_ID === rankedAgent.agentId);
                if (!agent) return null;

                const projectMap = agentProjectMap.get(rankedAgent.agentId);
                const primaryProject = getPrimaryProjectCode(rankedAgent);
                const maxHeat = getMaxHeat(rankedAgent);
                
                if (!projectMap || projectMap.size === 0) {
                  return (
                    <AgentColumn
                      key={rankedAgent.agentId}
                      agent={agent}
                      rankedTasks={[]}
                      agentScore={rankedAgent.score}
                      laneIndex={rankedAgent.laneIndex}
                      maxHeat={0}
                    />
                  );
                }

                // Render agent column for each project they're working on
                // Tasks are already sorted by priority (top→bottom) from rank engine
                return Array.from(projectMap.entries()).map(([projCode, rankedTasks]) => {
                  const projectLabel = primaryProject 
                    ? primaryProject.count > 1 
                      ? `${primaryProject.code} +${primaryProject.count - 1}`
                      : primaryProject.code
                    : projCode;
                  
                  return (
                    <AgentColumn
                      key={`${rankedAgent.agentId}-${projCode}`}
                      agent={agent}
                      rankedTasks={rankedTasks}
                      projectCode={projCode}
                      agentScore={rankedAgent.score}
                      laneIndex={rankedAgent.laneIndex}
                      primaryProjectCode={projectLabel}
                      maxHeat={maxHeat}
                    />
                  );
                });
              })}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Narrative Feed */}
      <NarrativeFeed events={state.events} />

      {/* Right-side Key Panel */}
      {/* Toggle Button */}
      <button
        onClick={() => setShowKeyPanel(!showKeyPanel)}
        className="fixed right-4 top-1/2 -translate-y-1/2 z-40 bg-primary text-primary-foreground px-3 py-8 rounded-l-lg shadow-lg hover:bg-primary/90 transition-colors"
        style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}
      >
        {showKeyPanel ? 'Hide' : 'Key'}
      </button>

      {/* Key Panel */}
      <div
        className={`fixed right-0 top-0 h-screen w-80 bg-card border-l shadow-xl z-30 transition-transform duration-300 ease-in-out overflow-y-auto ${
          showKeyPanel ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">Legend & Key</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowKeyPanel(false)}
              >
                ×
              </Button>
            </div>

            {/* Section 1: Heat / Task Priority */}
            <Card className="mb-4">
              <CardHeader>
                <CardTitle className="text-sm">Heat / Task Priority</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded" style={{ backgroundColor: '#d8f3dc' }} />
                  <span>Green = Low urgency / background tasks</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded" style={{ backgroundColor: '#fff3b0' }} />
                  <span>Yellow = Warming / approaching attention</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded" style={{ backgroundColor: '#ffadad' }} />
                  <span>Red = Hot / priority</span>
                </div>
              </CardContent>
            </Card>

            {/* Section 2: Agents */}
            <Card className="mb-4">
              <CardHeader>
                <CardTitle className="text-sm">Agents</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                {state.agents.map(agent => (
                  <div key={agent.AGENT_ID} className="flex items-start gap-2">
                    <Badge variant="outline" className="font-mono text-xs">
                      {agent.AGENT_ID}
                    </Badge>
                    <div>
                      <div className="font-medium">{agent.display_name}</div>
                      <div className="text-xs text-muted-foreground">
                        {agent.AGENT_ID === 'AG_TREND' && 'Trend tracking / triage'}
                        {agent.AGENT_ID === 'AG_COPY' && 'Copy & messaging'}
                        {agent.AGENT_ID === 'AG_SHOT' && 'Media creation cues'}
                        {agent.AGENT_ID === 'AG_TIME' && 'Scheduling'}
                        {agent.AGENT_ID === 'AG_KARMA' && 'Engagement & karma'}
                        {agent.AGENT_ID === 'AG_METRIC' && 'Metrics & analysis'}
                        {agent.AGENT_ID === 'AG_LINK' && 'Crosslink management'}
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Section 3: Project Codes */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Project Codes</CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-2">
                <p className="text-muted-foreground">
                  Project codes identify multiple campaigns:
                </p>
                <ul className="list-disc list-inside space-y-1 text-xs text-muted-foreground">
                  <li><code className="bg-muted px-1 rounded">RAW-PT-01</code> = Reddit AskWomen PlayTest #1</li>
                  <li><code className="bg-muted px-1 rounded">RKT-01</code> = Reddit Karma Test #1</li>
                  <li><code className="bg-muted px-1 rounded">IPT-01</code> = Instagram PlayTest #1</li>
                </ul>
                <p className="text-xs text-muted-foreground mt-2">
                  Format: [Platform][Type]-[Number]
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

