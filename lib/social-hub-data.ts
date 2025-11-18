/**
 * Social Media Hub Data Models and Storage
 * DSLLC Social Media Control Board - Owner-Operator Edition
 */

export type Agent = 'WATCHER' | 'SCRIBE' | 'LENS' | 'SHADOW' | 'CLOCK' | 'ANALYST' | 'LOOPMASTER';
export type TaskFrequency = 'DAILY' | 'WEEKLY' | 'ONE_OFF';
export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE';
export type ContentSnippetType = 'CAPTION' | 'CONFESSION_LINE' | 'DANCER_QUOTE' | 'ARIES_QUOTE' | 'QUESTION';
export type Platform = 'TIKTOK' | 'INSTAGRAM' | 'REDDIT' | 'MULTI';
export type TrendSource = 'TIKTOK' | 'INSTAGRAM' | 'REDDIT' | 'OTHER';

export interface Task {
  id: string;
  title: string;
  description: string;
  agent: Agent;
  frequency: TaskFrequency;
  status: TaskStatus;
  dueDate?: string; // ISO date string
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

export interface ContentSnippet {
  id: string;
  type: ContentSnippetType;
  platform: Platform;
  text: string;
  tags: string[]; // Array of tag strings
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

export interface MetricSnapshot {
  id: string;
  date: string; // ISO date string (week-ending)
  tiktokViews: number;
  instagramInteractions: number;
  redditKarma: number;
  followersInstagram: number;
  followersTikTok: number;
  bestTag: string;
  bestPostNote: string;
  notes: string;
}

export interface TrendSignal {
  id: string;
  source: TrendSource;
  description: string;
  whyItFitsDS: string;
  suggestedPlatform: Platform;
  suggestedCaptionRef?: string; // Optional FK to ContentSnippet ID
  createdAt: string; // ISO date string
}

export interface CrosslinkChecklistItem {
  id: string;
  label: string;
  checked: boolean;
  notes: string;
}

// In-memory storage (can be replaced with database later)
class SocialHubStorage {
  private tasks: Map<string, Task> = new Map();
  private contentSnippets: Map<string, ContentSnippet> = new Map();
  private metricSnapshots: Map<string, MetricSnapshot> = new Map();
  private trendSignals: Map<string, TrendSignal> = new Map();
  private crosslinkChecklist: Map<string, CrosslinkChecklistItem> = new Map();

  constructor() {
    this.initializeDefaultData();
    if (typeof window !== 'undefined') {
      this.loadFromLocalStorage();
    }
  }

  private initializeDefaultData() {
    // Initialize default daily tasks for each agent
    const defaultTasks: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>[] = [
      {
        title: 'Monitor TikTok trends',
        description: 'Check trending hashtags and content styles on TikTok',
        agent: 'WATCHER',
        frequency: 'DAILY',
        status: 'TODO'
      },
      {
        title: 'Monitor Instagram trends',
        description: 'Review Instagram Reels and Stories trends',
        agent: 'WATCHER',
        frequency: 'DAILY',
        status: 'TODO'
      },
      {
        title: 'Monitor Reddit trends',
        description: 'Check relevant subreddits for trending topics',
        agent: 'WATCHER',
        frequency: 'DAILY',
        status: 'TODO'
      },
      {
        title: 'Write 3 captions',
        description: 'Create 3 new captions for upcoming posts',
        agent: 'SCRIBE',
        frequency: 'DAILY',
        status: 'TODO'
      },
      {
        title: 'Create media creation cues',
        description: 'Generate ideas for visual content creation',
        agent: 'LENS',
        frequency: 'DAILY',
        status: 'TODO'
      },
      {
        title: 'Engage on TikTok',
        description: 'Like, comment, and engage with TikTok community',
        agent: 'SHADOW',
        frequency: 'DAILY',
        status: 'TODO'
      },
      {
        title: 'Engage on Instagram',
        description: 'Like, comment, and engage with Instagram community',
        agent: 'SHADOW',
        frequency: 'DAILY',
        status: 'TODO'
      },
      {
        title: 'Engage on Reddit',
        description: 'Upvote, comment, and engage with Reddit community',
        agent: 'SHADOW',
        frequency: 'DAILY',
        status: 'TODO'
      },
      {
        title: 'Schedule weekly content',
        description: 'Plan and schedule content for the week',
        agent: 'CLOCK',
        frequency: 'WEEKLY',
        status: 'TODO'
      },
      {
        title: 'Review weekly metrics',
        description: 'Analyze and record weekly performance metrics',
        agent: 'ANALYST',
        frequency: 'WEEKLY',
        status: 'TODO'
      },
      {
        title: 'Verify crosslinks',
        description: 'Check all cross-platform links are working',
        agent: 'LOOPMASTER',
        frequency: 'WEEKLY',
        status: 'TODO'
      }
    ];

    defaultTasks.forEach((task, index) => {
      const id = `task_${Date.now()}_${index}`;
      const now = new Date().toISOString();
      this.tasks.set(id, {
        ...task,
        id,
        createdAt: now,
        updatedAt: now
      });
    });

    // Initialize crosslink checklist
    const checklistItems: Omit<CrosslinkChecklistItem, 'id'>[] = [
      { label: 'IG bio links to TikTok + Reddit + DS site', checked: false, notes: '' },
      { label: 'TikTok bio links to IG + DS site', checked: false, notes: '' },
      { label: 'Reddit profile links to IG + TikTok + DS site', checked: false, notes: '' },
      { label: 'Website embeds TikTok/IG where possible', checked: false, notes: '' },
      { label: 'QR assets up-to-date', checked: false, notes: '' }
    ];

    checklistItems.forEach((item, index) => {
      const id = `checklist_${index}`;
      this.crosslinkChecklist.set(id, { ...item, id });
    });
  }

  // Tasks
  getAllTasks(): Task[] {
    return Array.from(this.tasks.values());
  }

  getTask(id: string): Task | undefined {
    return this.tasks.get(id);
  }

  createTask(task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Task {
    const id = `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const now = new Date().toISOString();
    const newTask: Task = {
      ...task,
      id,
      createdAt: now,
      updatedAt: now
    };
    this.tasks.set(id, newTask);
    this.saveToLocalStorage();
    return newTask;
  }

  updateTask(id: string, updates: Partial<Omit<Task, 'id' | 'createdAt'>>): Task | null {
    const task = this.tasks.get(id);
    if (!task) return null;

    const updatedTask: Task = {
      ...task,
      ...updates,
      updatedAt: new Date().toISOString()
    };
    this.tasks.set(id, updatedTask);
    this.saveToLocalStorage();
    return updatedTask;
  }

  deleteTask(id: string): boolean {
    const deleted = this.tasks.delete(id);
    if (deleted) this.saveToLocalStorage();
    return deleted;
  }

  resetDailyTasks(): void {
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    
    this.tasks.forEach((task) => {
      if (task.frequency === 'DAILY' && task.status === 'DONE') {
        this.updateTask(task.id, { status: 'TODO', dueDate: today });
      }
    });
  }

  // Content Snippets
  getAllContentSnippets(): ContentSnippet[] {
    return Array.from(this.contentSnippets.values());
  }

  getContentSnippet(id: string): ContentSnippet | undefined {
    return this.contentSnippets.get(id);
  }

  createContentSnippet(snippet: Omit<ContentSnippet, 'id' | 'createdAt' | 'updatedAt'>): ContentSnippet {
    const id = `snippet_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const now = new Date().toISOString();
    const newSnippet: ContentSnippet = {
      ...snippet,
      id,
      createdAt: now,
      updatedAt: now
    };
    this.contentSnippets.set(id, newSnippet);
    this.saveToLocalStorage();
    return newSnippet;
  }

  updateContentSnippet(id: string, updates: Partial<Omit<ContentSnippet, 'id' | 'createdAt'>>): ContentSnippet | null {
    const snippet = this.contentSnippets.get(id);
    if (!snippet) return null;

    const updatedSnippet: ContentSnippet = {
      ...snippet,
      ...updates,
      updatedAt: new Date().toISOString()
    };
    this.contentSnippets.set(id, updatedSnippet);
    this.saveToLocalStorage();
    return updatedSnippet;
  }

  deleteContentSnippet(id: string): boolean {
    const deleted = this.contentSnippets.delete(id);
    if (deleted) this.saveToLocalStorage();
    return deleted;
  }

  // Metric Snapshots
  getAllMetricSnapshots(): MetricSnapshot[] {
    return Array.from(this.metricSnapshots.values()).sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }

  getMetricSnapshot(id: string): MetricSnapshot | undefined {
    return this.metricSnapshots.get(id);
  }

  createMetricSnapshot(snapshot: Omit<MetricSnapshot, 'id'>): MetricSnapshot {
    const id = `metric_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const newSnapshot: MetricSnapshot = {
      ...snapshot,
      id
    };
    this.metricSnapshots.set(id, newSnapshot);
    this.saveToLocalStorage();
    return newSnapshot;
  }

  updateMetricSnapshot(id: string, updates: Partial<Omit<MetricSnapshot, 'id'>>): MetricSnapshot | null {
    const snapshot = this.metricSnapshots.get(id);
    if (!snapshot) return null;

    const updatedSnapshot: MetricSnapshot = {
      ...snapshot,
      ...updates
    };
    this.metricSnapshots.set(id, updatedSnapshot);
    this.saveToLocalStorage();
    return updatedSnapshot;
  }

  deleteMetricSnapshot(id: string): boolean {
    const deleted = this.metricSnapshots.delete(id);
    if (deleted) this.saveToLocalStorage();
    return deleted;
  }

  // Trend Signals
  getAllTrendSignals(): TrendSignal[] {
    return Array.from(this.trendSignals.values()).sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  getTrendSignal(id: string): TrendSignal | undefined {
    return this.trendSignals.get(id);
  }

  createTrendSignal(signal: Omit<TrendSignal, 'id' | 'createdAt'>): TrendSignal {
    const id = `trend_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const now = new Date().toISOString();
    const newSignal: TrendSignal = {
      ...signal,
      id,
      createdAt: now
    };
    this.trendSignals.set(id, newSignal);
    this.saveToLocalStorage();
    return newSignal;
  }

  updateTrendSignal(id: string, updates: Partial<Omit<TrendSignal, 'id' | 'createdAt'>>): TrendSignal | null {
    const signal = this.trendSignals.get(id);
    if (!signal) return null;

    const updatedSignal: TrendSignal = {
      ...signal,
      ...updates
    };
    this.trendSignals.set(id, updatedSignal);
    this.saveToLocalStorage();
    return updatedSignal;
  }

  deleteTrendSignal(id: string): boolean {
    const deleted = this.trendSignals.delete(id);
    if (deleted) this.saveToLocalStorage();
    return deleted;
  }

  // Crosslink Checklist
  getCrosslinkChecklist(): CrosslinkChecklistItem[] {
    return Array.from(this.crosslinkChecklist.values());
  }

  updateCrosslinkItem(id: string, updates: Partial<Omit<CrosslinkChecklistItem, 'id'>>): CrosslinkChecklistItem | null {
    const item = this.crosslinkChecklist.get(id);
    if (!item) return null;

    const updatedItem: CrosslinkChecklistItem = {
      ...item,
      ...updates
    };
    this.crosslinkChecklist.set(id, updatedItem);
    this.saveToLocalStorage();
    return updatedItem;
  }

  // Local Storage persistence
  private saveToLocalStorage() {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.setItem('socialHub_tasks', JSON.stringify(Array.from(this.tasks.entries())));
      localStorage.setItem('socialHub_contentSnippets', JSON.stringify(Array.from(this.contentSnippets.entries())));
      localStorage.setItem('socialHub_metricSnapshots', JSON.stringify(Array.from(this.metricSnapshots.entries())));
      localStorage.setItem('socialHub_trendSignals', JSON.stringify(Array.from(this.trendSignals.entries())));
      localStorage.setItem('socialHub_crosslinkChecklist', JSON.stringify(Array.from(this.crosslinkChecklist.entries())));
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
    }
  }

  private loadFromLocalStorage() {
    if (typeof window === 'undefined') return;

    try {
      const tasksData = localStorage.getItem('socialHub_tasks');
      if (tasksData) {
        const tasks = JSON.parse(tasksData);
        this.tasks = new Map(tasks);
      }

      const snippetsData = localStorage.getItem('socialHub_contentSnippets');
      if (snippetsData) {
        const snippets = JSON.parse(snippetsData);
        this.contentSnippets = new Map(snippets);
      }

      const metricsData = localStorage.getItem('socialHub_metricSnapshots');
      if (metricsData) {
        const metrics = JSON.parse(metricsData);
        this.metricSnapshots = new Map(metrics);
      }

      const trendsData = localStorage.getItem('socialHub_trendSignals');
      if (trendsData) {
        const trends = JSON.parse(trendsData);
        this.trendSignals = new Map(trends);
      }

      const checklistData = localStorage.getItem('socialHub_crosslinkChecklist');
      if (checklistData) {
        const checklist = JSON.parse(checklistData);
        this.crosslinkChecklist = new Map(checklist);
      }
    } catch (error) {
      console.error('Failed to load from localStorage:', error);
    }
  }
}

// Export singleton instance
export const socialHubStorage = new SocialHubStorage();

