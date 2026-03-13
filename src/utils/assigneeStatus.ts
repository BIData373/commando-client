import type { IInstructionAssignee, InstructionStatus } from '../types';

export interface AggregatedStatus {
  overall: InstructionStatus;
  completedCount: number;
  totalCount: number;
  progressLabel: string;
}

export function computeAggregatedStatus(assignees: IInstructionAssignee[]): AggregatedStatus {
  if (assignees.length <= 1) {
    const status = assignees[0]?.status ?? 'open';
    return {
      overall: status,
      completedCount: status === 'completed' ? 1 : 0,
      totalCount: assignees.length,
      progressLabel: '',
    };
  }

  const completedCount = assignees.filter((a) => a.status === 'completed').length;
  const totalCount = assignees.length;

  let overall: InstructionStatus;
  if (completedCount === totalCount) {
    overall = 'completed';
  } else if (assignees.some((a) => a.status === 'inProgress' || a.status === 'completed')) {
    overall = 'inProgress';
  } else {
    overall = 'open';
  }

  return {
    overall,
    completedCount,
    totalCount,
    progressLabel: `${completedCount}/${totalCount}`,
  };
}
