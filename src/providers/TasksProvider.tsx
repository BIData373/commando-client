import { createContext, useContext, useState, type ReactNode } from 'react'
import type { DirectiveStatus } from '../components/Tasks/StatusCell'
import { INITIAL_TASKS, type Task } from '../data/Tasks'

type NewTaskInput = Omit<Task, 'id' | 'serialNumber' | 'createdAt' | 'updatedAt'> & { groupKey?: string }

interface TasksContextValue {
  tasks: Task[]
  addTasks: (inputs: NewTaskInput[]) => void
  updateTaskStatus: (taskId: number, status: DirectiveStatus) => void
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
      const baseId = prev.reduce((max, t) => (t.id > max ? t.id : max), 0)
      const baseSerial = prev.reduce((max, t) => (t.serialNumber > max ? t.serialNumber : max), 0)
      let nextSerial = baseSerial
      const groupSerials = new Map<string, number>()
      const now = new Date()
      const newTasks: Task[] = inputs.map(({ groupKey, ...input }, index) => {
        let serial: number
        if (groupKey) {
          const existing = groupSerials.get(groupKey)
          if (existing) {
            serial = existing
          } else {
            serial = ++nextSerial
            groupSerials.set(groupKey, serial)
          }
        } else {
          serial = ++nextSerial
        }
        return {
          ...input,
          id: baseId + index + 1,
          serialNumber: serial,
          createdAt: now,
          updatedAt: now,
        }
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
    <TasksContext.Provider value={{ tasks, addTasks, updateTaskStatus, removeTasks, bulkUpdateStatus }}>
      {children}
    </TasksContext.Provider>
  )
}

export function useTasks() {
  const ctx = useContext(TasksContext)
  if (!ctx) throw new Error('useTasks must be used within a TasksProvider')
  return ctx
}
