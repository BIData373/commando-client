import { createFileRoute } from '@tanstack/react-router'
import PersonalTasksLayout from '../components/Personal/PersonalTasksLayout'
import type { View } from '../components/Tasks/TasksLayout'

export const Route = createFileRoute('/personal')({
  component: PersonalPage,
  validateSearch: (search: Record<string, unknown>): { view: View } => ({
    view: search.view === 'CARDS' ? 'CARDS' : 'TABLE',
  }),
  staticData: {
    header: {
      title: 'הנחיות שקיבלתי',
      navigation: false,
      user: true
    }
  }
})

function PersonalPage() {
  const { view } = Route.useSearch()

  return <PersonalTasksLayout view={view} urlName="" />
}
