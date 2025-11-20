/******************************************************************************************
 * DSLLC – TrendTracker Rank Engine (Single-File Version)
 *
 * This file is self-contained and can be dropped directly into the project.
 * It does NOT depend on any other local files.
 *
 * It computes:
 *  - Task heat (0–1)
 *  - Task color (green/yellow/red)
 *  - Task priority (for vertical ordering)
 *  - Agent scores (for left–right ordering)
 *  - A ranked structure usable by the UI
 ******************************************************************************************/

/****************************************
 * 1. TYPES
 ****************************************/

export type AgentID =
  | "AG_TREND"
  | "AG_COPY"
  | "AG_SHOT"
  | "AG_TIME"
  | "AG_KARMA"
  | "AG_METRIC"
  | "AG_LINK";

export type TaskStatus = "todo" | "in_progress" | "blocked" | "complete" | "done";

export interface Agent {
  AGENT_ID: AgentID;
  display_name?: string;
  // (Optional) max tasks they should carry comfortably
  role_capacity?: number;
}

export interface TaskState {
  // If you already compute heat elsewhere, you can pass it;
  // otherwise it will be recomputed here.
  heat?: number;              // 0–1
  urgency: number;            // 0–1 (time pressure)
  alignment: number;          // 0–1 (importance to DSLLC goals)
  maintenance: number;        // 0–1 (platform health / karma)
  dependencyPressure?: number;// 0–1 (how many things depend on this task)
}

export interface Task {
  TASK_ID: string;
  PROJ_CODE: string;
  primary_agent: AgentID;
  collab_agents?: AgentID[];
  description_short: string;
  progress: number;           // 0–1 (0 = not started, 1 = done)
  state: TaskState;
  status: TaskStatus;
}

export interface Project {
  PROJ_CODE: string;
  // How important this project is overall (0–1)
  importance: number;
}

export interface Weights {
  // Task-level weights
  wU: number;      // urgency
  wA: number;      // alignment
  wM: number;      // maintenance
  wD: number;      // dependency pressure
  wProg: number;   // progress penalty
  // Agent-level weights
  wLead: number;   // weight of max heat on owned tasks
  wCollab: number; // weight of max heat on collab tasks
  wLoad: number;   // load penalty per task
}

export type HeatColor = "green" | "yellow" | "red";

export interface RankedTask {
  taskId: string;
  task: Task;
  heat: number;        // 0–1
  priority: number;    // higher = nearer to top
  color: HeatColor;
}

export interface RankedAgent {
  agentId: AgentID;
  agent: Agent;
  score: number;       // rank score
  laneIndex: number;   // 0 = leftmost lane
  tasks: RankedTask[]; // tasks sorted top → bottom
}

/****************************************
 * 2. DEFAULT WEIGHTS
 ****************************************/

export const DEFAULT_WEIGHTS: Weights = {
  wU: 1.0,
  wA: 1.0,
  wM: 0.5,
  wD: 0.8,
  wProg: 0.5,
  wLead: 1.0,
  wCollab: 0.5,
  wLoad: 0.1
};

/****************************************
 * 3. UTILS: HEAT & COLOR
 ****************************************/

export function computeTaskHeat(
  task: Task,
  projectImportance: number,
  weights: Weights
): number {
  const s = task.state;
  const dep = s.dependencyPressure ?? 0;
  const progressPenalty = task.progress * weights.wProg;

  // Base raw score
  let heat =
    s.urgency * weights.wU +
    s.alignment * weights.wA +
    s.maintenance * weights.wM +
    dep * weights.wD +
    projectImportance;

  // Reduce heat as the task is completed
  heat -= progressPenalty;

  // Clamp to [0,1]
  return Math.min(1, Math.max(0, heat));
}

export function heatToColor(heat: number): HeatColor {
  if (heat < 0.33) return "green";
  if (heat < 0.66) return "yellow";
  return "red";
}

// Helper to convert HeatColor to hex for UI
export function heatColorToHex(color: HeatColor): string {
  switch (color) {
    case "green": return "#d8f3dc";
    case "yellow": return "#fff3b0";
    case "red": return "#ffadad";
  }
}

/****************************************
 * 4. TASK PRIORITY
 ****************************************/

export function computeTaskPriority(task: Task, heat: number): number {
  // Simple rule:
  //  - higher heat -> higher priority
  //  - blocked tasks get slight boost
  //  - done/complete tasks get large negative priority (sink to bottom)
  let base = heat;
  if (task.status === "blocked") base += 0.1;
  if (task.status === "done" || task.status === "complete") base -= 1.0;
  return base;
}

/****************************************
 * 5. AGENT SCORING
 ****************************************/

export function computeAgentScoreFor(
  agent: Agent,
  tasks: Task[],
  weights: Weights,
  projectMap: Map<string, Project>
): { score: number; rankedTasks: RankedTask[] } {
  const owned = tasks.filter(t => t.primary_agent === agent.AGENT_ID);
  const collab = tasks.filter(t => t.collab_agents?.includes(agent.AGENT_ID));
  const rankedTasks: RankedTask[] = [];

  // First compute heat & priority for all tasks belonging to this agent (owned only)
  for (const t of owned) {
    const proj = projectMap.get(t.PROJ_CODE);
    const importance = proj?.importance ?? 0;
    const heat = computeTaskHeat(t, importance, weights);
    const priority = computeTaskPriority(t, heat);
    const color = heatToColor(heat);

    rankedTasks.push({
      taskId: t.TASK_ID,
      task: t,
      heat,
      priority,
      color
    });
  }

  // Agent score is based on:
  //  - max heat of owned tasks
  //  - max heat of collab tasks
  //  - penalty for number of tasks (to avoid overloading)
  let maxOwnedHeat = 0;
  let maxCollabHeat = 0;

  if (owned.length > 0) {
    maxOwnedHeat = Math.max(
      ...owned.map(t => {
        const proj = projectMap.get(t.PROJ_CODE);
        const importance = proj?.importance ?? 0;
        return computeTaskHeat(t, importance, weights);
      })
    );
  }

  if (collab.length > 0) {
    maxCollabHeat = Math.max(
      ...collab.map(t => {
        const proj = projectMap.get(t.PROJ_CODE);
        const importance = proj?.importance ?? 0;
        return computeTaskHeat(t, importance, weights);
      })
    );
  }

  const loadCount = owned.length + collab.length;
  const loadPenalty = loadCount * weights.wLoad;

  const score =
    maxOwnedHeat * weights.wLead +
    maxCollabHeat * weights.wCollab -
    loadPenalty;

  // sort tasks: highest priority at top
  rankedTasks.sort((a, b) => b.priority - a.priority);

  return { score, rankedTasks };
}

/****************************************
 * 6. MAIN ENTRYPOINT
 ****************************************/

export interface RankEngineInput {
  agents: Agent[];
  tasks: Task[];
  projects: Project[];
  weights?: Partial<Weights>;
}

/**
 * rankAgentsAndTasks
 *
 * Given agents, tasks, and projects, produce a list of
 * RankedAgent objects, including:
 *  - score (for ordering)
 *  - laneIndex (0 = leftmost)
 *  - tasks sorted vertically by priority
 */
export function rankAgentsAndTasks(input: RankEngineInput): RankedAgent[] {
  const { agents, tasks, projects } = input;
  const weights: Weights = { ...DEFAULT_WEIGHTS, ...(input.weights || {}) };

  const projectMap = new Map<string, Project>();
  for (const p of projects) {
    projectMap.set(p.PROJ_CODE, p);
  }

  const scored: RankedAgent[] = agents.map(agent => {
    const { score, rankedTasks } = computeAgentScoreFor(agent, tasks, weights, projectMap);

    return {
      agentId: agent.AGENT_ID,
      agent,
      score,
      laneIndex: 0, // filled in after sort
      tasks: rankedTasks
    };
  });

  // Sort agents by score descending and assign laneIndex
  scored.sort((a, b) => b.score - a.score);
  scored.forEach((ra, index) => {
    ra.laneIndex = index; // this can be mapped to X position in UI
  });

  return scored;
}

