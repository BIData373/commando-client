import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: RouteComponent,
  staticData: {
    // header: { navigation: false, user: false },
  },
})

function RouteComponent() {
  return <div>Hello ""!</div>
}
