'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { CheckCircle2, Plus, TrendingUp, Target, BarChart3 } from 'lucide-react';
import { toast } from 'sonner';
import { ContentSnippetForm } from '@/components/ContentSnippetForm';
import type { Task, Agent, MetricSnapshot, SocialSettings } from '@/lib/social-hub-data';

const AGENT_LABELS: Record<Agent, string> = {
  WATCHER: 'Watcher',
  SCRIBE: 'Scribe',
  LENS: 'Lens',
  SHADOW: 'Shadow',
  CLOCK: 'Clock',
  ANALYST: 'Analyst',
  LOOPMASTER: 'Loopmaster'
};

interface SocialHubDashboardProps {
  onNavigateToTab?: (tab: string) => void;
}

export function SocialHubDashboard({ onNavigateToTab }: SocialHubDashboardProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSnippetDialogOpen, setIsSnippetDialogOpen] = useState(false);
  const [latestMetrics, setLatestMetrics] = useState<MetricSnapshot | null>(null);
  const [settings, setSettings] = useState<SocialSettings | null>(null);
  const [todayNotes, setTodayNotes] = useState('');
  const [notesSaving, setNotesSaving] = useState(false);

  useEffect(() => {
    fetchTodayTasks();
    fetchLatestMetrics();
    fetchSettings();
  }, []);

  const fetchTodayTasks = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const response = await fetch(`/api/social-hub/tasks?frequency=DAILY&status=TODO`);
      if (response.ok) {
        const data = await response.json();
        const todayTasks = data.tasks.filter((task: Task) => 
          !task.dueDate || task.dueDate === today
        );
        setTasks(todayTasks);
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchLatestMetrics = async () => {
    try {
      const response = await fetch('/api/social-hub/metrics');
      if (response.ok) {
        const data = await response.json();
        if (data.snapshots && data.snapshots.length > 0) {
          setLatestMetrics(data.snapshots[0]);
        }
      }
    } catch (error) {
      console.error('Error fetching metrics:', error);
    }
  };

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/social-hub/settings');
      if (response.ok) {
        const data = await response.json();
        setSettings(data.settings);
        // Load today's notes
        const today = new Date().toISOString().split('T')[0];
        setTodayNotes(data.settings.dailyNotes[today] || '');
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    }
  };

  const toggleTaskStatus = async (taskId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'DONE' ? 'TODO' : 'DONE';
    
    try {
      const response = await fetch('/api/social-hub/tasks', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: taskId, status: newStatus })
      });

      if (response.ok) {
        fetchTodayTasks();
      }
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleCreateSnippet = async (data: {
    type: any;
    platform: any;
    text: string;
    tags: string[];
  }) => {
    try {
      const response = await fetch('/api/social-hub/content-snippets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        setIsSnippetDialogOpen(false);
        toast.success('Content snippet created successfully!');
      } else {
        toast.error('Failed to create snippet');
      }
    } catch (error) {
      console.error('Error creating snippet:', error);
      toast.error('Failed to create snippet');
    }
  };

  const handleSaveNotes = async () => {
    if (!settings) return;
    
    setNotesSaving(true);
    try {
      const today = new Date().toISOString().split('T')[0];
      const updatedNotes = {
        ...settings.dailyNotes,
        [today]: todayNotes
      };

      const response = await fetch('/api/social-hub/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dailyNotes: updatedNotes
        })
      });

      if (response.ok) {
        toast.success('Notes saved');
      }
    } catch (error) {
      console.error('Error saving notes:', error);
      toast.error('Failed to save notes');
    } finally {
      setNotesSaving(false);
    }
  };

  const tasksByAgent = tasks.reduce((acc, task) => {
    if (!acc[task.agent]) {
      acc[task.agent] = [];
    }
    acc[task.agent].push(task);
    return acc;
  }, {} as Record<Agent, Task[]>);

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Today's Focus */}
      {settings && (
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Target className="w-5 h-5" />
              Today's Focus
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div>
                <span className="font-medium">Platform:</span>{' '}
                <span className="text-muted-foreground">{settings.todaysFocus.platform}</span>
              </div>
              <div>
                <span className="font-medium">Goal:</span>{' '}
                <span className="text-muted-foreground">{settings.todaysFocus.goal}</span>
              </div>
              <div>
                <span className="font-medium">Special:</span>{' '}
                <span className="text-muted-foreground">{settings.todaysFocus.special}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Checklist */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Today's Checklist</CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={fetchTodayTasks}>
                    Refresh
                  </Button>
                  <Button size="sm" onClick={() => setIsSnippetDialogOpen(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    New Snippet
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {tasks.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No tasks for today. Great job! 🎉
                </p>
              ) : (
                <div className="space-y-6">
                  {Object.entries(tasksByAgent).map(([agent, agentTasks]) => (
                    <div key={agent} className="space-y-2">
                      <h3 className="font-semibold text-lg">{AGENT_LABELS[agent as Agent]}</h3>
                      <div className="space-y-2 pl-4">
                        {agentTasks.map((task) => (
                          <div
                            key={task.id}
                            className="flex items-start gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                          >
                            <Checkbox
                              checked={task.status === 'DONE'}
                              onCheckedChange={() => toggleTaskStatus(task.id, task.status)}
                              className="mt-1"
                            />
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className="font-medium">{task.title}</span>
                                {task.status === 'DONE' && (
                                  <Badge variant="default" className="bg-green-600">
                                    Done
                                  </Badge>
                                )}
                              </div>
                              {task.description && (
                                <p className="text-sm text-muted-foreground mt-1">
                                  {task.description}
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Mini Metrics Widget */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Latest Metrics
              </CardTitle>
            </CardHeader>
            <CardContent>
              {latestMetrics ? (
                <div className="space-y-3">
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">TikTok Views</div>
                    <div className="text-2xl font-bold">{latestMetrics.tiktokViews.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">IG Interactions</div>
                    <div className="text-2xl font-bold">{latestMetrics.instagramInteractions.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">Reddit Karma</div>
                    <div className="text-2xl font-bold">{latestMetrics.redditKarma.toLocaleString()}</div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-sm text-muted-foreground mb-4">
                    No metrics logged yet
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      if (onNavigateToTab) {
                        onNavigateToTab('metrics');
                      }
                    }}
                  >
                    Go to Metrics
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Today's Notes */}
      <Card>
        <CardHeader>
          <CardTitle>Today's Notes</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={todayNotes}
            onChange={(e) => setTodayNotes(e.target.value)}
            onBlur={handleSaveNotes}
            placeholder="Journal your social media activities for today..."
            rows={6}
            className="mb-3"
          />
          <div className="flex justify-end">
            <Button
              onClick={handleSaveNotes}
              disabled={notesSaving}
              size="sm"
              variant="outline"
            >
              {notesSaving ? 'Saving...' : 'Save Notes'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* New Snippet Dialog */}
      <Dialog open={isSnippetDialogOpen} onOpenChange={setIsSnippetDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Content Snippet</DialogTitle>
          </DialogHeader>
          <ContentSnippetForm
            onSubmit={handleCreateSnippet}
            onCancel={() => setIsSnippetDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
