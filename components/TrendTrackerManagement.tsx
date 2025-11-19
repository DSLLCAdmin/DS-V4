'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import type { Project, TrendTask, AgentID, PlatformID, ProjectType } from '@/lib/trend-tracker-types';

interface TrendTrackerManagementProps {
  onRefresh: () => void;
}

export function TrendTrackerManagement({ onRefresh }: TrendTrackerManagementProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<TrendTask[]>([]);
  const [isProjectDialogOpen, setIsProjectDialogOpen] = useState(false);
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [editingTask, setEditingTask] = useState<TrendTask | null>(null);

  const [newProject, setNewProject] = useState({
    PLT_ID: '' as PlatformID | '',
    type: '' as ProjectType | '',
    status: 'Planning' as Project['status'],
    title: '',
    description: ''
  });

  const [newTask, setNewTask] = useState({
    PROJ_CODE: '',
    primary_agent: '' as AgentID | '',
    collab_agents: [] as AgentID[],
    description_short: '',
    progress: 0,
    state: {
      heat: 0.5,
      urgency: 0.5,
      alignment: 0.5,
      maintenance: 0.3,
      dependency_pressure: 0
    },
    status: 'todo' as TrendTask['status']
  });

  const fetchData = async () => {
    try {
      const response = await fetch('/api/social-hub/trend-tracker');
      if (response.ok) {
        const data = await response.json();
        setProjects(data.state.projects || []);
        setTasks(data.state.tasks || []);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/social-hub/trend-tracker', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'create_project',
          data: newProject
        })
      });

      if (response.ok) {
        toast.success('Project created');
        setIsProjectDialogOpen(false);
        setNewProject({
          PLT_ID: '' as PlatformID | '',
          type: '' as ProjectType | '',
          status: 'Planning',
          title: '',
          description: ''
        });
        fetchData();
        onRefresh();
      }
    } catch (error) {
      console.error('Error creating project:', error);
      toast.error('Failed to create project');
    }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/social-hub/trend-tracker', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'create_task',
          data: newTask
        })
      });

      if (response.ok) {
        toast.success('Task created');
        setIsTaskDialogOpen(false);
        setNewTask({
          PROJ_CODE: '',
          primary_agent: '' as AgentID | '',
          collab_agents: [],
          description_short: '',
          progress: 0,
          state: {
            heat: 0.5,
            urgency: 0.5,
            alignment: 0.5,
            maintenance: 0.3,
            dependency_pressure: 0
          },
          status: 'todo'
        });
        fetchData();
        onRefresh();
      }
    } catch (error) {
      console.error('Error creating task:', error);
      toast.error('Failed to create task');
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Projects */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Projects</CardTitle>
            <Dialog open={isProjectDialogOpen} onOpenChange={setIsProjectDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  New Project
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create Project</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleCreateProject} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Platform *</label>
                      <Select
                        value={newProject.PLT_ID}
                        onValueChange={(value) => setNewProject({ ...newProject, PLT_ID: value as PlatformID })}
                        required
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select platform" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="I">Instagram</SelectItem>
                          <SelectItem value="T">TikTok</SelectItem>
                          <SelectItem value="Y">YouTube</SelectItem>
                          <SelectItem value="R">Reddit</SelectItem>
                          <SelectItem value="X">Cross-Platform</SelectItem>
                          <SelectItem value="L">LinkedIn</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Type *</label>
                      <Select
                        value={newProject.type}
                        onValueChange={(value) => setNewProject({ ...newProject, type: value as ProjectType })}
                        required
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="PlayTest">PlayTest</SelectItem>
                          <SelectItem value="Launch">Launch</SelectItem>
                          <SelectItem value="Evergreen">Evergreen</SelectItem>
                          <SelectItem value="Experiment">Experiment</SelectItem>
                          <SelectItem value="Report">Report</SelectItem>
                          <SelectItem value="AdSet">AdSet</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Status</label>
                    <Select
                      value={newProject.status}
                      onValueChange={(value) => setNewProject({ ...newProject, status: value as Project['status'] })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Planning">Planning</SelectItem>
                        <SelectItem value="Production">Production</SelectItem>
                        <SelectItem value="InProgress">InProgress</SelectItem>
                        <SelectItem value="Live">Live</SelectItem>
                        <SelectItem value="Cooling">Cooling</SelectItem>
                        <SelectItem value="Complete">Complete</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Title</label>
                    <Input
                      value={newProject.title}
                      onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Description</label>
                    <Textarea
                      value={newProject.description}
                      onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                      rows={3}
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={() => setIsProjectDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit">Create</Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {projects.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">No projects yet</p>
            ) : (
              projects.map((project) => (
                <div key={project.PROJ_CODE} className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold">{project.PROJ_CODE}</div>
                      <div className="text-sm text-muted-foreground">{project.title || project.type}</div>
                    </div>
                    <Badge variant="outline">{project.status}</Badge>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Tasks */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Tasks</CardTitle>
            <Dialog open={isTaskDialogOpen} onOpenChange={setIsTaskDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  New Task
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Create Task</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleCreateTask} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Project Code *</label>
                      <Select
                        value={newTask.PROJ_CODE}
                        onValueChange={(value) => setNewTask({ ...newTask, PROJ_CODE: value })}
                        required
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select project" />
                        </SelectTrigger>
                        <SelectContent>
                          {projects.map((p) => (
                            <SelectItem key={p.PROJ_CODE} value={p.PROJ_CODE}>
                              {p.PROJ_CODE}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Primary Agent *</label>
                      <Select
                        value={newTask.primary_agent}
                        onValueChange={(value) => setNewTask({ ...newTask, primary_agent: value as AgentID })}
                        required
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select agent" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="AG_TREND">Trend Tiger</SelectItem>
                          <SelectItem value="AG_COPY">Copy Cat</SelectItem>
                          <SelectItem value="AG_SHOT">Shot Caller</SelectItem>
                          <SelectItem value="AG_TIME">Time Tuner</SelectItem>
                          <SelectItem value="AG_KARMA">Karma Kid</SelectItem>
                          <SelectItem value="AG_METRIC">Metric Monk</SelectItem>
                          <SelectItem value="AG_LINK">Link Lion</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Description *</label>
                    <Input
                      value={newTask.description_short}
                      onChange={(e) => setNewTask({ ...newTask, description_short: e.target.value })}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 gap-4">
                    <div>
                      <label className="text-sm font-medium">Urgency (0-1)</label>
                      <Input
                        type="number"
                        min="0"
                        max="1"
                        step="0.1"
                        value={newTask.state.urgency}
                        onChange={(e) => setNewTask({
                          ...newTask,
                          state: { ...newTask.state, urgency: parseFloat(e.target.value) || 0 }
                        })}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Alignment (0-1)</label>
                      <Input
                        type="number"
                        min="0"
                        max="1"
                        step="0.1"
                        value={newTask.state.alignment}
                        onChange={(e) => setNewTask({
                          ...newTask,
                          state: { ...newTask.state, alignment: parseFloat(e.target.value) || 0 }
                        })}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Maintenance (0-1)</label>
                      <Input
                        type="number"
                        min="0"
                        max="1"
                        step="0.1"
                        value={newTask.state.maintenance}
                        onChange={(e) => setNewTask({
                          ...newTask,
                          state: { ...newTask.state, maintenance: parseFloat(e.target.value) || 0 }
                        })}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Progress (0-1)</label>
                      <Input
                        type="number"
                        min="0"
                        max="1"
                        step="0.1"
                        value={newTask.progress}
                        onChange={(e) => setNewTask({ ...newTask, progress: parseFloat(e.target.value) || 0 })}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Status</label>
                    <Select
                      value={newTask.status}
                      onValueChange={(value) => setNewTask({ ...newTask, status: value as TrendTask['status'] })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="todo">Todo</SelectItem>
                        <SelectItem value="in_progress">In Progress</SelectItem>
                        <SelectItem value="blocked">Blocked</SelectItem>
                        <SelectItem value="complete">Complete</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={() => setIsTaskDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit">Create</Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {tasks.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">No tasks yet</p>
            ) : (
              tasks.map((task) => (
                <div key={task.TASK_ID} className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold">{task.description_short}</div>
                      <div className="text-sm text-muted-foreground">{task.PROJ_CODE}</div>
                    </div>
                    <Badge variant="outline" className="capitalize">{task.status.replace('_', ' ')}</Badge>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

