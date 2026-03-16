import { Outlet, createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/workspace/$urlName/settings')({
  component: SettingsLayout,
  staticData: {
    header: {
      title: 'הגדרות לשכה',
      user: true,
      navigation: true,
      workspace: true,
    },
  },
})

function SettingsLayout() {
  return <Outlet />
}
