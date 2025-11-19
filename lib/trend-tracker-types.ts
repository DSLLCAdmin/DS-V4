/**
 * TrendTracker Types and Models
 * DSLLC Social Media Hub - TrendTracker Module
 */

export type PlatformID = "I" | "T" | "Y" | "R" | "X" | "L";

export interface Platform {
  PLT_ID: PlatformID;
  name: string;
}

export type ProjectType =
  | "PlayTest"
  | "Launch"
  | "Evergreen"
  | "Experiment"
  | "Report"
  | "AdSet";

export interface Project {
  PROJ_CODE: string;    // e.g. IPT-01
  PLT_ID: PlatformID;
  type: ProjectType;
  status: "Planning" | "Production" | "InProgress" | "Live" | "Cooling" | "Complete";
  title?: string;
  description?: string;
}

export type AgentID =
  | "AG_TREND"
  | "AG_COPY"
  | "AG_SHOT"
  | "AG_TIME"
  | "AG_KARMA"
  | "AG_METRIC"
  | "AG_LINK";

export interface Agent {
  AGENT_ID: AgentID;
  display_name: string;
  role_capacity: number;
  avatar_path?: string;
}

export interface TaskState {
  heat: number;             // 0–1
  urgency: number;          // 0–1
  alignment: number;        // 0–1
  maintenance: number;      // 0–1
  dependency_pressure?: number; // 0–1
}

export interface TrendTask {
  TASK_ID: string;
  PROJ_CODE: string;
  primary_agent: AgentID;
  collab_agents?: AgentID[];
  description_short: string;
  progress: number;         // 0–1
  dependencies?: string[];
  state: TaskState;
  status: "todo" | "in_progress" | "blocked" | "complete";
}

export type EventType =
  | "EV_TREND_DETECTED"
  | "EV_DEADLINE_APPROACHING"
  | "EV_ASSET_READY"
  | "EV_POST_PUBLISHED"
  | "EV_METRIC_DROP"
  | "EV_KARMA_SPIKE"
  | "EV_DEPENDENCY_TRIGGER";

export interface SMEvent {
  timestamp: string;
  type: EventType;
  payload?: any;
}

export interface TrendTracker {
  platforms: Platform[];
  projects: Project[];
  agents: Agent[];
  tasks: TrendTask[];
  events: SMEvent[];
  weights: {
    wU: number;
    wA: number;
    wM: number;
    wD: number;
    wC: number;
    wL: number;
    wCollab: number;
  };
}

export const AVATAR_METADATA = {
  AG_TREND: { ringColor: "#FFB347", barColor: "#FCE5CD", starX: -12, dotX: 12 },
  AG_COPY:  { ringColor: "#C6B7FF", barColor: "#EAD9FF", starX: -12, dotX: 12 },
  AG_SHOT:  { ringColor: "#7AC9D9", barColor: "#D4F5FA", starX: -12, dotX: 12 },
  AG_TIME:  { ringColor: "#FFD580", barColor: "#FFF1CC", starX: -12, dotX: 12 },
  AG_KARMA: { ringColor: "#FF9999", barColor: "#FFD9D9", starX: -12, dotX: 12 },
  AG_METRIC:{ ringColor: "#A0E6A0", barColor: "#D9FFD9", starX: -12, dotX: 12 },
  AG_LINK:  { ringColor: "#99CCFF", barColor: "#D9E9FF", starX: -12, dotX: 12 }
};

