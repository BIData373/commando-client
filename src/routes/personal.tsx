import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/personal')({ component: Personal })

function Personal() {
  return <div>Personal</div>
}
