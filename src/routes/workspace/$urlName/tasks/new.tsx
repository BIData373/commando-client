import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/workspace/$urlName/tasks/new')({ component: NewTask })

function NewTask() {
  return <div>NewTask</div>
}
