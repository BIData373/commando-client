import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/workspace/$urlName/dashboard')({ component: Dashboard })

function Dashboard() {
  return <div>Dashboard</div>
}
