import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: RouteComponent,
  staticData: {
    header: {
      title: 'סביבות',
      navigation: false,
      user: false
    },
  },
})

function RouteComponent() {
  return <div>Spaces and Personal Area</div>
}
