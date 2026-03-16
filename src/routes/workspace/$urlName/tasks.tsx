import { Outlet, createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/workspace/$urlName/tasks')({
  component: TasksLayout,
  staticData: {
    header: {
      title: 'הנחיות',
      user: true,
      navigation: true,
      workspace: true,
    },
  },
})

function TasksLayout() {
  return (
    <>
      <div>Tasks</div>
      <Outlet />
    </>
  )
}
