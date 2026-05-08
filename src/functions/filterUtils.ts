import { differenceInDays, format, startOfToday } from 'date-fns'
import type { Task } from '../data/Tasks'
import type { QuickFilter } from '../components/Tasks/TaskFilters'
import { STATUS_LABELS, type DirectiveStatus } from '../components/shared/StatusTag'

// ─── Shared Types ────────────────────────────────────────────────────────────

export type DeadlineType = 'date' | 'immediate' | 'ongoing'

export const DEADLINE_LABELS: Record<DeadlineType, string> = {
  date: 'תאריך',
  immediate: 'מיידי',
  ongoing: 'שוטף',
}

export type SortDirection = 'asc' | 'desc'

export interface ColumnSort {
  columnId: string
  direction: SortDirection
}

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
  return tasks.filter((t) => t.title.includes(searchQuery) || t.details?.includes(searchQuery) || t.notes.includes(searchQuery))
}

// ─── Column Filters ──────────────────────────────────────────────────────────

function getTaskColumnValue(task: Task, columnId: string): string | string[] {
  switch (columnId) {
    case 'status':
      return task.status
    case 'responsible':
      return task.responsible?.name ?? 'ללא אחראי'
    case 'deadlineType':
      return task.deadlineType
    case 'discussionName':
      return task.discussionName
    case 'createdAt':
      return format(task.createdAt, 'dd/MM/yy')
    case 'updatedAt':
      return format(task.updatedAt, 'dd/MM/yy')
    case 'tags':
      return task.tags
    default:
      return ''
  }
}

function applyColumnFilters(tasks: Task[], columnFilters: Record<string, Set<string>>): Task[] {
  const activeFilters = Object.entries(columnFilters).filter(([, values]) => values.size > 0)
  if (activeFilters.length === 0) return tasks

  return tasks.filter((task) =>
    activeFilters.every(([columnId, values]) => {
      const taskValue = getTaskColumnValue(task, columnId)
      if (Array.isArray(taskValue)) {
        return taskValue.some((v) => values.has(v))
      }
      return values.has(taskValue)
    }),
  )
}

// ─── Column Sort ─────────────────────────────────────────────────────────────

const STATUS_SORT_ORDER: Record<DirectiveStatus, number> = {
  not_started: 0,
  in_progress: 1,
  completed: 2,
}

function applyColumnSort(tasks: Task[], sort: ColumnSort | null): Task[] {
  if (!sort) return tasks

  const { columnId, direction } = sort
  const sorted = [...tasks].sort((a, b) => {
    let cmp = 0
    switch (columnId) {
      case 'id':
        cmp = a.id - b.id
        break
      case 'status':
        cmp = (STATUS_SORT_ORDER[a.status] ?? 0) - (STATUS_SORT_ORDER[b.status] ?? 0)
        break
      case 'responsible':
        cmp = (a.responsible?.name ?? '').localeCompare(b.responsible?.name ?? '', 'he')
        break
      case 'deadlineType': {
        const dateA = a.dueDate?.getTime() ?? Infinity
        const dateB = b.dueDate?.getTime() ?? Infinity
        cmp = dateA - dateB
        break
      }
      case 'discussionName':
        cmp = a.discussionName.localeCompare(b.discussionName, 'he')
        break
      case 'createdAt':
        cmp = a.createdAt.getTime() - b.createdAt.getTime()
        break
      case 'updatedAt':
        cmp = a.updatedAt.getTime() - b.updatedAt.getTime()
        break
    }
    return direction === 'desc' ? -cmp : cmp
  })
  return sorted
}

// ─── Build Filter Options ────────────────────────────────────────────────────

function buildFilterOptionsMap(tasks: Task[]): Record<string, FilterOption[]> {
  const unique = <T>(arr: T[]): T[] => [...new Set(arr)]

  return {
    status: unique(tasks.map((t) => t.status)).map((v) => ({ value: v, label: STATUS_LABELS[v] })),
    responsible: unique(tasks.map((t) => t.responsible?.name ?? 'ללא אחראי')).map((v) => ({ value: v, label: v })),
    deadlineType: unique(tasks.map((t) => t.deadlineType)).map((v) => ({ value: v, label: DEADLINE_LABELS[v as DeadlineType] })),
    discussionName: unique(tasks.map((t) => t.discussionName)).filter(Boolean).map((v) => ({ value: v, label: v })),
    createdAt: unique(tasks.map((t) => format(t.createdAt, 'dd/MM/yy'))).map((v) => ({ value: v, label: v })),
    updatedAt: unique(tasks.map((t) => format(t.updatedAt, 'dd/MM/yy'))).map((v) => ({ value: v, label: v })),
    tags: unique(tasks.flatMap((t) => t.tags)).map((v) => ({ value: v, label: v })),
  }
}

// ─── Combined ────────────────────────────────────────────────────────────────

function applyAllFilters(
  tasks: Task[],
  activeQuickFilters: Set<QuickFilter>,
  activeTopicFilters: Set<string>,
  searchQuery: string,
  columnFilters: Record<string, Set<string>> = {},
  columnSort: ColumnSort | null = null,
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

  result = applyColumnFilters(result, columnFilters)

  if (searchQuery) {
    result = result.filter((t) => t.title.includes(searchQuery) || t.details?.includes(searchQuery) || t.notes.includes(searchQuery))
  }

  result = applyColumnSort(result, columnSort)

  return result
}

export {
  matchesQuickFilter,
  applyQuickFilters,
  applyTopicFilters,
  applySearch,
  applyColumnFilters,
  applyColumnSort,
  buildFilterOptionsMap,
  applyAllFilters,
}
