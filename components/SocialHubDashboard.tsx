'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { CheckCircle2, Circle, Clock, Plus, TrendingUp } from 'lucide-react';
import type { Task, Agent } from '@/lib/social-hub-data';

const AGENT_LABELS: Record<Agent, string> = {
  WATCHER: 'Watcher',
  SCRIBE: 'Scribe',
  LENS: 'Lens',
  SHADOW: 'Shadow',
  CLOCK: 'Clock',
  ANALYST: 'Analyst',
  LOOPMASTER: 'Loopmaster'
};

export function SocialHubDashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTodayTasks();
  }, []);

  const fetchTodayTasks = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const response = await fetch(`/api/social-hub/tasks?frequency=DAILY&status=TODO`);
      if (response.ok) {
        const data = await response.json();
        // Filter for today or no due date
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
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Today's Checklist</CardTitle>
            <Button variant="outline" size="sm" onClick={fetchTodayTasks}>
              Refresh
            </Button>
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

      <Card>
        <CardHeader>
          <CardTitle>This Week at a Glance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-2">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
              <div key={day} className="text-center p-3 border rounded-lg">
                <div className="font-semibold mb-2">{day}</div>
                <div className="text-sm text-muted-foreground">
                  Content scheduled
                </div>
              </div>
            ))}
          </div>
          <p className="text-sm text-muted-foreground mt-4 text-center">
            Weekly content planning coming soon
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

