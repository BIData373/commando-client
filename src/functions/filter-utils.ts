import { differenceInDays, startOfToday } from 'date-fns'
import type { Task } from '../data/Tasks'
import type { QuickFilter } from '../components/Tasks/TaskFilters'
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

function buildFilterOptionsMap(tasks: Task[]): Record<string, FilterOption[]> {
  const statusSet = new Set<string>()
  const responsibleSet = new Set<string>()
  const deadlineTypeSet = new Set<string>()
  const discussionNameSet = new Set<string>()
  const tagsSet = new Set<string>()

  for (const t of tasks) {
    statusSet.add(t.status)
    if (t.responsible) responsibleSet.add(t.responsible.name)
    deadlineTypeSet.add(t.deadlineType)
    if (t.discussionName) discussionNameSet.add(t.discussionName)
    t.tags.forEach((tag) => tagsSet.add(tag))
  }

  const toOptions = (set: Set<string>): FilterOption[] =>
    [...set].map((v) => ({ value: v, label: v }))

  return {
    status: toOptions(statusSet),
    responsible: toOptions(responsibleSet),
    deadlineType: toOptions(deadlineTypeSet),
    discussionName: toOptions(discussionNameSet),
    tags: toOptions(tagsSet),
  }
}

export {
  matchesQuickFilter,
  applyAllFilters,
  buildFilterOptionsMap,
}
