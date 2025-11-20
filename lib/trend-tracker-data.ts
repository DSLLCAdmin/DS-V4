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
    } else {
      // Server-side: initialize with sample data if state is empty
      this.initializeSampleData();
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
      } else {
        // First time - initialize with sample data
        this.initializeSampleData();
      }
    } catch (error) {
      console.error('Failed to load TrendTracker from localStorage:', error);
      // On error, initialize with sample data
      this.initializeSampleData();
    }
  }

  private initializeSampleData() {
    // Only initialize if we don't already have data
    if (this.state.projects.length > 0 || this.state.tasks.length > 0) {
      return;
    }

    // Real Reddit Engagement Campaign Data (u/DarkStreetConfess)
    // Session: 4 hours of posting, 2 days ago
    // Total Karma: 11, Active in 6 subreddits
    
    const redditProject: Project = {
      PROJ_CODE: "RKT-01",
      PLT_ID: "R",
      type: "Experiment",
      status: "InProgress",
      title: "Reddit Karma Boost Campaign",
      description: "4-hour engagement session across 6 subreddits. Total karma: 11. Best performer: r/AskReddit post with 7 upvotes, 65 views."
    };

    // Tasks based on real engagement data
    const tasks: TrendTask[] = [
      {
        TASK_ID: "T-REDDIT-001",
        PROJ_CODE: "RKT-01",
        primary_agent: "AG_KARMA",
        collab_agents: ["AG_COPY"],
        description_short: "Follow up on high-performing AskReddit post (7 upvotes, 65 views)",
        progress: 0.3,
        state: {
          heat: 0.7,
          urgency: 0.6,
          alignment: 0.8,
          maintenance: 0.2,
          dependency_pressure: 0.1
        },
        status: "in_progress"
      },
      {
        TASK_ID: "T-REDDIT-002",
        PROJ_CODE: "RKT-01",
        primary_agent: "AG_COPY",
        collab_agents: ["AG_KARMA"],
        description_short: "Create more content in r/AskReddit (most successful subreddit)",
        progress: 0.1,
        state: {
          heat: 0.6,
          urgency: 0.5,
          alignment: 0.9,
          maintenance: 0.3,
          dependency_pressure: 0
        },
        status: "todo"
      },
      {
        TASK_ID: "T-REDDIT-003",
        PROJ_CODE: "RKT-01",
        primary_agent: "AG_METRIC",
        description_short: "Track engagement patterns: r/nostalgia (2 upvotes) vs r/AskReddit (7 upvotes)",
        progress: 0.4,
        state: {
          heat: 0.5,
          urgency: 0.4,
          alignment: 0.7,
          maintenance: 0.4,
          dependency_pressure: 0
        },
        status: "in_progress"
      },
      {
        TASK_ID: "T-REDDIT-004",
        PROJ_CODE: "RKT-01",
        primary_agent: "AG_COPY",
        description_short: "Develop nostalgic content strategy (r/nostalgia performed well)",
        progress: 0.2,
        state: {
          heat: 0.5,
          urgency: 0.3,
          alignment: 0.8,
          maintenance: 0.2,
          dependency_pressure: 0
        },
        status: "todo"
      },
      {
        TASK_ID: "T-REDDIT-005",
        PROJ_CODE: "RKT-01",
        primary_agent: "AG_KARMA",
        description_short: "Engage with comments on existing posts to boost visibility",
        progress: 0.1,
        state: {
          heat: 0.4,
          urgency: 0.5,
          alignment: 0.6,
          maintenance: 0.3,
          dependency_pressure: 0.2
        },
        status: "todo"
      }
    ];

    // Events from the actual Reddit campaign
    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
    
    const events: SMEvent[] = [
      {
        timestamp: new Date(twoDaysAgo.getTime() + 1000 * 60 * 30).toISOString(), // 30 min into session
        type: "EV_POST_PUBLISHED",
        payload: { 
          platform: "R", 
          subreddit: "r/AskWomen",
          karma: 1,
          views: 1
        }
      },
      {
        timestamp: new Date(twoDaysAgo.getTime() + 1000 * 60 * 60).toISOString(), // 1 hour in
        type: "EV_POST_PUBLISHED",
        payload: { 
          platform: "R", 
          subreddit: "r/AskMen",
          karma: 1,
          views: 1
        }
      },
      {
        timestamp: new Date(twoDaysAgo.getTime() + 1000 * 60 * 90).toISOString(), // 1.5 hours in
        type: "EV_POST_PUBLISHED",
        payload: { 
          platform: "R", 
          subreddit: "r/nostalgia",
          karma: 2,
          views: 1
        }
      },
      {
        timestamp: new Date(twoDaysAgo.getTime() + 1000 * 60 * 120).toISOString(), // 2 hours in
        type: "EV_KARMA_SPIKE",
        payload: { 
          platform: "R", 
          subreddit: "r/AskReddit",
          karma: 7,
          views: 65,
          thread: "What is a moment from your childhood that you only realized was weird once you became an adult?"
        }
      },
      {
        timestamp: new Date(twoDaysAgo.getTime() + 1000 * 60 * 180).toISOString(), // 3 hours in
        type: "EV_POST_PUBLISHED",
        payload: { 
          platform: "R", 
          subreddit: "r/CasualConversation",
          karma: 1,
          views: 1
        }
      },
      {
        timestamp: new Date(twoDaysAgo.getTime() + 1000 * 60 * 240).toISOString(), // 4 hours in (end)
        type: "EV_METRIC_DROP",
        payload: { 
          platform: "R", 
          total_karma: 11,
          total_posts: 12,
          top_subreddit: "r/AskReddit",
          top_karma: 7
        }
      }
    ];

    // Additional project: Specific AskWomen thread engagement (RAW-PT-01)
    // This is a micro-level project focusing on deep engagement in one thread
    const askWomenProject: Project = {
      PROJ_CODE: "RAW-PT-01",
      PLT_ID: "R",
      type: "PlayTest",
      status: "InProgress",
      title: "AskWomen – What do you miss in a relationship?",
      description: "Deep engagement strategy for specific AskWomen thread. Focus on thoughtful comments and follow-up responses."
    };

    // Tasks for the AskWomen thread project
    const askWomenTasks: TrendTask[] = [
      {
        TASK_ID: "T-0001",
        PROJ_CODE: "RAW-PT-01",
        primary_agent: "AG_KARMA",
        description_short: "Post thoughtful comment in AskWomen thread",
        progress: 1.0, // done
        state: {
          heat: 0.3,
          urgency: 0.1,
          alignment: 0.7,
          maintenance: 0.2,
          dependency_pressure: 0
        },
        status: "complete"
      },
      {
        TASK_ID: "T-0002",
        PROJ_CODE: "RAW-PT-01",
        primary_agent: "AG_KARMA",
        description_short: "Check for replies & respond",
        progress: 0.2,
        state: {
          heat: 0.8,
          urgency: 0.7,
          alignment: 0.8,
          maintenance: 0.3,
          dependency_pressure: 0.1
        },
        status: "todo"
      },
      {
        TASK_ID: "T-0003",
        PROJ_CODE: "RAW-PT-01",
        primary_agent: "AG_TREND",
        description_short: "Scan top comments for emotional motifs",
        progress: 0.5,
        state: {
          heat: 0.6,
          urgency: 0.4,
          alignment: 0.9,
          maintenance: 0.2,
          dependency_pressure: 0
        },
        status: "in_progress"
      },
      {
        TASK_ID: "T-0004",
        PROJ_CODE: "RAW-PT-01",
        primary_agent: "AG_COPY",
        description_short: "Save best lines into DS writing notebook",
        progress: 0.1,
        state: {
          heat: 0.5,
          urgency: 0.3,
          alignment: 0.8,
          maintenance: 0.2,
          dependency_pressure: 0
        },
        status: "todo"
      },
      {
        TASK_ID: "T-0005",
        PROJ_CODE: "RAW-PT-01",
        primary_agent: "AG_METRIC",
        description_short: "Track karma on AskWomen comment for 3 days",
        progress: 0.3,
        state: {
          heat: 0.4,
          urgency: 0.3,
          alignment: 0.7,
          maintenance: 0.4,
          dependency_pressure: 0
        },
        status: "in_progress"
      }
    ];

    // Events for the AskWomen thread project
    const askWomenEvents: SMEvent[] = [
      {
        timestamp: "2025-11-18T10:00:00Z",
        type: "EV_TREND_DETECTED",
        payload: {
          platform: "R",
          subreddit: "r/AskWomen",
          thread: "What do you miss in a relationship?",
          note: "AskWomen thread on 'what you miss in a relationship' shows huge engagement; themes: quiet intimacy, touch, being seen."
        }
      },
      {
        timestamp: "2025-11-18T11:00:00Z",
        type: "EV_DEPENDENCY_TRIGGER",
        payload: {
          platform: "R",
          subreddit: "r/AskWomen",
          note: "Karma Kid to check for replies to u/DarkStreetConfess comment and respond if needed."
        }
      },
      {
        timestamp: "2025-11-18T12:00:00Z",
        type: "EV_KARMA_SPIKE",
        payload: {
          platform: "R",
          subreddit: "r/AskWomen",
          note: "Monitor if short reflective comment gains more than +1–5 upvotes within 24h."
        }
      }
    ];

    this.state.projects.push(redditProject);
    this.state.projects.push(askWomenProject);
    this.state.tasks.push(...tasks);
    this.state.tasks.push(...askWomenTasks);
    this.state.events.push(...events);
    this.state.events.push(...askWomenEvents);

    // Save initialized data (only works in browser)
    this.saveToLocalStorage();
  }
}

export const trendTrackerStorage = new TrendTrackerStorage();

