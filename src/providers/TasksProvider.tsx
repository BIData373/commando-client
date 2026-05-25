import { createContext, useContext, useState, type ReactNode } from 'react'
import type { DirectiveStatus } from '../components/shared/StatusTag'
import { INITIAL_TASKS, type Task } from '../data/Tasks'

export type NewTaskInput = Omit<Task, 'id' | 'createdAt' | 'updatedAt'> & { groupKey?: string }

interface TasksContextValue {
  tasks: Task[]
  addTasks: (inputs: NewTaskInput[]) => void
  updateTaskStatus: (taskId: number, status: DirectiveStatus) => void
  updateDirectiveStatus: (taskId: number, assigneeId: number, status: DirectiveStatus) => void
  removeTasks: (taskIds: number[]) => void
  bulkUpdateStatus: (taskIds: number[], status: DirectiveStatus) => void
}

const TasksContext = createContext<TasksContextValue | null>(null)

interface TasksProviderProps {
  children: ReactNode
}

export function TasksProvider({ children }: TasksProviderProps) {
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS)

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

  function updateDirectiveStatus(taskId: number, assigneeId: number, status: DirectiveStatus) {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== taskId) return t
        return {
          ...t,
          relatedDirectives: t.relatedDirectives.map((d) =>
            d.user.id === assigneeId ? { ...d, status } : d,
          ),
        }
      }),
    )
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
    <TasksContext.Provider value={{ tasks, addTasks, updateTaskStatus, updateDirectiveStatus, removeTasks, bulkUpdateStatus }}>
      {children}
    </TasksContext.Provider>
  )
}

export function useTasks() {
  const ctx = useContext(TasksContext)
  if (!ctx) throw new Error('useTasks must be used within a TasksProvider')
  return ctx
}
