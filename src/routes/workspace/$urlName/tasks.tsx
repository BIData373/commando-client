import { createFileRoute } from '@tanstack/react-router'
import type { QuickFilter } from '#/components/Tasks/TaskFilters'
import TasksLayout, { type View } from '../../../components/Tasks/TasksLayout'
import { TasksProvider } from '../../../providers/TasksProvider'

export const Route = createFileRoute('/workspace/$urlName/tasks')({
  component: TasksPage,
  validateSearch: (search: Record<string, unknown>): { view: View, filter?: QuickFilter } => {
    const quickFilterList: QuickFilter[] = ['overdue', 'approaching', 'flagged']
    return {
      view: search.view === 'CARDS' ? 'CARDS' : 'TABLE',
      filter: quickFilterList.find(v => v === search.filter)
    }
  },
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
  const { view, filter } = Route.useSearch()
  const { urlName } = Route.useParams()

  return (
    <TasksProvider>
      <TasksLayout view={view} urlName={urlName} filter={filter} />
    </TasksProvider>
  )
}