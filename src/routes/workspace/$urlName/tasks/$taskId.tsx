import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react'
import type { View } from '../../../../components/Tasks/TasksLayout'
import CreateTaskModal from '../../../../components/CreateTasks/CreateTaskModal'
import { useTasks } from '../../../../providers/TasksProvider'

interface TaskDetailSearch {
  view: View
}

export const Route = createFileRoute('/workspace/$urlName/tasks/$taskId')({
  component: TaskDetail,
  validateSearch: (search: Record<string, unknown>): TaskDetailSearch => ({
    view: search.view === 'CARDS' ? 'CARDS' : 'TABLE',
  }),
})

function TaskDetail() {
  const { urlName, taskId } = Route.useParams()
  const { view } = Route.useSearch()
  const { tasks } = useTasks()
  const navigate = useNavigate()

  const task = tasks.find((t) => t.id === Number(taskId))

  function handleClose() {
    navigate({ to: '/workspace/$urlName/tasks', params: { urlName }, search: { view } })
  }

  useEffect(() => {
    if (!task) {
      handleClose()
    }
  }, [task])

  if (!task) return null

  return <CreateTaskModal task={task} onClose={handleClose} />
}
