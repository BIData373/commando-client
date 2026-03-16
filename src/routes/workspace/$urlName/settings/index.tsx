import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/workspace/$urlName/settings/')({
  beforeLoad: ({ params }) => {
    throw redirect({ to: '/workspace/$urlName/settings/general', params })
  },
})
