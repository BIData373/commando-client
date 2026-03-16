import { createFileRoute } from '@tanstack/react-router'

type View = 'TABLE' | 'CARDS'

export const Route = createFileRoute('/workspace/$urlName/tasks/')({
  validateSearch: (search: Record<string, unknown>): { view: View } => ({
    view: search.view === 'CARDS' ? 'CARDS' : 'TABLE',
  }),
  component: () => null,
})
