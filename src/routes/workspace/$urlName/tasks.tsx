import { Outlet, createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/workspace/$urlName/tasks')({ component: TasksLayout })

function TasksLayout() {
  return (
    <>
      <div>Tasks</div>
      <Outlet />
    </>
  )
}
