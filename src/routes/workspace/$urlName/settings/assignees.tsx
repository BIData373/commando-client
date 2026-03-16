import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/workspace/$urlName/settings/assignees')({ component: SettingsAssignees })

function SettingsAssignees() {
  return <div>SettingsAssignees</div>
}
