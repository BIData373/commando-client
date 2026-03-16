import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/workspace/$urlName/settings/permissions')({ component: SettingsPermissions })

function SettingsPermissions() {
  return <div>SettingsPermissions</div>
}
