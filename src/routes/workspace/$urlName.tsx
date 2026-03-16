import { Outlet, createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/workspace/$urlName')({ component: WorkspaceLayout })

function WorkspaceLayout() {
  return <Outlet />
}
