import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/workspace/$urlName/tasks/$taskId')({ component: TaskDetail })

function TaskDetail() {
  return <div>TaskDetail</div>
}
