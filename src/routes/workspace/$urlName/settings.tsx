import { Outlet, createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/workspace/$urlName/settings')({ component: SettingsLayout })

function SettingsLayout() {
  return <Outlet />
}
