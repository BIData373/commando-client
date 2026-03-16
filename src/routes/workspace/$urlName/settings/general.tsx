import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/workspace/$urlName/settings/general')({ component: SettingsGeneral })

function SettingsGeneral() {
  return <div>SettingsGeneral</div>
}
