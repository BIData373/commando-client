import { WorkspaceProvider } from '#/providers/WorkspaceProvider'
import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/workspace/$urlName')({
  component: RouteComponent,
  staticData: {
    header: {
      user: true,
      navigation: true,
      workspace: true,
    },
  },
})

function RouteComponent() {
  return (
    <WorkspaceProvider>
      <Outlet />
    </WorkspaceProvider>
  )
}
