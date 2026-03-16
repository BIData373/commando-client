import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/new-workspace')({ component: NewWorkspace })

function NewWorkspace() {
  return <div>NewWorkspace</div>
}
