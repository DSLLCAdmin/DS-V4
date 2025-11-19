/**
 * TrendTracker Data Storage and Management
 */

import type { TrendTracker, Platform, Project, Agent, TrendTask, SMEvent } from './trend-tracker-types';

const DEFAULT_WEIGHTS = {
  wU: 1.0,
  wA: 1.2,
  wM: 0.4,
  wD: 0.8,
  wC: 0.3,
  wL: 0.3,
  wCollab: 0.6
};

const DEFAULT_PLATFORMS: Platform[] = [
  { PLT_ID: "I", name: "Instagram" },
  { PLT_ID: "T", name: "TikTok" },
  { PLT_ID: "Y", name: "YouTube" },
  { PLT_ID: "R", name: "Reddit" },
  { PLT_ID: "X", name: "Cross-Platform" },
  { PLT_ID: "L", name: "LinkedIn" }
];

const DEFAULT_AGENTS: Agent[] = [
  { AGENT_ID: "AG_TREND", display_name: "Trend Tiger", role_capacity: 4 },
  { AGENT_ID: "AG_COPY", display_name: "Copy Cat", role_capacity: 5 },
  { AGENT_ID: "AG_SHOT", display_name: "Shot Caller", role_capacity: 4 },
  { AGENT_ID: "AG_TIME", display_name: "Time Tuner", role_capacity: 3 },
  { AGENT_ID: "AG_KARMA", display_name: "Karma Kid", role_capacity: 4 },
  { AGENT_ID: "AG_METRIC", display_name: "Metric Monk", role_capacity: 5 },
  { AGENT_ID: "AG_LINK", display_name: "Link Lion", role_capacity: 4 }
];

class TrendTrackerStorage {
  private state: TrendTracker;

  constructor() {
    this.state = {
      platforms: [...DEFAULT_PLATFORMS],
      projects: [],
      agents: [...DEFAULT_AGENTS],
      tasks: [],
      events: [],
      weights: { ...DEFAULT_WEIGHTS }
    };

    if (typeof window !== 'undefined') {
      this.loadFromLocalStorage();
    }
  }

  getState(): TrendTracker {
    return this.state;
  }

  // Projects
  getAllProjects(): Project[] {
    return [...this.state.projects];
  }

  getProject(code: string): Project | undefined {
    return this.state.projects.find(p => p.PROJ_CODE === code);
  }

  createProject(project: Omit<Project, 'PROJ_CODE'> & { PROJ_CODE?: string }): Project {
    const PROJ_CODE = project.PROJ_CODE || this.generateProjectCode(project.PLT_ID, project.type);
    const newProject: Project = {
      ...project,
      PROJ_CODE
    };
    this.state.projects.push(newProject);
    this.saveToLocalStorage();
    return newProject;
  }

  updateProject(code: string, updates: Partial<Omit<Project, 'PROJ_CODE'>>): Project | null {
    const project = this.state.projects.find(p => p.PROJ_CODE === code);
    if (!project) return null;

    Object.assign(project, updates);
    this.saveToLocalStorage();
    return project;
  }

  deleteProject(code: string): boolean {
    const index = this.state.projects.findIndex(p => p.PROJ_CODE === code);
    if (index === -1) return false;

    // Delete associated tasks
    this.state.tasks = this.state.tasks.filter(t => t.PROJ_CODE !== code);
    this.state.projects.splice(index, 1);
    this.saveToLocalStorage();
    return true;
  }

  // Tasks
  getAllTasks(): TrendTask[] {
    return [...this.state.tasks];
  }

  getTask(id: string): TrendTask | undefined {
    return this.state.tasks.find(t => t.TASK_ID === id);
  }

  createTask(task: Omit<TrendTask, 'TASK_ID'> & { TASK_ID?: string }): TrendTask {
    const TASK_ID = task.TASK_ID || `T-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
    const newTask: TrendTask = {
      ...task,
      TASK_ID
    };
    this.state.tasks.push(newTask);
    this.saveToLocalStorage();
    return newTask;
  }

  updateTask(id: string, updates: Partial<Omit<TrendTask, 'TASK_ID'>>): TrendTask | null {
    const task = this.state.tasks.find(t => t.TASK_ID === id);
    if (!task) return null;

    Object.assign(task, updates);
    this.saveToLocalStorage();
    return task;
  }

  deleteTask(id: string): boolean {
    const index = this.state.tasks.findIndex(t => t.TASK_ID === id);
    if (index === -1) return false;

    this.state.tasks.splice(index, 1);
    this.saveToLocalStorage();
    return true;
  }

  // Events
  getAllEvents(): SMEvent[] {
    return [...this.state.events].sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }

  addEvent(event: Omit<SMEvent, 'timestamp'> & { timestamp?: string }): SMEvent {
    const newEvent: SMEvent = {
      ...event,
      timestamp: event.timestamp || new Date().toISOString()
    };
    this.state.events.unshift(newEvent);
    // Keep only last 100 events
    if (this.state.events.length > 100) {
      this.state.events = this.state.events.slice(0, 100);
    }
    this.saveToLocalStorage();
    return newEvent;
  }

  // Weights
  updateWeights(weights: Partial<TrendTracker['weights']>): void {
    this.state.weights = { ...this.state.weights, ...weights };
    this.saveToLocalStorage();
  }

  // Helper
  private generateProjectCode(PLT_ID: string, type: string): string {
    const prefix = PLT_ID;
    const typeCode = type.substring(0, 2).toUpperCase();
    const num = this.state.projects.filter(p => p.PLT_ID === PLT_ID).length + 1;
    return `${prefix}${typeCode}-${num.toString().padStart(2, '0')}`;
  }

  // Local Storage
  private saveToLocalStorage() {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.setItem('trendTracker_state', JSON.stringify(this.state));
    } catch (error) {
      console.error('Failed to save TrendTracker to localStorage:', error);
    }
  }

  private loadFromLocalStorage() {
    if (typeof window === 'undefined') return;

    try {
      const data = localStorage.getItem('trendTracker_state');
      if (data) {
        const loaded = JSON.parse(data);
        // Merge with defaults to ensure all required fields exist
        this.state = {
          platforms: loaded.platforms || DEFAULT_PLATFORMS,
          projects: loaded.projects || [],
          agents: loaded.agents || DEFAULT_AGENTS,
          tasks: loaded.tasks || [],
          events: loaded.events || [],
          weights: { ...DEFAULT_WEIGHTS, ...(loaded.weights || {}) }
        };
      }
    } catch (error) {
      console.error('Failed to load TrendTracker from localStorage:', error);
    }
  }
}

export const trendTrackerStorage = new TrendTrackerStorage();

