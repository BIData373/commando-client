import { differenceInDays, startOfToday } from 'date-fns'
import { QuickFilter } from '#/utils/filterUtils'
import type { Task } from '../data/Tasks'

function matchesQuickFilter(task: Task, filter: QuickFilter): boolean {
  const today = startOfToday()
  const daysUntil = task.dueDate ? differenceInDays(task.dueDate, today) : null
  switch (filter) {
    case QuickFilter.OVERDUE:
      return daysUntil !== null && daysUntil < 0 && task.deadlineType !== 'immediate'
    case QuickFilter.APPROACHING:
      return daysUntil !== null && daysUntil >= 0 && daysUntil < 2 && !(daysUntil < 0 && task.deadlineType !== 'immediate')
    case QuickFilter.FLAGGED:
      return task.flagged
  }
}

function applyQuickFilters(tasks: Task[], activeQuickFilters: Set<QuickFilter>): Task[] {
  if (activeQuickFilters.size === 0) return tasks
  return tasks.filter((t) => Array.from(activeQuickFilters).some((f) => matchesQuickFilter(t, f)))
}

function applyTopicFilters(tasks: Task[], activeTopicFilters: Set<string>): Task[] {
  if (activeTopicFilters.size === 0) return tasks
  return tasks.filter((t) => t.tags.some((tag) => activeTopicFilters.has(tag)))
}

function applySearch(tasks: Task[], searchQuery: string): Task[] {
  if (!searchQuery) return tasks
  return tasks.filter((t) => t.title.includes(searchQuery) || t.notes.includes(searchQuery))
}

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
    result = result.filter((t) => t.title.includes(searchQuery) || t.notes.includes(searchQuery))
  }

  return result
}

export { matchesQuickFilter, applyQuickFilters, applyTopicFilters, applySearch, applyAllFilters }
