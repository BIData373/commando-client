import { createFileRoute, useNavigate, useSearch } from '@tanstack/react-router'
import TaskDetailPanel from '../../../../components/TaskDetail/TaskDetailPanel'
import { useTasks } from '../../../../providers/TasksProvider'

export const Route = createFileRoute('/workspace/$urlName/tasks/$taskId')({ component: TaskDetail })

function TaskDetail() {
  const { urlName, taskId } = Route.useParams()
  const { view } = useSearch({ from: '/workspace/$urlName/tasks' })
  const navigate = useNavigate()
  const { tasks, removeTasks } = useTasks()

  const task = tasks.find((t) => String(t.id) === taskId)

  function handleClose() {
    navigate({ to: '/workspace/$urlName/tasks', params: { urlName }, search: { view } })
  }

  function handleArchive() {
    if (task) {
      removeTasks([task.id])
    }
    handleClose()
  }

  function handleDelete() {
    if (task) {
      removeTasks([task.id])
    }
    handleClose()
  }

  return !!task && <TaskDetailPanel task={task} onClose={handleClose} onArchive={handleArchive} onDelete={handleDelete} />
}
