/**
 * TrendTracker Rank Engine
 * Computes task heat and agent rankings
 */

import type { TrendTask, AgentID, TrendTracker } from './trend-tracker-types';

export function computeTaskHeat(task: TrendTask, weights: TrendTracker['weights']): number {
  const s = task.state;
  const raw =
    s.urgency * weights.wU +
    s.alignment * weights.wA +
    s.maintenance * weights.wM +
    (s.dependency_pressure || 0) * weights.wD -
    task.progress * 0.5;

  return Math.min(1, Math.max(0, raw));
}

export function computeAgentRank(
  tasks: TrendTask[],
  agent: AgentID,
  weights: TrendTracker['weights']
): number {
  const owned = tasks.filter(t => t.primary_agent === agent);
  const collab = tasks.filter(t => t.collab_agents?.includes(agent));

  const primaryHeat = owned.length
    ? Math.max(...owned.map(t => computeTaskHeat(t, weights)))
    : 0;

  const collabHeat = collab.length
    ? Math.max(...collab.map(t => computeTaskHeat(t, weights))) * weights.wCollab
    : 0;

  const loadPenalty = (owned.length + collab.length) * weights.wL;

  return primaryHeat + collabHeat - loadPenalty;
}

export function computeSortedAgents(state: TrendTracker): AgentID[] {
  return state.agents
    .map(a => ({
      agent: a.AGENT_ID,
      score: computeAgentRank(state.tasks, a.AGENT_ID, state.weights)
    }))
    .sort((a, b) => b.score - a.score)
    .map(x => x.agent);
}

export const heatToColor = (h: number): string => {
  if (h < 0.33) return "#d8f3dc";   // green
  if (h < 0.66) return "#fff3b0";   // yellow
  return "#ffadad";                 // red
};

