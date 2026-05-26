import type { QuickFilter } from '#/utils/filterUtils'
import type { DirectiveStatus } from '#/utils/statusUtils'
import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import { DEFAULT_COLUMN_ORDER } from '../components/Tasks/ColumnVisibilityDropdown'
import { INITIAL_TASKS, type Task } from '../data/Tasks'
import { applyAllFilters } from '../functions/filter-utils'
import type { TaskColumn } from '../hooks/useTaskColumns'

export type NewTaskInput = Omit<Task, 'id' | 'createdAt' | 'updatedAt'> & { groupKey?: string }

interface TasksContextValue {
  tasks: Task[]
  addTasks: (inputs: NewTaskInput[]) => void
  updateTaskStatus: (taskId: number, status: DirectiveStatus) => void
  removeTasks: (taskIds: number[]) => void
  bulkUpdateStatus: (taskIds: number[], status: DirectiveStatus) => void
  searchQuery: string
  setSearchQuery: (query: string) => void
  activeQuickFilters: Set<QuickFilter>
  toggleQuickFilter: (filter: QuickFilter) => void
  clearQuickFilters: () => void
  columnOrder: TaskColumn[]
  setColumnOrder: (order: TaskColumn[]) => void
  hiddenColumns: Set<TaskColumn>
  toggleColumn: (columnId: TaskColumn) => void
  filteredTasks: Task[]
}

const WORKSPACE_DEFAULT_HIDDEN = new Set<TaskColumn>(['notes', 'updatedAt'] as TaskColumn[])

const TasksContext = createContext<TasksContextValue | null>(null)

interface TasksProviderProps {
  initialTasks?: Task[]
  defaultColumnOrder?: TaskColumn[]
  defaultHiddenColumns?: Set<TaskColumn>
  children: ReactNode
}

export function TasksProvider({
  initialTasks = INITIAL_TASKS,
  defaultColumnOrder = DEFAULT_COLUMN_ORDER,
  defaultHiddenColumns = WORKSPACE_DEFAULT_HIDDEN,
  children,
}: TasksProviderProps) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeQuickFilters, setActiveQuickFilters] = useState<Set<QuickFilter>>(new Set())
  const [columnOrder, setColumnOrder] = useState<TaskColumn[]>(['id' as TaskColumn, ...defaultColumnOrder])
  const [hiddenColumns, setHiddenColumns] = useState<Set<TaskColumn>>(defaultHiddenColumns)

  function toggleColumn(columnId: TaskColumn) {
    setHiddenColumns((prev) => {
      const next = new Set(prev)
      if (next.has(columnId)) {
        next.delete(columnId)
      } else {
        next.add(columnId)
      }
      return next
    })
  }

  function toggleQuickFilter(filter: QuickFilter) {
    setActiveQuickFilters((prev) => {
      const next = new Set(prev)
      if (next.has(filter)) {
        next.delete(filter)
      } else {
        next.add(filter)
      }
      return next
    })
  }

  function clearQuickFilters() {
    setActiveQuickFilters(new Set())
  }

  const filteredTasks = useMemo(
    () => applyAllFilters(tasks, activeQuickFilters, new Set(), searchQuery),
    [tasks, searchQuery, activeQuickFilters],
  )

  function addTasks(inputs: NewTaskInput[]) {
    if (inputs.length === 0) return
    setTasks((prev) => {
      let nextId = prev.reduce((max, t) => (t.id > max ? t.id : max), 0)
      const groupIds = new Map<string, number>()
      const now = new Date()
      const newTasks: Task[] = inputs.map(({ groupKey, ...input }) => {
        let id: number
        if (groupKey) {
          const existing = groupIds.get(groupKey)
          if (existing) {
            id = existing
          } else {
            id = ++nextId
            groupIds.set(groupKey, id)
          }
        } else {
          id = ++nextId
        }
        return { ...input, id, createdAt: now, updatedAt: now }
      })
      return [...newTasks, ...prev]
    })
  }

  function updateTaskStatus(taskId: number, status: DirectiveStatus) {
    setTasks((prev) => {
      const target = prev.find((t) => t.id === taskId)
      if (!target) return prev
      const responsibleId = target.responsible?.id
      return prev.map((t) => {
        if (t.id === taskId) return { ...t, status, updatedAt: new Date() }
        if (responsibleId == null) return t
        const hasRelated = t.relatedDirectives.some((d) => d.user.id === responsibleId)
        if (!hasRelated) return t
        return {
          ...t,
          relatedDirectives: t.relatedDirectives.map((d) =>
            d.user.id === responsibleId ? { ...d, status } : d,
          ),
        }
      })
    })
  }

  function removeTasks(taskIds: number[]) {
    setTasks((prev) => prev.filter((t) => !taskIds.includes(t.id)))
  }

  function bulkUpdateStatus(taskIds: number[], status: DirectiveStatus) {
    setTasks((prev) => {
      const updatedResponsibleIds = new Set(
        prev.filter((t) => taskIds.includes(t.id) && t.responsible).map((t) => t.responsible!.id),
      )
      return prev.map((t) => {
        const isTarget = taskIds.includes(t.id)
        const updatedRelated = t.relatedDirectives.some((d) => updatedResponsibleIds.has(d.user.id))
        if (!isTarget && !updatedRelated) return t
        return {
          ...t,
          ...(isTarget ? { status, updatedAt: new Date() } : {}),
          relatedDirectives: updatedRelated
            ? t.relatedDirectives.map((d) =>
              updatedResponsibleIds.has(d.user.id) ? { ...d, status } : d,
            )
            : t.relatedDirectives,
        }
      })
    })
  }

  return (
    <TasksContext.Provider value={{
      tasks, addTasks, updateTaskStatus, removeTasks, bulkUpdateStatus,
      searchQuery, setSearchQuery,
      activeQuickFilters, toggleQuickFilter, clearQuickFilters,
      columnOrder, setColumnOrder,
      hiddenColumns, toggleColumn,
      filteredTasks,
    }}>
      {children}
    </TasksContext.Provider>
  )
}

export function useTasks() {
  const ctx = useContext(TasksContext)
  if (!ctx) throw new Error('useTasks must be used within a TasksProvider')
  return ctx
}
