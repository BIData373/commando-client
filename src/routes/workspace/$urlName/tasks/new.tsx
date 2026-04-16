import { createFileRoute, useNavigate } from '@tanstack/react-router'
import type { View } from '../../../../components/Tasks/TasksLayout'
import CreateDirectiveModal from '../../../../components/CreateTasks/CreateTaskModal'

export const Route = createFileRoute('/workspace/$urlName/tasks/new')({
  component: NewTask,
  validateSearch: (search: Record<string, unknown>): { view: View } => ({
    view: search.view === 'CARDS' ? 'CARDS' : 'TABLE',
  }),
})

function NewTask() {
  const { urlName } = Route.useParams()
  const { view } = Route.useSearch()
  const navigate = useNavigate()

  function handleClose() {
    navigate({ to: '/workspace/$urlName/tasks', params: { urlName }, search: { view } })
  }

  return <CreateDirectiveModal onClose={handleClose} />
}
