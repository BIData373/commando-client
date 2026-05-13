import { differenceInDays, startOfToday } from 'date-fns'
import type { Task } from '../data/Tasks'
import type { QuickFilter } from '../components/Tasks/TaskFilters'
import { STATUS_LABELS } from '../components/shared/StatusTag'
import { DEADLINE_LABELS, type DeadlineType } from '#/components/shared/DeadlineTag'

// ─── Shared Types ────────────────────────────────────────────────────────────

export interface FilterOption {
  value: string
  label: string
}

// ─── Quick Filters ───────────────────────────────────────────────────────────

function matchesQuickFilter(task: Task, filter: QuickFilter): boolean {
  const today = startOfToday()
  const daysUntil = task.dueDate ? differenceInDays(task.dueDate, today) : null
  switch (filter) {
    case 'overdue':
      return daysUntil !== null && daysUntil < 0 && task.deadlineType !== 'immediate'
    case 'approaching':
      return daysUntil !== null && daysUntil >= 0 && daysUntil < 2 && !(daysUntil < 0 && task.deadlineType !== 'immediate')
    case 'flagged':
      return task.flagged
  }
}

// ─── Build Filter Options ────────────────────────────────────────────────────

function buildFilterOptionsMap(tasks: Task[]): Record<string, FilterOption[]> {
  const unique = <T>(arr: T[]): T[] => [...new Set(arr)]

  return {
    status: unique(tasks.map((t) => t.status)).map((v) => ({ value: v, label: STATUS_LABELS[v] })),
    responsible: unique(tasks.map((t) => t.responsible?.name ?? 'ללא אחראי')).map((v) => ({ value: v, label: v })),
    deadlineType: unique(tasks.map((t) => t.deadlineType)).map((v) => ({ value: v, label: DEADLINE_LABELS[v as DeadlineType] })),
    discussionName: unique(tasks.map((t) => t.discussionName)).filter(Boolean).map((v) => ({ value: v, label: v })),
    tags: unique(tasks.flatMap((t) => t.tags)).map((v) => ({ value: v, label: v })),
  }
}

// ─── Combined ────────────────────────────────────────────────────────────────

function applyAllFilters(
  tasks: Task[],
  activeQuickFilters: Set<QuickFilter>,
  activeTopicFilters: Set<string>,
  searchQuery: string,
): Task[] {
  const hasQuickFilters = activeQuickFilters.size > 0
  const hasTopicFilters = activeTopicFilters.size > 0

  let result = tasks

  if (hasQuickFilters || hasTopicFilters) {
    result = result.filter((t) => {
      const matchesQuick = hasQuickFilters && Array.from(activeQuickFilters).some((f) => matchesQuickFilter(t, f))
      const matchesTopic = hasTopicFilters && t.tags.some((tag) => activeTopicFilters.has(tag))
      return matchesQuick || matchesTopic
    })
  }

  if (searchQuery) {
    result = result.filter((t) => t.title.includes(searchQuery) || t.details?.includes(searchQuery) || t.notes.includes(searchQuery))
  }

  return result
}

export {
  matchesQuickFilter,
  buildFilterOptionsMap,
  applyAllFilters,
}
