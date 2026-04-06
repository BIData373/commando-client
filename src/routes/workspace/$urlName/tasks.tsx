import { createFileRoute } from '@tanstack/react-router'
import TasksLayout, { type View } from '../../../components/Tasks/TasksLayout'

export const Route = createFileRoute('/workspace/$urlName/tasks')({
  component: TasksPage,
  validateSearch: (search: Record<string, unknown>): { view: View } => ({
    view: search.view === 'CARDS' ? 'CARDS' : 'TABLE',
  }),
  staticData: {
    header: {
      title: 'הנחיות',
      user: true,
      navigation: true,
      workspace: true,
    },
  },
})

function TasksPage() {
  const { view } = Route.useSearch()
  const { urlName } = Route.useParams()

  return <TasksLayout view={view} urlName={urlName} />
}
