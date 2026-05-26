import { createFileRoute } from '@tanstack/react-router'
import { QuickFilter } from '#/utils/filterUtils'
import { DirectiveStatus } from '#/utils/statusUtils'
import TasksLayout, { type View } from '../../../components/Tasks/TasksLayout'
import { TasksProvider } from '../../../providers/TasksProvider'

export const Route = createFileRoute('/workspace/$urlName/tasks')({
  component: TasksPage,
  validateSearch: (search: Record<string, unknown>): { view: View; tabFilter?: QuickFilter; statusFilter?: DirectiveStatus } => ({
    view: search.view === 'CARDS' ? 'CARDS' : 'TABLE',
    tabFilter: Object.values(QuickFilter).find((v) => v === search.tabFilter),
    statusFilter: Object.values(DirectiveStatus).find((v) => v === search.statusFilter),
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
  const { view, tabFilter, statusFilter } = Route.useSearch()
  const { urlName } = Route.useParams()

  return (
    <TasksProvider>
      <TasksLayout view={view} urlName={urlName} tabFilter={tabFilter} statusFilter={statusFilter} />
    </TasksProvider>
  )
}